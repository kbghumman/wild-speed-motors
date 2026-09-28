import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CarFront, CircleDollarSign, ImagePlus, Plus } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { cars } from "@/data/cars";
import { formatUSD } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Dealer Console | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Inventory dashboard" eyebrow="Dealer console">
      <div className="admin-dashboard-grid">
        <Link href="/admin/vehicles/new" className="admin-add-card">
          <span className="admin-add-icon"><Plus size={26} /></span>
          <div>
            <span className="v3-mono">NEW LISTING</span>
            <strong>Add a vehicle</strong>
            <p>Enter the car once, upload the photos, review it, then publish.</p>
          </div>
          <ArrowUpRight size={20} />
        </Link>

        <article className="admin-stat-card">
          <CarFront size={22} />
          <span>Demo stock</span>
          <strong>{cars.length}</strong>
          <small>Will become database-driven</small>
        </article>

        <article className="admin-stat-card">
          <CircleDollarSign size={22} />
          <span>Display currency</span>
          <strong>USD</strong>
          <small>Mileage remains in km</small>
        </article>

        <article className="admin-stat-card">
          <ImagePlus size={22} />
          <span>Photo workflow</span>
          <strong>Multi</strong>
          <small>Cover + gallery ordering</small>
        </article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="v3-mono">CURRENT DATA</span>
            <h2>Inventory preview</h2>
          </div>
          <Link href="/cars">Open public inventory →</Link>
        </div>

        <div className="admin-stock-list">
          {cars.map((car) => (
            <div className="admin-stock-row" key={car.slug}>
              <img src={car.image} alt="" />
              <div className="admin-stock-name">
                <span className="v3-mono">{car.make}</span>
                <strong>{car.model} {car.trim}</strong>
              </div>
              <span>{car.year}</span>
              <span>{car.mileage.toLocaleString()} km</span>
              <strong>{formatUSD(car.price)}</strong>
              <span className="admin-status-pill">LIVE</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-workflow">
        <div>
          <span className="v3-mono">HOW UPLOADS WILL WORK</span>
          <h2>One listing becomes everything.</h2>
        </div>
        <ol>
          <li><span>01</span><strong>Enter vehicle</strong><p>Make, model, year, mileage, chassis, price and specifications.</p></li>
          <li><span>02</span><strong>Add media</strong><p>Upload all photos once and choose the cover image.</p></li>
          <li><span>03</span><strong>Review</strong><p>Confirm presentation, condition, categories and pricing.</p></li>
          <li><span>04</span><strong>Publish</strong><p>The listing appears in inventory, budget bay, brand and matching collections automatically.</p></li>
        </ol>
      </section>
    </AdminShell>
  );
}
