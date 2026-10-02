import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CarFront, ImagePlus, Plus, UsersRound } from "lucide-react";
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
  const { supabase } = await requireStaff();
  const [cars, leadsResult] = await Promise.all([
    getAdminCars(),
    supabase
      .from("leads")
      .select("id,status,priority", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const leads = (leadsResult.data ?? []) as Array<{ id: string; status: string; priority: string }>;
  const openLeads = leads.filter((lead) => !["won", "lost"].includes(lead.status));
  const newLeads = leads.filter((lead) => lead.status === "new").length;

  return (
    <AdminShell title="Inventory dashboard" eyebrow="Dealer console">
      <div className="admin-dashboard-grid">
        <Link href="/admin/vehicles/new" className="admin-add-card">
          <span className="admin-add-icon"><Plus size={26} /></span>
          <div><span className="v3-mono">NEW LISTING</span><strong>Add a vehicle</strong><p>Enter the car once, upload the photos, review it, then publish.</p></div>
          <ArrowUpRight size={20} />
        </Link>
        <article className="admin-stat-card"><CarFront size={22} /><span>Inventory records</span><strong>{cars.length}</strong><small>Database-backed</small></article>
        <Link href="/admin/leads" className="admin-stat-card"><UsersRound size={22} /><span>Open leads</span><strong>{openLeads.length}</strong><small>{newLeads} new / unworked</small></Link>
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
