import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { budgetBays } from "@/data/budgetBays";

export default function BudgetPage() {
  return (
    <>
      <Header />
      <main>
        <section className="editorial-hero budget-page-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">Virtual showroom</p>
              <h1>Walk the lot <span>by price.</span></h1>
              <p>Each price band is its own showroom bay, so the inventory feels organised before you ever arrive.</p>
            </div>
            <div className="hero-graphic budget-map-graphic">
              <span className="parking-line parking-one" />
              <span className="parking-line parking-two" />
              <span className="parking-line parking-three" />
              <span className="parking-car car-one" />
              <span className="parking-car car-two" />
              <span className="parking-car car-three" />
            </div>
          </div>
        </section>

        <section className="section standalone-budget-section">
          <div className="container budget-bay-grid">
            {budgetBays.map((bay, index) => (
              <Link key={bay.slug} href={`/budget/${bay.slug}`} className={`budget-bay-card budget-bay-card-large budget-tone-${index + 1}`}>
                <span className="bay-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="budget-bay-label">SHOWROOM BAY</span>
                <strong>{bay.title}</strong>
                <span>{bay.description}</span>
                <span className="budget-bay-link">Browse this bay <ArrowUpRight size={16} /></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
