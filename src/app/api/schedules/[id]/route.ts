import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shiftTemplate = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, parseInt(params.id)));
    if (shiftTemplate.length === 0)
      return NextResponse.json(
        { error: "Shift template not found" },
        { status: 404 }
      );
    return NextResponse.json(shiftTemplate[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shift template" },
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
    const updatedShiftTemplate = await db
      .update(schedules)
      .set(body)
      .where(eq(schedules.id, parseInt(params.id)))
      .returning();
    if (updatedShiftTemplate.length === 0)
      return NextResponse.json(
        { error: "Shift template not found" },
        { status: 404 }
      );
    return NextResponse.json(updatedShiftTemplate[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update shift template" },
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
      .delete(schedules)
      .where(eq(schedules.id, parseInt(params.id)))
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
    return NextResponse.json(
      { error: "Failed to delete shift template" },
      { status: 500 }
    );
  }
}
