// ─────────────────────────────────────────────────────────────────────────────
// Product catalog — the single source of truth for the store.
//
// To add a product: append an object here. To update price/stock: edit in
// place. Prices are in USD cents. The Stripe checkout API route reads prices
// from this file (never from the client), so editing here is always safe.
//
// Swap the placeholder `images` entries for real, owned/licensed photography
// in /public/images as it becomes available.
// ─────────────────────────────────────────────────────────────────────────────

export type CategorySlug =
  | 'plush-puppies'
  | 'backpacks-bags'
  | 'accessories-charms'
  | 'apparel-gear'
  | 'home-lifestyle'
  | 'mystery-scoops';

export interface Category {
  slug: CategorySlug;
  name: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  name: string;
}

export interface Review {
  author: string;
  rating: number; // 1–5
  text: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  priceCents: number;
  compareAtCents?: number;
  description: string;
  details: string[];
  images: string[];
  variants?: { label: string; options: ProductVariant[] };
  inventory: number; // 0 = sold out; 1–9 shows "Low stock"
  badge?: 'New' | 'Best Seller' | 'Limited Edition';
  featured?: boolean;
  reviews: Review[];
}

export const CATEGORIES: Category[] = [
  { slug: 'plush-puppies', name: 'Plush Puppies', image: '/images/plush.svg' },
  { slug: 'backpacks-bags', name: 'Backpacks & Bags', image: '/images/bags.svg' },
  { slug: 'accessories-charms', name: 'Accessories & Charms', image: '/images/charms.svg' },
  { slug: 'apparel-gear', name: 'Apparel & Gear', image: '/images/apparel.svg' },
  { slug: 'home-lifestyle', name: 'Home & Lifestyle', image: '/images/home.svg' },
  { slug: 'mystery-scoops', name: 'Mystery Scoops', image: '/images/mystery.svg' },
];

