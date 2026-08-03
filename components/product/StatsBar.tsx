import type { Stats } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type StatsBarProps = {
  stats: Stats;
};

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    dict.footer.varieties(stats.total_varieties),
    dict.footer.seedlings(stats.total_seedlings),
    dict.footer.grafted,
    stats.container,
    dict.footer.location,
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 py-6 text-[12px] text-gray-400 font-medium">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
