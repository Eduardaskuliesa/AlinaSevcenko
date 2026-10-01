import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";

export class AuthError extends Error {
  constructor(message = "UNAUTHORIZED") {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) throw new AuthError();
  return userId;
}

export async function requireAdmin(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new AuthError("FORBIDDEN");
  }
  return session.user.id;
}

export async function requireSelf(userId: string): Promise<string> {
  const sessionUserId = await requireUserId();
  if (userId !== sessionUserId) throw new AuthError("FORBIDDEN");
  return sessionUserId;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}
