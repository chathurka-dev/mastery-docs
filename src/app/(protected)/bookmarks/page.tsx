import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getDocBySlug } from "@/docs/registry";
import { DocCard } from "@/components/docs/DocCard";
import { CATEGORY_STYLES } from "@/lib/constants";
import { Bookmark } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  const progress = await prisma.readingProgress.findMany({
    where: { userId: session!.user.id },
    select: { docSlug: true, completedAt: true },
  });
  const completedSlugs = new Set(progress.filter((p) => p.completedAt).map((p) => p.docSlug));

  const bookmarkedDocs = bookmarks
    .map((b) => getDocBySlug(b.docSlug))
    .filter(Boolean)
    .map((e) => e!.meta);

  return (
    <div className="px-4 py-8 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800">
          <Bookmark className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bookmarks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{bookmarkedDocs.length} saved {bookmarkedDocs.length === 1 ? "document" : "documents"}</p>
        </div>
      </div>

      {bookmarkedDocs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Bookmark className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No bookmarks yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Bookmark a document while reading to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedDocs.map((doc) => (
            <DocCard
              key={doc.slug}
              doc={doc}
              isBookmarked={true}
              isCompleted={completedSlugs.has(doc.slug)}
              categoryColor={CATEGORY_STYLES[doc.category]?.color ?? "#7c3aed"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
