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
import { meta as dotnetMasteryDay1Meta } from "./dotnet-mastery-day1/meta";
import DotNetMasteryDay1 from "./dotnet-mastery-day1/component";
import { meta as dotnetMasteryDay2Meta } from "./dotnet-mastery-day2/meta";
import DotNetMasteryDay2 from "./dotnet-mastery-day2/component";
import { meta as dotnetMasteryDay3Meta } from "./dotnet-mastery-day3/meta";
import DotNetMasteryDay3 from "./dotnet-mastery-day3/component";
import { meta as dotnetMasteryDay4Meta } from "./dotnet-mastery-day4/meta";
import DotNetMasteryDay4 from "./dotnet-mastery-day4/component";
import { meta as dotnetMasteryDay5Meta } from "./dotnet-mastery-day5/meta";
import DotNetMasteryDay5 from "./dotnet-mastery-day5/component";
import { meta as dotnetMasteryDay6Meta } from "./dotnet-mastery-day6/meta";
import DotNetMasteryDay6 from "./dotnet-mastery-day6/component";
import { meta as dotnetMasteryDay7Meta } from "./dotnet-mastery-day7/meta";
import DotNetMasteryDay7 from "./dotnet-mastery-day7/component";
import { meta as projectWalkthroughMeta } from "./project-walkthrough/meta";
import ProjectWalkthrough from "./project-walkthrough/component";

const registry: DocEntry[] = [
  { meta: dotnetMeta, component: DotNetComponent },
  { meta: dotnetMasteryMeta, component: DotNetMasteryGuide },
  { meta: dotnetMasteryDay1Meta, component: DotNetMasteryDay1 },
  { meta: dotnetMasteryDay2Meta, component: DotNetMasteryDay2 },
  { meta: dotnetMasteryDay3Meta, component: DotNetMasteryDay3 },
  { meta: dotnetMasteryDay4Meta, component: DotNetMasteryDay4 },
  { meta: dotnetMasteryDay5Meta, component: DotNetMasteryDay5 },
  { meta: dotnetMasteryDay6Meta, component: DotNetMasteryDay6 },
  { meta: dotnetMasteryDay7Meta, component: DotNetMasteryDay7 },
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
