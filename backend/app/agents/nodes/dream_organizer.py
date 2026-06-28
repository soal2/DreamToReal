from collections.abc import Callable

from app.agents.state import DreamOrganizerState
from app.providers.llm.base import DreamOrganizerProvider


def make_dream_organizer_node(provider: DreamOrganizerProvider) -> Callable[[DreamOrganizerState], DreamOrganizerState]:
    def dream_organizer(state: DreamOrganizerState) -> DreamOrganizerState:
        state["organized_result"] = provider.organize(state["raw_text"])
        return state

    return dream_organizer

