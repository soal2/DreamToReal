from dataclasses import dataclass
import os
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Settings:
    service_name: str = "dream-to-real-agent-backend"
    version: str = "0.1.0"
    api_v1_prefix: str = "/api/v1"
    database_path: Path = Path(
        os.getenv("DTR_DATABASE_PATH", BACKEND_DIR / "var" / "dream_to_real.sqlite3")
    )
    static_dir: Path = Path(os.getenv("DTR_STATIC_DIR", BACKEND_DIR / "static"))
    static_url_path: str = "/static"


settings = Settings()

