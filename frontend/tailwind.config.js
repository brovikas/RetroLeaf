/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Retro CRT / paper inspired palette
        paper: "#F3E9D2",
        ink: "#2B2118",
        amber: {
          DEFAULT: "#D98E04",
          dim: "#8C5A0A",
          glow: "#FFC857",
        },
        mint: {
          DEFAULT: "#3FA796",
          dim: "#1F5C53",
        },
        purple: {
          DEFAULT: "#7B5CFF",
          dim: "#3D2E80",
        },
        crt: {
          bg: "#1B1410",
          panel: "#2A1F18",
          border: "#4A372A",
        },
      },
      fontFamily: {
        display: ["'Special Elite'", "'Courier New'", "monospace"],
        body: ["'Space Mono'", "'Courier New'", "monospace"],
        serif: ["'Lora'", "Georgia", "serif"],
      },
      backgroundImage: {
        "paper-texture":
          "radial-gradient(circle at 1px 1px, rgba(43,33,24,0.06) 1px, transparent 0)",
        scanlines:
          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
      },
      boxShadow: {
        retro: "4px 4px 0px 0px rgba(43,33,24,0.85)",
        "retro-sm": "2px 2px 0px 0px rgba(43,33,24,0.85)",
        glow: "0 0 12px rgba(255,200,87,0.45)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.96" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
      },
      animation: {
        flicker: "flicker 4s infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
