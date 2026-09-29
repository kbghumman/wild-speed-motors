"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/admin/login?setup=1");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=invalid");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=invalid");
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

  redirect("/admin");
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}


export async function refreshInventoryCache() {
  if (!hasSupabaseEnv()) return { ok: false };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "staff"].includes(profile.role)) return { ok: false };

  updateTag("inventory");
  return { ok: true };
}
