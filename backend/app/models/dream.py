from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4


@dataclass
class DreamRecord:
    id: str
    title: str
    raw_text: str
    organized_text: str
    image_prompt: str
    image_url: str
    keywords: list[str]
    emotions: list[str]
    scenes: list[str]
    source: str
    status: str
    created_at: str
    updated_at: str


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def new_dream_id() -> str:
    return f"dream_{uuid4().hex[:12]}"

