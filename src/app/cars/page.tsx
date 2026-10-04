import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CarCard from "@/components/CarCard";
import SmartCarFinder from "@/components/SmartCarFinder";
import InventoryFilters, { type InventoryFilterValues } from "@/components/InventoryFilters";
import { getPublicCars } from "@/lib/inventory";
import { runSmartCarSearch } from "@/lib/smart-car-search";
import TrackEventOnView from "@/components/analytics/TrackEventOnView";

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
  const naturalQuery = valueOf(params, "q").trim();

  const initial: InventoryFilterValues = {
    make: valueOf(params, "make"),
    model: valueOf(params, "model"),
    body: valueOf(params, "body"),
    transmission: valueOf(params, "transmission"),
    fuel: valueOf(params, "fuel"),
    budget: valueOf(params, "budget"),
    seats: valueOf(params, "seats"),
    sort: valueOf(params, "sort") || (naturalQuery ? "relevance" : "newest"),
  };

  const cars = await getPublicCars();
  const smart = naturalQuery ? runSmartCarSearch(cars, naturalQuery) : null;
  const smartList = smart
    ? smart.exactMatches.length > 0
      ? smart.exactMatches
      : smart.nearMatches
    : null;

  const matchMap = new Map(
    (smartList ?? []).map((match) => [match.car.slug, match.reasons]),
  );

  let results = (smartList ? smartList.map((match) => match.car) : cars).filter((car) => {
    if (initial.make && car.make !== initial.make) return false;
    if (initial.model && car.model !== initial.model) return false;
    if (!sameBody(car.body, initial.body)) return false;
    if (initial.transmission && car.transmission !== initial.transmission) return false;
    if (initial.fuel && car.fuel !== initial.fuel) return false;
    if (initial.seats && (!car.seats || car.seats < Number(initial.seats))) return false;

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
    initial.seats ? initial.seats + "+ seats" : "",
    initial.budget ? (initial.budget === "30000plus" ? "$30,000+" : "Up to $" + Number(initial.budget).toLocaleString()) : "",
  ].filter(Boolean);

  const exactSmartMatches = smart?.exactMatches.length ?? 0;
  const showingNearMatches = Boolean(smart && exactSmartMatches === 0 && smart.nearMatches.length > 0);

  return (
    <>
      <Header />
      {smart && (
        <TrackEventOnView
          eventName="smart_search_results"
          properties={{
            query: naturalQuery,
            result_count: results.length,
            exact_count: smart.exactMatches.length,
            near_count: smart.nearMatches.length,
            zero_results: results.length === 0,
            understood: smart.intent.understood,
            requested_make: smart.intent.make ?? "",
            requested_model: smart.intent.model ?? "",
          }}
        />
      )}
      <main>
        <section className="page-hero inventory-hero v4-inventory-hero">
          <div className="container">
            <p className="eyebrow" style={{ color: "#a7f3d0" }}>Live showroom inventory</p>
            <h1>{naturalQuery ? "Cars that fit what you said." : "Find the right car."}</h1>
            <p>
              {naturalQuery
                ? "The Smart Car Finder turns your request into real inventory requirements and ranks the live cars against them."
                : "Filter by the things that matter, then open any car for its full gallery and details."}
            </p>
          </div>
        </section>

        <section className="v6-results-finder">
          <div className="container">
            <SmartCarFinder initialQuery={naturalQuery} compact />
          </div>
        </section>

        {smart && (
          <section className="v6-smart-summary">
            <div className="container">
              <div className="v6-smart-summary-head">
                <div>
                  <span className="v3-mono">SMART INTERPRETATION</span>
                  <strong>“{naturalQuery}”</strong>
                </div>
                <span className={showingNearMatches ? "v6-match-status near" : "v6-match-status"}>
                  {showingNearMatches
                    ? "No exact match · showing closest live cars"
                    : exactSmartMatches + " exact " + (exactSmartMatches === 1 ? "match" : "matches")}
                </span>
              </div>

              {smart.intent.understood.length > 0 ? (
                <div className="v6-understood">
                  <span>I understood:</span>
                  {smart.intent.understood.map((item) => <strong key={item}>{item}</strong>)}
                </div>
              ) : (
                <p className="v6-smart-help">
                  I could not extract a strict requirement, so results are ranked from the clues I could understand.
                  Try including a budget, seats, make, body type, fuel, transmission or feature.
                </p>
              )}

              {showingNearMatches && (
                <div className="v20-request-car">
                  <div>
                    <strong>The exact car is not in live stock.</strong>
                    <span>These are the closest available alternatives. You can also tell us exactly what you want.</span>
                  </div>
                  <Link href={"/contact?request=" + encodeURIComponent(naturalQuery)}>
                    Request this car
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section v4-inventory-section">
          <div className="container inventory-layout v4-inventory-layout">
            <InventoryFilters
              initial={initial}
              naturalQuery={naturalQuery}
            />

            <div>
              <div className="inventory-top v4-inventory-top">
                <div>
                  <strong>{results.length} {results.length === 1 ? "car" : "cars"} shown</strong>
                  {activeFilters.length > 0 && <span>{activeFilters.join(" · ")}</span>}
                </div>
                {(activeFilters.length > 0 || naturalQuery) && <Link href="/cars">Clear search</Link>}
              </div>

              {results.length ? (
                <div className="cars-grid">
                  {results.map((car) => (
                    <CarCard
                      key={car.slug}
                      car={car}
                      matchReasons={naturalQuery ? matchMap.get(car.slug) ?? [] : []}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state v4-empty-state">
                  <h2>No live car matches that request yet.</h2>
                  <p>Try relaxing one requirement, changing the budget, or describe the need in a different way.</p>
                  <div className="v20-empty-actions">
                    <Link href="/cars" className="v3-primary-action">Show all cars</Link>
                    <Link
                      href={"/contact?request=" + encodeURIComponent(naturalQuery || activeFilters.join(", "))}
                      className="v20-request-link"
                    >
                      Request a car like this
                    </Link>
                  </div>
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
