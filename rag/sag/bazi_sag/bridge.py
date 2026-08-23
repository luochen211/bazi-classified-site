from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import os
import re
import sys
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import NAMESPACE_URL, uuid5

from aiohttp import web
from zleap.sag import DataEngine, EngineConfig, SagError
from zleap.sag import __version__ as SAG_VERSION
from zleap.sag.config import EntityTypeConfig
from zleap.sag.pipeline import (
    ChunkOptions,
    ExtractionExecutionOptions,
    ExtractionLimits,
    ExtractionOptions,
    IndexOptions,
    RelatedEventContextOptions,
    SearchOptions,
    SearchOutputOptions,
    SearchRequest,
    SearchScope,
    SourceDescriptor,
    SourceType,
    TextSource,
)

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_CORPUS_PATH = PROJECT_ROOT / "rag" / "generated" / "corpus.jsonl"
DEFAULT_DATA_ROOT = PROJECT_ROOT / "rag" / "generated" / "sag"
ACTIVE_MANIFEST = "active.json"
INDEX_REVISION = "bazi-events-v2"
ALLOWED_KINDS = ("rule", "exclusion", "source", "case")
DEFAULT_KINDS = ("rule", "exclusion")

ENTITY_TYPES = [
    EntityTypeConfig(
        type="heavenly_stem", name="天干", description="甲乙丙丁戊己庚辛壬癸"
    ),
    EntityTypeConfig(
        type="earthly_branch", name="地支", description="子丑寅卯辰巳午未申酉戌亥"
    ),
    EntityTypeConfig(
        type="five_element", name="五行", description="金木水火土及生克制化"
    ),
    EntityTypeConfig(type="ten_god", name="十神", description="比劫食伤财官杀印枭"),
    EntityTypeConfig(type="pattern", name="格局", description="格局名称与成败状态"),
    EntityTypeConfig(
        type="structure_condition",
        name="命局条件",
        description="月令透干根气制化等成立条件",
    ),
    EntityTypeConfig(
        type="strength_state", name="旺衰", description="身强身弱从旺从弱等状态"
    ),
    EntityTypeConfig(
        type="useful_god", name="取用", description="用神喜忌调候通关病药"
    ),
    EntityTypeConfig(
        type="relation_topic", name="专题", description="事业感情财运健康六亲学业等主题"
    ),
    EntityTypeConfig(
        type="time_trigger", name="运岁触发", description="大运流年流月与应期条件"
    ),
    EntityTypeConfig(
        type="evidence_kind", name="证据类型", description="规则排除原文案例与证据等级"
    ),
    EntityTypeConfig(
        type="exclusion_condition",
        name="排除条件",
        description="不成立减轻停止或不能直断的条件",
    ),
    EntityTypeConfig(
        type="bazi_concept", name="命理概念", description="其他稳定的八字判断概念"
    ),
]

EXTRACTION_PROMPT = """
这是八字判断知识卡，不是对某个当事人的命理结论。
1. 将每条独立判断规则、成立条件、不成立或减轻条件提取为完整事项，保留否定词和条件词。
2. 不得把“不能直断”改写成肯定结论，不得把案例现象升格为通用规则。
3. 优先提取能跨卡连接的稳定实体：天干、地支、十神、格局、旺衰、取用、运岁触发、专题与排除条件。
4. 知识对象 ID、本地路径和证据类型只用于溯源，不得虚构人物、年份或现实事件。
5. 如果内容仅是索引或没有可操作判断，少提取或不提取，不要凑数。
""".strip()


def _parse_env_file(path: Path | None) -> dict[str, str]:
    if path is None or not path.exists():
        return {}
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


@contextmanager
def _data_dir_override(data_dir: Path) -> Iterator[None]:
    previous = os.environ.get("SAG_DATA_DIR")
    os.environ["SAG_DATA_DIR"] = str(data_dir)
    try:
        yield
    finally:
        if previous is None:
            os.environ.pop("SAG_DATA_DIR", None)
        else:
            os.environ["SAG_DATA_DIR"] = previous


