import Link from "next/link";
import { ArrowRight, BadgeDollarSign, FileCheck2, MessageSquareText, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import TrackEventOnView from "@/components/analytics/TrackEventOnView";

export const dynamic = "force-dynamic";

export default async function FinancePage({
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
          eventName="finance_page_view"
          vehicleSlug={vehicleSlug}
          properties={{ source: "vehicle_detail" }}
        />
      )}
      <main>
        <section className="editorial-hero finance-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">Finance</p>
              <h1>Know the path <span>before the paperwork.</span></h1>
              <p>Explore vehicles by monthly budget and speak with us about available financing options. Final approval, terms and eligibility depend on the lender.</p>
              <div className="hero-actions">
                <Link href="/cars" className="button-primary">Browse inventory <ArrowRight size={17} /></Link>
                <Link href={vehicleSlug ? "/contact?vehicle=" + encodeURIComponent(vehicleSlug) + "&intent=finance" : "/contact"} className="button-secondary">Ask a finance question</Link>
              </div>
            </div>
            <div className="hero-graphic finance-meter">
              <span className="meter-ring ring-one" />
              <span className="meter-ring ring-two" />
              <BadgeDollarSign size={56} />
              <strong>USD</strong>
              <small>customer-facing pricing</small>
            </div>
          </div>
        </section>

        <section className="section finance-steps-section">
          <div className="container">
            <p className="eyebrow">Simple process</p>
            <h2 className="section-title">From shortlist to drive-away.</h2>
            <div className="process-grid">
              <article className="process-card process-coral">
                <span className="process-number">01</span>
                <MessageSquareText size={28} />
                <h3>Talk through your budget</h3>
                <p>Start with the car price or the monthly amount you are comfortable with.</p>
              </article>
              <article className="process-card process-violet">
                <span className="process-number">02</span>
                <FileCheck2 size={28} />
                <h3>Review available options</h3>
                <p>We can discuss the finance routes available for the selected vehicle and your circumstances.</p>
              </article>
              <article className="process-card process-teal">
                <span className="process-number">03</span>
                <ShieldCheck size={28} />
                <h3>Confirm before signing</h3>
                <p>Rates, fees, repayment terms and lender requirements should be clear before you commit.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section finance-note-section">
          <div className="container finance-note-card">
            <div>
              <span className="feature-kicker">Important</span>
              <h2>Finance figures on the prototype are illustrative.</h2>
              <p>We will replace demo monthly figures with the actual lender or finance-provider calculation before launch.</p>
            </div>
            <Link href={vehicleSlug ? "/contact?vehicle=" + encodeURIComponent(vehicleSlug) + "&intent=finance" : "/contact"} className="button-dark">Contact us</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
