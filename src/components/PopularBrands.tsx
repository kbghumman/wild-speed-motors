import Link from "next/link";

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

export default function PopularBrands() {
  return (
    <section className="popular-brands">
      <div className="container">
        <div className="popular-brands-head">
          <div>
            <p className="eyebrow">Popular brands</p>
            <h2 className="popular-brands-title">Shop by manufacturer</h2>
          </div>
          <Link href="/cars" className="popular-brands-all">View all brands</Link>
        </div>

        <div className="popular-brands-grid">
          {popularBrands.map((brand) => (
            <Link
              key={brand}
              href={`/cars?make=${encodeURIComponent(brand)}`}
              className="popular-brand-card"
            >
              <span>{brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
