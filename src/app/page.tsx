import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import SmartCarFinder from "@/components/SmartCarFinder";
import FeaturedInventoryCarousel from "@/components/FeaturedInventoryCarousel";
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
        <section className="v11-search-first">
          <div className="container">
            <div className="v11-search-topline">
              <span className="v11-live-dot" />
              <span>LIVE INVENTORY</span>
              <strong>{cars.length} {cars.length === 1 ? "CAR" : "CARS"} AVAILABLE NOW</strong>
            </div>

            <div className="v11-search-heading">
              <div>
                <h1>What kind of car are you looking for?</h1>
                <p>
                  Tell us naturally — budget, seats, body style, transmission,
                  family use, snow use or anything else that matters.
                </p>
              </div>

              <Link href="/cars" className="v11-view-all">
                View all {cars.length} {cars.length === 1 ? "car" : "cars"}
                <ArrowRight size={17} />
              </Link>
            </div>

            <SmartCarFinder />
          </div>
        </section>

        <FeaturedInventoryCarousel cars={cars} />

        <BudgetShowroom />

        <PopularBrands cars={cars} />

        <section className="section v3-final-section">
          <div className="container v3-final-card">
            <div>
              <span className="v3-mono">NEED HELP?</span>
              <h2>Tell us what you are looking for.</h2>
            </div>
            <div>
              <p>
                Ask about current availability, a test drive, finance,
                a trade-in or a car you want us to source.
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
