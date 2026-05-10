import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F6F1E7',
        'paper-dark': '#EFE7DA',
        earth: '#2B241D',
        'earth-muted': '#6B6257',
        gold: '#B08968',
        'gold-dark': '#7F5539',
        forest: '#606C38',
        error: '#A63C3C',
        success: '#588157',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        soft: '12px',
        card: '32px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};

export default config;
