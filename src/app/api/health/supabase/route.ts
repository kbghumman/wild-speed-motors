import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      supabaseConfigured: hasSupabaseEnv(),
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
