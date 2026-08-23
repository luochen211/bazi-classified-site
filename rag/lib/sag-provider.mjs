import { trimResult } from "./retrieval.mjs";

const DEFAULT_TIMEOUT_MS = 70_000;

const safeError = (error) => String(error?.message || error || "SAG service is unavailable")
  .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
  .slice(0, 240);

const uniqueResults = (items, limit) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
};

const diversifiedSagResults = (items, limit) => {
  const direct = items.filter((item) => (item.retrievalSignals?.hop || 0) === 0);
  const expanded = items.filter((item) => (item.retrievalSignals?.hop || 0) > 0);
  if (expanded.length === 0) return uniqueResults(items, limit);
  const expandedQuota = Math.min(expanded.length, Math.max(1, Math.floor(limit / 3)));
  const directQuota = Math.max(0, limit - expandedQuota);
  return uniqueResults([
    ...direct.slice(0, directQuota),
    ...expanded.slice(0, expandedQuota),
    ...direct.slice(directQuota),
    ...expanded.slice(expandedQuota),
  ], limit);
};

const normalizedSagScore = (value, index) => {
  const score = Number(value);
  if (Number.isFinite(score) && score > 0) return Math.min(1, score);
  return Math.max(0.45, 0.95 - index * 0.04);
};

const linkedSources = (items, sourceDocuments) => {
  const paths = new Set(items.flatMap((item) => item.sourcePaths || []));
  const results = [];
  for (const sourcePath of paths) {
    const document = sourceDocuments.get(sourcePath);
    if (document) results.push(trimResult(document, 1, ["规则原文链接"]));
  }
  return results;
};

const mapSagHits = (hits, documentsById, includeCases) => (hits || [])
  .map((hit, index) => {
    const document = documentsById.get(hit.documentId);
    if (!document || document.kind === "source") return null;
    if (document.kind === "case" && !includeCases) return null;
    const result = trimResult(document, normalizedSagScore(hit.score, index), hit.entities || []);
    return {
      ...result,
      retrievalSignals: {
        sag: true,
        eventId: hit.eventId || "",
        hop: Number(hit.hop) || 0,
      },
    };
  })
  .filter(Boolean);

export const mergeSagPayload = ({
  baseline,
  documents,
  sagPayload,
  limit,
  includeCases,
  retrievalMode = "sag-full-expand+guarded-baseline-v1",
  neuralEmbeddings = true,
  implementation = "zleap-sag",
  official = true,
} = {}) => {
  const documentsById = new Map(documents.map((document) => [document.id, document]));
  const sourceDocuments = new Map();
  for (const document of documents) {
    if (document.kind === "source" && !sourceDocuments.has(document.path)) sourceDocuments.set(document.path, document);
  }

  const sagHits = mapSagHits(sagPayload.hits, documentsById, includeCases);
  const byKind = Map.groupBy(sagHits, (item) => item.kind);
  const sagRules = diversifiedSagResults(byKind.get("rule") || [], limit);
  const rules = uniqueResults([...sagRules, ...baseline.groups.rules], limit);
  const generalExclusion = baseline.groups.exclusions.find((item) => item.path.endsWith("排除规则总卡.md"));
  const exclusions = uniqueResults([
    generalExclusion,
    ...(byKind.get("exclusion") || []),
    ...baseline.groups.exclusions,
  ], Math.min(4, limit));
  const directSources = linkedSources([...rules, ...exclusions], sourceDocuments);
  const directSourcePaths = new Set(directSources.map((item) => item.path));
  const baselineDirectSources = baseline.groups.sources.filter((item) => directSourcePaths.has(item.path));
  const baselineDirectPaths = new Set(baselineDirectSources.map((item) => item.path));
  const sources = uniqueResults([
    ...baselineDirectSources,
    ...directSources.filter((item) => !baselineDirectPaths.has(item.path)),
    ...baseline.groups.sources,
  ], limit);
  const cases = includeCases
    ? uniqueResults([...(byKind.get("case") || []), ...baseline.groups.cases], Math.min(4, limit))
    : [];

  return {
    ...baseline,
    retrievalMode,
    neuralEmbeddings,
    policy: {
      ...baseline.policy,
      casesIncluded: includeCases,
    },
    sag: {
      status: "active",
      version: sagPayload.version || "unknown",
      strategy: sagPayload.strategy || "full_expand",
      implementation,
      official,
      hitCount: sagHits.length,
      maxHop: sagHits.reduce((maximum, item) => Math.max(maximum, item.retrievalSignals?.hop || 0), 0),
      matchedEntities: sagPayload.matchedEntities || [],
      graph: sagPayload.graph || { nodeCount: 0, clueCount: 0, clues: [] },
    },
    groups: { rules, exclusions, sources, cases },
  };
};

export const createSagAugmentedRetriever = ({
  baselineRetriever,
  documents,
  sagUrl = "http://127.0.0.1:8766",
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) => {
  if (!baselineRetriever?.retrieve) throw new Error("baselineRetriever is required");
  if (!Array.isArray(documents)) throw new Error("documents are required");

  const requestSag = async (pathname, options = {}, requestTimeoutMs = timeoutMs) => {
    const response = await fetchImpl(`${sagUrl}${pathname}`, {
      ...options,
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `SAG service returned ${response.status}`);
    return payload;
  };

  const retrieve = async (request = {}) => {
    const baseline = baselineRetriever.retrieve(request);
    const limit = Math.max(1, Math.min(Number(request.limit) || 6, 12));
    const includeCases = Boolean(request.includeCases);
    try {
      const sagPayload = await requestSag("/v1/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...request, limit: Math.min(48, limit * 4), includeCases }),
      });
      return mergeSagPayload({ baseline, documents, sagPayload, limit, includeCases });
    } catch (error) {
      return {
        ...baseline,
        sag: {
          status: "fallback",
          error: safeError(error),
          strategy: "full_expand",
        },
      };
    }
  };

  const health = async () => {
    try {
      return await requestSag("/v1/health", { headers: { Accept: "application/json" } }, Math.min(timeoutMs, 1_500));
    } catch (error) {
      return { status: "unavailable", error: safeError(error) };
    }
  };

  return { retrieve, health };
};
