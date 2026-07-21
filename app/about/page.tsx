import type { Metadata } from "next";
import { siteConfig } from "@/content/site.config";
import { experiences } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import { Timeline } from "@/components/about/timeline";
import { SkillGrid } from "@/components/about/skill-grid";
import { Download, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "关于我",
  description: `了解更多关于 ${siteConfig.name} 的经历和技术背景`,
};

const awards = [
  {
    title: "中国大学生计算机设计大赛西北地区 二等奖",
    date: "2025.06",
  },
  {
    title: "全国大学生市场调查与分析大赛陕西赛区本科组 三等奖",
    date: "2026.04",
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Page header */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            关于我
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            {siteConfig.bio}
          </p>
        </div>

        {/* Bio section */}
        <section className="mb-20">
          <div className="grid sm:grid-cols-3 gap-8 items-start">
            {/* Avatar placeholder */}
            <div className="flex justify-center sm:justify-start">
              <div className="w-40 h-40 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                头像
              </div>
            </div>
            <div className="sm:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                你好，我是{siteConfig.name}
              </h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  西京大学数据科学与大数据技术专业在读本科生。从大一开始自学编程，
                  对 AI / LLM 应用开发有着浓厚的兴趣和持续的投入。
                </p>
                <p>
                  擅长使用 Python 生态构建完整的 AI Agent 系统。从 LangGraph 智能体编排、
                  FastAPI 后端到 Streamlit 前端，能够独立完成从零到一的复杂项目交付。
                  熟悉 Docker 容器化部署、Prometheus 监控等 DevOps 实践。
                </p>
                <p>
                  目前正在寻找实习机会，希望能将 AI 工程能力应用到真实业务场景中，
                  在实战中持续成长。
                </p>
              </div>
              <a href="/resume.pdf" download>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  下载简历
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Education timeline */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-10">
            教育经历
          </h2>
          <Timeline items={experiences} />
        </section>

        {/* Awards */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-10">
            荣誉证书
          </h2>
          <div className="grid gap-4 max-w-lg mx-auto">
            {awards.map((award, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {award.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{award.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-10">
            技能详情
          </h2>
          <SkillGrid groups={skillGroups} />
        </section>
      </div>
    </div>
  );
}
