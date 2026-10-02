import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDot, Clock3, Trophy, UsersRound } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";
import {
  humanLeadIntent,
  humanLeadStatus,
  leadReference,
  leadStatuses,
  type LeadRow,
} from "@/lib/leads";
import { formatUSD } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Leads | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type VehicleMini = {
  id: string;
  slug: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  price_usd: number;
  cover_image_url: string | null;
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const requestedStatus = params.status || "all";
  const { supabase } = await requireStaff();

  const { data: leadData, error } = await supabase
    .from("leads")
    .select("*")
    .order("last_activity_at", { ascending: false })
    .limit(300);

  const leads = (leadData ?? []) as unknown as LeadRow[];
  const vehicleIds = [...new Set(leads.map((lead) => lead.vehicle_id).filter(Boolean))] as string[];

  let vehicles: VehicleMini[] = [];
  if (vehicleIds.length) {
    const { data } = await supabase
      .from("vehicles")
      .select("id,slug,make,model,trim,year,price_usd,cover_image_url")
      .in("id", vehicleIds);
    vehicles = (data ?? []) as unknown as VehicleMini[];
  }

  const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const counts = new Map<string, number>();
  for (const status of leadStatuses) counts.set(status, 0);
  for (const lead of leads) counts.set(lead.status, (counts.get(lead.status) ?? 0) + 1);

  const filtered =
    requestedStatus === "all"
      ? leads
      : leads.filter((lead) => lead.status === requestedStatus);

  const openCount = leads.filter((lead) => !["won", "lost"].includes(lead.status)).length;
  const wonCount = counts.get("won") ?? 0;
  const urgentCount = leads.filter((lead) => ["high", "urgent"].includes(lead.priority) && !["won", "lost"].includes(lead.status)).length;

  return (
    <AdminShell title="Lead pipeline" eyebrow="Dealer CRM">
      <div className="lead-summary-grid">
        <article><UsersRound size={20} /><span>Total leads</span><strong>{leads.length}</strong><small>All captured website leads</small></article>
        <article><CircleDot size={20} /><span>Open pipeline</span><strong>{openCount}</strong><small>Not won or lost</small></article>
        <article><Clock3 size={20} /><span>High priority</span><strong>{urgentCount}</strong><small>Needs prompt attention</small></article>
        <article><Trophy size={20} /><span>Won</span><strong>{wonCount}</strong><small>Closed as sale</small></article>
      </div>

      <div className="lead-filter-tabs">
        <Link href="/admin/leads" className={requestedStatus === "all" ? "active" : ""}>
          All <span>{leads.length}</span>
        </Link>
        {leadStatuses.map((status) => (
          <Link
            key={status}
            href={"/admin/leads?status=" + status}
            className={requestedStatus === status ? "active" : ""}
          >
            {humanLeadStatus(status)} <span>{counts.get(status) ?? 0}</span>
          </Link>
        ))}
      </div>

      {error && <div className="analytics-error">Leads could not be loaded: {error.message}</div>}

      <section className="admin-panel lead-list-panel">
        <div className="admin-panel-head">
          <div>
            <span className="v3-mono">CRM QUEUE</span>
            <h2>{requestedStatus === "all" ? "All leads" : humanLeadStatus(requestedStatus)}</h2>
          </div>
          <span>{filtered.length} lead{filtered.length === 1 ? "" : "s"}</span>
        </div>

        <div className="lead-list">
          {filtered.map((lead) => {
            const vehicle = lead.vehicle_id ? vehicleMap.get(lead.vehicle_id) : undefined;
            const source = lead.utm_source || lead.referrer_host || "Direct / unknown";

            return (
              <Link href={"/admin/leads/" + lead.id} className="lead-row" key={lead.id}>
                <div className="lead-person">
                  <span className={"lead-priority-dot priority-" + lead.priority} />
                  <div>
                    <strong>{lead.customer_name}</strong>
                    <small>{leadReference(lead.lead_number)} · {humanLeadIntent(lead.intent)}</small>
                  </div>
                </div>

                <div className="lead-vehicle">
                  {vehicle?.cover_image_url ? <img src={vehicle.cover_image_url} alt="" /> : <div />}
                  <span>
                    <strong>{vehicle ? vehicle.year + " " + vehicle.make + " " + vehicle.model : lead.vehicle_slug || "General enquiry"}</strong>
                    <small>{vehicle ? formatUSD(vehicle.price_usd) : "No vehicle attached"}</small>
                  </span>
                </div>

                <div className="lead-row-meta">
                  <strong>{source}</strong>
                  <small>{lead.country_code || "Unknown country"}</small>
                </div>

                <div className="lead-row-meta">
                  <strong>{new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
                  <small>{new Date(lead.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</small>
                </div>

                <span className={"lead-status status-" + lead.status}>{humanLeadStatus(lead.status)}</span>
                <ArrowRight size={15} />
              </Link>
            );
          })}

          {!filtered.length && <div className="analytics-empty">No leads in this stage.</div>}
        </div>
      </section>
    </AdminShell>
  );
}
