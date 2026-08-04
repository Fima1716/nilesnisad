"use client";

import { cn } from "@/lib/utils";
import { dict } from "@/lib/dict";

export type ContainerOption = {
  value: string;
  caption: string;
};

type ContainerSelectProps = {
  options: ContainerOption[];
  value: string;
  onChange: (value: string) => void;
};

export function ContainerSelect({ options, value, onChange }: ContainerSelectProps) {
  const single = options.length === 1;

  return (
    <div>
      <p className="mb-2 text-[13px] text-gray-500">
        {dict.product.containerChoice}:{" "}
        <span className="font-semibold text-gray-900">{value}</span>
      </p>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={dict.product.containerChoice}>
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={single}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-w-[86px] rounded-[16px] border px-4 py-2.5 text-left transition-all",
                single ? "cursor-default" : "cursor-pointer",
                selected
                  ? "border-forest bg-white shadow-[0_0_0_1px_var(--color-forest)]"
                  : "border-[#ece7e1] bg-[#faf9f7] hover:border-[#d9d2c8]",
              )}
            >
              <span
                className={cn(
                  "block text-[15px] font-bold leading-none tabular-nums",
                  selected ? "text-forest" : "text-gray-900",
                )}
              >
                {option.value}
              </span>
              <span className="mt-1 block text-[11px] leading-none text-gray-400">
                {option.caption}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
