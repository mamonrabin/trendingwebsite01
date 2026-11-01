
"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  User,
  Mail,
  Truck,
} from "lucide-react";

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

type BillingDetailsProps = {
  form: BillingForm;
  updateField: (key: keyof BillingForm, value: string) => void;
  shippingFee: number;
};

const districts = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
  "Other",
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const inputClass =
  "h-12 w-full rounded border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-300 focus:border-[#55A630] focus:ring-4 focus:ring-[#55A630]/10";

const labelClass =
  "mb-2 block text-xs font-medium text-neutral-700";

const BillingDetails = ({
  form,
  updateField,
  shippingFee,
}: BillingDetailsProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded border border-neutral-200/80 bg-white p-5 shadow-[0_4px_30px_rgba(0,0,0,0.025)] sm:p-8"
    >
      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F8F6] text-[#262626]">
          <User size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Billing Details
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            আপনার ডেলিভারি তথ্য প্রদান করুন
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>

          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="আপনার নাম লিখুন"
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Phone Number <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Phone
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              required
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Street Address <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-4 top-4 text-neutral-400"
            />

            <textarea
              required
              autoComplete="street-address"
              rows={3}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
              className={`${inputClass} h-auto resize-none py-3 pl-11`}
            />
          </div>
        </div>

        {/* Apartment */}
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Apartment, Suite, Unit etc.{" "}
            <span className="text-neutral-400">(Optional)</span>
          </label>

          <input
            placeholder="Apartment, suite, unit, etc."
            className={inputClass}
          />
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>
            Town / City <span className="text-red-500">*</span>
          </label>

          <input
            required
            autoComplete="address-level2"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Your city"
            className={inputClass}
          />
        </div>

        {/* District */}
        <div>
          <label className={labelClass}>
            District <span className="text-red-500">*</span>
          </label>

          <select
            required
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
            className={inputClass}
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Postcode */}
        <div>
          <label className={labelClass}>
            Postcode / ZIP{" "}
            <span className="text-neutral-400">(Optional)</span>
          </label>

          <input
            autoComplete="postal-code"
            placeholder="Postcode"
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            Email Address{" "}
            <span className="text-neutral-400">(Optional)</span>
          </label>

          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="example@email.com"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="mt-8 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <Truck size={19} className="text-[#55A630]" />

          <div className="flex-1">
            <p className="text-xs font-semibold text-neutral-800">
              Shipping Information
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              সারাদেশে হোম ডেলিভারি
            </p>
          </div>

          <span className="text-sm font-semibold text-neutral-800">
            ৳{shippingFee.toLocaleString("en-BD")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BillingDetails;
