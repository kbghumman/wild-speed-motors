"use client";

import Link from "next/link";
import { useState } from "react";
import { manufacturerNames } from "@/data/manufacturers";
import { getModelsForManufacturer } from "@/data/models";

export default function SearchPanel() {
  const [make, setMake] = useState("");
  const models = getModelsForManufacturer(make);

  return (
    <div className="search-panel">
      <div className="field">
        <label>Make</label>
        <select value={make} onChange={(event) => setMake(event.target.value)}>
          <option value="">All makes</option>
          {manufacturerNames.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Model</label>
        <select defaultValue="" disabled={!make}>
          <option value="">{make ? "All models" : "Choose a make first"}</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Budget</label>
        <select defaultValue="">
          <option value="">Any price</option>
          <option>Under £15,000</option>
          <option>Under £20,000</option>
          <option>Under £25,000</option>
          <option>Under £30,000</option>
        </select>
      </div>

      <div className="field">
        <label>Body type</label>
        <select defaultValue="">
          <option value="">Any body type</option>
          <option>SUV</option>
          <option>Hatchback</option>
          <option>Saloon</option>
          <option>Coupe</option>
        </select>
      </div>

      <Link className="search-button" href="/cars">
        Search Cars
      </Link>
    </div>
  );
}
