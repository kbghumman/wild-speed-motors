import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import SmartCarFinder from "@/components/SmartCarFinder";
import InventoryHeroCarousel from "@/components/InventoryHeroCarousel";
import FeaturedInventoryCarousel from "@/components/FeaturedInventoryCarousel";
import HomeQuickActions from "@/components/HomeQuickActions";
import PopularBrands from "@/components/PopularBrands";
import BudgetShowroom from "@/components/BudgetShowroom";
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
        <HomeQuickActions />
        <FeaturedInventoryCarousel cars={cars} />
        <BudgetShowroom />
        <PopularBrands cars={cars} />

        <section className="section v10-smart-section">
          <div className="container">
            <div className="v10-section-head v10-smart-head">
              <div>
                <span className="v10-section-kicker">SMART CAR FINDER</span>
                <h2>Tell us what you need.</h2>
              </div>
              <p>
                Search naturally — budget, seats, body style, transmission,
                snow use, family needs and more.
              </p>
            </div>
            <SmartCarFinder />
          </div>
        </section>

        <section className="section v3-final-section">
          <div className="container v3-final-card">
            <div>
              <span className="v3-mono">BEFORE YOU TRAVEL</span>
              <h2>Interested in a car? Confirm it first.</h2>
            </div>
            <div>
              <p>
                Send us the vehicle you are looking at and ask about current
                availability, a test drive, finance or a trade-in.
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
