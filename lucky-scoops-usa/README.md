# Lucky Scoops USA 🐾✨

**Scoop, Surprise, Smile!** — the production-ready ecommerce store for Lucky Scoops USA, starring Lucky & Dior.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Stripe Checkout**.

## Folder Structure

```
lucky-scoops-usa/
├── public/
│   ├── images/            # Brand & product artwork (SVG placeholders — swap for final art)
│   └── videos/            # Lucky & Dior brand videos
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout: fonts, header/footer, cart provider, SEO defaults
│   │   ├── page.tsx       # Home: hero, featured, how-it-works, characters, reviews, signup
│   │   ├── about/         # Brand story, mission, characters, pillars, quality promise
│   │   ├── shop/          # Product list: categories, search, filters, sorting, quick-add
│   │   ├── product/[slug] # Detail: gallery, variants, quantity, reviews, related, JSON-LD
│   │   ├── cart/          # Cart with quantity controls → Stripe Checkout
│   │   ├── checkout/success/  # Order confirmation (clears cart)
│   │   ├── privacy|terms|shipping|returns|faq|contact/  # Support & legal pages
│   │   ├── api/
│   │   │   ├── checkout/  # Creates Stripe Checkout Sessions (server-side prices)
│   │   │   ├── webhooks/stripe/  # Signed webhook handler (order fulfillment hook)
│   │   │   ├── newsletter/  # Email signup endpoint
│   │   │   └── contact/   # Contact form endpoint
│   │   ├── loading.tsx / error.tsx / not-found.tsx  # Global states
│   │   └── sitemap.ts / robots.ts  # SEO
│   ├── components/        # Header, Footer, ProductCard, CartProvider, EmailSignup, …
│   ├── data/products.ts   # ★ Product catalog — edit this file to manage products
│   └── lib/               # Stripe client, price formatting
├── .env.example           # Environment variable template
└── package.json
```

## Setup

```bash
cd lucky-scoops-usa
npm install
cp .env.example .env.local   # then fill in your Stripe keys
npm run dev                  # http://localhost:3000
```

`.env.local` (never committed — see `.gitignore`):

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Server-side Stripe key (`sk_test_…` / `sk_live_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser-safe Stripe key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/webhooks/stripe` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (redirects + SEO) |

## Managing Products

All products live in **`src/data/products.ts`** — a single typed catalog:

- **Add a product**: append an object (name, price in cents, images, category, inventory, variants, reviews).
- **Change price/stock**: edit in place. `inventory: 0` shows a Sold Out badge and blocks checkout; `1–9` shows a low-stock badge.
- **Prices are enforced server-side**: the checkout API looks prices up from this file, so the client can never tamper with amounts.

## Payments (Stripe)

The cart posts product slugs + quantities to `/api/checkout`, which creates a Stripe Checkout Session and redirects to Stripe's hosted, PCI-compliant payment page.

- **Visa, Mastercard, American Express, and debit cards** are covered by the `card` payment method (enabled by default).
- **Apple Pay & Google Pay** appear automatically in Stripe Checkout on supported devices. For Apple Pay on your production domain: Stripe Dashboard → **Settings → Payment methods → Apple Pay → Add domain**, then verify.
- **Webhooks**: create an endpoint at `https://yourdomain.com/api/webhooks/stripe` for the `checkout.session.completed` event, and put its signing secret in `STRIPE_WEBHOOK_SECRET`. Extend the handler to decrement inventory / send emails / record orders.
- **Test locally**: use `sk_test_` keys and card `4242 4242 4242 4242`; forward webhooks with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Deployment (Vercel recommended)

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Import Project** → select the repo → set **Root Directory** to `lucky-scoops-usa`.
3. Add the four environment variables above (use live `sk_live_`/`pk_live_` keys; set `NEXT_PUBLIC_SITE_URL` to `https://luckyscoopsusa.com`).
4. Deploy. Then register the domain for Apple Pay in Stripe and point the Stripe webhook at the production URL.

Any Node 18+ host also works: `npm run build && npm run start`.

## Quality Checklist

- ✅ Mobile-first responsive layouts, pastel brand system (pink/lavender/purple/soft blue)
- ✅ Accessibility: semantic landmarks, skip link, ARIA labels, focus styles, `prefers-reduced-motion`
- ✅ SEO: per-page metadata, Open Graph, product + FAQ JSON-LD, sitemap, robots
- ✅ Optimized images via `next/image`; gentle CSS-only animations
- ✅ Loading, error, and 404 states; cart persisted in `localStorage`
- ✅ Secure: env-var secrets, server-side price lookup, input validation, signed webhooks, security headers

## Artwork Licensing

Lucky™ and Dior™ are original Lucky Scoops USA characters. The SVGs in `public/images/` are original placeholder art created for this project — replace them with the final owned character artwork (same filenames) whenever ready. Do not ship third-party characters (e.g., Sanrio/Disney figures that appear in some concept references) without a license.
