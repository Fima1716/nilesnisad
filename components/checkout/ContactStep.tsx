"use client";

import { dict } from "@/lib/dict";

type ContactData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type ContactStepProps = {
  data: ContactData;
  errors: Partial<Record<keyof ContactData, string>>;
  onChange: (field: keyof ContactData, value: string) => void;
  onNext: () => void;
};

export function ContactStep({ data, errors, onChange, onNext }: ContactStepProps) {
  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-900 mb-4">{dict.checkout.contacts}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Field
          label={dict.checkout.firstName}
          value={data.firstName}
          error={errors.firstName}
          onChange={(v) => onChange("firstName", v)}
        />
        <Field
          label={dict.checkout.lastName}
          value={data.lastName}
          error={errors.lastName}
          onChange={(v) => onChange("lastName", v)}
        />
        <Field
          label={dict.checkout.phone}
          type="tel"
          value={data.phone}
          error={errors.phone}
          placeholder="+7 (999) 123-45-67"
          onChange={(v) => onChange("phone", v)}
        />
        <Field
          label={dict.checkout.email}
          type="email"
          value={data.email}
          error={errors.email}
          onChange={(v) => onChange("email", v)}
        />
      </div>

      <button
        onClick={onNext}
        className="w-full sm:w-auto h-[48px] px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer"
      >
        {dict.checkout.continue}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  error,
  type = "text",
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  type?: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-gray-500 mb-1">{label} *</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-[44px] px-4 bg-gray-50 rounded-[10px] text-[14px] outline-none border transition-colors ${
          error ? "border-red-300 bg-red-50/50" : "border-transparent focus:border-gray-300"
        }`}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
