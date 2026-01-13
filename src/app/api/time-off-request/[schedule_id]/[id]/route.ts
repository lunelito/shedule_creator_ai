import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { time_off_requests } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log(params);
    console.log(body);
    const updatedTimeOffRequest = await db
      .update(time_off_requests)
      .set({
        status: body.decision,
        rejection_reason: body.reasonReject,
        approved_by: body.userId,
        approved_at: new Date(),
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
    return NextResponse.json(
      { error: "Failed to update time off request" },
      { status: 500 }
    );
  }
}
