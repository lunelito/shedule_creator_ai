import { NextResponse } from "next/server";
import { db } from "@/db";
import { verification_tokens, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(verification_tokens)
    .where(eq(verification_tokens.token, token));

  if (result.length === 0) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  const record = result[0];
  if (new Date(record.expires) < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 410 });
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, record.identifier));

  await db
    .delete(verification_tokens)
    .where(eq(verification_tokens.identifier, record.identifier));

  return NextResponse.json({ message: "Email verified! You can now log in." }, { status: 200 });
}
