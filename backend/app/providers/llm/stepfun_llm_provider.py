import logging
import time

import httpx

from app.core.config import settings
from app.providers.llm.base import DreamOrganizedResult
from app.providers.llm.mock_llm_provider import MockLLMProvider


logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "你是梦境整理助手。用户给你一段他刚醒来时口述或记录的梦境碎片，"
    "请用 80~200 字的第一人称完整中文叙述把它整理成清晰、连贯、"
    "保留原始场景与情绪的一段话。只输出整理后的梦境正文本身，"
    "不要加标题、不要加解释、不要加任何前后缀。"
)


class StepFunLLMProvider:
    max_retries = 2

    def __init__(self, transport=None, fallback: MockLLMProvider | None = None) -> None:
        self.api_key = settings.dtr_llm_api_key
        self.base_url = (settings.dtr_llm_base_url or "https://api.stepfun.com/v1").rstrip("/")
        self.model = settings.dtr_llm_model or "step-1-8k"
        self.timeout = settings.dtr_llm_timeout_seconds
        self.client = httpx.Client(transport=transport, timeout=self.timeout)
        self._fallback = fallback or MockLLMProvider()

    def organize(self, raw_text: str) -> DreamOrganizedResult:
        baseline = self._fallback.organize(raw_text)
        llm_text = self._call_llm(raw_text)
        if not llm_text:
            logger.warning("stepfun llm failed, falling back to mock provider")
            return baseline
        return DreamOrganizedResult(
            title=baseline.title,
            organized_text=llm_text,
            image_prompt=baseline.image_prompt,
            keywords=baseline.keywords,
            emotions=baseline.emotions,
            scenes=baseline.scenes,
        )

    def _call_llm(self, raw_text: str) -> str:
        body = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": raw_text},
            ],
            "temperature": 0.7,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        url = f"{self.base_url}/chat/completions"
        logger.info("stepfun llm request model=%s url=%s", self.model, url)

        response = None
        for attempt in range(self.max_retries + 1):
            try:
                response = self.client.post(url, headers=headers, json=body)
            except (httpx.TimeoutException, httpx.TransportError) as exc:
                if attempt < self.max_retries:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                logger.warning(
                    "stepfun llm network failure after %d attempts: %s",
                    attempt + 1, exc,
                )
                return ""

            if response.status_code == 429 or 500 <= response.status_code <= 599:
                if attempt < self.max_retries:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
            break

        if response is None:
            logger.warning("stepfun llm no response object")
            return ""
        if response.status_code != 200:
            logger.warning(
                "stepfun llm returned status=%d body=%s",
                response.status_code, response.text[:300],
            )
            return ""

        try:
            payload = response.json()
            content = payload["choices"][0]["message"]["content"]
        except (ValueError, KeyError, IndexError, TypeError) as exc:
            logger.warning("stepfun llm response not parseable: %s", exc)
            return ""

        text = content.strip() if isinstance(content, str) else ""
        if not text:
            logger.warning("stepfun llm returned empty content")
            return ""
        logger.info("stepfun llm ok, content_len=%d", len(text))
        return text
