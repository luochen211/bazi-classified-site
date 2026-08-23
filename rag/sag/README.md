# Bazi SAG bridge

This directory integrates the official `zleap-sag==0.10.0` package as an optional, loopback-only retrieval sidecar for the personal workbench.

The bridge also constrains the transitive OpenAI SDK to `>=2,<3` and installs `httpx[socks]`. SAG 0.10.0 leaves the SDK unbounded, while the current 3.x line changes its HTTP transport. The compatibility constraint keeps the integration on the established API, and the SOCKS extra prevents client initialization from failing in macOS shells where Clash or another proxy sets `ALL_PROXY=socks5h://...`.

## Retrieval boundary

SAG contributes query-time event/entity expansion. It does not own the final evidence policy.

1. The existing compiler separates `rule`, `exclusion`, `source`, and `case` objects.
2. SAG searches its event/entity index and exposes the dynamic graph and hop depth.
3. The Node gateway maps SAG event hits back to the original compiled object IDs.
4. The gateway forces the general exclusion card, adds linked original-source slices, and rejects case hits unless the request explicitly enables cases.
5. Any SAG configuration, startup, indexing, or query failure returns the deterministic baseline with `sag.status="fallback"`.

This means a model or extraction mistake cannot silently remove the exclusion-first and original-source-first controls.

## Configuration

Install the pinned Python 3.12 environment:

```bash
npm run sag:setup
```

Copy the example to the ignored repository-root config and edit it locally:

```bash
cp rag/sag/config.example.env .env.sag
```

Required values are:

- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `LLM_MODEL` for event extraction and `full_expand` query selection;
- `EMBEDDING_API_KEY`, `EMBEDDING_BASE_URL`, and `EMBEDDING_MODEL` for chunk, event, and entity vectors;
- `SAG_STORAGE_MODE=normal` for the local SQLite + LanceDB schema.

The two endpoints may point at one gateway. A local server that does not enforce authentication may still require a non-empty placeholder key because the OpenAI-compatible client contract requires the field. Keep all real keys in `.env.sag`, which is ignored by Git.

## Build the event/entity index

Compile the private corpus and index formal rules plus exclusions:

```bash
npm run sag:index -- --env-file .env.sag
```

The active index is written to `rag/generated/sag/`. The bridge uses a content fingerprint and immutable index directory; a failed rebuild does not replace the previous active index. Changing the compiled content or the selected kinds produces a new index.

The active manifest records per-kind source, event, and empty-source counts. Review `emptySourceCount` after indexing: a non-zero value means the configured extraction model produced no usable event for at least one knowledge object, so that object remains available to the deterministic fallback but not to SAG expansion.

The bridge keeps event-entity vectors enabled. `full_expand` uses them to score which entity relations should become the next SQL expansion frontier; disabling them reduces indexing cost but leaves the dynamic expansion route without its relation-ranking index.

Default kinds:

```text
rule,exclusion
```

Explicit alternatives:

```bash
npm run sag:index -- --env-file .env.sag --kinds rule,exclusion,source
npm run sag:index -- --env-file .env.sag --kinds rule,exclusion,case
```

Indexing `source` is substantially more expensive because the current corpus contains many original-source chunks. `case` is excluded by default so case analogy cannot enter ordinary retrieval. Indexing a kind only makes it available; the workbench still sends `includeCases=false` unless the user enables calibration.

## Run

Start the official sidecar, guarded Node gateway, and Vite workbench together:

```bash
BAZI_SAG_ENV_FILE=.env.sag npm run dev:official-sag
```

Local endpoints:

- SAG sidecar health: `http://127.0.0.1:8766/v1/health`
- guarded retrieval health: `http://127.0.0.1:8765/v1/health`
- workbench: `http://127.0.0.1:5173/bazi-classified-site/workbench`

The bridge rejects non-loopback bind addresses. Do not expose it directly to a public network.

## Direct Codex use

Codex can use the official SAG index through a separate one-shot command; the workbench and a permanently running Node server are not required:

```bash
npm run sag:doctor
npm run sag:official:query -- --query "财格见印的成立与破格条件" --stage pattern --format markdown
```

The command probes the sidecar first. If the active index and model configuration exist but the sidecar is stopped, it starts the loopback-only bridge for that query and shuts it down afterward. Strict `sag:official:query` refuses to return another retrieval implementation as official SAG. Ordinary personal Codex use should use `sag:query`, which runs the model-free event-entity SQLite path documented in the root README.

## Fallback and comparison

Use the existing baseline alone:

```bash
npm run dev:rag
```

Use the official sidecar plus the baseline guardrails:

```bash
BAZI_SAG_ENV_FILE=.env.sag npm run dev:official-sag
```

The response reports one of these states:

- `sag.status="active"`: official SAG results were merged, `neuralEmbeddings=true`, and graph metadata is present;
- `sag.status="fallback"`: SAG failed or was not ready, and the response is the unchanged deterministic baseline;
- no `sag` field: the server was intentionally started in baseline mode.

Do not make SAG the only retrieval path until a fixed Chinese Bazi evaluation set shows better chain recall without worse exclusion hits, false bridges, source fidelity, or latency. The current `rag:evaluate` suite remains the deterministic regression gate.
