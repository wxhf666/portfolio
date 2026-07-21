import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "DataInsightAI",
    slug: "datainsight-ai",
    description:
      "基于 LangGraph 的 7 Agent 智能分析平台，支持 8 种格式文件上传，自动完成数据分析、SQL 查询、可视化与简历评审。",
    longDescription: `从零构建的智能数据分析与简历评审平台，核心亮点：

**架构设计：**
- 采用 Plan → Execute → Verify 三轮转架构，7 个 LangGraph Agent 协作
- 后端 FastAPI + SSE 流式推送，前端 Streamlit
- 集成 Prometheus 监控与日志链路追踪

**核心功能：**
- 支持 8 种格式文件上传（CSV、Excel、JSON、PDF 等）
- 自然语言驱动数据分析，自动生成 SQL 查询
- 智能可视化与报告生成
- 简历六大维度评分 + JD 匹配分析
- RAG 检索增强（ChromaDB + BAAI/bge-m3 向量化）

**技术栈：**
- 智能体框架：LangGraph、DeepSeek API
- 后端：FastAPI、SSE 流式推送、pandas、SQLite
- 向量数据库：ChromaDB、BAAI/bge-m3 Embedding
- 可观测性：Prometheus 监控、日志链路追踪
- 部署：Docker 容器化`,
    tags: [
      "Python",
      "LangGraph",
      "FastAPI",
      "Streamlit",
      "DeepSeek",
      "ChromaDB",
      "Prometheus",
      "Docker",
    ],
    category: "fullstack",
    image: "/images/project-datainsight.webp",
    repoUrl: "https://github.com/wxhf666/DataInsightAI",
    featured: true,
    year: 2025,
  },
  {
    title: "AI 业务中台",
    slug: "ai-business-platform",
    description:
      "从零构建的四层三纵架构 AI 业务中台，7 个微服务 + 1 个控制台，Docker 编排 13 容器一键启动。",
    longDescription: `从零构建的企业级 AI 业务中台系统，覆盖全链路 AI 能力。

**架构设计：**
- 四层三纵架构，7 个微服务 + 1 个管理控制台
- Docker Compose 编排 13 容器一键启动
- 自研 ABC + Factory + Config 共享模块，14 个 Backend 类支持 Mock/Real 双模式切换

**核心模块：**
- LangGraph Agent 智能客服（意图识别 → 多轮对话 → 工单生成）
- 多模态融合直播切片（视频解析 + 关键帧提取 + AI 摘要）
- 五维度销售考核系统
- ReAct 运营 Agent（自主分析数据 + 产出策略）

**企业级基础设施：**
- JWT 统一认证与权限管理
- 全链路追踪与日志收集（OpenTelemetry 风格）
- 统一异常处理与 API 标准响应
- 数据存储：PostgreSQL + Redis + MinIO + ChromaDB + Meilisearch`,
    tags: [
      "Python",
      "LangGraph",
      "FastAPI",
      "Docker",
      "PostgreSQL",
      "Redis",
      "MinIO",
      "ChromaDB",
      "Ollama",
      "Streamlit",
    ],
    category: "fullstack",
    image: "/images/project-business.webp",
    repoUrl: "https://github.com/wxhf666/ai-business-platform",
    featured: true,
    year: 2025,
  },
];
