"use client";

import { useState, useMemo } from "react";
import { projects } from "@/content/projects";
import type { ProjectCategory } from "@/lib/types";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilter } from "@/components/projects/project-filter";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    projects.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(
    () =>
      category === "all"
        ? projects
        : projects.filter((p) => p.category === category),
    [category]
  );

  return (
    <div className="px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            项目作品
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-muted-foreground"
          >
            精选全栈开发项目，涵盖前后端、DevOps 等领域
          </motion.p>
        </div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <ProjectFilter
            selected={category}
            onSelect={setCategory}
            counts={counts}
          />
        </motion.div>

        {/* Project grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            暂无该类别的项目
          </p>
        )}
      </div>
    </div>
  );
}
