import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";

export default function CarCard({
  car,
  matchReasons = [],
}: {
  car: Car;
  matchReasons?: string[];
}) {
  return (
    <Link href={"/cars/" + car.slug} className="v3-car-card">
      <div className="v3-car-image">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.make + " " + car.model}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
            quality={75}
            loading="lazy"
          />
        ) : <div className="v4-car-image-placeholder">Photo coming soon</div>}
        <span className="v3-car-status">AVAILABLE</span>
        <span className="v3-car-arrow"><ArrowUpRight size={16} /></span>
      </div>

      <div className="v3-car-body">
        {matchReasons.length > 0 && (
          <div className="smart-match-reasons">
            <span><Sparkles size={11} /> Why it matches</span>
            <div>{matchReasons.slice(0, 3).map((reason) => <small key={reason}>{reason}</small>)}</div>
          </div>
        )}

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
          {car.seats ? <span>{car.seats} SEATS</span> : null}
          {car.transmission && <span>{car.transmission.toUpperCase()}</span>}
          {car.fuel && <span>{car.fuel.toUpperCase()}</span>}
          {car.engine && <span>{car.engine.toUpperCase()}</span>}
        </div>

        <div className="v3-car-price-row">
          <div><span className="v3-price-label">Cash price</span><strong>{formatUSD(car.price)}</strong></div>
          {car.monthly > 0 && <div className="v3-monthly"><span>Finance from</span><strong>{formatUSD(car.monthly)}/mo</strong></div>}
        </div>
      </div>
    </Link>
  );
}
