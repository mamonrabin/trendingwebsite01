
"use client";

import productImg from "@/assets/images/p1.webp"

import Image, { StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Wallet,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "rocket" | "cod";

type Product = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
  price: number;
  quantity: number;
  variant?: string;
};

type BillingForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  email: string;
  transactionId: string;
  paymentNumber: string;
};

type OrderSummaryProps = {
  product: Product;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  form: BillingForm;
  updateField: (key: keyof BillingForm, value: string) => void;
};

const payments: {
  id: PaymentMethod;
  name: string;
  symbol: string;
  bg: string;
  color: string;
}[] = [
  {
    id: "bkash",
    name: "bKash",
    symbol: "bKash",
    bg: "bg-[#E2136E]/10",
    color: "text-[#E2136E]",
  },
  {
    id: "nagad",
    name: "Nagad",
    symbol: "NAGAD",
    bg: "bg-[#F7941D]/10",
    color: "text-[#F7941D]",
  },
  {
    id: "rocket",
    name: "Rocket",
    symbol: "ROCKET",
    bg: "bg-[#8C3494]/10",
    color: "text-[#8C3494]",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    symbol: "COD",
    bg: "bg-[#262626]/10",
    color: "text-[#262626]",
  },
];

const inputClass =
  "mt-1.5 h-11 w-full rounded border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#262626] focus:ring-2 focus:ring-[#262626]/10";

const labelClass = "text-xs font-medium text-neutral-700";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const OrderSummary = ({
  product,
  shippingFee,
  paymentMethod,
  setPaymentMethod,
  form,
  updateField,
}: OrderSummaryProps) => {
  const subtotal = product.price * product.quantity;
  const total = subtotal + shippingFee;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="lg:sticky lg:top-6"
    >
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_4px_30px_rgba(0,0,0,0.025)] sm:p-7">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Your Order
          </h2>

          <span className="rounded-full bg-[#262626]/10 px-3 py-1 text-[10px] font-semibold text-[#262626]">
            1 ITEM
          </span>
        </div>

        {/* Product */}
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-5">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={productImg}
              alt="image"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-neutral-900">
              Hoodie Black
            </h3>

        
            <p className="mt-2 text-xs text-neutral-500">
              Qty: 1
            </p>
          </div>

          <p className="text-sm font-semibold text-neutral-900">
            ৳650
          </p>
        </div>

        {/* Price Calculation */}
        <div className="space-y-4 border-b border-neutral-100 py-5">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>

            <span className="font-medium text-neutral-800">
              ৳650
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Shipping</span>

            <span className="font-medium text-neutral-800">
              ৳800
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-5">
          <span className="text-sm font-semibold text-neutral-900">
            Total
          </span>

          <motion.span
            key={total}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight text-[#262626]"
          >
            ৳800
          </motion.span>
        </div>

        {/* Payment Methods */}
        <div className="mb-5">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">
            Payment Method
          </h3>

          <div className="space-y-2">
            {payments.map((payment) => {
              const active = paymentMethod === payment.id;

              return (
                <div key={payment.id} className="space-y-3">

                  {/* Payment Option */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setPaymentMethod(payment.id)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                      active
                        ? "border-[#262626] bg-[#262626]/5 ring-1 ring-[#262626]/20"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-[10px] font-bold ${payment.bg} ${payment.color}`}
                    >
                      {payment.symbol}
                    </span>

                    <span className="flex-1 text-xs font-medium text-neutral-800">
                      {payment.name}
                    </span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        active
                          ? "border-[#262626] bg-[#262626]"
                          : "border-neutral-300"
                      }`}
                    >
                      {active && (
                        <CheckCircle2
                          size={14}
                          className="text-white"
                        />
                      )}
                    </span>
                  </motion.button>

                  {/* Selected Payment Information */}
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          height: {
                            duration: 0.3,
                            ease: "easeInOut",
                          },
                          opacity: { duration: 0.2 },
                        }}
                        className="overflow-hidden"
                      >
                        {payment.id !== "cod" ? (
                          /* Online Payment Details */
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="flex items-center gap-2">
                              <Wallet
                                size={17}
                                className="text-[#262626]"
                              />

                              <h4 className="text-xs font-semibold text-neutral-800">
                                {payment.id === "bkash"
                                  ? "bKash Payment"
                                  : payment.id === "nagad"
                                    ? "Nagad Payment"
                                    : "Rocket Payment"}
                              </h4>
                            </div>

                            <p className="mt-3 text-xs leading-6 text-neutral-600">
                              Please complete your payment of{" "}
                              <strong>
                                ৳{total.toLocaleString("en-BD")}
                              </strong>{" "}
                              to our merchant number and enter the
                              transaction details below.
                            </p>

                            <div className="mt-4 space-y-3">
                              {/* Sender Number */}
                              <div>
                                <label className={labelClass}>
                                  Sender Number
                                </label>

                                <input
                                  type="tel"
                                  value={form.paymentNumber}
                                  onChange={(e) =>
                                    updateField(
                                      "paymentNumber",
                                      e.target.value
                                    )
                                  }
                                  placeholder="01XXXXXXXXX"
                                  className={inputClass}
                                />
                              </div>

                              {/* Transaction ID */}
                              <div>
                                <label className={labelClass}>
                                  Transaction ID
                                </label>

                                <input
                                  value={form.transactionId}
                                  onChange={(e) =>
                                    updateField(
                                      "transactionId",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter Transaction ID"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Cash on Delivery Details */
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                            <div className="flex items-center gap-2 text-[#262626]">
                              <Truck size={18} />

                              <span className="text-xs font-semibold">
                                Cash on Delivery
                              </span>
                            </div>

                            <p className="mt-2 text-xs leading-6 text-neutral-600">
                              পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে পেমেন্ট
                              করুন। কোনো অগ্রিম পেমেন্ট প্রয়োজন নেই।
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security */}
        <div className="mt-5 flex items-start gap-2">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-[#262626]"
          />

          <p className="text-[11px] leading-5 text-neutral-500">
            Your information is used only to process your order and
            provide customer support.
          </p>
        </div>

        {/* Place Order - UI Only */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#262626] px-5 text-sm font-semibold text-white shadow-lg shadow-[#262626]/15 transition-colors hover:bg-neutral-800"
        >
          <LockKeyhole size={16} />

          Place Your Order

          <span>·</span>

          ৳800

          <ArrowRight size={17} />
        </motion.button>

        <p className="mt-4 text-center text-[10px] leading-5 text-neutral-400">
          By placing your order, you agree to our Terms & Conditions
          and Privacy Policy.
        </p>
      </div>

      {/* Trust Footer */}
      <div className="mt-5 flex items-center justify-center gap-5 text-[10px] text-neutral-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          Secure Checkout
        </span>

        <span className="flex items-center gap-1.5">
          <Truck size={14} />
          Nationwide Delivery
        </span>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
