import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      schedule_id: string;
      id: string;
    };
  }
) {
  try {
    const scheduleId = Number(params.schedule_id);
    const userId = Number(params.id);
    console.log("DOTARŁEM")

    if (isNaN(scheduleId) || isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid params, debilu" },
        { status: 400 }
      );
    }

    const deletedEmployee = await db
      .delete(employees)
      .where(
        and(
          eq(employees.assigned_to_schedule, scheduleId),
          eq(employees.user_id, userId)
        )
      )
      .returning();

    if (deletedEmployee.length === 0) {
      return NextResponse.json(
        { error: "Employee not found, nic nie skasowano" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedEmployee[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Serwer się zesrał przy DELETE" },
      { status: 500 }
    );
  }
}
