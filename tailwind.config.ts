import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#05060A",
        surface: {
          dark: "#0B0D14",
          glass: "rgba(255, 255, 255, 0.03)",
          glassHover: "rgba(255, 255, 255, 0.07)",
          card: "rgba(13, 16, 27, 0.75)",
        },
        accent: {
          primary: "#6C5CE7",
          secondary: "#00E5C7",
          pink: "#FF3366",
        },
        text: {
          primary: "#F5F5F7",
          muted: "#8A8F98",
          subtle: "#545863",
        },
        border: {
          glass: "rgba(255, 255, 255, 0.08)",
          glassHover: "rgba(255, 255, 255, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(135deg, #6C5CE7 0%, #00E5C7 100%)",
        "gradient-accent-vertical": "linear-gradient(180deg, #6C5CE7 0%, #00E5C7 100%)",
        "hero-overlay": "linear-gradient(90deg, rgba(5,6,10,0.2) 0%, rgba(5,6,10,0.7) 45%, rgba(5,6,10,0.96) 80%, #05060A 100%)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 3s infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "marquee": "marquee 35s linear infinite",
        "marquee-reverse": "marquee-reverse 35s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.85", filter: "blur(32px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
