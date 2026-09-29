import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const popularBrands = ["BMW","Mercedes-Benz","Audi","Toyota","Honda","Mitsubishi","Nissan","Subaru","Mazda","Lexus","MINI"];
const featured = popularBrands.slice(0, 4);
const shelf = popularBrands.slice(4);

export default function PopularBrands() {
  return (
    <section className="section v3-brands-section">
      <div className="container">
        <div className="v3-section-intro">
          <div><p className="v3-kicker">Popular manufacturers</p><h2>Start with the badge.</h2></div>
          <div className="v3-section-intro-copy">
            <p>Jump straight into the brands customers ask for most, or open the complete manufacturer directory.</p>
            <Link href="/brands">View all manufacturers →</Link>
          </div>
        </div>

        <div className="v3-brand-stage v4-brand-stage">
          <div className="v3-brand-featured">
            {featured.map((brand, index) => (
              <Link href={"/cars?make=" + encodeURIComponent(brand)} className="v3-brand-feature v4-brand-feature" key={brand}>
                <BrandLogo brand={brand} className="v4-brand-logo-feature" />
                <span className="v3-brand-index">0{index + 1}</span>
                <strong>{brand}</strong>
                <small>Browse live stock →</small>
              </Link>
            ))}
          </div>

          <div className="v3-brand-shelf v4-brand-shelf">
            {shelf.map((brand) => (
              <Link href={"/cars?make=" + encodeURIComponent(brand)} key={brand}>
                <BrandLogo brand={brand} className="v4-brand-logo-shelf" />
                <strong>{brand}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
