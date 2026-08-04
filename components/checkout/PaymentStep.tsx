"use client";

import { dict } from "@/lib/dict";

type PaymentMethod = "online" | "sbp" | "on_delivery";

const paymentOptions: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: "online", label: dict.checkout.payOnline, desc: dict.checkout.payOnlineDesc },
  { id: "sbp", label: dict.checkout.paySBP, desc: dict.checkout.paySBPDesc },
  { id: "on_delivery", label: dict.checkout.payOnDelivery, desc: dict.checkout.payOnDeliveryDesc },
];

type PaymentStepProps = {
  selected: PaymentMethod;
  bonusBalance: number;
  bonusUsed: number;
  promoCode: string;
  onSelectMethod: (m: PaymentMethod) => void;
  onBonusChange: (n: number) => void;
  onPromoChange: (s: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function PaymentStep({
  selected,
  bonusBalance,
  bonusUsed,
  promoCode,
  onSelectMethod,
  onBonusChange,
  onPromoChange,
  onNext,
  onBack,
}: PaymentStepProps) {
  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-900 mb-4">{dict.checkout.payment}</h2>

      <div className="space-y-2 mb-6">
        {paymentOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelectMethod(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors cursor-pointer ${
              selected === opt.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-100 hover:border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                selected === opt.id ? "border-gray-900" : "border-gray-300"
              }`}>
                {selected === opt.id && <span className="w-2 h-2 rounded-full bg-gray-900" />}
              </span>
              <div>
                <p className="text-[14px] font-medium text-gray-900">{opt.label}</p>
                <p className="text-[12px] text-gray-500">{opt.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {bonusBalance > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-medium text-gray-900">
              Бонусы <span className="text-gray-400 font-normal">(доступно {bonusBalance})</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-500">Списать:</span>
            <input
              type="number"
              min={0}
              max={bonusBalance}
              value={bonusUsed}
              onChange={(e) => onBonusChange(Math.min(bonusBalance, Math.max(0, Number(e.target.value))))}
              className="w-[80px] h-[36px] px-3 bg-white border border-gray-200 rounded-lg text-[13px] text-center outline-none focus:border-gray-400"
            />
            <span className="text-[13px] text-gray-400">{"\u{1F48E}"}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-[13px] font-medium text-gray-900 mb-2">{dict.checkout.promoCode}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => onPromoChange(e.target.value.toUpperCase())}
            placeholder="SPRING2026"
            className="flex-1 h-[40px] px-4 bg-gray-50 border border-transparent rounded-[10px] text-[13px] outline-none focus:border-gray-300"
          />
          <button className="h-[40px] px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[13px] rounded-[10px] transition-colors cursor-pointer">
            {dict.checkout.apply}
          </button>
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
          onClick={onNext}
          className="h-[48px] px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer"
        >
          {dict.checkout.continue}
        </button>
      </div>
    </div>
  );
}
