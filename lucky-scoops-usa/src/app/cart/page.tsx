'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, setQuantity, remove, subtotalCents } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            quantity: i.quantity,
            variantId: i.variantId,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Unable to start checkout');
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong — please try again.');
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p aria-hidden="true" className="text-6xl">🛒</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-grape">Your cart is empty</h1>
        <p className="mt-2 text-grape/70">Lucky &amp; Dior are waiting for you in the shop!</p>
        <Link href="/shop" className="btn-primary mt-8">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="mt-10 font-display text-4xl font-bold text-grape">Your Cart 💕</h1>

      <ul className="mt-8 space-y-4">
        {items.map((item) => {
          const product = getProduct(item.slug);
          if (!product) return null;
          const variantName = product.variants?.options.find((o) => o.id === item.variantId)?.name;
          return (
            <li key={`${item.slug}-${item.variantId ?? ''}`} className="card flex items-center gap-4 p-4">
              <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-lavender-50">
                <Image src={product.images[0]} alt={product.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${product.slug}`} className="font-bold text-grape hover:text-blush-500">
                  {product.name}
                </Link>
                {variantName && <p className="text-sm text-grape/70">{variantName}</p>}
                <p className="mt-1 font-bold text-lavender-600">{formatPrice(product.priceCents)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border-2 border-lavender-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.slug, item.quantity - 1, item.variantId)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="px-3 py-1 font-bold text-lavender-600 hover:text-blush-500"
                  >
                    −
                  </button>
                  <span className="min-w-7 text-center font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.slug, item.quantity + 1, item.variantId)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="px-3 py-1 font-bold text-lavender-600 hover:text-blush-500"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.slug, item.variantId)}
                  aria-label={`Remove ${product.name} from cart`}
                  className="rounded-full p-2 text-grape/50 transition hover:bg-blush-100 hover:text-blush-600"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="card mt-8 p-6">
        <div className="flex items-center justify-between text-lg">
          <span className="font-bold text-grape">Subtotal</span>
          <span className="font-bold text-lavender-600">{formatPrice(subtotalCents)}</span>
        </div>
        <p className="mt-1 text-sm text-grape/60">Shipping and taxes calculated at checkout.</p>
        {error && (
          <p role="alert" className="mt-3 rounded-2xl bg-blush-100 px-4 py-2 text-sm font-semibold text-blush-600">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={checkout}
          disabled={checkingOut}
          className="btn-primary mt-4 w-full text-lg"
        >
          {checkingOut ? 'Redirecting to secure checkout…' : 'Checkout Securely 🔒'}
        </button>
        <p className="mt-3 text-center text-xs text-grape/60">
          Apple Pay · Google Pay · Visa · Mastercard · Amex · Debit — powered by Stripe
        </p>
      </div>
    </div>
  );
}
