import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllDocs, getDocBySlug } from "@/docs/registry";
import { DocCard } from "@/components/docs/DocCard";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Library" };

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [bookmarks, progressList, userData] = await Promise.all([
    prisma.bookmark.findMany({ where: { userId }, select: { docSlug: true } }),
    prisma.readingProgress.findMany({
      where: { userId },
      select: { docSlug: true, completedAt: true, lastOpenedAt: true },
      orderBy: { lastOpenedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true },
    }),
  ]);

  const bookmarkedSlugs = new Set(bookmarks.map((b) => b.docSlug));
  const completedSlugs = new Set(progressList.filter((p) => p.completedAt).map((p) => p.docSlug));

  // Most recently opened non-completed doc for "Continue reading"
  const continueProgress = progressList.find((p) => !p.completedAt);
  const continueEntry = continueProgress ? getDocBySlug(continueProgress.docSlug) : null;

  const docs = getAllDocs();
  const categoriesWithDocs = CATEGORIES.filter((cat) => docs.some((d) => d.category === cat.id));

  const streak = userData?.currentStreak ?? 0;

  return (
    <div className="px-4 py-8 lg:px-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back,{" "}
          <span className="gradient-text">{session!.user.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-base">
          {docs.length} interactive {docs.length === 1 ? "document" : "documents"} across {categoriesWithDocs.length}{" "}
          {categoriesWithDocs.length === 1 ? "category" : "categories"}
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Docs", value: docs.length, color: "#7c3aed" },
          { label: "Completed", value: completedSlugs.size, color: "#10b981" },
          { label: "Bookmarked", value: bookmarkedSlugs.size, color: "#f59e0b" },
          { label: streak === 1 ? "Day Streak 🔥" : "Day Streak 🔥", value: streak, color: "#ef4444" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 shadow-sm"
          >
            <p className="text-2xl font-extrabold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
            {stat.label.startsWith("Day Streak") && userData && userData.longestStreak > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Best: {userData.longestStreak}d
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Continue reading banner */}
      {continueEntry && (
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-violet-200 dark:border-violet-800 shadow-sm px-5 py-4 flex items-center gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: CATEGORY_STYLES[continueEntry.meta.category]?.color + "22" }}
          >
            <span>{CATEGORY_STYLES[continueEntry.meta.category]?.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-0.5">Continue reading</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{continueEntry.meta.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{continueEntry.meta.readTime} min read</p>
          </div>
          <Link
            href={`/docs/${continueEntry.meta.slug}`}
            className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-2"
          >
            Resume →
          </Link>
        </div>
      )}

      {/* Docs by category */}
      {categoriesWithDocs.map((cat) => {
        const catDocs = docs.filter((d) => d.category === cat.id);
        return (
          <section key={cat.id} className="mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{cat.label}</h2>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5">
                {catDocs.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catDocs.map((doc) => (
                <DocCard
                  key={doc.slug}
                  doc={doc}
                  isBookmarked={bookmarkedSlugs.has(doc.slug)}
                  isCompleted={completedSlugs.has(doc.slug)}
                  categoryColor={cat.color}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
