from functools import lru_cache

from app.agents.graph import DreamOrganizerGraph
from app.core.config import settings
from app.providers.image.base import ImageProvider
from app.providers.image.mock_image_provider import MockImageProvider
from app.providers.image.openai_image_provider import OpenAIImageProvider
from app.providers.image.stepfun_image_provider import StepFunImageProvider
from app.providers.llm.base import DreamOrganizerProvider
from app.providers.llm.mock_llm_provider import MockLLMProvider
from app.providers.llm.stepfun_llm_provider import StepFunLLMProvider
from app.repositories.dream_repository import DreamRepository
from app.services.dream_delete_service import DreamDeleteService
from app.services.dream_generation_service import DreamGenerationService
from app.services.dream_query_service import DreamQueryService
from app.services.image_generation_service import ImageGenerationService
from app.storage.image_storage import ImageStorage


def get_dream_repository() -> DreamRepository:
    return DreamRepository()


@lru_cache
def get_image_storage() -> ImageStorage:
    return ImageStorage()


@lru_cache
def get_organizer_graph() -> DreamOrganizerGraph:
    return DreamOrganizerGraph(provider=_get_llm_provider())


def _get_llm_provider() -> DreamOrganizerProvider:
    provider_name = settings.dtr_llm_provider.lower()
    if provider_name == "stepfun":
        settings.require_llm_credentials()
        return StepFunLLMProvider()
    return MockLLMProvider()


def _get_image_provider() -> ImageProvider:
    """根据配置返回对应的图像生成 provider"""
    provider_name = settings.dtr_image_provider.lower()

    if provider_name == "openai":
        settings.require_image_credentials()
        return OpenAIImageProvider(get_image_storage())
    if provider_name == "stepfun":
        settings.require_image_credentials()
        return StepFunImageProvider(get_image_storage())
    return MockImageProvider(get_image_storage())


def get_image_generation_service() -> ImageGenerationService:
    repository = get_dream_repository()
    image_provider = _get_image_provider()
    mock_provider = MockImageProvider(get_image_storage())
    return ImageGenerationService(
        repository=repository,
        image_provider=image_provider,
        mock_provider=mock_provider,
    )


def get_dream_generation_service() -> DreamGenerationService:
    repository = get_dream_repository()
    return DreamGenerationService(
        repository=repository,
        organizer_graph=get_organizer_graph(),
        image_generation_service=ImageGenerationService(
            repository=repository,
            image_provider=_get_image_provider(),
        ),
    )


def get_dream_query_service() -> DreamQueryService:
    return DreamQueryService(get_dream_repository())


def get_dream_delete_service() -> DreamDeleteService:
    return DreamDeleteService(get_dream_repository())
