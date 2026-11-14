import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // Your frontend port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend Express port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
