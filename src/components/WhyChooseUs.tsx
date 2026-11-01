
"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Premium Quality",
    description:
      "Carefully selected fabrics and exceptional craftsmanship. Every detail matters.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Fast Delivery",
    description:
      "Your favorite pieces delivered safely and quickly, right to your doorstep.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Easy Returns",
    description:
      "Shop with confidence. We make returns and exchanges simple and convenient.",
    icon: RefreshCcw,
  },
  {
    number: "04",
    title: "Secure Shopping",
    description:
      "A smooth and secure shopping experience with reliable payment options.",
    icon: ShieldCheck,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="bg-[#f8f7f4] px-5 py-20 md:px-20 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center md:mb-20"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">
            The Oqtos Experience
          </span>

          <h2 className="mt-4 text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            Why Choose <span className="font-serif italic">Us?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500 md:text-base">
            More than just clothing. We bring together quality,
            comfort and timeless style to make every experience special.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 border-t border-neutral-200 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.number}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group relative border-b border-neutral-200 px-6 py-10 transition-colors duration-300 hover:bg-white sm:border-r sm:px-7 lg:border-b-0 lg:py-12"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest text-neutral-400">
                    / {feature.number}
                  </span>

                  <Icon
                    size={23}
                    strokeWidth={1.3}
                    className="text-neutral-800 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  />
                </div>

                <h3 className="mt-12 text-lg font-medium tracking-tight text-neutral-900">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {feature.description}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <span className="h-px w-10 bg-neutral-300 transition-all duration-500 group-hover:w-16 group-hover:bg-black" />

                  <ArrowUpRight
                    size={17}
                    className="text-neutral-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 flex flex-col items-center justify-between gap-5 md:mt-16 md:flex-row"
        >
          <p className="text-center text-xs tracking-wide text-neutral-500 md:text-left">
            Thoughtfully made. Beautifully worn. Made for you.
          </p>

          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            OQTOS — EST. 2026
          </span>
        </motion.div>

      </div>
    </section>
  );
}
