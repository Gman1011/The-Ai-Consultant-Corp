'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getProduct } from '@/data/products';

export interface CartItem {
  slug: string;
  variantId?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (slug: string, quantity?: number, variantId?: string) => void;
  remove: (slug: string, variantId?: string) => void;
  setQuantity: (slug: string, quantity: number, variantId?: string) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'lucky-scoops-cart-v1';

function sameLine(a: CartItem, slug: string, variantId?: string) {
  return a.slug === slug && (a.variantId ?? '') === (variantId ?? '');
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // Drop lines for products no longer in the catalog
        setItems(parsed.filter((i) => getProduct(i.slug) && i.quantity > 0));
      }
    } catch {
      // Corrupt storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode) — cart still works in memory
    }
  }, [items, hydrated]);

  const add = useCallback((slug: string, quantity = 1, variantId?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, slug, variantId));
      if (existing) {
        return prev.map((i) =>
          sameLine(i, slug, variantId)
            ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
            : i
        );
      }
      return [...prev, { slug, variantId, quantity: Math.min(quantity, 99) }];
    });
  }, []);

  const remove = useCallback((slug: string, variantId?: string) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, slug, variantId)));
  }, []);

  const setQuantity = useCallback(
    (slug: string, quantity: number, variantId?: string) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => !sameLine(i, slug, variantId))
          : prev.map((i) =>
              sameLine(i, slug, variantId)
                ? { ...i, quantity: Math.min(quantity, 99) }
                : i
            )
      );
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotalCents } = useMemo(() => {
    let count = 0;
    let subtotalCents = 0;
    for (const item of items) {
      const product = getProduct(item.slug);
      if (!product) continue;
      count += item.quantity;
      subtotalCents += product.priceCents * item.quantity;
    }
    return { count, subtotalCents };
  }, [items]);

  const value = useMemo(
    () => ({ items, add, remove, setQuantity, clear, count, subtotalCents }),
    [items, add, remove, setQuantity, clear, count, subtotalCents]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
