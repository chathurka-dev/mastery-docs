export function sanitizeCallbackUrl(value: string | null | undefined) {
  if (!value) return "/";

  const trimmed = value.trim();

  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\")
  ) {
    return "/";
  }

  return trimmed;
}
