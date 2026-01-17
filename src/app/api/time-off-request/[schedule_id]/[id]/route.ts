import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { time_off_requests } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// there id is a employeeId
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timeOffRequest = await db
      .select()
      .from(time_off_requests)
      .where(eq(time_off_requests.employee_id, parseInt(params.id)));
    return NextResponse.json(timeOffRequest);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch time off request" },
      { status: 500 }
    );
  }
}

// there id is a id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTimeOffRequest = await db
      .update(time_off_requests)
      .set({
        status: body.decision,
        rejection_reason: body.reasonReject,
        approved_by: body.userId,
        approved_at: new Date(),
        schedule_day_id: null,
      })
      .where(eq(time_off_requests.id, parseInt(params.id)))
      .returning();
    if (updatedTimeOffRequest.length === 0)
      return NextResponse.json(
        { error: "Time off request not found" },
        { status: 404 }
      );
    return NextResponse.json(updatedTimeOffRequest[0]);
  } catch (error) {
    // console.log(error)
    return NextResponse.json(
      { error: "Failed to update time off request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedShiftTemplate = await db
      .delete(time_off_requests)
      .where(eq(time_off_requests.id, parseInt(params.id)))
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
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete shift template" },
      { status: 500 }
    );
  }
}
