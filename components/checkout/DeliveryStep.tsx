"use client";

import { dict } from "@/lib/dict";
import { formatPrice } from "@/lib/utils";

export type DeliveryOption = {
  id: string;
  provider: string;
  type: string;
  label: string;
  description: string;
  price: number;
  days: string;
};

const mockOptions: DeliveryOption[] = [
  {
    id: "pickup",
    provider: "Самовывоз",
    type: "pickup",
    label: dict.checkout.pickupSelf,
    description: dict.checkout.pickupSelfDesc,
    price: 0,
    days: dict.checkout.today,
  },
  {
    id: "cdek-pvz",
    provider: "СДЭК",
    type: "pickup",
    label: "СДЭК — Пункт выдачи",
    description: "Ближайший ПВЗ в вашем городе",
    price: 399,
    days: "3–5 дней",
  },
  {
    id: "cdek-courier",
    provider: "СДЭК",
    type: "courier",
    label: "СДЭК — Курьером",
    description: "До двери",
    price: 599,
    days: "3–5 дней",
  },
  {
    id: "pochta",
    provider: "Почта России",
    type: "post",
    label: "Почта России",
    description: "Почтовое отделение",
    price: 299,
    days: "7–14 дней",
  },
];

type DeliveryStepProps = {
  selected: string | null;
  onSelect: (option: DeliveryOption) => void;
  onNext: () => void;
  onBack: () => void;
};

export function DeliveryStep({ selected, onSelect, onNext, onBack }: DeliveryStepProps) {
  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-900 mb-4">{dict.checkout.deliveryMethod}</h2>

      <div className="space-y-2 mb-4">
        {mockOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors cursor-pointer ${
              selected === opt.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-100 hover:border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selected === opt.id ? "border-gray-900" : "border-gray-300"
                }`}>
                  {selected === opt.id && <span className="w-2 h-2 rounded-full bg-gray-900" />}
                </span>
                <div>
                  <p className="text-[14px] font-medium text-gray-900">{opt.label}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{opt.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-[14px] font-bold ${opt.price === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {opt.price === 0 ? dict.checkout.free : `${formatPrice(opt.price)} \u20BD`}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{opt.days}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-amber-50 rounded-xl p-3 mb-5 flex items-start gap-2">
        <span className="text-[16px] flex-shrink-0">⚠️</span>
        <p className="text-[12px] text-amber-700">
          Доставка живых растений возможна при температуре выше 0°C. Сезон отправки: апрель — октябрь.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="h-[48px] px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer"
        >
          {dict.checkout.back}
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="h-[48px] px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {dict.checkout.continue}
        </button>
      </div>
    </div>
  );
}
