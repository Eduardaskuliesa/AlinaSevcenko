"use client";
import { useSession } from "next-auth/react";

export function useHasRole(role: string) {
  const { data: session } = useSession();
  return session?.user?.role === role;
}

export function useIsAdmin() {
  return useHasRole("ADMIN");
}

export function useIsStudent() {
  return useHasRole("STUDENT");
}
