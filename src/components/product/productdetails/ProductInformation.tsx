"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import SizeGuide from "./SizeGuide";
import SizeSelector from "./SizeSelector";
import { motion } from "framer-motion";
import Accordion from "./Accordion";

const ProductInformation = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const colors = [
    { name: "Black", value: "#171717" },
    { name: "Grey", value: "#9B9B97" },
    { name: "Off White", value: "#EAE5DC" },
  ];

  // Replace with the actual price from your Shopify product.
  const price = 65;

  const handleAddToCart = () => {
    setAdded(true);

    // Connect your cart functionality here.
    console.log({
      product: "Sweatshirt",
      size: selectedSize,
      color: selectedColor,
      quantity,
      price,
    });
  };

  return (
    <section className="px-5 py-8 text-[#242420] sm:px-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="mb-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
        <span>Home</span>
        <span>/</span>
        <span>Clothing</span>
        <span>/</span>
        <span className="text-neutral-800">Sweatshirt</span>
      </div>

      {/* Product title */}
      <div className="mb-5">
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-neutral-500">
          Contemporary Essentials
        </p>

        <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
          Sweatshirt
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-lg font-medium">${price.toFixed(2)}</span>

          <span className="text-xs text-neutral-400">Tax included</span>
        </div>
      </div>

      <div className="mb-7 h-px bg-neutral-200" />

      {/* Description */}
      <p className="mb-8 max-w-md text-sm leading-7 text-neutral-600">
        An everyday essential designed for effortless styling. A versatile
        sweatshirt that pairs easily with denim, tailored trousers, and your
        favorite everyday pieces.
      </p>

      {/* Color selection */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.15em]">
            Color
          </p>
          <span className="text-xs text-neutral-500">{selectedColor}</span>
        </div>

        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name)}
              aria-label={`Select ${color.name}`}
              aria-pressed={selectedColor === color.name}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                selectedColor === color.name
                  ? "ring-1 ring-black ring-offset-2"
                  : "ring-1 ring-transparent hover:ring-neutral-300"
              }`}
            >
              <span
                className="h-7 w-7 rounded-full border border-black/10"
                style={{ backgroundColor: color.value }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Size selection */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest">
            Select size
          </span>

          <SizeGuide />
        </div>
        <SizeSelector />
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <p className="mb-2 mt-2 text-xs font-medium uppercase tracking-[0.15em]">
          Quantity
        </p>

        <div className="flex h-12 w-32 items-center justify-between border border-neutral-200 px-3">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="text-neutral-600 transition hover:text-black disabled:opacity-30"
          >
            <Minus size={15} />
          </button>

          <span className="text-sm tabular-nums">{quantity}</span>

          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(99, current + 1))}
            disabled={quantity >= 99}
            aria-label="Increase quantity"
            className="text-neutral-600 transition hover:text-black disabled:opacity-30"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <div className="mt-6 flex gap-3">
  <motion.button
    type="button"
    onClick={handleAddToCart}
    whileHover={{
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.35 },
    }}
    whileTap={{ scale: 0.98 }}
    className="flex h-14 flex-1 items-center justify-center gap-3 bg-[#22221F] px-4 text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-black"
  >
    <ShoppingBag size={17} strokeWidth={1.5} />
    {added ? "Added — Connect Cart" : "Add to cart"}
  </motion.button>
</div>

      {/* Additional information */}
     <Accordion/>

      {/* Size guide placeholder */}
      <div id="size-guide" className="scroll-mt-8" />
    </section>
  );
};

export default ProductInformation;
