from app.agents.nodes.dream_organizer import make_dream_organizer_node
from app.agents.nodes.input_guard import input_guard
from app.agents.nodes.quality_guard import quality_guard
from app.agents.nodes.structure_validator import structure_validator
from app.agents.state import DreamOrganizerState
from app.core.exceptions import AppError
from app.providers.llm.base import DreamOrganizedResult, DreamOrganizerProvider
from app.providers.llm.mock_llm_provider import MockLLMProvider


class DreamOrganizerGraph:
    def __init__(
        self,
        provider: DreamOrganizerProvider | None = None,
        mock_provider: MockLLMProvider | None = None,
    ) -> None:
        self.provider = provider or mock_provider or MockLLMProvider()
        self.mock_provider = mock_provider or MockLLMProvider()
        self._compiled_graph = self._try_compile_langgraph()

    def organize(self, raw_text: str) -> DreamOrganizedResult:
        initial_state: DreamOrganizerState = {"raw_text": raw_text}
        try:
            if self._compiled_graph is not None:
                final_state = self._compiled_graph.invoke(initial_state)
            else:
                final_state = self._run_linear(initial_state)
            return final_state["organized_result"]
        except AppError:
            raise
        except Exception:
            return self.mock_provider.organize(raw_text)

    def _run_linear(self, state: DreamOrganizerState) -> DreamOrganizerState:
        organizer_node = make_dream_organizer_node(self.provider)
        state = input_guard(state)
        state = organizer_node(state)
        state = structure_validator(state)
        return quality_guard(state)

    def _try_compile_langgraph(self):
        try:
            from langgraph.graph import END, START, StateGraph
        except Exception:
            return None

        builder = StateGraph(DreamOrganizerState)
        builder.add_node("input_guard", input_guard)
        builder.add_node("dream_organizer", make_dream_organizer_node(self.provider))
        builder.add_node("structure_validator", structure_validator)
        builder.add_node("quality_guard", quality_guard)
        builder.add_edge(START, "input_guard")
        builder.add_edge("input_guard", "dream_organizer")
        builder.add_edge("dream_organizer", "structure_validator")
        builder.add_edge("structure_validator", "quality_guard")
        builder.add_edge("quality_guard", END)
        return builder.compile()

