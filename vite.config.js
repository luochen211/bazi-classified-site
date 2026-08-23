import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/bazi-classified-site/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/node_modules/docx/") ||
            id.includes("/node_modules/jszip/") ||
            id.includes("/node_modules/hash.js/") ||
            id.includes("/node_modules/xml-js/") ||
            id.includes("/node_modules/xml/") ||
            id.includes("/node_modules/nanoid/")
          ) {
            return "word-export";
          }

          if (id.includes("/node_modules/")) {
            return "vendor";
          }

          if (id.endsWith("/src/data/siteData.js")) {
            return "site-data";
          }
        }
      }
    }
  },
  plugins: [react()],
});
