import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { trimResult } from "./lib/retrieval.mjs";
import { createSqlSagRetriever } from "./lib/sql-sag-provider.mjs";

const makeDocument = ({ id, title, tags, kind = "rule", text }) => ({
  id,
  kind,
  title,
  path: `fixtures/${id}.md`,
  section: "",
  lineStart: 1,
  lineEnd: 1,
  module: "fixtures",
  category: "",
  flowTags: [],
  topicTags: tags,
  timeTags: [],
  objectTags: [],
  domainTags: [],
  sourcePaths: [],
  sourcePriority: null,
  claim: text,
  preconditions: "",
  exclusions: "",
  excerpt: text,
  text,
});

test("Codex SQL SAG follows a two-hop event-entity chain", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "codex-sql-sag-"));
  try {
    const acquisition = makeDocument({
      id: "acquisition",
      title: "收购关系",
      tags: ["A公司", "B公司"],
      text: "A公司全资收购B公司。",
    });
    const appointment = makeDocument({
      id: "appointment",
      title: "任命关系",
      tags: ["A公司", "张三", "CTO"],
      text: "张三被任命为A公司的CTO。",
    });
    const project = makeDocument({
      id: "project",
      title: "项目关系",
      tags: ["张三", "盘古项目"],
      text: "张三后来加入盘古项目。",
    });
    const exclusion = makeDocument({
      id: "exclusion",
      title: "排除规则总卡",
      tags: ["排除"],
      kind: "exclusion",
      text: "没有完整关系链时不能直接断。",
    });
    const documents = [acquisition, appointment, project, exclusion];
    const corpusPath = path.join(directory, "corpus.jsonl");
    const databasePath = path.join(directory, "index.sqlite");
    await writeFile(corpusPath, `${documents.map((item) => JSON.stringify(item)).join("\n")}\n`);

    const baselineRetriever = {
      retrieve: ({ query, stage = "pattern" }) => ({
        query,
        stage,
        retrievalMode: "fixture-baseline",
        neuralEmbeddings: false,
        policy: {
          exclusionsRequired: true,
          casesIncluded: false,
          casesAreCalibrationOnly: true,
          originalSourcesOverrideCards: true,
        },
        groups: {
          rules: [trimResult(acquisition, 1, ["B公司"])],
          exclusions: [trimResult(exclusion, 1, [])],
          sources: [],
          cases: [],
        },
      }),
    };
    const retriever = createSqlSagRetriever({
      baselineRetriever,
      documents,
      corpusPath,
      databasePath,
    });
    const result = await retriever.retrieve({
      query: "收购B公司的企业，其CTO后来加入哪个项目？",
      stage: "pattern",
      limit: 4,
    });

    const projectHit = result.groups.rules.find((item) => item.id === "project");
    assert.equal(result.sag.status, "active");
    assert.equal(result.sag.official, false);
    assert.equal(result.sag.strategy, "dynamic_sql_expand");
    assert.equal(projectHit?.retrievalSignals?.hop, 2);
    assert.ok(result.sag.graph.clues.some((clue) => clue.relation === "张三"));
    assert.equal(result.groups.exclusions[0].title, "排除规则总卡");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
