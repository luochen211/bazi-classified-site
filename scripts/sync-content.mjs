import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "content");
const target = resolve(root, "public", "content");

if (!existsSync(source)) {
  throw new Error(`Missing content source: ${source}`);
}

rmSync(target, { force: true, recursive: true });
mkdirSync(resolve(root, "public"), { recursive: true });
cpSync(source, target, { recursive: true });

console.log("Synced content -> public/content");
