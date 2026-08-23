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

Useful commands:

```bash
npm run rag:compile
npm run rag:evaluate
npm run check:rag
```

Generated corpus files stay under `rag/generated/` and are ignored by Git so the private knowledge base is not published. Any future model generation must preserve source citations, exclusion-first retrieval, human review, and customer-data boundaries.

## Deployment

Pushing to `main` triggers GitHub Pages deployment from `.github/workflows/deploy.yml`.
