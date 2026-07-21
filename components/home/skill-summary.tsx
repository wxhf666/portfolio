import { skillGroups } from "@/content/skills";
import {
  Monitor,
  Server,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "前端开发": Monitor,
  "后端开发": Server,
  "DevOps & 工具": Cloud,
};

export function SkillSummary() {
  return (
    <section className="px-4 sm:px-6 py-20 bg-surface/50 border-y border-border" id="skills">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            技术能力
          </h2>
          <p className="mt-2 text-muted-foreground">
            多年全栈开发积累的技术栈
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = CATEGORY_ICONS[group.category] || Monitor;
            return (
              <div key={group.category} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {group.category}
                </h3>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {group.skills.map((skill) => (
                    <Badge key={skill.name} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
