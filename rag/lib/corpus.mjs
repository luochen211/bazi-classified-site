import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const INDEX_NAME_PATTERN = /(素材索引|总索引|逐文件审查索引|资料地图|知识卡片模板|整理进度|处理状态|README)/i;
const SOURCE_DIRECTORIES = new Set(["80-原文切片精细", "85-神煞原文拆分"]);
const RULE_DIRECTORIES = new Set([
  "10-格局判断",
  "20-命主画像",
  "30-六亲家庭",
  "40-过去应事",
  "50-未来流年大运",
  "60-专题断法",
]);

const FIELD_NAMES = ["分类", "流程标签", "主题标签", "时间标签", "对象标签", "领域标签"];
const SECTION_ALIASES = {
  claim: ["判断规则", "使用顺序", "总原则", "判断", "结论"],
  preconditions: ["成立条件", "适用条件"],
  exclusions: ["不成立或减轻条件", "直接排除", "排除规则", "排除", "使用提醒"],
};

const normalizePath = (value) => value.replaceAll("\\", "/").replace(/^\.\//, "");

const stableId = (...parts) => createHash("sha1").update(parts.join("\0")).digest("hex").slice(0, 16);

const splitValues = (value = "") => value
  .split(/[、,，/]/)
  .map((item) => item.trim())
  .filter(Boolean);

const stripMarkdown = (value = "") => value
  .replace(/<!--.*?-->/gs, " ")
  .replace(/<img\b[^>]*>/gi, " ")
  .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/^[-*+]\s+/gm, "")
  .replace(/^>\s?/gm, "")
  .replace(/\s+/g, " ")
  .trim();

const readField = (lines, name) => {
  const pattern = new RegExp(`^${name}\\s*[:：]\\s*(.*)$`);
  for (const line of lines) {
    const match = line.trim().match(pattern);
    if (match) return match[1].trim();
  }
  return "";
};

const parseSections = (lines) => {
  const sections = [];
  let current = null;

  lines.forEach((line, index) => {
    const heading = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (heading) {
      if (current) {
        current.lineEnd = index;
        current.text = current.lines.join("\n").trim();
        sections.push(current);
      }
      current = {
        heading: heading[2].trim(),
        level: heading[1].length,
        lineStart: index + 1,
        lineEnd: lines.length,
        lines: [],
        text: "",
      };
      return;
    }

    if (current) current.lines.push(line);
  });

  if (current) {
    current.text = current.lines.join("\n").trim();
    sections.push(current);
  }

  return sections;
};

const sectionText = (sections, aliases) => sections
  .filter((section) => aliases.some((alias) => section.heading.includes(alias)))
  .map((section) => stripMarkdown(section.text))
  .filter(Boolean)
  .join("\n");

