from app.core.exceptions import dream_not_found
from app.models.dream import DreamRecord
from app.providers.image.base import ImageProvider
from app.providers.image.mock_image_provider import MockImageProvider
from app.repositories.dream_repository import DreamRepository


class ImageGenerationService:
    def __init__(
        self,
        repository: DreamRepository,
        image_provider: ImageProvider | None = None,
        mock_provider: MockImageProvider | None = None,
    ) -> None:
        self.repository = repository
        self.mock_provider = mock_provider or MockImageProvider()
        self.image_provider = image_provider or self.mock_provider

    def generate_for_dream(self, dream_id: str, use_mock: bool = False) -> DreamRecord:
        record = self.repository.get_by_id(dream_id)
        if record is None:
            raise dream_not_found()

        provider = self.mock_provider if use_mock else self.image_provider
        try:
            result = provider.generate(
                image_prompt=record.image_prompt,
                keywords=record.keywords,
                scenes=record.scenes,
                use_mock=use_mock,
            )
        except Exception:
            result = self.mock_provider.generate(
                image_prompt=record.image_prompt,
                keywords=record.keywords,
                scenes=record.scenes,
                use_mock=True,
            )

        updated = self.repository.update(
            dream_id,
            {
                "image_url": result.image_url,
                "status": "image_generated",
            },
        )
        if updated is None:
            raise dream_not_found()
        return updated

