import Link from "next/link";
import { ArrowUpRight, Gauge, Gem, Mountain, Zap } from "lucide-react";
import { featuredCollections } from "@/data/collections";

const iconBySlug = {
  "sports-cars": Gauge,
  "classic-cars": Gem,
  "suv-4x4": Mountain,
  "hybrid-electric": Zap,
} as const;

export default function CollectionCards() {
  return (
    <section className="section collection-section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Curated collections</p>
            <h2 className="section-title">Shop by personality.</h2>
            <p className="section-copy">
              Performance, classics, capability or efficiency — browse the stock by what matters to you.
            </p>
          </div>
          <Link href="/collections" className="text-link">View all collections →</Link>
        </div>

        <div className="collection-grid">
          {featuredCollections.map((collection, index) => {
            const Icon = iconBySlug[collection.slug as keyof typeof iconBySlug] ?? Gauge;
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className={`collection-card collection-card-${index + 1}`}
              >
                <span className="collection-icon"><Icon size={24} /></span>
                <span className="collection-eyebrow">{collection.eyebrow}</span>
                <strong>{collection.shortTitle}</strong>
                <span>{collection.description}</span>
                <span className="collection-arrow"><ArrowUpRight size={18} /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
