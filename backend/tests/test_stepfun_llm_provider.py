import json

import httpx
import pytest

from app.core.config import settings
from app.providers.llm.mock_llm_provider import MockLLMProvider
from app.providers.llm.stepfun_llm_provider import StepFunLLMProvider


RAW_TEXT = "老房子，楼道很长，很暗，找门找不到，老太太指了方向。"


def configure_stepfun(monkeypatch):
    monkeypatch.setattr(settings, "dtr_llm_api_key", "testkey")
    monkeypatch.setattr(settings, "dtr_llm_base_url", None)
    monkeypatch.setattr(settings, "dtr_llm_model", "step-1-8k")
    monkeypatch.setattr(settings, "dtr_llm_timeout_seconds", 5)
    monkeypatch.setattr("app.providers.llm.stepfun_llm_provider.time.sleep", lambda *a, **k: None)


def _chat_response(content: str) -> httpx.Response:
    return httpx.Response(
        200,
        json={
            "id": "chatcmpl-1",
            "choices": [{"index": 0, "message": {"role": "assistant", "content": content}}],
        },
    )


def test_organize_success(monkeypatch):
    configure_stepfun(monkeypatch)
    requests = []
    llm_text = "梦里我在一栋很旧的房子里慢慢走着，楼道又长又暗……"

    def handler(request):
        requests.append(request)
        return _chat_response(llm_text)

    provider = StepFunLLMProvider(transport=httpx.MockTransport(handler))
    result = provider.organize(RAW_TEXT)

    assert result.organized_text == llm_text
    baseline = MockLLMProvider().organize(RAW_TEXT)
    assert result.title == baseline.title
    assert result.keywords == baseline.keywords
    assert result.image_prompt == baseline.image_prompt

    assert requests[0].headers["Authorization"] == "Bearer testkey"
    body = json.loads(requests[0].content.decode())
    assert body["model"] == "step-1-8k"
    assert body["messages"][0]["role"] == "system"
    assert body["messages"][1] == {"role": "user", "content": RAW_TEXT}


def test_organize_falls_back_on_401(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        return httpx.Response(401, json={"error": {"message": "unauthorized"}})

    provider = StepFunLLMProvider(transport=httpx.MockTransport(handler))
    result = provider.organize(RAW_TEXT)
    expected = MockLLMProvider().organize(RAW_TEXT)

    assert result.organized_text == expected.organized_text
    assert result.title == expected.title


def test_organize_retries_on_429_then_succeeds(monkeypatch):
    configure_stepfun(monkeypatch)
    calls = []

    def handler(request):
        calls.append(request)
        if len(calls) <= 2:
            return httpx.Response(429, json={"error": {"message": "rate limited"}})
        return _chat_response("整理后的梦境正文。")

    provider = StepFunLLMProvider(transport=httpx.MockTransport(handler))
    result = provider.organize(RAW_TEXT)

    assert len(calls) == 3
    assert result.organized_text == "整理后的梦境正文。"


def test_organize_falls_back_on_429_exhausted(monkeypatch):
    configure_stepfun(monkeypatch)
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(429, json={"error": {"message": "rate limited"}})

    provider = StepFunLLMProvider(transport=httpx.MockTransport(handler))
    result = provider.organize(RAW_TEXT)
    expected = MockLLMProvider().organize(RAW_TEXT)

    assert len(calls) == 3
    assert result.organized_text == expected.organized_text


def test_organize_falls_back_on_timeout(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        raise httpx.ReadTimeout("timeout", request=request)

    provider = StepFunLLMProvider(transport=httpx.MockTransport(handler))
    result = provider.organize(RAW_TEXT)
    expected = MockLLMProvider().organize(RAW_TEXT)

    assert result.organized_text == expected.organized_text


def test_organize_falls_back_on_empty_content(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        return _chat_response("   ")

    provider = StepFunLLMProvider(transport=httpx.MockTransport(handler))
    result = provider.organize(RAW_TEXT)
    expected = MockLLMProvider().organize(RAW_TEXT)

    assert result.organized_text == expected.organized_text
