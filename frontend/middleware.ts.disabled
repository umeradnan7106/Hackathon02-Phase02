import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
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
  } catch (error) {
    // If middleware fails, allow the request to continue
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/tasks/:path*",
  ],
};
