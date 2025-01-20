import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    middlewareMode: true, // Enable proper middleware handling
    fs: {
      strict: false, // Allow proper static file serving
    },
    proxy: {
      // Handle all routes through the SPA
      "^(?!/assets|/@|/node_modules|/src/.*$).*": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => "/index.html",
      },
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure proper base URL handling
  base: "/",
}));