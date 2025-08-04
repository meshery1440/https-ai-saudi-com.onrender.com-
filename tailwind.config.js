/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      fontFamily: {
        tajawal: ["var(--font-tajawal)", "system-ui", "sans-serif"],
      },
      colors: {
        ...defaultConfig.theme.extend.colors,
        primary: {
          ...defaultConfig.theme.extend.colors.primary,
          50: "#f0fdff",
          100: "#ccfbff",
          200: "#99f6ff",
          300: "#4aebff",
          400: "#00f7ff",
          500: "#00d4e6",
          600: "#00a8c2",
          700: "#0a869d",
          800: "#146b7f",
          900: "#155a6b",
        },
        secondary: {
          ...defaultConfig.theme.extend.colors.secondary,
          50: "#f4f3ff",
          100: "#ebe9fe",
          200: "#d9d6fe",
          300: "#beb5fd",
          400: "#9d8bfa",
          500: "#6c63ff",
          600: "#5b4cf5",
          700: "#4c3ee1",
          800: "#4035bd",
          900: "#372f9a",
        },
        accent: {
          ...defaultConfig.theme.extend.colors.accent,
          50: "#fef2f7",
          100: "#fee7f1",
          200: "#fecfe4",
          300: "#fda6cd",
          400: "#fb73aa",
          500: "#ff4d8d",
          600: "#ed1c6b",
          700: "#cf0f56",
          800: "#ab1148",
          900: "#8f1340",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
