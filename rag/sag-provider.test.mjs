import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { compileCorpus } from "./lib/corpus.mjs";
import { createRetriever } from "./lib/retrieval.mjs";
import { createSagAugmentedRetriever } from "./lib/sag-provider.mjs";

const ragRoot = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(ragRoot, "fixtures", "knowledge-base");
const { documents } = await compileCorpus({ knowledgeRoot: fixtureRoot });
const baselineRetriever = createRetriever(documents);

const fakeResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => payload,
});

test("SAG expansion is merged without weakening exclusions or case opt-in", async () => {
  const secondRule = documents.find((item) => item.kind === "rule" && item.title !== "格局总流程卡");
  const exclusion = documents.find((item) => item.kind === "exclusion");
  const caseDocument = documents.find((item) => item.kind === "case");
  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.includeCases, false);
    return fakeResponse({
      version: "0.10.0",
      strategy: "full_expand",
      hits: [
        { documentId: secondRule.id, eventId: "event-rule", score: 0.93, hop: 1, entities: ["月令"] },
        { documentId: exclusion.id, eventId: "event-exclusion", score: 0.88, hop: 1 },
        { documentId: caseDocument.id, eventId: "event-case", score: 0.99, hop: 1 },
      ],
      graph: { nodeCount: 5, clueCount: 3, clues: [] },
    });
  };
  const retriever = createSagAugmentedRetriever({ baselineRetriever, documents, fetchImpl });
  const result = await retriever.retrieve({ query: "月令透干怎样定格", stage: "pattern", limit: 4 });

  assert.equal(result.retrievalMode, "sag-full-expand+guarded-baseline-v1");
  assert.equal(result.neuralEmbeddings, true);
  assert.equal(result.sag.status, "active");
  assert.equal(result.sag.maxHop, 1);
  assert.ok(result.groups.rules.some((item) => item.id === secondRule.id));
  assert.equal(result.groups.exclusions[0].title, "排除规则总卡");
  assert.equal(result.groups.cases.length, 0);
  assert.ok(result.groups.sources.some((item) => item.path.endsWith("001-八格总论.md")));
});

test("SAG failure returns the deterministic baseline with an explicit fallback status", async () => {
  const retriever = createSagAugmentedRetriever({
    baselineRetriever,
    documents,
    fetchImpl: async () => { throw new Error("connection refused"); },
    timeoutMs: 50,
  });
  const result = await retriever.retrieve({ query: "月令透干", stage: "pattern", limit: 4 });

  assert.equal(result.retrievalMode, "bm25+character-ngram-v1");
  assert.equal(result.neuralEmbeddings, false);
  assert.equal(result.sag.status, "fallback");
  assert.equal(result.groups.exclusions[0].title, "排除规则总卡");
});
