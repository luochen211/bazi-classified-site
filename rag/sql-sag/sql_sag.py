#!/usr/bin/env python3
"""Deterministic event-entity SQL graph for the personal Codex workflow."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

SCHEMA_VERSION = "codex-sql-sag-v1"
DEFAULT_KINDS = ("rule", "exclusion", "case")

LEXICON: dict[str, tuple[str, ...]] = {
    "heavenly_stem": tuple("甲乙丙丁戊己庚辛壬癸"),
    "earthly_branch": tuple("子丑寅卯辰巳午未申酉戌亥"),
    "five_element": ("金", "木", "水", "火", "土", "五行"),
    "ten_god": (
        "比肩", "劫财", "比劫", "食神", "伤官", "食伤", "正财", "偏财", "财星",
        "正官", "七杀", "官杀", "正印", "偏印", "枭神", "印星", "羊刃", "禄刃",
    ),
    "pattern": (
        "正官格", "七杀格", "财格", "正财格", "偏财格", "印格", "正印格", "偏印格",
        "食神格", "伤官格", "建禄格", "羊刃格", "从格", "专旺", "化格", "特殊格局",
        "普通格局", "格局", "成格", "破格", "立格", "不立格",
    ),
    "structure_condition": (
        "月令", "透干", "藏干", "暗藏", "本气", "余气", "根气", "通根", "得令", "得地",
        "得党", "天透地藏", "三合", "三会", "合会", "拱合", "四见", "刑冲合会", "冲刑",
        "制化", "通关", "顺用", "逆用", "混杂", "清纯", "救应",
    ),
    "strength_state": ("旺衰", "身强", "身弱", "从旺", "从弱", "强弱"),
    "useful_god": ("用神", "喜神", "忌神", "喜忌", "调候", "病药"),
    "relation_topic": (
        "事业", "感情", "婚姻", "财运", "健康", "学业", "官非", "房产", "贵人", "父母",
        "父亲", "母亲", "配偶", "丈夫", "妻子", "子女", "兄弟姐妹", "六亲", "性格",
    ),
    "time_trigger": ("大运", "流年", "流月", "运岁", "应期", "触发", "年限"),
    "evidence_kind": ("规则", "排除", "原文", "案例", "证据"),
}

GENERIC_ENTITIES = {
    "格局判断", "命主画像", "六亲家庭", "过去应事", "未来流年大运", "专题断法",
    "判断", "规则", "排除", "证据", "案例", "八字", "命理",
}


def normalize(value: str) -> str:
    return re.sub(r"[\s\W_]+", "", str(value or "").lower(), flags=re.UNICODE)


def read_corpus(path: Path) -> list[dict[str, Any]]:
    documents: list[dict[str, Any]] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            document = json.loads(line)
        except json.JSONDecodeError as error:
            raise ValueError(f"invalid corpus JSON at line {line_number}: {error}") from error
        if document.get("kind") in DEFAULT_KINDS:
            documents.append(document)
    return documents


def corpus_fingerprint(documents: list[dict[str, Any]]) -> str:
    digest = hashlib.sha256(SCHEMA_VERSION.encode())
    for document in sorted(documents, key=lambda item: item["id"]):
        digest.update(json.dumps(document, ensure_ascii=False, sort_keys=True).encode())
        digest.update(b"\n")
    return digest.hexdigest()


def classify_tag(value: str, field: str) -> str:
    for entity_type, terms in LEXICON.items():
        if value in terms:
            return entity_type
    if field == "flowTags":
        return "flow"
    if field == "timeTags":
        return "time_trigger"
    if field == "objectTags":
        return "relation_topic"
    return "topic"


def extract_entities(document: dict[str, Any]) -> list[tuple[str, str, str, float, int]]:
    found: dict[tuple[str, str], tuple[str, str, str, float, int]] = {}

    def add(name: str, entity_type: str, origin: str, weight: float) -> None:
        clean_name = str(name or "").strip().strip("、,，。；;：:")
        normalized = normalize(clean_name)
        if not normalized:
            return
        bridgeable = int(clean_name not in GENERIC_ENTITIES and entity_type not in {"flow", "evidence_kind"})
        key = (entity_type, normalized)
        candidate = (clean_name, entity_type, origin, weight, bridgeable)
        if key not in found or found[key][3] < weight:
            found[key] = candidate

    tag_fields = ("flowTags", "topicTags", "timeTags", "objectTags", "domainTags")
    for field in tag_fields:
        for value in document.get(field) or []:
            add(value, classify_tag(value, field), f"tag:{field}", 1.0)

    searchable = "\n".join(
        str(document.get(field) or "")
        for field in ("title", "claim", "preconditions", "exclusions", "excerpt", "text")
    )
    for entity_type, terms in LEXICON.items():
        for term in terms:
            if term in searchable:
                add(term, entity_type, "lexicon", 0.82)

    return list(found.values())


def initialize_schema(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        PRAGMA journal_mode = DELETE;
        PRAGMA synchronous = FULL;
        CREATE TABLE metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        CREATE TABLE events (
          id TEXT PRIMARY KEY,
          document_id TEXT NOT NULL UNIQUE,
          kind TEXT NOT NULL,
          title TEXT NOT NULL,
          path TEXT NOT NULL
        );
        CREATE TABLE entities (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          normalized_name TEXT NOT NULL,
          type TEXT NOT NULL,
          UNIQUE(type, normalized_name)
        );
        CREATE TABLE event_entities (
          event_id TEXT NOT NULL REFERENCES events(id),
          entity_id INTEGER NOT NULL REFERENCES entities(id),
          origin TEXT NOT NULL,
          weight REAL NOT NULL,
          bridgeable INTEGER NOT NULL,
          PRIMARY KEY(event_id, entity_id)
        );
        CREATE INDEX event_entities_entity_idx ON event_entities(entity_id, event_id);
        CREATE INDEX events_kind_idx ON events(kind);
        """
    )


