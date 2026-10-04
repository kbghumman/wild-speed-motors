import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import type { Car } from "@/data/cars";

const popularBrands = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Toyota",
  "Honda",
  "Mitsubishi",
  "Nissan",
  "Subaru",
  "Mazda",
  "Lexus",
  "MINI",
];

const featured = popularBrands.slice(0, 4);
const shelf = popularBrands.slice(4);

function stockLabel(count: number) {
  return count === 1 ? "1 live car" : count + " live cars";
}

export default function PopularBrands({ cars }: { cars: Car[] }) {
  const counts = new Map<string, number>();

  for (const car of cars) {
    counts.set(car.make, (counts.get(car.make) ?? 0) + 1);
  }

  return (
    <section className="section v3-brands-section">
      <div className="container">
        <div className="v3-section-intro">
          <div>
            <h2>Browse by manufacturer.</h2>
          </div>
          <div className="v3-section-intro-copy">
            <p>
              Open a manufacturer to see its current live stock. Counts update
              automatically whenever a vehicle is published.
            </p>
            <Link href="/brands">View all manufacturers →</Link>
          </div>
        </div>

        <div className="v3-brand-stage v4-brand-stage">
          <div className="v3-brand-featured">
            {featured.map((brand, index) => {
              const count = counts.get(brand) ?? 0;

              return (
                <Link
                  href={"/cars?make=" + encodeURIComponent(brand)}
                  className="v3-brand-feature v4-brand-feature v5-brand-feature"
                  key={brand}
                >
                  <BrandLogo brand={brand} className="v5-brand-watermark" />
                  <span className="v3-brand-index">0{index + 1}</span>
                  <div className="v5-brand-copy">
                    <strong>{brand}</strong>
                    <small>{stockLabel(count)} · Browse inventory →</small>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="v3-brand-shelf v4-brand-shelf">
            {shelf.map((brand) => {
              const count = counts.get(brand) ?? 0;

              return (
                <Link href={"/cars?make=" + encodeURIComponent(brand)} key={brand}>
                  <BrandLogo brand={brand} className="v5-brand-shelf-logo" />
                  <span className="v5-brand-shelf-copy">
                    <strong>{brand}</strong>
                    <small>{stockLabel(count)}</small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
