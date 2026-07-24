const SOCIALS = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@LuckyScoopsUSA',
    icon: (
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12V9.77a5.76 5.76 0 0 0-.77-.05A5.69 5.69 0 1 0 15.55 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/LuckyScoopsUSA',
    icon: (
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.73 1.66 4.88 4.88.06 1.26.07 1.64.07 4.85s0 3.6-.07 4.85c-.15 3.22-1.63 4.73-4.88 4.88-1.25.06-1.64.07-4.85.07s-3.6 0-4.85-.07c-3.25-.15-4.73-1.66-4.88-4.88C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85C2.42 3.93 3.9 2.42 7.15 2.27 8.4 2.2 8.8 2.2 12 2.2Zm0 3.63A6.17 6.17 0 1 0 18.17 12 6.17 6.17 0 0 0 12 5.83Zm0 10.18A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@LuckyScoopsUSA',
    icon: (
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.55 15.57V8.43L15.82 12Z" />
    ),
  },
];

export default function SocialLinks() {
  return (
    <ul className="flex items-center gap-3">
      {SOCIALS.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Lucky Scoops USA on ${s.label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-50 text-grape transition hover:bg-blush-100 hover:text-blush-500"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {s.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
