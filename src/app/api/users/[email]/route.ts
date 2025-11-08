import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq, like } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email;

    const user = await db
      .select()
      .from(users)
      .where(like(users.email, `%${email}%`))
      .limit(10);
    if (user.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}