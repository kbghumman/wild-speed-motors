"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { manufacturerNames } from "@/data/manufacturers";

export default function SearchPanel() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  useEffect(() => {
    if (!make) {
      setModels([]);
      setModel("");
      return;
    }

    const controller = new AbortController();
    setModelsLoading(true);
    setModel("");

    fetch("/api/models?make=" + encodeURIComponent(make), { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { models?: string[] }) => setModels(data.models ?? []))
      .catch((error) => {
        if (error.name !== "AbortError") setModels([]);
      })
      .finally(() => setModelsLoading(false));

    return () => controller.abort();
  }, [make]);

  return (
    <form className="search-panel v4-search-panel" action="/cars" method="get">
      <div className="v4-search-heading">
        <div><span className="v3-mono">FIND YOUR CAR</span><strong>Search live inventory</strong></div>
        <Link href="/cars">Browse everything →</Link>
      </div>

      <div className="v4-search-grid">
        <div className="field">
          <label htmlFor="home-make">Make</label>
          <select id="home-make" name="make" value={make} onChange={(event) => setMake(event.target.value)}>
            <option value="">All makes</option>
            {manufacturerNames.map((manufacturer) => <option key={manufacturer} value={manufacturer}>{manufacturer}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="home-model">Model</label>
          <select id="home-model" name="model" value={model} onChange={(event) => setModel(event.target.value)} disabled={!make || modelsLoading}>
            <option value="">{modelsLoading ? "Loading models…" : make ? "All models" : "Choose a make first"}</option>
            {models.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="home-budget">Max budget</label>
          <select id="home-budget" name="budget" defaultValue="">
            <option value="">Any price</option>
            <option value="2500">Up to $2,500</option>
            <option value="5000">Up to $5,000</option>
            <option value="10000">Up to $10,000</option>
            <option value="20000">Up to $20,000</option>
            <option value="30000">Up to $30,000</option>
            <option value="30000plus">$30,000+</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="home-body">Body type</label>
          <select id="home-body" name="body" defaultValue="">
            <option value="">Any body</option>
            <option value="SUV">SUV</option>
            <option value="4x4">4x4</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="Coupe">Coupe</option>
            <option value="Minivan">Minivan</option>
            <option value="Kei">Kei</option>
          </select>
        </div>

        <button className="search-button v4-search-button" type="submit"><Search size={17} />Search</button>
      </div>
    </form>
  );
}
