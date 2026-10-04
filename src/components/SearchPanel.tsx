"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { useInventoryFacets } from "@/hooks/useInventoryFacets";

export default function SearchPanel() {
  const { selections, setSelection, data, loading } = useInventoryFacets();

  return (
    <form
      className="search-panel v4-search-panel"
      action="/cars"
      method="get"
      onSubmit={(event) => {
        const form = new FormData(event.currentTarget);
        trackEvent("filter_search_submit", {
          make: String(form.get("make") || ""),
          model: String(form.get("model") || ""),
          budget: String(form.get("budget") || ""),
          seats: String(form.get("seats") || ""),
          body: String(form.get("body") || ""),
          live_result_count: data.total,
        });
      }}
    >
      <div className="v4-search-heading">
        <div>
          <strong>Search live stock</strong>
          <small className="v20-live-filter-note">
            {loading ? "Checking current inventory…" : data.total + " cars match these choices"}
          </small>
        </div>
        <Link href="/cars">See all cars →</Link>
      </div>

      <div className="v4-search-grid">
        <div className="field">
          <label htmlFor="home-make">Make</label>
          <select
            id="home-make"
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

        <div className="field">
          <label htmlFor="home-model">Model</label>
          <select
            id="home-model"
            name="model"
            value={selections.model}
            onChange={(event) => setSelection("model", event.target.value)}
            disabled={!selections.make || loading}
          >
            <option value="">
              {!selections.make
                ? "Choose a make first"
                : data.facets.model.length
                  ? "All live models"
                  : "No live models"}
            </option>
            {data.facets.model.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="home-budget">Max budget</label>
          <select
            id="home-budget"
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

        <div className="field">
          <label htmlFor="home-seats">Minimum seats</label>
          <select
            id="home-seats"
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

        <div className="field">
          <label htmlFor="home-body">Body type</label>
          <select
            id="home-body"
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

        <button
          className="search-button v4-search-button"
          type="submit"
          disabled={loading || data.total === 0}
        >
          <Search size={17} />
          {loading ? "Checking…" : "Show " + data.total}
        </button>
      </div>
    </form>
  );
}
