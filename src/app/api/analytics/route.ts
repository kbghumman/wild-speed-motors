import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanString(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) || null : null;
}

function cleanProperties(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const result: Record<string, string | number | boolean | null | Array<string | number>> = {};

  for (const [key, raw] of Object.entries(value as Record<string, unknown>).slice(0, 40)) {
    const safeKey = key.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 60);
    if (!safeKey) continue;

    if (typeof raw === "string") result[safeKey] = raw.slice(0, 500);
    else if (typeof raw === "number" && Number.isFinite(raw)) result[safeKey] = raw;
    else if (typeof raw === "boolean" || raw === null) result[safeKey] = raw;
    else if (Array.isArray(raw)) {
      result[safeKey] = raw
        .slice(0, 20)
        .filter((item): item is string | number => typeof item === "string" || typeof item === "number")
        .map((item) => typeof item === "string" ? item.slice(0, 180) : item);
    }
  }

  return result;
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const origin = requestHeaders.get("origin");

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return new NextResponse(null, { status: 403 });
      }
    } catch {
      return new NextResponse(null, { status: 403 });
    }
  }

  let body: Record<string, unknown>;

  try {
    const raw = await request.text();
    if (raw.length > 20000) return new NextResponse(null, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const visitorId = cleanString(body.visitor_id, 50);
  const sessionId = cleanString(body.session_id, 50);
  const eventName = cleanString(body.event_name, 80);

  if (
    !visitorId ||
    !sessionId ||
    !eventName ||
    !UUID_PATTERN.test(visitorId) ||
    !UUID_PATTERN.test(sessionId) ||
    !/^[a-z0-9_]+$/.test(eventName)
  ) {
    return new NextResponse(null, { status: 400 });
  }

  const supabase = createPublicClient();

  const { error } = await supabase.rpc("record_analytics_event", {
    p_visitor_id: visitorId,
    p_session_id: sessionId,
    p_event_name: eventName,
    p_path: cleanString(body.path, 500) || "/",
    p_vehicle_slug: cleanString(body.vehicle_slug, 180),
    p_properties: cleanProperties(body.properties),
    p_referrer_host: cleanString(body.referrer_host, 255),
    p_utm_source: cleanString(body.utm_source, 180),
    p_utm_medium: cleanString(body.utm_medium, 180),
    p_utm_campaign: cleanString(body.utm_campaign, 180),
    p_utm_content: cleanString(body.utm_content, 180),
    p_utm_term: cleanString(body.utm_term, 180),
    p_device_type: cleanString(body.device_type, 40),
    p_browser: cleanString(body.browser, 80),
    p_os: cleanString(body.os, 80),
    p_language: cleanString(body.language, 40),
    p_viewport_width: typeof body.viewport_width === "number" ? Math.round(body.viewport_width) : null,
    p_viewport_height: typeof body.viewport_height === "number" ? Math.round(body.viewport_height) : null,
    p_country_code: cleanString(requestHeaders.get("x-vercel-ip-country"), 8),
    p_region_code: cleanString(requestHeaders.get("x-vercel-ip-country-region"), 32),
  });

  if (error) {
    console.error("Analytics event failed:", error.message);
    return new NextResponse(null, { status: 204 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
