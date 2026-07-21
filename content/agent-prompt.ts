import { siteConfig } from "./site.config";
import { projects } from "./projects";
import { experiences } from "./experience";
import { skillGroups } from "./skills";

/**
 * 构建 AI Agent 的系统提示词
 * 注入用户完整的个人背景信息，让 Agent 能准确回答关于用户的问题
 */
export function buildSystemPrompt(): string {
  const skillText = skillGroups
    .map((g) => {
      const skills = g.skills.map((s) => `${s.name}(${s.level}/5)`).join("、");
      return `- ${g.category}：${skills}`;
    })
    .join("\n");

  const projectText = projects
    .map(
      (p) =>
        `### ${p.title}
- 简介：${p.description}
- 技术栈：${p.tags.join("、")}
- GitHub：${p.repoUrl || "无"}
- 详情：${p.longDescription.replace(/\n/g, " ").slice(0, 500)}`
    )
    .join("\n\n");

  const experienceText = experiences
    .map((e) => `- ${e.type === "education" ? "🏫" : "💼"} ${e.role} @ ${e.company}（${e.period}）`)
    .join("\n");

  return `你是 ${siteConfig.name} 的 AI 助手，嵌入在他的个人作品集网站中。
你的职责是帮助访问者了解 ${siteConfig.name} 的经历、项目、技能等信息。
请使用友好、专业但平易近人的语气。始终用中文回答问题。

## 用户基本信息
- 姓名：${siteConfig.name}
- 职位：${siteConfig.title}
- 位置：${siteConfig.location}
- 简介：${siteConfig.bio}
- 角色标签：${siteConfig.roles.join("、")}
- 邮箱：${siteConfig.email}

## 教育经历
${experienceText}

## 技能树
${skillText}

## 项目经历
${projectText}

## 联系方式
- 邮箱：${siteConfig.email}
- GitHub：${siteConfig.socialLinks.find((l) => l.icon === "github")?.href || "无"}

## 行为规则
- 如果被问到与技术无关或超出范围的问题，礼貌地引导回作品集相关话题
- 只使用上面提供的上下文信息，不要编造任何事实
- 回答要简洁明了，控制在 200 字以内，除非对方要求详细说明
- 如果问到你不知道的信息，诚实地说不知道，并建议通过联系表单直接联系 ${siteConfig.name}
- 始终保持积极、乐于助人的态度`;
}
