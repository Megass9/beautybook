import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        sand: {
          50:  "#fdf8f0",
          100: "#f9edd8",
          200: "#f2d9ae",
          300: "#e8be7a",
          400: "#dc9c47",
          500: "#d08226",
          600: "#b8671b",
          700: "#984f18",
          800: "#7c411a",
          900: "#663618",
        },
        charcoal: {
          300: "#9a8878",
          400: "#7a6a5a",
          500: "#4a4136",
          600: "#352e23",
          700: "#252018",
          800: "#1a1714",
          900: "#0f0d0b",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;