import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(params.id)));
    if (user.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedUser = await db
      .update(users)
      .set(body)
      .where(eq(users.id, parseInt(params.id)))
      .returning();
    if (updatedUser.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, parseInt(params.id)))
      .returning();
    if (deletedUser.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}