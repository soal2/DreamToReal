import time

import httpx

from app.core.config import settings
from app.core.exceptions import AppError
from app.providers.image.base import ImageGenerationResult
from app.storage.image_storage import ImageStorage


class StepFunImageProvider:
    def __init__(self, storage: ImageStorage | None = None, transport=None) -> None:
        self.storage = storage or ImageStorage()
        self.api_key = settings.dtr_image_api_key
        self.base_url = (settings.dtr_image_base_url or "https://api.stepfun.com/v1").rstrip("/")
        self.model = settings.dtr_image_model or "step-2x-large"
        self.timeout = settings.dtr_image_timeout_seconds
        self.max_retries = settings.dtr_image_max_retries
        self.client = httpx.Client(transport=transport, timeout=self.timeout)

    def generate(
        self,
        image_prompt,
        keywords=None,
        scenes=None,
        use_mock=False,
    ) -> ImageGenerationResult:
        if use_mock:
            from app.providers.image.mock_image_provider import MockImageProvider
            return MockImageProvider(self.storage).generate(
                image_prompt, keywords or [], scenes or [], use_mock=True
            )

        default_sizes = {
            "step-2x-large": "1024x1024",
            "step-1x-medium": "1024x1024",
            "step-image-edit-2": "1024x1024",
        }
        body = {
            "model": self.model,
            "prompt": self._build_prompt(image_prompt, keywords, scenes),
            "n": 1,
            "response_format": "url",
        }
        size = settings.dtr_image_size or default_sizes.get(self.model)
        if size is not None:
            body["size"] = size
        if settings.dtr_image_cfg_scale is not None:
            body["cfg_scale"] = settings.dtr_image_cfg_scale
        if settings.dtr_image_steps is not None:
            body["steps"] = settings.dtr_image_steps
        if settings.dtr_image_seed is not None:
            body["seed"] = settings.dtr_image_seed
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        response = None
        for attempt in range(self.max_retries + 1):
            try:
                response = self.client.post(
                    f"{self.base_url}/images/generations",
                    headers=headers,
                    json=body,
                )
            except httpx.TimeoutException as exc:
                if attempt < self.max_retries:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                raise AppError("STEPFUN_TIMEOUT", "StepFun 请求超时", 504) from exc
            except httpx.TransportError as exc:
                if attempt < self.max_retries:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                raise AppError("STEPFUN_UPSTREAM_ERROR", "StepFun 服务暂不可用", 502) from exc

            if response.status_code == 429 or 500 <= response.status_code <= 599:
                if attempt < self.max_retries:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
            break

        if response is None:
            raise AppError("STEPFUN_UPSTREAM_ERROR", "StepFun 服务暂不可用", 502)

        if response.status_code != 200:
            self._raise_http_error(response)

        try:
            payload = response.json()
        except ValueError as exc:
            raise AppError("STEPFUN_EMPTY_RESPONSE", "StepFun 未返回图片", 502) from exc

        data = payload.get("data")
        if not data:
            raise AppError("STEPFUN_EMPTY_RESPONSE", "StepFun 未返回图片", 502)

        first_item = data[0]
        if first_item.get("finish_reason") == "content_filtered":
            raise AppError("STEPFUN_CONTENT_FILTERED", "提示词触发内容审核，请调整后重试", 422)

        image_url = first_item.get("url")
        if not image_url:
            raise AppError("STEPFUN_EMPTY_RESPONSE", "StepFun 未返回图片", 502)

        return ImageGenerationResult(
            image_url=image_url,
            provider="stepfun",
        )

    def _build_prompt(self, image_prompt, keywords, scenes) -> str:
        parts = [image_prompt]

        if keywords:
            parts.append(f"Keywords: {', '.join(keywords)}")

        if scenes:
            parts.append(f"Scenes: {', '.join(scenes)}")

        return ". ".join(parts)[:512]

    def _raise_http_error(self, response):
        status = response.status_code
        if status in (401, 403):
            raise AppError("STEPFUN_AUTH_FAILED", "StepFun 鉴权失败，请检查 DTR_IMAGE_API_KEY", 502)
        if status in (400, 422):
            server_message = self._server_message(response)
            raise AppError("STEPFUN_INVALID_REQUEST", f"StepFun 请求参数错误：{server_message}", 502)
        if status == 429:
            raise AppError("STEPFUN_RATE_LIMITED", "StepFun 接口限流，请稍后重试", 503)
        if 500 <= status <= 599:
            raise AppError("STEPFUN_UPSTREAM_ERROR", "StepFun 服务暂不可用", 502)
        raise AppError("STEPFUN_UNEXPECTED_STATUS", f"StepFun 返回未预期状态码 {status}", 502)

    def _server_message(self, response):
        try:
            payload = response.json()
        except ValueError:
            return response.text

        error = payload.get("error")
        if isinstance(error, dict) and error.get("message"):
            return error["message"]
        if payload.get("message"):
            return payload["message"]
        return response.text
