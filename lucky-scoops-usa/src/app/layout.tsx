import type { Metadata } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const display = Baloo_2({ subsets: ['latin'], variable: '--font-display' });
const body = Nunito({ subsets: ['latin'], variable: '--font-body' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lucky Scoops USA — Scoop, Surprise, Smile!',
    template: '%s | Lucky Scoops USA',
  },
  description:
    'The #1 interactive mystery experience. Shop Lucky & Dior plush puppies, mystery scoops, charms, and more. Every scoop is a new adventure!',
  keywords: ['Lucky Scoops', 'mystery scoops', 'plush puppies', 'collectible charms', 'Lucky and Dior'],
  openGraph: {
    type: 'website',
    siteName: 'Lucky Scoops USA',
    title: 'Lucky Scoops USA — Scoop, Surprise, Smile!',
    description: 'Shop Lucky & Dior plush puppies, mystery scoops, charms, and more.',
    images: ['/images/hero.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucky Scoops USA — Scoop, Surprise, Smile!',
    description: 'Every scoop is a new adventure!',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
