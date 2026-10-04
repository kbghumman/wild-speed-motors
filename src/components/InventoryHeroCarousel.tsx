"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics/client";

const NSX_BACKGROUND =
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Honda_NSX_red.jpg";

function windowedCars(cars: Car[], start: number, count: number) {
  if (!cars.length) return [];
  if (cars.length <= count) return cars;

  return Array.from({ length: count }, (_, offset) => cars[(start + offset) % cars.length]);
}

export default function InventoryHeroCarousel({ cars }: { cars: Car[] }) {
  const liveCars = useMemo(
    () => cars.filter((car) => Boolean(car.image)),
    [cars],
  );

  const [startIndex, setStartIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const visibleCars = useMemo(
    () => windowedCars(liveCars, startIndex, 3),
    [liveCars, startIndex],
  );

  useEffect(() => {
    if (liveCars.length <= 3 || paused) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setStartIndex((current) => (current + 1) % liveCars.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [liveCars.length, paused]);

  function move(direction: 1 | -1) {
    if (!liveCars.length) return;
    setStartIndex((current) => (current + direction + liveCars.length) % liveCars.length);
    trackEvent(direction > 0 ? "home_inventory_strip_next" : "home_inventory_strip_previous");
  }

  return (
    <section
      className="v9-home-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="v9-hero-background" aria-hidden="true">
        <Image
          src={NSX_BACKGROUND}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="v9-hero-overlay" />
      </div>

      <div className="container v9-hero-shell">
        <div className="v9-hero-copy">
          <h1>
            <span>Browse our</span>
            <em>live inventory.</em>
          </h1>

          <Link
            href="/cars"
            className="v9-check-inventory"
            onClick={() =>
              trackEvent("home_hero_inventory_cta", {
                live_inventory_count: cars.length,
              })
            }
          >
            <strong>CHECK INVENTORY</strong>
            <ArrowRight size={31} />
          </Link>
        </div>

        <div className="v9-hero-strip-wrap">
          {liveCars.length > 3 && (
            <button
              type="button"
              className="v9-strip-arrow v9-strip-arrow-left"
              onClick={() => move(-1)}
              aria-label="Previous inventory vehicles"
            >
              <ChevronLeft size={25} />
            </button>
          )}

          <div className="v9-inventory-strip" aria-live="polite">
            {visibleCars.map((car) => (
              <Link
                key={car.slug}
                href={"/cars/" + car.slug}
                className="v9-inventory-card"
                onClick={() =>
                  trackEvent(
                    "home_hero_vehicle_open",
                    {
                      make: car.make,
                      model: car.model,
                      year: car.year,
                      price: car.price,
                      surface: "hero_inventory_strip",
                    },
                    { vehicleSlug: car.slug },
                  )
                }
              >
                <span className="v9-card-image">
                  <Image
                    src={car.image}
                    alt={car.year + " " + car.make + " " + car.model}
                    fill
                    sizes="(max-width: 760px) 78vw, 30vw"
                    quality={75}
                  />
                </span>

                <span className="v9-card-copy">
                  <span>
                    <strong>{car.year} {car.make} {car.model}</strong>
                    <small>{car.mileage.toLocaleString()} km · {formatUSD(car.price)}</small>
                  </span>
                  <ArrowRight size={17} />
                </span>
              </Link>
            ))}

            {!visibleCars.length && (
              <Link href="/cars" className="v9-inventory-empty">
                <span>Live inventory</span>
                <strong>New stock will appear here automatically.</strong>
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          {liveCars.length > 3 && (
            <button
              type="button"
              className="v9-strip-arrow v9-strip-arrow-right"
              onClick={() => move(1)}
              aria-label="Next inventory vehicles"
            >
              <ChevronRight size={25} />
            </button>
          )}
        </div>

        <div className="v9-hero-progress" aria-hidden="true">
          <span>{String(liveCars.length ? startIndex + 1 : 0).padStart(2, "0")}</span>
          <div>
            {Array.from({ length: Math.max(1, Math.min(liveCars.length, 6)) }, (_, index) => (
              <i
                key={index}
                className={liveCars.length && startIndex % Math.max(1, Math.min(liveCars.length, 6)) === index ? "active" : ""}
              />
            ))}
          </div>
          <span>{String(liveCars.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
