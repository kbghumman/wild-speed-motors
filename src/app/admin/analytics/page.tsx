import type { Metadata } from "next";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Analytics | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type AnalyticsEvent = {
  occurred_at: string;
  event_name: string;
  visitor_id: string;
  session_id: string;
  path: string;
  vehicle_slug: string | null;
  properties: Record<string, unknown> | null;
  utm_source: string | null;
  referrer_host: string | null;
  device_type: string | null;
  country_code: string | null;
};

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pct(part: number, total: number) {
  return total ? ((part / total) * 100).toFixed(1) + "%" : "0.0%";
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = [7, 30, 90].includes(Number(params.days)) ? Number(params.days) : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { supabase } = await requireStaff();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("occurred_at,event_name,visitor_id,session_id,path,vehicle_slug,properties,utm_source,referrer_host,device_type,country_code")
    .gte("occurred_at", since)
    .order("occurred_at", { ascending: false })
    .limit(20000);

  const events = (data ?? []) as unknown as AnalyticsEvent[];
  const visitors = new Set(events.map((event) => event.visitor_id)).size;
  const sessions = new Set(events.map((event) => event.session_id)).size;
  const count = (name: string) => events.filter((event) => event.event_name === name).length;

  const pageViews = count("page_view");
  const vehicleViews = count("vehicle_view");
  const searches = events.filter((event) =>
    ["smart_search_submit", "filter_search_submit"].includes(event.event_name),
  ).length;
  const voiceSearches = count("voice_search_completed");
  const galleryActions = events.filter((event) => event.event_name.startsWith("gallery_")).length;
  const enquiryClicks = count("enquiry_click");
  const testDriveClicks = count("test_drive_click");
  const financeClicks = count("finance_click");
  const tradeInClicks = count("trade_in_click");
  const intentActions = enquiryClicks + testDriveClicks + financeClicks + tradeInClicks;

  const vehicleMap = new Map<string, {
    slug: string;
    make: string;
    model: string;
    views: number;
    people: Set<string>;
    gallery: number;
    intent: number;
  }>();

  for (const event of events) {
    if (!event.vehicle_slug) continue;
    const properties = event.properties ?? {};
    const current = vehicleMap.get(event.vehicle_slug) ?? {
      slug: event.vehicle_slug,
      make: typeof properties.make === "string" ? properties.make : "",
      model: typeof properties.model === "string" ? properties.model : "",
      views: 0,
      people: new Set<string>(),
      gallery: 0,
      intent: 0,
    };

    if (!current.make && typeof properties.make === "string") current.make = properties.make;
    if (!current.model && typeof properties.model === "string") current.model = properties.model;

    if (event.event_name === "vehicle_view") {
      current.views += 1;
      current.people.add(event.visitor_id);
    }
    if (event.event_name.startsWith("gallery_")) current.gallery += 1;
    if (["enquiry_click","test_drive_click","finance_click","trade_in_click"].includes(event.event_name)) {
      current.intent += 1;
    }

    vehicleMap.set(event.vehicle_slug, current);
  }

  const vehicles = [...vehicleMap.values()]
    .sort((a, b) => b.views - a.views || b.people.size - a.people.size)
    .slice(0, 20);

  const searchMap = new Map<string, { searches: number; zero: number; results: number }>();
  for (const event of events) {
    if (event.event_name !== "smart_search_results") continue;
    const query = typeof event.properties?.query === "string" ? event.properties.query.trim() : "";
    if (!query) continue;

    const resultCount = typeof event.properties?.result_count === "number"
      ? event.properties.result_count
      : 0;

    const key = query.toLowerCase();
    const current = searchMap.get(key) ?? { searches: 0, zero: 0, results: 0 };
    current.searches += 1;
    current.results += resultCount;
    if (resultCount === 0) current.zero += 1;
    searchMap.set(key, current);
  }

  const searchDemand = [...searchMap.entries()]
    .map(([query, value]) => ({ query, ...value }))
    .sort((a, b) => b.searches - a.searches || b.zero - a.zero)
    .slice(0, 25);

  function grouped(
    getter: (event: AnalyticsEvent) => string,
    onlyPageViews = true,
  ) {
    const map = new Map<string, Set<string>>();
    for (const event of events) {
      if (onlyPageViews && event.event_name !== "page_view") continue;
      const key = getter(event) || "Unknown";
      const set = map.get(key) ?? new Set<string>();
      set.add(event.visitor_id);
      map.set(key, set);
    }
    return [...map.entries()]
      .map(([name, people]) => ({ name, visitors: people.size }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 15);
  }

  const sources = grouped((event) => event.utm_source || event.referrer_host || "Direct");
  const devices = grouped((event) => event.device_type || "Unknown");
  const countries = grouped((event) => event.country_code || "Unknown");

  const pageMap = new Map<string, { views: number; people: Set<string> }>();
  for (const event of events) {
    if (event.event_name !== "page_view") continue;
    const current = pageMap.get(event.path) ?? { views: 0, people: new Set<string>() };
    current.views += 1;
    current.people.add(event.visitor_id);
    pageMap.set(event.path, current);
  }
  const pages = [...pageMap.entries()]
    .map(([path, value]) => ({ path, views: value.views, visitors: value.people.size }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const dayMap = new Map<string, Set<string>>();
  for (const event of events) {
    if (event.event_name !== "page_view") continue;
    const day = event.occurred_at.slice(0, 10);
    const set = dayMap.get(day) ?? new Set<string>();
    set.add(event.visitor_id);
    dayMap.set(day, set);
  }
  const daily = [...dayMap.entries()]
    .map(([day, people]) => ({ day, visitors: people.size }))
    .sort((a, b) => a.day.localeCompare(b.day));

  return (
    <AdminShell title="Customer analytics" eyebrow="Dealer intelligence">
      <div className="analytics-toolbar">
        <div>
          <span className="v3-mono">FIRST-PARTY ANALYTICS</span>
          <p>Anonymous visitor, search, vehicle and conversion behavior. Passwords, contact-form contents and payment details are not recorded.</p>
        </div>
        <div className="analytics-range">
          {[7, 30, 90].map((value) => (
            <Link key={value} href={"/admin/analytics?days=" + value} className={days === value ? "active" : ""}>
              {value} days
            </Link>
          ))}
        </div>
      </div>

      {error && <div className="analytics-error">Analytics could not be loaded: {error.message}</div>}

      <div className="analytics-summary-grid">
        <article><span>Visitors</span><strong>{visitors.toLocaleString()}</strong><small>{sessions.toLocaleString()} sessions</small></article>
        <article><span>Page views</span><strong>{pageViews.toLocaleString()}</strong><small>{vehicleViews.toLocaleString()} vehicle views</small></article>
        <article><span>Searches</span><strong>{searches.toLocaleString()}</strong><small>{voiceSearches.toLocaleString()} voice searches</small></article>
        <article><span>Buyer intent</span><strong>{intentActions.toLocaleString()}</strong><small>{pct(intentActions, vehicleViews)} of vehicle views</small></article>
        <article><span>Gallery actions</span><strong>{galleryActions.toLocaleString()}</strong><small>Photo browsing activity</small></article>
        <article><span>Enquiries</span><strong>{enquiryClicks.toLocaleString()}</strong><small>{testDriveClicks.toLocaleString()} test-drive clicks</small></article>
      </div>

      {visitors === 0 && (
        <div className="analytics-first-run">
          <div>
            <strong>Tracking is live from this deployment onward.</strong>
            <p>No historical numbers are invented. Real customer activity will start filling this dashboard automatically.</p>
          </div>
        </div>
      )}

      <section className="admin-panel analytics-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">TRAFFIC</span><h2>Daily visitors</h2></div>
          <span>{days}-day window</span>
        </div>
        <div className="analytics-simple-list">
          {daily.length ? daily.map((item) => (
            <div key={item.day}><strong>{item.day}</strong><span>{item.visitors} visitors</span></div>
          )) : <div className="analytics-empty">No traffic recorded yet.</div>}
        </div>
      </section>

      <div className="analytics-two-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">INVENTORY PERFORMANCE</span><h2>Most viewed cars</h2></div></div>
          <div className="analytics-table">
            <div className="analytics-row analytics-row-head"><span>Vehicle</span><span>Views</span><span>People</span><span>Gallery</span><span>Intent</span></div>
            {vehicles.length ? vehicles.map((vehicle) => (
              <div className="analytics-row" key={vehicle.slug}>
                <Link href={"/cars/" + vehicle.slug}>
                  <strong>{vehicle.make || "Vehicle"} {vehicle.model}</strong>
                  <small>{vehicle.slug}</small>
                </Link>
                <span>{vehicle.views}</span>
                <span>{vehicle.people.size}</span>
                <span>{vehicle.gallery}</span>
                <span>{vehicle.intent}</span>
              </div>
            )) : <div className="analytics-empty">Vehicle performance will appear after customers open listings.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">SEARCH DEMAND</span><h2>What customers want</h2></div></div>
          <div className="analytics-search-list">
            {searchDemand.length ? searchDemand.map((item) => (
              <div key={item.query}>
                <strong>“{item.query}”</strong>
                <span>{item.searches} search{item.searches === 1 ? "" : "es"}</span>
                <small>{item.zero ? item.zero + " zero-result" : "Matches found"} · avg {(item.results / item.searches).toFixed(1)} results</small>
              </div>
            )) : <div className="analytics-empty">Smart Search demand will appear here.</div>}
          </div>
        </section>
      </div>

      <div className="analytics-three-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">ACQUISITION</span><h2>Traffic sources</h2></div></div>
          <div className="analytics-simple-list">{sources.map((item) => <div key={item.name}><strong>{item.name}</strong><span>{item.visitors}</span></div>)}</div>
        </section>
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">DEVICES</span><h2>How they browse</h2></div></div>
          <div className="analytics-simple-list">{devices.map((item) => <div key={item.name}><strong>{item.name}</strong><span>{item.visitors}</span></div>)}</div>
        </section>
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">GEOGRAPHY</span><h2>Countries</h2></div></div>
          <div className="analytics-simple-list">{countries.map((item) => <div key={item.name}><strong>{item.name}</strong><span>{item.visitors}</span></div>)}</div>
        </section>
      </div>

      <div className="analytics-two-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">CONTENT</span><h2>Top pages</h2></div></div>
          <div className="analytics-simple-list">
            {pages.map((item) => <div key={item.path}><strong>{item.path}</strong><span>{item.views} views · {item.visitors} people</span></div>)}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">RECENT ACTIVITY</span><h2>Event stream</h2></div></div>
          <div className="analytics-activity">
            {events.slice(0, 30).map((event, index) => (
              <div key={event.occurred_at + event.event_name + index}>
                <span>{new Date(event.occurred_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <strong>{label(event.event_name)}</strong>
                <small>{event.vehicle_slug || event.path}</small>
              </div>
            ))}
            {!events.length && <div className="analytics-empty">Events will appear here as customers use the site.</div>}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
