import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

// Stripe webhook handler. Point a Stripe webhook endpoint at
// /api/webhooks/stripe and set STRIPE_WEBHOOK_SECRET. Extend the
// checkout.session.completed branch to decrement inventory, send
// confirmation emails, or record orders in a database.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const payload = await req.text();

  let event: import('stripe').Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`Order completed: ${session.id}, total ${session.amount_total}`);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
