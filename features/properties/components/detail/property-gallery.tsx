"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type PropertyGalleryProps = {
  images: string[];
  title: string;
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % images.length);
    setZoomed(false);
  }, [images.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + images.length) % images.length);
    setZoomed(false);
  }, [images.length]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, next, prev]);

  // Touch swipe for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  return (
    <>
      <div className="space-y-3">
        <div
          className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[active]}
            alt={`${title} — image ${active + 1}`}
            fill
            priority
            className={cn(
              "object-cover transition-transform duration-500",
              zoomed && "scale-150 cursor-zoom-out",
              !zoomed && "cursor-zoom-in"
            )}
            sizes="(max-width: 1024px) 100vw, 70vw"
            onClick={() => setZoomed((z) => !z)}
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <Expand className="size-4" aria-hidden="true" />
              Fullscreen
            </button>
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              className="inline-flex size-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
              aria-label={zoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn className="size-4" aria-hidden="true" />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-colors hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-colors hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={img}
                type="button"
                onClick={() => { setActive(index); setZoomed(false); }}
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all",
                  index === active
                    ? "ring-primary"
                    : "ring-transparent opacity-70 hover:opacity-100"
                )}
                aria-label={`View image ${index + 1}`}
                aria-current={index === active}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X className="size-5" />
            </button>

            <div className="relative h-[80vh] w-full max-w-6xl px-4">
              <Image
                src={images[active]}
                alt={`${title} — fullscreen`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute top-1/2 left-4 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Previous"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute top-1/2 right-4 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Next"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
