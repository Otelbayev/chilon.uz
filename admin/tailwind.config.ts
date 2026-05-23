import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0a4a8f',
          50:  '#eef5ff',
          100: '#d9e8ff',
          500: '#0a4a8f',
          600: '#083d76',
          700: '#06305c',
        },
        accent: { DEFAULT: '#e30613' },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
