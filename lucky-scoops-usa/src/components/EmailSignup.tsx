'use client';

import { useState } from 'react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('signup failed');
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section aria-labelledby="signup-title" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blush-100 via-lavender-100 to-sky-100 px-6 py-12 text-center">
      <h2 id="signup-title" className="section-title">
        Join the Pack! 💌
      </h2>
      <p className="mx-auto mt-3 max-w-md text-grape/80">
        Be first to hear about limited-edition drops, new charms, and Lucky &amp; Dior adventures.
      </p>
      {status === 'done' ? (
        <p role="status" className="mt-6 font-bold text-lavender-600">
          You&apos;re in! Welcome to the Lucky Pack. 🎉
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="signup-email" className="sr-only">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input flex-1"
          />
          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining…' : 'Sign Up'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-3 text-sm font-semibold text-blush-600">
          Something went wrong — please try again.
        </p>
      )}
    </section>
  );
}
