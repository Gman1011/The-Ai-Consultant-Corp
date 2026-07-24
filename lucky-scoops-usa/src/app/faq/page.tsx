import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Lucky Scoops USA, mystery scoops, shipping, and more.',
};

const FAQS = [
  {
    q: 'What exactly is a Mystery Scoop?',
    a: 'A Mystery Scoop is a full scoop of surprise charms, beads, and sometimes mini figures from our sparkling bins. You never know exactly what you’ll get — that’s the adventure! Every scoop includes 8–12 items.',
  },
  {
    q: 'Who are Lucky and Dior?',
    a: 'Lucky is our fluffy white puppy with a pink eye and a blue eye; Dior is her spotted best friend with a green eye and a blue eye. They’re original Lucky Scoops USA characters, and they star on our plush, charms, apparel, and more.',
  },
  {
    q: 'Are your products safe for kids?',
    a: 'Yes! Plush toys use embroidered details instead of small parts and are rated ages 3+. Charm products contain small parts and are rated ages 6+. Everything is made from premium, kid-safe, tested materials.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Apple Pay, Google Pay, Visa, Mastercard, American Express, and debit cards — all processed securely through Stripe. We never see or store your card details.',
  },
  {
    q: 'How fast is shipping?',
    a: 'Orders ship within 1–2 business days. Standard shipping takes 3–6 business days and is free over $50. Expedited 2–3 day shipping is available at checkout.',
  },
  {
    q: 'Can I return a mystery item?',
    a: 'Opened mystery items can’t be returned (the surprise is the product!), but anything damaged or incomplete is replaced free. Everything else has a 30-day happiness guarantee.',
  },
  {
    q: 'What is the Lucky Pack?',
    a: 'Our VIP membership! Members get early access to limited drops, exclusive charms, birthday surprises, and double reward points on every scoop.',
  },
  {
    q: 'Do you have physical stores?',
    a: 'Our first experience-first flagship stores with interactive scoop stations are on the way. Follow @LuckyScoopsUSA to find out when we open near you!',
  },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mt-10 text-center font-display text-4xl font-bold text-grape">
        Frequently Asked Questions 💭
      </h1>
      <div className="mt-8 space-y-4 pb-4">
        {FAQS.map((f) => (
          <details key={f.q} className="card group p-6">
            <summary className="cursor-pointer list-none font-bold text-grape transition group-open:text-blush-500">
              <span className="mr-2" aria-hidden="true">🐾</span>
              {f.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-grape/80">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
