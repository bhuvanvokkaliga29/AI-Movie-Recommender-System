import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ink-black": "#17191c",
        "paper-white": "#ffffff",
        "mist-gray": "#f2f2f3",
        "fog-white": "#fafafb",
        "slate-gray": "#777b86",
        "ash-gray": "#979799",
        "smoke-gray": "#a3a6af",
        "blush-peach": "#fbe1d1",
        "sienna-brown": "#5d2a1a",
      },
      fontFamily: {
        serif: [
          "var(--font-signifier)",
          "Source Serif 4",
          "Newsreader",
          "Georgia",
          "ui-serif",
          "serif",
        ],
        sans: [
          "var(--font-sohne)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        cards: "24px",
        elevatedcards: "20px",
        inputs: "16px",
        buttons: "9999px",
        images: "12px",
      },
      boxShadow: {
        subtle: "0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 4px 24px 0px rgba(0, 0, 0, 0.04)",
        "subtle-2": "0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 8px 40px 0px rgba(0, 0, 0, 0.06)",
        "floating-artifact": "0 0 0 1px rgba(4, 23, 43, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      },
      maxWidth: {
        page: "1680px",
      },
    },
  },
  plugins: [],
};

export default config;
