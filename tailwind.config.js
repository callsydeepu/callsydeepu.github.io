/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "-apple-system", "sans-serif"],
        display: ["Syne", "'Space Grotesk'", "sans-serif"],
        condensed: ["'Oswald'", "'Bebas Neue'", "'Barlow Condensed'", "sans-serif"],
        serif: ["Newsreader", "'Playfair Display'", "Georgia", "serif"],
        mono: ["'DM Mono'", "monospace"],
        heading: ["'Space Grotesk'", "sans-serif"]
      },
      colors: {
        ink: {
          950: "#060608",
          900: "#0a0a0c",
          850: "#0f0f13",
          800: "#141418",
          700: "#1c1c22",
          600: "#272730"
        },
        ivory: {
          50: "#faf9f6",
          100: "#f5f3ec",
          200: "#eae8e2",
          300: "#dcd8ce",
          400: "#9e9a8f",
          900: "#18181b"
        },
        chartreuse: {
          DEFAULT: "#e2ee5a",
          light: "#ecf777",
          dark: "#c7d43c"
        },
        coral: {
          DEFAULT: "#e24a4a",
          bright: "#ff4444"
        }
      },
      boxShadow: {
        glow: "0 0 50px rgba(226,238,90,0.22)",
        pillGlow: "0 0 35px rgba(226,238,90,0.3)"
      }
    }
  },
  plugins: []
};
