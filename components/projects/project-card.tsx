import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import type { Project } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <Card className="h-full flex flex-col">
        {/* Thumbnail */}
        <div className="aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm group-hover:text-primary transition-colors">
            {project.title}
          </div>
        </div>

        <CardHeader className="p-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <span className="text-xs text-muted-foreground whitespace-nowrap mt-1">
              {project.year}
            </span>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-0 mt-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="outline">+{project.tags.length - 4}</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-0">
          <div className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                演示
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                源码
              </a>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
