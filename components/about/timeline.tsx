"use client";

import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import type { Experience } from "@/lib/types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  items: Experience[];
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  work: Briefcase,
  education: GraduationCap,
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-2 bottom-2 w-px bg-border" />

      <div className="flex flex-col gap-8">
        {items.map((item, i) => {
          const Icon = TYPE_ICONS[item.type] || Briefcase;
          const isWork = item.type === "work";
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex gap-6 sm:gap-0 ${
                isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-[12px] sm:left-1/2 sm:-translate-x-1/2 mt-1 z-10">
                <div className={`w-[15px] h-[15px] rounded-full border-2 border-border bg-surface flex items-center justify-center ${
                  isWork ? "border-primary" : "border-border"
                }`}>
                  <Icon className={`w-2.5 h-2.5 ${isWork ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>

              {/* Content */}
              <div className={`ml-12 sm:ml-0 sm:w-1/2 ${
                isLeft ? "sm:pr-10 sm:text-right" : "sm:pl-10"
              }`}>
                <div className={`rounded-xl border border-border bg-surface p-5 ${
                  isLeft ? "sm:text-right" : ""
                }`}>
                  <span className="inline-block text-xs font-medium text-primary mb-1">
                    {item.period}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.role}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {item.description}
                  </p>
                  {item.tech && (
                    <div className={`flex flex-wrap gap-1 mt-3 ${
                      isLeft ? "sm:justify-end" : ""
                    }`}>
                      {item.tech.map((t) => (
                        <Badge key={t} variant="outline">{t}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
