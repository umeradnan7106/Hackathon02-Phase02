import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || getTokenFromHeaders(request);
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ["/tasks"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated and trying to access login/signup, redirect to tasks
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Helper to check for token in localStorage (client-side check)
function getTokenFromHeaders(_request: NextRequest): string | undefined {
  // Since middleware runs on server, we check cookies
  // Client-side token from localStorage is handled by the API client
  return undefined;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
