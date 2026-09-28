"use client";

import { useState } from "react";
import { manufacturerNames } from "@/data/manufacturers";
import { getModelsForManufacturer } from "@/data/models";

export default function InventoryFilters() {
  const [make, setMake] = useState("");
  const models = getModelsForManufacturer(make);

  return (
    <aside className="filters">
      <h3>Filter cars</h3>

      <div className="filter-group">
        <label>Make</label>
        <select value={make} onChange={(event) => setMake(event.target.value)}>
          <option value="">All makes</option>
          {manufacturerNames.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Model</label>
        <select defaultValue="" disabled={!make}>
          <option value="">{make ? "All models" : "Choose a make first"}</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {[
        ["Body type", ["Any body type", "SUV", "Hatchback", "Saloon", "Coupe"]],
        ["Transmission", ["Any", "Automatic", "Manual"]],
        ["Fuel", ["Any", "Petrol", "Diesel", "Hybrid", "Electric"]],
        ["Max price", ["Any price", "$2,500", "$5,000", "$10,000", "$20,000", "$30,000", "$40,000"]],
      ].map(([label, options]) => (
        <div className="filter-group" key={label as string}>
          <label>{label as string}</label>
          <select>
            {(options as string[]).map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      ))}
    </aside>
  );
}
