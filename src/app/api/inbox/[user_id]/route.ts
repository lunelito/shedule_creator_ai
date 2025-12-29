import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees, organizations, schedules } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const userId = parseInt(user_id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const orgsWhereEmployeedAndWaiting = await db
      .select()
      .from(employees)
      .leftJoin(schedules, eq(employees.assigned_to_schedule, schedules.id))
      .leftJoin(organizations, eq(schedules.organization_id, organizations.id))
      .where(
        and(
          eq(employees.user_id, parseInt(user_id)),
          eq(employees.accept_to_schedule, "waiting")
        )
      );

      console.log(orgsWhereEmployeedAndWaiting)

    return NextResponse.json(orgsWhereEmployeedAndWaiting);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}