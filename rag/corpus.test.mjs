import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { compileCorpus, readCompiledCorpus } from "./lib/corpus.mjs";

const ragRoot = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(ragRoot, "fixtures", "knowledge-base");

test("compiler separates rules, exclusions, cases, and sources", async () => {
  const outputDirectory = await mkdtemp(path.join(tmpdir(), "bazi-rag-"));
  try {
    const { documents, manifest } = await compileCorpus({ knowledgeRoot: fixtureRoot, outputDirectory });
    assert.deepEqual(manifest.counts, { exclusion: 1, rule: 2, case: 1, source: 1 });
    assert.equal(documents.some((item) => item.title === "这个文件应被忽略"), false);

    const flowCard = documents.find((item) => item.title === "格局总流程卡");
    assert.equal(flowCard.kind, "rule");
    assert.match(flowCard.claim, /先看月令与透干/);
    assert.match(flowCard.exclusions, /暗藏十神/);
    assert.deepEqual(flowCard.sourcePaths, ["80-原文切片精细/01-第一优先级/教材/001-八格总论.md"]);

    const reloaded = await readCompiledCorpus(outputDirectory);
    assert.equal(reloaded.documents.length, documents.length);
    assert.equal(reloaded.manifest.retrievalPolicy.casesRequireOptIn, true);
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
