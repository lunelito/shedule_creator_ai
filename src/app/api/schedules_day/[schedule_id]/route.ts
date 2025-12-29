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
