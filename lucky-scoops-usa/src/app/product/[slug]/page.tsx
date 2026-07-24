import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, relatedProducts, averageRating } from '@/data/products';
import { formatPrice } from '@/lib/format';
import ProductCard from '@/components/ProductCard';
import Stars from '@/components/Stars';
import ProductPurchase from './ProductPurchase';
import ProductGallery from './ProductGallery';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: product.images },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const rating = averageRating(product);
  const related = relatedProducts(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.badge && (
            <span className="rounded-full bg-blush-500 px-3 py-1 text-xs font-bold text-white">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl font-bold text-grape sm:text-4xl">
            {product.name}
          </h1>
          {rating !== null && (
            <div className="mt-2 flex items-center gap-2">
              <Stars rating={rating} />
              <span className="text-sm text-grape/70">
                {rating} · {product.reviews.length} review{product.reviews.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
          <p className="mt-4 text-2xl font-bold text-lavender-600">
            {formatPrice(product.priceCents)}
            {product.compareAtCents && (
              <span className="ml-3 text-lg font-normal text-grape/50 line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </p>
          <p className="mt-4 leading-relaxed text-grape/80">{product.description}</p>

          <ProductPurchase product={product} />

          <ul className="mt-8 space-y-2 rounded-3xl bg-lavender-50 p-6">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-grape/80">
                <span aria-hidden="true" className="text-blush-500">🐾</span> {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reviews */}
      <section aria-labelledby="reviews-title" className="mt-16">
        <h2 id="reviews-title" className="section-title">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="mt-4 text-grape/70">No reviews yet — be the first!</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {product.reviews.map((r, i) => (
              <figure key={i} className="card p-6">
                <Stars rating={r.rating} />
                <blockquote className="mt-3 text-sm leading-relaxed text-grape/80">“{r.text}”</blockquote>
                <figcaption className="mt-3 font-bold text-lavender-600">— {r.author}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16">
          <h2 id="related-title" className="section-title">You May Also Love 💜</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
