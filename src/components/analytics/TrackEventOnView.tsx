"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsProperties } from "@/lib/analytics/client";

export default function TrackEventOnView({
  eventName,
  properties = {},
  vehicleSlug,
}: {
  eventName: string;
  properties?: AnalyticsProperties;
  vehicleSlug?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackEvent(eventName, properties, { vehicleSlug });
  }, [eventName, properties, vehicleSlug]);

  return null;
}
