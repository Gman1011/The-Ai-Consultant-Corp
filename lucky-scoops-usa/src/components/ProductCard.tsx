'use client';

import Link from 'next/link';
import Image from 'next/image';
import { averageRating, type Product } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useCart } from './CartProvider';
import Stars from './Stars';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const rating = averageRating(product);
  const soldOut = product.inventory === 0;
  const lowStock = product.inventory > 0 && product.inventory < 10;
  // Products with variants need a selection first, so quick-add links to the detail page
  const quickAddable = !soldOut && !product.variants;

  return (
    <article className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-glow">
      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-blush-500 px-3 py-1 text-xs font-bold text-white">
          {product.badge}
        </span>
      )}
      {(soldOut || lowStock) && (
        <span
          className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold ${
            soldOut ? 'bg-grape text-white' : 'bg-sky-200 text-grape'
          }`}
        >
          {soldOut ? 'Sold Out' : `Only ${product.inventory} left`}
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-lavender-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold leading-snug text-grape transition group-hover:text-blush-500">
            {product.name}
          </h3>
        </Link>
        {rating !== null && (
          <div className="flex items-center gap-1 text-sm">
            <Stars rating={rating} />
            <span className="text-grape/60">({product.reviews.length})</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="font-bold text-lavender-600">
            {formatPrice(product.priceCents)}
            {product.compareAtCents && (
              <span className="ml-2 text-sm font-normal text-grape/50 line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </p>
          {quickAddable ? (
            <button
              type="button"
              onClick={() => add(product.slug)}
              className="rounded-full bg-lavender-100 px-4 py-2 text-sm font-bold text-lavender-600 transition hover:bg-blush-500 hover:text-white"
              aria-label={`Add ${product.name} to cart`}
            >
              + Add
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="rounded-full bg-lavender-50 px-4 py-2 text-sm font-bold text-lavender-600 transition hover:bg-lavender-100"
            >
              {soldOut ? 'Details' : 'Options'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
