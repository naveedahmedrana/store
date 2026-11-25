/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(97.5% .006 95)",
        foreground: "oklch(21% .03 160)",
        card: "#fff",
        primary: "oklch(44% .11 158)",
        "primary-foreground": "oklch(98.5% .008 95)",
        "primary-deep": "oklch(27% .06 162)",
        "primary-soft": "oklch(94% .035 158)",
        muted: "oklch(95.5% .008 95)",
        "muted-foreground": "oklch(50% .025 160)",
        cta: "oklch(70% .18 50)",
        "cta-foreground": "oklch(99% .005 80)",
        "cta-soft": "oklch(95% .04 70)",
        verified: "oklch(55% .14 245)",
        destructive: "oklch(58% .22 27)",
        border: "oklch(90% .012 120)",
        input: "oklch(88% .012 120)",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px oklch(27% .06 162 / .06), 0 4px 16px -8px oklch(27% .06 162 / .12)",
        lift: "0 12px 32px -12px oklch(27% .06 162 / .28)",
      },
    },
  },
  plugins: [],
};
