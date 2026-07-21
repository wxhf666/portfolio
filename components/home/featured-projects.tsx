import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="px-4 sm:px-6 py-20" id="projects">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            精选项目
          </h2>
          <p className="mt-2 text-muted-foreground">
            这里展示了我最近的一些重点工作
          </p>
        </div>

        {/* Project grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Card
              key={project.slug}
              className="flex flex-col animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Project image */}
              <div className="aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <CardHeader className="p-0">
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
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
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 text-center">
          <Link href="/projects">
            <Button variant="outline" size="lg">
              查看全部项目
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
