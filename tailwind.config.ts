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
        background: "#0f1115",
        card: "#171a21",
        "card-hover": "#1f2330",
        primary: "#8be9fd",
        success: "#50fa7b",
        warning: "#ffb86c",
        error: "#ff5555",
        "text-primary": "#f2f4f8",
        "text-secondary": "#7f85a3",
        highlight: "#ff79c6",
      },
    },
  },
  plugins: [],
};

export default config;