def load_engine_config(*, data_dir: Path, env_file: Path | None) -> EngineConfig:
    with _data_dir_override(data_dir):
        config = EngineConfig.from_env(env_file=str(env_file) if env_file else None)
    return config.model_copy(
        update={
            "entity_types": ENTITY_TYPES,
            "entity_types_mode": "append",
            "language": "zh",
        }
    )


def read_corpus(path: Path) -> list[dict[str, Any]]:
    documents = []
    for line_number, line in enumerate(
        path.read_text(encoding="utf-8").splitlines(), 1
    ):
        if not line.strip():
            continue
        try:
            document = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"invalid corpus JSON at line {line_number}: {exc}"
            ) from exc
        if document.get("kind") in ALLOWED_KINDS:
            documents.append(document)
    return documents


def corpus_fingerprint(documents: list[dict[str, Any]], kinds: tuple[str, ...]) -> str:
    digest = hashlib.sha256()
    digest.update(INDEX_REVISION.encode())
    digest.update("\0".join(kinds).encode())
    for document in documents:
        if document.get("kind") not in kinds:
            continue
        digest.update(json.dumps(document, ensure_ascii=False, sort_keys=True).encode())
        digest.update(b"\n")
    return digest.hexdigest()


def data_source_id(kind: str) -> str:
    return str(uuid5(NAMESPACE_URL, f"https://local.bazi.invalid/sag/{kind}"))


def source_id(document: dict[str, Any]) -> str:
    return f"bazi-{document['id']}"


def render_document(document: dict[str, Any]) -> str:
    def section(title: str, value: str) -> str:
        return f"\n## {title}\n\n{value.strip()}\n" if value and value.strip() else ""

    metadata = [
        f"- 知识对象 ID：{document['id']}",
        f"- 证据类型：{document['kind']}",
        f"- 本地路径：{document['path']}",
    ]
    tags = list(
        dict.fromkeys(
            [
                *(document.get("flowTags") or []),
                *(document.get("topicTags") or []),
                *(document.get("timeTags") or []),
                *(document.get("objectTags") or []),
                *(document.get("domainTags") or []),
            ]
        )
    )
    if tags:
        metadata.append(f"- 检索标签：{' / '.join(tags)}")

    content = [f"# {document['title']}", "", *metadata]
    content.append(section("判断规则", document.get("claim", "")))
    content.append(section("成立条件", document.get("preconditions", "")))
    content.append(section("不成立或减轻条件", document.get("exclusions", "")))
    content.append(section("证据摘录", document.get("excerpt", "")))
    source_paths = document.get("sourcePaths") or []
    if source_paths:
        content.append(
            section("原文溯源", "\n".join(f"- {value}" for value in source_paths))
        )
    return "\n".join(content).strip() + "\n"


def _extraction_options(concurrency: int) -> ExtractionOptions:
    return ExtractionOptions(
        custom_prompt=EXTRACTION_PROMPT,
        guidance_rules=(
            "保留条件、否定、减轻和不确定性。",
            "案例只能作为类比，不能作为规则证明。",
            "将同一概念使用稳定、可复用的实体名称。",
        ),
        contract="rich",
        limits=ExtractionLimits(
            max_events_per_chunk=8,
            min_entities_per_event=1,
            max_entities_per_event=12,
        ),
        related_events=RelatedEventContextOptions(enabled=False),
        execution=ExtractionExecutionOptions(
            max_concurrency=concurrency,
            write_entity_vectors=True,
            write_event_entity_vectors=True,
        ),
    )


