"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  genus: string;
};

export function ProductGallery({ images, genus }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const emoji = genus === "Abies" ? "\u{1F332}" : genus === "Picea" ? "\u{1F333}" : "\u{1F384}";
  const gradient =
    genus === "Abies"
      ? "from-green-50 to-emerald-50"
      : genus === "Picea"
        ? "from-sky-50 to-cyan-50"
        : "from-amber-50 to-yellow-50";

  const hasImages = images.length > 0;

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="hidden md:flex flex-col gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "w-[56px] h-[56px] rounded-lg border-2 overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0",
                active === i ? "border-gray-900" : "border-transparent hover:border-gray-300",
              )}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-gray-100">
        {hasImages ? (
          <img
            src={images[active]}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center bg-gradient-to-br",
            gradient,
          )}>
            <span className="text-[120px] opacity-10 select-none">{emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
}
