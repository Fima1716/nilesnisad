"use client";

import { dict } from "@/lib/dict";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/store";
import type { DeliveryOption } from "./DeliveryStep";

type ConfirmStepProps = {
  contact: { firstName: string; lastName: string; phone: string; email: string };
  delivery: DeliveryOption | null;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  deliveryPrice: number;
  bonusUsed: number;
  total: number;
  onConfirm: () => void;
  onBack: () => void;
};

export function ConfirmStep({
  contact,
  delivery,
  paymentMethod,
  items,
  subtotal,
  deliveryPrice,
  bonusUsed,
  total,
  onConfirm,
  onBack,
}: ConfirmStepProps) {
  const paymentLabels: Record<string, string> = {
    online: dict.checkout.payOnline,
    sbp: dict.checkout.paySBP,
    on_delivery: dict.checkout.payOnDelivery,
  };

  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-900 mb-4">{dict.checkout.confirm}</h2>

      {/* Items */}
      <div className="mb-5">
        <p className="text-[13px] font-medium text-gray-500 mb-2">{dict.checkout.items}</p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg opacity-15">{"\u{1F333}"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-700 truncate">
                  {item.genus_ru} {item.species} &lsquo;{item.cultivar}&rsquo;
                </p>
                <p className="text-[12px] text-gray-400">{item.qty} шт.</p>
              </div>
              <p className="text-[14px] font-bold text-gray-900 tabular-nums flex-shrink-0">
                {formatPrice(item.price * item.qty)}&nbsp;{"\u20BD"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      {delivery && (
        <div className="mb-5">
          <p className="text-[13px] font-medium text-gray-500 mb-1">{dict.checkout.deliveryLabel}</p>
          <p className="text-[14px] text-gray-900">{delivery.label}</p>
          <p className="text-[12px] text-gray-500">{delivery.description} &middot; {delivery.days}</p>
        </div>
      )}

      {/* Contact */}
      <div className="mb-5">
        <p className="text-[13px] font-medium text-gray-500 mb-1">Получатель</p>
        <p className="text-[14px] text-gray-900">{contact.firstName} {contact.lastName}</p>
        <p className="text-[12px] text-gray-500">{contact.phone} &middot; {contact.email}</p>
      </div>

      {/* Payment method */}
      <div className="mb-5">
        <p className="text-[13px] font-medium text-gray-500 mb-1">{dict.checkout.payment}</p>
        <p className="text-[14px] text-gray-900">{paymentLabels[paymentMethod] ?? paymentMethod}</p>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-100 pt-4 mb-5 space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">{dict.checkout.items} ({items.reduce((s, i) => s + i.qty, 0)} шт.)</span>
          <span className="text-gray-900 font-medium tabular-nums">{formatPrice(subtotal)}&nbsp;{"\u20BD"}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">{dict.checkout.deliveryLabel}</span>
          <span className={deliveryPrice === 0 ? "text-green-600 font-medium" : "text-gray-900 font-medium tabular-nums"}>
            {deliveryPrice === 0 ? dict.checkout.free : `${formatPrice(deliveryPrice)} \u20BD`}
          </span>
        </div>
        {bonusUsed > 0 && (
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-500">{dict.cart.bonus}</span>
            <span className="text-green-600 font-medium">&minus;{formatPrice(bonusUsed)}&nbsp;{"\u20BD"}</span>
          </div>
        )}
        <div className="flex justify-between text-[16px] font-bold pt-2 border-t border-gray-100">
          <span className="text-gray-900">{dict.cart.toPay}</span>
          <span className="text-gray-900 tabular-nums">{formatPrice(total)}&nbsp;{"\u20BD"}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="h-[48px] px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer"
        >
          {dict.checkout.back}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 h-[48px] bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer"
        >
          {dict.checkout.pay(total)}
        </button>
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-3">{dict.checkout.termsNotice}</p>
    </div>
  );
}
