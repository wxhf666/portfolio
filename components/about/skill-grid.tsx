"use client";

import { motion } from "framer-motion";
import type { SkillGroup } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface SkillGridProps {
  groups: SkillGroup[];
}

export function SkillGrid({ groups }: SkillGridProps) {
  return (
    <div className="space-y-8">
      {groups.map((group, gi) => (
        <motion.div
          key={group.category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: gi * 0.1 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {group.category}
          </h3>
          <div className="space-y-3">
            {group.skills.map((skill, si) => (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium text-foreground shrink-0">
                  {skill.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(skill.level || 0) * 20}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.1 + si * 0.05, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <Badge variant="outline" className="w-8 justify-center shrink-0">
                  {skill.level || 0}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
