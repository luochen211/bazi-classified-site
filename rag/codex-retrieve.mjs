#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compileCorpus } from "./lib/corpus.mjs";
import { createRetriever } from "./lib/retrieval.mjs";
import { createSagAugmentedRetriever } from "./lib/sag-provider.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultKnowledgeRoot = path.resolve(
  process.env.BAZI_KB_ROOT || path.join(projectRoot, "..", "AI太牛逼了你知道吗"),
);
const defaultOutputDirectory = path.join(projectRoot, "rag", "generated");
const defaultSagDataRoot = path.join(defaultOutputDirectory, "sag");
const defaultSagUrl = process.env.BAZI_SAG_URL || "http://127.0.0.1:8766";
const defaultEnvFile = process.env.BAZI_SAG_ENV_FILE
  ? path.resolve(process.env.BAZI_SAG_ENV_FILE)
  : path.join(projectRoot, ".env.sag");

const STAGES = new Set(["intake", "pattern", "profile", "topic", "history", "timing", "delivery"]);
const PROVIDERS = new Set(["auto", "sag", "baseline"]);
const FORMATS = new Set(["json", "markdown"]);

const redact = (value) => String(value || "")
  .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
  .replace(/((?:api|access)[_-]?key\s*[=:]\s*)\S+/gi, "$1[redacted]")
  .slice(0, 2_000);

export class CliError extends Error {
  constructor(message, exitCode = 2) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
  }
}

const takeValue = (args, index, name) => {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new CliError(`${name} requires a value`);
  return value;
};

export const parseArguments = (argv = []) => {
  const args = [...argv];
  const command = args[0] === "health" || args[0] === "query" ? args.shift() : "query";
  const options = {
    command,
    query: "",
    stage: "pattern",
    limit: 6,
    includeCases: false,
    provider: "auto",
    format: "json",
    autoStart: true,
    knowledgeRoot: defaultKnowledgeRoot,
    outputDirectory: defaultOutputDirectory,
    dataRoot: path.resolve(process.env.BAZI_SAG_DATA_ROOT || defaultSagDataRoot),
    envFile: defaultEnvFile,
    sagUrl: defaultSagUrl,
  };
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--include-cases") options.includeCases = true;
    else if (argument === "--no-start") options.autoStart = false;
    else if (argument === "--query") options.query = takeValue(args, index++, argument);
    else if (argument === "--stage") options.stage = takeValue(args, index++, argument);
    else if (argument === "--limit") options.limit = Number(takeValue(args, index++, argument));
    else if (argument === "--provider") options.provider = takeValue(args, index++, argument);
    else if (argument === "--format") options.format = takeValue(args, index++, argument);
    else if (argument === "--knowledge-root") options.knowledgeRoot = path.resolve(takeValue(args, index++, argument));
    else if (argument === "--output-directory") options.outputDirectory = path.resolve(takeValue(args, index++, argument));
    else if (argument === "--data-root") options.dataRoot = path.resolve(takeValue(args, index++, argument));
    else if (argument === "--env-file") options.envFile = path.resolve(takeValue(args, index++, argument));
    else if (argument === "--sag-url") options.sagUrl = takeValue(args, index++, argument).replace(/\/$/, "");
    else if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument.startsWith("--")) throw new CliError(`unknown option: ${argument}`);
    else positional.push(argument);
  }

  if (!options.query && positional.length > 0) options.query = positional.join(" ");
  if (!STAGES.has(options.stage)) throw new CliError(`unsupported stage: ${options.stage}`);
  if (!PROVIDERS.has(options.provider)) throw new CliError(`unsupported provider: ${options.provider}`);
  if (!FORMATS.has(options.format)) throw new CliError(`unsupported format: ${options.format}`);
  if (!Number.isFinite(options.limit) || options.limit < 1 || options.limit > 12) {
    throw new CliError("--limit must be between 1 and 12");
  }
  if (command === "query" && !options.help && !options.query.trim()) {
    throw new CliError("query must not be empty");
  }
  return options;
};

