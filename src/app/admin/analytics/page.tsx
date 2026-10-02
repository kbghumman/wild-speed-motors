import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, Eye, MousePointerClick, Search, Users } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";
import { formatUSD } from "@/lib/currency";
import type { InventoryAnalyticsData } from "@/lib/analytics/types";

export const metadata: Metadata = {
  title: "Inventory Analytics | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function num(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString();
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = [7, 30, 90].includes(Number(params.days)) ? Number(params.days) : 30;
  const { supabase } = await requireStaff();

  const { data, error } = await supabase.rpc("get_inventory_analytics", {
    p_days: days,
  });

  const analytics = (data ?? {
    days,
    summary: {
      visitors: 0,
      sessions: 0,
      page_views: 0,
      searchers: 0,
      searches: 0,
      vdp_viewers: 0,
      vdp_views: 0,
      intent_visitors: 0,
      intent_actions: 0,
    },
    vehicles: [],
    search_demand: [],
    sources: [],
  }) as unknown as InventoryAnalyticsData;

  const s = analytics.summary;

  return (
    <AdminShell title="Inventory intelligence" eyebrow="Dealer analytics">
      <div className="analytics-toolbar">
        <div>
          <span className="v3-mono">VIN / STOCK-LEVEL PERFORMANCE</span>
          <p>
            See which exact cars are being discovered, opened, revisited, photographed,
            and acted on. Each vehicle has its own detailed analytics profile.
          </p>
        </div>
        <div className="analytics-range">
          {[7, 30, 90].map((value) => (
            <Link
              key={value}
              href={"/admin/analytics?days=" + value}
              className={days === value ? "active" : ""}
            >
              {value} days
            </Link>
          ))}
        </div>
      </div>

      {error && <div className="analytics-error">Analytics could not be loaded: {error.message}</div>}

      <div className="analytics-summary-grid dealer-kpi-grid">
        <article><Users size={20} /><span>Website visitors</span><strong>{num(s.visitors)}</strong><small>{num(s.sessions)} sessions</small></article>
        <article><Eye size={20} /><span>VDP viewers</span><strong>{num(s.vdp_viewers)}</strong><small>{num(s.vdp_views)} vehicle-detail views</small></article>
        <article><Search size={20} /><span>Search activity</span><strong>{num(s.searches)}</strong><small>{num(s.searchers)} unique searchers</small></article>
        <article><MousePointerClick size={20} /><span>Buyer-intent people</span><strong>{num(s.intent_visitors)}</strong><small>{num(s.intent_actions)} intent actions</small></article>
        <article><CarFront size={20} /><span>Inventory units</span><strong>{analytics.vehicles.length}</strong><small>Every unit gets its own profile</small></article>
        <article><ArrowRight size={20} /><span>VDP intent rate</span><strong>{s.vdp_viewers ? ((s.intent_visitors / s.vdp_viewers) * 100).toFixed(1) + "%" : "0.0%"}</strong><small>Unique intent visitors / VDP viewers</small></article>
      </div>

      <section className="admin-panel dealer-inventory-analytics">
        <div className="admin-panel-head">
          <div>
            <span className="v3-mono">UNIT-BY-UNIT</span>
            <h2>Vehicle performance</h2>
          </div>
          <span>{days}-day window</span>
        </div>

        <div className="dealer-inventory-table-wrap">
          <div className="dealer-inventory-table">
            <div className="dealer-inventory-row dealer-inventory-head">
              <span>Vehicle</span>
              <span>Age</span>
              <span>Listing reach</span>
              <span>VDP</span>
              <span>Return</span>
              <span>Photos</span>
              <span>Buyer intent</span>
              <span>Velocity</span>
              <span />
            </div>

            {analytics.vehicles.map((vehicle) => (
              <div className="dealer-inventory-row" key={vehicle.id}>
                <div className="dealer-unit">
                  {vehicle.cover_image_url ? <img src={vehicle.cover_image_url} alt="" /> : <div className="dealer-unit-placeholder" />}
                  <div>
                    <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                    <small>{vehicle.stock_number ? "Stock " + vehicle.stock_number + " · " : ""}{formatUSD(vehicle.price_usd)} · {vehicle.status.toUpperCase()}</small>
                  </div>
                </div>

                <div className="dealer-cell">
                  <strong>{vehicle.days_listed}d</strong>
                  <small>listed</small>
                </div>

                <div className="dealer-cell">
                  <strong>{num(vehicle.impression_viewers)}</strong>
                  <small>{num(vehicle.impressions)} impressions · {vehicle.list_ctr}% CTR</small>
                </div>

                <div className="dealer-cell">
                  <strong>{num(vehicle.unique_viewers)}</strong>
                  <small>{num(vehicle.vdp_views)} views</small>
                </div>

                <div className="dealer-cell">
                  <strong>{vehicle.return_rate}%</strong>
                  <small>{num(vehicle.returning_viewers)} returned</small>
                </div>

                <div className="dealer-cell">
                  <strong>{vehicle.gallery_rate}%</strong>
                  <small>{vehicle.avg_unique_photos} avg photos</small>
                </div>

                <div className="dealer-cell">
                  <strong>{vehicle.intent_rate}%</strong>
                  <small>
                    {num(vehicle.enquiry_clicks)} enquire · {num(vehicle.test_drive_clicks)} drive
                  </small>
                </div>

                <div className="dealer-cell">
                  <strong>{vehicle.views_per_day}</strong>
                  <small>VDP views/day</small>
                </div>

                <Link
                  href={"/admin/analytics/vehicles/" + vehicle.slug + "?days=" + days}
                  className="dealer-profile-link"
                >
                  Profile <ArrowRight size={13} />
                </Link>
              </div>
            ))}

            {!analytics.vehicles.length && (
              <div className="analytics-empty">No inventory records are available yet.</div>
            )}
          </div>
        </div>
      </section>

      <div className="analytics-two-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">SEARCH DEMAND</span><h2>What shoppers ask for</h2></div>
          </div>
          <div className="analytics-search-list">
            {analytics.search_demand.length ? analytics.search_demand.map((item) => (
              <div key={item.query}>
                <strong>“{item.query}”</strong>
                <span>{item.searches} search{item.searches === 1 ? "" : "es"}</span>
                <small>
                  {item.zero_results > 0 ? item.zero_results + " zero-result" : "Inventory matched"}
                  {item.avg_results !== null ? " · avg " + item.avg_results + " results" : ""}
                </small>
              </div>
            )) : <div className="analytics-empty">Smart-search demand will appear as customers search.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">ACQUISITION</span><h2>Where shoppers came from</h2></div>
          </div>
          <div className="analytics-simple-list">
            {analytics.sources.map((item) => (
              <div key={item.source}><strong>{item.source}</strong><span>{item.visitors} visitors</span></div>
            ))}
            {!analytics.sources.length && <div className="analytics-empty">Traffic-source data will appear here.</div>}
          </div>
        </section>
      </div>

      <div className="dealer-analytics-note">
        <strong>How to read this:</strong>
        <span>
          VDP views show interest, but not intent on their own. Watch listing CTR, repeat viewers,
          gallery depth and buyer-intent actions together. A car with high VDP traffic but weak
          photo engagement or contact activity may need better merchandising, pricing or positioning.
        </span>
      </div>
    </AdminShell>
  );
}
