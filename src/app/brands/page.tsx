import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import BrandLogo from "@/components/BrandLogo";
import { manufacturers } from "@/data/manufacturers";

const japanese = manufacturers.filter((item) => item.market === "Japan");
const imports = manufacturers.filter((item) => item.market === "Import");

function BrandGroup({ title, subtitle, brands, tone }: { title: string; subtitle: string; brands: typeof manufacturers; tone: string }) {
  return (
    <section className={"section brand-directory-section " + tone}>
      <div className="container">
        <div className="v3-section-intro">
          <div><p className="v3-kicker">{subtitle}</p><h2>{title}</h2></div>
          <div className="v3-section-intro-copy"><p>Select a manufacturer to open its live inventory. Brands without current stock will simply return an empty result.</p></div>
        </div>

        <div className="brand-directory-grid v4-brand-directory-grid">
          {brands.map((brand) => (
            <Link key={brand.name} href={"/cars?make=" + encodeURIComponent(brand.name)} className="brand-directory-card v4-brand-directory-card">
              <BrandLogo brand={brand.name} className="v4-directory-logo" />
              <strong>{brand.name}</strong>
              <span>Browse stock →</span>
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
              <p>Browse Japanese and imported manufacturers commonly found in Japan-market used inventory.</p>
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
