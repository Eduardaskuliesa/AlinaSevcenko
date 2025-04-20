import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { LoginFormData } from "@/app/actions/user/authentication/login";
import { userActions } from "@/app/actions/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const loginForm: LoginFormData = {
          email: credentials.email,
          password: credentials.password,
        };

        const result = await userActions.authentication.login(loginForm);

        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          id: result?.user?.userId,
          email: result?.user?.email,
          role: result?.user?.roles,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
