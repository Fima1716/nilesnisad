"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dict } from "@/lib/dict";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/lib/store";
import {
  CheckoutSteps,
  ContactStep,
  DeliveryStep,
  PaymentStep,
  ConfirmStep,
  type DeliveryOption,
} from "@/components/checkout";

const STEPS = [
  dict.checkout.contacts,
  dict.checkout.deliveryMethod,
  dict.checkout.payment,
  dict.checkout.confirm,
];

type ContactData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Step 1 — contacts
  const [contact, setContact] = useState<ContactData>({
    firstName: user?.name.split(" ")[0] ?? "",
    lastName: user?.name.split(" ")[1] ?? "",
    phone: "",
    email: user?.email ?? "",
  });
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactData, string>>>({});

  // Step 2 — delivery
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null);

  // Step 3 — payment
  const [paymentMethod, setPaymentMethod] = useState<"online" | "sbp" | "on_delivery">("online");
  const [bonusUsed, setBonusUsed] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  // Calculations
  const subtotal = total();
  const deliveryPrice = deliveryOption?.price ?? 0;
  const finalTotal = Math.max(0, subtotal + deliveryPrice - bonusUsed);

  function validateContacts(): boolean {
    const errors: Partial<Record<keyof ContactData, string>> = {};
    if (!contact.firstName.trim()) errors.firstName = dict.checkout.required;
    if (!contact.lastName.trim()) errors.lastName = dict.checkout.required;
    if (!contact.phone.trim() || contact.phone.replace(/\D/g, "").length < 10)
      errors.phone = dict.checkout.invalidPhone;
    if (!contact.email.trim() || !contact.email.includes("@"))
      errors.email = dict.checkout.invalidEmail;
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleConfirm() {
    // Mock: create order
    clear();
    setSuccess(true);
  }

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-16 text-center">
        <p className="text-[14px] text-gray-400 mb-3">{dict.cart.empty}</p>
        <Link href="/catalog" className="text-[13px] text-blue-600 font-medium hover:underline">
          {dict.nav.catalog}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 mb-2">{dict.checkout.orderSuccess}</h1>
        <p className="text-[14px] text-gray-500 mb-6">{dict.checkout.orderSuccessDesc}</p>
        <Link
          href="/"
          className="inline-flex h-[44px] items-center px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors"
        >
          {dict.checkout.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-5">
      <div className="max-w-[640px] mx-auto">
        <h1 className="text-[20px] font-bold text-gray-900 mb-5">{dict.checkout.title}</h1>

        <CheckoutSteps current={step} steps={STEPS} />

        {/* Order summary sidebar — visible on all steps */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-gray-500">
              {items.length} {items.length === 1 ? "товар" : items.length < 5 ? "товара" : "товаров"} на {formatPrice(subtotal)}&nbsp;{"\u20BD"}
            </p>
            {deliveryPrice > 0 && (
              <p className="text-[12px] text-gray-400">
                + доставка {formatPrice(deliveryPrice)}&nbsp;{"\u20BD"}
              </p>
            )}
          </div>
        </div>

        {step === 1 && (
          <ContactStep
            data={contact}
            errors={contactErrors}
            onChange={(field, value) => {
              setContact((prev) => ({ ...prev, [field]: value }));
              setContactErrors((prev) => ({ ...prev, [field]: undefined }));
            }}
            onNext={() => { if (validateContacts()) setStep(2); }}
          />
        )}

        {step === 2 && (
          <DeliveryStep
            selected={selectedDelivery}
            onSelect={(opt) => { setSelectedDelivery(opt.id); setDeliveryOption(opt); }}
            onNext={() => { if (selectedDelivery) setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <PaymentStep
            selected={paymentMethod}
            bonusBalance={user?.bonus ?? 0}
            bonusUsed={bonusUsed}
            promoCode={promoCode}
            onSelectMethod={setPaymentMethod}
            onBonusChange={setBonusUsed}
            onPromoChange={setPromoCode}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <ConfirmStep
            contact={contact}
            delivery={deliveryOption}
            paymentMethod={paymentMethod}
            items={items}
            subtotal={subtotal}
            deliveryPrice={deliveryPrice}
            bonusUsed={bonusUsed}
            total={finalTotal}
            onConfirm={handleConfirm}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}
