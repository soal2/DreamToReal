#!/usr/bin/env python3
"""Initialize the Dream to Real SQLite database.

Usage:
  PYTHONPATH=backend python3 backend/scripts/init_db.py
  PYTHONPATH=backend python3 backend/scripts/init_db.py --database /path/to/dream_to_real.sqlite3
  PYTHONPATH=backend python3 backend/scripts/init_db.py --seed-demo-data
"""

import argparse
import sqlite3
from pathlib import Path

from app.core.config import settings
from app.core.database import init_db
from app.data.seed_dreams import seed_demo_dreams
from app.repositories.dream_repository import DreamRepository
from app.storage.image_storage import ImageStorage


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create Dream to Real SQLite tables.")
    parser.add_argument(
        "--database",
        type=Path,
        default=settings.database_path,
        help=f"SQLite database path. Default: {settings.database_path}",
    )
    parser.add_argument(
        "--seed-demo-data",
        action="store_true",
        help="Insert demo DreamRecord rows when the database is empty.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    database_path = args.database.resolve()
    init_db(database_path)

    if args.seed_demo_data:
        storage = ImageStorage()
        storage.ensure_mock_assets()
        seed_demo_dreams(DreamRepository(database_path), storage)

    print(f"SQLite database: {database_path}")
    print("Tables:")
    with sqlite3.connect(database_path) as connection:
        tables = connection.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
        ).fetchall()
        for (table_name,) in tables:
            print(f"- {table_name}")
            columns = connection.execute(f"PRAGMA table_info({table_name})").fetchall()
            for column in columns:
                _, name, column_type, not_null, default_value, primary_key = column
                default_text = f" default={default_value}" if default_value is not None else ""
                required_text = " not_null" if not_null else ""
                primary_text = " primary_key" if primary_key else ""
                print(f"  - {name} {column_type}{required_text}{default_text}{primary_text}")


if __name__ == "__main__":
    main()
