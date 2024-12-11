import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "var(--background)",
        "block": "var(--block)",
        "text-black": "var(--text-black)",
        "text-secondary": "var(--text-secondary)",
        "text-indigo": "var(--text-indigo)",
        "positive-color": "var(--positive-color)",
        "negative-color": "var(--negative-color)",
      },
    },
  },
  plugins: [
  ],
};
export default config;