async def build_index(
    *,
    corpus_path: Path,
    data_root: Path,
    env_file: Path | None,
    kinds: tuple[str, ...],
    concurrency: int,
) -> dict[str, Any]:
    documents = read_corpus(corpus_path)
    selected = [document for document in documents if document.get("kind") in kinds]
    if not selected:
        raise ValueError(f"no corpus objects found for kinds: {', '.join(kinds)}")

    fingerprint = corpus_fingerprint(documents, kinds)
    active_path = data_root / ACTIVE_MANIFEST
    if active_path.exists():
        active = json.loads(active_path.read_text(encoding="utf-8"))
        if active.get("fingerprint") == fingerprint:
            print(f"SAG index is current: {fingerprint[:12]} ({len(selected)} objects)")
            return active

    index_dir = data_root / "indexes" / fingerprint[:16]
    index_dir.mkdir(parents=True, exist_ok=True)
    config = load_engine_config(data_dir=index_dir, env_file=env_file)
    source_map: dict[str, dict[str, Any]] = {}
    kind_summary: dict[str, dict[str, Any]] = {}
    completed = 0
    progress_lock = asyncio.Lock()
    options = _extraction_options(concurrency)

    for kind in kinds:
        kind_documents = [
            document for document in selected if document.get("kind") == kind
        ]
        if not kind_documents:
            continue
        current_data_source = data_source_id(kind)
        kind_summary[kind] = {
            "dataSourceId": current_data_source,
            "sourceCount": len(kind_documents),
            "eventCount": 0,
            "emptySourceCount": 0,
        }
        semaphore = asyncio.Semaphore(concurrency)

        async with DataEngine(config, data_source_id=current_data_source) as engine:

            async def process(
                document: dict[str, Any],
                current_data_source: str = current_data_source,
                semaphore: asyncio.Semaphore = semaphore,
                engine: DataEngine = engine,
                kind: str = kind,
            ) -> None:
                nonlocal completed
                current_source = source_id(document)
                descriptor = SourceDescriptor(
                    data_source_id=current_data_source,
                    source_type=SourceType.TEXT,
                    source_id=current_source,
                    external_id=document["id"],
                    title=document["title"],
                    metadata={
                        "document_id": document["id"],
                        "kind": document["kind"],
                        "path": document["path"],
                    },
                )
                async with semaphore:
                    chunks = await engine.ingest(
                        TextSource(
                            text=render_document(document), descriptor=descriptor
                        ),
                        chunk_options=ChunkOptions(
                            strategy="heading_strict", max_tokens=800
                        ),
                        index_options=IndexOptions(replace_policy="reuse_if_same"),
                    )
                    events = await engine.extract(chunks, options)
                source_map[current_source] = {
                    "documentId": document["id"],
                    "kind": document["kind"],
                    "path": document["path"],
                    "title": document["title"],
                    "chunkCount": chunks.chunk_count,
                    "eventCount": events.event_count,
                }
                async with progress_lock:
                    completed += 1
                    kind_summary[kind]["eventCount"] += events.event_count
                    if events.event_count == 0:
                        kind_summary[kind]["emptySourceCount"] += 1
                    if (
                        completed == 1
                        or completed % 10 == 0
                        or completed == len(selected)
                    ):
                        print(
                            f"Indexed {completed}/{len(selected)} objects",
                            file=sys.stderr,
                        )

            await asyncio.gather(*(process(document) for document in kind_documents))

    manifest = {
        "schemaVersion": 1,
        "bridgeVersion": "0.1.0",
        "sagVersion": SAG_VERSION,
        "indexRevision": INDEX_REVISION,
        "fingerprint": fingerprint,
        "indexedAt": datetime.now(UTC).isoformat(),
        "indexDirectory": str(index_dir),
        "corpusPath": str(corpus_path),
        "kinds": kind_summary,
        "sources": source_map,
    }
    data_root.mkdir(parents=True, exist_ok=True)
    temporary = active_path.with_suffix(".tmp")
    temporary.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary.replace(active_path)
    print(f"Activated SAG index {fingerprint[:12]} with {len(source_map)} objects")
    return manifest


def _public_error(error: BaseException) -> str:
    value = f"{type(error).__name__}: {error}"
    value = re.sub(r"sk-[A-Za-z0-9_-]+", "[redacted]", value)
    return value[:500]


