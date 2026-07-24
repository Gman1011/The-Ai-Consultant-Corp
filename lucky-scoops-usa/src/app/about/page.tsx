import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'The story of Lucky Scoops USA — our mission, our characters Lucky & Dior, our quality promise, and our community vision.',
};

const PILLARS = [
  { emoji: '🎉', title: 'Surprise & Delight', text: 'Every scoop brings excitement.' },
  { emoji: '🛡️', title: 'Quality & Safety', text: 'Premium, kid-safe materials in everything we make.' },
  { emoji: '🤝', title: 'Community & Connection', text: 'Fans, collectors, and families first.' },
  { emoji: '💡', title: 'Creativity & Innovation', text: 'Unique experiences, always.' },
  { emoji: '👑', title: 'White Label Power', text: 'Our own products. Higher quality. Stronger brand.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <section className="mt-10 text-center">
        <h1 className="font-display text-4xl font-bold text-grape sm:text-5xl">Our Story 💖</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-grape/80">
          Lucky Scoops USA was born from a simple idea: that the moment of surprise — the scoop, the
          reveal, the squeal of joy — is one of the purest kinds of happiness. We set out to build the
          leading interactive mystery experience brand for kids, collectors, and families across the
          U.S., creating a world of surprise, joy, and loyalty around our signature characters, Lucky
          &amp; Dior.
        </p>
      </section>

      <section aria-labelledby="mission-title" className="card mt-12 p-8 text-center">
        <h2 id="mission-title" className="section-title">Our Mission</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-grape/80">
          Deliver unforgettable moments through every scoop — combining cute collectibles, exclusive
          puppy-themed products, and premium customer experiences both in store and online.
        </p>
      </section>

      <section aria-labelledby="characters-title" className="mt-12">
        <h2 id="characters-title" className="section-title text-center">The Stars of the Show</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <figure className="card p-6 text-center">
            <Image src="/images/lucky.svg" alt="Lucky, a fluffy white puppy with a gold crown" width={200} height={200} className="mx-auto rounded-2xl" />
            <figcaption className="mt-4">
              <p className="font-display text-2xl font-bold text-blush-500">Lucky</p>
              <p className="mt-2 text-sm text-grape/80">
                The optimist. Fluffy, kind, and always first to leap into a new adventure. Her pink and
                blue eyes see the magic in everything.
              </p>
            </figcaption>
          </figure>
          <figure className="card p-6 text-center">
            <Image src="/images/dior.svg" alt="Dior, a spotted puppy with black ears and a gold crown" width={200} height={200} className="mx-auto rounded-2xl" />
            <figcaption className="mt-4">
              <p className="font-display text-2xl font-bold text-lavender-500">Dior</p>
              <p className="mt-2 text-sm text-grape/80">
                The spark. Spotted, spirited, and full of surprises — just like every scoop. Her green
                and blue eyes are always looking for the next bit of fun.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="pillars-title" className="mt-12">
        <h2 id="pillars-title" className="section-title text-center">Our Pillars</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <li key={p.title} className="card p-6">
              <span aria-hidden="true" className="text-3xl">{p.emoji}</span>
              <p className="mt-2 font-bold text-lavender-600">{p.title}</p>
              <p className="mt-1 text-sm text-grape/80">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="promise-title" className="card mt-12 p-8">
        <h2 id="promise-title" className="section-title text-center">Our Quality Promise</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-grape/80">
          Every Lucky Scoops product is designed in-house and made from premium, kid-safe materials.
          Our plush toys use embroidered details instead of small parts, our charms are tested to U.S.
          toy-safety standards, and our packaging is designed to be part of the fun. If anything ever
          falls short, our{' '}
          <Link href="/returns" className="font-bold text-blush-500 hover:underline">
            30-day happiness guarantee
          </Link>{' '}
          has you covered.
        </p>
      </section>

      <section aria-labelledby="community-title" className="mt-12 pb-4 text-center">
        <h2 id="community-title" className="section-title">Our Community Vision</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-grape/80">
          We dream of vibrant, Instagrammable scoop stations in every state, a collector community that
          trades and shares, and a Lucky Pack that rewards every scoop, share, and smile. From our
          first flagship stores to families everywhere — this is just the beginning.
        </p>
        <Link href="/shop" className="btn-primary mt-8">Start Your Collection</Link>
      </section>
    </div>
  );
}
