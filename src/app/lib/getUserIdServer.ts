import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth";

export const getUserIdServer = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
};
