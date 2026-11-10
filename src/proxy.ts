import { type NextRequest, NextResponse } from "next/server";
import { authEnv, SESSION_COOKIE, verifyToken } from "@/lib/auth/token";

// Runs before every request (except the ones excluded below): no valid session -> login page.
// This is the fast first check; requireSession() guards the data itself.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifyToken(token, authEnv("SESSION_SECRET"))) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  // Everything except the login page itself and static files.
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
