# 八字分类占内容库

Vite + React single page site for a Bazi classified reading knowledge base.

## Source Rules

- `content/` is the source for Markdown documents.
- `public/content/` is generated from `content/` by `npm run sync:content`.
- `public/assets/` is the only committed publishable asset directory.
- Do not commit a root-level `assets/` copy; it is ignored to avoid duplicate image sources.

## Commands

```bash
npm run dev
npm run check
npm run build
```

`npm run check` verifies content sync, public asset references, key UI behavior, and production build.
`npm run build` also creates `dist/404.html` for GitHub Pages SPA fallback and a real `dist/workbench/index.html` entry so the workbench opens with a successful HTTP response.

## Personal workbench

`/workbench` is a local-first case review and delivery surface. Case data is stored in the current browser with `localStorage`; it is not uploaded by the static site. The workbench guides manual review, links back to source documents, creates stage-specific prompts, keeps validation feedback, and exports DOCX, print/PDF, Markdown, and JSON backups.

The hosted site does not upload case data or bundle the private knowledge base. The pattern stage can connect to the optional local RAG service when the workbench is opened through the local Vite server.

### Local evidence retrieval

Run the workbench and the loopback-only retrieval service together:

```bash
npm run dev:rag
```

Then open `http://127.0.0.1:5173/bazi-classified-site/workbench`, enter the four pillars and the pattern question, switch to `02 定格局与取用`, and use `检索正式规则与反证`.

The local service:

- reads `../AI太牛逼了你知道吗` without copying it into the public site;
- compiles formal rules, exclusion cards, original sources, and cases into separate retrieval objects;
- always returns the general exclusion card;
- follows rule cards back to original source slices;
- excludes cases unless the user explicitly enables case calibration;
- binds only to `127.0.0.1` and does not persist queries.

The first retrieval baseline uses BM25 plus Chinese character n-gram similarity. It is deliberately labeled as non-neural; BGE-M3 or another embedding model should only replace that component after the fixed evaluation set establishes a baseline.

### Optional SAG multi-hop retrieval

The local API can now add the official `zleap-sag` engine behind the same `/v1/retrieve` contract. SAG is an enhancement layer, not a replacement for the evidence policy:

- SAG indexes formal rule cards and exclusion cards as event/entity records;
- `full_expand` finds vector seeds, expands related events through SQL joins, and returns a query-time graph;
- the Node gateway always restores the general exclusion card, follows linked rules to original slices, and keeps cases opt-in;
- if SAG is unconfigured or unavailable, the request returns the deterministic BM25/character baseline instead of failing;
- the bridge and its SQLite/LanceDB data stay on `127.0.0.1` and under ignored `rag/generated/` paths.

Set up the pinned Python environment, configure local/private OpenAI-compatible LLM and embedding endpoints, build the index, and start the hybrid workbench:

```bash
npm run sag:setup
cp rag/sag/config.example.env .env.sag
# Edit .env.sag locally; never commit keys.
npm run sag:index -- --env-file .env.sag
BAZI_SAG_ENV_FILE=.env.sag npm run dev:sag
```

The default index intentionally includes only `rule,exclusion`. Original source slices remain in the deterministic evidence retriever, while cases remain outside SAG. To run a larger experiment, pass an explicit set such as `--kinds rule,exclusion,source`; only add `case` when you deliberately want case calibration available.

See `rag/sag/README.md` for configuration, indexing, health checks, fallback behavior, and A/B evaluation boundaries. The hosted GitHub Pages site contains only the workbench UI; it does not host the SAG service, model credentials, index, private corpus, or case queries.

Useful commands:

```bash
npm run rag:compile
npm run rag:evaluate
npm run check:rag
npm run sag:setup
npm run sag:index -- --env-file .env.sag
npm run dev:sag
```

### Use SAG directly from Codex

The repository includes a personal Codex retrieval skill under `skills/bazi-sag-retrieval/` and a one-shot CLI. Codex can retrieve evidence without opening the workbench UI:

```bash
npm run sag:doctor
npm run bazi:retrieve -- --query "月令透干怎样定格" --stage pattern --format markdown
npm run sag:query -- --query "月令透干怎样定格" --stage pattern --format markdown
```

`bazi:retrieve` prefers official SAG and reports an explicit baseline fallback when SAG is not configured. `sag:query` is strict: it exits with an error unless the official SAG sidecar is active and the response contains the query-time graph. If a valid local index exists but the sidecar is stopped, either command can start it for the duration of the query and stop it afterward.

This keeps the roles separate: Codex is the reasoning agent, while SAG is the local event/entity retrieval engine. A Codex subscription does not itself provide the OpenAI-compatible LLM and embedding endpoints required to build the SAG index; use a local/private model server or separately configured API endpoints.

Generated corpus files stay under `rag/generated/` and are ignored by Git so the private knowledge base is not published. Any future model generation must preserve source citations, exclusion-first retrieval, human review, and customer-data boundaries.

## Deployment

Pushing to `main` triggers GitHub Pages deployment from `.github/workflows/deploy.yml`.
