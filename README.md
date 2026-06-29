# DreamToReal

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/soal2/DreamToReal) [![License](https://img.shields.io/badge/license-ISC-green.svg)](./LICENSE) [![Python](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/) [![React](https://img.shields.io/badge/react-19-61dafb.svg)](https://react.dev/) [![FastAPI](https://img.shields.io/badge/fastapi-0.135+-009688.svg)](https://fastapi.tiangolo.com/)

> **Dream to Real Agent** — 将梦境碎片整理为可视化叙事，让潜意识成为可追溯的视觉故事。

## ✨ 核心特性

- 📝 **多模态输入** — 支持文字输入与语音录入，降低记录门槛
- 🧠 **智能整理** — Agent 工作流自动将碎片化梦境整理为连贯叙事
- 🏷️ **标签提取** — 自动识别关键词、情绪标签与场景元素
- 🎨 **画面生成** — 根据梦境叙事生成对应插图，支持多图片 Provider
- 📚 **梦境档案** — 按时间线浏览、查看详情、重新整理或删除记录
- 📊 **洞察分析** — 汇总情绪与场景分布，形成个人梦境画像

## 🏗️ 架构概览

```
┌─────────────────┐      REST API      ┌─────────────────────┐
│                 │  ───────────────▶  │                     │
│   Frontend      │                    │   Backend           │
│   (React 19)    │ ◀───────────────  │   (FastAPI)         │
│                 │      JSON          │                     │
└─────────────────┘                    └──────────┬──────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                       ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
                       │  LLM Agent  │   │  Image Gen  │   │  SQLite DB  │
                       │ (LangGraph) │   │ (StepFun)   │   │             │
                       └─────────────┘   └─────────────┘   └─────────────┘
```

**后端 Agent 管道**（可切换 LangGraph / 线性回退）：

```
input_guard → dream_organizer → structure_validator → quality_guard
```

## 🚀 快速开始

### 前置要求

- **Python** 3.12+
- **Node.js** 18+
- **pip / npm**

### 后端

```bash
# 1. 安装依赖
pip install -r backend/requirements.txt

# 2. 初始化数据库
PYTHONPATH=backend python backend/scripts/init_db.py

# 3. （可选）写入演示数据
PYTHONPATH=backend python backend/scripts/init_db.py --seed-demo-data

# 4. 启动服务
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```

### 前端

```bash
# 1. 安装依赖
cd frontend
npm install

# 2. 启动开发服务器
npm run dev
```

### 环境变量

在 `backend/.env` 中配置（可选，默认为 Mock 模式）：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DTR_LLM_PROVIDER` | LLM Provider | `mock` |
| `DTR_LLM_API_KEY` | LLM API Key | — |
| `DTR_IMAGE_PROVIDER` | 图片 Provider | `mock` |
| `DTR_IMAGE_API_KEY` | 图片 API Key | — |
| `DTR_LOG_LEVEL` | 日志级别 | `INFO` |

## 🛠️ 技术栈

### 后端

| 技术 | 用途 |
|------|------|
| **FastAPI** | Web 框架 |
| **Pydantic / pydantic-settings** | 数据校验与配置管理 |
| **SQLite** | 数据库 |
| **LangGraph** | Agent 工作流编排（可选） |
| **StepFun** | LLM / 图片生成（支持 Mock） |
| **OpenAI SDK** | 兼容 OpenAI 接口的图片 Provider |

### 前端

| 技术 | 用途 |
|------|------|
| **React 19** | UI 框架 |
| **TypeScript** | 类型系统 |
| **Tailwind CSS v4** | 样式框架 |
| **Framer Motion** | 动画库 |
| **Vite** | 构建工具 |

## 📂 项目结构

```
.
├── backend/
│   ├── app/
│   │   ├── agents/              # Agent 工作流
│   │   │   ├── graph.py         # LangGraph 编排 / 线性管道
│   │   │   ├── nodes/           # 工作流节点（guard / organizer / validator）
│   │   │   ├── prompts.py       # 提示词管理
│   │   │   └── state.py         # Agent 状态定义
│   │   ├── api/v1/              # REST API 路由
│   │   │   ├── dreams.py        # 梦境 CRUD
│   │   │   └── health.py        # 健康检查
│   │   ├── models/              # SQLAlchemy 数据模型
│   │   ├── repositories/        # 数据访问层
│   │   ├── schemas/             # Pydantic 请求/响应模型
│   │   ├── services/            # 业务逻辑层
│   │   ├── providers/           # LLM / 图片 Provider（Mock / StepFun / OpenAI）
│   │   ├── storage/             # 本地图片存储
│   │   ├── core/                # 配置、数据库、异常
│   │   ├── data/                # 种子数据
│   │   └── main.py              # FastAPI 入口
│   ├── scripts/
│   │   └── init_db.py           # 数据库初始化
│   ├── tests/                   # 后端测试
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/               # 页面组件
│   │   │   ├── Home.tsx         # 首页（录入梦境）
│   │   │   ├── Archive.tsx      # 档案页（历史列表）
│   │   │   ├── DreamDetail.tsx  # 详情页
│   │   │   ├── Insight.tsx      # 洞察页
│   │   │   └── Profile.tsx      # 我的
│   │   ├── components/          # 通用组件
│   │   ├── services/            # API 服务层
│   │   ├── context/             # React Context（主题）
│   │   └── App.tsx              # 应用入口
│   └── package.json
└── docs/
    └── frontend-api.md          # 后端接口文档
```

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/v1/dreams` | 创建梦境记录 |
| `GET` | `/api/v1/dreams` | 获取梦境列表 |
| `GET` | `/api/v1/dreams/{id}` | 获取梦境详情 |
| `POST` | `/api/v1/dreams/{id}/reorganize` | 重新整理梦境 |
| `POST` | `/api/v1/dreams/{id}/generate-image` | 生成梦境图片 |
| `DELETE` | `/api/v1/dreams/{id}` | 删除梦境记录 |
| `GET` | `/api/v1/health` | 健康检查 |

详细接口文档：[docs/frontend-api.md](./docs/frontend-api.md)

## 🔧 开发说明

### 默认行为

- 后端启动时自动初始化 SQLite 数据库并写入演示数据（Mock 模式）。
- **无需任何 API Key**，使用内置 Mock Provider 即可完整体验 Demo 流程。
- 真实图片生成失败时，接口自动回退到 Mock 图片。

### Agent 工作流

- 首选 **LangGraph** 编排 Agent 管道。
- LangGraph 未安装时自动降级为**线性管道**：`input_guard → dream_organizer → structure_validator → quality_guard`。

### 前端预览形态

- 前端在浏览器中以**手机 App 容器**展示，宽度控制在 390px ~ 430px。
- 完整支持深色模式。

## 🧪 测试

```bash
# 后端测试
PYTHONPATH=backend pytest backend/tests -v

# 前端构建检查
cd frontend && npm run build
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交改动 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 📄 License

ISC License — 详见 [LICENSE](./LICENSE) 文件。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/soal2">soal2</a>
</p>
