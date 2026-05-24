import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
];

// Cookie names used by Better Auth (http and https variants)
const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPublic = isPublicPath(pathname);

  const hasSession = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.has(name)
  );

  if (!isPublic && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
