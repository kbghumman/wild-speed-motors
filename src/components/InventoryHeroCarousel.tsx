"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics/client";

const NSX_BACKGROUND =
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Honda_NSX_red.jpg";

export default function InventoryHeroCarousel({ cars }: { cars: Car[] }) {
  const heroCars = useMemo(
    () => cars.filter((car) => Boolean(car.image)).slice(0, 6),
    [cars],
  );
  const [index, setIndex] = useState(0);
  const featured = heroCars[index];

  useEffect(() => {
    if (heroCars.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroCars.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [heroCars.length]);

  return (
    <section className="v10-home-hero">
      <div className="v10-hero-bg" aria-hidden="true">
        <Image src={NSX_BACKGROUND} alt="" fill priority quality={90} sizes="100vw" />
        <div className="v10-hero-overlay" />
      </div>

      <div className="container v10-hero-grid">
        <div className="v10-hero-copy">
          <span className="v10-hero-kicker">WILD SPEED MOTORS</span>
          <h1>Find your <span>next car.</span></h1>
          <p>
            Live stock, clear pricing and direct showroom support — built to get
            you from browsing to the right car quickly.
          </p>

          <div className="v10-hero-actions">
            <Link
              href="/cars"
              className="v10-hero-primary"
              onClick={() => trackEvent("home_hero_inventory_cta", { live_inventory_count: cars.length })}
            >
              Check inventory <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="v10-hero-secondary">Contact showroom</Link>
          </div>

          <div className="v10-hero-stock">
            <strong>{cars.length}</strong>
            <span>{cars.length === 1 ? "live vehicle" : "live vehicles"} available now</span>
          </div>
        </div>

        <div className="v10-featured-wrap">
          {featured ? (
            <Link
              key={featured.slug}
              href={"/cars/" + featured.slug}
              className="v10-featured-card"
              onClick={() =>
                trackEvent(
                  "home_hero_featured_open",
                  { make: featured.make, model: featured.model, year: featured.year, price: featured.price },
                  { vehicleSlug: featured.slug },
                )
              }
            >
              <div className="v10-featured-image">
                <Image
                  src={featured.image}
                  alt={featured.year + " " + featured.make + " " + featured.model}
                  fill
                  sizes="(max-width: 920px) 92vw, 38vw"
                  quality={80}
                />
                <span>Featured live stock</span>
              </div>

              <div className="v10-featured-copy">
                <small>{featured.year} · {featured.mileage.toLocaleString()} km</small>
                <h2>{featured.make} {featured.model}</h2>
                {featured.trim && <p>{featured.trim}</p>}
                <div className="v10-featured-bottom">
                  <strong>{formatUSD(featured.price)}</strong>
                  <span>View vehicle <ArrowRight size={14} /></span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="v10-featured-card v10-featured-empty">
              <span>Live inventory</span>
              <h2>New stock will appear here automatically.</h2>
              <Link href="/cars">Browse inventory <ArrowRight size={14} /></Link>
            </div>
          )}

          {heroCars.length > 1 && (
            <div className="v10-featured-dots">
              {heroCars.map((car, dot) => (
                <button
                  key={car.slug}
                  type="button"
                  className={dot === index ? "active" : ""}
                  onClick={() => setIndex(dot)}
                  aria-label={"Show " + car.make + " " + car.model}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
