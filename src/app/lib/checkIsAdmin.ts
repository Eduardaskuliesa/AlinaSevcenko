import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return session.user;
}
