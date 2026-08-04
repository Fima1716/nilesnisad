import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  current: number;
  steps: string[];
};

export function CheckoutSteps({ current, steps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;

        return (
          <div key={label} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0",
                  active && "bg-gray-900 text-white",
                  done && "bg-gray-900 text-white",
                  !active && !done && "bg-gray-100 text-gray-400",
                )}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  step
                )}
              </span>
              <span
                className={cn(
                  "text-[13px] font-medium hidden sm:block whitespace-nowrap",
                  active ? "text-gray-900" : "text-gray-400",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("flex-1 h-px mx-2", done ? "bg-gray-900" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
