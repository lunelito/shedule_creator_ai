import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules, employees } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employees: employeesList, ...scheduleData } = body;

    const result = await db.transaction(async (tx) => {
      // Insert grafiku
      const [newSchedule] = await tx
        .insert(schedules)
        .values(scheduleData)
        .returning();

      const schedule_id = newSchedule.id;

      // Insert pracowników (z checkiem duplikatu jak w /api/employees)
      for (const emp of employeesList) {
        const existing = await tx
          .select()
          .from(employees)
          .where(
            and(
              eq(employees.user_id, emp.user_id),
              eq(employees.assigned_to_schedule, schedule_id),
            ),
          );

        if (existing.length > 0) {
          throw new Error(
            `Employee ${emp.name} already exists for this schedule`,
          );
        }

        await tx.insert(employees).values({
          user_id: emp.user_id,
          employee_code: emp.employee_code,
          position: emp.position,
          name: emp.name,
          email: emp.email,
          contract_type: emp.contract_type,
          timezone: "UTC",
          status: "active",
          role: emp.role,
          default_hourly_rate: String(emp.default_hourly_rate),
          contracted_hours_per_week: String(emp.contracted_hours_per_week),
          max_consecutive_days: Number(emp.max_consecutive_days),
          assigned_to_schedule: schedule_id,
          accept_to_schedule: emp.accept_to_schedule,
          image: emp.image,
        });
      }

      return { schedule_id };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    const cause = error?.cause ?? error; // ← Drizzle chowa PG błąd w cause

    let errorMessage = "Failed to create schedule with employees";
    let statusCode = 500;

    if (cause?.code === "23505") {
      errorMessage = cause.constraint_name?.includes(
        "unique_employee_per_schedule",
      )
        ? "Employee code already exists"
        : "This employee is already assigned to the schedule";
      statusCode = 409;
    } else if (cause?.code === "23503") {
      errorMessage = "User or schedule does not exist";
      statusCode = 400;
    } else if (cause?.code === "23502") {
      errorMessage = "Missing required fields";
      statusCode = 400;
    } else if (cause?.code === "22P02") {
      errorMessage = "Invalid data format";
      statusCode = 400;
    }

    console.log(errorMessage);

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: statusCode },
    );
  }
}
