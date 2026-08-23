import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CliError,
  formatMarkdown,
  inspectSag,
  parseArguments,
  retrieveEvidence,
} from "./codex-retrieve.mjs";

const ragRoot = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(ragRoot, "fixtures", "knowledge-base");

test("Codex retrieval arguments keep SAG strict and cases opt-in", () => {
  const options = parseArguments([
    "query", "--provider", "sag", "--stage", "pattern", "--include-cases", "月令透干怎样定格",
  ]);
  assert.equal(options.provider, "sag");
  assert.equal(options.includeCases, true);
  assert.equal(options.query, "月令透干怎样定格");
});

test("SAG health distinguishes missing personal configuration and index", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bazi-sag-health-"));
  try {
    const health = await inspectSag({
      dataRoot: directory,
      envFile: path.join(directory, ".env.sag"),
      fetchImpl: async () => { throw new Error("connection refused"); },
    });
    assert.equal(health.officialSagActive, false);
    assert.equal(health.index.active, false);
    assert.match(health.state, /^needs_(config|index)$/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("auto mode activates Codex SQL SAG without a second model endpoint", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bazi-sag-auto-"));
  try {
    const options = parseArguments([
      "query", "--query", "月令透干暗藏能不能立格",
      "--knowledge-root", fixtureRoot,
      "--output-directory", path.join(directory, "compiled"),
      "--data-root", path.join(directory, "sag"),
      "--env-file", path.join(directory, ".env.sag"),
    ]);
    const result = await retrieveEvidence(options);
    assert.equal(result.runtime.providerUsed, "codex-sql-sag");
    assert.equal(result.sag.status, "active");
    assert.equal(result.sag.official, false);
    assert.equal(result.sag.implementation, "codex-event-entity-sql");
    assert.equal(result.groups.exclusions[0].title, "排除规则总卡");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("strict SAG mode requires the Codex event-entity SQL engine", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bazi-sag-strict-"));
  try {
    const options = parseArguments([
      "query", "--provider", "sag", "--query", "月令透干怎样定格",
      "--knowledge-root", fixtureRoot,
      "--output-directory", path.join(directory, "compiled"),
      "--data-root", path.join(directory, "sag"),
      "--env-file", path.join(directory, ".env.sag"),
    ]);
    const result = await retrieveEvidence(options);
    assert.equal(result.sag.status, "active");
    assert.equal(result.runtime.providerUsed, "codex-sql-sag");
    assert.equal(result.neuralEmbeddings, false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("official zleap-sag remains an explicit optional provider", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bazi-sag-active-"));
  try {
    const options = parseArguments([
      "query", "--provider", "official-sag", "--query", "月令透干怎样定格",
      "--knowledge-root", fixtureRoot,
      "--output-directory", path.join(directory, "compiled"),
      "--data-root", path.join(directory, "sag"),
      "--env-file", path.join(directory, ".env.sag"),
    ]);
    const fetchImpl = async (url) => {
      if (url.endsWith("/v1/health")) {
        return { ok: true, status: 200, json: async () => ({ status: "ok", version: "0.10.0", strategy: "full_expand" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          version: "0.10.0",
          strategy: "full_expand",
          hits: [],
          graph: { nodeCount: 3, clueCount: 2, clues: [] },
        }),
      };
    };
    const result = await retrieveEvidence(options, { fetchImpl });
    assert.equal(result.runtime.providerUsed, "official-sag");
    assert.equal(result.sag.status, "active");
    assert.equal(result.sag.graph.nodeCount, 3);
    assert.match(formatMarkdown(result), /排除与停止条件（必须先读）/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("official zleap-sag mode rejects an unavailable sidecar", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bazi-official-sag-strict-"));
  try {
    const options = parseArguments([
      "query", "--provider", "official-sag", "--query", "月令透干怎样定格",
      "--knowledge-root", fixtureRoot,
      "--output-directory", path.join(directory, "compiled"),
      "--data-root", path.join(directory, "official-sag"),
      "--env-file", path.join(directory, ".env.sag"),
    ]);
    await assert.rejects(
      retrieveEvidence(options, { fetchImpl: async () => { throw new Error("connection refused"); } }),
      (error) => error instanceof CliError && /Official zleap-sag is required/.test(error.message),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
