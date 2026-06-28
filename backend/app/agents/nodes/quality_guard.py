from app.agents.state import DreamOrganizerState
from app.providers.llm.base import DreamOrganizedResult


def quality_guard(state: DreamOrganizerState) -> DreamOrganizerState:
    result = state["organized_result"]
    state["organized_result"] = DreamOrganizedResult(
        title=result.title.strip()[:40],
        organized_text=result.organized_text.strip(),
        image_prompt=result.image_prompt.strip(),
        keywords=_clean_list(result.keywords, 6),
        emotions=_clean_list(result.emotions, 4),
        scenes=_clean_list(result.scenes, 4),
    )
    return state


def _clean_list(values: list[str], limit: int) -> list[str]:
    cleaned: list[str] = []
    for value in values:
        item = str(value).strip()
        if item and item not in cleaned:
            cleaned.append(item[:20])
    return cleaned[:limit]

