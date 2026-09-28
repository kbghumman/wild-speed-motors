import Link from "next/link";

export default function SearchPanel() {
  return (
    <div className="search-panel">
      <div className="field">
        <label>Make</label>
        <select defaultValue="">
          <option value="">All makes</option>
          <option>BMW</option>
          <option>Audi</option>
          <option>Mercedes-Benz</option>
          <option>Volkswagen</option>
          <option>Toyota</option>
        </select>
      </div>
      <div className="field">
        <label>Model</label>
        <select defaultValue="">
          <option value="">All models</option>
          <option>3 Series</option>
          <option>A4</option>
          <option>A-Class</option>
          <option>Golf</option>
          <option>RAV4</option>
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
