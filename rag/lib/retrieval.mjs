const STAGE_FLOW = {
  intake: "能不能断",
  pattern: "格局判断",
  profile: "命主画像",
  topic: "六亲家庭",
  history: "过去应事",
  timing: "未来流年大运",
  delivery: "人工定稿",
};

const STOP_WORDS = new Set(["的", "了", "和", "与", "是", "在", "为", "要", "如何", "怎么", "什么", "是否", "一个", "这个"]);

const normalizeText = (value = "") => value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();

const chineseNgrams = (text) => {
  const grams = [];
  for (const match of text.matchAll(/[\u3400-\u9fff]{2,}/g)) {
    const run = match[0];
    for (const size of [2, 3]) {
      for (let index = 0; index <= run.length - size; index += 1) grams.push(run.slice(index, index + size));
    }
  }
  return grams;
};

export const tokenize = (value) => {
  const text = normalizeText(value);
  const tokens = [];
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
  for (const segment of segmenter.segment(text)) {
    const token = segment.segment.trim();
    if (!segment.isWordLike || token.length < 2 || STOP_WORDS.has(token)) continue;
    tokens.push(token);
  }
  tokens.push(...chineseNgrams(text));
  return tokens.slice(0, 20_000);
};

const frequencies = (tokens) => {
  const values = new Map();
  for (const token of tokens) values.set(token, (values.get(token) || 0) + 1);
  return values;
};

const cosine = (left, right) => {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (const [key, value] of left) {
    leftNorm += value * value;
    dot += value * (right.get(key) || 0);
  }
  for (const value of right.values()) rightNorm += value * value;
  if (!leftNorm || !rightNorm) return 0;
  return dot / Math.sqrt(leftNorm * rightNorm);
};

const trimResult = (document, score, matchedTerms) => ({
  id: document.id,
  kind: document.kind,
  title: document.title,
  path: document.path,
  section: document.section,
  lineStart: document.lineStart,
  lineEnd: document.lineEnd,
  score: Number(Math.min(1, score).toFixed(4)),
  matchedTerms: matchedTerms.slice(0, 8),
  flowTags: document.flowTags,
  topicTags: document.topicTags,
  sourcePriority: document.sourcePriority,
  sourcePaths: document.sourcePaths,
  claim: document.claim,
  preconditions: document.preconditions,
  exclusions: document.exclusions,
  excerpt: document.excerpt,
});

const uniqueByPath = (items, limit) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (seen.has(item.item.document.path)) continue;
    seen.add(item.item.document.path);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
};

export const createRetriever = (documents) => {
  const indexed = documents.map((document) => {
    const tokens = tokenize(document.text);
    return { document, tokens, tf: frequencies(tokens), length: tokens.length };
  });
  const documentFrequency = new Map();
  for (const item of indexed) {
    for (const term of item.tf.keys()) documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
  }
  const averageLength = indexed.reduce((sum, item) => sum + item.length, 0) / Math.max(indexed.length, 1);
  const byKind = Map.groupBy(indexed, (item) => item.document.kind);

  const rank = (items, query, stage, boostPaths = new Set()) => {
    const queryTokens = tokenize(query);
    const queryTf = frequencies(queryTokens);
    const expectedFlow = STAGE_FLOW[stage] || "";
    const total = indexed.length;
    const scored = items.map((item) => {
      let bm25 = 0;
      const matched = [];
      for (const term of new Set(queryTokens)) {
        const tf = item.tf.get(term) || 0;
        if (!tf) continue;
        matched.push(term);
        const df = documentFrequency.get(term) || 0;
        const idf = Math.log(1 + (total - df + 0.5) / (df + 0.5));
        const denominator = tf + 1.2 * (1 - 0.75 + 0.75 * (item.length / Math.max(averageLength, 1)));
        bm25 += idf * ((tf * 2.2) / denominator);
      }
      const ngram = cosine(queryTf, item.tf);
      const flowBoost = expectedFlow && (
        item.document.flowTags.includes(expectedFlow)
        || item.document.module.includes(expectedFlow)
        || item.document.category.includes(expectedFlow)
      ) ? 0.28 : 0;
      const directSourceBoost = boostPaths.has(item.document.path) ? 0.6 : 0;
      const priorityBoost = item.document.kind === "source" && item.document.sourcePriority
        ? Math.max(0, 0.16 - ((item.document.sourcePriority - 1) * 0.05))
        : 0;
      return { item, bm25, ngram, flowBoost, directSourceBoost, priorityBoost, matched };
    });
    const maxBm25 = Math.max(...scored.map((item) => item.bm25), 1);
    return scored
      .map((item) => ({
        ...item,
        score: (item.bm25 / maxBm25) * 0.62 + item.ngram * 0.28 + item.flowBoost + item.directSourceBoost + item.priorityBoost,
      }))
      .filter((item) => item.score > 0 || item.directSourceBoost > 0)
      .sort((left, right) => right.score - left.score || left.item.document.path.localeCompare(right.item.document.path, "zh-CN"));
  };

  const retrieve = ({ query, stage = "pattern", limit = 6, includeCases = false } = {}) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) throw new Error("query must not be empty");
    const safeLimit = Math.max(1, Math.min(Number(limit) || 6, 12));

    const rules = rank(byKind.get("rule") || [], normalizedQuery, stage).slice(0, safeLimit);
    const exclusionsRanked = rank(byKind.get("exclusion") || [], normalizedQuery, stage);
    const generalExclusion = (byKind.get("exclusion") || []).find((item) => item.document.path.endsWith("排除规则总卡.md"));
    const exclusions = [];
    if (generalExclusion) exclusions.push({ item: generalExclusion, score: 1, matched: [] });
    for (const candidate of exclusionsRanked) {
      if (exclusions.some((item) => item.item.document.id === candidate.item.document.id)) continue;
      exclusions.push(candidate);
      if (exclusions.length >= Math.min(4, safeLimit)) break;
    }

    const directSourcePaths = new Set(rules.flatMap((item) => item.item.document.sourcePaths || []));
    const sources = uniqueByPath(rank(byKind.get("source") || [], normalizedQuery, stage, directSourcePaths), safeLimit);
    const cases = includeCases ? rank(byKind.get("case") || [], normalizedQuery, stage).slice(0, Math.min(4, safeLimit)) : [];

    const format = (items) => items.map((item) => trimResult(item.item.document, item.score, item.matched));
    return {
      query: normalizedQuery,
      stage,
      retrievalMode: "bm25+character-ngram-v1",
      neuralEmbeddings: false,
      generatedAt: new Date().toISOString(),
      policy: {
        exclusionsRequired: true,
        casesIncluded: includeCases,
        casesAreCalibrationOnly: true,
        originalSourcesOverrideCards: true,
      },
      groups: {
        rules: format(rules),
        exclusions: format(exclusions),
        sources: format(sources),
        cases: format(cases),
      },
    };
  };

  return { retrieve };
};
