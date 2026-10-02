import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const origin = requestHeaders.get("origin");

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;

  try {
    const raw = await request.text();
    if (raw.length > 16000) {
      return NextResponse.json({ error: "Enquiry is too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid enquiry." }, { status: 400 });
  }

  // Quietly accept bot-filled honeypot submissions without writing a lead.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true, lead_number: null });
  }

  const name = clean(body.customer_name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const visitorId = clean(body.visitor_id, 50);
  const sessionId = clean(body.session_id, 50);

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Please provide an email address, phone number, or both." },
      { status: 400 },
    );
  }

  if (!visitorId || !sessionId || !UUID_PATTERN.test(visitorId) || !UUID_PATTERN.test(sessionId)) {
    return NextResponse.json({ error: "Please refresh the page and try again." }, { status: 400 });
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("submit_public_lead", {
    p_customer_name: name,
    p_email: email || null,
    p_phone: phone || null,
    p_preferred_contact: clean(body.preferred_contact, 20) || "either",
    p_message: clean(body.message, 3000) || null,
    p_intent: clean(body.intent, 30) || "general",
    p_vehicle_slug: clean(body.vehicle_slug, 180) || null,
    p_visitor_id: visitorId,
    p_session_id: sessionId,
    p_source_path: clean(body.source_path, 500) || "/contact",
    p_referrer_host: clean(body.referrer_host, 255) || null,
    p_utm_source: clean(body.utm_source, 180) || null,
    p_utm_medium: clean(body.utm_medium, 180) || null,
    p_utm_campaign: clean(body.utm_campaign, 180) || null,
    p_utm_content: clean(body.utm_content, 180) || null,
    p_utm_term: clean(body.utm_term, 180) || null,
    p_country_code: clean(requestHeaders.get("x-vercel-ip-country"), 8) || null,
  });

  if (error) {
    const message = error.message || "";

    if (message.includes("rate_limited")) {
      return NextResponse.json(
        { error: "Too many enquiries were sent in a short time. Please try again later." },
        { status: 429 },
      );
    }

    if (message.includes("invalid_email")) {
      return NextResponse.json({ error: "Please check the email address." }, { status: 400 });
    }

    console.error("Lead submission failed:", message);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please try again." },
      { status: 500 },
    );
  }

  const result = data as { lead_id?: string; lead_number?: number } | null;

  return NextResponse.json({
    ok: true,
    lead_number: result?.lead_number ?? null,
  });
}
