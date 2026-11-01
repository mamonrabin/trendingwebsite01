"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function SizeSelector() {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");

  return (
    <div className="mt-2 grid grid-cols-6 gap-2 py-2">
      {sizes.map((size) => {
        const isSelected = selectedSize === size;
        const isHovered = hoveredSize === size;
        const isActive =
          isHovered || (!hoveredSize && isSelected);

        return (
          <button
            key={size}
            type="button"
            aria-pressed={isSelected}
            onMouseEnter={() => setHoveredSize(size)}
            onMouseLeave={() => setHoveredSize(null)}
            onFocus={() => setHoveredSize(size)}
            onBlur={() => setHoveredSize(null)}
            onClick={() => setSelectedSize(size)}
            className={`relative flex h-11 cursor-pointer items-center justify-center border text-xs transition-colors duration-200 ${
              isSelected
                ? "border-black"
                : "border-neutral-200"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="size-hover-bg"
                className="absolute inset-0 bg-black"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              />
            )}

            <span
              className={`relative z-10 transition-colors duration-200 ${
                isActive ? "text-white" : "text-black"
              }`}
            >
              {size}
            </span>
          </button>
        );
      })}
    </div>
  );
}