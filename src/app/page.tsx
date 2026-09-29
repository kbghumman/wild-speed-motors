import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleDollarSign, MapPin, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import SearchPanel from "@/components/SearchPanel";
import CarCard from "@/components/CarCard";
import PopularBrands from "@/components/PopularBrands";
import BudgetShowroom from "@/components/BudgetShowroom";
import HomeFeatureLinks from "@/components/HomeFeatureLinks";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cars = await getPublicCars();

  return (
    <>
      <Header />
      <main>
        <section className="v3-hero">
          <div className="container v3-hero-grid">
            <div className="v3-hero-copy">
              <span className="v3-hero-context"><MapPin size={14} />Japan inventory / USD pricing</span>
              <p className="v3-kicker v3-hero-kicker">Wild Speed Motors</p>
              <h1>Your next car<span>in Japan.</span></h1>
              <p className="v3-hero-lede">A faster, clearer showroom for the U.S. military community — organised around how people actually shop: stock, budget, brand and purpose.</p>
              <div className="v3-hero-actions">
                <Link href="/cars" className="v3-primary-action">Browse inventory <ArrowRight size={17} /></Link>
                <Link href="/budget" className="v3-secondary-action">Shop by budget</Link>
              </div>
              <div className="v3-hero-proof">
                <span><BadgeCheck size={15} /> Japan-based stock</span>
                <span><CircleDollarSign size={15} /> Customer-facing USD</span>
                <span><ShieldCheck size={15} /> Clear buying information</span>
              </div>
            </div>
            <div className="v3-hero-index" aria-hidden="true">
              <span className="v3-hero-index-number">01</span>
              <span className="v3-hero-index-line" />
              <span className="v3-hero-index-copy">DIGITAL SHOWROOM / JAPAN</span>
            </div>
          </div>
        </section>

        <section className="v3-search-wrap"><div className="container"><SearchPanel /></div></section>
        <PopularBrands />
        <BudgetShowroom />

        <section className="section v3-arrivals-section">
          <div className="container">
            <div className="v3-section-intro">
              <div><p className="v3-kicker">Fresh on the lot</p><h2>New arrivals.</h2></div>
              <div className="v3-section-intro-copy"><p>Three recent listings here. The complete stock stays on the inventory page.</p><Link href="/cars">View all inventory →</Link></div>
            </div>
            {cars.length ? <div className="cars-grid">{cars.slice(0, 3).map((car) => <CarCard key={car.slug} car={car} />)}</div> : <div className="empty-state"><h2>Inventory is being prepared.</h2><p>Live vehicles will appear here as soon as they are published from the dealer console.</p></div>}
          </div>
        </section>

        <HomeFeatureLinks />

        <section className="section v3-final-section">
          <div className="container v3-final-card">
            <div><span className="v3-mono">READY WHEN YOU ARE</span><h2>See the car. Ask the question. Make the trip once.</h2></div>
            <div><p>Check availability, discuss a trade, or ask about finance before visiting.</p><Link href="/contact" className="v3-primary-action">Contact showroom <ArrowRight size={17} /></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
