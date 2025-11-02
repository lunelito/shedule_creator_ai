import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  // Brak tokena → nie jesteś zalogowany
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Nie-admin próbuje wejść na /manage/panel → won
  if (!token.isAdmin && url.pathname.startsWith("/manage/panel")) {
    return NextResponse.redirect(new URL("/manage/main", req.url));
  }

  // Admin → wchodzisz
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/panel/:path*"], // middleware działa tylko na /manage/panel
};
