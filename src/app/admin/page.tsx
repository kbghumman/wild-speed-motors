import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CarFront, CircleDollarSign, ImagePlus, Plus } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";
import { getAdminCars } from "@/lib/inventory";
import { formatUSD } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Dealer Console | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireStaff();
  const cars = await getAdminCars();

  return (
    <AdminShell title="Inventory dashboard" eyebrow="Dealer console">
      <div className="admin-dashboard-grid">
        <Link href="/admin/vehicles/new" className="admin-add-card">
          <span className="admin-add-icon"><Plus size={26} /></span>
          <div><span className="v3-mono">NEW LISTING</span><strong>Add a vehicle</strong><p>Enter the car once, upload the photos, review it, then publish.</p></div>
          <ArrowUpRight size={20} />
        </Link>
        <article className="admin-stat-card"><CarFront size={22} /><span>Inventory records</span><strong>{cars.length}</strong><small>Database-backed</small></article>
        <article className="admin-stat-card"><CircleDollarSign size={22} /><span>Display currency</span><strong>USD</strong><small>Mileage remains in km</small></article>
        <article className="admin-stat-card"><ImagePlus size={22} /><span>Photo workflow</span><strong>Storage</strong><small>Supabase vehicle-images bucket</small></article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">CURRENT DATA</span><h2>Inventory</h2></div>
          <Link href="/cars">Open public inventory →</Link>
        </div>
        <div className="admin-stock-list">
          {cars.length ? cars.map((car) => (
            <div className="admin-stock-row" key={car.id ?? car.slug}>
              {car.image ? <img src={car.image} alt="" /> : <div className="admin-stock-placeholder" />}
              <div className="admin-stock-name"><span className="v3-mono">{car.make}</span><strong>{car.model} {car.trim}</strong></div>
              <span>{car.year}</span>
              <span>{car.mileage.toLocaleString()} km</span>
              <strong>{formatUSD(car.price)}</strong>
              <span className={"admin-status-pill status-" + (car.status ?? "live")}>{(car.status ?? "live").toUpperCase()}</span>
            </div>
          )) : <div className="admin-empty-stock">No vehicles yet. Add the first listing.</div>}
        </div>
      </section>
    </AdminShell>
  );
}
