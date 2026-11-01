"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ProductQuickView from "@/components/product/ProductQuickView";
import { products } from "@/api/productsApi";

type ProductView = "side" | "front" | "back";

const angles: Record<ProductView, number> = {
  front: 0,
  side: 90,
  back: 180,
};

const descriptions: Record<string, string> = {
  "hoodie-black": "Crafted in heavyweight fleece. Cut oversized. Made to last.",
  blazzer: "A refined silhouette. Modern tailoring. Effortless confidence.",
  hoodie: "Everyday comfort. Premium texture. Designed for your rotation.",
  sweatshirt: "Elevated essentials with a relaxed, contemporary fit.",
  "sweatshirt-plus": "Room to move. Premium construction. Timeless streetwear.",
  tshirt: "Clean lines. Everyday versatility. Made for your wardrobe.",
};

const buttonClass =
  "inline-flex min-h-12 items-center justify-center gap-4 rounded-full border border-[#2b2b28] bg-[#2b2b28] px-6 text-[11px] font-semibold text-white transition-colors duration-300 hover:bg-[#f4f1ec] hover:text-[#2b2b28]";

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState<ProductView>("side");
  const [paused, setPaused] = useState(false);
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);

  const reduceMotion = useReducedMotion();

  const activeProduct = products[activeIndex];

  const quickViewProduct =
    quickViewIndex !== null ? products[quickViewIndex] : null;

  useEffect(() => {
    if (
      paused ||
      quickViewIndex !== null ||
      products.length <= 1 ||
      reduceMotion
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
      setView("side");
    }, 3500);

    return () => window.clearInterval(timer);
  }, [paused, quickViewIndex, reduceMotion]);

  const selectProduct = (index: number, nextView: ProductView = "side") => {
    setActiveIndex(index);
    setView(nextView);
  };

  const openQuickView = (index: number) => {
    setActiveIndex(index);
    setQuickViewIndex(index);
    setPaused(true);
  };

  const closeQuickView = () => {
    setQuickViewIndex(null);
    setPaused(false);
  };

  if (!activeProduct) return null;

  return (
    <>
      <section
        aria-label="New collection"
        className="w-full overflow-hidden bg-white py-12 text-[#2b2b28] md:py-16 lg:py-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setView("side");
        }}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false);
          }
        }}
      >
        <div className="mx-auto w-full max-w-[1800px] px-4 md:px-6 lg:px-12">
          {/* Section Heading */}
          <div className="mb-8 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] md:mb-10 md:text-[10px]">
            <span>New Collection</span>

            <span className="h-px w-8 bg-[#c7c7c2]" />

            <span className="font-medium text-[#858580]">
              Premium Streetwear
            </span>
          </div>

          {/* Rack Stage */}
          <div className="relative isolate h-[290px] [perspective:1000px] sm:h-[350px] md:h-[410px] lg:h-[470px] xl:h-[510px]">
            {/* Metal Rod */}
            <div className="absolute top-2 right-[2%] left-[2%] z-10 flex h-4 items-center md:right-[4%] md:left-[4%]">
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#e9e9e4] bg-gradient-to-br from-[#d8d8d2] to-[#85857f]" />

              <span className="h-[5px] flex-1 rounded-full bg-gradient-to-b from-[#f1f1ee] via-[#a4a49f] to-[#eeeeea] shadow-[0_2px_4px_rgba(0,0,0,0.12)]" />

              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#e9e9e4] bg-gradient-to-br from-[#d8d8d2] to-[#85857f]" />
            </div>

            {/* Rack Items */}
            <div className="absolute inset-0 flex items-stretch justify-around gap-0.5 px-[2%] pt-[16px] sm:gap-1 md:gap-2 md:px-[4%]">
              {products.map((product, index) => {
                const isActive = index === activeIndex;
                const angle = isActive ? angles[view] : angles.side;

                return (
                  <motion.button
                    key={product.id}
                    type="button"
                    aria-label={`Quick view ${product.name}`}
                    aria-pressed={isActive}
                    onMouseEnter={() => selectProduct(index, "front")}
                    onFocus={() => selectProduct(index, "front")}
                    onClick={() => openQuickView(index)}
                    initial={false}
                    animate={{
                      flexGrow: isActive ? 1.65 : 1,
                      opacity: isActive ? 1 : 0.82,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative flex h-full min-w-0 basis-0 flex-col items-center overflow-visible border-0 bg-transparent p-0 outline-none [perspective:800px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                    style={{
                      zIndex: isActive ? 8 : 2,
                    }}
                  >
                    {/* 
                      Shared Hanging Assembly
                      Hanger, string and price move together.
                    */}
                    <motion.span
                      initial={false}
                      animate={{
                        rotate: isActive ? 0 : 2,
                        y: isActive ? 0 : 2,
                      }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.45,
                        ease: "easeOut",
                      }}
                      className="pointer-events-none absolute top-0 left-1/2 z-20 block h-[80px] w-[90px] -translate-x-1/2 sm:w-[105px] md:w-[120px]"
                    >
                      {/* Hanger Hook */}
                      <span className="absolute top-[-2px] left-1/2 h-[19px] w-[11px] -translate-x-1/2 rounded-b-[6px] border-[1.5px] border-t-0 border-[#999994] before:absolute before:-top-[7px] before:left-[3px] before:h-[8px] before:w-[5px] before:rounded-t-full before:border-[1.5px] before:border-b-0 before:border-[#999994]" />

                      {/* Hanger Neck */}
                      <span className="absolute top-[16px] left-1/2 h-[23px] w-[1.5px] -translate-x-1/2 bg-[#858580] shadow-[0_1px_1px_rgba(0,0,0,0.15)]" />

                      {/* Hanging Price Tag */}
                  {/* Hanging Price Tag */}
<motion.span
  initial={false}
  animate={{
    rotate: isActive
      ? reduceMotion
        ? 0
        : [4, -3, 2, 0]
      : -3,
    scale: isActive ? 1 : 0.95,
  }}
  transition={{
    duration: reduceMotion ? 0 : 1.15,
    ease: "easeOut",
  }}
  style={{
    transformOrigin: "top center",
  }}
  className="absolute top-[38px] left-1/2 flex -translate-x-1/2 flex-col items-center"
>
  {/* Tag String */}
  <span className="h-[14px] w-[1.5px] bg-[#77746f]" />

  {/* Price Label */}
  <span className="relative flex h-[29px] min-w-[46px] items-center justify-center rounded-[4px] border-[1.5px] border-[#77746f] bg-[#fffefa] px-2 shadow-[1px_2px_5px_rgba(0,0,0,0.16)] sm:h-[32px] sm:min-w-[54px]">

    {/* Tag Hole */}
    <span className="absolute top-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#77746f]" />

    {/* Price */}
    <span className="pt-1 text-[9px] font-bold text-[#292929] sm:text-[11px]">
      ${product.price}
    </span>
  </span>
</motion.span>
                    </motion.span>

                    {/* Garment */}
                    <motion.span
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : 0.96,
                        y: isActive ? 0 : 3,
                      }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.35,
                        ease: "easeOut",
                      }}
                      className="relative mt-[32px] flex min-h-0 w-full flex-1 items-start justify-center [perspective:900px] [perspective-origin:50%_10%]"
                    >
                      {/* Rotating 3D Garment */}
                      <motion.span
                        initial={false}
                        animate={{
                          rotateY: angle,
                        }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative block h-full w-full [transform-origin:50%_8%] [transform-style:preserve-3d]"
                      >
                        {(
                          [
                            {
                              key: "front",
                              src: product.images.front,
                              rotation: 0,
                            },
                            {
                              key: "back",
                              src: product.images.back,
                              rotation: 180,
                            },
                            {
                              key: "side",
                              src: product.images.side,
                              rotation: -90,
                            },
                            {
                              key: "far",
                              src: product.images.side,
                              rotation: 90,
                            },
                          ] as const
                        ).map((face) => (
                          <span
                            key={face.key}
                            aria-hidden={face.key === "far"}
                            className="absolute inset-0 flex items-start justify-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                            style={{
                              transform: `rotateY(${face.rotation}deg) translateZ(1px)`,
                            }}
                          >
                            <Image
                              src={face.src}
                              alt={
                                face.key === "far"
                                  ? ""
                                  : `${product.name} ${face.key}`
                              }
                              width={500}
                              height={600}
                              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 20vw"
                              priority={index < 3}
                              draggable={false}
                              className={`pointer-events-none block h-full w-full select-none object-contain object-top transition-[filter] duration-300 ${
                                isActive
                                  ? "drop-shadow-[0_12px_12px_rgba(0,0,0,0.1)]"
                                  : "drop-shadow-[0_6px_7px_rgba(0,0,0,0.04)]"
                              }`}
                            />
                          </span>
                        ))}
                      </motion.span>
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-5 mb-8 flex items-center justify-center gap-2 md:mt-7 md:mb-10">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                type="button"
                aria-label={`Show ${product.name}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => selectProduct(index)}
                initial={false}
                animate={{
                  width: activeIndex === index ? 24 : 6,
                  backgroundColor:
                    activeIndex === index ? "#2b2b28" : "#d6d6d0",
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.3,
                }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Product Details */}
          <div
            aria-live="polite"
            className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-6 md:flex-row md:items-end"
          >
            <div className="min-w-0">
              <span className="mb-3 block text-[10px] tracking-[0.14em] text-[#858580]">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(products.length).padStart(2, "0")}
              </span>

              <motion.div
                key={activeProduct.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-[27px] leading-[1.15] font-medium tracking-[-0.045em] md:text-4xl">
                  {activeProduct.name}
                </h2>

                <p className="mt-3 mb-2 max-w-[420px] text-xs leading-[1.8] text-[#777771] md:text-[13px]">
                  {descriptions[activeProduct.id] ?? ""}
                </p>

                <span className="text-[13px] font-semibold">
                  ${activeProduct.price.toFixed(2)}
                </span>
              </motion.div>
            </div>

            {/* Product Actions */}
            <div className="flex w-full shrink-0 flex-col items-stretch gap-4 md:w-auto md:items-end">
              <div
                className="flex items-center gap-4"
                aria-label="Product view"
              >
                {(["side", "front", "back"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={view === item}
                    onClick={() => setView(item)}
                    className={`cursor-pointer border-b pb-1.5 text-[10px] uppercase tracking-[0.1em] transition-colors duration-200 ${
                      view === item
                        ? "border-[#2b2b28] text-[#2b2b28]"
                        : "border-transparent text-[#898982] hover:text-black"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Quick View Dialog */}
      {quickViewProduct && quickViewIndex !== null && (
        <ProductQuickView
          product={{
            id: quickViewProduct.id,
            name: quickViewProduct.name,
            price: quickViewProduct.price,
            sideImage: quickViewProduct.images.side,
            frontImage: quickViewProduct.images.front,
            backImage: quickViewProduct.images.back,
            sizes: ["S", "M", "L", "XL"],
            slug: quickViewProduct.href.replace(/^\/products?\//, ""),
          }}
          open={true}
          index={quickViewIndex + 1}
          total={products.length}
          onClose={closeQuickView}
          onAddToCart={(product, size) => {
            // Connect your actual cart handler here.
            console.log("Added to cart:", product, size);
          }}
        />
      )}
    </>
  );
}
