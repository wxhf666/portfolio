// ========== 项目相关 ==========

export type ProjectCategory = "frontend" | "backend" | "fullstack" | "devops" | "other";

export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: ProjectCategory;
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  year: number;
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  frontend: "前端",
  backend: "后端",
  fullstack: "全栈",
  devops: "DevOps",
  other: "其他",
};

// ========== 经历相关 ==========

export interface Experience {
  id: string;
  type: "work" | "education";
  company: string;
  role: string;
  period: string;
  description: string;
  tech?: string[];
}

// ========== 技能相关 ==========

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: number; // 1-5, optional
  icon?: string; // Lucide icon name
}

// ========== 站点配置 ==========

export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  siteUrl: string;
  socialLinks: SocialLink[];
  navItems: NavItem[];
  roles: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}

// ========== 联系表单 ==========

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ========== 聊天 Agent ==========

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp?: number;
}

export interface ChatRequest {
  messages: Pick<ChatMessage, "role" | "content">[];
}

export interface ChatStreamChunk {
  type: "token" | "done" | "error";
  content?: string;
  message?: string;
}
