import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CarCard from "@/components/CarCard";
import { getCarsForCollection, getCollection } from "@/data/collections";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const cars = await getPublicCars();
  const matchingCars = getCarsForCollection(slug, cars);

  return (
    <>
      <Header />
      <main>
        <section className={"page-hero collection-detail-hero collection-detail-" + slug}><div className="container"><p className="eyebrow">{collection.eyebrow}</p><h1>{collection.title}</h1><p>{collection.description}</p></div></section>
        <section className="section"><div className="container"><div className="inventory-top"><strong>{matchingCars.length} matching cars</strong></div>{matchingCars.length ? <div className="cars-grid">{matchingCars.map((car) => <CarCard key={car.slug} car={car} />)}</div> : <div className="empty-state"><h2>No matching stock yet</h2><p>Matching live inventory will appear here automatically as cars are published.</p></div>}</div></section>
      </main>
      <SiteFooter />
    </>
  );
}
