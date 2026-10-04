"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Car } from "@/data/cars";
import { formatUSD } from "@/lib/currency";
import { trackEvent } from "@/lib/analytics/client";

const SHOWCASE_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Honda_NSX_red.jpg";

type HeroSlide =
  | {
      type: "showcase";
      key: string;
      image: string;
      title: string;
      meta: string;
    }
  | {
      type: "inventory";
      key: string;
      image: string;
      slug: string;
      make: string;
      model: string;
      trim: string;
      year: number;
      mileage: number;
      price: number;
    };

export default function InventoryHeroCarousel({ cars }: { cars: Car[] }) {
  const inventorySlides = useMemo<HeroSlide[]>(
    () =>
      cars
        .filter((car) => Boolean(car.image))
        .slice(0, 5)
        .map((car) => ({
          type: "inventory" as const,
          key: car.slug,
          image: car.image,
          slug: car.slug,
          make: car.make,
          model: car.model,
          trim: car.trim,
          year: car.year,
          mileage: car.mileage,
          price: car.price,
        })),
    [cars],
  );

  const slides = useMemo<HeroSlide[]>(
    () => [
      {
        type: "showcase",
        key: "honda-nsx-brand-showcase",
        image: SHOWCASE_IMAGE,
        title: "Honda NSX / NA1",
        meta: "Wild Speed Motors brand showcase",
      },
      ...inventorySlides,
    ],
    [inventorySlides],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = slides[activeIndex] ?? slides[0];
  const liveCount = cars.length;

  useEffect(() => {
    if (slides.length < 2 || paused) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [paused, slides.length]);

  useEffect(() => {
    if (!active) return;

    trackEvent(
      "home_hero_slide_view",
      active.type === "inventory"
        ? {
            slide_type: "inventory",
            make: active.make,
            model: active.model,
            price: active.price,
          }
        : {
            slide_type: "showcase",
            model: "Honda NSX NA1",
          },
      {
        vehicleSlug: active.type === "inventory" ? active.slug : undefined,
      },
    );
  }, [active]);

  function goTo(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function previous() {
    trackEvent("home_hero_previous");
    goTo(activeIndex - 1);
  }

  function next() {
    trackEvent("home_hero_next");
    goTo(activeIndex + 1);
  }

  return (
    <section
      className="v8-home-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="v8-hero-media" aria-hidden="true">
        <Image
          key={active.key}
          src={active.image}
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="100vw"
          quality={85}
          className="v8-hero-background"
        />
        <div className="v8-hero-shade" />
      </div>

      <div className="container v8-hero-shell">
        <div className="v8-hero-copy">
          <h1>
            <span>Browse our</span>
            live inventory.
          </h1>

          <Link
            href="/cars"
            className="v8-inventory-cta"
            onClick={() =>
              trackEvent("home_hero_inventory_cta", {
                live_inventory_count: liveCount,
              })
            }
          >
            <span>CHECK INVENTORY</span>
            <small>{liveCount} {liveCount === 1 ? "CAR" : "CARS"} LIVE</small>
            <ArrowRight size={26} />
          </Link>
        </div>

        <div className="v8-active-vehicle" aria-live="polite">
          {active.type === "inventory" ? (
            <>
              <span className="v8-live-label">AVAILABLE NOW</span>
              <strong>{active.year} {active.make} {active.model}</strong>
              <small>
                {active.trim ? active.trim + " · " : ""}
                {active.mileage.toLocaleString()} km
              </small>
              <div>
                <b>{formatUSD(active.price)}</b>
                <Link
                  href={"/cars/" + active.slug}
                  onClick={() =>
                    trackEvent(
                      "home_hero_vehicle_open",
                      {
                        make: active.make,
                        model: active.model,
                        price: active.price,
                      },
                      { vehicleSlug: active.slug },
                    )
                  }
                >
                  View vehicle <ArrowRight size={13} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="v8-live-label v8-showcase-label">BRAND SHOWCASE</span>
              <strong>{active.title}</strong>
              <small>{active.meta}</small>
              <div>
                <b>JDM ICON</b>
                <Link href="/cars">See live stock <ArrowRight size={13} /></Link>
              </div>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="v8-hero-arrow v8-hero-arrow-left"
              onClick={previous}
              aria-label="Previous featured vehicle"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              className="v8-hero-arrow v8-hero-arrow-right"
              onClick={next}
              aria-label="Next featured vehicle"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="v8-hero-bottom">
          <div className="v8-hero-thumbnails" aria-label="Featured vehicles">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.key}
                className={index === activeIndex ? "active" : ""}
                onClick={() => {
                  setActiveIndex(index);
                  trackEvent(
                    "home_hero_thumbnail_click",
                    {
                      slide_index: index + 1,
                      slide_type: slide.type,
                    },
                    {
                      vehicleSlug: slide.type === "inventory" ? slide.slug : undefined,
                    },
                  );
                }}
              >
                <span className="v8-thumb-image">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="180px"
                    quality={65}
                  />
                </span>

                <span className="v8-thumb-copy">
                  <strong>
                    {slide.type === "inventory"
                      ? slide.make + " " + slide.model
                      : "Honda NSX / NA1"}
                  </strong>
                  <small>
                    {slide.type === "inventory"
                      ? slide.year + " · " + slide.mileage.toLocaleString() + " km"
                      : "Brand showcase"}
                  </small>
                </span>
              </button>
            ))}
          </div>

          <div className="v8-hero-progress" aria-hidden="true">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <div>
              {slides.map((slide, index) => (
                <i key={slide.key} className={index === activeIndex ? "active" : ""} />
              ))}
            </div>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
