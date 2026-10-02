"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/client";

const depths = [25, 50, 75, 100];

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const pageStartedAt = useRef(Date.now());
  const reachedDepths = useRef(new Set<number>());
  const engagementSent = useRef(false);
  const lastPath = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    pageStartedAt.current = Date.now();
    reachedDepths.current = new Set();
    engagementSent.current = false;

    if (lastPath.current !== pathname) {
      trackEvent("page_view", { title: document.title });
      lastPath.current = pathname;
    }

    function onScroll() {
      const documentHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const percent = Math.min(
        100,
        Math.round((window.scrollY / documentHeight) * 100),
      );

      for (const depth of depths) {
        if (percent >= depth && !reachedDepths.current.has(depth)) {
          reachedDepths.current.add(depth);
          trackEvent("scroll_depth", { depth });
        }
      }
    }

    function sendEngagement() {
      if (engagementSent.current) return;
      const seconds = Math.round((Date.now() - pageStartedAt.current) / 1000);
      if (seconds >= 3) {
        engagementSent.current = true;
        trackEvent(
          "page_engagement",
          {
            seconds,
            max_scroll_depth: Math.max(0, ...Array.from(reachedDepths.current)),
          },
          { beacon: true },
        );
      }
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>("[data-analytics-event], a");
      if (!element) return;

      const explicitEvent = element.dataset.analyticsEvent;
      const vehicleSlug = element.dataset.vehicleSlug || undefined;

      if (explicitEvent) {
        trackEvent(
          explicitEvent,
          {
            label:
              element.dataset.analyticsLabel ||
              element.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) ||
              null,
            value: element.dataset.analyticsValue || null,
          },
          { vehicleSlug },
        );
        return;
      }

      if (element instanceof HTMLAnchorElement) {
        let destination = element.getAttribute("href") || "";
        try {
          if (destination.startsWith("http")) {
            const url = new URL(destination);
            destination = url.origin === window.location.origin
              ? url.pathname
              : url.hostname;
          }
        } catch {
          // Keep raw destination.
        }

        trackEvent("link_click", {
          destination: destination.slice(0, 300),
          label: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || null,
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      window.removeEventListener("pagehide", sendEngagement);
      sendEngagement();
    };
  }, [pathname]);

  return null;
}
