"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  speed: 300,
  minimum: 0.08,
});

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const originalPush = router.push;

    router.push = (...args) => {
      NProgress.start();
      return originalPush.apply(router, args);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest(".ignore-progress")) {
        return;
      }

      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (
        !href ||
        !href.startsWith("/") ||
        href.startsWith("/#") ||
        link.target === "_blank"
      )
        return;

      const currentPath = window.location.pathname + window.location.search;
      const currentPathWithoutLocale = currentPath.replace(
        /^\/[a-z]{2}(\/|$)/,
        "/"
      );
      const normalizedTarget = href.startsWith("/") ? href : "/" + href;

      if (currentPathWithoutLocale !== normalizedTarget) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      router.push = originalPush;
    };
  }, [router]);

  return null;
}
