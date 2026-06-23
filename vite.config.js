import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/bazi-classified-site/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
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
