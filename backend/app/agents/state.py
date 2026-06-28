from typing import TypedDict

from app.providers.llm.base import DreamOrganizedResult


class DreamOrganizerState(TypedDict, total=False):
    raw_text: str
    organized_result: DreamOrganizedResult

