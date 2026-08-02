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
        "espresso-deep": "hsl(var(--espresso-deep) / <alpha-value>)",
        "cream-3": "hsl(var(--cream-3) / <alpha-value>)",
        brass: "hsl(var(--brass) / <alpha-value>)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
        input: "var(--radius-input)",
      },
      boxShadow: {
        float: "var(--shadow-float)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        latin: ["var(--font-latin)", "Georgia", "serif"],
      },
      maxWidth: {
        container: "1200px",
        "prose-he": "68ch",
      },
      spacing: {
        section: "5rem",
        "section-lg": "7rem",
      },
      // `svh` rather than `vh` — `vh` jitters against the iOS Safari
      // address bar, and every pinned scene is sized off this.
      height: {
        "screen-s": "100svh",
      },
      minHeight: {
        "screen-s": "100svh",
      },
      transitionTimingFunction: {
        "out-soft": "var(--ease-out-soft)",
        "in-out-soft": "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
    },
  },
  plugins: [],
};

export default config;
