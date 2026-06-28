from app.providers.image.base import ImageGenerationResult
from app.storage.image_storage import ImageStorage


class MockImageProvider:
    def __init__(self, storage: ImageStorage | None = None) -> None:
        self.storage = storage or ImageStorage()

    def generate(
        self,
        image_prompt: str,
        keywords: list[str],
        scenes: list[str],
        use_mock: bool = False,
    ) -> ImageGenerationResult:
        asset_key = self._select_asset(image_prompt, keywords, scenes)
        return ImageGenerationResult(
            image_url=self.storage.mock_asset_url(asset_key),
            provider="mock",
        )

    def _select_asset(self, image_prompt: str, keywords: list[str], scenes: list[str]) -> str:
        haystack = " ".join([image_prompt, *keywords, *scenes])
        if self._contains(haystack, ["老房子", "走廊", "楼道"]):
            return "old-house"
        if self._contains(haystack, ["考试", "教室"]):
            return "exam-classroom"
        if self._contains(haystack, ["下雨", "公交站", "雨天"]):
            return "rainy-bus-stop"
        if self._contains(haystack, ["商场", "电梯"]):
            return "mall-corridor"
        if self._contains(haystack, ["家人", "晚餐", "吃饭", "餐桌"]):
            return "family-dinner"
        return "default-dream"

    def _contains(self, text: str, keywords: list[str]) -> bool:
        return any(keyword in text for keyword in keywords)

