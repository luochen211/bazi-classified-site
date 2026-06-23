import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const srcDir = resolve(root, "src");
const publicDir = resolve(root, "public");
const rootAssets = resolve(root, "assets");
const checkedExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs"]);
const assetPattern = /["'`]\/assets\/([^"'`?#]+)(?:[?#][^"'`]*)?["'`]/g;
const contentPattern = /["'`]\/content\/([^"'`?#]+)(?:[?#][^"'`]*)?["'`]/g;
const failures = [];

const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      return statSync(path).isDirectory() ? walk(path) : [path];
    })
    .sort();
};

if (existsSync(rootAssets) && walk(rootAssets).length > 0) {
  failures.push("Root assets/ contains files. Keep publishable assets under public/assets to avoid duplicate asset sources.");
}

const sourceFiles = walk(srcDir).filter((path) => checkedExtensions.has(extname(path)));
const referenced = new Set();

for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  for (const pattern of [assetPattern, contentPattern]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      if (match[1].includes("${")) {
        continue;
      }
      const publicPath = join(publicDir, pattern === assetPattern ? "assets" : "content", match[1]);
      referenced.add(relative(root, publicPath));
      if (!existsSync(publicPath)) {
        failures.push(`${relative(root, file)} references missing public file: /${relative(publicDir, publicPath)}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Asset checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Asset references are valid (${referenced.size} public files checked).`);
