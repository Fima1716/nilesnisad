import type { Review } from "@/lib/api/types";
import { dict } from "@/lib/dict";

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
          className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400" : "text-gray-200"}`}
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
    <section className="border-t border-gray-100 pt-6">
      <h3 className="text-[16px] font-bold text-gray-900 mb-4">{dict.product.reviews(count)}</h3>

      <div className="flex gap-8 mb-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[32px] font-black text-gray-900 leading-none">{rating}</span>
          <Stars rating={Math.round(rating)} />
          <span className="text-[11px] text-gray-400 mt-1">{count} отз.</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1 max-w-[200px]">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 w-2 text-right">{star}</span>
              <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${reviews.length > 0 ? (distribution[star - 1] / reviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[11px] text-gray-400 w-3">{distribution[star - 1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-t border-gray-50 pt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-500">
                {review.author.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-medium text-gray-900">{review.author}</p>
                <p className="text-[11px] text-gray-400">{review.date}</p>
              </div>
              <div className="ml-auto">
                <Stars rating={review.rating} />
              </div>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
