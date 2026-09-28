import Header from "@/components/Header";
import CarCard from "@/components/CarCard";
import InventoryFilters from "@/components/InventoryFilters";
import { cars } from "@/data/cars";

export default function CarsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#93c5fd" }}>Wild Speed Motors stock</p>
            <h1>Used cars</h1>
            <p>Browse our current stock by manufacturer, model, body type, transmission, fuel and budget.</p>
          </div>
        </section>

        <section className="section">
          <div className="container inventory-layout">
            <InventoryFilters />

            <div>
              <div className="inventory-top">
                <strong>{cars.length} cars available</strong>
                <select defaultValue="newest">
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="mileage">Lowest mileage</option>
                </select>
              </div>

              <div className="cars-grid">
                {cars.map((car) => <CarCard key={car.slug} car={car} />)}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
