"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/client";

export default function VehicleGallery({
  coverImage,
  images,
  alt,
  vehicleSlug,
}: {
  coverImage?: string;
  images?: string[];
  alt: string;
  vehicleSlug: string;
}) {
  const gallery = useMemo(() => {
    const ordered = [coverImage, ...(images ?? [])].filter(Boolean) as string[];
    return [...new Set(ordered)];
  }, [coverImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const viewedPhotos = useRef(new Set<number>());

  const count = gallery.length;
  const activeImage = gallery[activeIndex];

  function goTo(index: number) {
    if (!count) return;
    setActiveIndex((index + count) % count);
  }

  function previous() {
    trackEvent("gallery_previous", { from_photo: activeIndex + 1 }, { vehicleSlug });
    goTo(activeIndex - 1);
  }

  function next() {
    trackEvent("gallery_next", { from_photo: activeIndex + 1 }, { vehicleSlug });
    goTo(activeIndex + 1);
  }

  useEffect(() => {
    if (!count || viewedPhotos.current.has(activeIndex)) return;
    viewedPhotos.current.add(activeIndex);
    trackEvent("gallery_photo_view", { photo_index: activeIndex + 1, photo_count: count }, { vehicleSlug });
  }, [activeIndex, count, vehicleSlug]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === "Escape") setLightboxOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, activeIndex]);

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 45) return;
    trackEvent("gallery_swipe", { direction: delta > 0 ? "previous" : "next", from_photo: activeIndex + 1 }, { vehicleSlug });
    if (delta > 0) goTo(activeIndex - 1);
    else goTo(activeIndex + 1);
  }

  if (!activeImage) {
    return <div className="v4-car-image-placeholder vehicle-gallery-empty">Photo coming soon</div>;
  }

  return (
    <>
      <div className="vehicle-gallery">
        <div
          className="vehicle-gallery-main"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={activeImage}
            alt={alt + " photo " + (activeIndex + 1)}
            fill
            sizes="(max-width: 900px) 100vw, 68vw"
            priority={activeIndex === 0}
            quality={82}
          />

          {count > 1 && (
            <>
              <button
                type="button"
                className="vehicle-gallery-arrow vehicle-gallery-arrow-left"
                onClick={previous}
                aria-label="Previous photo"
              >
                <ChevronLeft size={26} />
              </button>

              <button
                type="button"
                className="vehicle-gallery-arrow vehicle-gallery-arrow-right"
                onClick={next}
                aria-label="Next photo"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <button
            type="button"
            className="vehicle-gallery-expand"
            onClick={() => {
              setLightboxOpen(true);
              trackEvent("gallery_fullscreen_open", { photo_index: activeIndex + 1 }, { vehicleSlug });
            }}
            aria-label="Open photo fullscreen"
          >
            <Expand size={17} />
            <span>View fullscreen</span>
          </button>

          {count > 1 && (
            <div className="vehicle-gallery-counter">
              {activeIndex + 1} / {count}
            </div>
          )}
        </div>

        {count > 1 && (
          <div className="vehicle-gallery-thumbnails" aria-label="Vehicle photo thumbnails">
            {gallery.map((image, index) => (
              <button
                type="button"
                key={image}
                className={index === activeIndex ? "active" : ""}
                onClick={() => {
                  setActiveIndex(index);
                  trackEvent("gallery_thumbnail_click", { photo_index: index + 1 }, { vehicleSlug });
                }}
                aria-label={"Show photo " + (index + 1)}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="120px"
                  quality={60}
                />
                <span>{index + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="vehicle-lightbox" role="dialog" aria-modal="true" aria-label="Vehicle photo viewer">
          <button
            type="button"
            className="vehicle-lightbox-close"
            onClick={() => {
              setLightboxOpen(false);
              trackEvent("gallery_fullscreen_close", { photo_index: activeIndex + 1 }, { vehicleSlug });
            }}
            aria-label="Close fullscreen photo viewer"
          >
            <X size={24} />
          </button>

          <div
            className="vehicle-lightbox-stage"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={activeImage}
              alt={alt + " photo " + (activeIndex + 1)}
              fill
              sizes="100vw"
              quality={90}
              priority
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  className="vehicle-lightbox-arrow vehicle-lightbox-arrow-left"
                  onClick={previous}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  type="button"
                  className="vehicle-lightbox-arrow vehicle-lightbox-arrow-right"
                  onClick={next}
                  aria-label="Next photo"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>

          <div className="vehicle-lightbox-footer">
            <span>{activeIndex + 1} of {count}</span>
            <span>Use ← → keys or swipe</span>
          </div>
        </div>
      )}
    </>
  );
}
