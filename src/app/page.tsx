import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CarFront,
  CircleDollarSign,
  Repeat2,
} from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import SearchPanel from "@/components/SearchPanel";
import SmartCarFinder from "@/components/SmartCarFinder";
import CarCard from "@/components/CarCard";
import PopularBrands from "@/components/PopularBrands";
import BudgetShowroom from "@/components/BudgetShowroom";
import HomeFeatureLinks from "@/components/HomeFeatureLinks";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const cars = await getPublicCars();

  return (
    <>
      <Header />
      <main>
        <section className="v12-inventory-count">
          <div className="container v12-inventory-count-inner">
            <span className="v12-inventory-dot" />
            <span>LIVE INVENTORY</span>
            <strong>{cars.length} {cars.length === 1 ? "CAR" : "CARS"} AVAILABLE</strong>
          </div>
        </section>

        <section className="v13-search-stack">
          <div className="container">
            <div className="v13-exact-search">
              <SearchPanel />
            </div>

            <div className="v13-search-divider" aria-label="Alternative search method">
              <span />
              <strong>OR</strong>
              <span />
            </div>

            <div className="v13-smart-search">
              <SmartCarFinder />
            </div>
          </div>
        </section>

        <section className="v4-quick-actions">
          <div className="container v4-quick-actions-grid">
            <Link href="/cars">
              <CarFront size={20} />
              <span><strong>All cars</strong><small>See every vehicle currently live</small></span>
            </Link>
            <Link href="/budget">
              <CircleDollarSign size={20} />
              <span><strong>Shop by budget</strong><small>Go straight to the right price range</small></span>
            </Link>
            <Link href="/finance">
              <BadgeDollarSign size={20} />
              <span><strong>Finance</strong><small>See the information and options available</small></span>
            </Link>
            <Link href="/sell">
              <Repeat2 size={20} />
              <span><strong>Sell or trade</strong><small>Tell us about your current vehicle</small></span>
            </Link>
          </div>
        </section>

        <PopularBrands cars={cars} />
        <BudgetShowroom cars={cars} />

        <section className="section v3-arrivals-section">
          <div className="container">
            <div className="v3-section-intro">
              <div>
                <p className="v3-kicker">Recently published</p>
                <h2>New arrivals.</h2>
              </div>
              <div className="v3-section-intro-copy">
                <p>
                  The latest vehicles added by the showroom. Every published car
                  also appears automatically under its manufacturer, price range
                  and any matching collection.
                </p>
                <Link href="/cars">View all live inventory →</Link>
              </div>
            </div>

            {cars.length ? (
              <div className="cars-grid">
                {cars.slice(0, 3).map((car) => <CarCard key={car.slug} car={car} />)}
              </div>
            ) : (
              <div className="empty-state">
                <h2>No live cars right now.</h2>
                <p>Newly published vehicles will appear here automatically.</p>
              </div>
            )}
          </div>
        </section>

        <HomeFeatureLinks />

        <section className="section v3-final-section">
          <div className="container v3-final-card">
            <div>
              <span className="v3-mono">BEFORE YOU TRAVEL</span>
              <h2>Interested in a car? Confirm it first.</h2>
            </div>
            <div>
              <p>
                Send us the vehicle you are looking at and ask about current
                availability, a test drive, finance or a trade-in. We will help
                you work out the next step before you visit.
              </p>
              <Link href="/contact" className="v3-primary-action">
                Contact the showroom <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
