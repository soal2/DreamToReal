from dataclasses import dataclass
from typing import Protocol


@dataclass
class DreamOrganizedResult:
    title: str
    organized_text: str
    image_prompt: str
    keywords: list[str]
    emotions: list[str]
    scenes: list[str]


class DreamOrganizerProvider(Protocol):
    def organize(self, raw_text: str) -> DreamOrganizedResult:
        ...

