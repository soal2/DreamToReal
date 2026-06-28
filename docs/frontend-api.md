# Dream to Real Agent 后端接口文档

面向前端接入，内容按当前后端代码生成。

## 1. 服务信息

本地默认地址：

```text
http://127.0.0.1:8000
```

API 前缀：

```text
/api/v1
```

静态资源前缀（仅 mock 图片会用到）：

```text
/static
```

mock 图片 URL 示例：

```text
http://127.0.0.1:8000/static/images/old-house.svg
```

启动服务：

```bash
cd /Users/eversse/Documents/codes/DTR
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```

初始化 SQLite 数据库：

```bash
PYTHONPATH=backend python3 backend/scripts/init_db.py
```

初始化并写入演示数据：

```bash
PYTHONPATH=backend python3 backend/scripts/init_db.py --seed-demo-data
```

## 2. 接入约定

请求体统一使用 JSON：

```http
Content-Type: application/json
```

时间字段为 ISO 字符串，例如：

```text
2026-06-28T06:30:00Z
```

后端默认使用 mock 梦境整理和 mock 图片生成。`DTR_IMAGE_PROVIDER=openai` 或 `stepfun` 时会调用真实图片 Provider；真实图片生成失败时，接口会自动回退 mock 图片，保证演示闭环可用。

`image_url` 的取值规则：

- StepFun 真实生成成功时，`image_url` 是 StepFun 直接返回的完整公网 URL，例如 `https://res.stepfun.com/image_gen/...png?...`。
- mock 图片生成时，`image_url` 是本地相对路径，例如 `/static/images/old-house.svg`。
- 前端展示图片时需要同时兼容绝对 URL 和相对路径。

## 3. 数据类型

### DreamRecord

详情和创建接口返回完整 DreamRecord：

```json
{
  "id": "dream_demo_old_house",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道很长也很暗。我一直找门，却总觉得方向被拉远。",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊，远处门口透进柔和光线，日常空间里有轻微梦感。",
  "image_url": "https://res.stepfun.com/image_gen/20260628/019f0d2fe46075bc95ca1e368229d464.png?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=...",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "image_generated",
  "created_at": "2026-06-28T06:30:00Z",
  "updated_at": "2026-06-28T06:30:00Z"
}
```

字段说明：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 梦境记录 ID |
| title | string | 整理后的标题 |
| raw_text | string | 用户原始梦境文本 |
| organized_text | string | Agent 整理后的梦境记录 |
| image_prompt | string | 图片生成提示词 |
| image_url | string | 图片 URL；StepFun 成功时是完整公网 URL，mock 时是本地相对路径，未生成时为空字符串 |
| keywords | string[] | 关键词 |
| emotions | string[] | 情绪标签 |
| scenes | string[] | 场景标签 |
| source | string | `text` 或 `voice` |
| status | string | 当前主要为 `organized` / `image_generated` |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

### DreamListItem

列表接口只返回卡片需要的字段：

```json
{
  "id": "dream_demo_old_house",
  "title": "在老房子里找门",
  "image_url": "https://res.stepfun.com/image_gen/20260628/019f0d2fe46075bc95ca1e368229d464.png?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=...",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "status": "image_generated",
  "created_at": "2026-06-28T06:30:00Z"
}
```

## 4. 健康检查

### GET `/api/v1/health`

确认服务是否正常运行。

响应 `200 OK`：

```json
{
  "status": "ok",
  "service": "dream-to-real-agent-backend",
  "version": "0.1.0"
}
```

curl：

```bash
curl http://127.0.0.1:8000/api/v1/health
```

## 5. 创建梦境

### POST `/api/v1/dreams`

提交原始梦境文本，后端会整理、保存并返回完整 DreamRecord。

请求体：

```json
{
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "source": "text",
  "generate_image": false
}
```

请求字段：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---:|---|---|
| raw_text | string | 是 | 无 | 用户输入的梦境文本 |
| source | string | 否 | `text` | 只能是 `text` 或 `voice` |
| generate_image | boolean | 否 | `false` | 是否创建后立即生成图片 |

响应 `201 Created`：

```json
{
  "id": "dream_221eb56076a2",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道又长又暗。我一直在找一扇门……",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊，墙皮轻微脱落……",
  "image_url": "",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "organized",
  "created_at": "2026-06-28T06:30:00Z",
  "updated_at": "2026-06-28T06:30:00Z"
}
```

curl：

```bash
curl -X POST http://127.0.0.1:8000/api/v1/dreams \
  -H 'Content-Type: application/json' \
  -d '{
    "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
    "source": "text",
    "generate_image": false
  }'
```

前端建议：

