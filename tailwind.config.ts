import { type Config } from "tailwindcss";

export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'bm-black': '#0E1116',
          'bm-red': '#D7322E',
          'bm-red-dark': '#8B1F1C',
          'bm-blue': '#2A4E86',
          'bm-gold': '#C8922B',
          'bm-purple': '#5B3A86',
          'bm-green': '#2E6F57',
          'bm-green-dark': '#1B4D3A',
          'bm-gray-gold': '#8A8372',
          'bm-beige': '#FAF5E5',
          'bm-cream': '#F5F0E0',
          'bm-warm': '#D9CDAE',
          'bm-orange': '#E8A33D',
        },
        fontFamily: {
          'cairo': ['Cairo', 'sans-serif'],
          'playfair': ['Playfair Display', 'serif'],
        },
      },
    },
    plugins: [],
  } satisfies Config;