export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div aria-hidden="true" className="animate-floaty text-6xl">🐾</div>
      <p className="font-display text-xl font-bold text-lavender-500">Scooping up something special…</p>
    </div>
  );
}