- 创建中展示“正在整理梦境”。
- 创建成功后使用返回的 `id` 跳转详情页。
- `generate_image=false` 时，详情页再让用户点击“生成画面”。

## 6. 查询梦境列表

### GET `/api/v1/dreams`

档案页列表接口。

Query 参数：

| 参数 | 类型 | 默认值 | 约束 | 说明 |
|---|---|---:|---|---|
| limit | number | 20 | 1-100 | 每页条数 |
| offset | number | 0 | >= 0 | 偏移量 |

示例：

```http
GET /api/v1/dreams?limit=20&offset=0
```

响应 `200 OK`：

```json
{
  "items": [
    {
      "id": "dream_demo_old_house",
      "title": "在老房子里找门",
      "image_url": "https://res.stepfun.com/image_gen/20260628/019f0d2fe46075bc95ca1e368229d464.png?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=...",
      "keywords": ["老房子", "走廊", "找门"],
      "emotions": ["焦虑", "迷失"],
      "scenes": ["老房子", "走廊"],
      "status": "image_generated",
      "created_at": "2026-06-28T06:30:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

curl：

```bash
curl 'http://127.0.0.1:8000/api/v1/dreams?limit=20&offset=0'
```

前端建议：

- 列表卡片使用 `title`、`image_url`、`keywords`、`emotions`、`created_at`。
- `image_url` 为空时显示前端占位图。
- `image_url` 可能是 `https://...` 绝对 URL，也可能是 `/static/...` 相对路径。
- 点击卡片后请求详情接口。

## 7. 查询梦境详情

### GET `/api/v1/dreams/{dream_id}`

详情页读取完整 DreamRecord。

路径参数：

| 参数 | 类型 | 说明 |
|---|---|---|
| dream_id | string | 梦境记录 ID |

响应 `200 OK`：

```json
{
  "id": "dream_demo_old_house",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道很长也很暗。我一直找门，却总觉得方向被拉远。",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊，远处门口透进柔和光线，日常空间里有轻微梦感。",
  "image_url": "https://res.stepfun.com/image_gen/20260628/019f0d2fe46075bc95ca1e368229d464.png?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=...",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "image_generated",
  "created_at": "2026-06-28T06:30:00Z",
  "updated_at": "2026-06-28T06:30:00Z"
}
```

记录不存在响应 `404 Not Found`：

```json
{
  "error": {
    "code": "DREAM_NOT_FOUND",
    "message": "没有找到这条梦境记录。"
  }
}
```

curl：

```bash
curl http://127.0.0.1:8000/api/v1/dreams/dream_demo_old_house
```

前端建议：

- 详情页展示 `raw_text`、`organized_text`、`keywords`、`emotions`、`scenes`。
- 图片区域使用 `image_url`；如果是相对路径再拼接后端 origin，绝对 URL 直接使用。
- 404 时提示记录不存在，并返回档案页。

## 8. 重新整理梦境

### POST `/api/v1/dreams/{dream_id}/reorganize`

根据已有记录的 `raw_text` 重新整理，并更新记录。

请求体可以为空：

```json
{}
```

当前 Schema 预留了 `style` 字段，但 Service 暂未使用：

```json
{
  "style": "natural"
}
```

响应 `200 OK`：

返回更新后的完整 DreamRecord。重新整理会清空 `image_url`，并把 `status` 改回 `organized`。

```json
{
  "id": "dream_demo_old_house",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道又长又暗。我一直在找一扇门……",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊，墙皮轻微脱落……",
  "image_url": "",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "organized",
  "created_at": "2026-06-28T06:30:00Z",
  "updated_at": "2026-06-28T06:35:00Z"
}
```

curl：

```bash
curl -X POST http://127.0.0.1:8000/api/v1/dreams/dream_demo_old_house/reorganize \
  -H 'Content-Type: application/json' \
  -d '{}'
```

前端建议：

- 成功后直接用响应刷新详情页。
- 因为 `image_url` 会被清空，重新整理后需要重新生成图片。

## 9. 生成梦境图片

### POST `/api/v1/dreams/{dream_id}/generate-image`

根据记录中的 `image_prompt` 生成图片，并更新 `image_url` 与 `status`。

请求体：

```json
{
  "use_mock": false
}
```

请求字段：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---:|---|---|
| use_mock | boolean | 否 | `false` | 是否强制使用 mock 图片 |

响应 `200 OK`：

```json
{
  "id": "dream_demo_old_house",
  "image_url": "https://res.stepfun.com/image_gen/20260628/019f0d2fe46075bc95ca1e368229d464.png?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=...",
  "status": "image_generated"
}
```

curl：

