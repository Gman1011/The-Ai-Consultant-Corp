'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p aria-hidden="true" className="text-6xl">🙈</p>
      <h1 className="font-display text-3xl font-bold text-grape">Oops — something spilled!</h1>
      <p className="max-w-md text-grape/80">
        Lucky &amp; Dior are cleaning it up. Please try again in a moment.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-2">
        Try Again
      </button>
    </div>
  );
}
