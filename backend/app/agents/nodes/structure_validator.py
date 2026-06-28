from app.agents.state import DreamOrganizerState
from app.core.exceptions import AppError
from app.providers.llm.base import DreamOrganizedResult


def structure_validator(state: DreamOrganizerState) -> DreamOrganizerState:
    result = state.get("organized_result")
    if not isinstance(result, DreamOrganizedResult):
        raise AppError("INVALID_AGENT_OUTPUT", "Agent 输出结构不正确。", 500)
    if not result.title or not result.organized_text or not result.image_prompt:
        raise AppError("INVALID_AGENT_OUTPUT", "Agent 输出缺少必要字段。", 500)
    if not isinstance(result.keywords, list) or not isinstance(result.emotions, list) or not isinstance(result.scenes, list):
        raise AppError("INVALID_AGENT_OUTPUT", "Agent 输出列表字段不正确。", 500)
    return state

