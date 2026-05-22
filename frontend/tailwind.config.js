/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1B2B",
        navyDark: "#050D15",
        forestDark: "#1a3a2e",
        gold: "#D4A24C",
        forest: "#2F5D44",
        orange: {
          500: "#f97316",
        },
        emerald: {
          400: "#34d399",
        },
        blue: {
          400: "#60a5fa",
        },
        purple: {
          500: "#a855f7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-gold": "0 0 30px rgba(212, 162, 76, 0.4)",
        "glow-forest": "0 0 30px rgba(47, 93, 68, 0.4)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
