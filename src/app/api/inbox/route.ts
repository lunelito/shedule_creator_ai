import { db } from "@/db";
import { employees } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const { invite, decision } = await request.json();

    if (!invite || decision === undefined) {
      return NextResponse.json(
        { error: "Brakuje danych, geniuszu" },
        { status: 400 }
      );
    }
    console.log(decision[0]);

    const result = await db
      .update(employees)
      .set({ accept_to_schedule: decision })
      .where(
        and(
          eq(employees.user_id, invite.user_id),
          eq(employees.id, invite.employee_id),
          eq(employees.assigned_to_schedule, invite.schedule_id)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Nic nie znaleziono do update'u" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, employee: result[0] },
      { status: 200 }
    );
  } catch (err: any) {
    // console.log(err)
    return NextResponse.json(
      { error: err.message || "Backend się zesrał" },
      { status: 500 }
    );
  }
}
