# StepFun 图像生成集成

## 概述

后端新增 `StepFunImageProvider`，当 `DTR_IMAGE_PROVIDER=stepfun` 时通过 StepFun `/v1/images/generations` 生成梦境图片。Provider 出错时会抛出结构化 `AppError`，当前 `ImageGenerationService` 会捕获异常并静默回退到 mock 图片。

## 鉴权配置

`.env` 需要配置：

- `DTR_IMAGE_PROVIDER=stepfun`
- `DTR_IMAGE_API_KEY=<StepFun API Key>`
- `DTR_IMAGE_BASE_URL=`：留空使用 `https://api.stepfun.com/v1`
- `DTR_IMAGE_MODEL=`：留空使用 `step-2x-large`
- `DTR_IMAGE_TIMEOUT_SECONDS=`：留空使用 60 秒

## 参数映射表

| DreamRecord 字段 | StepFun 请求字段 | 说明 |
|---|---|---|
| `image_prompt` | `prompt` | 基础提示词 |
| `keywords` | `prompt` | 追加为 `Keywords: ...` |
| `scenes` | `prompt` | 追加为 `Scenes: ...` |
| 配置 `DTR_IMAGE_MODEL` | `model` | 默认 `step-2x-large` |
| 配置 `DTR_IMAGE_SIZE` | `size` | 留空使用模型默认尺寸 |
| 固定值 | `n` | 固定为 `1` |
| 固定值 | `response_format` | 固定为 `url` |

## 默认值与可调参数

| 参数 | 默认值 | 取值范围 |
|---|---|---|
| `size` | `1024x1024` | `step-2x-large`: `256x256` / `512x512` / `768x768` / `1024x1024` / `1280x800` / `800x1280` |
| `cfg_scale` | 留空使用 StepFun 默认，`step-2x-large` 默认 6 | 1~10 |
| `steps` | 留空使用 StepFun 默认，`step-2x-large` 默认 50 | 1~50 |
| `seed` | 留空随机 | 0~2147483647 |

## 错误码映射表

| HTTP 状态码 / 场景 | AppError code | message | status_code |
|---|---|---|---|
| 401 / 403 | `STEPFUN_AUTH_FAILED` | `StepFun 鉴权失败，请检查 DTR_IMAGE_API_KEY` | 502 |
| 400 / 422 | `STEPFUN_INVALID_REQUEST` | `StepFun 请求参数错误：{server_message}` | 502 |
| 429 重试耗尽 | `STEPFUN_RATE_LIMITED` | `StepFun 接口限流，请稍后重试` | 503 |
| 5xx 重试耗尽 | `STEPFUN_UPSTREAM_ERROR` | `StepFun 服务暂不可用` | 502 |
| 其他状态码 | `STEPFUN_UNEXPECTED_STATUS` | `StepFun 返回未预期状态码 {status}` | 502 |
| 超时重试耗尽 | `STEPFUN_TIMEOUT` | `StepFun 请求超时` | 504 |
| `data` 缺失或无 `url` | `STEPFUN_EMPTY_RESPONSE` | `StepFun 未返回图片` | 502 |
| `finish_reason=content_filtered` | `STEPFUN_CONTENT_FILTERED` | `提示词触发内容审核，请调整后重试` | 422 |

## 重试策略

默认 `DTR_IMAGE_MAX_RETRIES=2`，最多请求 3 次。仅对 `httpx.TimeoutException`、`httpx.TransportError`、HTTP 429、HTTP 5xx 重试。退避算法为 `0.5 * (2 ** attempt)` 秒，即 0.5s、1.0s、2.0s 递增。

## 测试方法

单元测试：

```bash
cd backend
pytest tests/test_stepfun_image_provider.py
```

手工脚本：

```bash
DTR_IMAGE_PROVIDER=stepfun python test_image_generation.py
```

## 已知限制

- StepFun 图像生成 `n` 仅支持 `1`。
- `prompt` 最大 512 字符，Provider 会硬截断。
- 返回的 URL 有效期为 30 天。
- 当前 service 层会捕获 Provider 异常并静默回退到 mock 图片，调用方不一定能直接看到 StepFun 错误。
