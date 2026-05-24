import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getDocBySlug } from "@/docs/registry";
import { DocViewer } from "@/components/docs/DocViewer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDocBySlug(slug);
  if (!entry) return { title: "Not Found" };
  return { title: entry.meta.title };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const entry = getDocBySlug(slug);
  if (!entry) notFound();

  const session = await auth.api.getSession({ headers: await headers() });

  const [bookmark, progress, notes] = await Promise.all([
    prisma.bookmark.findUnique({ where: { userId_docSlug: { userId: session!.user.id, docSlug: slug } } }),
    prisma.readingProgress.findUnique({ where: { userId_docSlug: { userId: session!.user.id, docSlug: slug } } }),
    prisma.note.findMany({
      where: { userId: session!.user.id, docSlug: slug },
      orderBy: { createdAt: "desc" },
      select: { id: true, content: true, createdAt: true, updatedAt: true },
    }),
  ]);

  return (
    <DocViewer
      meta={entry.meta}
      component={entry.component}
      isBookmarked={!!bookmark}
      isCompleted={!!progress?.completedAt}
      initialNotes={notes}
    />
  );
}
