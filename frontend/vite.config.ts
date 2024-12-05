import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[hash].js', // Entry filename
        chunkFileNames: 'assets/[hash].js', // Chunks filename
        assetFileNames: 'assets/[hash].[ext]', // Assets filename
      },
    },
    minify: 'esbuild', // ESbuild to minify
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020', // Target ES2020 for dependencies
    },
  },
});