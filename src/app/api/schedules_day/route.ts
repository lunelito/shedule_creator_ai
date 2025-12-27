import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules, schedules_day } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schedule_id = searchParams.get("schedule_id");
    const date = searchParams.get("date");

    if (!schedule_id || !date) {
      return NextResponse.json(
        { error: "Missing schedule_id or date" },
        { status: 400 }
      );
    }

    const allSchedules_day = await db
      .select()
      .from(schedules_day)
      .where(
        and(
          eq(schedules_day.template_id, parseInt(schedule_id)),
          eq(schedules_day.date, date)
        )
      );

    return NextResponse.json(allSchedules_day);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.shifts) || body.shifts.length === 0) {
      return NextResponse.json(
        { error: "No shifts provided." },
        { status: 400 }
      );
    }

    const insertValues = body.shifts.map((shift: any) => ({
      template_id: shift.template_id ?? null,
      assigned_employee_id: shift.assigned_employee_id,
      start_at: new Date(shift.start_at),
      end_at: new Date(shift.end_at),
      scheduled_hours: shift.scheduled_hours.includes("h")
        ? parseFloat(shift.scheduled_hours.replace("h", ""))
        : shift.scheduled_hours,
      status: shift.status ?? "draft",
      date: shift.date,
      is_published: shift.is_published ?? false,
      published_by: shift.published_by ?? null,
      created_by: shift.created_by,
    }));

    const insertedShifts = await db
      .insert(schedules_day)
      .values(insertValues)
      .returning();

    return NextResponse.json(
      { success: true, shifts: insertedShifts },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create schedule." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    if (!Array.isArray(body.shifts) || body.shifts.length === 0) {
      return NextResponse.json(
        { error: "No shifts provided." },
        { status: 400 }
      );
    }

    const updatedShifts = [];

    for (const shift of body.shifts) {
      if (!shift.id) {
        return NextResponse.json(
          { error: "Shift id is required for update." },
          { status: 400 }
        );
      }

      const scheduledHours =
        typeof shift.scheduled_hours === "string"
          ? parseFloat(shift.scheduled_hours.replace("h", ""))
          : shift.scheduled_hours;

      const [updated] = await db
        .update(schedules_day)
        .set({
          start_at: new Date(shift.start_at),
          end_at: new Date(shift.end_at),
          scheduled_hours: scheduledHours,
        })
        .where(eq(schedules_day.id, shift.id))
        .returning();

      console.log(updated);
      updatedShifts.push(updated);
    }

    return NextResponse.json(
      { success: true, shifts: updatedShifts },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update schedule." },
      { status: 500 }
    );
  }
}
