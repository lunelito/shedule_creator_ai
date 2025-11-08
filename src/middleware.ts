import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token.isAdmin && url.pathname.startsWith("/manage/panel")) {
    return NextResponse.redirect(new URL("/manage/main", req.url));
  }

  // Admin → wchodzisz
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/panel/:path*"],
};
