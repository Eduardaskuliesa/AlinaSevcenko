"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handledErrorRef = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error || handledErrorRef.current === error) return;

    handledErrorRef.current = error;

    if (error === "sessionExpired") {
      toast.error("Your session has expired. Please log in again.");
    } else if (error === "insufficientPermissions") {
      toast.error("You don't have admin permissions to access that page.");
    } else if (error === "authRequired") {
      toast.error("Authentication required to access that page.");
    }

    const params = new URLSearchParams(searchParams);
    params.delete("error");

    const newQuery = params.toString();
    const newPath = newQuery ? `${pathname}?${newQuery}` : pathname;

    router.replace(newPath);
  }, [searchParams, pathname, router]);

  return null;
}
