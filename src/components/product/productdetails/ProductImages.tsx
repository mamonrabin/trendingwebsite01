
"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, useMotionValue } from "framer-motion";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import p1 from "@/assets/images/p1.webp";
import p2 from "@/assets/images/p2.webp";
import p3 from "@/assets/images/p3.webp";
import p4 from "@/assets/images/p4.webp";

const ProductImages = () => {
  const images: StaticImageData[] = [p1, p2, p3, p4];

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const resetView = () => {
    setZoom(1);
    x.set(0);
    y.set(0);
  };

  const openImage = (index: number) => {
    resetView();
    setSelectedImage(index);
  };

  const closePopup = () => {
    setSelectedImage(null);
    resetView();
  };

  const changeImage = (index: number) => {
    setSelectedImage(index);
    resetView();
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 0.5);

      if (next <= 1) {
        x.set(0);
        y.set(0);
      }

      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        changeImage((selectedImage + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        changeImage(
          (selectedImage - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, images.length]);

  return (
    <>
      {/* Back button */}
      <div className="mb-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back
        </Link>
      </div>

      {/* Product image grid */}
      <div className="grid grid-cols-2 gap-1">
        {images.map((img, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => openImage(index)}
            whileHover={{ scale: 0.99 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`View product image ${index + 1}`}
            className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded border border-neutral-200 bg-white"
          >
            <Image
              src={img}
              alt={`Product image ${index + 1}`}
              width={500}
              height={625}
              className="h-full w-full rounded object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
            />

            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn size={17} />
            </span>
          </motion.button>
        ))}
      </div>

      {/* Shadcn image viewer dialog */}
      <Dialog
        open={selectedImage !== null}
        onOpenChange={(open) => {
          if (!open) closePopup();
        }}
      >
        <DialogContent
          showCloseButton={false}
          onClick={closePopup}
          className="!fixed !inset-0 !left-0 !top-0 !h-dvh !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !bg-black/85 !p-3 !shadow-none !backdrop-blur-sm overflow-hidden sm:!p-6"
        >
          <DialogTitle className="sr-only">
            Product image viewer
          </DialogTitle>

          {selectedImage !== null && (
            <>
              {/* Close */}
              <button
                type="button"
                onClick={closePopup}
                aria-label="Close image viewer"
                className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition hover:bg-white hover:text-black sm:right-7 sm:top-7"
              >
                <X size={22} />
              </button>

              {/* Image counter */}
              <div className="absolute left-4 top-5 z-30 text-xs tracking-[0.2em] text-white/80 sm:left-7 sm:top-8">
                {String(selectedImage + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </div>

              {/* Image stage */}
              <motion.div
                key={selectedImage}
                className="relative flex h-[78vh] w-full max-w-5xl items-center justify-center overflow-hidden sm:h-[82vh]"
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(event) => event.stopPropagation()}
              >
                <motion.div
                  className={`relative h-full w-full ${
                    zoom > 1
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-zoom-in"
                  }`}
                  style={{
                    x,
                    y,
                    scale: zoom,
                    touchAction: zoom > 1 ? "none" : "pan-y",
                  }}
                  drag={zoom > 1}
                  dragMomentum={false}
                  dragElastic={0.08}
                  dragConstraints={{
                    left: -Math.max(0, (zoom - 1) * 450),
                    right: Math.max(0, (zoom - 1) * 450),
                    top: -Math.max(0, (zoom - 1) * 550),
                    bottom: Math.max(0, (zoom - 1) * 550),
                  }}
                  onDoubleClick={() => {
                    if (zoom > 1) {
                      resetView();
                    } else {
                      setZoom(2);
                    }
                  }}
                >
                  <Image
                    src={images[selectedImage]}
                    alt={`Product image ${selectedImage + 1}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="pointer-events-none select-none object-contain"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>

              {/* Navigation */}
              <div
                className="absolute bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() =>
                    changeImage(
                      (selectedImage - 1 + images.length) % images.length,
                    )
                  }
                  className="rounded-full border border-white/20 px-4 py-2 text-xs tracking-widest text-white transition hover:bg-white hover:text-black"
                >
                  PREV
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeImage((selectedImage + 1) % images.length)
                  }
                  className="rounded-full border border-white/20 px-4 py-2 text-xs tracking-widest text-white transition hover:bg-white hover:text-black"
                >
                  NEXT
                </button>
              </div>

              {/* Zoom controls */}
              <motion.div
                className="absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/50 p-1.5 text-white shadow-xl backdrop-blur-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  aria-label="Zoom out"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-30"
                >
                  <ZoomOut size={19} />
                </button>

                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Reset zoom and position"
                  className="min-w-14 rounded-full px-2 py-2 text-xs tabular-nums transition hover:bg-white/15"
                >
                  {Math.round(zoom * 100)}%
                </button>

                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  aria-label="Zoom in"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-30"
                >
                  <ZoomIn size={19} />
                </button>

                <span className="mx-1 h-5 w-px bg-white/20" />

                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Reset image"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15"
                >
                  <RotateCcw size={16} />
                </button>
              </motion.div>

              {/* Hint */}
              <p className="pointer-events-none absolute bottom-1 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] tracking-wider text-white/50 sm:block">
                ZOOM IN TO DRAG · DOUBLE-CLICK TO ZOOM
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImages;
