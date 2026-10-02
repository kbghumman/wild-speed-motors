import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Eye,
  Maximize2,
  MousePointerClick,
  Repeat2,
  Timer,
  Users,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";
import { formatUSD } from "@/lib/currency";
import type { VehicleAnalyticsData } from "@/lib/analytics/types";

export const metadata: Metadata = {
  title: "Vehicle Analytics | Wild Speed Motors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function num(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString();
}

function eventLabel(value: string) {
  const labels: Record<string, string> = {
    enquiry_click: "Enquire",
    test_drive_click: "Book test drive",
    finance_click: "Finance",
    trade_in_click: "Trade-in",
    contact_page_view: "Reached contact page",
    contact_option_click: "Contact channel",
    vehicle_view: "VDP view",
    car_card_click: "Listing click",
    vehicle_impression: "Listing impression",
    gallery_photo_view: "Photo viewed",
    gallery_fullscreen_open: "Fullscreen photo",
    gallery_thumbnail_click: "Thumbnail click",
    gallery_next: "Next photo",
    gallery_previous: "Previous photo",
    gallery_swipe: "Gallery swipe",
    page_engagement: "Page engagement",
    scroll_depth: "Scroll depth",
  };
  return labels[value] ?? value.replace(/_/g, " ");
}

function pct(value: number) {
  return Number(value || 0).toFixed(1) + "%";
}

