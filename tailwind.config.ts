import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "hsl(var(--cream) / <alpha-value>)",
        "cream-2": "hsl(var(--cream-2) / <alpha-value>)",
        espresso: "hsl(var(--espresso) / <alpha-value>)",
        "espresso-soft": "hsl(var(--espresso-soft) / <alpha-value>)",
        olive: "hsl(var(--olive) / <alpha-value>)",
        "olive-soft": "hsl(var(--olive-soft) / <alpha-value>)",
        stroke: "hsl(var(--stroke) / <alpha-value>)",
        jachnun: "hsl(var(--jachnun) / <alpha-value>)",
        "jachnun-soft": "hsl(var(--jachnun-soft) / <alpha-value>)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
        input: "var(--radius-input)",
      },
      boxShadow: {
        float: "var(--shadow-float)",
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        latin: ["var(--font-latin)", "Georgia", "serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
