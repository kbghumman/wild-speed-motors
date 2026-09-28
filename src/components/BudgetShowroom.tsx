import Link from "next/link";
import { budgetBays } from "@/data/budgetBays";

export default function BudgetShowroom() {
  return (
    <section className="section budget-showroom">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Virtual showroom</p>
            <h2 className="section-title">Browse by budget</h2>
            <p className="section-copy">
              Think of each price range as its own showroom bay. Pick a budget and walk straight into that section.
            </p>
          </div>
          <Link href="/budget" className="button-secondary">View all budget bays</Link>
        </div>

        <div className="budget-bay-grid">
          {budgetBays.map((bay) => (
            <Link key={bay.slug} href={`/budget/${bay.slug}`} className="budget-bay-card">
              <span className="budget-bay-label">SHOWROOM BAY</span>
              <strong>{bay.shortTitle}</strong>
              <span>{bay.description}</span>
              <span className="budget-bay-link">Enter bay →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
