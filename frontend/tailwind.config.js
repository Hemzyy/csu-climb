import daisyui from "daisyui";
import tailwindcssMotion from "tailwindcss-motion";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/bg-img.png')",
      },
    },
  },
  plugins: [tailwindcssMotion, daisyui],
  daisyui: {
    themes: [
      {
        myCustomTheme: {
          "primary": "#FE5F55",
          "base-100": "#252525",
        },
      },
      "dark", // Fallback theme
    ],
  },
}