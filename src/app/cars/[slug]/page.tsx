import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { getPublicCarBySlug } from "@/lib/inventory";
import { formatUSD } from "@/lib/currency";
import VehicleGallery from "@/components/VehicleGallery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    ["Seats", car.seats ? String(car.seats) : "Ask dealer"],
    ["Doors", car.doors ? String(car.doors) : "Ask dealer"],
    ["Shaken", car.shakenExpiry || "Ask dealer"],
  ];

  return (
    <>
      <Header />
      <main>
        <section className="page-hero v4-detail-crumb">
          <div className="container"><Link href="/cars">← Back to all cars</Link></div>
        </section>

        <section className="section v4-detail-section">
          <div className="container detail-grid v4-detail-grid">
            <div>
              <VehicleGallery
                coverImage={car.image}
                images={car.images}
                alt={car.make + " " + car.model + " " + car.trim}
              />

              <div className="detail-specs">
                {specs.map(([label, value]) => <div className="spec-box" key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}
              </div>

              {car.description && <div className="detail-copy-block"><h2>About this car</h2><p>{car.description}</p></div>}
              {car.features?.length ? <div className="detail-copy-block"><h2>Features</h2><div className="detail-feature-list">{car.features.map((feature) => <span key={feature}>{feature}</span>)}</div></div> : null}
            </div>

            <aside className="detail-panel v4-detail-panel">
              <div className="car-make">{car.make}</div>
              <h1>{car.model}</h1>
              <p className="car-trim">{car.trim}</p>
              <div className="price">{formatUSD(car.price)}</div>
              {car.monthly > 0 && <p className="v4-finance-note">Indicative from <strong>{formatUSD(car.monthly)}/month</strong></p>}
              {car.stockNumber && <p className="v3-mono">STOCK {car.stockNumber}</p>}
              <div className="detail-actions">
                <Link href="/contact" className="button-primary">Enquire about this car</Link>
                <Link href="/contact" className="button-secondary">Book a test drive</Link>
                <Link href="/finance" className="button-secondary">Finance options</Link>
                <Link href="/sell" className="button-secondary">Trade in my car</Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
