import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { featuredProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import EmailSignup from '@/components/EmailSignup';
import Sparkles from '@/components/Sparkles';
import Stars from '@/components/Stars';

export const metadata: Metadata = {
  title: 'Lucky Scoops USA — Scoop, Surprise, Smile!',
};

const STEPS = [
  { emoji: '🥄', title: 'Scoop It', text: 'Choose your scoop from our sparkling charm bins.' },
  { emoji: '🎁', title: 'Reveal It', text: 'Discover surprise charms, figures, or plush minis.' },
  { emoji: '💖', title: 'Love It', text: 'Collect, trade, and share with friends.' },
  { emoji: '👑', title: 'Join the Pack', text: 'Unlock rewards and exclusive drops.' },
];

const TESTIMONIALS = [
  { author: 'Emily & Zoe', rating: 5, text: 'The scoop station was the highlight of our weekend. My daughter has not put Lucky down since!' },
  { author: 'The Nguyen Family', rating: 5, text: 'Every scoop really is a new adventure. We pulled a limited-edition charm on our first try.' },
  { author: 'Kayla B.', rating: 5, text: 'Beautiful quality, fast shipping, and the cutest packaging I have ever seen.' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blush-100 via-lavender-100 to-sky-100 px-6 py-14 sm:px-12 sm:py-20">
        <Sparkles />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div className="animate-fadeUp text-center md:text-left">
            <p className="inline-block rounded-full bg-white/70 px-4 py-1 text-sm font-bold text-lavender-600">
              Every scoop is a new adventure! ✨
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-grape sm:text-6xl">
              Scoop, <span className="text-blush-500">Surprise,</span>{' '}
              <span className="text-lavender-500">Smile!</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-grape/80 md:mx-0 mx-auto">
              The #1 interactive mystery experience. Meet Lucky &amp; Dior and discover charms, plush, and pure joy in every scoop.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link href="/shop" className="btn-primary text-lg">
                Shop Now 🛍️
              </Link>
              <Link href="/about" className="btn-secondary">
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative mx-auto flex max-w-sm items-center justify-center gap-4">
            <Image
              src="/images/lucky.svg"
              alt="Lucky, a fluffy white puppy wearing a gold crown"
              width={220}
              height={220}
              priority
              className="animate-floaty rounded-3xl shadow-soft"
            />
            <Image
              src="/images/dior.svg"
              alt="Dior, a spotted puppy with black ears wearing a gold crown"
              width={220}
              height={220}
              priority
              className="animate-floaty rounded-3xl shadow-soft [animation-delay:1s]"
            />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section aria-labelledby="featured-title" className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 id="featured-title" className="section-title">
            Fan Favorites 💕
          </h2>
          <Link href="/shop" className="font-bold text-blush-500 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featuredProducts().slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-title" className="mt-16">
        <h2 id="how-title" className="section-title text-center">
          How Lucky Scoops Works
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-6 text-center">
              <span aria-hidden="true" className="text-4xl">{step.emoji}</span>
              <p className="mt-3 font-display text-xl font-bold text-lavender-600">
                {i + 1}. {step.title}
              </p>
              <p className="mt-2 text-sm text-grape/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Lucky & Dior */}
      <section aria-labelledby="characters-title" className="mt-16 overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h2 id="characters-title" className="section-title">
              Meet Lucky &amp; Dior 🐾
            </h2>
            <p className="mt-4 leading-relaxed text-grape/80">
              <strong className="text-blush-500">Lucky</strong> is our fluffy white dreamer — always
              optimistic, always ready for the next adventure. <strong className="text-lavender-500">Dior</strong>,
              her spotted best friend, brings the sparkle and the mischief. Together they are the heart
              of every scoop, every charm, and every smile.
            </p>
            <Link href="/shop?category=plush-puppies" className="btn-primary mt-6">
              Adopt a Plush
            </Link>
          </div>
          <video
            className="w-full rounded-3xl shadow-soft"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Lucky and Dior plush puppies playing together"
          >
            <source src="/videos/lucky-dior-play.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Reviews */}
      <section aria-labelledby="reviews-title" className="mt-16">
        <h2 id="reviews-title" className="section-title text-center">
          Happy Scoopers 🌟
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.author} className="card p-6">
              <Stars rating={t.rating} />
              <blockquote className="mt-3 text-sm leading-relaxed text-grape/80">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-4 font-bold text-lavender-600">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Email signup */}
      <div className="mt-16">
        <EmailSignup />
      </div>
    </div>
  );
}
