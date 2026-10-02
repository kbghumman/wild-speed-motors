"use client";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined | Array<string | number>
>;

const VISITOR_KEY = "wsm_analytics_visitor";
const SESSION_KEY = "wsm_analytics_session";
const ATTRIBUTION_KEY = "wsm_analytics_attribution";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function safeStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function newId() {
  return crypto.randomUUID();
}

function getVisitorId() {
  const storage = safeStorage();
  if (!storage) return newId();

  const existing = storage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const id = newId();
  storage.setItem(VISITOR_KEY, id);
  return id;
}

function getSessionId() {
  const storage = safeStorage();
  if (!storage) return newId();

  const now = Date.now();

  try {
    const existing = JSON.parse(storage.getItem(SESSION_KEY) || "null") as
      | { id?: string; last?: number }
      | null;

    if (
      existing?.id &&
      typeof existing.last === "number" &&
      now - existing.last < SESSION_TIMEOUT_MS
    ) {
      storage.setItem(SESSION_KEY, JSON.stringify({ id: existing.id, last: now }));
      return existing.id;
    }
  } catch {
    // Start a fresh anonymous session.
  }

  const id = newId();
  storage.setItem(SESSION_KEY, JSON.stringify({ id, last: now }));
  return id;
}

function getAttribution(sessionId: string) {
  const storage = safeStorage();

  if (storage) {
    try {
      const existing = JSON.parse(storage.getItem(ATTRIBUTION_KEY) || "null") as
        | { session_id?: string; attribution?: Record<string, string | null> }
        | null;
      if (existing?.session_id === sessionId && existing.attribution) {
        return existing.attribution;
      }
    } catch {
      // Recreate below.
    }
  }

  const params = new URLSearchParams(window.location.search);
  let referrerHost = "";

  if (document.referrer) {
    try {
      referrerHost = new URL(document.referrer).hostname;
    } catch {
      referrerHost = "";
    }
  }

  const attribution = {
    referrer_host: referrerHost || null,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };

  if (storage) {
    try {
      storage.setItem(
        ATTRIBUTION_KEY,
        JSON.stringify({ session_id: sessionId, attribution }),
      );
    } catch {
      // Analytics must never break the site.
    }
  }

  return attribution;
}

function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "Safari";
  if (/Firefox\//.test(ua)) return "Firefox";
  return "Other";
}

function getOS() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

export function trackEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
  options: { vehicleSlug?: string; beacon?: boolean } = {},
) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  const sessionId = getSessionId();
  const attribution = getAttribution(sessionId);

  const payload = {
    visitor_id: getVisitorId(),
    session_id: sessionId,
    event_name: eventName,
    path: window.location.pathname,
    vehicle_slug: options.vehicleSlug || null,
    properties,
    ...attribution,
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    language: navigator.language || null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  };

  const body = JSON.stringify(payload);

  try {
    if (options.beacon && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics",
        new Blob([body], { type: "application/json" }),
      );
      return;
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    });
  } catch {
    // Analytics failures must never affect customers.
  }
}


export function getAnalyticsContext() {
  if (typeof window === "undefined") {
    return {
      visitor_id: null,
      session_id: null,
      source_path: "/",
      referrer_host: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    };
  }

  const sessionId = getSessionId();
  const attribution = getAttribution(sessionId);

  return {
    visitor_id: getVisitorId(),
    session_id: sessionId,
    source_path: window.location.pathname,
    ...attribution,
  };
}
