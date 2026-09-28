import Header from "@/components/Header";
import CarCard from "@/components/CarCard";
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
            <p>Browse our current stock. Filter controls are ready to be connected to live inventory in the next stage.</p>
          </div>
        </section>

        <section className="section">
          <div className="container inventory-layout">
            <aside className="filters">
              <h3>Filter cars</h3>
              {[
                ["Make", ["All makes", "BMW", "Audi", "Mercedes-Benz", "Toyota", "Volkswagen"]],
                ["Body type", ["Any body type", "SUV", "Hatchback", "Saloon", "Coupe"]],
                ["Transmission", ["Any", "Automatic", "Manual"]],
                ["Fuel", ["Any", "Petrol", "Diesel", "Hybrid", "Electric"]],
                ["Max price", ["Any price", "£15,000", "£20,000", "£25,000", "£30,000"]],
              ].map(([label, options]) => (
                <div className="filter-group" key={label as string}>
                  <label>{label as string}</label>
                  <select>
                    {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
              ))}
            </aside>

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