export default async function VehicleAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const days = [7, 30, 90].includes(Number(query.days)) ? Number(query.days) : 30;
  const { supabase } = await requireStaff();

  const [{ data, error }, { data: images }] = await Promise.all([
    supabase.rpc("get_vehicle_analytics_detail", {
      p_vehicle_slug: slug,
      p_days: days,
    }),
    supabase
      .from("vehicles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data: vehicle }) => {
        if (!vehicle?.id) return { data: [] as Array<{ public_url: string; position: number }> };
        return supabase
          .from("vehicle_images")
          .select("public_url,position")
          .eq("vehicle_id", vehicle.id)
          .order("position", { ascending: true });
      }),
  ]);

  if (!data) notFound();

  const analytics = data as unknown as VehicleAnalyticsData;
  const vehicle = analytics.vehicle;
  const s = analytics.summary;
  const imageRows = (images ?? []) as unknown as Array<{ public_url: string; position: number }>;
  const photoMap = new Map(analytics.photos.map((photo) => [photo.photo_index, photo]));
  const maxDailyViews = Math.max(1, ...analytics.daily.map((item) => item.vdp_views));
  const maxCtaClicks = Math.max(1, ...analytics.ctas.map((item) => item.clicks));
  const activeDays = Math.max(1, Math.min(days, vehicle.days_listed + 1));
  const viewsPerDay = s.vdp_views / activeDays;

  const journey = [
    { label: "Saw listing", value: s.impression_viewers, detail: num(s.impressions) + " impressions" },
    { label: "Clicked listing", value: s.list_clickers, detail: pct(s.list_ctr) + " listing CTR" },
    { label: "Viewed VDP", value: s.unique_viewers, detail: num(s.vdp_views) + " total views" },
    { label: "Used gallery", value: s.gallery_viewers, detail: pct(s.gallery_rate) + " of VDP viewers" },
    { label: "Buyer intent", value: s.intent_visitors, detail: pct(s.intent_rate) + " of VDP viewers" },
  ];
  const journeyMax = Math.max(1, ...journey.map((item) => item.value));

  return (
    <AdminShell title={vehicle.make + " " + vehicle.model} eyebrow="Vehicle analytics profile">
      <div className="vehicle-analytics-top">
        <Link href={"/admin/analytics?days=" + days} className="vehicle-analytics-back">
          <ArrowLeft size={14} /> All vehicle analytics
        </Link>

        <div className="analytics-range">
          {[7, 30, 90].map((value) => (
            <Link
              key={value}
              href={"/admin/analytics/vehicles/" + vehicle.slug + "?days=" + value}
              className={days === value ? "active" : ""}
            >
              {value} days
            </Link>
          ))}
        </div>
      </div>

      {error && <div className="analytics-error">Vehicle analytics could not be loaded: {error.message}</div>}

      <section className="vehicle-profile-hero">
        <div className="vehicle-profile-image">
          {vehicle.cover_image_url ? <img src={vehicle.cover_image_url} alt="" /> : <div />}
        </div>
        <div className="vehicle-profile-copy">
          <span className="v3-mono">{vehicle.year} · {vehicle.status.toUpperCase()}</span>
          <h2>{vehicle.make} {vehicle.model}</h2>
          <p>{vehicle.trim || "Used vehicle"} · {vehicle.mileage.toLocaleString()} km</p>
          <div className="vehicle-profile-meta">
            <strong>{formatUSD(vehicle.price_usd)}</strong>
            <span>{vehicle.stock_number ? "Stock " + vehicle.stock_number : "No stock number"}</span>
            <span>{vehicle.days_listed} days listed</span>
          </div>
          <Link href={"/cars/" + vehicle.slug} className="dealer-profile-link">
            Open public VDP <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <div className="vehicle-kpi-grid">
        <article><Eye size={19} /><span>VDP views</span><strong>{num(s.vdp_views)}</strong><small>{num(s.unique_viewers)} unique viewers</small></article>
        <article><Users size={19} /><span>Repeat shoppers</span><strong>{num(s.returning_viewers)}</strong><small>{pct(s.return_rate)} came back in another session</small></article>
        <article><MousePointerClick size={19} /><span>Listing CTR</span><strong>{pct(s.list_ctr)}</strong><small>{num(s.list_clickers)} of {num(s.impression_viewers)} exposed shoppers</small></article>
        <article><Camera size={19} /><span>Gallery reach</span><strong>{pct(s.gallery_rate)}</strong><small>{s.avg_unique_photos} unique photos per gallery viewer</small></article>
        <article><Timer size={19} /><span>Avg engaged time</span><strong>{Number(s.avg_engaged_seconds).toFixed(0)}s</strong><small>{pct(s.deep_scroll_rate)} reached 75% scroll</small></article>
        <article><Maximize2 size={19} /><span>Fullscreen opens</span><strong>{num(s.fullscreen_opens)}</strong><small>{num(s.gallery_actions)} total gallery actions</small></article>
        <article><MousePointerClick size={19} /><span>Buyer-intent people</span><strong>{num(s.intent_visitors)}</strong><small>{pct(s.intent_rate)} of VDP viewers</small></article>
        <article><Repeat2 size={19} /><span>VDP velocity</span><strong>{viewsPerDay.toFixed(2)}</strong><small>views/day in this window</small></article>
      </div>

      <section className="admin-panel vehicle-journey-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">SHOPPER JOURNEY</span><h2>How this car moves people toward contact</h2></div>
          <span>Unique people · direct links can enter at VDP</span>
        </div>
        <div className="vehicle-journey">
          {journey.map((step) => (
            <div key={step.label} className="vehicle-journey-step">
              <div>
                <span>{step.label}</span>
                <strong>{num(step.value)}</strong>
                <small>{step.detail}</small>
              </div>
              <div className="vehicle-journey-bar">
                <span style={{ width: Math.max(step.value ? 4 : 0, (step.value / journeyMax) * 100) + "%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="analytics-two-column vehicle-profile-columns">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">CTA ATTRIBUTION</span><h2>What people clicked on this car</h2></div>
          </div>
          <div className="vehicle-cta-list">
            {analytics.ctas.length ? analytics.ctas.map((cta) => (
              <div key={cta.event_name}>
                <div>
                  <strong>{eventLabel(cta.event_name)}</strong>
                  <small>{cta.visitors} unique people</small>
                </div>
                <div className="vehicle-cta-bar"><span style={{ width: Math.max(4, (cta.clicks / maxCtaClicks) * 100) + "%" }} /></div>
                <b>{cta.clicks}</b>
              </div>
            )) : <div className="analytics-empty">No vehicle-specific CTA activity yet.</div>}
          </div>
        </section>

        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">ENGAGEMENT QUALITY</span><h2>Beyond a simple VDP view</h2></div>
          </div>
          <div className="vehicle-quality-grid">
            <div><span>Gallery viewers</span><strong>{num(s.gallery_viewers)}</strong><small>{pct(s.gallery_rate)} of VDP audience</small></div>
            <div><span>Avg photo depth</span><strong>{s.avg_unique_photos}</strong><small>unique photos viewed</small></div>
            <div><span>75% scroll viewers</span><strong>{num(s.deep_scroll_viewers)}</strong><small>{pct(s.deep_scroll_rate)} of VDP audience</small></div>
            <div><span>Contact-page arrivals</span><strong>{num(s.contact_page_views)}</strong><small>after a vehicle CTA</small></div>
          </div>
        </section>
      </div>

      <section className="admin-panel analytics-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">DEMAND OVER TIME</span><h2>Daily VDP activity</h2></div>
          <span>{days}-day window</span>
        </div>
        <div className="vehicle-daily-chart">
          {analytics.daily.length ? analytics.daily.map((item) => (
            <div className="vehicle-day-column" key={item.day}>
              <div className="vehicle-day-bar">
                <span style={{ height: Math.max(item.vdp_views ? 8 : 0, (item.vdp_views / maxDailyViews) * 100) + "%" }} />
              </div>
              <strong>{item.vdp_views}</strong>
              <small>{new Date(item.day + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</small>
            </div>
          )) : <div className="analytics-empty">Daily vehicle activity will appear here.</div>}
        </div>
      </section>

      <section className="admin-panel analytics-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">PHOTO PERFORMANCE</span><h2>Which photos shoppers actually view</h2></div>
          <span>{imageRows.length} uploaded photos</span>
        </div>
        <div className="vehicle-photo-analytics">
          {imageRows.length ? imageRows.map((image, index) => {
            const position = index + 1;
            const stats = photoMap.get(position);
            return (
              <article key={image.public_url}>
                <div className="vehicle-photo-thumb"><img src={image.public_url} alt="" /></div>
                <div>
                  <span>Photo {position}</span>
                  <strong>{num(stats?.views ?? 0)} views</strong>
                  <small>{num(stats?.viewers ?? 0)} people · {num(stats?.thumbnail_clicks ?? 0)} thumbnail clicks</small>
                </div>
              </article>
            );
          }) : <div className="analytics-empty">No vehicle photos found.</div>}
        </div>
      </section>

      <div className="analytics-three-column">
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">SOURCE</span><h2>Where VDP viewers came from</h2></div></div>
          <div className="analytics-simple-list">
            {analytics.sources.map((item) => <div key={item.source}><strong>{item.source}</strong><span>{item.viewers} viewers</span></div>)}
            {!analytics.sources.length && <div className="analytics-empty">No source data yet.</div>}
          </div>
        </section>
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">DEVICE</span><h2>How they viewed this car</h2></div></div>
          <div className="analytics-simple-list">
            {analytics.devices.map((item) => <div key={item.device}><strong>{item.device}</strong><span>{item.viewers} viewers</span></div>)}
            {!analytics.devices.length && <div className="analytics-empty">No device data yet.</div>}
          </div>
        </section>
        <section className="admin-panel analytics-panel">
          <div className="admin-panel-head"><div><span className="v3-mono">COUNTRY</span><h2>Viewer geography</h2></div></div>
          <div className="analytics-simple-list">
            {analytics.countries.map((item) => <div key={item.country}><strong>{item.country}</strong><span>{item.viewers} viewers</span></div>)}
            {!analytics.countries.length && <div className="analytics-empty">No country data yet.</div>}
          </div>
        </section>
      </div>

      <section className="admin-panel analytics-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">RECENT ACTIVITY</span><h2>Anonymous event stream for this vehicle</h2></div>
        </div>
        <div className="analytics-activity vehicle-activity">
          {analytics.recent.slice(0, 40).map((event, index) => (
            <div key={event.occurred_at + event.event_name + index}>
              <span>{new Date(event.occurred_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              <strong>{eventLabel(event.event_name)}</strong>
              <small>Visitor {event.visitor_id.slice(0, 8)} · session {event.session_id.slice(0, 8)}</small>
            </div>
          ))}
          {!analytics.recent.length && <div className="analytics-empty">This vehicle has no recorded activity yet.</div>}
        </div>
      </section>
    </AdminShell>
  );
}
