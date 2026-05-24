import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllDocs } from "@/docs/registry";
import { AppShell } from "@/components/layout/AppShell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const [bookmarks] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      select: { docSlug: true },
    }),
  ]);

  const docs = getAllDocs();
  const bookmarkedSlugs = bookmarks.map((b) => b.docSlug);

  return (
    <AppShell docs={docs} bookmarkedSlugs={bookmarkedSlugs}>
      {children}
    </AppShell>
  );
}
