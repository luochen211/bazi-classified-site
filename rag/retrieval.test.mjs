import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { compileCorpus } from "./lib/corpus.mjs";
import { createRetriever } from "./lib/retrieval.mjs";

const ragRoot = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(ragRoot, "fixtures", "knowledge-base");
const { documents } = await compileCorpus({ knowledgeRoot: fixtureRoot });
const retriever = createRetriever(documents);

test("retrieval requires the general exclusion card and keeps cases opt-in", () => {
  const result = retriever.retrieve({ query: "月令透干暗藏能不能立格", stage: "pattern", limit: 4 });
  assert.equal(result.groups.rules[0].title, "格局总流程卡");
  assert.equal(result.groups.exclusions[0].title, "排除规则总卡");
  assert.equal(result.groups.cases.length, 0);
  assert.equal(result.policy.casesAreCalibrationOnly, true);
  assert.equal(result.neuralEmbeddings, false);
});

test("linked original sources are returned and cases require explicit calibration", () => {
  const result = retriever.retrieve({
    query: "月令透干根气旺衰",
    stage: "pattern",
    limit: 4,
    includeCases: true,
  });
  assert.ok(result.groups.sources.some((item) => item.path.endsWith("001-八格总论.md")));
  assert.ok(result.groups.cases.some((item) => item.title === "测试命例"));
});
