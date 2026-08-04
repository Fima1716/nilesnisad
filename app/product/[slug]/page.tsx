import { notFound } from "next/navigation";
import Link from "next/link";
import { dict } from "@/lib/dict";
import { getProduct, getSimilar, getReviews } from "@/lib/api/mock";
import type { BadgeVariant } from "@/components/ui/Badge";
import {
  ProductGallery,
  ProductInfo,
  PriceSidebar,
  ProductCarousel,
  ReviewSection,
} from "@/components/product";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const similar = getSimilar(product);
  const reviews = getReviews(product.id);

  const badges = [
    product.qty > 0 && product.qty <= 2 ? "lowStock" : null,
    product.is_new ? "newArrival" : null,
    product.old_price !== null ? "premium" : null,
  ].filter(Boolean) as BadgeVariant[];

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-6 pb-10 pt-4 sm:px-10">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/" className="transition-colors hover:text-forest">{dict.nav.home}</Link>
          <span>&rsaquo;</span>
          <Link href="/catalog" className="transition-colors hover:text-forest">{dict.nav.catalog}</Link>
          <span>&rsaquo;</span>
          <Link href={`/catalog?genus=${product.genus.toLowerCase()}`} className="transition-colors hover:text-forest">
            {product.genus_ru}
          </Link>
          <span>&rsaquo;</span>
          <span className="text-gray-600">{product.cultivar || product.species}</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="lg:w-[420px] lg:flex-shrink-0">
            <ProductGallery images={product.images} genus={product.genus} badges={badges} />
          </div>

          <div className="min-w-0 flex-1">
            <ProductInfo product={product} />
          </div>

          <div className="lg:w-[320px] lg:flex-shrink-0">
            <PriceSidebar product={product} />
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="border-t border-[#ece7e1] bg-white">
          <div className="mx-auto max-w-screen-xl px-6 py-8 sm:px-10">
            <ReviewSection reviews={reviews} rating={product.rating} count={product.review_count} />
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="bg-page">
          <div className="mx-auto max-w-screen-xl px-6 py-8 sm:px-10">
            <ProductCarousel title={dict.product.similar} products={similar} href="/catalog" />
          </div>
        </div>
      )}
    </>
  );
}
