import { spawn } from "node:child_process";

const children = [];
let shuttingDown = false;

const start = (command, args, label) => {
  const child = spawn(command, args, { stdio: ["inherit", "pipe", "pipe"] });
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

start(process.execPath, ["rag/server.mjs"], "rag");
start("npm", ["run", "dev", "--", "--host", "127.0.0.1"], "web");
