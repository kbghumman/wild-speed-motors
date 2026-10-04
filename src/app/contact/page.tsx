import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import TrackEventOnView from "@/components/analytics/TrackEventOnView";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { getPublicCarBySlug } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string; intent?: string }>;
}) {
  const params = await searchParams;
  const vehicleSlug = params.vehicle?.trim() || "";
  const intent = params.intent?.trim() || "general";
  const requestedCar = params.request?.trim().slice(0, 500) || "";
  const car = vehicleSlug ? await getPublicCarBySlug(vehicleSlug) : null;
  const vehicleLabel = car
    ? car.year + " " + car.make + " " + car.model + (car.trim ? " " + car.trim : "")
    : "";

  return (
    <>
      <Header />
      {vehicleSlug && (
        <TrackEventOnView
          eventName="contact_page_view"
          vehicleSlug={vehicleSlug}
          properties={{
            intent,
            make: car?.make ?? "",
            model: car?.model ?? "",
          }}
        />
      )}
      <main>
        <section className="editorial-hero contact-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">Contact</p>
              <h1>Talk to a real person <span>about the right car.</span></h1>
              {car ? (
                <p>
                  You are asking about the {vehicleLabel}. Send the request below and it will enter
                  the dealer lead queue attached to this exact vehicle.
                </p>
              ) : (
                <p>Ask about stock, test drives, trade-ins or finance. Your enquiry enters the dealer CRM so it can be followed through to an outcome.</p>
              )}
            </div>
            <div className="hero-graphic contact-radar">
              <span className="radar-ring radar-one" />
              <span className="radar-ring radar-two" />
              <span className="radar-ring radar-three" />
              <MapPin size={38} />
            </div>
          </div>
        </section>

        <section className="section lead-capture-section">
          <div className="container lead-capture-layout">
            <div className="lead-capture-context">
              <span className="v3-mono">DIRECT TO THE DEALER</span>
              <h2>One enquiry. One accountable lead.</h2>
              <p>
                We keep the selected vehicle, request type and anonymous shopping journey together so
                the sales team can respond with context instead of asking you to start again.
              </p>
              <div className="lead-capture-points">
                <span>Vehicle attached automatically</span>
                <span>Test-drive / finance intent preserved</span>
                <span>Reference number after submission</span>
              </div>
            </div>

            <LeadCaptureForm
              vehicleSlug={vehicleSlug}
              vehicleLabel={vehicleLabel}
              intent={intent}
            />
          </div>
        </section>

        <section className="section contact-options-section">
          <div className="container contact-options-grid">
            <article className="contact-option contact-phone"><Phone size={28} /><span>Call</span><strong>Showroom number coming soon</strong></article>
            <article className="contact-option contact-email"><Mail size={28} /><span>Email</span><strong>Sales email coming soon</strong></article>
            <article className="contact-option contact-chat"><MessageCircle size={28} /><span>Message</span><strong>Online lead form is live above</strong></article>
            <article className="contact-option contact-hours"><Clock3 size={28} /><span>Hours</span><strong>Opening hours to be confirmed</strong></article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
