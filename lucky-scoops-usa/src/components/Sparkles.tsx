const POSITIONS = [
  { top: '8%', left: '6%', size: 14, delay: '0s' },
  { top: '18%', right: '10%', size: 10, delay: '0.6s' },
  { top: '55%', left: '4%', size: 8, delay: '1.2s' },
  { top: '70%', right: '6%', size: 12, delay: '0.3s' },
  { top: '35%', left: '48%', size: 9, delay: '0.9s' },
];

/** Decorative sparkles layer. Purely visual — hidden from assistive tech. */
export default function Sparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {POSITIONS.map((p, i) => (
        <svg
          key={i}
          className="absolute animate-sparkle text-lavender-300"
          style={{ ...p, width: p.size, height: p.size, animationDelay: p.delay }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      ))}
    </div>
  );
}
