import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5fa',
          100: '#ffe4f1',
          200: '#ffc9e3',
          300: '#ff9fce',
          400: '#ff6ab2',
          500: '#f83e96',
          600: '#e01e78',
        },
        lavender: {
          50: '#f8f5ff',
          100: '#efe8ff',
          200: '#ddcdff',
          300: '#c3a6ff',
          400: '#a578f7',
          500: '#8a4fe8',
          600: '#7434cf',
        },
        sky: {
          100: '#e3f2ff',
          200: '#c2e3ff',
          300: '#93ccff',
        },
        grape: '#5b2d91',
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(138, 79, 232, 0.12)',
        glow: '0 0 24px rgba(248, 62, 150, 0.25)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        sparkle: 'sparkle 2.4s ease-in-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
