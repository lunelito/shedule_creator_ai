import { employees } from "@/db/schema";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const employeesList = await db.select().from(employees);

    if (!employeesList || employeesList.length === 0) {
      return NextResponse.json(
        { message: "No employees found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employeesList);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.user_id || !body.organization_id || !body.employee_code) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: user_id, organization_id, employee_code",
        },
        { status: 400 }
      );
    }

    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.employee_code, body.employee_code))
      .limit(1);

    if (existingEmployee.length > 0) {
      return NextResponse.json(
        { error: "Employee code already exists" },
        { status: 409 }
      );
    }

    const newEmployee = await db
      .insert(employees)
      .values({
        user_id: Number(body.user_id),
        organization_id: Number(body.organization_id),
        employee_code: body.employee_code,
        status: body.status || "active",
        default_hourly_rate: body.default_hourly_rate || "0",
        contract_type: body.contract_type || "full_time",
        contracted_hours_per_week: body.contracted_hours_per_week || "40",
        max_consecutive_days: body.max_consecutive_days || 7,
      })
      .returning();

    return NextResponse.json(newEmployee[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
