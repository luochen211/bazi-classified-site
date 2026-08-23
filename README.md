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

The current site does not run an Agent or a production RAG service. The prompt action only copies structured context so the user can choose where to process it. Any future model integration must preserve source citations, human review, and customer-data boundaries.

## Deployment

Pushing to `main` triggers GitHub Pages deployment from `.github/workflows/deploy.yml`.
