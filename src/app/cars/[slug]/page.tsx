import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { cars } from "@/data/cars";
import { formatUSD } from "@/lib/currency";

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = cars.find((item) => item.slug === slug);

  if (!car) notFound();

  const specs = [
    ["Year", car.year],
    ["Mileage", `${car.mileage.toLocaleString()} km`],
    ["Transmission", car.transmission],
    ["Fuel", car.fuel],
    ["Engine", car.engine],
    ["Body", car.body],
  ];

  return (
    <>
      <Header />
      <main>
        <section className="page-hero">
          <div className="container">
            <Link href="/cars" style={{ color: "#93c5fd", fontWeight: 800 }}>← Back to used cars</Link>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 38 }}>
          <div className="container detail-grid">
            <div>
              <div className="detail-image">
                <img src={car.image} alt={`${car.make} ${car.model} ${car.trim}`} />
              </div>

              <div className="detail-specs">
                {specs.map(([label, value]) => (
                  <div className="spec-box" key={label as string}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <aside className="detail-panel">
              <div className="car-make">{car.make}</div>
              <h1>{car.model}</h1>
              <p className="car-trim">{car.trim}</p>

              <div className="price">{formatUSD(car.price)}</div>
              <p style={{ color: "#64748b", marginTop: 4 }}>
                Indicative from <strong style={{ color: "#2563eb" }}>{formatUSD(car.monthly)}/month</strong>
              </p>

              <div className="detail-actions">
                <a href="tel:+440000000000" className="button-primary">Enquire about this car</a>
                <a href="mailto:sales@example.com" className="button-secondary">Book a test drive</a>
                <a href="mailto:sales@example.com" className="button-secondary">Ask about finance</a>
                <a href="mailto:sales@example.com" className="button-secondary">Part exchange my car</a>
              </div>

              <p style={{ marginTop: 24, color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
                Demo listing. Vehicle availability, finance figures, warranty information and specification must be verified before production launch.
              </p>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
