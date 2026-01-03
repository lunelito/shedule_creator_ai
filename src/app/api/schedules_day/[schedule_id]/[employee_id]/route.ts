import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules_day } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { employee_id: string } }
) {
  try {
    const employee = await db
      .select()
      .from(schedules_day)
      .where(
        eq(schedules_day.assigned_employee_id, parseInt(params.employee_id))
      );
    if (employee.length === 0)
      return NextResponse.json(
        { error: "schedules day not found" },
        { status: 404 }
      );
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedules day" },
      { status: 500 }
    );
  }
}
