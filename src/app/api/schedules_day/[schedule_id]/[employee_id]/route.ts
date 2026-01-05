import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules_day } from "@/db/schema";
import { eq, and, like } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ schedule_id: string; employee_id: string }> }
) {
  try {
    const { schedule_id: schedule_id, employee_id: employee_id } = await params;
    const { searchParams } = new URL(request.url);
    const presentMonth = searchParams.get("presentMonth");
    const pastMonth = searchParams.get("pastMonth");
    const futureMonth = searchParams.get("futureMonth");
    if (pastMonth && presentMonth && futureMonth) {
      const months = [pastMonth, presentMonth, futureMonth];
      const results = await Promise.all(
        months.map((month) =>
          month
            ? db
                .select()
                .from(schedules_day)
                .where(
                  and(
                    eq(
                      schedules_day.assigned_employee_id,
                      parseInt(employee_id)
                    ),
                    eq(schedules_day.template_id, parseInt(schedule_id)),
                    like(schedules_day.date, month.slice(0, 7) + "%")
                  )
                )
            : Promise.resolve([])
        )
      );
      return NextResponse.json(results);
    } else {
      const employee = await db
        .select()
        .from(schedules_day)
        .where(eq(schedules_day.assigned_employee_id, parseInt(employee_id)));
      if (employee.length === 0)
        return NextResponse.json(
          { error: "schedules day not found" },
          { status: 404 }
        );
      return NextResponse.json(employee);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedules day" },
      { status: 500 }
    );
  }
}
