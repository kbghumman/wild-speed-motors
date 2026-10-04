"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics/client";

function windowed(cars: Car[], start: number) {
  if (cars.length <= 3) return cars;
  return Array.from({ length: 3 }, (_, offset) => cars[(start + offset) % cars.length]);
}

export default function FeaturedInventoryCarousel({ cars }: { cars: Car[] }) {
  const liveCars = useMemo(() => cars.filter((car) => Boolean(car.image)), [cars]);
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = useMemo(() => windowed(liveCars, start), [liveCars, start]);

  useEffect(() => {
    if (liveCars.length <= 3 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setStart((current) => (current + 1) % liveCars.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [liveCars.length, paused]);

  const move = (direction: 1 | -1) => {
    if (!liveCars.length) return;
    setStart((current) => (current + direction + liveCars.length) % liveCars.length);
    trackEvent(direction > 0 ? "featured_inventory_next" : "featured_inventory_previous");
  };

  return (
    <section
      className="section v10-featured-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container">
        <div className="v10-section-head">
          <div>
            <span className="v10-section-kicker">FEATURED INVENTORY</span>
            <h2>Cars you can buy now.</h2>
          </div>

          <div className="v10-section-actions">
            {liveCars.length > 3 && (
              <div className="v10-carousel-controls">
                <button type="button" onClick={() => move(-1)} aria-label="Previous cars"><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => move(1)} aria-label="Next cars"><ChevronRight size={18} /></button>
              </div>
            )}
            <Link href="/cars">View all inventory <ArrowRight size={15} /></Link>
          </div>
        </div>

        {visible.length ? (
          <div className={"v10-featured-grid count-" + visible.length}>
            {visible.map((car) => (
              <Link
                key={car.slug}
                href={"/cars/" + car.slug}
                className="v10-stock-card"
                onClick={() =>
                  trackEvent(
                    "featured_inventory_vehicle_open",
                    { make: car.make, model: car.model, price: car.price },
                    { vehicleSlug: car.slug },
                  )
                }
              >
                <div className="v10-stock-image">
                  <Image
                    src={car.image}
                    alt={car.year + " " + car.make + " " + car.model}
                    fill
                    sizes="(max-width: 760px) 92vw, 31vw"
                    quality={75}
                  />
                  <span>Available</span>
                </div>

                <div className="v10-stock-copy">
                  <small>{car.year} · {car.mileage.toLocaleString()} km</small>
                  <h3>{car.make} {car.model}</h3>
                  {car.trim && <p>{car.trim}</p>}
                  <div className="v10-stock-footer">
                    <strong>{formatUSD(car.price)}</strong>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="v10-featured-empty">
            <strong>No live cars right now.</strong>
            <p>Newly published vehicles will appear here automatically.</p>
            <Link href="/contact">Ask us what is coming next <ArrowRight size={14} /></Link>
          </div>
        )}
      </div>
    </section>
  );
}
