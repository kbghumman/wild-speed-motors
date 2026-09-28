import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { manufacturers } from "@/data/manufacturers";

const japanese = manufacturers.filter((item) => item.market === "Japan");
const imports = manufacturers.filter((item) => item.market === "Import");

function BrandGroup({ title, subtitle, brands, tone }: { title: string; subtitle: string; brands: typeof manufacturers; tone: string }) {
  return (
    <section className={`section brand-directory-section ${tone}`}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{subtitle}</p>
            <h2 className="section-title">{title}</h2>
          </div>
        </div>
        <div className="brand-directory-grid">
          {brands.map((brand, index) => (
            <Link key={brand.name} href={`/cars?make=${encodeURIComponent(brand.name)}`} className="brand-directory-card">
              <span className="brand-directory-mark">{brand.name.slice(0, 3).toUpperCase()}</span>
              <span className="brand-directory-index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{brand.name}</strong>
              <span>Browse available stock →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BrandsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="editorial-hero brands-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="eyebrow">Manufacturer directory</p>
              <h1>Every badge. <span>One showroom.</span></h1>
              <p>Browse Japanese and imported brands commonly found in Japan-market used inventory.</p>
            </div>
            <div className="hero-graphic hero-graphic-brands">
              <span className="graphic-disc disc-a">JDM</span>
              <span className="graphic-disc disc-b">EU</span>
              <span className="graphic-disc disc-c">US</span>
              <span className="graphic-axis" />
            </div>
          </div>
        </section>

        <BrandGroup title="Japanese manufacturers" subtitle="Home market" brands={japanese} tone="brand-tone-japan" />
        <BrandGroup title="Imported manufacturers" subtitle="International" brands={imports} tone="brand-tone-import" />
      </main>
      <SiteFooter />
    </>
  );
}
