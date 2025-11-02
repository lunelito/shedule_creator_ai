import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/index";
import { users, accounts, sessions, verification_tokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts as any,
    sessionsTable: sessions as any,
    verificationTokensTable: verification_tokens as any,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password }: any = credentials ?? {};
          if (!email || !password) return null;

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (user.length === 0) return null;

          const matchedUser = user[0];
          if (!matchedUser.password) return null;

          const isPasswordValid = await bcrypt.compare(
            password,
            matchedUser.password
          );

          if (!isPasswordValid) return null;

          return {
            id: matchedUser.id.toString(),
            email: matchedUser.email,
            name: matchedUser.name,
            image: matchedUser.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.is_Admin;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
