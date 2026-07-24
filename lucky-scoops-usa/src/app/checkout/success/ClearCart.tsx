'use client';

import { useEffect } from 'react';
import { useCart } from '@/components/CartProvider';

/** Empties the cart once the customer lands on the confirmation page. */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
