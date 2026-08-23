import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { mergeSagPayload } from "./sag-provider.mjs";

const execFileAsync = promisify(execFile);
const ragRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultScriptPath = path.join(ragRoot, "sql-sag", "sql_sag.py");
const safeError = (error) => String(error?.stderr || error?.message || error || "SQL SAG failed")
  .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
  .slice(0, 500);

const execute = async ({ pythonCommand, scriptPath, args, execImpl = execFileAsync }) => {
  const { stdout } = await execImpl(pythonCommand, [scriptPath, ...args], {
    maxBuffer: 8 * 1024 * 1024,
    timeout: 30_000,
  });
  const payload = JSON.parse(stdout);
  if (payload.error) throw new Error(payload.error);
  return payload;
};

export const createSqlSagRetriever = ({
  baselineRetriever,
  documents,
  corpusPath,
  databasePath,
  pythonCommand = process.env.BAZI_PYTHON || "python3",
  scriptPath = defaultScriptPath,
  execImpl = execFileAsync,
} = {}) => {
  if (!baselineRetriever?.retrieve) throw new Error("baselineRetriever is required");
  if (!Array.isArray(documents)) throw new Error("documents are required");
  if (!corpusPath || !databasePath) throw new Error("corpusPath and databasePath are required");
  let indexPromise = null;

  const ensureIndex = () => {
    if (!indexPromise) {
      indexPromise = execute({
        pythonCommand,
        scriptPath,
        execImpl,
        args: ["index", "--corpus", corpusPath, "--database", databasePath],
      }).catch((error) => {
        indexPromise = null;
        throw error;
      });
    }
    return indexPromise;
  };

  const retrieve = async (request = {}) => {
    const baseline = baselineRetriever.retrieve(request);
    const limit = Math.max(1, Math.min(Number(request.limit) || 6, 12));
    const includeCases = Boolean(request.includeCases);
    const seedIds = [
      ...baseline.groups.rules,
      ...baseline.groups.exclusions,
      ...(includeCases ? baseline.groups.cases : []),
    ].map((item) => item.id);
    try {
      await ensureIndex();
      const args = [
        "query",
        "--database", databasePath,
        "--query", String(request.query || ""),
        "--seed-ids", JSON.stringify(seedIds),
        "--limit", String(Math.min(48, limit * 4)),
        "--max-hops", String(Math.max(1, Math.min(Number(request.maxHops) || 2, 4))),
      ];
      if (includeCases) args.push("--include-cases");
      const sagPayload = await execute({ pythonCommand, scriptPath, args, execImpl });
      return mergeSagPayload({
        baseline,
        documents,
        sagPayload,
        limit,
        includeCases,
        retrievalMode: "sql-sag-dynamic-expand+guarded-baseline-v1",
        neuralEmbeddings: false,
        implementation: "codex-event-entity-sql",
        official: false,
      });
    } catch (error) {
      return {
        ...baseline,
        sag: {
          status: "fallback",
          strategy: "dynamic_sql_expand",
          implementation: "codex-event-entity-sql",
          official: false,
          error: safeError(error),
        },
      };
    }
  };

  const health = async () => {
    try {
      const index = await ensureIndex();
      const status = await execute({
        pythonCommand,
        scriptPath,
        execImpl,
        args: ["health", "--database", databasePath],
      });
      return {
        ...status,
        status: status.status === "ok" ? "ok" : status.status,
        service: "bazi-codex-sql-sag",
        strategy: "dynamic_sql_expand",
        implementation: "codex-event-entity-sql",
        official: false,
        index,
      };
    } catch (error) {
      return { status: "unavailable", error: safeError(error) };
    }
  };

  return { retrieve, health };
};
