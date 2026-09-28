import Link from "next/link";
import Header from "@/components/Header";
import { budgetBays } from "@/data/budgetBays";

export default function BudgetPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#93c5fd" }}>Virtual showroom</p>
            <h1>Browse by budget</h1>
            <p>
              Each price band is its own showroom bay, so you can browse cars the same way you would walk through a physical lot.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container budget-bay-grid">
            {budgetBays.map((bay) => (
              <Link key={bay.slug} href={`/budget/${bay.slug}`} className="budget-bay-card budget-bay-card-large">
                <span className="budget-bay-label">SHOWROOM BAY</span>
                <strong>{bay.title}</strong>
                <span>{bay.description}</span>
                <span className="budget-bay-link">Browse this bay →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
