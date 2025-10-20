// // lib/auth.ts
// import NextAuth from "next-auth";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import { db } from "@/lib/db";
// import { users, accounts, sessions, verification_tokens } from "../db/schema";
// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";

// export const authConfig = {
//   adapter: DrizzleAdapter(db, {
//     usersTable: users as any,
//     accountsTable: accounts as any,
//     sessionsTable: sessions as any,
//     verificationTokensTable: verification_tokens as any,
//   }),
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         // TODO: Tutaj dodaj prawdziwą weryfikację z bazą danych
//         // Na razie podstawowa implementacja
//         if (process.env.NODE_ENV === "development") {
//           return {
//             id: "1",
//             email: credentials.email as string,
//             name: credentials.email.split('@')[0],
//             is_admin: false,
//           };
//         }

//         return null;
//       }
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id as string;
//         (session.user as any).isAdmin = token.isAdmin as boolean;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.isAdmin = (user as any).is_admin;
//       }
//       return token;
//     },
//   },
//   pages: {
//     signIn: "/",
//   },
// } satisfies Parameters<typeof NextAuth>[0];