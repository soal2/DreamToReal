from app.agents.graph import DreamOrganizerGraph
from app.core.exceptions import AppError, dream_not_found
from app.models.dream import DreamRecord, new_dream_id, utc_now_iso
from app.repositories.dream_repository import DreamRepository
from app.schemas.dream import DreamCreateRequest
from app.services.image_generation_service import ImageGenerationService


class DreamGenerationService:
    def __init__(
        self,
        repository: DreamRepository,
        organizer_graph: DreamOrganizerGraph | None = None,
        image_generation_service: ImageGenerationService | None = None,
    ) -> None:
        self.repository = repository
        self.organizer_graph = organizer_graph or DreamOrganizerGraph()
        self.image_generation_service = image_generation_service

    def create_dream(self, request: DreamCreateRequest) -> DreamRecord:
        self._validate_source(request.source)
        organized = self.organizer_graph.organize(request.raw_text)
        now = utc_now_iso()
        record = DreamRecord(
            id=new_dream_id(),
            title=organized.title,
            raw_text=request.raw_text.strip(),
            organized_text=organized.organized_text,
            image_prompt=organized.image_prompt,
            image_url="",
            keywords=organized.keywords,
            emotions=organized.emotions,
            scenes=organized.scenes,
            source=request.source,
            status="organized",
            created_at=now,
            updated_at=now,
        )
        saved = self.repository.create(record)
        if request.generate_image and self.image_generation_service is not None:
            return self.image_generation_service.generate_for_dream(saved.id, use_mock=True)
        return saved

    def reorganize_dream(self, dream_id: str) -> DreamRecord:
        record = self.repository.get_by_id(dream_id)
        if record is None:
            raise dream_not_found()

        organized = self.organizer_graph.organize(record.raw_text)
        updated = self.repository.update(
            dream_id,
            {
                "title": organized.title,
                "organized_text": organized.organized_text,
                "image_prompt": organized.image_prompt,
                "keywords": organized.keywords,
                "emotions": organized.emotions,
                "scenes": organized.scenes,
                "image_url": "",
                "status": "organized",
            },
        )
        if updated is None:
            raise dream_not_found()
        return updated

    def _validate_source(self, source: str) -> None:
        if source not in {"text", "voice"}:
            raise AppError("INVALID_SOURCE", "source 只支持 text 或 voice。", 400)

