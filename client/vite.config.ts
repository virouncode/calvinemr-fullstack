import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: { lintCommand: 'eslint "./src/**/*.{js,ts,tsx,jsx}"' },
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        //in development when calling /api from localhost:5173 (Vite front) it will be redirected to the backend server
        target: "http://localhost:3001/api", // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: "0.0.0.0", // Allow access from external devices
    port: 5173, // Default Vite port
  },
});
