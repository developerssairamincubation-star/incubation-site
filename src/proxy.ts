import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth/token";

/**
 * Early redirect for the admin area only. This is a convenience, not the
 * security boundary — requireAdmin() re-checks inside every admin page and
 * server action.
 */
export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const signedIn = await isValidSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!signedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (signedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
