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

function stockLabel(count: number) {
  return count === 1 ? "1 live car" : count + " live cars";
}

function sizeClass(count: number, rank: number) {
  if (count <= 0) return "v14-brand-small";
  if (rank === 0) return "v14-brand-xl";
  if (rank <= 2) return "v14-brand-large";
  return "v14-brand-medium";
}

export default function PopularBrands({ cars }: { cars: Car[] }) {
  const counts = new Map<string, number>();

  for (const car of cars) {
    counts.set(car.make, (counts.get(car.make) ?? 0) + 1);
  }

  const rankedBrands = popularBrands
    .map((brand, originalIndex) => ({
      brand,
      count: counts.get(brand) ?? 0,
      originalIndex,
    }))
    .sort((a, b) => b.count - a.count || a.originalIndex - b.originalIndex);

  return (
    <section className="section v3-brands-section v14-brands-section">
      <div className="container">
        <div className="v3-section-intro v14-brand-heading">
          <div>
            <h2>Browse by manufacturer.</h2>
          </div>
        </div>

        <div className="v14-brand-grid">
          {rankedBrands.map(({ brand, count }, rank) => (
            <Link
              href={"/cars?make=" + encodeURIComponent(brand)}
              className={"v14-brand-card " + sizeClass(count, rank)}
              key={brand}
            >
              <span className="v14-brand-rank">
                {String(rank + 1).padStart(2, "0")}
              </span>

              <BrandLogo brand={brand} className="v14-brand-logo" />

              <div className="v14-brand-copy">
                <strong>{brand}</strong>
                <small>{stockLabel(count)}</small>
                <span>Browse inventory →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
