import Link from "next/link";
import { featuredCollections } from "@/data/collections";

export default function CollectionCards() {
  return (
    <section className="section section-soft collection-section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Browse differently</p>
            <h2 className="section-title">Shop by collection</h2>
            <p className="section-copy">
              Jump straight to the kind of car you are looking for without crowding the main navigation.
            </p>
          </div>
          <Link href="/collections" className="button-secondary">View all collections</Link>
        </div>

        <div className="collection-grid">
          {featuredCollections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="collection-card"
            >
              <span className="collection-eyebrow">{collection.eyebrow}</span>
              <strong>{collection.shortTitle}</strong>
              <span>{collection.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
