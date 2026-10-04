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
import InventoryHeroCarousel from "@/components/InventoryHeroCarousel";
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
        <InventoryHeroCarousel cars={cars} />

        <section className="v6-smart-wrap">
          <div className="container"><SmartCarFinder /></div>
        </section>

        <section className="v3-search-wrap v6-filter-wrap">
          <div className="container"><SearchPanel /></div>
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
        <BudgetShowroom />

        <section className="section v5-process-section">
          <div className="container">
            <div className="v3-section-intro">
              <div>
                <p className="v3-kicker">From screen to showroom</p>
                <h2>A simple way to buy.</h2>
              </div>
              <div className="v3-section-intro-copy">
                <p>
                  Use the website to narrow the choice first. When a car looks
                  right, contact us to confirm the details and availability
                  before making the trip.
                </p>
              </div>
            </div>

            <div className="v5-process-grid">
              <div>
                <span>01</span>
                <strong>Browse live stock</strong>
                <p>Filter by make, model, body type and budget, or start with a manufacturer or collection.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Ask about the car</strong>
                <p>Open the listing, review the gallery and specifications, then ask about availability, finance or a trade-in.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Plan your visit</strong>
                <p>Confirm the vehicle first, then arrange the right time to see it and discuss the next step with the showroom.</p>
              </div>
            </div>

            <p className="v5-availability-note">
              Live inventory can change. Please confirm availability before travelling to see a vehicle.
            </p>
          </div>
        </section>

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
