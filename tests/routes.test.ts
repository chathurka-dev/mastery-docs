import { describe, expect, it } from "vitest";
import { sanitizeCallbackUrl } from "../src/lib/routes";

describe("sanitizeCallbackUrl", () => {
  it("keeps safe internal paths", () => {
    expect(sanitizeCallbackUrl("/docs/dotnet-internals")).toBe("/docs/dotnet-internals");
    expect(sanitizeCallbackUrl("/docs/dotnet-internals?section=gc")).toBe(
      "/docs/dotnet-internals?section=gc"
    );
  });

  it("falls back to the library for missing or external URLs", () => {
    expect(sanitizeCallbackUrl(null)).toBe("/");
    expect(sanitizeCallbackUrl("")).toBe("/");
    expect(sanitizeCallbackUrl("https://example.com/phish")).toBe("/");
    expect(sanitizeCallbackUrl("//example.com/phish")).toBe("/");
  });

  it("rejects backslash based URL confusion", () => {
    expect(sanitizeCallbackUrl("/\\example.com")).toBe("/");
  });
});
