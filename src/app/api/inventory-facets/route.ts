import { NextResponse } from "next/server";
import {
  buildInventoryFacets,
  type FacetKey,
  type FacetSelections,
} from "@/lib/inventory-facets";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const keys: FacetKey[] = [
  "make",
  "model",
  "body",
  "transmission",
  "fuel",
  "seats",
  "budget",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selections = {} as Partial<FacetSelections>;

  for (const key of keys) {
    const value = searchParams.get(key)?.trim();
    if (value) selections[key] = value;
  }

  const cars = await getPublicCars();
  const payload = buildInventoryFacets(cars, selections);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
