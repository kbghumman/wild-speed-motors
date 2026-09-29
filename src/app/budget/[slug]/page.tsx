import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CarCard from "@/components/CarCard";
import { getBudgetBay, getCarsForBudgetBay } from "@/data/budgetBays";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function BudgetBayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bay = getBudgetBay(slug);
  if (!bay) notFound();
  const cars = await getPublicCars();
  const matchingCars = getCarsForBudgetBay(slug, cars);

  return (
    <>
      <Header />
      <main>
        <section className="page-hero budget-detail-hero"><div className="container"><p className="eyebrow" style={{ color: "#fbbf24" }}>Virtual showroom bay</p><h1>{bay.title}</h1><p>{bay.description}</p></div></section>
        <section className="section"><div className="container"><div className="inventory-top"><strong>{matchingCars.length} cars in this bay</strong></div>{matchingCars.length ? <div className="cars-grid">{matchingCars.map((car) => <CarCard key={car.slug} car={car} />)}</div> : <div className="empty-state"><h2>No cars in this bay yet</h2><p>Vehicles will appear here automatically when a live listing falls inside this price range.</p></div>}</div></section>
      </main>
      <SiteFooter />
    </>
  );
}
