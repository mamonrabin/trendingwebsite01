
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue } from "framer-motion";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Product = {
  id: string | number;
  name: string;
  price: number;
  sideImage: string;
  frontImage: string;
  backImage: string;
  sizes: string[];
  slug: string;
};

type ProductQuickViewProps = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, size: string) => void;
  index?: number;
  total?: number;
};

export default function ProductQuickView({
  product,
  open,
  onClose,
  onAddToCart,
  index = 1,
  total = 1,
}: ProductQuickViewProps) {
  const [view, setView] = useState<"front" | "back">("front");
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const rotation = useMotionValue(0);

  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const animationRef = useRef<{ stop: () => void } | null>(null);

  const stopAnimation = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
  }, []);

  const rotateTo = useCallback(
    (target: number) => {
      stopAnimation();

      const normalized = ((target % 360) + 360) % 360;

      setView(
        normalized >= 90 && normalized < 270 ? "back" : "front",
      );

      animationRef.current = animate(rotation, target, {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.85,
      });
    },
    [rotation, stopAnimation],
  );

  const settleRotation = useCallback(() => {
    const currentRotation = rotation.get();
    const targetRotation = Math.round(currentRotation / 180) * 180;

    rotateTo(targetRotation);
  }, [rotation, rotateTo]);

  // Reset when product changes
  useEffect(() => {
    stopAnimation();
    rotation.set(0);
    setView("front");
    setSize("");
    setAdded(false);
    setIsDragging(false);
    activePointerId.current = null;

    return stopAnimation;
  }, [product.id, rotation, stopAnimation]);

  // Stop animations when dialog closes
  useEffect(() => {
    if (open) return;

    stopAnimation();
    setIsDragging(false);
    activePointerId.current = null;
  }, [open, stopAnimation]);

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    stopAnimation();

    activePointerId.current = event.pointerId;
    dragStartX.current = event.clientX;
    dragStartRotation.current = rotation.get();

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (activePointerId.current !== event.pointerId) return;

    const deltaX = event.clientX - dragStartX.current;
    const nextRotation = dragStartRotation.current + deltaX * 0.8;

    rotation.set(nextRotation);

    const normalized = ((nextRotation % 360) + 360) % 360;

    setView(
      normalized >= 90 && normalized < 270 ? "back" : "front",
    );
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (activePointerId.current !== event.pointerId) return;

    activePointerId.current = null;
    setIsDragging(false);

    settleRotation();
  };

  const handlePointerCancel = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (activePointerId.current !== event.pointerId) return;

    activePointerId.current = null;
    setIsDragging(false);

    settleRotation();
  };

  const handleAddToCart = () => {
    if (!size) return;

    onAddToCart?.(product, size);
    setAdded(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="!fixed !inset-0 !left-0 !top-0 !h-dvh !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !bg-white !p-0 !shadow-none overflow-y-auto"
      >
        <DialogTitle className="sr-only">
          {product.name} - Quick View
        </DialogTitle>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="fixed right-5 top-5 z-50 flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-black md:right-10 md:top-8"
        >
          <span>Close</span>
          <X size={20} strokeWidth={1.2} />
        </button>

        <div className="flex min-h-dvh flex-col lg:flex-row">

          {/* Product rotation viewer */}
          <div className="relative flex min-h-[55vh] w-full items-center justify-center overflow-hidden bg-[#f8f8f8] lg:min-h-dvh lg:w-[62%]">

            <div
              className={`relative h-[50vh] w-full max-w-[650px] touch-pan-y ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              } lg:h-[80vh]`}
              style={{ perspective: "1200px" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") rotateTo(0);
                if (event.key === "ArrowRight") rotateTo(180);
              }}
              tabIndex={0}
              role="group"
              aria-label="Drag horizontally to rotate the product"
            >
              <motion.div
                className="relative h-full w-full"
                style={{
                  rotateY: rotation,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={product.frontImage}
                    alt={`${product.name} - front`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    className="pointer-events-none select-none object-contain"
                    draggable={false}
                    priority
                  />
                </div>

                {/* Back image */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={product.backImage}
                    alt={`${product.name} - back`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    className="pointer-events-none select-none object-contain"
                    draggable={false}
                  />
                </div>
              </motion.div>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-6 left-6 text-xs tracking-widest text-black/60 lg:bottom-10 lg:left-10">
              {String(index).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </div>

            <span className="pointer-events-none absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.2em] text-neutral-400 lg:bottom-10 lg:right-10">
              Drag to rotate
            </span>
          </div>

          {/* Product details */}
          <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-[38%] lg:px-14 xl:px-20">
            <div className="mx-auto w-full max-w-[420px]">

              <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                Product details
              </p>

              <h2 className="text-3xl font-normal tracking-tight text-black md:text-4xl">
                {product.name}
              </h2>

              <p className="mt-3 text-base text-neutral-600">
                ${product.price.toFixed(2)}
              </p>

              {/* Front / Back controls */}
              <div className="mt-10 flex gap-8 border-b border-neutral-200">
                {(["front", "back"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      rotateTo(item === "front" ? 0 : 180)
                    }
                    aria-pressed={view === item}
                    className={`relative pb-4 text-xs uppercase tracking-[0.15em] transition-colors ${
                      view === item
                        ? "text-black"
                        : "text-neutral-400 hover:text-black"
                    }`}
                  >
                    {item}

                    {view === item && (
                      <span className="absolute bottom-0 left-0 h-px w-full bg-black" />
                    )}
                  </button>
                ))}
              </div>

              {/* Size selection */}
              <div className="mt-10">
                <p className="mb-4 text-xs uppercase tracking-[0.15em]">
                  Size {size && `— ${size}`}
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSize(item);
                        setAdded(false);
                      }}
                      aria-pressed={size === item}
                      className={`flex h-11 min-w-12 items-center justify-center border px-3 text-xs transition-all duration-200 ${
                        size === item
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 bg-white text-black hover:border-black"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!size}
                className="mt-10 flex h-14 w-full items-center justify-center bg-black text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {added ? "Added to cart" : "Add to cart"}
              </button>

              {/* Product page link */}
              <div className="mt-8 border-t border-neutral-200 pt-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-black">
                    {product.name}
                  </span>

                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="border-b border-black pb-1 text-[11px] uppercase tracking-[0.1em] text-black transition-opacity hover:opacity-50"
                  >
                    View product page
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
