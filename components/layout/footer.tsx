import Link from "next/link";
import { siteConfig } from "@/content/site.config";
import { Mail, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-8">
        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          &copy; {year} {siteConfig.name}. Built with{" "}
          <Heart className="inline-block w-3.5 h-3.5 text-red-500 fill-red-500 -mt-0.5" />{" "}
          using Next.js &amp; Tailwind.
        </p>

        {/* Social */}
        <div className="flex items-center gap-3">
          {siteConfig.socialLinks.map((link) => {
            const Icon = ICON_MAP[link.icon] || Mail;
            return (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