def build_index(corpus_path: Path, database_path: Path) -> dict[str, Any]:
    documents = read_corpus(corpus_path)
    fingerprint = corpus_fingerprint(documents)
    if database_path.exists():
        try:
            with sqlite3.connect(database_path) as existing:
                current = existing.execute(
                    "SELECT value FROM metadata WHERE key = 'fingerprint'"
                ).fetchone()
                if current and current[0] == fingerprint:
                    counts = dict(existing.execute(
                        "SELECT key, CAST(value AS INTEGER) FROM metadata WHERE key LIKE '%Count'"
                    ).fetchall())
                    return {"status": "current", "fingerprint": fingerprint, **counts}
        except sqlite3.Error:
            pass

    database_path.parent.mkdir(parents=True, exist_ok=True)
    temporary = database_path.with_suffix(".tmp.sqlite")
    temporary.unlink(missing_ok=True)
    entity_count = 0
    relation_count = 0
    with sqlite3.connect(temporary) as connection:
        initialize_schema(connection)
        for document in documents:
            event_id = f"event:{document['id']}"
            connection.execute(
                "INSERT INTO events(id, document_id, kind, title, path) VALUES (?, ?, ?, ?, ?)",
                (event_id, document["id"], document["kind"], document["title"], document["path"]),
            )
            for name, entity_type, origin, weight, bridgeable in extract_entities(document):
                connection.execute(
                    "INSERT OR IGNORE INTO entities(name, normalized_name, type) VALUES (?, ?, ?)",
                    (name, normalize(name), entity_type),
                )
                entity_id = connection.execute(
                    "SELECT id FROM entities WHERE type = ? AND normalized_name = ?",
                    (entity_type, normalize(name)),
                ).fetchone()[0]
                connection.execute(
                    "INSERT OR REPLACE INTO event_entities(event_id, entity_id, origin, weight, bridgeable) VALUES (?, ?, ?, ?, ?)",
                    (event_id, entity_id, origin, weight, bridgeable),
                )
                relation_count += 1
        entity_count = connection.execute("SELECT COUNT(*) FROM entities").fetchone()[0]
        metadata = {
            "schemaVersion": SCHEMA_VERSION,
            "fingerprint": fingerprint,
            "eventCount": str(len(documents)),
            "entityCount": str(entity_count),
            "relationCount": str(relation_count),
        }
        connection.executemany("INSERT INTO metadata(key, value) VALUES (?, ?)", metadata.items())
        connection.commit()
    temporary.replace(database_path)
    return {
        "status": "built",
        "fingerprint": fingerprint,
        "eventCount": len(documents),
        "entityCount": entity_count,
        "relationCount": relation_count,
    }


def health(database_path: Path) -> dict[str, Any]:
    if not database_path.exists():
        return {"status": "missing", "engine": SCHEMA_VERSION}
    try:
        with sqlite3.connect(database_path) as connection:
            metadata = dict(connection.execute("SELECT key, value FROM metadata").fetchall())
        return {"status": "ok", "engine": SCHEMA_VERSION, **metadata}
    except sqlite3.Error as error:
        return {"status": "invalid", "engine": SCHEMA_VERSION, "error": str(error)}


