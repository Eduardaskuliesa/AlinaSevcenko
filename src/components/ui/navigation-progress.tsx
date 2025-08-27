"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  speed: 300,
  minimum: 0.08,
});

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const button = target.closest("button");
      if (button) {
        return;
      }

      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        link.target !== "_blank"
      ) {
        const currentPath = window.location.pathname + window.location.search;
        const targetPath = href;

        const currentPathWithoutLocale = currentPath.replace(
          /^\/[a-z]{2}(\/|$)/,
          "/"
        );
        const normalizedTarget = targetPath.startsWith("/")
          ? targetPath
          : "/" + targetPath;

        console.log("Navigation detected:", {
          currentPathWithoutLocale,
          normalizedTarget,
        });

        if (currentPathWithoutLocale !== normalizedTarget) {
          NProgress.start();
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
