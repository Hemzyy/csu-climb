import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

import netlifyPlugin from "@netlify/vite-plugin-react-router";
import netlifyVitePluginReactRouter from '@netlify/vite-plugin-react-router';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlifyPlugin(), netlifyVitePluginReactRouter],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://csu-climb.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
