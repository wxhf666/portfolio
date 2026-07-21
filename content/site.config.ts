import type { SiteConfig } from "@/lib/types";

export const siteConfig: SiteConfig = {
  name: "王祥弘飞",
  title: "AI 应用开发工程师",
  bio: "西京大学数据科学与大数据技术专业在读。热衷于用代码解决实际问题，专注于 LLM / AI Agent 应用开发和全栈工程实践，具备从零构建复杂 AI 系统的能力。",
  location: "陕西 · 西安",
  email: "207817305@qq.com",
  siteUrl: "https://your-domain.com",
  roles: [
    "AI Agent 开发者",
    "LangGraph 实践者",
    "全栈工程师",
    "开源爱好者",
  ],
  navItems: [
    { label: "首页", href: "/" },
    { label: "项目", href: "/projects" },
    { label: "关于", href: "/about" },
    { label: "联系", href: "/contact" },
  ],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/WXHF666", icon: "github" },
    { label: "Email", href: "mailto:207817305@qq.com", icon: "mail" },
  ],
};
