import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CarFront,
  Eye,
  Gauge,
  MousePointerClick,
  Search,
  Users,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Analytics | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Summary = {
  visitors: number;
  sessions: number;
  page_views: number;
  vehicle_views: number;
  searches: number;
  voice_searches: number;
  intent_actions: number;
  enquiry_clicks: number;
  test_drive_clicks: number;
  finance_clicks: number;
  gallery_actions: number;
};

type Dashboard = {
  days: number;
  summary: Summary;
  daily: Array<{
    day: string;
    visitors: number;
    sessions: number;
    vehicle_views: number;
    intent_actions: number;
  }>;
  vehicles: Array<{
    vehicle_slug: string;
    make: string;
    model: string;
    views: number;
    unique_viewers: number;
    gallery_actions: number;
    enquiries: number;
    test_drives: number;
    finance_clicks: number;
  }>;
  searches: Array<{
    query: string;
    searches: number;
    avg_results: number | null;
    zero_result_count: number;
  }>;
  sources: Array<{ source: string; visitors: number; sessions: number }>;
  devices: Array<{ device: string; visitors: number }>;
  pages: Array<{ path: string; views: number; visitors: number }>;
  countries: Array<{ country: string; visitors: number }>;
  recent: Array<{
    occurred_at: string;
    event_name: string;
    path: string;
    vehicle_slug: string | null;
    properties: Record<string, unknown>;
  }>;
};

function number(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString();
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return "0.0%";
  return ((numerator / denominator) * 100).toFixed(1) + "%";
}

