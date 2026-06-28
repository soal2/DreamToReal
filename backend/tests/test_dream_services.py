import tempfile
import unittest
from pathlib import Path

from app.agents.graph import DreamOrganizerGraph
from app.core.database import init_db
from app.core.exceptions import AppError
from app.providers.image.mock_image_provider import MockImageProvider
from app.repositories.dream_repository import DreamRepository
from app.schemas.dream import DreamCreateRequest
from app.services.dream_delete_service import DreamDeleteService
from app.services.dream_generation_service import DreamGenerationService
from app.services.dream_query_service import DreamQueryService
from app.services.image_generation_service import ImageGenerationService
from app.storage.image_storage import ImageStorage
from app.providers.image.base import ImageGenerationResult


class StaticUrlImageProvider:
    def __init__(self, image_url: str) -> None:
        self.image_url = image_url

    def generate(
        self,
        image_prompt: str,
        keywords: list[str],
        scenes: list[str],
        use_mock: bool = False,
    ) -> ImageGenerationResult:
        return ImageGenerationResult(image_url=self.image_url, provider="stepfun")


class DreamServiceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "dreams.sqlite3"
        self.static_dir = Path(self.temp_dir.name) / "static"
        init_db(self.db_path)
        self.repository = DreamRepository(self.db_path)
        storage = ImageStorage(static_dir=self.static_dir)
        mock_image_provider = MockImageProvider(storage)
        self.image_service = ImageGenerationService(
            repository=self.repository,
            image_provider=mock_image_provider,
            mock_provider=mock_image_provider,
        )
        self.generation_service = DreamGenerationService(
            repository=self.repository,
            organizer_graph=DreamOrganizerGraph(),
            image_generation_service=self.image_service,
        )
        self.query_service = DreamQueryService(self.repository)
        self.delete_service = DreamDeleteService(self.repository)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_create_query_generate_image_and_delete(self) -> None:
        created = self.generation_service.create_dream(
            DreamCreateRequest(
                raw_text="老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
            )
        )

        self.assertEqual(created.title, "在老房子里找门")
        self.assertEqual(created.status, "organized")

        records, total = self.query_service.list_dreams(limit=20, offset=0)
        self.assertEqual(total, 1)
        self.assertEqual(records[0].id, created.id)

        detail = self.query_service.get_dream(created.id)
        self.assertEqual(detail.raw_text, created.raw_text)

        image_record = self.image_service.generate_for_dream(created.id)
        self.assertEqual(image_record.status, "image_generated")
        self.assertTrue(image_record.image_url.endswith("old-house.svg"))

        self.delete_service.delete_dream(created.id)
        with self.assertRaises(AppError) as context:
            self.query_service.get_dream(created.id)
        self.assertEqual(context.exception.code, "DREAM_NOT_FOUND")

    def test_too_short_dream_is_rejected(self) -> None:
        with self.assertRaises(AppError) as context:
            self.generation_service.create_dream(DreamCreateRequest(raw_text="门"))
        self.assertEqual(context.exception.code, "DREAM_TEXT_TOO_SHORT")

    def test_generated_absolute_image_url_is_preserved(self) -> None:
        created = self.generation_service.create_dream(
            DreamCreateRequest(raw_text="下雨，公交站，人很少，等了很久车都没有来。")
        )
        stepfun_url = (
            "https://res.stepfun.com/image_gen/20260628/"
            "019f0d2fe46075bc95ca1e368229d464.png?X-Tos-Algorithm=TOS4-HMAC-SHA256"
        )
        service = ImageGenerationService(
            repository=self.repository,
            image_provider=StaticUrlImageProvider(stepfun_url),
        )

        image_record = service.generate_for_dream(created.id)

        self.assertEqual(image_record.status, "image_generated")
        self.assertEqual(image_record.image_url, stepfun_url)


if __name__ == "__main__":
    unittest.main()
