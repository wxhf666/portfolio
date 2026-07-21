"use client";

import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/lib/types";
import { PROJECT_CATEGORY_LABELS } from "@/lib/types";

interface ProjectFilterProps {
  selected: ProjectCategory | "all";
  onSelect: (category: ProjectCategory | "all") => void;
  counts: Record<string, number>;
}

const ALL_CATEGORIES: Array<{ value: ProjectCategory | "all"; label: string }> = [
  { value: "all", label: "全部" },
  ...(Object.entries(PROJECT_CATEGORY_LABELS) as [ProjectCategory, string][]).map(
    ([value, label]) => ({ value, label })
  ),
];

export function ProjectFilter({ selected, onSelect, counts }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {ALL_CATEGORIES.map(({ value, label }) => {
        const count = value === "all"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[value] || 0;

        if (count === 0 && value !== "all") return null;

        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
              selected === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
            )}
          >
            {label}
            <span className={cn(
              "text-xs opacity-60",
              selected === value ? "text-primary-foreground" : ""
            )}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
