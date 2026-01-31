import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedule_swap_requests } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const offeredShift = body.schiftSwap.offeredShift;
    const desiredShift = body.schiftSwap.desiredShift;

    const schedule_id_recive = offeredShift.shift.id || null;
    const schedule_id_request = desiredShift.shift.id || null;

    const schedule_kind_recive = offeredShift.shift.id
      ? "schedule"
      : offeredShift.shift;
    const schedule_kind_request = desiredShift.shift.id
      ? "schedule"
      : desiredShift.shift;

    const employee_id_recive = offeredShift.employee.id;
    const employee_id_request = desiredShift.employee.id;

    await db.insert(schedule_swap_requests).values({
      schedule_id_recive,
      schedule_id_request,
      schedule_kind_recive,
      employee_id_recive,
      schedule_kind_request,
      employee_id_request,
      status: "waiting",
    });

    return NextResponse.json({ message: "OK" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create shift template" },
      { status: 500 },
    );
  }
}
