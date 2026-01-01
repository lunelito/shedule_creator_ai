import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id doesnt exist" }, { status: 404 });
    }

    const employeesData = await db
      .select()
      .from(employees)
      .where(eq(employees.assigned_to_schedule, parseInt(id)));

    return NextResponse.json(employeesData);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body)

    // Jeśli assigned_to_schedule jest wymagane, dodaj do requiredFields
    const requiredFields = [
      "user_id",
      "employee_code",
      "position",
      "contract_type",
      "assigned_to_schedule", // Dodaj jeśli jest wymagane
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    
    // Parsuj user_id raz
    const userId = parseInt(body.user_id);
    const scheduleId = body.assigned_to_schedule;
    
    // Walidacja czy user_id jest poprawną liczbą
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user_id format" },
        { status: 400 }
      );
    }
    
    // Sprawdź czy pracownik już istnieje
    const checkIfExistEmp = await db
    .select()
    .from(employees)
    .where(
      and(
        eq(employees.user_id, userId),
        eq(employees.assigned_to_schedule, scheduleId)
      )
    );
    
    console.log(checkIfExistEmp)


    if (checkIfExistEmp.length > 0) {
      return NextResponse.json(
        { error: "Employee already exists for this schedule" },
        { status: 400 }
      );
    }

    // Utwórz nowego pracownika
    const newEmployee = await db
      .insert(employees)
      .values({
        user_id: userId,
        employee_code: body.employee_code,
        position: body.position,
        name: body.name,
        email: body.email,
        contract_type: body.contract_type,
        timezone: body.timezone || "UTC",
        status: body.status || "active",
        role: body.role || "employee",
        default_hourly_rate: body.default_hourly_rate || 0,
        contracted_hours_per_week: body.contracted_hours_per_week || 40,
        max_consecutive_days: body.max_consecutive_days || 7,
        assigned_to_schedule: scheduleId,
        accept_to_schedule: body.accept_to_schedule,
      })
      .returning();

    return NextResponse.json(newEmployee[0], { status: 201 });
  } catch (error: any) {
    console.error(error);

    let errorMessage = "Failed to create employee";
    let statusCode = 500;

    if (error.code === "23505") {
      // To może być unikalny employee_code lub inny constraint
      if (error.constraint?.includes("employee_code")) {
        errorMessage = "Employee code already exists";
      } else {
        errorMessage = "Duplicate entry";
      }
      statusCode = 409;
    } else if (error.code === "23503") {
      errorMessage = "User or schedule does not exist";
      statusCode = 400;
    } else if (error.code === "23502") {
      errorMessage = "Missing required fields";
      statusCode = 400;
    } else if (error.code === "22P02") {
      errorMessage = "Invalid data format";
      statusCode = 400;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: statusCode }
    );
  }
}
