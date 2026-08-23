import { spawn } from "node:child_process";

const children = [];
let shuttingDown = false;

const start = (command, args, label, options = {}) => {
  const child = spawn(command, args, { stdio: ["inherit", "pipe", "pipe"], ...options });
  children.push(child);
  child.stdout.on("data", (chunk) => process.stdout.write(`[${label}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${label}] ${chunk}`));
  child.on("exit", (code) => {
    if (shuttingDown) return;
    shutdown(code || 0);
  });
  return child;
};

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 250).unref();
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

const withSag = process.argv.includes("--sag");
if (withSag) {
  start("uv", ["run", "--project", "rag/sag", "python", "-m", "bazi_sag", "serve"], "sag");
}
start(process.execPath, ["rag/server.mjs"], "rag", {
  env: {
    ...process.env,
    ...(withSag ? { BAZI_RAG_PROVIDER: "hybrid" } : {}),
  },
});
start("npm", ["run", "dev", "--", "--host", "127.0.0.1"], "web");
