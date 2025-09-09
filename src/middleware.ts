import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const middleware = withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;

    const pathname = req.nextUrl.pathname;
    const locales = routing.locales || [];
    const pathnameWithoutLocale = locales.some((locale) =>
      pathname.startsWith(`/${locale}/`)
    )
      ? pathname.replace(/^\/[^\/]+\//, "/")
      : pathname;

    const isAdminPage = pathnameWithoutLocale.startsWith("/admin");
    const userRole = token?.role;

    if (isAdminPage && userRole !== "ADMIN") {
      const locale = pathname.split("/")[1] as "lt" | "ru";
      const loginUrl = locales.includes(locale) ? `/${locale}/login` : "/login";

      return NextResponse.redirect(
        new URL(`${loginUrl}?error=insufficientPermissions`, req.url)
      );
    }

    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        const locales = routing.locales || [];
        const pathnameWithoutLocale = locales.some((locale) =>
          pathname.startsWith(`/${locale}/`)
        )
          ? pathname.replace(/^\/[^\/]+\//, "/")
          : pathname;

        const requiresAuth = [
          "/admin",
          "/account",
          "/my-courses",
          "/courses",
          "/user",
          "/cart",
          "/checkout-success",
        ].some((path) => pathnameWithoutLocale.startsWith(path));

        return requiresAuth ? !!token : true;
      },
    },
  }
);

export default middleware;

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
    "/",
    "/(lt|ru|en|de|fr|es)/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/my-courses/:path*",
    "/calendar/:path*",
  ],
};
