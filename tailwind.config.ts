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
        background: "#F9F9F4",
        foreground: "#1C1C1C",
        editorial: {
          border: "#1C1C1C",
          red: "#991B1B",
          green: "#166534",
          light: "#EAEAE2",
        },
      },
      fontFamily: {
        serif: ['var(--font-merriweather)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
