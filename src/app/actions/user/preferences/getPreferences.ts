"use server";
import { requireSelf } from "@/app/lib/session";
import { fetchPreferences } from "./fetchPreferences";

export async function getPreferences(userId: string) {
  try {
    await requireSelf(userId);
  } catch {
    return null;
  }
  return fetchPreferences(userId);
}
