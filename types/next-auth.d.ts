import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      fullName: string
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    fullName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    fullName: string;
  }
}
