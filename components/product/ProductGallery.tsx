"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/dict";
import { Badge } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui/Badge";

type ProductGalleryProps = {
  images: string[];
  genus: string;
  badges?: BadgeVariant[];
};

const GENUS_EMOJI: Record<string, string> = {
  Abies: "\u{1F332}",
  Picea: "\u{1F333}",
  Pinus: "\u{1F384}",
};

const GENUS_GRADIENT: Record<string, string> = {
  Abies: "from-[#eef5ef] to-[#e2ede4]",
  Picea: "from-[#eef3f6] to-[#e2ebf0]",
  Pinus: "from-[#f6f2e9] to-[#efe8da]",
};

export function ProductGallery({ images, genus, badges = [] }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const hasImages = images.length > 0;
  const emoji = GENUS_EMOJI[genus] ?? "\u{1F333}";
  const gradient = GENUS_GRADIENT[genus] ?? GENUS_GRADIENT.Picea;

  return (
    <div className="flex gap-3">
      {hasImages && images.length > 1 && (
        <div className="hidden flex-col gap-2 md:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-[60px] w-[60px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[14px] bg-[#f4f2ef] transition-all",
                active === i
                  ? "ring-2 ring-forest ring-offset-2 ring-offset-white"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="60px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[24px] border border-[#ece7e1] bg-[#f7f5f2]">
        {hasImages ? (
          <Image
            src={images[active] ?? images[0] ?? ""}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover"
          />
        ) : (
          <div className={cn("flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br", gradient)}>
            <span className="select-none text-[110px] leading-none opacity-15">{emoji}</span>
            <span className="text-[12px] font-medium tracking-[0.02em] text-gray-400">
              {dict.product.noPhoto}
            </span>
          </div>
        )}

        {badges.length > 0 && (
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {badges.map((variant) => (
              <Badge key={variant} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
