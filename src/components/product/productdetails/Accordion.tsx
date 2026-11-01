"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, RotateCcw, Truck } from "lucide-react";

const accordionItems = [
  {
    title: "Product details",
    icon: null,
    content: (
      <p className="text-sm leading-7 text-neutral-500">
        A versatile wardrobe essential. Please confirm the actual fabric
        composition, fit, and care instructions before publishing this
        product information.
      </p>
    ),
  },
  {
    title: "Shipping & delivery",
    icon: Truck,
    content: (
      <div className="flex gap-3 text-sm leading-6 text-neutral-500">
        <Truck size={18} className="mt-1 shrink-0" />
        <p>
          Delivery estimates and shipping charges are shown during checkout.
        </p>
      </div>
    ),
  },
  {
    title: "Returns & exchanges",
    icon: RotateCcw,
    content: (
      <div className="flex gap-3 text-sm leading-6 text-neutral-500">
        <RotateCcw size={18} className="mt-1 shrink-0" />
        <p>
          Please review the stores return and exchange policy before placing
          your order.
        </p>
      </div>
    ),
  },
];

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-9 divide-y divide-neutral-200 border-y border-neutral-200">
      {accordionItems.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.title} className="py-4">
            <button
              type="button"
              onClick={() =>
                setOpenIndex(isOpen ? null : index)
              }
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer list-none items-center justify-between text-left text-xs uppercase tracking-[0.12em]"
            >
              <span>{item.title}</span>

              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex shrink-0"
              >
                <ChevronDown size={16} strokeWidth={1.5} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{
                    height: 0,
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    y: -4,
                  }}
                  transition={{
                    height: {
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: {
                      duration: 0.25,
                    },
                    y: {
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;