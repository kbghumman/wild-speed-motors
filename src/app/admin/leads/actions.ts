"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { leadPriorities, leadStatuses } from "@/lib/leads";

function leadPath(id: string) {
  return "/admin/leads/" + id;
}

export async function updateLeadStatus(formData: FormData) {
  const id = String(formData.get("lead_id") || "");
  const status = String(formData.get("status") || "");
  const lostReason = String(formData.get("lost_reason") || "").trim();

  if (!id || !leadStatuses.includes(status as (typeof leadStatuses)[number])) return;

  const { supabase } = await requireStaff();
  await supabase
    .from("leads")
    .update({
      status,
      lost_reason: status === "lost" ? lostReason || null : null,
    })
    .eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath(leadPath(id));
  revalidatePath("/admin/analytics");
}

export async function updateLeadPriority(formData: FormData) {
  const id = String(formData.get("lead_id") || "");
  const priority = String(formData.get("priority") || "");

  if (!id || !leadPriorities.includes(priority as (typeof leadPriorities)[number])) return;

  const { supabase } = await requireStaff();
  await supabase.from("leads").update({ priority }).eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath(leadPath(id));
}

export async function addLeadNote(formData: FormData) {
  const id = String(formData.get("lead_id") || "");
  const note = String(formData.get("note") || "").trim();

  if (!id || !note) return;

  const { supabase, user } = await requireStaff();

  await supabase.from("lead_activities").insert({
    lead_id: id,
    kind: "note",
    note: note.slice(0, 4000),
    created_by: user.id,
  });

  await supabase
    .from("leads")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath(leadPath(id));
}
