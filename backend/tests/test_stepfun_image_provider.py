import json

import httpx
import pytest

from app.core.config import settings
from app.core.exceptions import AppError
from app.providers.image.stepfun_image_provider import StepFunImageProvider


def configure_stepfun(monkeypatch):
    monkeypatch.setattr(settings, "dtr_image_api_key", "testkey")
    monkeypatch.setattr(settings, "dtr_image_base_url", None)
    monkeypatch.setattr(settings, "dtr_image_model", "step-2x-large")
    monkeypatch.setattr(settings, "dtr_image_max_retries", 2)
    monkeypatch.setattr(settings, "dtr_image_timeout_seconds", 5)
    monkeypatch.setattr(settings, "dtr_image_cfg_scale", None)
    monkeypatch.setattr(settings, "dtr_image_steps", None)
    monkeypatch.setattr(settings, "dtr_image_seed", None)
    monkeypatch.setattr(settings, "dtr_image_size", None)
    monkeypatch.setattr("app.providers.image.stepfun_image_provider.time.sleep", lambda *a, **k: None)


def test_generate_success(monkeypatch):
    configure_stepfun(monkeypatch)
    requests = []

    def handler(request):
        requests.append(request)
        return httpx.Response(
            200,
            json={
                "created": 1723595647,
                "data": [
                    {
                        "url": "https://res.stepfun.com/images/test.jpg",
                        "finish_reason": "success",
                        "seed": 123,
                    }
                ],
            },
        )

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))
    result = provider.generate("梦里的海边", ["海边"], ["夜晚"])

    assert result.image_url == "https://res.stepfun.com/images/test.jpg"
    assert result.provider == "stepfun"
    assert requests[0].headers["Authorization"] == "Bearer testkey"

    body = json.loads(requests[0].content.decode())
    assert body["model"] == "step-2x-large"
    assert body["prompt"] == "梦里的海边. Keywords: 海边. Scenes: 夜晚"
    assert body["n"] == 1
    assert body["response_format"] == "url"


def test_generate_unauthorized_raises(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        return httpx.Response(401, json={"error": {"message": "unauthorized"}})

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))

    with pytest.raises(AppError) as exc_info:
        provider.generate("梦里的海边", ["海边"], ["夜晚"])

    assert exc_info.value.code == "STEPFUN_AUTH_FAILED"


def test_generate_retries_on_429_then_succeeds(monkeypatch):
    configure_stepfun(monkeypatch)
    calls = []

    def handler(request):
        calls.append(request)
        if len(calls) <= 2:
            return httpx.Response(429, json={"error": {"message": "rate limited"}})
        return httpx.Response(
            200,
            json={
                "created": 1723595647,
                "data": [
                    {
                        "url": "https://res.stepfun.com/images/retry.jpg",
                        "finish_reason": "success",
                        "seed": 123,
                    }
                ],
            },
        )

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))
    result = provider.generate("梦里的海边", ["海边"], ["夜晚"])

    assert len(calls) == 3
    assert result.image_url == "https://res.stepfun.com/images/retry.jpg"


def test_generate_429_exhausts_retries(monkeypatch):
    configure_stepfun(monkeypatch)
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(429, json={"error": {"message": "rate limited"}})

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))

    with pytest.raises(AppError) as exc_info:
        provider.generate("梦里的海边", ["海边"], ["夜晚"])

    assert exc_info.value.code == "STEPFUN_RATE_LIMITED"
    assert len(calls) == 3


def test_generate_timeout_exhausts_retries(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        raise httpx.ReadTimeout("timeout", request=request)

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))

    with pytest.raises(AppError) as exc_info:
        provider.generate("梦里的海边", ["海边"], ["夜晚"])

    assert exc_info.value.code == "STEPFUN_TIMEOUT"


def test_generate_content_filtered_raises(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        return httpx.Response(
            200,
            json={
                "created": 1723595647,
                "data": [
                    {
                        "url": "https://res.stepfun.com/images/filtered.jpg",
                        "finish_reason": "content_filtered",
                        "seed": 123,
                    }
                ],
            },
        )

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))

    with pytest.raises(AppError) as exc_info:
        provider.generate("梦里的海边", ["海边"], ["夜晚"])

    assert exc_info.value.code == "STEPFUN_CONTENT_FILTERED"


def test_generate_use_mock_delegates(monkeypatch):
    configure_stepfun(monkeypatch)

    def handler(request):
        raise AssertionError("StepFun transport should not be called")

    provider = StepFunImageProvider(transport=httpx.MockTransport(handler))
    result = provider.generate("一个老房子的走廊", ["老房子", "走廊"], ["室内"], use_mock=True)

    assert result.provider == "mock"
