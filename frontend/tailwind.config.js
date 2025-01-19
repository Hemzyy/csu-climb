import daisyui from "daisyui";

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
  plugins: [daisyui, require("tailwindcss-motion")],
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