import Link from "next/link";
import { ArrowUpRight, BadgeDollarSign, Repeat2 } from "lucide-react";
import { CarOutline } from "@/components/AutomotiveArt";

export default function HomeFeatureLinks() {
  return (
    <section className="section v3-paths-section">
      <div className="container">
        <div className="v3-section-intro">
          <div>
            <p className="v3-kicker">More ways to shop</p>
            <h2>Start from what matters to you.</h2>
          </div>
          <div className="v3-section-intro-copy">
            <p>
              Not every customer starts with a specific make and model. Browse
              by the kind of car you want, understand the buying route, or talk
              to us about your current vehicle.
            </p>
          </div>
        </div>

        <div className="v3-paths-grid">
          <Link href="/collections" className="v3-path-card v3-path-main">
            <div className="v3-path-car-art">
              <CarOutline variant="sports" className="v3-path-car" />
              <span className="v3-path-gridline" />
            </div>
            <div>
              <span className="v3-mono">SHOP BY TYPE</span>
              <strong>Collections</strong>
              <p>Sports cars, classics, SUVs, 4x4s, hybrids and EVs are grouped automatically from the live inventory.</p>
              <span className="v3-card-link">Explore collections <ArrowUpRight size={15} /></span>
            </div>
          </Link>

          <Link href="/finance" className="v3-path-card v3-path-small v3-path-finance">
            <div className="v3-path-icon"><BadgeDollarSign size={26} /></div>
            <span className="v3-mono">BUYING OPTIONS</span>
            <strong>Finance</strong>
            <p>Review the information available and contact us to discuss the route that applies to the vehicle you are considering.</p>
            <span className="v3-card-link">Finance information <ArrowUpRight size={15} /></span>
          </Link>

          <Link href="/sell" className="v3-path-card v3-path-small v3-path-sell">
            <div className="v3-path-icon"><Repeat2 size={26} /></div>
            <span className="v3-mono">YOUR CURRENT CAR</span>
            <strong>Sell or trade</strong>
            <p>Tell us what you drive now if you want to sell it or discuss using it toward another car.</p>
            <span className="v3-card-link">Start a valuation enquiry <ArrowUpRight size={15} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
