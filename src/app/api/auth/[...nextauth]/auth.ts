import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProivder from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { LoginFormData } from "@/app/actions/user/authentication/login";
import { userActions } from "@/app/actions/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProivder({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
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
          fullName: result.user?.fullName,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUsr = await userActions.authentication.checkEmail(
            user.email
          );

          if (existingUsr.error !== "EMAIL_ALREADY_EXISTS") {
            await userActions.authentication.registerOAuth({
              email: user.email!,
              fullName: user.name!,
              provider: "google",
              providerId: account.providerAccountId,
            });
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const user = await userActions.authentication.getUserByEmail(
          token.email
        );
        if (user.success && user.user) {
          token.id = user.user.userId;
          token.role = user.user.roles;
          token.fullName = user.user.fullName;
        }
      }

      if (account?.provider === "credentials") {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.fullName = token.fullName as string;
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
