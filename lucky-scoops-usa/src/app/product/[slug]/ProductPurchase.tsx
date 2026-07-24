'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/data/products';
import { useCart } from '@/components/CartProvider';

export default function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState(product.variants?.options[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.inventory === 0;

  function handleAdd(goToCart: boolean) {
    add(product.slug, quantity, variantId);
    if (goToCart) {
      router.push('/cart');
    } else {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="mt-6">
      {product.variants && (
        <div>
          <label htmlFor="variant" className="font-bold text-grape">
            {product.variants.label}
          </label>
          <select
            id="variant"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="input mt-2 sm:max-w-60"
          >
            {product.variants.options.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <span className="font-bold text-grape">Quantity</span>
        <div className="flex items-center rounded-full border-2 border-lavender-200 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-4 py-2 font-bold text-lavender-600 hover:text-blush-500"
          >
            −
          </button>
          <span aria-live="polite" className="min-w-8 text-center font-bold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="px-4 py-2 font-bold text-lavender-600 hover:text-blush-500"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" disabled={soldOut} onClick={() => handleAdd(false)}>
          {soldOut ? 'Sold Out' : added ? 'Added! ✓' : 'Add to Cart 🛒'}
        </button>
        {!soldOut && (
          <button type="button" className="btn-secondary" onClick={() => handleAdd(true)}>
            Buy Now
          </button>
        )}
      </div>
      {soldOut && (
        <p className="mt-3 text-sm font-semibold text-grape/70">
          Out of stock — join our newsletter to hear when it&apos;s back!
        </p>
      )}
    </div>
  );
}
