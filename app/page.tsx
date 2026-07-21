import { Hero } from "@/components/home/hero";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { SkillSummary } from "@/components/home/skill-summary";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillSummary />
    </>
  );
}
