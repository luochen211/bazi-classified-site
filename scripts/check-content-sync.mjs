import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "content");
const target = resolve(root, "public", "content");

const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      return statSync(path).isDirectory() ? walk(path) : [path];
    })
    .sort();
};

const relativeFiles = (dir) => walk(dir).map((path) => relative(dir, path));
const sourceFiles = relativeFiles(source);
const targetFiles = relativeFiles(target);
const failures = [];

if (sourceFiles.length !== targetFiles.length) {
  failures.push(`File count differs: content=${sourceFiles.length}, public/content=${targetFiles.length}`);
}

const allFiles = new Set([...sourceFiles, ...targetFiles]);
for (const file of [...allFiles].sort()) {
  const sourcePath = join(source, file);
  const targetPath = join(target, file);

  if (!existsSync(sourcePath)) {
    failures.push(`Only in public/content: ${file}`);
    continue;
  }

  if (!existsSync(targetPath)) {
    failures.push(`Only in content: ${file}`);
    continue;
  }

  if (!readFileSync(sourcePath).equals(readFileSync(targetPath))) {
    failures.push(`Content differs: ${file}`);
  }
}

if (failures.length > 0) {
  console.error("content and public/content are out of sync:");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error("Run: npm run sync:content");
  process.exit(1);
}

console.log(`content and public/content are synchronized (${sourceFiles.length} files).`);
