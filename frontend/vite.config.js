import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

import netlifyPlugin from "@netlify/vite-plugin-react-router";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlifyPlugin()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
