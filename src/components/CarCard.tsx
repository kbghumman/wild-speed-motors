import Link from "next/link";
import type { Car } from "@/data/cars";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.slug}`} className="car-card">
      <div className="car-image">
        <img src={car.image} alt={`${car.make} ${car.model}`} />
        <span className="car-badge">JUST IN</span>
      </div>

      <div className="car-content">
        <div className="car-make">{car.make}</div>
        <h3 className="car-title">
          {car.model} <span>{car.year}</span>
        </h3>
        <p className="car-trim">{car.trim}</p>

        <div className="car-specs">
          <span>{car.mileage.toLocaleString()} miles</span>
          <span>{car.transmission}</span>
          <span>{car.fuel}</span>
          <span>{car.engine}</span>
        </div>

        <div className="car-price-row">
          <div className="car-price">£{car.price.toLocaleString()}</div>
          <div className="car-monthly">
            from
            <strong>£{car.monthly}/mo</strong>
          </div>
        </div>
      </div>
    </Link>
  );
}
