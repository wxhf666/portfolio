import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "项目未找到" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

function renderDescription(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">
          {trimmed.slice(2, -2)}
        </h3>
      );
    }
    if (trimmed.startsWith("- ")) {
      return (
        <li key={i} className="text-muted-foreground ml-4 list-disc">
          {trimmed.slice(2)}
        </li>
      );
    }
    return (
      <p key={i} className="text-muted-foreground leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回项目列表
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.year}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm">
                  <ExternalLink className="w-3.5 h-3.5" />
                  在线演示
                </Button>
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <GithubIcon className="w-3.5 h-3.5" />
                  源代码
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="aspect-video rounded-xl bg-muted mb-10 overflow-hidden">
          <img
            src={project.image}
            alt={`${project.title} 项目截图`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="prose-custom">{renderDescription(project.longDescription)}</div>
      </div>
    </div>
  );
}
