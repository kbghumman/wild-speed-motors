import Link from "next/link";
import { ArrowUpRight, BadgeDollarSign, Repeat2 } from "lucide-react";
import { CarOutline } from "@/components/AutomotiveArt";

export default function HomeFeatureLinks() {
  return (
    <section className="section v3-paths-section">
      <div className="container">
        <div className="v3-section-intro">
          <div>
            <p className="v3-kicker">Beyond the inventory</p>
            <h2>Three useful next steps.</h2>
          </div>
        </div>

        <div className="v3-paths-grid">
          <Link href="/collections" className="v3-path-card v3-path-main">
            <div className="v3-path-car-art">
              <CarOutline variant="sports" className="v3-path-car" />
              <span className="v3-path-gridline" />
            </div>
            <div>
              <span className="v3-mono">CURATED STOCK</span>
              <strong>Collections</strong>
              <p>Sports, classics, SUVs and electrified cars get their own spaces.</p>
              <span className="v3-card-link">Explore collections <ArrowUpRight size={15} /></span>
            </div>
          </Link>

          <Link href="/finance" className="v3-path-card v3-path-small v3-path-finance">
            <div className="v3-path-icon"><BadgeDollarSign size={26} /></div>
            <span className="v3-mono">OWNERSHIP</span>
            <strong>Finance</strong>
            <p>Understand the buying route before choosing the car.</p>
            <span className="v3-card-link">Learn more <ArrowUpRight size={15} /></span>
          </Link>

          <Link href="/sell" className="v3-path-card v3-path-small v3-path-sell">
            <div className="v3-path-icon"><Repeat2 size={26} /></div>
            <span className="v3-mono">CHANGE CARS</span>
            <strong>Sell or trade</strong>
            <p>Value your current car or use it toward the next one.</p>
            <span className="v3-card-link">Start here <ArrowUpRight size={15} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
