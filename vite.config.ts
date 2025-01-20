import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    hmr: {
      clientPort: 443, // Force client to use HTTPS port
      host: '3dabd194-a70d-4707-9f28-496db6e7dec5.lovableproject.com'
    },
    fs: {
      strict: true,
    },
  },
});