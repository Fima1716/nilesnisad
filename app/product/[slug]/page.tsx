import { notFound } from "next/navigation";
import { dict } from "@/lib/dict";
import { getProduct, getSimilar, getReviews } from "@/lib/api/mock";
import {
  ProductGallery,
  ProductInfo,
  PriceSidebar,
  ProductCarousel,
  ReviewSection,
} from "@/components/product";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const similar = getSimilar(product);
  const reviews = getReviews(product.id);

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 pt-3 pb-8">
        <p className="text-[12px] text-gray-400 mb-4">
          <Link href="/" className="hover:text-gray-600 transition-colors">{dict.nav.home}</Link>
          {" \u203A "}
          <Link href="/catalog" className="hover:text-gray-600 transition-colors">{dict.nav.catalog}</Link>
          {" \u203A "}
          <Link href={`/catalog?genus=${product.genus.toLowerCase()}`} className="hover:text-gray-600 transition-colors">
            {product.genus_ru}
          </Link>
          {" \u203A "}
          <span className="text-gray-500">{product.cultivar}</span>
        </p>

        <div className="md:flex gap-6">
          <div className="md:w-[420px] flex-shrink-0">
            <ProductGallery images={product.images} genus={product.genus} />
          </div>

          <div className="flex-1 mt-5 md:mt-0">
            <ProductInfo product={product} />
          </div>

          <div className="md:w-[300px] flex-shrink-0 mt-5 md:mt-0">
            <PriceSidebar product={product} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <ReviewSection reviews={reviews} rating={product.rating} count={product.review_count} />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="bg-[#f4f4f8]">
          <div className="max-w-[1400px] mx-auto px-4 py-6">
            <ProductCarousel title={dict.product.similar} products={similar} />
          </div>
        </div>
      )}
    </>
  );
}
