import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CarFront, Clock3, Mail, MapPin, Phone, Search, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";
import {
  humanLeadIntent,
  humanLeadStatus,
  leadPriorities,
  leadReference,
  leadStatuses,
  type LeadRow,
} from "@/lib/leads";
import { formatUSD } from "@/lib/currency";
import { addLeadNote, updateLeadPriority, updateLeadStatus } from "../actions";

export const metadata: Metadata = {
  title: "Lead | Wild Speed Motors",
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
  mileage: number;
  cover_image_url: string | null;
};

type LeadActivity = {
  id: number;
  occurred_at: string;
  kind: string;
  note: string | null;
  old_status: string | null;
  new_status: string | null;
};

type AnalyticsEvent = {
  occurred_at: string;
  event_name: string;
  path: string;
  vehicle_slug: string | null;
  session_id: string;
  properties: Record<string, unknown> | null;
};

function eventLabel(value: string) {
  const labels: Record<string, string> = {
    page_view: "Page viewed",
    vehicle_impression: "Vehicle shown",
    car_card_click: "Vehicle card clicked",
    vehicle_view: "Vehicle page viewed",
    gallery_photo_view: "Photo viewed",
    gallery_fullscreen_open: "Fullscreen gallery",
    gallery_next: "Next photo",
    gallery_previous: "Previous photo",
    smart_search_submit: "Smart search submitted",
    smart_search_results: "Smart search results",
    filter_search_submit: "Filters used",
    enquiry_click: "Enquiry clicked",
    test_drive_click: "Test drive clicked",
    finance_click: "Finance clicked",
    trade_in_click: "Trade-in clicked",
    contact_page_view: "Contact page reached",
    lead_form_started: "Lead form started",
    generate_lead: "Lead submitted",
  };
  return labels[value] ?? value.replace(/_/g, " ");
}

