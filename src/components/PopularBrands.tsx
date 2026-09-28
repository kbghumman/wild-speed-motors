import Link from "next/link";

const popularBrands = [
  ["BMW", "BMW"],
  ["Mercedes-Benz", "MB"],
  ["Audi", "AUDI"],
  ["Toyota", "TOY"],
  ["Honda", "HON"],
  ["Mitsubishi", "MITS"],
  ["Nissan", "NIS"],
  ["Subaru", "SUB"],
  ["Mazda", "MAZ"],
  ["Lexus", "LEX"],
  ["MINI", "MINI"],
];

export default function PopularBrands() {
  return (
    <section className="popular-brands">
      <div className="container">
        <div className="popular-brands-head">
          <div>
            <p className="eyebrow">Popular brands</p>
            <h2 className="popular-brands-title">Start with the badge you trust.</h2>
          </div>
          <Link href="/cars" className="text-link">Explore all makes →</Link>
        </div>

        <div className="popular-brands-grid">
          {popularBrands.map(([brand, mark]) => (
            <Link
              key={brand}
              href={`/cars?make=${encodeURIComponent(brand)}`}
              className="popular-brand-card"
            >
              <span className="brand-orb">{mark}</span>
              <span className="brand-name">{brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
