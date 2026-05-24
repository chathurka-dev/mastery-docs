"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getDocBySlug } from "@/docs/registry";

async function getAuthenticatedUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

function assertKnownDoc(docSlug: string) {
  if (!getDocBySlug(docSlug)) throw new Error("Document not found");
}

async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastReadDate: true },
  });
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  if (user.lastReadDate === today) return;

  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  const newStreak = user.lastReadDate === yesterday ? user.currentStreak + 1 : 1;
  const newLongest = Math.max(user.longestStreak, newStreak);

  await prisma.user.update({
    where: { id: userId },
    data: { currentStreak: newStreak, longestStreak: newLongest, lastReadDate: today },
  });
}

export async function toggleBookmark(docSlug: string, add: boolean) {
  const userId = await getAuthenticatedUserId();
  assertKnownDoc(docSlug);

  if (add) {
    await prisma.bookmark.upsert({
      where: { userId_docSlug: { userId, docSlug } },
      create: { userId, docSlug },
      update: {},
    });
  } else {
    await prisma.bookmark.deleteMany({ where: { userId, docSlug } });
  }
  revalidatePath("/");
  revalidatePath(`/docs/${docSlug}`);
}

export async function markCompleted(docSlug: string) {
  const userId = await getAuthenticatedUserId();
  assertKnownDoc(docSlug);

  await prisma.readingProgress.upsert({
    where: { userId_docSlug: { userId, docSlug } },
    create: { userId, docSlug, completedAt: new Date(), lastOpenedAt: new Date() },
    update: { completedAt: new Date(), lastOpenedAt: new Date() },
  });
  revalidatePath("/");
  revalidatePath(`/docs/${docSlug}`);
}

export async function unmarkCompleted(docSlug: string) {
  const userId = await getAuthenticatedUserId();
  assertKnownDoc(docSlug);

  await prisma.readingProgress.deleteMany({ where: { userId, docSlug } });
  revalidatePath("/");
  revalidatePath(`/docs/${docSlug}`);
}

export async function recordDocVisit(docSlug: string) {
  const userId = await getAuthenticatedUserId();
  assertKnownDoc(docSlug);

  await prisma.readingProgress.upsert({
    where: { userId_docSlug: { userId, docSlug } },
    create: { userId, docSlug, lastOpenedAt: new Date() },
    update: { lastOpenedAt: new Date() },
  });

  await updateStreak(userId);
}

export async function saveNote(
  docSlug: string,
  content: string,
  noteId?: string
): Promise<{ id: string; content: string; createdAt: Date; updatedAt: Date }> {
  const userId = await getAuthenticatedUserId();
  assertKnownDoc(docSlug);

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Note content cannot be empty");

  if (noteId) {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing || existing.userId !== userId) throw new Error("Not found");

    return prisma.note.update({
      where: { id: noteId },
      data: { content: trimmed },
      select: { id: true, content: true, createdAt: true, updatedAt: true },
    });
  }

  return prisma.note.create({
    data: { userId, docSlug, content: trimmed },
    select: { id: true, content: true, createdAt: true, updatedAt: true },
  });
}

export async function deleteNote(noteId: string) {
  const userId = await getAuthenticatedUserId();
  const existing = await prisma.note.findUnique({ where: { id: noteId } });
  if (!existing || existing.userId !== userId) throw new Error("Not found");

  await prisma.note.delete({ where: { id: noteId } });
}
