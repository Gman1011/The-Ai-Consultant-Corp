import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p aria-hidden="true" className="animate-floaty text-6xl">🔍</p>
      <h1 className="font-display text-3xl font-bold text-grape">Page not found</h1>
      <p className="max-w-md text-grape/80">
        Lucky sniffed everywhere but couldn&apos;t find that page. Maybe it&apos;s hiding in the shop?
      </p>
      <Link href="/shop" className="btn-primary mt-2">Browse the Shop</Link>
    </div>
  );
}
