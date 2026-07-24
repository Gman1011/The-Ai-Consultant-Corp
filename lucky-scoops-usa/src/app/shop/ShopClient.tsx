'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES, PRODUCTS, averageRating, type CategorySlug } from '@/data/products';
import ProductCard from '@/components/ProductCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'name', label: 'Name A–Z' },
];

export default function ShopClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as CategorySlug | null;

  const [category, setCategory] = useState<CategorySlug | 'all'>(
    initialCategory && CATEGORIES.some((c) => c.slug === initialCategory) ? initialCategory : 'all'
  );
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const products = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.inventory > 0);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        list.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'rating':
        list.sort((a, b) => (averageRating(b) ?? 0) - (averageRating(a) ?? 0));
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return list;
  }, [category, query, sort, inStockOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <header className="mt-10 text-center">
        <h1 className="font-display text-4xl font-bold text-grape sm:text-5xl">Shop the Magic ✨</h1>
        <p className="mt-3 text-grape/80">Plush, scoops, charms, and everything Lucky &amp; Dior.</p>
      </header>

      {/* Category chips */}
      <nav aria-label="Product categories" className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          aria-pressed={category === 'all'}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            category === 'all' ? 'bg-blush-500 text-white' : 'bg-white text-grape shadow-soft hover:bg-lavender-50'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            aria-pressed={category === c.slug}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              category === c.slug ? 'bg-blush-500 text-white' : 'bg-white text-grape shadow-soft hover:bg-lavender-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {/* Search / sort / filter row */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="shop-search" className="sr-only">Search products</label>
        <input
          id="shop-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="input sm:max-w-xs"
        />
        <label htmlFor="shop-sort" className="sr-only">Sort products</label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="input sm:max-w-52"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 font-semibold text-grape/80">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-blush-500"
          />
          In stock only
        </label>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <p role="status" className="mt-16 text-center text-lg text-grape/70">
          No products match your search. Try a different keyword or category! 🐾
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
