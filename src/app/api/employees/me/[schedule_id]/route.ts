import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// The function parameter should be a context object containing params
export async function GET(
  request: Request,
  { params }: { params: { schedule_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Schedule ID:", params.schedule_id);
    const schedule_id = Number(params.schedule_id);
    console.log("Schedule ID:", schedule_id);

    const userIdStr = (session.user as any).id;
    if (!userIdStr) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    const userId = Number(userIdStr);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await db
      .select()
      .from(employees)
      .where(
        and(
          eq(employees.user_id, userId),
          eq(employees.assigned_to_schedule, schedule_id)
        )
      )
      .limit(1)
      .then((r) => r[0]);
      
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}