function eventLabel(event: string) {
  return event.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = [7, 30, 90].includes(Number(params.days)) ? Number(params.days) : 30;
  const { supabase } = await requireStaff();

  const { data, error } = await supabase.rpc("get_analytics_dashboard", {
    p_days: days,
  });

  const dashboard = (data ?? {
    days,
    summary: {},
    daily: [],
    vehicles: [],
    searches: [],
    sources: [],
    devices: [],
    pages: [],
    countries: [],
    recent: [],
  }) as unknown as Dashboard;

  const s = {
    visitors: 0,
    sessions: 0,
    page_views: 0,
    vehicle_views: 0,
    searches: 0,
    voice_searches: 0,
    intent_actions: 0,
    enquiry_clicks: 0,
    test_drive_clicks: 0,
    finance_clicks: 0,
    gallery_actions: 0,
    ...dashboard.summary,
  };

  const maxDaily = Math.max(1, ...dashboard.daily.map((item) => item.visitors));
  const vehicleToIntent = percent(s.intent_actions, s.vehicle_views);

  return (
    <AdminShell title="Customer analytics" eyebrow="Dealer intelligence">
      <div className="analytics-toolbar">
        <div>
          <span className="v3-mono">FIRST-PARTY ANALYTICS</span>
          <p>Anonymous visitor, search, vehicle and conversion behavior. No passwords, form contents or payment data are recorded.</p>
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

      <div className="analytics-summary-grid">
        <article><Users size={20} /><span>Visitors</span><strong>{number(s.visitors)}</strong><small>{number(s.sessions)} sessions</small></article>
        <article><Eye size={20} /><span>Vehicle views</span><strong>{number(s.vehicle_views)}</strong><small>{number(s.page_views)} total page views</small></article>
        <article><Search size={20} /><span>Searches</span><strong>{number(s.searches)}</strong><small>{number(s.voice_searches)} by voice</small></article>
        <article><MousePointerClick size={20} /><span>Buyer-intent actions</span><strong>{number(s.intent_actions)}</strong><small>{vehicleToIntent} per vehicle view</small></article>
        <article><Gauge size={20} /><span>Gallery actions</span><strong>{number(s.gallery_actions)}</strong><small>Photo browsing interactions</small></article>
        <article><CarFront size={20} /><span>Enquiry clicks</span><strong>{number(s.enquiry_clicks)}</strong><small>{number(s.test_drive_clicks)} test-drive clicks</small></article>
      </div>

      {s.visitors === 0 && (
        <div className="analytics-first-run">
          <BarChart3 size={24} />
          <div>
            <strong>Tracking is live from this deployment onward.</strong>
            <p>There is no fabricated historical data. This dashboard will start filling as real customers use the public website.</p>
          </div>
        </div>
      )}

      <section className="admin-panel analytics-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">TRAFFIC</span><h2>Daily audience</h2></div>
          <span>{days}-day window</span>
        </div>
        <div className="analytics-daily">
          {dashboard.daily.length ? dashboard.daily.map((item) => (
            <div className="analytics-day" key={item.day}>
              <div className="analytics-day-meta">
                <span>{new Date(item.day + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <strong>{item.visitors}</strong>
              </div>
              <div className="analytics-bar"><span style={{ width: Math.max(3, (item.visitors / maxDaily) * 100) + "%" }} /></div>
              <small>{item.vehicle_views} vehicle views · {item.intent_actions} intent actions</small>
            </div>
          )) : <div className="analytics-empty">No traffic has been recorded yet.</div>}
        </div>
      </section>

      <div className="analytics-two-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">INVENTORY PERFORMANCE</span><h2>Most viewed cars</h2></div>
          </div>
          <div className="analytics-table">
            <div className="analytics-row analytics-row-head">
              <span>Vehicle</span><span>Views</span><span>People</span><span>Gallery</span><span>Intent</span>
            </div>
            {dashboard.vehicles.length ? dashboard.vehicles.map((vehicle) => {
              const intent = vehicle.enquiries + vehicle.test_drives + vehicle.finance_clicks;
              return (
                <div className="analytics-row" key={vehicle.vehicle_slug}>
                  <Link href={"/cars/" + vehicle.vehicle_slug}>
                    <strong>{vehicle.make} {vehicle.model}</strong>
                    <small>{vehicle.vehicle_slug}</small>
                  </Link>
                  <span>{vehicle.views}</span>
                  <span>{vehicle.unique_viewers}</span>
                  <span>{vehicle.gallery_actions}</span>
                  <span>{intent}</span>
                </div>
              );
            }) : <div className="analytics-empty">Vehicle performance will appear after customers open listings.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">SEARCH DEMAND</span><h2>What customers want</h2></div>
          </div>
          <div className="analytics-search-list">
            {dashboard.searches.length ? dashboard.searches.map((item) => (
              <div key={item.query}>
                <strong>“{item.query}”</strong>
                <span>{item.searches} searches</span>
                <small>
                  {item.zero_result_count > 0
                    ? item.zero_result_count + " zero-result search" + (item.zero_result_count === 1 ? "" : "es")
                    : "Matches found"}
                  {item.avg_results !== null ? " · avg " + Number(item.avg_results).toFixed(1) + " results" : ""}
                </small>
              </div>
            )) : <div className="analytics-empty">Smart Search demand will appear here.</div>}
          </div>
        </section>
      </div>

      <div className="analytics-three-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">ACQUISITION</span><h2>Traffic sources</h2></div></div>
          <div className="analytics-simple-list">
            {dashboard.sources.map((item) => <div key={item.source}><strong>{item.source}</strong><span>{item.visitors} visitors</span></div>)}
            {!dashboard.sources.length && <div className="analytics-empty">No source data yet.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">DEVICES</span><h2>How they browse</h2></div></div>
          <div className="analytics-simple-list">
            {dashboard.devices.map((item) => <div key={item.device}><strong>{item.device}</strong><span>{item.visitors} visitors</span></div>)}
            {!dashboard.devices.length && <div className="analytics-empty">No device data yet.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">GEOGRAPHY</span><h2>Countries</h2></div></div>
          <div className="analytics-simple-list">
            {dashboard.countries.map((item) => <div key={item.country}><strong>{item.country}</strong><span>{item.visitors} visitors</span></div>)}
            {!dashboard.countries.length && <div className="analytics-empty">Country data appears on Vercel traffic.</div>}
          </div>
        </section>
      </div>

      <div className="analytics-two-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">CONTENT</span><h2>Top pages</h2></div></div>
          <div className="analytics-simple-list">
            {dashboard.pages.map((item) => <div key={item.path}><strong>{item.path}</strong><span>{item.views} views · {item.visitors} people</span></div>)}
            {!dashboard.pages.length && <div className="analytics-empty">No page data yet.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">RECENT ACTIVITY</span><h2>Live event stream</h2></div></div>
          <div className="analytics-activity">
            {dashboard.recent.slice(0, 30).map((event, index) => (
              <div key={event.occurred_at + event.event_name + index}>
                <span>{new Date(event.occurred_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <strong>{eventLabel(event.event_name)}</strong>
                <small>{event.vehicle_slug || event.path}</small>
              </div>
            ))}
            {!dashboard.recent.length && <div className="analytics-empty">Events will appear here as customers use the site.</div>}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
