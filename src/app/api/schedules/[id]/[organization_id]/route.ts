import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees, schedules } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextResponse,
  { params }: { params: Promise<{ id: string; organization_id: string }> }
) {
  try {
    const { id: userId, organization_id: organizationId } = await params;

    if (!organizationId || !userId) {
      return NextResponse.json({ error: "id doesnt exist" }, { status: 404 });
    }

    const userSchedules = await db
      .select({
        schedule: schedules, // wybierz cały obiekt schedules
      })
      .from(schedules)
      .innerJoin(employees, eq(schedules.id, employees.assigned_to_schedule))
      .where(
        and(
          eq(schedules.organization_id, parseInt(organizationId)),
          eq(employees.user_id, parseInt(userId)),
          eq(employees.accept_to_schedule, "accepted")
        )
      )
      .then((results) => results.map((r) => r.schedule));
    console.log(userSchedules);

    return NextResponse.json(userSchedules);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shift templates" },
      { status: 500 }
    );
  }
}
