// middleware.ts
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const middleware = withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const userRole = token?.role;

    if (isAdminPage && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        const requiresAuth = ["/", "/admin", "/account"].some(
          (path) => pathname.startsWith(path)
        );
        return requiresAuth ? !!token : true;
      },
    },
  }
);

export default middleware;

export const config = {
  matcher: [
    // i18n routes
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",

    "/",
    "/admin/:path*",
    "/account/:path*",
    "/calendar/:path*",
  ],
};
