import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GarageBayArt } from "@/components/AutomotiveArt";
import { budgetBays } from "@/data/budgetBays";

const variants = ["sedan", "suv", "sports", "classic"] as const;

export default function BudgetShowroom() {
  const homepageBays = budgetBays.slice(0, 4);

  return (
    <section className="section v3-budget-section">
      <div className="container">
        <div className="v3-section-intro">
          <div>
            <p className="v3-kicker">Shop by budget</p>
            <h2>Start with what you want to spend.</h2>
          </div>
          <div className="v3-section-intro-copy">
            <p>
              Every live vehicle is placed automatically into one non-overlapping
              price range, so you can browse the stock that fits your budget
              without sorting through everything first.
            </p>
            <Link href="/budget">See every price range <ArrowUpRight size={15} /></Link>
          </div>
        </div>

        <div className="v3-budget-grid">
          {homepageBays.map((bay, index) => (
            <Link
              key={bay.slug}
              href={"/budget/" + bay.slug}
              className={"v3-budget-card v3-budget-card-" + (index + 1)}
            >
              <GarageBayArt index={index} variant={variants[index]} />
              <div className="v3-budget-content">
                <span className="v3-mono">PRICE RANGE {String(index + 1).padStart(2, "0")}</span>
                <strong>{bay.shortTitle}</strong>
                <p>{bay.description}</p>
                <span className="v3-card-link">Browse this range <ArrowUpRight size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
