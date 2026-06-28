from dataclasses import dataclass
from typing import Protocol


@dataclass
class ImageGenerationResult:
    image_url: str
    provider: str


class ImageProvider(Protocol):
    def generate(
        self,
        image_prompt: str,
        keywords: list[str],
        scenes: list[str],
        use_mock: bool = False,
    ) -> ImageGenerationResult:
        ...

