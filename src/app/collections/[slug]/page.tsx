import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CarCard from "@/components/CarCard";
import { cars } from "@/data/cars";
import { collections, getCarsForCollection, getCollection } from "@/data/collections";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const matchingCars = getCarsForCollection(slug, cars);

  return (
    <>
      <Header />
      <main>
        <section className={`page-hero collection-detail-hero collection-detail-${slug}`}>
          <div className="container">
            <p className="eyebrow">{collection.eyebrow}</p>
            <h1>{collection.title}</h1>
            <p>{collection.description}</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="inventory-top"><strong>{matchingCars.length} matching cars</strong></div>
            {matchingCars.length > 0 ? (
              <div className="cars-grid">{matchingCars.map((car) => <CarCard key={car.slug} car={car} />)}</div>
            ) : (
              <div className="empty-state">
                <h2>No matching demo stock yet</h2>
                <p>Matching real inventory will appear here automatically as stock is added.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
