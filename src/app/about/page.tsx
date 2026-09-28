import { BadgeCheck, MapPin, ScanSearch, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="editorial-hero about-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">About Wild Speed Motors</p>
              <h1>A dealership experience <span>designed around clarity.</span></h1>
              <p>Wild Speed Motors is being built as a modern used-car showroom for customers in Japan, with a strong focus on the U.S. military community and straightforward USD-facing browsing.</p>
            </div>
            <div className="hero-graphic about-graphic">
              <span className="about-grid-line line-a" />
              <span className="about-grid-line line-b" />
              <span className="about-grid-line line-c" />
              <span className="about-grid-badge">WSM</span>
            </div>
          </div>
        </section>

        <section className="section about-values-section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">What matters</p>
                <h2 className="section-title">Less friction. Better information.</h2>
              </div>
            </div>
            <div className="value-grid">
              <article className="value-card value-blue"><ScanSearch size={30} /><h3>Easy discovery</h3><p>Browse by price bay, brand, collection or detailed filters.</p></article>
              <article className="value-card value-gold"><BadgeCheck size={30} /><h3>Clear presentation</h3><p>Vehicle information should be useful, legible and easy to compare.</p></article>
              <article className="value-card value-green"><ShieldCheck size={30} /><h3>Confidence</h3><p>Condition, availability, finance and warranty information should be clearly explained.</p></article>
              <article className="value-card value-rose"><MapPin size={30} /><h3>Built for Japan</h3><p>Japan-market inventory with the buying experience tailored to the intended customer base.</p></article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
