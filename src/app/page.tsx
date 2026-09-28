import Link from "next/link";
import { ArrowRight, BadgeCheck, CarFront, Clock3, DollarSign, MapPin, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import SearchPanel from "@/components/SearchPanel";
import CarCard from "@/components/CarCard";
import PopularBrands from "@/components/PopularBrands";
import BudgetShowroom from "@/components/BudgetShowroom";
import HomeFeatureLinks from "@/components/HomeFeatureLinks";
import { cars } from "@/data/cars";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="hero-pill">
                <span className="hero-pill-dot" />
                Japan inventory • USD pricing
              </div>
              <div className="hero-kicker">Wild Speed Motors Japan</div>
              <h1>Find the right car. <span>Skip the ordinary.</span></h1>
              <p>
                A digital-first used car showroom built for the U.S. military community in Japan —
                curated stock, straightforward USD pricing and a faster way to browse.
              </p>
              <div className="hero-actions">
                <Link href="/cars" className="button-primary hero-primary">
                  Browse inventory <ArrowRight size={17} />
                </Link>
                <Link href="/budget" className="button-glass">Enter virtual showroom</Link>
              </div>

              <div className="hero-meta">
                <span><MapPin size={15} /> Japan-based stock</span>
                <span><DollarSign size={15} /> Prices in USD</span>
                <span><Clock3 size={15} /> Browse 24/7</span>
              </div>
            </div>

            <div className="hero-sidecard">
              <span className="hero-sidecard-label">SHOWROOM MODE</span>
              <strong>Browse the lot your way.</strong>
              <p>Start with budget, then move through brands and curated collections.</p>
              <Link href="/budget">Start with your budget <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="search-wrap">
          <div className="container">
            <SearchPanel />

            <div className="trust-row">
              <div className="trust-item">
                <span className="trust-icon trust-check"><BadgeCheck size={19} /></span>
                <div><strong>Inspected stock</strong><span>Clear vehicle presentation before you visit.</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon trust-shield"><ShieldCheck size={19} /></span>
                <div><strong>Warranty options</strong><span>Available coverage can be explained before purchase.</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon trust-dollar"><DollarSign size={19} /></span>
                <div><strong>USD-first experience</strong><span>Customer-facing prices designed around U.S. buyers.</span></div>
              </div>
              <div className="trust-item">
                <span className="trust-icon trust-car"><CarFront size={19} /></span>
                <div><strong>Trade-in ready</strong><span>Use your current car toward your next one.</span></div>
              </div>
            </div>
          </div>
        </section>

        <PopularBrands />

        <BudgetShowroom />

        <section className="section arrivals-section">
          <div className="container">
            <div className="arrivals-accent">LATEST STOCK</div>
            <div className="section-head">
              <div>
                <p className="eyebrow">Fresh on the lot</p>
                <h2 className="section-title">New arrivals</h2>
                <p className="section-copy">A quick look at the newest vehicles. The full inventory lives on its own page.</p>
              </div>
              <Link href="/cars" className="button-secondary">View all inventory</Link>
            </div>
            <div className="cars-grid">
              {cars.slice(0, 3).map((car) => <CarCard key={car.slug} car={car} />)}
            </div>
          </div>
        </section>

        <HomeFeatureLinks />

        <section className="section homepage-final-cta">
          <div className="container">
            <div className="cta-band cta-band-sunset">
              <div>
                <span className="feature-kicker">Ready when you are</span>
                <h2>See something you like?</h2>
                <p>Ask about availability, a test drive, trade-in or finance before you make the trip.</p>
              </div>
              <Link href="/contact" className="button-dark">Contact Wild Speed Motors</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
