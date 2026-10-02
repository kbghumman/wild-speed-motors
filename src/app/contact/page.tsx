import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import TrackEventOnView from "@/components/analytics/TrackEventOnView";
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
  const car = vehicleSlug ? await getPublicCarBySlug(vehicleSlug) : null;

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
                  You are asking about the {car.year} {car.make} {car.model}{car.trim ? " " + car.trim : ""}.
                  Your vehicle context is kept with this enquiry journey so the team knows which car generated the contact.
                </p>
              ) : (
                <p>Ask about stock, test drives, trade-ins or finance. The final showroom address, phone and email will be inserted before launch.</p>
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

        <section className="section contact-options-section">
          <div className="container contact-options-grid">
            <article className="contact-option contact-phone"><Phone size={28} /><span>Call</span><strong>Showroom number coming soon</strong></article>
            <article className="contact-option contact-email"><Mail size={28} /><span>Email</span><strong>Sales email coming soon</strong></article>
            <article className="contact-option contact-chat"><MessageCircle size={28} /><span>Message</span><strong>Online enquiry flow coming next</strong></article>
            <article className="contact-option contact-hours"><Clock3 size={28} /><span>Hours</span><strong>Opening hours to be confirmed</strong></article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
