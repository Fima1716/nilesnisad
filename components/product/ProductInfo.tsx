import type { Product } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type ProductInfoProps = {
  product: Product;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const specs = [
    [dict.specs.genus, `${product.genus_ru} (${product.genus})`],
    [dict.specs.species, product.species],
    [dict.specs.cultivar, product.cultivar || "\u2014"],
    [dict.specs.container, product.container],
    [dict.specs.type, dict.product.graftedSeedling],
    [dict.specs.qty, `${product.qty} шт.`],
  ];

  return (
    <div>
      <h1 className="text-xl md:text-[22px] font-bold text-gray-900 leading-snug">
        <span className="italic">{product.genus} {product.species}</span>
        {product.cultivar && <> &lsquo;{product.cultivar}&rsquo;</>}
      </h1>
      <p className="text-[13px] text-gray-500 mt-0.5">{product.genus_ru} {product.species}</p>

      {product.review_count > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className={cn("w-3.5 h-3.5", i <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200")}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[13px] text-blue-600">{dict.product.reviews(product.review_count)}</span>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-[14px] font-bold text-gray-900 mb-2">{dict.product.about}</h3>
        <div>
          {specs.map(([key, value]) => (
            <div key={key} className="flex py-2 text-[13px] border-b border-gray-100 last:border-0 gap-4">
              <span className="text-gray-400 min-w-[130px] shrink-0">{key}</span>
              <span className="text-gray-700 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
