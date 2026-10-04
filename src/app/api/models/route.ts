import { NextResponse } from "next/server";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make")?.trim() ?? "";

  const cars = await getPublicCars();
  const models = make
    ? [...new Set(cars.filter((car) => car.make === make).map((car) => car.model).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b))
    : [];

  return NextResponse.json(
    { models },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
