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
`npm run build` also creates `dist/404.html` for GitHub Pages SPA fallback.

## Deployment

Pushing to `main` triggers GitHub Pages deployment from `.github/workflows/deploy.yml`.
