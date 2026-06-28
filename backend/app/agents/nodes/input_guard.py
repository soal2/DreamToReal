from app.agents.state import DreamOrganizerState
from app.core.exceptions import AppError


def input_guard(state: DreamOrganizerState) -> DreamOrganizerState:
    raw_text = state.get("raw_text", "")
    text = raw_text.strip()
    if not text:
        raise AppError("DREAM_TEXT_EMPTY", "梦境片段不能为空。", 400)
    if len(text) < 5:
        raise AppError("DREAM_TEXT_TOO_SHORT", "梦境片段太短了，可以再补充一个场景、人物或情绪。", 400)
    if len(text) > 3000:
        raise AppError("DREAM_TEXT_TOO_LONG", "梦境片段太长了，请先保留最重要的场景。", 400)
    state["raw_text"] = text
    return state

