import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      "user_id",
      "employee_code",
      "position",
      "contract_type",
      "organization_id",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const newEmployee = await db
      .insert(employees)
      .values({
        user_id: body.user_id,
        employee_code: body.employee_code,
        position: body.position,
        contract_type: body.contract_type,
        organization_id: body.organization_id, // ← TERAZ TO DZIAŁA
        timezone: body.timezone || "UTC",
        status: body.status || "active",
        default_hourly_rate: body.default_hourly_rate || 0,
        contracted_hours_per_week: body.contracted_hours_per_week || 40,
        max_consecutive_days: body.max_consecutive_days || 7,
        assigned_to_schedule: body.assigned_to_schedule || null,
      })
      .returning();

    return NextResponse.json(newEmployee[0], { status: 201 });
    
  } catch (error: any) {

    let errorMessage = "Failed to create employee";
    let statusCode = 500;

    if (error.code === "23505") {
      errorMessage = "Employee code already exists";
      statusCode = 409;
    } else if (error.code === "23503") {
      errorMessage = "User or organization does not exist";
      statusCode = 400;
    } else if (error.code === "23502") {
      errorMessage = "Missing required fields";
      statusCode = 400;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
      },
      { status: statusCode }
    );
  }
}
