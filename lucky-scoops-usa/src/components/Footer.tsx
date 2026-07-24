import Link from 'next/link';
import SocialLinks from './SocialLinks';

const SHOP_LINKS = [
  { href: '/shop', label: 'All Products' },
  { href: '/shop?category=plush-puppies', label: 'Plush Puppies' },
  { href: '/shop?category=mystery-scoops', label: 'Mystery Scoops' },
  { href: '/shop?category=accessories-charms', label: 'Charms' },
];

const HELP_LINKS = [
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/returns', label: 'Returns' },
  { href: '/contact', label: 'Contact Us' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-lavender-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-blush-500">Lucky Scoops USA</p>
          <p className="mt-3 text-sm leading-relaxed text-grape/80">
            Scoop, Surprise, Smile! The #1 interactive mystery experience — where every scoop brings a smile.
          </p>
          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>

        {[
          { title: 'Shop', links: SHOP_LINKS },
          { title: 'Help', links: HELP_LINKS },
          { title: 'Legal', links: LEGAL_LINKS },
        ].map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="font-bold text-grape">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-grape/80 transition hover:text-blush-500">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-lavender-100 py-5 text-center text-xs text-grape/60">
        © {new Date().getFullYear()} Lucky Scoops USA. All rights reserved. Lucky™ and Dior™ characters are original works of Lucky Scoops USA.
      </div>
    </footer>
  );
}
