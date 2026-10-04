"use client";

import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import { getAnalyticsContext, trackEvent } from "@/lib/analytics/client";

const intentCopy: Record<string, { eyebrow: string; title: string; button: string; placeholder: string }> = {
  "general": {
    eyebrow: "GENERAL ENQUIRY",
    title: "Tell us what you need.",
    button: "Send enquiry",
    placeholder: "What can we help you with?",
  },
  "enquiry": {
    eyebrow: "VEHICLE ENQUIRY",
    title: "Ask about this vehicle.",
    button: "Send vehicle enquiry",
    placeholder: "Availability, condition, documents, specifications — ask us anything about this car.",
  },
  "test-drive": {
    eyebrow: "TEST DRIVE",
    title: "Request a test drive.",
    button: "Request test drive",
    placeholder: "Tell us when you would ideally like to see and drive the car.",
  },
  "finance": {
    eyebrow: "FINANCE QUESTION",
    title: "Ask about finance for this vehicle.",
    button: "Send finance enquiry",
    placeholder: "Tell us what you would like to know about available finance routes.",
  },
  "trade-in": {
    eyebrow: "TRADE-IN",
    title: "Discuss your current vehicle.",
    button: "Start trade-in enquiry",
    placeholder: "Tell us the make, model, year, mileage and condition of the vehicle you may trade.",
  },
};

export default function LeadCaptureForm({
  vehicleSlug = "",
  vehicleLabel = "",
  intent = "general",
  initialMessage = "",
}: {
  vehicleSlug?: string;
  vehicleLabel?: string;
  intent?: string;
  initialMessage?: string;
}) {
  const copy = intentCopy[intent] ?? intentCopy.general;
  const [sending, setSending] = useState(false);
  const [successNumber, setSuccessNumber] = useState<number | null>(null);
  const [error, setError] = useState("");
  const started = useRef(false);

  const defaultMessage = useMemo(() => {
    if (initialMessage) return initialMessage;
    if (!vehicleLabel) return "";
    if (intent === "test-drive") return "I would like to arrange a test drive for " + vehicleLabel + ".";
    if (intent === "finance") return "I would like to ask about finance options for " + vehicleLabel + ".";
    if (intent === "trade-in") return "I am interested in " + vehicleLabel + " and would like to discuss a trade-in.";
    return "I am interested in " + vehicleLabel + ".";
  }, [initialMessage, intent, vehicleLabel]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackEvent(
      "lead_form_started",
      { intent, vehicle: vehicleLabel || null },
      { vehicleSlug: vehicleSlug || undefined },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (!email && !phone) {
      setError("Please provide an email address, phone number, or both.");
      return;
    }

    const context = getAnalyticsContext();
    setSending(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_name: String(data.get("customer_name") || "").trim(),
          email,
          phone,
          preferred_contact: String(data.get("preferred_contact") || "either"),
          message: String(data.get("message") || "").trim(),
          website: String(data.get("website") || ""),
          intent,
          vehicle_slug: vehicleSlug || null,
          ...context,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "We could not send your enquiry. Please try again.",
        );
      }

      const leadNumber = Number(result.lead_number || 0);
      setSuccessNumber(leadNumber || null);
      trackEvent(
        "lead_form_success",
        { intent, lead_number: leadNumber || null },
        { vehicleSlug: vehicleSlug || undefined },
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your enquiry. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (successNumber !== null) {
    return (
      <div className="lead-form-success" role="status">
        <CheckCircle2 size={34} />
        <span className="v3-mono">ENQUIRY RECEIVED</span>
        <h2>You're in the dealer queue.</h2>
        <p>
          Your reference is <strong>WSM-{String(successNumber).padStart(5, "0")}</strong>.
          The enquiry is attached to the vehicle and customer journey that generated it.
        </p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit} onFocus={markStarted}>
      <div className="lead-form-heading">
        <span className="v3-mono">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        {vehicleLabel && <p>Vehicle: <strong>{vehicleLabel}</strong></p>}
      </div>

      <div className="lead-form-grid">
        <label className="lead-field lead-field-wide">
          <span>Your name *</span>
          <input
            name="customer_name"
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
            placeholder="Full name"
          />
        </label>

        <label className="lead-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>

        <label className="lead-field">
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="+81..."
          />
        </label>

        <label className="lead-field lead-field-wide">
          <span>Preferred contact</span>
          <select name="preferred_contact" defaultValue="either">
            <option value="either">Email or phone</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </label>

        <label className="lead-field lead-field-wide">
          <span>Message</span>
          <textarea
            name="message"
            rows={6}
            maxLength={3000}
            defaultValue={defaultMessage}
            placeholder={copy.placeholder}
          />
        </label>

        <label className="lead-honeypot" aria-hidden="true">
          Company website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && <div className="lead-form-error">{error}</div>}

      <div className="lead-form-footer">
        <div>
          <ShieldCheck size={16} />
          <span>
            Sending this asks Wild Speed Motors to contact you about this request.
            It does not subscribe you to marketing.
          </span>
        </div>

        <button type="submit" disabled={sending}>
          {sending ? <Loader2 size={17} className="lead-spinner" /> : <ArrowRight size={17} />}
          {sending ? "Sending..." : copy.button}
        </button>
      </div>
    </form>
  );
}