function activityLabel(activity: LeadActivity) {
  if (activity.kind === "status_change") {
    return "Status changed from " + humanLeadStatus(activity.old_status || "") + " to " + humanLeadStatus(activity.new_status || "");
  }
  if (activity.kind === "priority_change") return activity.note || "Priority changed";
  if (activity.kind === "created") return "Website lead created";
  if (activity.kind === "note") return activity.note || "Note added";
  return activity.note || activity.kind;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireStaff();

  const { data: leadData } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!leadData) notFound();

  const lead = leadData as unknown as LeadRow;

  const [vehicleResult, activitiesResult, journeyResult] = await Promise.all([
    lead.vehicle_id
      ? supabase
          .from("vehicles")
          .select("id,slug,make,model,trim,year,price_usd,mileage,cover_image_url")
          .eq("id", lead.vehicle_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("lead_activities")
      .select("id,occurred_at,kind,note,old_status,new_status")
      .eq("lead_id", lead.id)
      .order("occurred_at", { ascending: false }),
    lead.visitor_id
      ? supabase
          .from("analytics_events")
          .select("occurred_at,event_name,path,vehicle_slug,session_id,properties")
          .eq("visitor_id", lead.visitor_id)
          .lte("occurred_at", new Date(new Date(lead.created_at).getTime() + 5 * 60 * 1000).toISOString())
          .gte("occurred_at", new Date(new Date(lead.created_at).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString())
          .order("occurred_at", { ascending: false })
          .limit(250)
      : Promise.resolve({ data: [] }),
  ]);

  const vehicle = vehicleResult.data as unknown as VehicleMini | null;
  const activities = (activitiesResult.data ?? []) as unknown as LeadActivity[];
  const journey = (journeyResult.data ?? []) as unknown as AnalyticsEvent[];

  const sessions = new Set(journey.map((event) => event.session_id)).size;
  const vdpViews = journey.filter((event) => event.event_name === "vehicle_view").length;
  const photoViews = journey.filter((event) => event.event_name === "gallery_photo_view").length;
  const searches = journey.filter((event) => event.event_name === "smart_search_results").length;
  const otherCars = [...new Set(
    journey
      .filter((event) => event.event_name === "vehicle_view" && event.vehicle_slug && event.vehicle_slug !== lead.vehicle_slug)
      .map((event) => event.vehicle_slug as string),
  )];
  const oldest = journey.length ? journey[journey.length - 1]?.occurred_at : null;
  const source = lead.utm_source || lead.referrer_host || "Direct / unknown";

  return (
    <AdminShell title={lead.customer_name} eyebrow={"Lead " + leadReference(lead.lead_number)}>
      <div className="lead-detail-top">
        <Link href="/admin/leads" className="vehicle-analytics-back"><ArrowLeft size={14} /> All leads</Link>
        <span className={"lead-status status-" + lead.status}>{humanLeadStatus(lead.status)}</span>
      </div>

      <section className="lead-detail-hero">
        <div className="lead-contact-card">
          <span className="v3-mono">CUSTOMER</span>
          <h2>{lead.customer_name}</h2>
          <div className="lead-contact-lines">
            {lead.email && <a href={"mailto:" + lead.email}><Mail size={15} /> {lead.email}</a>}
            {lead.phone && <a href={"tel:" + lead.phone}><Phone size={15} /> {lead.phone}</a>}
            <span><UserRound size={15} /> Prefers {lead.preferred_contact}</span>
            <span><MapPin size={15} /> {lead.country_code || "Country unknown"}</span>
          </div>
          <div className="lead-source-box">
            <span>Acquisition source</span>
            <strong>{source}</strong>
            {lead.utm_campaign && <small>Campaign: {lead.utm_campaign}</small>}
          </div>
        </div>

        <div className="lead-vehicle-card">
          {vehicle?.cover_image_url ? <img src={vehicle.cover_image_url} alt="" /> : <div className="lead-vehicle-placeholder"><CarFront size={38} /></div>}
          <div>
            <span className="v3-mono">{humanLeadIntent(lead.intent)}</span>
            <h3>{vehicle ? vehicle.year + " " + vehicle.make + " " + vehicle.model : "General dealership enquiry"}</h3>
            {vehicle && <p>{vehicle.trim || "Used vehicle"} · {vehicle.mileage.toLocaleString()} km · {formatUSD(vehicle.price_usd)}</p>}
            {vehicle && <Link href={"/admin/analytics/vehicles/" + vehicle.slug} className="dealer-profile-link">Vehicle analytics →</Link>}
          </div>
        </div>
      </section>

      <div className="lead-detail-grid">
        <section className="admin-panel lead-work-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">WORK THE LEAD</span><h2>Pipeline controls</h2></div>
          </div>

          <div className="lead-control-stack">
            <form action={updateLeadStatus} className="lead-control-form">
              <input type="hidden" name="lead_id" value={lead.id} />
              <label>
                <span>Status</span>
                <select name="status" defaultValue={lead.status}>
                  {leadStatuses.map((status) => <option key={status} value={status}>{humanLeadStatus(status)}</option>)}
                </select>
              </label>
              <label>
                <span>Lost reason <small>only used if status = Lost</small></span>
                <input name="lost_reason" defaultValue={lead.lost_reason || ""} placeholder="e.g. bought elsewhere, budget, no response" />
              </label>
              <button type="submit">Update status</button>
            </form>

            <form action={updateLeadPriority} className="lead-control-form lead-control-inline">
              <input type="hidden" name="lead_id" value={lead.id} />
              <label>
                <span>Priority</span>
                <select name="priority" defaultValue={lead.priority}>
                  {leadPriorities.map((priority) => <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>)}
                </select>
              </label>
              <button type="submit">Save priority</button>
            </form>

            <form action={addLeadNote} className="lead-note-form">
              <input type="hidden" name="lead_id" value={lead.id} />
              <label>
                <span>Internal note</span>
                <textarea name="note" rows={4} maxLength={4000} required placeholder="Call result, customer preference, follow-up detail..." />
              </label>
              <button type="submit">Add note</button>
            </form>
          </div>
        </section>

        <section className="admin-panel lead-message-panel">
          <div className="admin-panel-head">
            <div><span className="v3-mono">CUSTOMER REQUEST</span><h2>What they sent</h2></div>
          </div>
          <div className="lead-message">
            <p>{lead.message || "No additional message."}</p>
            <dl>
              <div><dt>Created</dt><dd>{new Date(lead.created_at).toLocaleString()}</dd></div>
              <div><dt>Priority</dt><dd>{lead.priority}</dd></div>
              <div><dt>Intent</dt><dd>{humanLeadIntent(lead.intent)}</dd></div>
              <div><dt>Source path</dt><dd>{lead.source_path || "—"}</dd></div>
            </dl>
          </div>
        </section>
      </div>

      <section className="admin-panel lead-journey-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">PRE-LEAD DIGITAL JOURNEY</span><h2>What happened before the enquiry</h2></div>
          <span>Anonymous behavior linked only after submission</span>
        </div>

        <div className="lead-journey-kpis">
          <div><span>Sessions</span><strong>{sessions}</strong></div>
          <div><span>VDP views</span><strong>{vdpViews}</strong></div>
          <div><span>Photos viewed</span><strong>{photoViews}</strong></div>
          <div><span>Smart searches</span><strong>{searches}</strong></div>
          <div><span>Other cars considered</span><strong>{otherCars.length}</strong></div>
          <div><span>First seen</span><strong>{oldest ? new Date(oldest).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</strong></div>
        </div>

        {otherCars.length > 0 && (
          <div className="lead-other-cars">
            <span>Other vehicle pages viewed</span>
            <div>{otherCars.slice(0, 8).map((slug) => <Link key={slug} href={"/cars/" + slug}>{slug}</Link>)}</div>
          </div>
        )}

        <div className="lead-journey-events">
          {journey.slice(0, 60).map((event, index) => (
            <div key={event.occurred_at + event.event_name + index}>
              <span>{new Date(event.occurred_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              <strong>{eventLabel(event.event_name)}</strong>
              <small>
                {event.event_name === "smart_search_results" && typeof event.properties?.query === "string"
                  ? "“" + event.properties.query + "”"
                  : event.vehicle_slug || event.path}
              </small>
            </div>
          ))}
          {!journey.length && <div className="analytics-empty">No prior anonymous journey was available for this lead.</div>}
        </div>
      </section>

      <section className="admin-panel lead-history-panel">
        <div className="admin-panel-head">
          <div><span className="v3-mono">CRM HISTORY</span><h2>Lead activity</h2></div>
        </div>
        <div className="lead-history">
          {activities.map((activity) => (
            <div key={activity.id}>
              <span className="lead-history-dot" />
              <div>
                <strong>{activityLabel(activity)}</strong>
                <small>{new Date(activity.occurred_at).toLocaleString()}</small>
              </div>
            </div>
          ))}
          {!activities.length && <div className="analytics-empty">No CRM activity yet.</div>}
        </div>
      </section>
    </AdminShell>
  );
}
