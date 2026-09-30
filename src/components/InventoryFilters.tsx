"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { manufacturerNames } from "@/data/manufacturers";

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
  initialModels,
  naturalQuery = "",
}: {
  initial: InventoryFilterValues;
  initialModels: string[];
  naturalQuery?: string;
}) {
  const [make, setMake] = useState(initial.make);
  const [model, setModel] = useState(initial.model);
  const [models, setModels] = useState(initialModels);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (!make) {
      setModels([]);
      setModel("");
      return;
    }

    if (make === initial.make && initialModels.length) {
      setModels(initialModels);
      return;
    }

    const controller = new AbortController();
    setLoadingModels(true);
    setModel("");

    fetch("/api/models?make=" + encodeURIComponent(make), { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { models?: string[] }) => setModels(data.models ?? []))
      .catch((error) => {
        if (error.name !== "AbortError") setModels([]);
      })
      .finally(() => setLoadingModels(false));

    return () => controller.abort();
  }, [make, initial.make, initialModels]);

  return (
    <aside className="filters v4-filters">
      <div className="v4-filter-heading">
        <SlidersHorizontal size={18} />
        <div><strong>Filter cars</strong><span>Narrow the live inventory</span></div>
      </div>

      <form action="/cars" method="get">
        {naturalQuery && <input type="hidden" name="q" value={naturalQuery} />}

        <div className="filter-group">
          <label htmlFor="filter-make">Make</label>
          <select id="filter-make" name="make" value={make} onChange={(event) => setMake(event.target.value)}>
            <option value="">All makes</option>
            {manufacturerNames.map((manufacturer) => <option key={manufacturer} value={manufacturer}>{manufacturer}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-model">Model</label>
          <select id="filter-model" name="model" value={model} onChange={(event) => setModel(event.target.value)} disabled={!make || loadingModels}>
            <option value="">{loadingModels ? "Loading models…" : make ? "All models" : "Choose a make first"}</option>
            {models.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-body">Body type</label>
          <select id="filter-body" name="body" defaultValue={initial.body}>
            <option value="">Any body type</option>
            <option>SUV</option><option>4x4</option><option>Hatchback</option><option>Sedan</option><option>Coupe</option><option>Roadster</option><option>Wagon</option><option>Minivan</option><option>Kei</option><option>Pickup</option><option>Van</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-transmission">Transmission</label>
          <select id="filter-transmission" name="transmission" defaultValue={initial.transmission}>
            <option value="">Any transmission</option><option>Automatic</option><option>Manual</option><option>CVT</option><option>DCT</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-fuel">Fuel</label>
          <select id="filter-fuel" name="fuel" defaultValue={initial.fuel}>
            <option value="">Any fuel</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Plug-in Hybrid</option><option>Electric</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-seats">Minimum seats</label>
          <select id="filter-seats" name="seats" defaultValue={initial.seats}>
            <option value="">Any seating</option>
            <option value="2">2+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-budget">Max price</label>
          <select id="filter-budget" name="budget" defaultValue={initial.budget}>
            <option value="">Any price</option>
            <option value="2500">$2,500</option><option value="5000">$5,000</option><option value="10000">$10,000</option><option value="20000">$20,000</option><option value="30000">$30,000</option><option value="40000">$40,000</option><option value="30000plus">$30,000+</option>
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

        <button type="submit" className="v4-filter-apply">Apply filters</button>
        <Link href="/cars" className="v4-filter-clear">Clear all</Link>
      </form>
    </aside>
  );
}
