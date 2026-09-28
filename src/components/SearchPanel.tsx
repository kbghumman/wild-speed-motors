import Link from "next/link";
import { manufacturerNames } from "@/data/manufacturers";

export default function SearchPanel() {
  return (
    <div className="search-panel">
      <div className="field">
        <label>Make</label>
        <select defaultValue="">
          <option value="">All makes</option>
          {manufacturerNames.map((manufacturer) => (
            <option key={manufacturer}>{manufacturer}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Model</label>
        <select defaultValue="">
          <option value="">All models</option>
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