class SagService:
    def __init__(
        self, *, data_root: Path, env_file: Path | None, strategy: str
    ) -> None:
        self.data_root = data_root
        self.env_file = env_file
        self.strategy = strategy
        self.manifest: dict[str, Any] | None = None
        self.engine: DataEngine | None = None
        self.error: str | None = None

    async def start(self) -> None:
        engine: DataEngine | None = None
        try:
            active_path = self.data_root / ACTIVE_MANIFEST
            if not active_path.exists():
                raise FileNotFoundError(
                    "SAG index is missing; run npm run sag:index first"
                )
            self.manifest = json.loads(active_path.read_text(encoding="utf-8"))
            index_dir = Path(self.manifest["indexDirectory"])
            config = load_engine_config(data_dir=index_dir, env_file=self.env_file)
            engine = DataEngine(config)
            await engine.start()
            self.engine = engine
        except Exception as error:  # noqa: BLE001 - keep health available for diagnosis
            if engine is not None:
                await engine.aclose()
            self.error = _public_error(error)
            self.engine = None

    async def close(self) -> None:
        if self.engine is not None:
            await self.engine.aclose()

    def health_payload(self) -> dict[str, Any]:
        if self.engine is None or self.manifest is None:
            return {
                "status": "unavailable",
                "service": "bazi-sag-bridge",
                "version": SAG_VERSION,
                "strategy": self.strategy,
                "error": self.error or "SAG bridge is not initialized",
            }
        return {
            "status": "ok",
            "service": "bazi-sag-bridge",
            "version": SAG_VERSION,
            "strategy": self.strategy,
            "fingerprint": self.manifest["fingerprint"],
            "kinds": self.manifest["kinds"],
        }

    async def retrieve(self, payload: dict[str, Any]) -> dict[str, Any]:
        if self.engine is None or self.manifest is None:
            raise web.HTTPServiceUnavailable(
                text=json.dumps(
                    {"error": self.error or "SAG is unavailable"}, ensure_ascii=False
                ),
                content_type="application/json",
            )
        query = str(payload.get("query") or "").strip()
        if not query:
            raise web.HTTPBadRequest(
                text=json.dumps({"error": "query must not be empty"}),
                content_type="application/json",
            )
        limit = max(1, min(int(payload.get("limit") or 24), 48))
        include_cases = bool(payload.get("includeCases"))
        kinds = ["rule", "exclusion"]
        if include_cases:
            kinds.append("case")
        data_sources = tuple(
            self.manifest["kinds"][kind]["dataSourceId"]
            for kind in kinds
            if kind in self.manifest["kinds"]
        )
        if not data_sources:
            raise web.HTTPServiceUnavailable(
                text=json.dumps({"error": "active SAG index has no searchable kinds"}),
                content_type="application/json",
            )

        result = await self.engine.search(
            SearchRequest(
                query=query,
                scope=SearchScope(data_source_ids=data_sources),
                options=SearchOptions(
                    strategy=self.strategy,
                    top_k=limit,
                    return_type="event",
                    output=SearchOutputOptions(
                        return_graph=True,
                        return_paths=True,
                        include_stage_stats=True,
                    ),
                ),
            )
        )
        graph = result.graph
        hops: dict[str, int] = {}
        clues: list[dict[str, Any]] = []
        if hasattr(graph, "nodes"):
            for node in graph.nodes:
                hops[node.id] = node.hop
                if node.event_id:
                    hops[node.event_id] = node.hop
            for clue in graph.clues[:100]:
                clues.append(
                    {
                        "stage": clue.stage,
                        "method": clue.method,
                        "from": clue.from_id,
                        "to": clue.to_id,
                        "hop": clue.hop,
                        "relation": clue.relation,
                    }
                )

        hits: list[dict[str, Any]] = []
        seen_documents: set[str] = set()
        for hit in result.events:
            source = self.manifest["sources"].get(hit.source_id or "")
            if not source or source["documentId"] in seen_documents:
                continue
            seen_documents.add(source["documentId"])
            hits.append(
                {
                    "documentId": source["documentId"],
                    "eventId": hit.id,
                    "score": hit.score,
                    "hop": hops.get(hit.id, 0),
                }
            )

        return {
            "version": SAG_VERSION,
            "strategy": self.strategy,
            "hits": hits,
            "graph": {
                "nodeCount": len(graph.nodes) if hasattr(graph, "nodes") else 0,
                "clueCount": len(graph.clues) if hasattr(graph, "clues") else 0,
                "clues": clues,
            },
        }


