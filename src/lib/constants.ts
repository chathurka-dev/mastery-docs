export const CATEGORIES = [
  { id: "languages", label: "Languages & Runtimes", color: "#7c3aed", icon: "⚡" },
  { id: "backend", label: "Backend Development", color: "#6366f1", icon: "🔧" },
  { id: "frontend", label: "Frontend Development", color: "#0ea5e9", icon: "🎨" },
  { id: "devops", label: "DevOps & Cloud", color: "#10b981", icon: "☁️" },
  { id: "cs", label: "CS Fundamentals", color: "#f59e0b", icon: "📐" },
  { id: "databases", label: "Databases", color: "#f43f5e", icon: "🗄️" },
  { id: "security", label: "Security", color: "#ef4444", icon: "🔒" },
  { id: "system", label: "System Design", color: "#8b5cf6", icon: "🏗️" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_STYLES: Record<string, { color: string; icon: string }> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, { color: c.color, icon: c.icon }])
);
