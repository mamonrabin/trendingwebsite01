
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Ruler,
  RotateCcw,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Gender = "female" | "male";
type Fit = "close" | "regular" | "relaxed";
type Shape = -1 | 0 | 1;
type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const SIZE_WEIGHTS: Record<Size, number> = {
  XS: 48,
  S: 58,
  M: 68,
  L: 80,
  XL: 94,
  XXL: 110,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const steps = [
  { number: "01", title: "Your measurements" },
  { number: "02", title: "Your shape" },
  { number: "03", title: "Your preferred fit" },
  { number: "04", title: "Your recommendation" },
];

const initialShapes = {
  chest: 0 as Shape,
  stomach: 0 as Shape,
  hips: 0 as Shape,
  thighs: 0 as Shape,
};

export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [gender, setGender] = useState<Gender>("female");
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(75);

  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("ft");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");

  const [shapes, setShapes] = useState(initialShapes);
  const [fit, setFit] = useState<Fit>("regular");
  const [comparisonSize, setComparisonSize] = useState<Size | null>(null);

  const recommendation = useMemo(() => {
    // Illustrative weight-based estimate only.
    // Replace with garment measurements for production accuracy.
    const adjustedWeight =
      weight +
      shapes.chest * 3 +
      shapes.stomach * 4 +
      shapes.hips * 2 +
      shapes.thighs * 2;

    const heightAdjustment = height < 160 ? -4 : height > 190 ? 4 : 0;

    const fitAdjustment =
      fit === "close" ? -5 : fit === "relaxed" ? 8 : 0;

    const target = adjustedWeight + heightAdjustment + fitAdjustment;

    const index = clamp(
      SIZES.findIndex((size) => target <= SIZE_WEIGHTS[size]),
      0,
      SIZES.length - 1,
    );

    const size = SIZES[index];

    const confidence = Math.round(
      clamp(
        94 -
          Math.abs(target - SIZE_WEIGHTS[size]) * 0.55 -
          (Object.values(shapes).some((value) => value !== 0) ? 4 : 0),
        65,
        94,
      ),
    );

    return { size, index, confidence };
  }, [weight, height, shapes, fit]);

  const displayedSize = comparisonSize ?? recommendation.size;

  const reset = () => {
    setStep(1);
    setGender("female");
    setHeight(178);
    setWeight(75);
    setHeightUnit("ft");
    setWeightUnit("kg");
    setShapes(initialShapes);
    setFit("regular");
    setComparisonSize(null);
  };

  const closeGuide = () => {
    setOpen(false);
    setComparisonSize(null);
  };

  const next = () => {
    setComparisonSize(null);
    setStep((current) => Math.min(current + 1, 4));
  };

  const previous = () => {
    setComparisonSize(null);
    setStep((current) => Math.max(current - 1, 1));
  };

  const updateShape = (key: keyof typeof shapes, value: Shape) => {
    setShapes((current) => ({ ...current, [key]: value }));
    setComparisonSize(null);
  };

  const displayHeight = () => {
    if (heightUnit === "cm") return `${height} cm`;

    const totalInches = Math.round(height / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    return `${feet}′${inches}″`;
  };

  const displayWeight = () => {
    return weightUnit === "kg"
      ? `${weight} kg`
      : `${Math.round(weight * 2.20462)} lbs`;
  };

  const shapeOptions = [
    {
      key: "chest" as const,
      title: gender === "female" ? "Bust" : "Chest",
      options: ["Slimmer", "Average", "Broader"],
    },
    {
      key: "stomach" as const,
      title: "Waist & stomach",
      options: ["Flatter", "Average", "Rounder"],
    },
    {
      key: "hips" as const,
      title: gender === "female" ? "Hips" : "Seat",
      options: ["Narrower", "Average", "Fuller"],
    },
    {
      key: "thighs" as const,
      title: "Thighs",
      options: ["Slimmer", "Average", "Fuller"],
    },
  ];

  const fitOptions: {
    value: Fit;
    title: string;
    description: string;
    silhouette: string;
  }[] = [
    {
      value: "close",
      title: "Close",
      description: "Follows the body. Sharp and tailored.",
      silhouette: "w-7",
    },
    {
      value: "regular",
      title: "As designed",
      description: "A balanced everyday silhouette.",
      silhouette: "w-9",
    },
    {
      value: "relaxed",
      title: "Relaxed",
      description: "Extra room for movement and layering.",
      silhouette: "w-12",
    },
  ];

  const activeStep = steps[step - 1];

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 border-b border-neutral-400 pb-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
      >
        <Ruler size={15} strokeWidth={1.5} />
        Find your size
        <ChevronRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[92dvh] w-[calc(100%-20px)] max-w-[600px] flex-col gap-0 overflow-hidden rounded-sm border-neutral-200 bg-[#FCFBF8] p-0 text-[#292923] sm:w-full"
        >
          {/* Header */}
          <div className="shrink-0 border-b border-neutral-200 px-5 pb-5 pt-5 sm:px-8 sm:pt-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                  Personal fit assistant
                </p>

                <DialogTitle className="text-2xl font-normal tracking-tight sm:text-3xl">
                  Find your fit
                </DialogTitle>

                <DialogDescription className="mt-2 text-xs leading-5 text-neutral-500">
                  A more considered way to find your size.
                </DialogDescription>
              </div>

              <button
                type="button"
                onClick={closeGuide}
                aria-label="Close size guide"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 transition hover:bg-neutral-100"
              >
                <X size={17} />
              </button>
            </div>

            {/* Product summary */}
            <div className="mt-5 flex items-center gap-3 border-t border-neutral-200 pt-4">
              <div className="flex h-14 w-12 shrink-0 items-center justify-center bg-[#F0EEE8]">
                <svg
                  viewBox="0 0 48 56"
                  className="h-11 w-10 text-neutral-700"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M15 7 20 4h8l5 3 9 5 4 13-8 3-4-8v29H14V20l-4 8-8-3 4-13z" />
                  <path
                    d="M20 4q4 9 8 0"
                    fill="none"
                    stroke="#FCFBF8"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm">Sweatshirt</p>
                <p className="mt-1 text-xs text-neutral-500">$199.00</p>
              </div>

              <span className="ml-auto text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                Size guide
              </span>
            </div>

            {/* Progress */}
            <div className="mt-5 flex items-center gap-2">
              {steps.map((item, index) => (
                <div key={item.number} className="flex-1">
                  <div
                    className={`h-[3px] transition-colors duration-300 ${
                      step >= index + 1 ? "bg-[#292923]" : "bg-neutral-200"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-neutral-400">
              <span>
                Step {String(step).padStart(2, "0")} of 04
              </span>
              <span className="text-neutral-700">{activeStep.title}</span>
            </div>
          </div>

          {/* Animated step content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-normal tracking-tight sm:text-2xl">
                      Let&apos;s find your fit
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      Two measurements are all it takes. Drag to adjust.
                    </p>

                    <p className="mb-3 mt-7 text-[10px] uppercase tracking-[0.16em]">
                      Sizing
                    </p>

                    <div className="grid grid-cols-2 rounded-sm bg-[#F0EEE8] p-1">
                      {(["female", "male"] as Gender[]).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setGender(value)}
                          aria-pressed={gender === value}
                          className={`h-10 text-xs transition ${
                            gender === value
                              ? "bg-white text-black shadow-sm"
                              : "text-neutral-500 hover:text-black"
                          }`}
                        >
                          {value === "female" ? "Womenswear" : "Menswear"}
                        </button>
                      ))}
                    </div>

                    {/* Height */}
                    <div className="mt-7">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="fit-height"
                          className="text-xs font-medium"
                        >
                          Height
                        </label>

                        <div className="flex rounded-sm border border-neutral-200 p-0.5">
                          {(["cm", "ft"] as const).map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => setHeightUnit(unit)}
                              aria-pressed={heightUnit === unit}
                              className={`px-3 py-1.5 text-[10px] ${
                                heightUnit === unit
                                  ? "bg-[#292923] text-white"
                                  : "text-neutral-500"
                              }`}
                            >
                              {unit === "cm" ? "cm" : "ft/in"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-2xl font-light tabular-nums">
                          {displayHeight()}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          140–210 cm
                        </span>
                      </div>

                      <input
                        id="fit-height"
                        aria-label="Height"
                        type="range"
                        min={140}
                        max={210}
                        step={1}
                        value={height}
                        onChange={(event) =>
                          setHeight(Number(event.target.value))
                        }
                        className="size-range mt-4 w-full cursor-pointer"
                        style={
                          {
                            "--range-progress": `${
                              ((height - 140) / 70) * 100
                            }%`,
                          } as React.CSSProperties
                        }
                      />
                    </div>

                    {/* Weight */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="fit-weight"
                          className="text-xs font-medium"
                        >
                          Weight
                        </label>

                        <div className="flex rounded-sm border border-neutral-200 p-0.5">
                          {(["kg", "lbs"] as const).map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => setWeightUnit(unit)}
                              aria-pressed={weightUnit === unit}
                              className={`px-3 py-1.5 text-[10px] ${
                                weightUnit === unit
                                  ? "bg-[#292923] text-white"
                                  : "text-neutral-500"
                              }`}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-2xl font-light tabular-nums">
                          {displayWeight()}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          40–150 kg
                        </span>
                      </div>

                      <input
                        id="fit-weight"
                        aria-label="Weight"
                        type="range"
                        min={40}
                        max={150}
                        step={1}
                        value={weight}
                        onChange={(event) =>
                          setWeight(Number(event.target.value))
                        }
                        className="size-range mt-4 w-full cursor-pointer"
                        style={
                          {
                            "--range-progress": `${
                              ((weight - 40) / 110) * 100
                            }%`,
                          } as React.CSSProperties
                        }
                      />
                    </div>

                    <p className="mt-6 border-t border-neutral-200 pt-4 text-[10px] leading-5 text-neutral-500">
                      These measurements are used for this estimate.
                      No measurements are sent to a server by this component.
                    </p>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <h3 className="text-xl font-normal tracking-tight sm:text-2xl">
                      Your shape
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      Clothes fit bodies, not numbers. Not sure? Leave it at
                      average.
                    </p>

                    <div className="mt-6 space-y-5">
                      {shapeOptions.map((item) => (
                        <div key={item.key}>
                          <p className="mb-3 text-xs font-medium">
                            {item.title}
                          </p>

                          <div className="grid grid-cols-3 gap-2">
                            {item.options.map((option, index) => {
                              const value = (index - 1) as Shape;
                              const selected =
                                shapes[item.key] === value;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() =>
                                    updateShape(item.key, value)
                                  }
                                  className={`flex min-h-[82px] flex-col items-center justify-center gap-2 border px-2 text-[10px] transition ${
                                    selected
                                      ? "border-[#292923] bg-[#F0EEE8]"
                                      : "border-neutral-200 hover:border-neutral-400"
                                  }`}
                                >
                                  <svg
                                    viewBox="0 0 44 34"
                                    className="h-8 w-10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d={
                                        item.key === "chest"
                                          ? [
                                              "M15 4 Q22 2 29 4 L27 29 H17 Z",
                                              "M12 4 Q22 1 32 4 L29 29 H15 Z",
                                              "M8 4 Q22 1 36 4 L31 29 H13 Z",
                                            ][index]
                                          : item.key === "stomach"
                                            ? [
                                                "M15 3 V30 M25 3 Q27 16 25 30",
                                                "M15 3 V30 M25 3 Q32 16 25 30",
                                                "M15 3 V30 M25 3 Q37 16 25 30",
                                              ][index]
                                            : [
                                                "M15 3 Q22 9 17 18 L15 30 M29 3 Q22 9 27 18 L29 30",
                                                "M15 3 Q22 9 17 18 L12 30 M29 3 Q22 9 27 18 L32 30",
                                                "M15 3 Q22 9 17 18 L8 30 M29 3 Q22 9 27 18 L36 30",
                                              ][index]
                                      }
                                    />
                                  </svg>

                                  <span>{option}</span>
                                  {selected && (
                                    <Check size={12} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <h3 className="text-xl font-normal tracking-tight sm:text-2xl">
                      How do you like it to fit?
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      Choose how you prefer to wear your sweatshirt.
                    </p>

                    <div className="mt-7 space-y-3">
                      {fitOptions.map((option) => {
                        const selected = fit === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFit(option.value);
                              setComparisonSize(null);
                            }}
                            aria-pressed={selected}
                            className={`flex w-full items-center gap-4 border p-4 text-left transition sm:p-5 ${
                              selected
                                ? "border-[#292923] bg-[#F0EEE8]"
                                : "border-neutral-200 hover:border-neutral-400"
                            }`}
                          >
                            <div className="flex h-16 w-14 shrink-0 items-center justify-center bg-white">
                              <svg
                                viewBox="0 0 56 56"
                                className="h-14 w-14"
                                aria-hidden="true"
                              >
                                <path
                                  d="M19 10 H37 L42 17 L48 35 L39 39 L35 27 L36 49 H20 L21 27 L17 39 L8 35 L14 17 Z"
                                  fill="#E3E0D8"
                                  stroke="#292923"
                                  strokeWidth="1"
                                />
                                <path
                                  d="M22 10 Q28 19 34 10"
                                  fill="none"
                                  stroke="#292923"
                                  strokeWidth="1"
                                />
                                <rect
                                  x={28 - (option.value === "close" ? 7 : option.value === "regular" ? 9 : 12)}
                                  y="18"
                                  width={option.value === "close" ? 14 : option.value === "regular" ? 18 : 24}
                                  height="29"
                                  rx="6"
                                  fill="#B8B3A8"
                                  opacity="0.5"
                                />
                              </svg>
                            </div>

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm">
                                {option.title}
                              </span>
                              <span className="mt-1 block text-[11px] leading-5 text-neutral-500">
                                {option.description}
                              </span>
                            </span>

                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-[#292923]"
                                  : "border-neutral-300"
                              }`}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-[#292923]" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                        Your recommended size
                      </p>

                      <motion.div
                        key={displayedSize}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 18,
                        }}
                        className="mx-auto mt-5 flex h-32 w-32 items-center justify-center rounded-full border border-neutral-200"
                      >
                        <div>
                          <p className="text-5xl font-light tracking-tight">
                            {displayedSize}
                          </p>
                          <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                            Your size
                          </p>
                        </div>
                      </motion.div>

                      <p className="mt-5 text-xs">
                        {comparisonSize
                          ? `Comparing size ${comparisonSize}`
                          : "Your estimated match"}
                      </p>

                      <div className="mx-auto mt-3 h-1.5 max-w-[220px] overflow-hidden rounded-full bg-neutral-200">
                        <motion.div
                          className="h-full bg-[#292923]"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${recommendation.confidence}%`,
                          }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>

                      <p className="mt-2 text-[10px] text-neutral-500">
                        {recommendation.confidence}% illustrative fit score
                      </p>
                    </div>

                    <div className="mt-8 border-y border-neutral-200 py-5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">
                          Compare sizes
                        </p>
                        <button
                          type="button"
                          onClick={() => setComparisonSize(null)}
                          className="text-[10px] text-neutral-500 underline underline-offset-4"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-6 gap-1.5">
                        {SIZES.map((size) => {
                          const selected = displayedSize === size;
                          const recommended =
                            recommendation.size === size;

                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setComparisonSize(
                                  size === recommendation.size
                                    ? null
                                    : size,
                                )
                              }
                              aria-pressed={selected}
                              className={`relative flex h-11 items-center justify-center border text-xs transition ${
                                selected
                                  ? "border-[#292923] bg-[#292923] text-white"
                                  : "border-neutral-200 hover:border-neutral-500"
                              }`}
                            >
                              {size}
                              {recommended && (
                                <span className="absolute -top-2 right-0 text-[7px] text-neutral-500">
                                  REC
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-4 text-[10px] leading-5 text-neutral-500">
                        Suggested size: {recommendation.size}. Other sizes
                        are available to compare, but the fit of each size
                        has not been verified against garment measurements.
                      </p>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        ["Height", displayHeight()],
                        ["Weight", displayWeight()],
                        ["Preferred fit", fitOptions.find((item) => item.value === fit)?.title ?? "As designed"],
                        ["Sizing", gender === "female" ? "Womenswear" : "Menswear"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-neutral-500">{label}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 bg-[#F0EEE8] p-4">
                      <p className="text-xs font-medium">A note on fit</p>
                      <p className="mt-2 text-[11px] leading-5 text-neutral-600">
                        This is a demonstration recommendation, not a
                        measured garment fit. For a reliable size guide,
                        configure the actual chest, body length, and sleeve
                        measurements for each product size.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200 bg-[#FCFBF8] px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={step === 1 ? reset : previous}
              className="inline-flex h-11 items-center gap-2 px-2 text-xs text-neutral-500 transition hover:text-black"
            >
              {step === 1 ? (
                <RotateCcw size={14} />
              ) : (
                <ArrowLeft size={14} />
              )}
              {step === 1 ? "Reset" : "Back"}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex h-11 min-w-36 items-center justify-center gap-3 bg-[#292923] px-5 text-xs text-white transition hover:bg-black"
              >
                Continue
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeGuide}
                className="inline-flex h-11 min-w-36 items-center justify-center gap-2 bg-[#292923] px-5 text-xs text-white transition hover:bg-black"
              >
                Done
                <Check size={15} />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
