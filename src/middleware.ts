import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  if (!token && url.pathname.startsWith("/manage")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/manage/main", req.url));
  }

  if (token && !token.isAdmin && url.pathname.startsWith("/manage/panel")) {
    return NextResponse.redirect(new URL("/manage/main", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
