import type { Review } from "@/lib/api/types";
import { dict } from "@/lib/dict";
import { cn } from "@/lib/utils";

type ReviewSectionProps = {
  reviews: Review[];
  rating: number;
  count: number;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={cn("h-[15px] w-[15px]", i <= rating ? "text-amber-400" : "text-gray-200")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewSection({ reviews, rating, count }: ReviewSectionProps) {
  if (count === 0) return null;

  const distribution = [0, 0, 0, 0, 0];
  for (const r of reviews) {
    distribution[r.rating - 1]++;
  }

  return (
    <section>
      <h2 className="mb-5 text-[18px] font-bold tracking-[-0.01em] text-gray-900">
        {dict.product.reviews(count)}
      </h2>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="lg:w-[300px] lg:flex-shrink-0">
          <div className="flex items-center gap-5 rounded-[20px] border border-[#ece7e1] bg-[#faf9f7] p-5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[34px] font-black leading-none tracking-[-0.02em] text-gray-900 tabular-nums">
                {rating}
              </span>
              <Stars rating={Math.round(rating)} />
              <span className="mt-1 text-[11px] text-gray-400">{dict.product.reviewsShort(count)}</span>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-2 text-right text-[11px] text-gray-500 tabular-nums">{star}</span>
                  <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#ece7e1]">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width: `${reviews.length > 0 ? (distribution[star - 1] / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-3 text-[11px] text-gray-400 tabular-nums">{distribution[star - 1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-[20px] border border-[#ece7e1] bg-white p-4">
              <div className="mb-2.5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1eeea] text-[13px] font-bold text-forest">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{review.author}</p>
                  <p className="text-[11px] text-gray-400">{review.date}</p>
                </div>
                <div className="ml-auto">
                  <Stars rating={review.rating} />
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-gray-600">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
