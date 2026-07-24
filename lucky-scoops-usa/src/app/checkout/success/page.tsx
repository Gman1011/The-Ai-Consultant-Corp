import type { Metadata } from 'next';
import Link from 'next/link';
import ClearCart from './ClearCart';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false },
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <ClearCart />
      <p aria-hidden="true" className="animate-floaty text-7xl">🎉</p>
      <h1 className="mt-6 font-display text-4xl font-bold text-grape">
        Thank you — your order is confirmed!
      </h1>
      <p className="mt-4 leading-relaxed text-grape/80">
        Lucky &amp; Dior are doing a happy dance! A receipt is on its way to your email, and we&apos;ll
        send tracking details as soon as your surprise ships.
      </p>
      {sessionId && (
        <p className="mt-3 text-xs text-grape/50">
          Order reference: <code className="rounded bg-lavender-50 px-2 py-1">{sessionId.slice(0, 24)}…</code>
        </p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="btn-primary">Keep Shopping</Link>
        <Link href="/" className="btn-secondary">Back Home</Link>
      </div>
    </div>
  );
}
