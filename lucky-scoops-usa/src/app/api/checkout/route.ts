import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getProduct } from '@/data/products';

export const runtime = 'nodejs';

interface CheckoutItem {
  slug: string;
  quantity: number;
  variantId?: string;
}

// Creates a Stripe Checkout Session. Prices are looked up server-side from
// the catalog — the client only sends product slugs and quantities, so a
// tampered request can never change what a customer is charged.
//
// Wallets (Apple Pay / Google Pay) and card brands (Visa, Mastercard, Amex,
// debit) are all served by the 'card' payment method type; Stripe Checkout
// shows wallet buttons automatically on supported devices once the domain is
// registered in the Stripe Dashboard (Settings → Payment methods → Apple Pay).
export async function POST(req: NextRequest) {
  let body: { items?: CheckoutItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return NextResponse.json({ error: 'Your cart is empty or invalid.' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const lineItems: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const product = getProduct(String(item.slug));
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'One of the items in your cart is no longer available.' },
        { status: 400 }
      );
    }
    if (product.inventory === 0) {
      return NextResponse.json(
        { error: `${product.name} is sold out. Please remove it from your cart.` },
        { status: 409 }
      );
    }
    const variantName = product.variants?.options.find((o) => o.id === item.variantId)?.name;
    lineItems.push({
      quantity,
      price_data: {
        currency: 'usd',
        unit_amount: product.priceCents,
        product_data: {
          name: variantName ? `${product.name} — ${variantName}` : product.name,
          description: product.description.slice(0, 200),
          images: product.images
            .filter((img) => !img.endsWith('.svg')) // Stripe requires raster images
            .map((img) => `${siteUrl}${img}`),
          metadata: { slug: product.slug, variantId: item.variantId ?? '' },
        },
      },
    });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      // 'card' covers Visa, Mastercard, Amex, and debit cards; Apple Pay and
      // Google Pay appear automatically in Checkout on supported browsers.
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['US'] },
      phone_number_collection: { enabled: false },
      allow_promotion_codes: true,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    const message =
      err instanceof Error && err.message.includes('STRIPE_SECRET_KEY')
        ? 'Checkout is not configured yet. Add Stripe keys to .env.local.'
        : 'Unable to start checkout right now. Please try again in a moment.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
