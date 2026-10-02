export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "appointment",
  "negotiating",
  "won",
  "lost",
] as const;

export const leadPriorities = ["low", "normal", "high", "urgent"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadPriority = (typeof leadPriorities)[number];

export type LeadRow = {
  id: string;
  lead_number: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  vehicle_id: string | null;
  vehicle_slug: string | null;
  intent: string;
  status: LeadStatus;
  priority: LeadPriority;
  customer_name: string;
  email: string | null;
  phone: string | null;
  preferred_contact: string;
  message: string | null;
  visitor_id: string | null;
  session_id: string | null;
  source_path: string | null;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  country_code: string | null;
  assigned_to: string | null;
  first_contacted_at: string | null;
  qualified_at: string | null;
  appointment_at: string | null;
  won_at: string | null;
  lost_at: string | null;
  lost_reason: string | null;
};

export function leadReference(number: number) {
  return "WSM-" + String(number).padStart(5, "0");
}

export function humanLeadStatus(status: string) {
  if (status === "appointment") return "Appointment";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function humanLeadIntent(intent: string) {
  const labels: Record<string, string> = {
    general: "General enquiry",
    enquiry: "Vehicle enquiry",
    "test-drive": "Test drive",
    finance: "Finance",
    "trade-in": "Trade-in",
  };
  return labels[intent] ?? intent;
}
