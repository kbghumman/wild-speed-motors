import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "staff";

export async function requireStaff() {
  if (!hasSupabaseEnv()) {
    redirect("/admin/login?setup=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-authorized");
  }

  return {
    supabase,
    user,
    role: profile.role as StaffRole,
  };
}
