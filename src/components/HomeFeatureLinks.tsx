import Link from "next/link";
import { ArrowUpRight, BadgeDollarSign, Gauge, Repeat2 } from "lucide-react";

const items = [
  {
    href: "/collections",
    className: "home-feature-card feature-performance",
    kicker: "Drive your way",
    title: "Collections",
    copy: "Sports cars, classics, SUVs and electrified stock.",
    Icon: Gauge,
  },
  {
    href: "/finance",
    className: "home-feature-card feature-finance",
    kicker: "Plan your purchase",
    title: "Finance",
    copy: "See how the finance journey works before you choose a car.",
    Icon: BadgeDollarSign,
  },
  {
    href: "/sell",
    className: "home-feature-card feature-sell",
    kicker: "Change cars",
    title: "Sell or trade",
    copy: "Start a valuation or use your current car toward the next one.",
    Icon: Repeat2,
  },
];

export default function HomeFeatureLinks() {
  return (
    <section className="section home-feature-section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">More ways to move</p>
            <h2 className="section-title">The rest of the showroom has its own space.</h2>
          </div>
        </div>
        <div className="home-feature-grid">
          {items.map(({ href, className, kicker, title, copy, Icon }) => (
            <Link href={href} className={className} key={href}>
              <div className="feature-graphic">
                <Icon size={30} />
                <span className="feature-ring feature-ring-one" />
                <span className="feature-ring feature-ring-two" />
                <span className="feature-line" />
              </div>
              <span className="feature-kicker">{kicker}</span>
              <strong>{title}</strong>
              <p>{copy}</p>
              <span className="feature-link">Explore <ArrowUpRight size={16} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
