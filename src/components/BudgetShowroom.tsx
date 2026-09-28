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
            <p className="v3-kicker">Virtual showroom</p>
            <h2>Choose your bay.</h2>
          </div>
          <div className="v3-section-intro-copy">
            <p>
              Price is the floor plan. Each car automatically parks in the right
              section of the digital lot.
            </p>
            <Link href="/budget">See all budget bays <ArrowUpRight size={15} /></Link>
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
                <span className="v3-mono">BAY {String(index + 1).padStart(2, "0")}</span>
                <strong>{bay.shortTitle}</strong>
                <p>{bay.description}</p>
                <span className="v3-card-link">Enter bay <ArrowUpRight size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
