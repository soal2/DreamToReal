import sqlite3
from pathlib import Path

from app.core.config import settings


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS dream_records (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  organized_text TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  keywords_json TEXT NOT NULL DEFAULT '[]',
  emotions_json TEXT NOT NULL DEFAULT '[]',
  scenes_json TEXT NOT NULL DEFAULT '[]',
  source TEXT NOT NULL DEFAULT 'text',
  status TEXT NOT NULL DEFAULT 'organized',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
"""


def get_connection(database_path: Path | str | None = None) -> sqlite3.Connection:
    path = Path(database_path or settings.database_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(str(path))
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db(database_path: Path | str | None = None) -> None:
    with get_connection(database_path) as connection:
        connection.executescript(SCHEMA_SQL)

