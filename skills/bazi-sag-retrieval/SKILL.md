---
name: bazi-sag-retrieval
description: Retrieve exclusion-first evidence from Luochen's local Bazi knowledge base through a Codex-native event-entity SQL graph. Use when Codex needs local 八字 rules, original-source evidence, multi-hop clues, SAG status, or case calibration; use the separate bazi-reading workflow for the final chart judgment.
---

# Bazi SAG Retrieval

Use the project command as Codex's retrieval tool:

`/Volumes/Luochen/八字/bazi-classified-site`

## Retrieve

Run this before making a Bazi judgment that depends on local evidence:

```bash
npm --prefix /Volumes/Luochen/八字/bazi-classified-site run bazi:retrieve -- \
  --query "用户问题与已知命局条件" \
  --stage pattern \
  --format markdown
```

Choose the smallest matching stage: `intake`, `pattern`, `profile`, `topic`, `history`, `timing`, or `delivery`.

The default `auto` provider builds or reuses the deterministic event-entity SQLite index, uses BM25 results as seeds, and expands shared entities with query-time SQL. Codex is the only reasoning model; no second LLM or embedding service is required.

When the user explicitly asks to use or verify SAG, require it:

```bash
npm --prefix /Volumes/Luochen/八字/bazi-classified-site run sag:query -- \
  --query "用户问题与已知命局条件" \
  --stage pattern \
  --format markdown
```

This command fails rather than silently falling back unless the result reports `sag.status=active`, `sag.implementation="codex-event-entity-sql"`, and `sag.official=false`.

## Evidence policy

- Read exclusions before rules and concrete conclusions.
- Treat original-source slices as higher authority than rule cards and cases.
- Do not pass `--include-cases` until the chart structure is established and case calibration is actually requested.
- Cases are analogy only, never primary proof.
- Cite returned local paths and line numbers in the final reasoning.
- If a multi-hop claim depends on SAG, report its hop/graph evidence. Do not invent a missing bridge.

## Diagnose

Run:

```bash
npm --prefix /Volumes/Luochen/八字/bazi-classified-site run sag:doctor
```

`个人 Codex SQL SAG：已激活` means the normal workflow is ready. The generated database is ignored under `rag/generated/sql-sag/` and is rebuilt when rule content changes.

Only use the official `zleap-sag` experiment when the user explicitly asks for that implementation:

```bash
npm --prefix /Volumes/Luochen/八字/bazi-classified-site run sag:official:query -- \
  --query "用户问题与已知命局条件" \
  --stage pattern \
  --format markdown
```

That optional sidecar requires separate OpenAI-compatible LLM and embedding endpoints. Never describe the current Codex session as such an endpoint, and never paste credentials into chat or commit `.env.sag` or `rag/generated/`.
