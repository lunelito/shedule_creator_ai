import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules_day } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ schedule_id: string }> }
) {
  try {

    const { schedule_id: schedule_id } = await params;

    const schedule_day_db = await db
      .select()
      .from(schedules_day)
      .where(eq(schedules_day.template_id, parseInt(schedule_id)));

    return NextResponse.json(schedule_day_db);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { schedule_id: string } }
) {
  try {
    const deletedShiftTemplate = await db
      .delete(schedules_day)
      .where(eq(schedules_day.id, parseInt(params.schedule_id)))
      .returning();
    if (deletedShiftTemplate.length === 0)
      return NextResponse.json(
        { error: "Shift template not found" },
        { status: 404 }
      );
    return NextResponse.json({
      message: "Shift template deleted successfully",
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to delete shift template" },
      { status: 500 }
    );
  }
}
