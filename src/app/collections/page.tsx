import Link from "next/link";
import Header from "@/components/Header";
import { collections } from "@/data/collections";

export default function CollectionsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#93c5fd" }}>Browse stock your way</p>
            <h1>Car collections</h1>
            <p>
              Browse Wild Speed Motors stock by budget, vehicle type, performance and special-interest categories.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container collection-grid">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="collection-card collection-card-large"
              >
                <span className="collection-eyebrow">{collection.eyebrow}</span>
                <strong>{collection.title}</strong>
                <span>{collection.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
