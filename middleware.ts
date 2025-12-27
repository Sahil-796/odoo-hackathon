import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("user_session");
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isPublicRoute = pathname.startsWith("/public") || pathname.startsWith("/api"); // Add other public prefixes if needed

    // 1. If user is NOT logged in and tries to access a protected route
    if (!session && !isAuthRoute && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. If user IS logged in and tries to access login/signup
    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
