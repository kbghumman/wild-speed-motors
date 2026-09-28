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

const featured = popularBrands.slice(0, 4);
const shelf = popularBrands.slice(4);

function markFor(brand: string) {
  if (brand === "Mercedes-Benz") return "MB";
  if (brand === "Mitsubishi") return "MMC";
  return brand.slice(0, 3).toUpperCase();
}

export default function PopularBrands() {
  return (
    <section className="section v3-brands-section">
      <div className="container">
        <div className="v3-section-intro">
          <div>
            <p className="v3-kicker">Popular brands</p>
            <h2>Start with the badge.</h2>
          </div>
          <div className="v3-section-intro-copy">
            <p>Eleven popular manufacturers, with the full Japan-market directory one click deeper.</p>
            <Link href="/brands">All manufacturers →</Link>
          </div>
        </div>

        <div className="v3-brand-stage">
          <div className="v3-brand-featured">
            {featured.map((brand, index) => (
              <Link
                href={"/cars?make=" + encodeURIComponent(brand)}
                className="v3-brand-feature"
                key={brand}
              >
                <span className="v3-brand-mark">{markFor(brand)}</span>
                <span className="v3-brand-index">0{index + 1}</span>
                <strong>{brand}</strong>
                <small>Browse stock</small>
              </Link>
            ))}
          </div>

          <div className="v3-brand-shelf">
            {shelf.map((brand) => (
              <Link href={"/cars?make=" + encodeURIComponent(brand)} key={brand}>
                <span>{markFor(brand)}</span>
                <strong>{brand}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
