import { NextResponse } from "next/server";
import { getModelsForManufacturer } from "@/data/models";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make")?.trim() ?? "";
  const models = make ? getModelsForManufacturer(make) : [];

  return NextResponse.json(
    { models },
    { headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } },
  );
}
