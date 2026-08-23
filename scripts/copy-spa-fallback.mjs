import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const index = resolve(root, "dist", "index.html");
const fallback = resolve(root, "dist", "404.html");

if (!existsSync(index)) {
  throw new Error("Cannot create SPA fallback because dist/index.html does not exist.");
}

copyFileSync(index, fallback);

const staticRoutes = ["workbench"];
for (const route of staticRoutes) {
  const routeDirectory = resolve(root, "dist", route);
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(index, resolve(routeDirectory, "index.html"));
}

console.log(`Created dist/404.html SPA fallback and ${staticRoutes.length} static route entr${staticRoutes.length === 1 ? "y" : "ies"}.`);
