import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileCorpus } from "./lib/corpus.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const knowledgeRoot = path.resolve(process.env.BAZI_KB_ROOT || path.join(projectRoot, "..", "AI太牛逼了你知道吗"));
const outputDirectory = path.resolve(process.env.BAZI_RAG_OUTPUT || path.join(projectRoot, "rag", "generated"));

const { manifest } = await compileCorpus({ knowledgeRoot, outputDirectory });
console.log(`Compiled ${manifest.documentCount} retrieval objects from ${manifest.sourceFileCount} Markdown files.`);
console.log(JSON.stringify(manifest.counts));
console.log(`Output: ${outputDirectory}`);
