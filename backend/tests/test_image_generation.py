#!/usr/bin/env python3
"""
测试 OpenAI DALL-E 图像生成集成
"""

import os
import sys
import json
from pathlib import Path

# 添加后端路径到 Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

load_dotenv(backend_dir / ".env")

from app.core.config import settings
from app.providers.image.mock_image_provider import MockImageProvider
from app.providers.image.openai_image_provider import OpenAIImageProvider
from app.providers.image.stepfun_image_provider import StepFunImageProvider
from app.storage.image_storage import ImageStorage


def test_mock_provider():
    """测试 Mock Provider"""
    print("\n" + "="*60)
    print("测试 Mock Provider")
    print("="*60)

    storage = ImageStorage()
    provider = MockImageProvider(storage)

    result = provider.generate(
        image_prompt="一个老房子的走廊",
        keywords=["老房子", "走廊"],
        scenes=["室内"],
    )

    print(f"✓ Mock Provider 生成成功")
    print(f"  图像 URL: {result.image_url}")
    print(f"  Provider: {result.provider}")
    return True


def test_openai_provider():
    """测试 OpenAI DALL-E Provider"""
    print("\n" + "="*60)
    print("测试 OpenAI DALL-E Provider")
    print("="*60)

    # 检查配置
    if settings.dtr_image_provider.lower() != "openai":
        print(f"⚠ 当前配置: DTR_IMAGE_PROVIDER={settings.dtr_image_provider}")
        print("  需要设置为 'openai' 才能测试 OpenAI provider")
        return False

    if not settings.dtr_image_api_key:
        print("❌ 错误: 缺少 DTR_IMAGE_API_KEY")
        print("  请在 .env 文件中设置: DTR_IMAGE_API_KEY=sk-xxx...")
        return False

    print(f"✓ 配置检查通过")
    print(f"  Provider: {settings.dtr_image_provider}")
    print(f"  Model: {settings.dtr_image_model}")
    print(f"  Base URL: {settings.dtr_image_base_url}")

    try:
        storage = ImageStorage()
        provider = OpenAIImageProvider(storage)

        print("\n生成图像中...")
        result = provider.generate(
            image_prompt="一个温暖的家庭晚餐场景",
            keywords=["家人", "晚餐", "餐桌"],
            scenes=["家里", "餐厅"],
        )

        print(f"\n✓ OpenAI DALL-E 生成成功!")
        print(f"  图像 URL: {result.image_url}")
        print(f"  Provider: {result.provider}")
        return True

    except Exception as e:
        print(f"\n❌ 错误: {type(e).__name__}")
        print(f"  {str(e)}")

        # 提示常见错误
        if "401" in str(e) or "authentication" in str(e).lower():
            print("\n💡 提示: API Key 可能无效或已过期")
            print("  访问 https://platform.openai.com/account/api-keys 检查")
        elif "quota" in str(e).lower():
            print("\n💡 提示: 可能超过了 API 配额")
            print("  访问 https://platform.openai.com/account/billing/overview 检查额度")
        elif "timeout" in str(e).lower():
            print("\n💡 提示: 请求超时，可能是网络问题")

        return False


def test_stepfun_provider():
    """测试 StepFun Provider"""
    print("\n" + "="*60)
    print("测试 StepFun Provider")
    print("="*60)

    # 检查配置
    if settings.dtr_image_provider.lower() != "stepfun":
        print(f"⚠ 当前配置: DTR_IMAGE_PROVIDER={settings.dtr_image_provider}")
        print("  需要设置为 'stepfun' 才能测试 StepFun provider")
        return False

    if not settings.dtr_image_api_key:
        print("❌ 错误: 缺少 DTR_IMAGE_API_KEY")
        print("  请在 .env 文件中设置: DTR_IMAGE_API_KEY=xxx...")
        return False

    print(f"✓ 配置检查通过")
    print(f"  Provider: {settings.dtr_image_provider}")
    print(f"  Model: {settings.dtr_image_model}")
    print(f"  Base URL: {settings.dtr_image_base_url}")

    try:
        storage = ImageStorage()
        provider = StepFunImageProvider(storage)

        print("\n生成图像中...")
        result = provider.generate(
            image_prompt="一个温暖的家庭晚餐场景",
            keywords=["家人", "晚餐", "餐桌"],
            scenes=["家里", "餐厅"],
        )

        print(f"\n✓ StepFun 生成成功!")
        print(f"  图像 URL: {result.image_url}")
        print(f"  Provider: {result.provider}")
        return True

    except Exception as e:
        print(f"\n❌ 错误: {type(e).__name__}")
        print(f"  {str(e)}")

        code = getattr(e, "code", "")
        if code == "STEPFUN_AUTH_FAILED" or "401" in str(e):
            print("\n💡 提示: API Key 可能无效或已过期")
        elif code == "STEPFUN_RATE_LIMITED" or "429" in str(e):
            print("\n💡 提示: StepFun 接口限流，请稍后重试")
        elif code == "STEPFUN_TIMEOUT" or "timeout" in str(e).lower():
            print("\n💡 提示: 请求超时，可能是网络问题")

        return False


def test_config():
    """检查配置"""
    print("\n" + "="*60)
    print("配置检查")
    print("="*60)

    print(f"DTR_IMAGE_PROVIDER: {settings.dtr_image_provider}")
    print(f"DTR_IMAGE_MODEL: {settings.dtr_image_model}")
    print(f"DTR_IMAGE_BASE_URL: {settings.dtr_image_base_url}")
    print(f"DTR_IMAGE_TIMEOUT_SECONDS: {settings.dtr_image_timeout_seconds}")
    print(f"DTR_IMAGE_API_KEY: {'***' + settings.dtr_image_api_key[-4:] if settings.dtr_image_api_key else '(未设置)'}")

    return True


if __name__ == "__main__":
    print("\n🧪 Dream-to-Real 图像生成集成测试")

    # 配置检查
    test_config()

    # Mock Provider 测试
    if not test_mock_provider():
        print("❌ Mock Provider 测试失败")
        sys.exit(1)

    # OpenAI Provider 测试
    if not test_openai_provider():
        print("\n⚠ OpenAI Provider 测试失败，但这可能是配置或网络问题")
        print("请确保:")
        print("  1. DTR_IMAGE_PROVIDER=openai")
        print("  2. DTR_IMAGE_API_KEY 已设置为有效的 OpenAI API Key")
        print("  3. 网络连接正常")
        sys.exit(1)

    # StepFun Provider 测试
    if not test_stepfun_provider():
        print("\n⚠ StepFun Provider 测试失败，但这可能是配置或网络问题")
        print("请确保:")
        print("  1. DTR_IMAGE_PROVIDER=stepfun")
        print("  2. DTR_IMAGE_API_KEY 已设置为有效的 StepFun API Key")
        print("  3. 网络连接正常")
        sys.exit(1)

    print("\n" + "="*60)
    print("✅ 所有测试通过!")
    print("="*60)