```bash
curl -X POST http://127.0.0.1:8000/api/v1/dreams/dream_demo_old_house/generate-image \
  -H 'Content-Type: application/json' \
  -d '{"use_mock": true}'
```

前端建议：

- 详情页点击“生成画面”时调用。
- 成功后用返回的 `image_url` 更新图片区域。
- StepFun 成功时会返回完整 `https://res.stepfun.com/...` URL，前端直接作为 `img src`。
- mock 图片返回 `/static/images/...` 相对路径，前端需要拼接后端 origin：`http://127.0.0.1:8000` + `image_url`。
- 如果真实图片 Provider 配置失败或调用失败，后端会回退 mock 图片。

## 10. 删除梦境

### DELETE `/api/v1/dreams/{dream_id}`

删除单条梦境记录。

响应 `204 No Content`：

响应体为空。

记录不存在响应 `404 Not Found`：

```json
{
  "error": {
    "code": "DREAM_NOT_FOUND",
    "message": "没有找到这条梦境记录。"
  }
}
```

curl：

```bash
curl -X DELETE http://127.0.0.1:8000/api/v1/dreams/dream_demo_old_house
```

前端建议：

- 删除前弹确认。
- 删除成功后跳转档案页或刷新列表。

## 11. 错误响应

业务错误统一格式：

```json
{
  "error": {
    "code": "DREAM_NOT_FOUND",
    "message": "没有找到这条梦境记录。"
  }
}
```

当前后端可能返回的常见错误：

| HTTP 状态 | code | 触发场景 |
|---:|---|---|
| 400 | DREAM_TEXT_EMPTY | `raw_text` 为空 |
| 400 | DREAM_TEXT_TOO_SHORT | `raw_text` 少于 5 个字符 |
| 400 | DREAM_TEXT_TOO_LONG | `raw_text` 超过 3000 个字符 |
| 400 | INVALID_SOURCE | `source` 不是 `text` 或 `voice` |
| 404 | DREAM_NOT_FOUND | 记录不存在 |
| 422 | REQUEST_VALIDATION_FAILED | JSON 结构或 Query 参数校验失败 |
| 500 | MISSING_CONFIG | 配置真实 Provider 但缺少必要 API Key |

前端处理建议：

- 优先展示 `error.message`。
- 没有标准错误体时展示通用错误文案，例如“请求失败，请稍后重试”。

## 12. 前端推荐流程

首页创建：

```text
POST /api/v1/dreams
→ 取 response.id
→ 跳转详情页
```

档案页：

```text
GET /api/v1/dreams?limit=20&offset=0
→ 渲染 response.items
```

详情页：

```text
GET /api/v1/dreams/{dream_id}
→ 展示 DreamRecord
```

重新整理：

```text
POST /api/v1/dreams/{dream_id}/reorganize
→ 用完整 DreamRecord 响应覆盖本地详情状态
```

生成图片：

```text
POST /api/v1/dreams/{dream_id}/generate-image
→ 用 image_url 更新图片
```

删除：

```text
DELETE /api/v1/dreams/{dream_id}
→ 204 后返回列表页
```

## 13. TypeScript 类型

```ts
export type DreamSource = "text" | "voice";
export type DreamStatus = "organized" | "image_generated" | "draft" | "failed";

export interface DreamRecord {
  id: string;
  title: string;
  raw_text: string;
  organized_text: string;
  image_prompt: string;
  image_url: string;
  keywords: string[];
  emotions: string[];
  scenes: string[];
  source: DreamSource;
  status: DreamStatus;
  created_at: string;
  updated_at: string;
}

export interface DreamListItem {
  id: string;
  title: string;
  image_url: string;
  keywords: string[];
  emotions: string[];
  scenes: string[];
  status: DreamStatus;
  created_at: string;
}

export interface DreamListResponse {
  items: DreamListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateDreamRequest {
  raw_text: string;
  source?: DreamSource;
  generate_image?: boolean;
}

export interface ReorganizeDreamRequest {
  style?: string | null;
}

export interface GenerateDreamImageRequest {
  use_mock?: boolean;
}

export interface DreamImageResponse {
  id: string;
  image_url: string;
  status: DreamStatus;
}

export interface HealthResponse {
  status: "ok";
  service: string;
  version: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
```

## 14. Apifox 配置建议

建议新建环境：

```text
baseUrl = http://127.0.0.1:8000
```

接口 URL 使用：

```text
{{baseUrl}}/api/v1/dreams
```

注意：

- `GET /api/v1/dreams` 不需要 Body，只配置 Query 参数。
- `POST /api/v1/dreams` 才填写创建梦境的 JSON Body。
- 图片响应可能是 StepFun 绝对 URL，也可能是 mock 相对路径；只有相对路径需要拼接 `baseUrl`。
