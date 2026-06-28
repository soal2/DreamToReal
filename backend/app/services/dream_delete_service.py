from app.core.exceptions import dream_not_found
from app.repositories.dream_repository import DreamRepository


class DreamDeleteService:
    def __init__(self, repository: DreamRepository) -> None:
        self.repository = repository

    def delete_dream(self, dream_id: str) -> None:
        if not self.repository.delete(dream_id):
            raise dream_not_found()

