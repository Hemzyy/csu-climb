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
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        myCustomTheme: {
          "base-100": "#37393A",
        },
      },
      "dark", // Fallback theme
    ],
  },
}