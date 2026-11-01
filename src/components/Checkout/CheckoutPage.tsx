
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BillingDetails from "./BillingDetails";
import OrderSummary from "./OrderSummary";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";

type PaymentMethod = "bkash" | "nagad" | "rocket" | "cod";

type Product = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
  price: number;
  quantity: number;
  variant?: string;
};

type CheckoutPageProps = {
  product: Product;
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

const shippingFee = 150;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export default function CheckoutPage({ product }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bkash");

  const [form, setForm] = useState<BillingForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "Dhaka",
    email: "",
    transactionId: "",
    paymentNumber: "",
  });

  const updateField = (key: keyof BillingForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className="min-h-screen bg-[#f7f8f6] px-4 pb-8 sm:px-6 lg:pb-14">
      <div className="mx-auto max-w-6xl">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-9 text-center"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#55A630]">
            Almost There
          </span>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            অর্ডার করতে সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.35fr_0.85fr]"
        >
          {/* LEFT: Billing details */}
          <BillingDetails
            form={form}
            updateField={updateField}
            shippingFee={shippingFee}
          />

          {/* RIGHT: Order summary */}
          <OrderSummary
            product={product}
            shippingFee={shippingFee}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            form={form}
            updateField={updateField}
          />
        </motion.div>
      </div>
    </section>
  );
}
