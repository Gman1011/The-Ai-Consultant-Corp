import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Shop Lucky Scoops USA — plush puppies, mystery scoops, charms, backpacks, apparel, and more.',
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
