import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
});

export function getPublicAuthBaseUrl() {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  });

  if (!parsed.success) {
    throw new Error("NEXT_PUBLIC_BETTER_AUTH_URL must be a valid URL");
  }

  return (
    parsed.data.NEXT_PUBLIC_BETTER_AUTH_URL ??
    (typeof window !== "undefined" ? window.location.origin : undefined)
  );
}
