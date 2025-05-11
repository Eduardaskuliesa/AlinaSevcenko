import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";

export async function verifyAdminAccess() {
  const session = await getServerSession(authOptions);

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale =
    pathSegments.length > 0 &&
    routing.locales?.includes(pathSegments[0] as "lt" | "ru")
      ? pathSegments[0]
      : routing.defaultLocale || "lt";

  if (!session?.user) {
    redirect(`/${locale}/login?error=sessionExpired`);
  }

  if (session.user.role !== "ADMIN") {
    redirect(`/${locale}/login?error=insufficientPermissions`);
  }
  return session.user;
}
