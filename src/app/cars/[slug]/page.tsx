import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { getPublicCarBySlug } from "@/lib/inventory";
import { formatUSD } from "@/lib/currency";
import VehicleGallery from "@/components/VehicleGallery";
import TrackEventOnView from "@/components/analytics/TrackEventOnView";

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
      <TrackEventOnView
        eventName="vehicle_view"
        vehicleSlug={car.slug}
        properties={{
          make: car.make,
          model: car.model,
          trim: car.trim,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          seats: car.seats ?? null,
          body: car.body,
        }}
      />
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
                vehicleSlug={car.slug}
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
                <Link href={"/contact?vehicle=" + encodeURIComponent(car.slug) + "&intent=enquiry"} className="button-primary" data-analytics-event="enquiry_click" data-analytics-label="Enquire about this car" data-vehicle-slug={car.slug}>Enquire about this car</Link>
                <Link href={"/contact?vehicle=" + encodeURIComponent(car.slug) + "&intent=test-drive"} className="button-secondary" data-analytics-event="test_drive_click" data-analytics-label="Book a test drive" data-vehicle-slug={car.slug}>Book a test drive</Link>
                <Link href={"/finance?vehicle=" + encodeURIComponent(car.slug)} className="button-secondary" data-analytics-event="finance_click" data-analytics-label="Finance options" data-vehicle-slug={car.slug}>Finance options</Link>
                <Link href={"/sell?vehicle=" + encodeURIComponent(car.slug)} className="button-secondary" data-analytics-event="trade_in_click" data-analytics-label="Trade in my car" data-vehicle-slug={car.slug}>Trade in my car</Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
