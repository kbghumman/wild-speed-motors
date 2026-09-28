import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CarCard from "@/components/CarCard";
import { cars } from "@/data/cars";
import { collections, getCarsForCollection, getCollection } from "@/data/collections";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) notFound();

  const matchingCars = getCarsForCollection(slug, cars);

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#93c5fd" }}>{collection.eyebrow}</p>
            <h1>{collection.title}</h1>
            <p>{collection.description}</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="inventory-top">
              <strong>{matchingCars.length} matching cars</strong>
            </div>

            {matchingCars.length > 0 ? (
              <div className="cars-grid">
                {matchingCars.map((car) => <CarCard key={car.slug} car={car} />)}
              </div>
            ) : (
              <div className="empty-state">
                <h2>No matching demo stock yet</h2>
                <p>
                  This collection page is ready. Once real inventory is added, matching vehicles will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
