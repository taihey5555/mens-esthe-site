import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C5A059",
        "gold-light": "#E0C389",
        charcoal: "#1A1A1A",
        "rich-black": "#0F0F0F",
        "warm-gray": "#F8F7F4",
        primary: "#2badee",
        "background-light": "#f6f7f8",
        "background-dark": "#101c22",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
    },
  },
  plugins: [],
}

export default config
