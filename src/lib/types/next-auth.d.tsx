import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: number;
      isAdmin?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
