"use client";

import { useState } from "react";
import type { Product } from "@/lib/api/types";
import { dict } from "@/lib/dict";
import { cn, formatVolume, parseContainerOptions, parseContainerVolume } from "@/lib/utils";
import { ContainerSelect, type ContainerOption } from "./ContainerSelect";

type ProductInfoProps = {
  product: Product;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={cn("h-[15px] w-[15px]", i <= Math.round(rating) ? "text-amber-400" : "text-gray-200")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function toOption(value: string): ContainerOption {
  const volume = parseContainerVolume(value);
  return {
    value,
    caption: volume === null ? "" : dict.product.liters(formatVolume(volume)),
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const options = parseContainerOptions(product.container).map(toOption);
  const [container, setContainer] = useState(options[0]?.value ?? product.container);

  const specs: Array<[string, string]> = [
    [dict.specs.genus, `${product.genus_ru} (${product.genus})`],
    [dict.specs.species, product.species],
    [dict.specs.cultivar, product.cultivar || "—"],
    [dict.specs.container, container],
    [dict.specs.type, dict.product.graftedSeedling],
    [dict.specs.qty, product.qty > 0 ? `${product.qty} шт.` : dict.product.outOfStock],
  ];

  return (
    <div>
      <h1 className="text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-gray-900 md:text-[28px]">
        <span className="italic">
          {product.genus} {product.species}
        </span>
        {product.cultivar && <> &lsquo;{product.cultivar}&rsquo;</>}
      </h1>

      <p className="mt-1.5 text-[14px] text-gray-500">
        {product.genus_ru} {product.species}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="font-semibold tabular-nums text-gray-900">{product.rating}</span>
        </div>
        <span className="text-gray-500">
          {product.review_count > 0 ? dict.product.reviews(product.review_count) : dict.product.ratingNoReviews}
        </span>
        <span className="text-gray-300">&bull;</span>
        <span className="text-gray-400">{dict.product.article(product.id)}</span>
      </div>

      <div className="mt-5">
        <ContainerSelect options={options} value={container} onChange={setContainer} />
      </div>

      <div className="mt-7">
        <h2 className="mb-1 text-[16px] font-bold tracking-[-0.01em] text-gray-900">{dict.product.about}</h2>
        <dl>
          {specs.map(([key, value]) => (
            <div key={key} className="flex gap-4 border-b border-[#f1eeea] py-2.5 text-[13px] last:border-0">
              <dt className="min-w-[140px] shrink-0 text-gray-400">{key}</dt>
              <dd className="font-medium text-gray-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
