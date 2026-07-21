import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "AI & 大模型",
    skills: [
      { name: "LangGraph", level: 5, icon: "langgraph" },
      { name: "LangChain", level: 4, icon: "langchain" },
      { name: "DeepSeek API", level: 5, icon: "deepseek" },
      { name: "Ollama", level: 4, icon: "ollama" },
      { name: "RAG / 向量检索", level: 4, icon: "rag" },
      { name: "ChromaDB", level: 4, icon: "chromadb" },
    ],
  },
  {
    category: "后端开发",
    skills: [
      { name: "Python", level: 5, icon: "python" },
      { name: "FastAPI", level: 5, icon: "fastapi" },
      { name: "Java", level: 3, icon: "java" },
      { name: "PostgreSQL", level: 4, icon: "postgresql" },
      { name: "Redis", level: 4, icon: "redis" },
      { name: "SQLite", level: 4, icon: "sqlite" },
    ],
  },
  {
    category: "DevOps & 工具",
    skills: [
      { name: "Docker", level: 5, icon: "docker" },
      { name: "Git / GitHub", level: 5, icon: "git" },
      { name: "Prometheus", level: 4, icon: "prometheus" },
      { name: "MinIO", level: 3, icon: "minio" },
      { name: "Meilisearch", level: 3, icon: "meilisearch" },
      { name: "Linux", level: 4, icon: "linux" },
    ],
  },
  {
    category: "前端 & 数据",
    skills: [
      { name: "Streamlit", level: 5, icon: "streamlit" },
      { name: "pandas", level: 4, icon: "pandas" },
      { name: "TypeScript", level: 2, icon: "typescript" },
      { name: "React / Next.js", level: 2, icon: "react" },
    ],
  },
];
