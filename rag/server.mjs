import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileCorpus } from "./lib/corpus.mjs";
import { createRetriever } from "./lib/retrieval.mjs";
import { createSagAugmentedRetriever } from "./lib/sag-provider.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const knowledgeRoot = path.resolve(process.env.BAZI_KB_ROOT || path.join(projectRoot, "..", "AI太牛逼了你知道吗"));
const outputDirectory = path.join(projectRoot, "rag", "generated");
const host = "127.0.0.1";
const port = Number(process.env.BAZI_RAG_PORT || 8765);
const providerMode = (process.env.BAZI_RAG_PROVIDER || "baseline").toLowerCase();
const sagUrl = process.env.BAZI_SAG_URL || "http://127.0.0.1:8766";
const allowedOrigins = new Set([
  "http://127.0.0.1:5173",
  "http://localhost:5173",
]);

const { documents, manifest } = await compileCorpus({ knowledgeRoot, outputDirectory });
const baselineRetriever = createRetriever(documents);
const sagRetriever = createSagAugmentedRetriever({ baselineRetriever, documents, sagUrl });
const useSag = providerMode === "sag" || providerMode === "hybrid";

const json = (response, status, body, origin = "") => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...(origin && allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
  });
  response.end(JSON.stringify(body));
};

const readJson = async (request) => {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error("request body is too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const server = createServer(async (request, response) => {
  const origin = request.headers.origin || "";
  if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: "origin is not allowed" });

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      Vary: "Origin",
    });
    return response.end();
  }

  if (request.method === "GET" && request.url === "/v1/health") {
    const sag = useSag ? await sagRetriever.health() : { status: "disabled" };
    return json(response, 200, {
      status: "ok",
      service: "bazi-local-rag",
      provider: useSag ? "hybrid" : "baseline",
      retrievalMode: useSag ? "sag-full-expand+guarded-baseline-v1" : "bm25+character-ngram-v1",
      neuralEmbeddings: useSag && sag.status === "ok",
      sag,
      manifest,
    }, origin);
  }

  if (request.method === "POST" && request.url === "/v1/retrieve") {
    try {
      const body = await readJson(request);
      const result = useSag ? await sagRetriever.retrieve(body) : baselineRetriever.retrieve(body);
      return json(response, 200, result, origin);
    } catch (error) {
      return json(response, 400, { error: error.message }, origin);
    }
  }

  return json(response, 404, { error: "not found" }, origin);
});

server.listen(port, host, () => {
  console.log(`Bazi local RAG is running at http://${host}:${port}`);
  console.log(`Provider: ${useSag ? `hybrid (${sagUrl})` : "baseline"}`);
  console.log(`Knowledge root: ${knowledgeRoot}`);
  console.log(`Objects: ${manifest.documentCount} ${JSON.stringify(manifest.counts)}`);
});
