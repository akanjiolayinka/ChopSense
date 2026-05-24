/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0E1B2E",
        "navy-soft": "#16263C",
        "navy-line": "#22344f",
        cream: "#F7F3EA",
        gold: "#F2B137",
        green: "#2E8B57",
        "blue-gray": "#A9B6C9",
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
        display: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -12px rgba(242, 177, 55, 0.45)",
        "green-glow": "0 0 0 1px rgba(46,139,87,0.5), 0 14px 50px -16px rgba(46,139,87,0.55)",
        card: "0 18px 50px -24px rgba(0,0,0,0.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pin-drop": {
          "0%": { opacity: "0", transform: "translateY(-22px) scale(0.6)" },
          "70%": { transform: "translateY(2px) scale(1.05)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pin-drop": "pin-drop 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};
