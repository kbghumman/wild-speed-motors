import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CarOutline } from "@/components/AutomotiveArt";
import { featuredCollections } from "@/data/collections";

const variants = {
  "sports-cars": "sports",
  "classic-cars": "classic",
  "suv-4x4": "suv",
  "hybrid-electric": "electric",
} as const;

export default function CollectionCards() {
  return (
    <section className="section v3-collections-section">
      <div className="container">
        <div className="v3-section-intro">
          <div>
            <p className="v3-kicker">Curated collections</p>
            <h2>Shop by instinct.</h2>
          </div>
          <div className="v3-section-intro-copy">
            <p>
              When make and model are not the starting point, begin with the kind of
              car you actually want to drive.
            </p>
          </div>
        </div>

        <div className="v3-collection-grid">
          {featuredCollections.map((collection, index) => (
            <Link
              key={collection.slug}
              href={"/collections/" + collection.slug}
              className={"v3-collection-card v3-collection-" + (index + 1)}
            >
              <div className="v3-collection-art">
                <CarOutline
                  variant={variants[collection.slug as keyof typeof variants] ?? "sedan"}
                  className="v3-collection-car"
                />
                <span className="v3-collection-index">0{index + 1}</span>
              </div>

              <div className="v3-collection-copy">
                <span className="v3-mono">{collection.eyebrow}</span>
                <strong>{collection.shortTitle}</strong>
                <p>{collection.description}</p>
                <span className="v3-card-link">Explore <ArrowUpRight size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
