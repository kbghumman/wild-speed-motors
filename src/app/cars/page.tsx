import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CarCard from "@/components/CarCard";
import InventoryFilters from "@/components/InventoryFilters";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function CarsPage() {
  const cars = await getPublicCars();

  return (
    <>
      <Header />
      <main>
        <section className="page-hero inventory-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#a7f3d0" }}>Live showroom inventory</p>
            <h1>Used cars</h1>
            <p>Browse current stock by manufacturer, model, body type, transmission, fuel and USD budget.</p>
          </div>
        </section>
        <section className="section">
          <div className="container inventory-layout">
            <InventoryFilters />
            <div>
              <div className="inventory-top"><strong>{cars.length} cars available</strong></div>
              {cars.length ? <div className="cars-grid">{cars.map((car) => <CarCard key={car.slug} car={car} />)}</div> : <div className="empty-state"><h2>No live cars yet</h2><p>Published inventory will appear here automatically.</p></div>}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
