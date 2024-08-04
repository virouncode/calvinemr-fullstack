import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ eslint: { lintCommand: 'eslint "./src/**/*.{js,ts,tsx}"' } }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001/api", // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
