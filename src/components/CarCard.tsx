import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={"/cars/" + car.slug} className="v3-car-card">
      <div className="v3-car-image">
        <img src={car.image} alt={car.make + " " + car.model} loading="lazy" decoding="async" />
        <span className="v3-car-status">JUST IN</span>
        <span className="v3-car-arrow"><ArrowUpRight size={16} /></span>
      </div>

      <div className="v3-car-body">
        <div className="v3-car-heading">
          <div>
            <span className="v3-mono">{car.make}</span>
            <h3>{car.model}</h3>
            <p>{car.trim}</p>
          </div>
          <span className="v3-car-year">{car.year}</span>
        </div>

        <div className="v3-car-data">
          <span>{car.mileage.toLocaleString()} KM</span>
          <span>{car.transmission.toUpperCase()}</span>
          <span>{car.fuel.toUpperCase()}</span>
          <span>{car.engine.toUpperCase()}</span>
        </div>

        <div className="v3-car-price-row">
          <div>
            <span className="v3-price-label">Cash price</span>
            <strong>{formatUSD(car.price)}</strong>
          </div>
          <div className="v3-monthly">
            <span>Finance from</span>
            <strong>{formatUSD(car.monthly)}/mo</strong>
          </div>
        </div>
      </div>
    </Link>
  );
}
