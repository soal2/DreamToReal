from app.core.exceptions import dream_not_found
from app.models.dream import DreamRecord
from app.repositories.dream_repository import DreamRepository


class DreamQueryService:
    def __init__(self, repository: DreamRepository) -> None:
        self.repository = repository

    def list_dreams(self, limit: int, offset: int) -> tuple[list[DreamRecord], int]:
        return self.repository.list(limit=limit, offset=offset)

    def get_dream(self, dream_id: str) -> DreamRecord:
        record = self.repository.get_by_id(dream_id)
        if record is None:
            raise dream_not_found()
        return record

