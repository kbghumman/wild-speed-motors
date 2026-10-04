"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { useInventoryFacets } from "@/hooks/useInventoryFacets";

export type InventoryFilterValues = {
  make: string;
  model: string;
  body: string;
  transmission: string;
  fuel: string;
  budget: string;
  seats: string;
  sort: string;
};

export default function InventoryFilters({
  initial,
  naturalQuery = "",
}: {
  initial: InventoryFilterValues;
  naturalQuery?: string;
}) {
  const { selections, setSelection, data, loading } = useInventoryFacets({
    make: initial.make,
    model: initial.model,
    body: initial.body,
    transmission: initial.transmission,
    fuel: initial.fuel,
    budget: initial.budget,
    seats: initial.seats,
  });

  return (
    <aside className="filters v4-filters">
      <div className="v4-filter-heading">
        <SlidersHorizontal size={18} />
        <div>
          <strong>Filter live cars</strong>
          <span>{loading ? "Checking stock…" : data.total + " currently match"}</span>
        </div>
      </div>

      <form
        action="/cars"
        method="get"
        onSubmit={(event) => {
          const form = new FormData(event.currentTarget);
          trackEvent("filter_search_submit", {
            make: String(form.get("make") || ""),
            model: String(form.get("model") || ""),
            body: String(form.get("body") || ""),
            transmission: String(form.get("transmission") || ""),
            fuel: String(form.get("fuel") || ""),
            seats: String(form.get("seats") || ""),
            budget: String(form.get("budget") || ""),
            sort: String(form.get("sort") || ""),
            refinement: Boolean(naturalQuery),
            live_result_count: data.total,
          });
        }}
      >
        {naturalQuery && <input type="hidden" name="q" value={naturalQuery} />}

        <div className="filter-group">
          <label htmlFor="filter-make">Make</label>
          <select
            id="filter-make"
            name="make"
            value={selections.make}
            onChange={(event) => setSelection("make", event.target.value)}
          >
            <option value="">All available makes</option>
            {data.facets.make.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-model">Model</label>
          <select
            id="filter-model"
            name="model"
            value={selections.model}
            onChange={(event) => setSelection("model", event.target.value)}
            disabled={!selections.make || loading}
          >
            <option value="">
              {!selections.make ? "Choose a make first" : "All live models"}
            </option>
            {data.facets.model.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-body">Body type</label>
          <select
            id="filter-body"
            name="body"
            value={selections.body}
            onChange={(event) => setSelection("body", event.target.value)}
          >
            <option value="">Any live body type</option>
            {data.facets.body.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-transmission">Transmission</label>
          <select
            id="filter-transmission"
            name="transmission"
            value={selections.transmission}
            onChange={(event) => setSelection("transmission", event.target.value)}
          >
            <option value="">Any live transmission</option>
            {data.facets.transmission.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-fuel">Fuel</label>
          <select
            id="filter-fuel"
            name="fuel"
            value={selections.fuel}
            onChange={(event) => setSelection("fuel", event.target.value)}
          >
            <option value="">Any live fuel type</option>
            {data.facets.fuel.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-seats">Minimum seats</label>
          <select
            id="filter-seats"
            name="seats"
            value={selections.seats}
            onChange={(event) => setSelection("seats", event.target.value)}
          >
            <option value="">Any seating</option>
            {data.facets.seats.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} seats ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-budget">Max price</label>
          <select
            id="filter-budget"
            name="budget"
            value={selections.budget}
            onChange={(event) => setSelection("budget", event.target.value)}
          >
            <option value="">Any live-stock price</option>
            {data.facets.budget.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-sort">Sort by</label>
          <select id="filter-sort" name="sort" defaultValue={initial.sort}>
            {naturalQuery && <option value="relevance">Best match</option>}
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="mileage">Lowest mileage</option>
            <option value="year-new">Newest model year</option>
          </select>
        </div>

        <button type="submit" className="v4-filter-apply" disabled={loading || data.total === 0}>
          {loading ? "Checking stock…" : "Show " + data.total + " cars"}
        </button>
        <Link href={naturalQuery ? "/cars?q=" + encodeURIComponent(naturalQuery) : "/cars"} className="v4-filter-clear">
          Clear filters
        </Link>
      </form>
    </aside>
  );
}