const extractSourcePaths = (text, relativePath) => {
  const values = new Set();
  const add = (rawValue) => {
    const value = normalizePath(rawValue);
    if (/^(80-原文切片精细|85-神煞原文拆分|90-原始资料)\//.test(value)) values.add(value);
    else values.add(normalizePath(path.posix.normalize(path.posix.join(path.posix.dirname(relativePath), value))));
  };
  for (const match of text.matchAll(/`([^`]+\.md)`/g)) add(match[1]);
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+\.md)\)/g)) add(decodeURIComponent(match[1]));
  return [...values];
};

const classify = (relativePath) => {
  const [top] = relativePath.split("/");
  const fileName = path.basename(relativePath);

  if (top === "90-附件归档" || INDEX_NAME_PATTERN.test(fileName)) return "ignored";
  if (SOURCE_DIRECTORIES.has(top)) return "source";
  if (top === "70-案例库") return "case";
  if (relativePath.includes("排除") || relativePath.includes("误断") || relativePath.includes("误用")) return "exclusion";
  if (RULE_DIRECTORIES.has(top)) return "rule";
  if (top === "00-总索引" && /(工作台|流程|总卡|清单|对应卡)/.test(fileName)) return "rule";
  return "ignored";
};

const sourcePriority = (relativePath) => {
  if (relativePath.includes("/01-第一优先级/")) return 1;
  if (relativePath.includes("/02-第二优先级/")) return 2;
  if (relativePath.includes("/03-第三优先级/")) return 3;
  return null;
};

const chunkSource = ({ base, bodyLines, sections }) => {
  const chunks = [];
  const candidates = sections.length > 0
    ? sections.map((section) => ({
        heading: section.heading,
        lineStart: section.lineStart,
        lineEnd: section.lineEnd,
        text: section.text,
      }))
    : [{ heading: base.title, lineStart: 1, lineEnd: bodyLines.length, text: bodyLines.join("\n") }];

  for (const candidate of candidates) {
    const paragraphs = candidate.text.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
    let current = [];
    let length = 0;

    const flush = () => {
      const text = stripMarkdown(current.join("\n\n"));
      if (!text) return;
      chunks.push({
        ...base,
        id: stableId(base.path, candidate.heading, String(chunks.length)),
        section: candidate.heading,
        lineStart: candidate.lineStart,
        lineEnd: candidate.lineEnd,
        excerpt: text.slice(0, 1200),
        text: `${base.title} ${candidate.heading} ${text}`,
      });
      current = [];
      length = 0;
    };

    for (const paragraph of paragraphs) {
      if (length > 0 && length + paragraph.length > 2400) flush();
      current.push(paragraph);
      length += paragraph.length;
    }
    flush();
  }

  return chunks;
};

const parseDocument = (content, relativePath) => {
  const lines = content.replaceAll("\r\n", "\n").split("\n");
  const kind = classify(relativePath);
  if (kind === "ignored") return [];

  const title = lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, "").trim() || path.basename(relativePath, ".md");
  const sections = parseSections(lines);
  const metadata = Object.fromEntries(FIELD_NAMES.map((name) => [name, readField(lines, name)]));
  const flowTags = splitValues(metadata["流程标签"]);
  const topicTags = splitValues(metadata["主题标签"]);
  const sourceSection = sections.find((section) => section.heading.includes("原文出处"));
  const sourcePaths = extractSourcePaths(sourceSection?.text || content, relativePath);
  const claim = sectionText(sections, SECTION_ALIASES.claim);
  const preconditions = sectionText(sections, SECTION_ALIASES.preconditions);
  const exclusions = sectionText(sections, SECTION_ALIASES.exclusions);
  const cleaned = stripMarkdown(content.replace(/^---[\s\S]*?---\s*/, ""));
  const [top] = relativePath.split("/");
  const base = {
    id: stableId(relativePath),
    kind,
    title,
    path: normalizePath(relativePath),
    module: top,
    category: metadata["分类"],
    flowTags,
    topicTags,
    timeTags: splitValues(metadata["时间标签"]),
    objectTags: splitValues(metadata["对象标签"]),
    domainTags: splitValues(metadata["领域标签"]),
    sourcePaths,
    sourcePriority: sourcePriority(relativePath),
    claim,
    preconditions,
    exclusions,
    section: "",
    lineStart: 1,
    lineEnd: lines.length,
    excerpt: cleaned.slice(0, 1200),
    text: [title, Object.values(metadata).join(" "), claim, preconditions, exclusions, cleaned].filter(Boolean).join("\n"),
  };

  if (kind === "source") return chunkSource({ base, bodyLines: lines, sections });
  return [base];
};

const walkMarkdown = async (root) => {
  const files = [];
  const visit = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
    }
  };
  await visit(root);
  return files.sort((left, right) => left.localeCompare(right, "zh-CN"));
};

export const compileCorpus = async ({ knowledgeRoot, outputDirectory = null } = {}) => {
  if (!knowledgeRoot) throw new Error("knowledgeRoot is required");
  const files = await walkMarkdown(knowledgeRoot);
  const documents = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(knowledgeRoot, file));
    const content = await readFile(file, "utf8");
    documents.push(...parseDocument(content, relativePath));
  }

  const counts = documents.reduce((result, document) => {
    result[document.kind] = (result[document.kind] || 0) + 1;
    return result;
  }, {});
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    knowledgeRoot,
    sourceFileCount: files.length,
    documentCount: documents.length,
    counts,
    retrievalPolicy: {
      order: ["rule", "exclusion", "source", "case"],
      exclusionsRequired: true,
      casesRequireOptIn: true,
      originalSourcesOverrideCards: true,
    },
  };

  if (outputDirectory) {
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(path.join(outputDirectory, "corpus.jsonl"), `${documents.map((item) => JSON.stringify(item)).join("\n")}\n`);
    await writeFile(path.join(outputDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  }

  return { documents, manifest };
};

export const readCompiledCorpus = async (directory) => {
  const [corpus, manifest] = await Promise.all([
    readFile(path.join(directory, "corpus.jsonl"), "utf8"),
    readFile(path.join(directory, "manifest.json"), "utf8"),
  ]);
  return {
    documents: corpus.split("\n").filter(Boolean).map((line) => JSON.parse(line)),
    manifest: JSON.parse(manifest),
  };
};
