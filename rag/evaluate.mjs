import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileCorpus } from "./lib/corpus.mjs";
import { createRetriever } from "./lib/retrieval.mjs";

const ragRoot = path.dirname(fileURLToPath(import.meta.url));
const useFixtures = process.argv.includes("--fixtures");
const knowledgeRoot = useFixtures
  ? path.join(ragRoot, "fixtures", "knowledge-base")
  : path.resolve(process.env.BAZI_KB_ROOT || path.join(ragRoot, "..", "..", "AI太牛逼了你知道吗"));
const evaluationPath = path.join(ragRoot, "evals", useFixtures ? "fixture.v1.json" : "pattern.v1.json");
const evaluation = JSON.parse(await readFile(evaluationPath, "utf8"));
const { documents } = await compileCorpus({ knowledgeRoot });
const retriever = createRetriever(documents);
const failures = [];
let expected = 0;
let recalled = 0;

for (const item of evaluation) {
  const result = retriever.retrieve({ query: item.query, stage: item.stage, limit: 10 });
  const rulePaths = new Set(result.groups.rules.map((entry) => entry.path));
  const exclusionPaths = new Set(result.groups.exclusions.map((entry) => entry.path));
  for (const target of item.expectedRulePaths || []) {
    expected += 1;
    if (rulePaths.has(target)) recalled += 1;
    else failures.push(`${item.id}: missing rule ${target}`);
  }
  for (const target of item.expectedExclusionPaths || []) {
    expected += 1;
    if (exclusionPaths.has(target)) recalled += 1;
    else failures.push(`${item.id}: missing exclusion ${target}`);
  }
  if (result.groups.cases.length > 0) failures.push(`${item.id}: cases appeared without opt-in`);
}

const recall = expected ? recalled / expected : 0;
console.log(`Evaluation: ${evaluation.length} queries, evidence recall@10 ${(recall * 100).toFixed(1)}%, cases opt-in enforced.`);
if (failures.length > 0 || recall < 1) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
