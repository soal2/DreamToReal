# Dream to Real Agent 前端接口文档

本文档用于前端对接 Dream to Real Agent FastAPI 后端 MVP。

## 1. 基础信息

本地开发地址：

```text
http://127.0.0.1:8000
```

API 前缀：

```text
/api/v1
```

启动后端：

```bash
cd /Users/eversse/Documents/codes/DTR
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```

静态图片访问前缀：

```text
/static/images/{filename}
```

例如：

```text
http://127.0.0.1:8000/static/images/old-house.svg
```

## 2. 通用约定

请求体统一使用 JSON：

```http
Content-Type: application/json
```

时间字段为 ISO 字符串：

```text
2026-06-28T05:48:00Z
```

列表接口支持分页：

```text
limit: 默认 20，范围 1-100
offset: 默认 0
```

后端启动时如果数据库为空，会自动注入 5 条演示梦境数据，保证档案页第一次打开不为空。

## 3. DreamRecord 字段

完整梦境记录结构：

```json
{
  "id": "dream_221eb56076a2",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道又长又暗……",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊……",
  "image_url": "/static/images/old-house.svg",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "image_generated",
  "created_at": "2026-06-28T05:48:00Z",
  "updated_at": "2026-06-28T05:49:00Z"
}
```

字段说明：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 梦境记录 ID |
| title | string | Agent 整理出的标题 |
| raw_text | string | 用户原始输入 |
| organized_text | string | Agent 整理后的梦境记录 |
| image_prompt | string | 用于生成图片的提示词 |
| image_url | string | 图片 URL；未生成时为空字符串 |
| keywords | string[] | 关键词 |
| emotions | string[] | 情绪标签 |
| scenes | string[] | 场景标签 |
| source | string | `text` 或 `voice`，MVP 默认 `text` |
| status | string | `organized` 或 `image_generated` |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

## 4. 健康检查

### GET `/api/v1/health`

用于确认后端是否启动。

响应：

```json
{
  "status": "ok",
  "service": "dream-to-real-agent-backend",
  "version": "0.1.0"
}
```

前端建议：

- 应用启动或开发调试时可调用。
- 不需要在用户主流程里频繁轮询。

## 5. 创建梦境记录

### POST `/api/v1/dreams`

首页提交用户梦境文本。后端会完成输入校验、Agent 整理、保存 DreamRecord，并返回完整记录。

请求体：

