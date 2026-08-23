---
name: bazi-sag-retrieval
description: Retrieve exclusion-first evidence from Luochen's local Bazi knowledge base through the official SAG event/entity index when available. Use when Codex needs local 八字 rules, original-source evidence, multi-hop clues, SAG status, or case calibration; use the separate bazi-reading workflow for the final chart judgment.
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

The default `auto` provider uses official SAG when its local index is active. Otherwise it returns the deterministic baseline with `sag.status=not_configured`; never describe that result as SAG retrieval.

When the user explicitly asks to use or verify SAG, require it:

```bash
npm --prefix /Volumes/Luochen/八字/bazi-classified-site run sag:query -- \
  --query "用户问题与已知命局条件" \
  --stage pattern \
  --format markdown
```

This command fails rather than silently falling back unless the official result reports `sag.status=active`.

## Evidence policy

- Read exclusions before rules and concrete conclusions.
- Treat original-source slices as higher authority than rule cards and cases.
- Do not pass `--include-cases` until the chart structure is established and case calibration is actually requested.
- Cases are analogy only, never primary proof.
- Cite returned local paths and line numbers in the final reasoning.
- If a multi-hop claim depends on SAG, report its hop/graph evidence. Do not invent a missing bridge.

## Diagnose official SAG

Run:

```bash
npm --prefix /Volumes/Luochen/八字/bazi-classified-site run sag:doctor
```

`active` means Codex can query official SAG immediately. `needs_config` requires a private or local OpenAI-compatible LLM and embedding endpoint in the ignored `.env.sag`. `needs_index` requires `npm run sag:index -- --env-file .env.sag`. Never paste credentials into chat or commit `.env.sag` or `rag/generated/`.