def query_index(
    database_path: Path,
    query: str,
    seed_document_ids: list[str],
    include_cases: bool,
    limit: int,
    max_hops: int,
) -> dict[str, Any]:
    normalized_query = normalize(query)
    if not normalized_query:
        raise ValueError("query must not be empty")
    allowed_kinds = ("rule", "exclusion", "case") if include_cases else ("rule", "exclusion")
    kind_placeholders = ",".join("?" for _ in allowed_kinds)

    with sqlite3.connect(database_path) as connection:
        connection.row_factory = sqlite3.Row
        entity_rows = connection.execute(
            "SELECT id, name, normalized_name, type FROM entities ORDER BY LENGTH(normalized_name) DESC"
        ).fetchall()
        matched_entities = [
            row for row in entity_rows
            if row["normalized_name"] and row["normalized_name"] in normalized_query
        ]
        match_ids = {row["id"] for row in matched_entities}
        direct_event_ids: set[str] = set()
        if match_ids:
            minimum_matches = 2 if len(match_ids) > 1 else 1
            direct_event_ids = {
                row[0]
                for row in connection.execute(
                    f"""
                    SELECT ee.event_id, COUNT(*) AS overlap, SUM(ee.weight) AS evidence_weight
                    FROM event_entities ee
                    JOIN events e ON e.id = ee.event_id
                    WHERE ee.entity_id IN ({','.join('?' for _ in match_ids)})
                      AND e.kind IN ({kind_placeholders})
                    GROUP BY ee.event_id
                    HAVING COUNT(*) >= ?
                    ORDER BY overlap DESC, evidence_weight DESC, ee.event_id
                    LIMIT 16
                    """,
                    (*match_ids, *allowed_kinds, minimum_matches),
                ).fetchall()
            }
        seed_event_ids = {
            row[0]
            for document_id in seed_document_ids
            for row in connection.execute(
                f"SELECT id FROM events WHERE document_id = ? AND kind IN ({kind_placeholders})",
                (document_id, *allowed_kinds),
            ).fetchall()
        }
        seed_event_ids.update(direct_event_ids)
        if not seed_event_ids:
            return {
                "version": SCHEMA_VERSION,
                "strategy": "dynamic_sql_expand",
                "hits": [],
                "graph": {"nodeCount": 0, "clueCount": 0, "clues": []},
                "matchedEntities": [],
            }

        connection.execute("CREATE TEMP TABLE query_seeds(event_id TEXT PRIMARY KEY)")
        connection.executemany(
            "INSERT OR IGNORE INTO query_seeds(event_id) VALUES (?)",
            ((event_id,) for event_id in seed_event_ids),
        )
        walk_rows = connection.execute(
            f"""
            WITH RECURSIVE walk(event_id, hop, path, from_event_id, via_entity_id) AS (
              SELECT event_id, 0, ',' || event_id || ',', NULL, NULL
              FROM query_seeds
              UNION ALL
              SELECT target.event_id,
                     walk.hop + 1,
                     walk.path || target.event_id || ',',
                     walk.event_id,
                     source.entity_id
              FROM walk
              JOIN event_entities source
                ON source.event_id = walk.event_id AND source.bridgeable = 1
              JOIN event_entities target
                ON target.entity_id = source.entity_id
               AND target.event_id != walk.event_id
               AND target.bridgeable = 1
              JOIN events target_event ON target_event.id = target.event_id
              WHERE walk.hop < ?
                AND target_event.kind IN ({kind_placeholders})
                AND instr(walk.path, ',' || target.event_id || ',') = 0
                AND (SELECT COUNT(*) FROM event_entities fanout WHERE fanout.entity_id = source.entity_id) <= 8
            )
            SELECT event_id, hop, from_event_id, via_entity_id FROM walk
            ORDER BY hop ASC
            """,
            (max_hops, *allowed_kinds),
        ).fetchall()

        best: dict[str, sqlite3.Row] = {}
        for row in walk_rows:
            event_id = row["event_id"]
            if event_id not in best or row["hop"] < best[event_id]["hop"]:
                best[event_id] = row

        scored: list[tuple[float, int, str, sqlite3.Row]] = []
        for event_id, walk in best.items():
            event = connection.execute(
                "SELECT * FROM events WHERE id = ?", (event_id,)
            ).fetchone()
            overlap = connection.execute(
                f"SELECT COUNT(*) FROM event_entities WHERE event_id = ? AND entity_id IN ({','.join('?' for _ in match_ids)})",
                (event_id, *match_ids),
            ).fetchone()[0] if match_ids else 0
            seed_boost = 0.07 if event_id in seed_event_ids else 0
            direct_boost = 0.04 if event_id in direct_event_ids else 0
            score = max(0.42, 0.84 - (walk["hop"] * 0.14) + min(overlap, 4) * 0.035 + seed_boost + direct_boost)
            scored.append((score, walk["hop"], event["path"], event))
        scored.sort(key=lambda item: (-item[0], item[1], item[2]))

        direct_scored = [item for item in scored if item[1] == 0]
        expanded_scored = [item for item in scored if item[1] > 0]
        expanded_quota = min(len(expanded_scored), max(1, limit // 3))
        direct_quota = max(0, limit - expanded_quota)
        selected_scored = direct_scored[:direct_quota] + expanded_scored[:expanded_quota]
        if len(selected_scored) < limit:
            selected_ids = {item[3]["id"] for item in selected_scored}
            selected_scored.extend(
                item for item in scored
                if item[3]["id"] not in selected_ids
            )
        selected_scored = selected_scored[:limit]

        hits = []
        returned_events: set[str] = set()
        for score, hop, _, event in selected_scored:
            returned_events.add(event["id"])
            entities = [
                row[0]
                for row in connection.execute(
                    """
                    SELECT en.name
                    FROM event_entities ee JOIN entities en ON en.id = ee.entity_id
                    WHERE ee.event_id = ?
                    ORDER BY ee.weight DESC, LENGTH(en.name) DESC
                    LIMIT 12
                    """,
                    (event["id"],),
                ).fetchall()
            ]
            hits.append({
                "documentId": event["document_id"],
                "eventId": event["id"],
                "score": round(min(score, 1.0), 4),
                "hop": hop,
                "entities": entities,
                "engine": SCHEMA_VERSION,
            })

        visible_clues = []
        for event_id in returned_events:
            row = best[event_id]
            if not row["from_event_id"] or row["from_event_id"] not in returned_events:
                continue
            entity = connection.execute(
                "SELECT name, type FROM entities WHERE id = ?", (row["via_entity_id"],)
            ).fetchone()
            visible_clues.append({
                "stage": "sql_expand",
                "method": "shared_entity_join",
                "from": row["from_event_id"],
                "to": event_id,
                "hop": row["hop"],
                "relation": entity["name"],
                "entityType": entity["type"],
            })
        visible_clues.sort(key=lambda clue: (clue["hop"], clue["from"], clue["to"]))
        return {
            "version": SCHEMA_VERSION,
            "strategy": "dynamic_sql_expand",
            "hits": hits,
            "matchedEntities": [
                {"name": row["name"], "type": row["type"]} for row in matched_entities[:24]
            ],
            "graph": {
                "nodeCount": len(returned_events),
                "clueCount": len(visible_clues),
                "clues": visible_clues,
            },
        }


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description="Deterministic SQL SAG for Codex personal use")
    commands = root.add_subparsers(dest="command", required=True)

    index = commands.add_parser("index")
    index.add_argument("--corpus", type=Path, required=True)
    index.add_argument("--database", type=Path, required=True)

    query = commands.add_parser("query")
    query.add_argument("--database", type=Path, required=True)
    query.add_argument("--query", required=True)
    query.add_argument("--seed-ids", default="[]")
    query.add_argument("--include-cases", action="store_true")
    query.add_argument("--limit", type=int, default=24)
    query.add_argument("--max-hops", type=int, default=2)

    health_command = commands.add_parser("health")
    health_command.add_argument("--database", type=Path, required=True)
    return root


def main() -> None:
    args = parser().parse_args()
    try:
        if args.command == "index":
            result = build_index(args.corpus.resolve(), args.database.resolve())
        elif args.command == "health":
            result = health(args.database.resolve())
        else:
            seed_ids = json.loads(args.seed_ids)
            if not isinstance(seed_ids, list):
                raise ValueError("--seed-ids must be a JSON array")
            result = query_index(
                args.database.resolve(), args.query, [str(value) for value in seed_ids],
                args.include_cases, max(1, min(args.limit, 48)), max(0, min(args.max_hops, 4)),
            )
        print(json.dumps(result, ensure_ascii=False))
    except Exception as error:  # noqa: BLE001 - CLI boundary
        print(json.dumps({"error": f"{type(error).__name__}: {error}"}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1) from error


if __name__ == "__main__":
    main()
