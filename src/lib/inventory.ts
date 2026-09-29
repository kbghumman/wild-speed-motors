import { unstable_cache } from "next/cache";
import { cars as demoCars, type Car } from "@/data/cars";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";

type VehicleRow = {
  id: string; slug: string; make: string; model: string; trim: string | null;
  year: number; mileage: number; price_usd: number; monthly_usd: number | null;
  fuel: string | null; transmission: string | null; drivetrain: string | null;
  body: string | null; engine: string | null; exterior_color: string | null;
  interior_color: string | null; shaken_expiry: string | null; location: string | null;
  condition: string | null; description: string | null; features: string[] | null;
  cover_image_url: string | null; status: string; stock_number: string | null;
  chassis_number: string | null;
};

type ImageRow = { public_url: string; position: number };

function toCar(row: VehicleRow, images: ImageRow[] = []): Car {
  const gallery = images.slice().sort((a,b) => a.position - b.position).map((image) => image.public_url);
  return {
    id: row.id, slug: row.slug, make: row.make, model: row.model, trim: row.trim ?? "",
    year: row.year, mileage: row.mileage, price: row.price_usd, monthly: row.monthly_usd ?? 0,
    fuel: row.fuel ?? "", transmission: row.transmission ?? "", drivetrain: row.drivetrain ?? "",
    body: row.body ?? "", engine: row.engine ?? "", exteriorColor: row.exterior_color ?? "",
    interiorColor: row.interior_color ?? "", shakenExpiry: row.shaken_expiry ?? "",
    location: row.location ?? "", condition: row.condition ?? "", description: row.description ?? "",
    features: row.features ?? [], status: row.status, stockNumber: row.stock_number ?? "",
    chassisNumber: row.chassis_number ?? "", image: row.cover_image_url ?? gallery[0] ?? "",
    images: gallery.length ? gallery : row.cover_image_url ? [row.cover_image_url] : [],
  };
}

const publicSelect =
  "id,slug,make,model,trim,year,mileage,price_usd,monthly_usd,fuel,transmission,drivetrain,body,engine,exterior_color,interior_color,shaken_expiry,location,condition,description,features,cover_image_url,status,stock_number,chassis_number";

async function queryPublicCars(): Promise<Car[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(publicSelect)
    .eq("status", "live")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load public inventory:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as VehicleRow[]).map((row) => toCar(row));
}

const cachedPublicCars = unstable_cache(
  queryPublicCars,
  ["wild-speed-public-inventory"],
  { revalidate: 60, tags: ["inventory"] },
);

async function queryPublicCarBySlug(slug: string): Promise<Car | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(publicSelect)
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();

  if (error || !data) return null;

  const { data: imageRows } = await supabase
    .from("vehicle_images")
    .select("public_url,position")
    .eq("vehicle_id", (data as { id: string }).id)
    .order("position", { ascending: true });

  return toCar(data as unknown as VehicleRow, (imageRows ?? []) as ImageRow[]);
}

const cachedPublicCarBySlug = unstable_cache(
  queryPublicCarBySlug,
  ["wild-speed-public-car"],
  { revalidate: 60, tags: ["inventory"] },
);

export async function getPublicCars(): Promise<Car[]> {
  if (!hasSupabaseEnv()) return demoCars;
  return cachedPublicCars();
}

export async function getPublicCarBySlug(slug: string): Promise<Car | null> {
  if (!hasSupabaseEnv()) return demoCars.find((car) => car.slug === slug) ?? null;
  return cachedPublicCarBySlug(slug);
}

export async function getAdminCars(): Promise<Car[]> {
  if (!hasSupabaseEnv()) return demoCars.map((car) => ({ ...car, status: "live" }));

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(publicSelect)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load admin inventory:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as VehicleRow[]).map((row) => toCar(row));
}
