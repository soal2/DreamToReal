import base64
import io
from pathlib import Path

import requests
from openai import OpenAI

from app.core.config import settings
from app.providers.image.base import ImageGenerationResult
from app.storage.image_storage import ImageStorage


class OpenAIImageProvider:
    def __init__(self, storage: ImageStorage | None = None) -> None:
        self.storage = storage or ImageStorage()
        self.client = OpenAI(
            api_key=settings.dtr_image_api_key,
            base_url=settings.dtr_image_base_url,
        )
        self.model = settings.dtr_image_model or "dall-e-3"
        self.timeout = settings.dtr_image_timeout_seconds

    def generate(
        self,
        image_prompt: str,
        keywords: list[str] | None = None,
        scenes: list[str] | None = None,
        use_mock: bool = False,
    ) -> ImageGenerationResult:
        if use_mock:
            from app.providers.image.mock_image_provider import MockImageProvider
            return MockImageProvider(self.storage).generate(
                image_prompt, keywords or [], scenes or [], use_mock=True
            )

        full_prompt = self._build_prompt(image_prompt, keywords, scenes)

        response = self.client.images.generate(
            model=self.model,
            prompt=full_prompt,
            n=1,
            size="1024x1024",
            quality="standard",
            timeout=self.timeout,
        )

        image_url = response.data[0].url
        if not image_url:
            raise ValueError("No image URL returned from OpenAI")

        return ImageGenerationResult(
            image_url=image_url,
            provider="openai",
        )

    def _build_prompt(
        self,
        image_prompt: str,
        keywords: list[str] | None = None,
        scenes: list[str] | None = None
    ) -> str:
        """构建更详细的图像生成提示词"""
        parts = [image_prompt]

        if keywords:
            parts.append(f"Keywords: {', '.join(keywords)}")

        if scenes:
            parts.append(f"Scenes: {', '.join(scenes)}")

        return ". ".join(parts)
