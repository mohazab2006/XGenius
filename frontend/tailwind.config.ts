import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pitch / surface
        bg: {
          DEFAULT: "#05070D",       // deep tournament black
          soft: "#0A0F1C",          // surface
          card: "#0E1525",          // elevated card
          raised: "#131C30",        // hover/active
        },
        line: {
          DEFAULT: "#1B2335",       // default border
          strong: "#283149",        // emphasized border
        },
        ink: {
          DEFAULT: "#F8FAFC",       // primary text
          dim: "#A4ADC2",           // secondary
          faint: "#6A7691",         // tertiary
        },
        // Championship palette
        crimson: {
          DEFAULT: "#E11D2E",       // FIFA red
          dark: "#A6111E",
          glow: "#FF3344",
        },
        gold: {
          DEFAULT: "#F5C842",       // trophy gold
          dark: "#C99A1F",
          soft: "#FFE68A",
        },
        pitch: {
          DEFAULT: "#10B981",       // football green (sparingly)
          dark: "#0B7C5B",
        },
        sky: {
          DEFAULT: "#3DA5FF",       // sport-broadcast blue
        },
        bad: "#EF4444",
        warn: "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Editorial display scale (tight tracking, condensed)
        "display-2xl": ["clamp(3.25rem, 8vw, 6.5rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-xl":  ["clamp(2.5rem, 6vw, 4.75rem)",  { lineHeight: "0.94", letterSpacing: "-0.02em" }],
        "display-lg":  ["clamp(2rem, 5vw, 3.5rem)",     { lineHeight: "0.96", letterSpacing: "-0.01em" }],
        "display-md":  ["clamp(1.5rem, 3.5vw, 2.25rem)",{ lineHeight: "1.02", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        eyebrow: "0.22em",
        widest2: "0.32em",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.7)",
        glow: "0 0 0 1px rgba(225,29,46,0.35), 0 12px 32px -10px rgba(225,29,46,0.45)",
        gold: "0 0 0 1px rgba(245,200,66,0.35), 0 12px 32px -10px rgba(245,200,66,0.35)",
        ring: "0 0 0 1px rgba(255,255,255,0.06) inset",
      },
      backgroundImage: {
        "stadium-glow":
          "radial-gradient(1200px 520px at 50% -120px, rgba(225,29,46,0.22), transparent 60%), radial-gradient(900px 420px at 100% 10%, rgba(245,200,66,0.10), transparent 60%), radial-gradient(900px 420px at 0% 20%, rgba(61,165,255,0.08), transparent 60%)",
        "noise-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "noise-grid": "32px 32px",
      },
      animation: {
        "ticker-pulse": "tickerPulse 1.6s ease-in-out infinite",
      },
      keyframes: {
        tickerPulse: {
          "0%,100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