const parseEnvKeys = async (envFile) => {
  if (!envFile || !existsSync(envFile)) return new Set();
  const content = await readFile(envFile, "utf8");
  const keys = new Set();
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (!value || /replace-with|change-me|your-key/i.test(value)) continue;
    keys.add(key.trim());
  }
  return keys;
};

const readJsonIfPresent = async (file) => {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return null;
  }
};

const safeFetchJson = async (url, options, fetchImpl) => {
  const response = await fetchImpl(url, {
    ...options,
    signal: AbortSignal.timeout(1_500),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  return payload;
};

export const inspectSag = async ({
  dataRoot = defaultSagDataRoot,
  envFile = defaultEnvFile,
  sagUrl = defaultSagUrl,
  fetchImpl = globalThis.fetch,
} = {}) => {
  const activeManifest = await readJsonIfPresent(path.join(dataRoot, "active.json"));
  const envKeys = await parseEnvKeys(envFile);
  const isConfigured = (key) => envKeys.has(key) || Boolean(process.env[key]?.trim());
  const llmConfigured = ["OPENAI_API_KEY", "OPENAI_BASE_URL", "LLM_MODEL"]
    .every(isConfigured);
  const embeddingConfigured = ["EMBEDDING_API_KEY", "EMBEDDING_BASE_URL", "EMBEDDING_MODEL"]
    .every(isConfigured);
  let sidecar;
  try {
    const payload = await safeFetchJson(`${sagUrl}/v1/health`, { headers: { Accept: "application/json" } }, fetchImpl);
    sidecar = {
      reachable: true,
      status: payload.status || "unknown",
      version: payload.version || "unknown",
      strategy: payload.strategy || "unknown",
      error: payload.error || "",
    };
  } catch (error) {
    sidecar = { reachable: false, status: "stopped", error: redact(error?.message || error).slice(0, 240) };
  }

  const indexReady = Boolean(activeManifest?.fingerprint && activeManifest?.indexDirectory);
  const configReady = llmConfigured && embeddingConfigured;
  const active = sidecar.reachable && sidecar.status === "ok";
  const state = active
    ? "active"
    : !configReady
      ? "needs_config"
      : !indexReady
        ? "needs_index"
        : "ready_to_start";

  return {
    state,
    officialSagActive: active,
    officialSagReadyToStart: configReady && indexReady,
    config: {
      envFile,
      envFileExists: existsSync(envFile),
      llmConfigured,
      embeddingConfigured,
    },
    index: {
      dataRoot,
      active: indexReady,
      fingerprint: activeManifest?.fingerprint || "",
      indexedAt: activeManifest?.indexedAt || "",
      kinds: activeManifest?.kinds || {},
    },
    sidecar,
    nextAction: active
      ? "Official SAG is available for Codex retrieval."
      : !configReady
        ? "Configure a private/local OpenAI-compatible LLM and embedding endpoint in .env.sag."
        : !indexReady
          ? "Run npm run sag:index -- --env-file .env.sag."
          : "Run npm run sag:serve, or let bazi:retrieve auto-start the sidecar.",
  };
};

const waitForSidecar = async ({ child, sagUrl, fetchImpl, timeoutMs = 20_000 }) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null) throw new Error(`SAG sidecar exited with code ${child.exitCode}`);
    try {
      const health = await safeFetchJson(`${sagUrl}/v1/health`, { headers: { Accept: "application/json" } }, fetchImpl);
      if (health.status === "ok") return health;
      if (health.status === "unavailable") throw new Error(health.error || "SAG sidecar is unavailable");
    } catch (error) {
      if (String(error?.message || error).includes("SAG sidecar is unavailable")) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("SAG sidecar did not become healthy within 20 seconds");
};

const startSidecar = async ({ dataRoot, envFile, sagUrl, fetchImpl }) => {
  const url = new URL(sagUrl);
  if (!["127.0.0.1", "localhost", "::1"].includes(url.hostname)) {
    throw new Error("automatic SAG startup only supports a loopback URL");
  }
  const args = [
    "run", "--project", path.join(projectRoot, "rag", "sag"),
    "python", "-m", "bazi_sag", "serve",
    "--host", url.hostname,
    "--port", url.port || "8766",
    "--data-root", dataRoot,
  ];
  if (envFile && existsSync(envFile)) args.push("--env-file", envFile);
  const child = spawn("uv", args, {
    cwd: projectRoot,
    stdio: ["ignore", "ignore", "pipe"],
    env: { ...process.env, BAZI_SAG_DATA_ROOT: dataRoot },
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr = `${stderr}${chunk}`.slice(-2_000);
  });
  try {
    await waitForSidecar({ child, sagUrl, fetchImpl });
    return { child, stderr: () => stderr };
  } catch (error) {
    if (child.exitCode === null) child.kill("SIGTERM");
    const detail = redact(stderr.trim());
    throw new Error(redact(detail ? `${error.message}: ${detail}` : error.message));
  }
};

const stopSidecar = async (child) => {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
};

const fallbackReason = (health) => {
  if (health.state === "needs_config") return "official SAG model configuration is missing";
  if (health.state === "needs_index") return "official SAG index is missing";
  return health.sidecar.error || "official SAG sidecar is unavailable";
};

export const retrieveEvidence = async (options, dependencies = {}) => {
  const fetchImpl = dependencies.fetchImpl || globalThis.fetch;
  const compile = dependencies.compileCorpus || compileCorpus;
  const { documents, manifest } = await compile({
    knowledgeRoot: options.knowledgeRoot,
    outputDirectory: options.outputDirectory,
  });
  const baselineRetriever = createRetriever(documents);
  if (options.provider === "baseline") {
    return {
      ...baselineRetriever.retrieve(options),
      runtime: { providerRequested: "baseline", providerUsed: "baseline", sagAutoStarted: false },
      corpus: manifest,
    };
  }

  let sagHealth = await inspectSag({
    dataRoot: options.dataRoot,
    envFile: options.envFile,
    sagUrl: options.sagUrl,
    fetchImpl,
  });
  let managedSidecar = null;
  try {
    if (!sagHealth.officialSagActive && options.autoStart && sagHealth.officialSagReadyToStart) {
      const managed = await startSidecar({
        dataRoot: options.dataRoot,
        envFile: options.envFile,
        sagUrl: options.sagUrl,
        fetchImpl,
      });
      managedSidecar = managed.child;
      sagHealth = await inspectSag({
        dataRoot: options.dataRoot,
        envFile: options.envFile,
        sagUrl: options.sagUrl,
        fetchImpl,
      });
    }

    if (!sagHealth.officialSagActive) {
      const reason = fallbackReason(sagHealth);
      if (options.provider === "sag") {
        throw new CliError(
          `Official SAG is required but unavailable: ${reason}. ${sagHealth.nextAction}`,
        );
      }
      const baseline = baselineRetriever.retrieve(options);
      return {
        ...baseline,
        sag: { status: "not_configured", strategy: "full_expand", error: reason },
        runtime: { providerRequested: "auto", providerUsed: "baseline", sagAutoStarted: false },
        corpus: manifest,
      };
    }

    const retriever = createSagAugmentedRetriever({
      baselineRetriever,
      documents,
      sagUrl: options.sagUrl,
      fetchImpl,
    });
    const result = await retriever.retrieve(options);
    if (options.provider === "sag" && result.sag?.status !== "active") {
      throw new CliError(`Official SAG query failed: ${result.sag?.error || "unknown error"}`);
    }
    return {
      ...result,
      runtime: {
        providerRequested: options.provider,
        providerUsed: result.sag?.status === "active" ? "official-sag" : "baseline",
        sagAutoStarted: Boolean(managedSidecar),
      },
      corpus: manifest,
    };
  } finally {
    await stopSidecar(managedSidecar);
  }
};

const renderItem = (item) => {
  const location = `${item.path}:${item.lineStart || 1}`;
  const signals = item.retrievalSignals?.sag
    ? ` | SAG hop ${item.retrievalSignals.hop}`
    : "";
  return [
    `### ${item.title}`,
    `- 位置：\`${location}\``,
    `- 类型：${item.kind} | 分数：${item.score}${signals}`,
    item.claim ? `- 判断：${item.claim}` : "",
    item.preconditions ? `- 成立条件：${item.preconditions}` : "",
    item.exclusions ? `- 不成立或减轻：${item.exclusions}` : "",
    item.excerpt ? `- 摘录：${item.excerpt}` : "",
  ].filter(Boolean).join("\n");
};

export const formatMarkdown = (result) => {
  const groups = result.groups || {};
  const sections = [
    "# 本地八字证据检索",
    `- 问题：${result.query || ""}`,
    `- 阶段：${result.stage || ""}`,
    `- 实际检索器：${result.runtime?.providerUsed || result.retrievalMode || "unknown"}`,
    `- SAG 状态：${result.sag?.status || "disabled"}`,
    `- 案例：${result.policy?.casesIncluded ? "已显式启用，仅作校准" : "未启用"}`,
  ];
  if (result.sag?.status === "active") {
    sections.push(`- 动态图：${result.sag.graph?.nodeCount || 0} 节点，${result.sag.graph?.clueCount || 0} 条线索，最大 ${result.sag.maxHop || 0} 跳`);
  } else if (result.sag?.error) {
    sections.push(`- SAG 说明：${result.sag.error}`);
  }
  const labels = [
    ["exclusions", "排除与停止条件（必须先读）"],
    ["rules", "判断规则"],
    ["sources", "原文证据"],
    ["cases", "案例校准"],
  ];
  for (const [key, label] of labels) {
    const items = groups[key] || [];
    sections.push(`\n## ${label}\n`);
    sections.push(items.length ? items.map(renderItem).join("\n\n") : "无结果。\n");
  }
  return `${sections.join("\n")}\n`;
};

const usage = `用法：
  npm run bazi:retrieve -- --query "月令透干怎样定格" --stage pattern
  npm run sag:query -- --query "财格见印如何判断" --stage pattern
  npm run sag:doctor

选项：
  --provider auto|sag|baseline   sag 会强制要求官方 SAG 成功
  --stage intake|pattern|profile|topic|history|timing|delivery
  --limit 1..12
  --include-cases               仅在明确需要案例校准时启用
  --format json|markdown
  --no-start                    不自动启动已有索引的本地 SAG sidecar
`;

export const run = async (argv = process.argv.slice(2), io = console) => {
  const options = parseArguments(argv);
  if (options.help) {
    io.log(usage);
    return 0;
  }
  if (options.command === "health") {
    const health = await inspectSag(options);
    io.log(options.format === "markdown"
      ? `# SAG 状态\n\n- 状态：${health.state}\n- 官方 SAG 已激活：${health.officialSagActive ? "是" : "否"}\n- 配置：${health.config.llmConfigured && health.config.embeddingConfigured ? "完整" : "缺失"}\n- 索引：${health.index.active ? "可用" : "缺失"}\n- 下一步：${health.nextAction}\n`
      : JSON.stringify(health, null, 2));
    return health.officialSagActive ? 0 : 1;
  }
  const result = await retrieveEvidence(options);
  io.log(options.format === "markdown" ? formatMarkdown(result) : JSON.stringify(result, null, 2));
  return 0;
};

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  run().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(JSON.stringify({ error: redact(error.message), officialSagRequired: error instanceof CliError }, null, 2));
    process.exitCode = error.exitCode || 1;
  });
}
