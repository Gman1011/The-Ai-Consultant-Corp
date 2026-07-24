import Stripe from 'stripe';

// Lazily construct the client so builds succeed without env vars;
// the API route returns a clear error at request time if the key is missing.
let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and add your Stripe keys.'
    );
  }
  if (!stripe) {
    stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return stripe;
}