```json
{
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "source": "text",
  "generate_image": false
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| raw_text | string | 是 | 用户输入的梦境碎片，长度 5-3000 |
| source | string | 否 | `text` 或 `voice`，默认 `text` |
| generate_image | boolean | 否 | 是否创建时立即生成图片；建议前端详情页再单独触发 |

成功响应：`201 Created`

```json
{
  "id": "dream_221eb56076a2",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道又长又暗……",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊……",
  "image_url": "",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "organized",
  "created_at": "2026-06-28T05:48:00Z",
  "updated_at": "2026-06-28T05:48:00Z"
}
```

前端建议：

- 创建成功后跳转详情页：`/dreams/{id}`。
- 创建中展示“正在整理梦境”加载态。
- `image_url` 为空时，详情页显示生成图片按钮或占位图。

## 6. 查询梦境列表

### GET `/api/v1/dreams`

用于档案页列表。

查询参数：

```text
limit=20
offset=0
```

示例：

```http
GET /api/v1/dreams?limit=20&offset=0
```

成功响应：`200 OK`

```json
{
  "items": [
    {
      "id": "dream_demo_old_house",
      "title": "在老房子里找门",
      "image_url": "/static/images/old-house.svg",
      "keywords": ["老房子", "走廊", "找门"],
      "emotions": ["焦虑", "迷失"],
      "scenes": ["老房子", "走廊"],
      "status": "image_generated",
      "created_at": "2026-06-28T05:48:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

前端建议：

- 档案卡片使用 `title`、`image_url`、`keywords`、`emotions`、`created_at`。
- 如果 `image_url` 为空，显示默认占位图。
- 点击卡片进入详情：`GET /api/v1/dreams/{id}`。

## 7. 查询梦境详情

### GET `/api/v1/dreams/{dream_id}`

用于详情页展示完整梦境记录。

示例：

```http
GET /api/v1/dreams/dream_demo_old_house
```

成功响应：`200 OK`

```json
{
  "id": "dream_demo_old_house",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道很长也很暗……",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊……",
  "image_url": "/static/images/old-house.svg",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "image_generated",
  "created_at": "2026-06-28T05:48:00Z",
  "updated_at": "2026-06-28T05:48:00Z"
}
```

记录不存在：`404 Not Found`

```json
{
  "error": {
    "code": "DREAM_NOT_FOUND",
    "message": "没有找到这条梦境记录。"
  }
}
```

前端建议：

- 详情页展示 `raw_text` 和 `organized_text`。
- 图片区域优先使用 `image_url`。
- `image_url` 为空时展示“生成画面”按钮。
- 404 时回到档案页并提示记录不存在。

## 8. 重新整理梦境

### POST `/api/v1/dreams/{dream_id}/reorganize`

根据原始 `raw_text` 重新调用 Agent，更新标题、整理文本、关键词、情绪、场景和图片提示词。

请求体可以为空对象：

```json
{}
```

示例：

```http
POST /api/v1/dreams/dream_demo_old_house/reorganize
```

成功响应：`200 OK`

返回更新后的完整 DreamRecord：

```json
{
  "id": "dream_demo_old_house",
  "title": "在老房子里找门",
  "raw_text": "老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
  "organized_text": "梦里我在一栋很旧的房子里，楼道又长又暗……",
  "image_prompt": "写实电影感，一个很旧的公寓楼走廊……",
  "image_url": "",
  "keywords": ["老房子", "走廊", "找门"],
  "emotions": ["焦虑", "迷失"],
  "scenes": ["老房子", "走廊"],
  "source": "text",
  "status": "organized",
  "created_at": "2026-06-28T05:48:00Z",
  "updated_at": "2026-06-28T05:52:00Z"
}
```

前端建议：

- 按钮文案可以是“重新整理”。
- 调用中禁用按钮，展示 loading。
- 成功后直接用响应刷新详情页状态。
- 重新整理后 `image_url` 会被清空，用户需要重新生成图片。

## 9. 生成梦境图片

### POST `/api/v1/dreams/{dream_id}/generate-image`

根据 DreamRecord 的 `image_prompt` 生成或返回兜底图片，并更新 `image_url`。

请求体：

```json
{
  "use_mock": false
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| use_mock | boolean | 否 | 是否强制使用 mock 图片；演示时可传 `true` |

成功响应：`200 OK`

```json
{
  "id": "dream_demo_old_house",
  "image_url": "/static/images/old-house.svg",
  "status": "image_generated"
}
```

前端建议：

- 详情页点击“生成画面”时调用。
- 成功后用返回的 `image_url` 更新图片区域。
- 当前 MVP 返回 SVG mock 图片，前端可直接作为 `img src` 使用。
- 拼接完整 URL 时使用：`http://127.0.0.1:8000` + `image_url`。

## 10. 删除梦境记录

### DELETE `/api/v1/dreams/{dream_id}`

删除单条梦境记录。

示例：

```http
DELETE /api/v1/dreams/dream_demo_old_house
```

成功响应：`204 No Content`

响应体为空。

记录不存在：`404 Not Found`

```json
{
  "error": {
    "code": "DREAM_NOT_FOUND",
    "message": "没有找到这条梦境记录。"
  }
}
```

前端建议：

- 删除前弹确认框。
- 删除成功后从列表移除，或跳回档案页。

## 11. 错误响应格式

业务错误统一格式：

```json
{
  "error": {
    "code": "DREAM_NOT_FOUND",
    "message": "没有找到这条梦境记录。"
  }
}
```

常见错误码：

| HTTP 状态 | code | 说明 |
|---:|---|---|
| 400 | DREAM_TEXT_EMPTY | 梦境文本为空 |
| 400 | DREAM_TEXT_TOO_SHORT | 梦境文本少于 5 个字符 |
| 400 | DREAM_TEXT_TOO_LONG | 梦境文本超过 3000 个字符 |
| 400 | INVALID_SOURCE | source 不是 `text` 或 `voice` |
| 404 | DREAM_NOT_FOUND | 梦境记录不存在 |
| 422 | REQUEST_VALIDATION_FAILED | 请求 JSON 或参数格式不正确 |

前端建议：

- 优先展示 `error.message`。
- 如果没有 `error.message`，展示通用错误文案。

## 12. 推荐前端调用流程

首页输入梦境：

```text
POST /api/v1/dreams
→ 得到 DreamRecord.id
→ 跳转详情页
```

档案页：

```text
GET /api/v1/dreams?limit=20&offset=0
→ 渲染 items
```

详情页：

```text
GET /api/v1/dreams/{dream_id}
→ 展示 raw_text / organized_text / image_url
```

重新整理：

```text
POST /api/v1/dreams/{dream_id}/reorganize
→ 用返回的 DreamRecord 刷新详情页
```

生成图片：

```text
POST /api/v1/dreams/{dream_id}/generate-image
→ 用返回的 image_url 更新图片区域
```

删除记录：

```text
DELETE /api/v1/dreams/{dream_id}
→ 跳转档案页或刷新列表
```

## 13. TypeScript 类型参考

```ts
export type DreamStatus = "organized" | "image_generated" | "draft" | "failed";
export type DreamSource = "text" | "voice";

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

export interface GenerateImageRequest {
  use_mock?: boolean;
}

export interface DreamImageResponse {
  id: string;
  image_url: string;
  status: DreamStatus;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
```