def create_app(service: SagService) -> web.Application:
    app = web.Application(client_max_size=64 * 1024)

    async def startup(_: web.Application) -> None:
        await service.start()

    async def cleanup(_: web.Application) -> None:
        await service.close()

    async def health(_: web.Request) -> web.Response:
        return web.json_response(service.health_payload())

    async def retrieve(request: web.Request) -> web.Response:
        try:
            payload = await request.json()
            if not isinstance(payload, dict):
                raise TypeError("request body must be an object")
            return web.json_response(await service.retrieve(payload))
        except web.HTTPException:
            raise
        except (SagError, ValueError, TypeError) as error:
            return web.json_response({"error": _public_error(error)}, status=400)
        except Exception as error:  # noqa: BLE001 - HTTP boundary sanitizes unexpected errors
            return web.json_response({"error": _public_error(error)}, status=500)

    app.on_startup.append(startup)
    app.on_cleanup.append(cleanup)
    app.router.add_get("/v1/health", health)
    app.router.add_post("/v1/retrieve", retrieve)
    return app


def _parse_kinds(value: str) -> tuple[str, ...]:
    kinds = tuple(
        dict.fromkeys(item.strip().lower() for item in value.split(",") if item.strip())
    )
    invalid = [kind for kind in kinds if kind not in ALLOWED_KINDS]
    if invalid:
        raise argparse.ArgumentTypeError(f"unsupported kinds: {', '.join(invalid)}")
    if not kinds:
        raise argparse.ArgumentTypeError("at least one kind is required")
    return kinds


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(
        description="Local SAG index and bridge for the Bazi workbench"
    )
    commands = root.add_subparsers(dest="command", required=True)

    index = commands.add_parser(
        "index", help="build and activate a SAG event/entity index"
    )
    index.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS_PATH)
    index.add_argument(
        "--data-root",
        type=Path,
        default=Path(os.environ.get("BAZI_SAG_DATA_ROOT", DEFAULT_DATA_ROOT)),
    )
    index.add_argument(
        "--env-file",
        type=Path,
        default=Path(os.environ["BAZI_SAG_ENV_FILE"])
        if os.environ.get("BAZI_SAG_ENV_FILE")
        else None,
    )
    index.add_argument("--kinds", type=_parse_kinds, default=DEFAULT_KINDS)
    index.add_argument(
        "--concurrency",
        type=int,
        default=int(os.environ.get("BAZI_SAG_INDEX_CONCURRENCY", "2")),
    )

    serve = commands.add_parser(
        "serve", help="serve the loopback-only SAG retrieval bridge"
    )
    serve.add_argument("--host", default="127.0.0.1")
    serve.add_argument(
        "--port", type=int, default=int(os.environ.get("BAZI_SAG_PORT", "8766"))
    )
    serve.add_argument(
        "--data-root",
        type=Path,
        default=Path(os.environ.get("BAZI_SAG_DATA_ROOT", DEFAULT_DATA_ROOT)),
    )
    serve.add_argument(
        "--env-file",
        type=Path,
        default=Path(os.environ["BAZI_SAG_ENV_FILE"])
        if os.environ.get("BAZI_SAG_ENV_FILE")
        else None,
    )
    serve.add_argument(
        "--strategy", default=os.environ.get("BAZI_SAG_SEARCH_STRATEGY", "full_expand")
    )
    return root


def main() -> None:
    args = parser().parse_args()
    if args.command == "index":
        if args.concurrency < 1 or args.concurrency > 16:
            raise SystemExit("--concurrency must be between 1 and 16")
        asyncio.run(
            build_index(
                corpus_path=args.corpus.resolve(),
                data_root=args.data_root.resolve(),
                env_file=args.env_file.resolve() if args.env_file else None,
                kinds=args.kinds,
                concurrency=args.concurrency,
            )
        )
        return

    if args.host not in {"127.0.0.1", "localhost", "::1"}:
        raise SystemExit("the personal SAG bridge may only bind to a loopback host")
    service = SagService(
        data_root=args.data_root.resolve(),
        env_file=args.env_file.resolve() if args.env_file else None,
        strategy=args.strategy,
    )
    web.run_app(create_app(service), host=args.host, port=args.port, print=None)
