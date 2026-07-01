import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy.ts — Next.js 16+
 * ⚠️  "middleware.ts" is DEPRECATED. The file is now "proxy.ts"
 *     with the exported function named `proxy` (not `middleware`).
 *
 * Supabase integration note:
 *   Replace the cookie check with `createServerClient` from @supabase/ssr
 *   and call `supabase.auth.getUser()` to validate the JWT server-side.
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get("session")?.value;

    // ── Protect /dashboard/* ─────────────────────────────────────────────────
    if (pathname.startsWith("/dashboard")) {
        if (!session) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ── Redirect authenticated users away from auth pages ────────────────────
    if ((pathname === "/login" || pathname === "/signup") && session) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
