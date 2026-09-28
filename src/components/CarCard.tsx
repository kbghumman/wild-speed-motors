import Link from "next/link";
import { ArrowUpRight, Fuel, Gauge, Settings2 } from "lucide-react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.slug}`} className="car-card">
      <div className="car-image">
        <img src={car.image} alt={`${car.make} ${car.model}`} loading="lazy" decoding="async" />
        <div className="car-image-overlay" />
        <span className="car-badge">JUST IN</span>
        <span className="car-view">View car <ArrowUpRight size={15} /></span>
      </div>

      <div className="car-content">
        <div className="car-card-topline">
          <div className="car-make">{car.make}</div>
          <span className="car-year">{car.year}</span>
        </div>

        <h3 className="car-title">{car.model}</h3>
        <p className="car-trim">{car.trim}</p>

        <div className="car-specs">
          <span><Gauge size={15} /> {car.mileage.toLocaleString()} km</span>
          <span><Settings2 size={15} /> {car.transmission}</span>
          <span><Fuel size={15} /> {car.fuel}</span>
          <span>{car.engine}</span>
        </div>

        <div className="car-price-row">
          <div>
            <span className="price-label">Cash price</span>
            <div className="car-price">{formatUSD(car.price)}</div>
          </div>
          <div className="car-monthly">
            finance from
            <strong>{formatUSD(car.monthly)}/mo</strong>
          </div>
        </div>
      </div>
    </Link>
  );
}
