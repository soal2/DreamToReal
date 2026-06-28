from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.core.config import settings
from app.core.database import get_connection
from app.models.dream import DreamRecord, utc_now_iso


class DreamRepository:
    def __init__(self, database_path: Path | str | None = None) -> None:
        self.database_path = Path(database_path or settings.database_path)

    def create(self, record: DreamRecord) -> DreamRecord:
        with get_connection(self.database_path) as connection:
            connection.execute(
                """
                INSERT INTO dream_records (
                  id, title, raw_text, organized_text, image_prompt, image_url,
                  keywords_json, emotions_json, scenes_json, source, status,
                  created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record.id,
                    record.title,
                    record.raw_text,
                    record.organized_text,
                    record.image_prompt,
                    record.image_url,
                    self._dump_list(record.keywords),
                    self._dump_list(record.emotions),
                    self._dump_list(record.scenes),
                    record.source,
                    record.status,
                    record.created_at,
                    record.updated_at,
                ),
            )
        return record

    def bulk_create(self, records: list[DreamRecord]) -> None:
        for record in records:
            self.create(record)

    def get_by_id(self, dream_id: str) -> DreamRecord | None:
        with get_connection(self.database_path) as connection:
            row = connection.execute(
                "SELECT * FROM dream_records WHERE id = ?",
                (dream_id,),
            ).fetchone()
        return self._row_to_record(row) if row else None

    def list(self, limit: int = 20, offset: int = 0) -> tuple[list[DreamRecord], int]:
        with get_connection(self.database_path) as connection:
            total = connection.execute("SELECT COUNT(*) FROM dream_records").fetchone()[0]
            rows = connection.execute(
                """
                SELECT * FROM dream_records
                ORDER BY created_at DESC, id DESC
                LIMIT ? OFFSET ?
                """,
                (limit, offset),
            ).fetchall()
        return [self._row_to_record(row) for row in rows], total

    def update(self, dream_id: str, patch: dict[str, Any]) -> DreamRecord | None:
        allowed = {
            "title",
            "raw_text",
            "organized_text",
            "image_prompt",
            "image_url",
            "keywords",
            "emotions",
            "scenes",
            "source",
            "status",
        }
        assignments: list[str] = []
        values: list[Any] = []
        for key, value in patch.items():
            if key not in allowed:
                continue
            column = self._column_for_field(key)
            assignments.append(f"{column} = ?")
            values.append(self._dump_list(value) if key in {"keywords", "emotions", "scenes"} else value)
        assignments.append("updated_at = ?")
        values.append(utc_now_iso())
        values.append(dream_id)

        with get_connection(self.database_path) as connection:
            connection.execute(
                f"UPDATE dream_records SET {', '.join(assignments)} WHERE id = ?",
                values,
            )
        return self.get_by_id(dream_id)

    def delete(self, dream_id: str) -> bool:
        with get_connection(self.database_path) as connection:
            cursor = connection.execute("DELETE FROM dream_records WHERE id = ?", (dream_id,))
        return cursor.rowcount > 0

    def count(self) -> int:
        with get_connection(self.database_path) as connection:
            return connection.execute("SELECT COUNT(*) FROM dream_records").fetchone()[0]

    def _row_to_record(self, row) -> DreamRecord:
        return DreamRecord(
            id=row["id"],
            title=row["title"],
            raw_text=row["raw_text"],
            organized_text=row["organized_text"],
            image_prompt=row["image_prompt"],
            image_url=row["image_url"],
            keywords=self._load_list(row["keywords_json"]),
            emotions=self._load_list(row["emotions_json"]),
            scenes=self._load_list(row["scenes_json"]),
            source=row["source"],
            status=row["status"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )

    def _column_for_field(self, field: str) -> str:
        if field in {"keywords", "emotions", "scenes"}:
            return f"{field}_json"
        return field

    def _dump_list(self, values: list[str]) -> str:
        return json.dumps(values, ensure_ascii=False)

    def _load_list(self, value: str) -> list[str]:
        loaded = json.loads(value or "[]")
        return loaded if isinstance(loaded, list) else []

