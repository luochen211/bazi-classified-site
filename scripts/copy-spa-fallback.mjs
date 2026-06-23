import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const index = resolve(root, "dist", "index.html");
const fallback = resolve(root, "dist", "404.html");

if (!existsSync(index)) {
  throw new Error("Cannot create SPA fallback because dist/index.html does not exist.");
}

copyFileSync(index, fallback);
console.log("Created dist/404.html SPA fallback.");
