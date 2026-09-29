import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { getPublicCarBySlug } from "@/lib/inventory";
import { formatUSD } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await getPublicCarBySlug(slug);
  if (!car) notFound();

  const specs = [
    ["Year", car.year],
    ["Mileage", car.mileage.toLocaleString() + " km"],
    ["Transmission", car.transmission],
    ["Fuel", car.fuel],
    ["Drivetrain", car.drivetrain || "—"],
    ["Engine", car.engine],
    ["Body", car.body],
    ["Shaken", car.shakenExpiry || "Ask dealer"],
  ];

  return (
    <>
      <Header />
      <main>
        <section className="page-hero"><div className="container"><Link href="/cars" style={{ color: "#93c5fd", fontWeight: 800 }}>← Back to used cars</Link></div></section>
        <section className="section" style={{ paddingTop: 38 }}>
          <div className="container detail-grid">
            <div>
              <div className="detail-image"><img src={car.image} alt={car.make + " " + car.model + " " + car.trim} /></div>
              {car.images && car.images.length > 1 && <div className="detail-gallery-strip">{car.images.slice(1, 7).map((image) => <img key={image} src={image} alt="" loading="lazy" />)}</div>}
              <div className="detail-specs">{specs.map(([label, value]) => <div className="spec-box" key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}</div>
              {car.description && <div className="detail-copy-block"><h2>About this car</h2><p>{car.description}</p></div>}
              {car.features?.length ? <div className="detail-copy-block"><h2>Features</h2><div className="detail-feature-list">{car.features.map((feature) => <span key={feature}>{feature}</span>)}</div></div> : null}
            </div>
            <aside className="detail-panel">
              <div className="car-make">{car.make}</div><h1>{car.model}</h1><p className="car-trim">{car.trim}</p>
              <div className="price">{formatUSD(car.price)}</div>
              {car.monthly > 0 && <p style={{ color: "#64748b", marginTop: 4 }}>Indicative from <strong>{formatUSD(car.monthly)}/month</strong></p>}
              {car.stockNumber && <p className="v3-mono">STOCK {car.stockNumber}</p>}
              <div className="detail-actions">
                <Link href="/contact" className="button-primary">Enquire about this car</Link>
                <Link href="/contact" className="button-secondary">Book a test drive</Link>
                <Link href="/finance" className="button-secondary">Ask about finance</Link>
                <Link href="/sell" className="button-secondary">Part exchange my car</Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
