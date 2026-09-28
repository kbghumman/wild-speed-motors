import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { budgetBays } from "@/data/budgetBays";

export default function BudgetShowroom() {
  return (
    <section className="section budget-showroom">
      <div className="container">
        <div className="showroom-heading">
          <div>
            <p className="eyebrow showroom-eyebrow">Virtual showroom</p>
            <h2 className="section-title showroom-title">Walk the lot by budget.</h2>
            <p className="section-copy showroom-copy">
              Each price range is its own digital showroom bay. Enter the section that fits your budget and browse only the cars that belong there.
            </p>
          </div>
          <div className="showroom-key">
            <span className="showroom-key-dot" />
            Live inventory will auto-sort into each bay
          </div>
        </div>

        <div className="budget-bay-grid">
          {budgetBays.map((bay, index) => (
            <Link key={bay.slug} href={`/budget/${bay.slug}`} className="budget-bay-card">
              <span className="bay-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="budget-bay-label">SHOWROOM BAY</span>
              <strong>{bay.shortTitle}</strong>
              <span>{bay.description}</span>
              <span className="budget-bay-link">
                Enter bay <ArrowUpRight size={16} />
              </span>
            </Link>
          ))}
        </div>

        <div className="showroom-footer">
          <span>Not sure where to start?</span>
          <Link href="/budget" className="showroom-all-link">View the full virtual showroom →</Link>
        </div>
      </div>
    </section>
  );
}
