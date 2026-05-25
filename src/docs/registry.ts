import type { CategoryId } from "@/lib/constants";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  tags: string[];
  readTime: number; // minutes
  publishedAt: string;
  updatedAt: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  wordCount: number;
}

export interface DocEntry {
  meta: DocMeta;
  component: React.ComponentType;
}

import { meta as dotnetMeta } from "./dotnet-internals/meta";
import DotNetComponent from "./dotnet-internals/component";
import { meta as dotnetMasteryMeta } from "./dotnet-mastery/meta";
import DotNetMasteryGuide from "./dotnet-mastery/component";
import { meta as projectWalkthroughMeta } from "./project-walkthrough/meta";
import ProjectWalkthrough from "./project-walkthrough/component";

const registry: DocEntry[] = [
  { meta: dotnetMeta, component: DotNetComponent },
  { meta: dotnetMasteryMeta, component: DotNetMasteryGuide },
  { meta: projectWalkthroughMeta, component: ProjectWalkthrough },
];

export function getAllDocs(): DocMeta[] {
  return registry.map((d) => d.meta);
}

export function getDocsByCategory(category: CategoryId): DocMeta[] {
  return getAllDocs().filter((d) => d.category === category);
}

export function getDocBySlug(slug: string): DocEntry | undefined {
  return registry.find((d) => d.meta.slug === slug);
}