export const PRODUCTS: Product[] = [
  {
    slug: 'lucky-plush',
    name: 'Lucky the Plush Puppy',
    category: 'plush-puppies',
    priceCents: 3499,
    description:
      'Meet Lucky — the fluffy white pup with a golden crown, one pink eye, one blue eye, and a heart full of surprises. Ultra-soft premium plush, made to be hugged.',
    details: [
      'Premium kid-safe, hypoallergenic materials',
      'Embroidered eyes — no small parts, ages 3+',
      'Approx. 10" seated, surface washable',
      'Includes collectible LUCKY heart tag',
    ],
    images: ['/images/lucky.svg', '/images/plush.svg'],
    variants: {
      label: 'Size',
      options: [
        { id: 'small', name: 'Small (7")' },
        { id: 'classic', name: 'Classic (10")' },
        { id: 'jumbo', name: 'Jumbo (16")' },
      ],
    },
    inventory: 42,
    badge: 'Best Seller',
    featured: true,
    reviews: [
      { author: 'Maya R.', rating: 5, text: 'My daughter sleeps with Lucky every night. The plush quality is unreal!' },
      { author: 'Jordan P.', rating: 5, text: 'Softest plush we own — and we own a lot.' },
    ],
  },
  {
    slug: 'dior-plush',
    name: 'Dior the Plush Puppy',
    category: 'plush-puppies',
    priceCents: 3499,
    description:
      'Dior brings the sparkle — a playful spotted pup with black velvet ears, one green eye, one blue eye, and a crown fit for royalty. Lucky’s best friend and partner in fun.',
    details: [
      'Premium kid-safe, hypoallergenic materials',
      'Embroidered eyes — no small parts, ages 3+',
      'Approx. 10" seated, surface washable',
      'Includes collectible DIOR heart tag',
    ],
    images: ['/images/dior.svg', '/images/plush.svg'],
    variants: {
      label: 'Size',
      options: [
        { id: 'small', name: 'Small (7")' },
        { id: 'classic', name: 'Classic (10")' },
        { id: 'jumbo', name: 'Jumbo (16")' },
      ],
    },
    inventory: 37,
    badge: 'Best Seller',
    featured: true,
    reviews: [
      { author: 'Alexis T.', rating: 5, text: 'The spots! The crown! Dior is perfection.' },
      { author: 'Sam K.', rating: 4, text: 'Adorable — wish I’d ordered the jumbo size.' },
    ],
  },
  {
    slug: 'mystery-scoop-classic',
    name: 'Classic Mystery Scoop',
    category: 'mystery-scoops',
    priceCents: 1299,
    description:
      'The heart of the Lucky Scoops experience: one full scoop of surprise charms, beads, and mini figures. Every scoop is a new adventure!',
    details: [
      '8–12 surprise charms and beads per scoop',
      'Chance of a rare Lucky or Dior mini figure',
      'Collect, trade, and share',
      'Kid-safe materials, ages 6+',
    ],
    images: ['/images/mystery.svg', '/images/charms.svg'],
    inventory: 120,
    badge: 'New',
    featured: true,
    reviews: [
      { author: 'Priya D.', rating: 5, text: 'We pulled a rare Dior figure on our second scoop. Screaming!' },
    ],
  },
  {
    slug: 'mystery-scoop-deluxe',
    name: 'Deluxe Mystery Scoop Box',
    category: 'mystery-scoops',
    priceCents: 2999,
    compareAtCents: 3599,
    description:
      'Three scoops of surprise plus one guaranteed exclusive charm you can’t get anywhere else. The ultimate gift for collectors.',
    details: [
      '3 full scoops (24+ charms and beads)',
      '1 guaranteed exclusive seasonal charm',
      'Collector checklist included',
      'Giftable keepsake box',
    ],
    images: ['/images/mystery.svg', '/images/hero.svg'],
    inventory: 8,
    badge: 'Limited Edition',
    featured: true,
    reviews: [
      { author: 'Casey M.', rating: 5, text: 'Best value in the whole store. The exclusive charm is gorgeous.' },
    ],
  },
  {
    slug: 'lucky-dior-backpack',
    name: 'Lucky & Dior Mini Backpack',
    category: 'backpacks-bags',
    priceCents: 4499,
    description:
      'A pastel dream of a backpack starring Lucky & Dior. Perfect for school, sleepovers, and carrying your charm collection everywhere.',
    details: [
      'Durable easy-clean canvas, glossy print',
      'Padded adjustable straps',
      'Interior charm pocket with zip',
      'Approx. 12" x 10" x 5"',
    ],
    images: ['/images/bags.svg', '/images/lucky.svg'],
    variants: {
      label: 'Color',
      options: [
        { id: 'pink', name: 'Blush Pink' },
        { id: 'lavender', name: 'Lavender' },
      ],
    },
    inventory: 25,
    reviews: [
      { author: 'Dana W.', rating: 5, text: 'Held up through a whole school year. Still looks brand new.' },
    ],
  },
  {
    slug: 'charm-bracelet-kit',
    name: 'Puppy Power Charm Bracelet Kit',
    category: 'accessories-charms',
    priceCents: 1899,
    description:
      'Build your own sparkle! A DIY bracelet kit with pastel beads, heart charms, and letter beads to spell LUCKY, DIOR — or your own name.',
    details: [
      '150+ beads and 6 signature charms',
      'Stretch cord + clasp cord included',
      'Illustrated instruction card',
      'Ages 6+',
    ],
    images: ['/images/charms.svg', '/images/mystery.svg'],
    inventory: 60,
    featured: true,
    reviews: [
      { author: 'Riley B.', rating: 5, text: 'Perfect birthday party activity. Every kid went home happy.' },
    ],
  },
  {
    slug: 'scoop-squad-tee',
    name: 'Scoop Squad Tee',
    category: 'apparel-gear',
    priceCents: 2499,
    description:
      'Soft-washed cotton tee with a glossy Lucky & Dior print. Scoop it. Love it. Live it.',
    details: [
      '100% ring-spun cotton',
      'Kid and adult sizes',
      'Machine washable, print stays glossy',
    ],
    images: ['/images/apparel.svg', '/images/dior.svg'],
    variants: {
      label: 'Size',
      options: [
        { id: 'kids-s', name: 'Kids S' },
        { id: 'kids-m', name: 'Kids M' },
        { id: 'kids-l', name: 'Kids L' },
        { id: 'adult-s', name: 'Adult S' },
        { id: 'adult-m', name: 'Adult M' },
        { id: 'adult-l', name: 'Adult L' },
      ],
    },
    inventory: 80,
    reviews: [
      { author: 'Morgan L.', rating: 4, text: 'Great quality, runs slightly large. Kids love matching with the plushies.' },
    ],
  },
  {
    slug: 'sparkle-tumbler',
    name: 'Sparkle Scoops Tumbler',
    category: 'home-lifestyle',
    priceCents: 2199,
    description:
      'A glitter-infused tumbler with Lucky & Dior sipping in style. Keeps drinks cold while you keep collecting.',
    details: [
      '16 oz double-wall, BPA-free',
      'Leak-resistant lid with straw',
      'Hand wash recommended',
    ],
    images: ['/images/home.svg', '/images/hero.svg'],
    inventory: 0,
    reviews: [
      { author: 'Jesse F.', rating: 5, text: 'The glitter swirl is mesmerizing. Restock please!' },
    ],
  },
  {
    slug: 'lucky-pack-membership',
    name: 'Lucky Pack VIP Membership (Annual)',
    category: 'mystery-scoops',
    priceCents: 4999,
    description:
      'Join the Pack! A year of early access to drops, members-only charms, birthday surprises, and double rewards on every scoop.',
    details: [
      'Early access to every limited drop',
      'Exclusive welcome charm set',
      'Birthday surprise box',
      '2x Lucky Pack reward points',
    ],
    images: ['/images/hero.svg', '/images/mystery.svg'],
    inventory: 999,
    badge: 'New',
    reviews: [
      { author: 'Avery S.', rating: 5, text: 'Paid for itself with the first early-access drop.' },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );
  const others = PRODUCTS.filter(
    (p) => p.category !== product.category && p.slug !== product.slug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function averageRating(product: Product): number | null {
  if (product.reviews.length === 0) return null;
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / product.reviews.length) * 10) / 10;
}
