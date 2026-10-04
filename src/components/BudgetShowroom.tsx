import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GarageBayArt } from "@/components/AutomotiveArt";
import { budgetBays, getCarsForBudgetBay } from "@/data/budgetBays";
import type { Car } from "@/data/cars";

const variants = ["sedan", "suv", "sports", "classic"] as const;

function stockLabel(count: number) {
  return count === 1 ? "1 live car" : count + " live cars";
}

export default function BudgetShowroom({ cars }: { cars: Car[] }) {
  const homepageBays = budgetBays.slice(0, 4);

  return (
    <section className="section v19-budget-section">
      <div className="container">
        <div className="v19-budget-head">
          <div>
            <span className="v19-budget-kicker">SHOP BY BUDGET</span>
            <h2>Browse by budget.</h2>
          </div>

          <Link href="/budget" className="v19-budget-all">
            All price ranges <ArrowRight size={16} />
          </Link>
        </div>

        <div className="v19-budget-grid">
          {homepageBays.map((bay, index) => {
            const count = getCarsForBudgetBay(bay.slug, cars).length;

            return (
              <Link
                key={bay.slug}
                href={"/budget/" + bay.slug}
                className={"v19-budget-card v19-budget-card-" + (index + 1)}
              >
                <GarageBayArt index={index} variant={variants[index]} />

                <div className="v19-budget-top">
                  <span>RANGE {String(index + 1).padStart(2, "0")}</span>
                  <span className="v19-budget-arrow"><ArrowUpRight size={17} /></span>
                </div>

                <div className="v19-budget-copy">
                  <strong>{bay.shortTitle}</strong>
                  <small>{stockLabel(count)}</small>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
