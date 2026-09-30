import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CarCard from "@/components/CarCard";
import InventoryFilters, { type InventoryFilterValues } from "@/components/InventoryFilters";
import { getModelsForManufacturer } from "@/data/models";
import { getPublicCars } from "@/lib/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function sameBody(carBody: string, requested: string) {
  if (!requested) return true;
  if (requested === "Sedan") return ["Sedan", "Saloon"].includes(carBody);
  return carBody.toLowerCase() === requested.toLowerCase();
}

export default async function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const initial: InventoryFilterValues = {
    make: valueOf(params, "make"),
    model: valueOf(params, "model"),
    body: valueOf(params, "body"),
    transmission: valueOf(params, "transmission"),
    fuel: valueOf(params, "fuel"),
    budget: valueOf(params, "budget"),
    sort: valueOf(params, "sort") || "newest",
  };

  const cars = await getPublicCars();
  let results = cars.filter((car) => {
    if (initial.make && car.make !== initial.make) return false;
    if (initial.model && car.model !== initial.model) return false;
    if (!sameBody(car.body, initial.body)) return false;
    if (initial.transmission && car.transmission !== initial.transmission) return false;
    if (initial.fuel && car.fuel !== initial.fuel) return false;
    if (initial.budget === "30000plus") {
      if (car.price <= 30000) return false;
    } else if (initial.budget && car.price > Number(initial.budget)) {
      return false;
    }
    return true;
  });

  if (initial.sort === "price-low") results = [...results].sort((a, b) => a.price - b.price);
  if (initial.sort === "price-high") results = [...results].sort((a, b) => b.price - a.price);
  if (initial.sort === "mileage") results = [...results].sort((a, b) => a.mileage - b.mileage);
  if (initial.sort === "year-new") results = [...results].sort((a, b) => b.year - a.year);

  const activeFilters = [
    initial.make,
    initial.model,
    initial.body,
    initial.transmission,
    initial.fuel,
    initial.budget ? (initial.budget === "30000plus" ? "$30,000+" : "Up to $" + Number(initial.budget).toLocaleString()) : "",
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main>
        <section className="page-hero inventory-hero v4-inventory-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#a7f3d0" }}>Live showroom inventory</p>
            <h1>Find the right car.</h1>
            <p>Filter by the things that matter, then open any car for its full gallery and details.</p>
          </div>
        </section>

        <section className="section v4-inventory-section">
          <div className="container inventory-layout v4-inventory-layout">
            <InventoryFilters initial={initial} initialModels={initial.make ? getModelsForManufacturer(initial.make) : []} />
            <div>
              <div className="inventory-top v4-inventory-top">
                <div>
                  <strong>{results.length} {results.length === 1 ? "car" : "cars"} found</strong>
                  {activeFilters.length > 0 && <span>{activeFilters.join(" · ")}</span>}
                </div>
                {activeFilters.length > 0 && <Link href="/cars">Clear filters</Link>}
              </div>

              {results.length ? (
                <div className="cars-grid">{results.map((car) => <CarCard key={car.slug} car={car} />)}</div>
              ) : (
                <div className="empty-state v4-empty-state">
                  <h2>No cars match those filters.</h2>
                  <p>Try removing one filter or browse the complete inventory.</p>
                  <Link href="/cars" className="v3-primary-action">Show all cars</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
