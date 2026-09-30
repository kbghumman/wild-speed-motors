import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const { url } = getSupabaseEnv();
  const supabase = createPublicClient();

  const { data, error, count } = await supabase
    .from("vehicles")
    .select("slug,make,model,status", { count: "exact" })
    .eq("status", "live")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(5);

  return NextResponse.json(
    {
      supabaseConfigured: true,
      projectUrl: url,
      publicInventoryConnected: !error,
      liveVehicleCount: count ?? 0,
      latestLiveVehicles: data ?? [],
      error: error?.message ?? null,
      checkedAt: new Date().toISOString(),
    },
    {
      status: error ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
