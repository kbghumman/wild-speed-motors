import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BadgeDollarSign, CarFront, CircleDollarSign, MapPin, Repeat2, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import SearchPanel from "@/components/SearchPanel";
import CarCard from "@/components/CarCard";
import PopularBrands from "@/components/PopularBrands";
import BudgetShowroom from "@/components/BudgetShowroom";
import HomeFeatureLinks from "@/components/HomeFeatureLinks";
import { getPublicCars } from "@/lib/inventory";

export default async function HomePage() {
  const cars = await getPublicCars();

  return (
    <>
      <Header />
      <main>
        <section className="v3-hero v4-hero">
          <Image
            src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=2200&q=82"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={75}
            className="v4-hero-image"
          />
          <div className="v4-hero-overlay" />

          <div className="container v3-hero-grid">
            <div className="v3-hero-copy">
              <span className="v3-hero-context"><MapPin size={14} />Japan inventory / USD pricing</span>
              <p className="v3-kicker v3-hero-kicker">Wild Speed Motors</p>
              <h1>Your next car<span>in Japan.</span></h1>
              <p className="v3-hero-lede">Browse Japan-based used cars through a simpler buying experience built around stock, budget and the information you need before visiting.</p>
              <div className="v3-hero-actions">
                <Link href="/cars" className="v3-primary-action">Browse cars <ArrowRight size={17} /></Link>
                <Link href="/budget" className="v3-secondary-action">Shop by budget</Link>
              </div>
              <div className="v3-hero-proof">
                <span><BadgeCheck size={15} /> Live Japan stock</span>
                <span><CircleDollarSign size={15} /> Prices in USD</span>
                <span><ShieldCheck size={15} /> Clear vehicle details</span>
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

        <section className="v4-quick-actions">
          <div className="container v4-quick-actions-grid">
            <Link href="/cars"><CarFront size={20} /><span><strong>All cars</strong><small>See every live listing</small></span></Link>
            <Link href="/budget"><CircleDollarSign size={20} /><span><strong>Shop by budget</strong><small>Go straight to your price range</small></span></Link>
            <Link href="/finance"><BadgeDollarSign size={20} /><span><strong>Finance</strong><small>Understand buying options</small></span></Link>
            <Link href="/sell"><Repeat2 size={20} /><span><strong>Sell or trade</strong><small>Value your current car</small></span></Link>
          </div>
        </section>

        <PopularBrands />
        <BudgetShowroom />

        <section className="section v3-arrivals-section">
          <div className="container">
            <div className="v3-section-intro">
              <div><p className="v3-kicker">Fresh on the lot</p><h2>New arrivals.</h2></div>
              <div className="v3-section-intro-copy"><p>Recently published vehicles, with the full live inventory one click away.</p><Link href="/cars">View all inventory →</Link></div>
            </div>
            {cars.length ? (
              <div className="cars-grid">{cars.slice(0, 3).map((car) => <CarCard key={car.slug} car={car} />)}</div>
            ) : (
              <div className="empty-state"><h2>Inventory is being prepared.</h2><p>Live vehicles will appear here as soon as they are published from the dealer console.</p></div>
            )}
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
