import Link from "next/link";
import { ArrowRight, Camera, CarFront, ClipboardCheck, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import TrackEventOnView from "@/components/analytics/TrackEventOnView";

export const dynamic = "force-dynamic";

export default async function SellPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string }>;
}) {
  const params = await searchParams;
  const vehicleSlug = params.vehicle?.trim() || "";

  return (
    <>
      <Header />
      {vehicleSlug && (
        <TrackEventOnView
          eventName="trade_in_page_view"
          vehicleSlug={vehicleSlug}
          properties={{ source: "vehicle_detail" }}
        />
      )}
      <main>
        <section className="editorial-hero sell-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">Sell or trade</p>
              <h1>Your current car <span>can move you forward.</span></h1>
              <p>Start a valuation, discuss a trade-in, or use your current vehicle toward your next purchase.</p>
              <Link href={vehicleSlug ? "/contact?vehicle=" + encodeURIComponent(vehicleSlug) + "&intent=trade-in" : "/contact"} className="button-primary">Start a valuation <ArrowRight size={17} /></Link>
            </div>
            <div className="hero-graphic sell-graphic">
              <CarFront size={64} />
              <span className="sell-arrow"><RefreshCcw size={30} /></span>
              <span className="sell-value">$</span>
            </div>
          </div>
        </section>

        <section className="section sell-process-section">
          <div className="container">
            <p className="eyebrow">What we need</p>
            <h2 className="section-title">A few details. A much clearer valuation.</h2>
            <div className="sell-step-grid">
              <article className="sell-step-card sell-step-sand">
                <ClipboardCheck size={28} />
                <strong>Vehicle details</strong>
                <p>Make, model, year, mileage, grade and any important specification.</p>
              </article>
              <article className="sell-step-card sell-step-pink">
                <Camera size={28} />
                <strong>Photos & condition</strong>
                <p>Exterior, interior and honest notes about damage or mechanical issues.</p>
              </article>
              <article className="sell-step-card sell-step-green">
                <RefreshCcw size={28} />
                <strong>Sell or trade</strong>
                <p>Choose a direct sale or discuss using the vehicle toward another car.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
