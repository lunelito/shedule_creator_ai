import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(params.id)));
    if (employee.length === 0)
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    return NextResponse.json(employee[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employee" },
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
    const updatedEmployee = await db
      .update(employees)
      .set(body)
      .where(eq(employees.id, parseInt(params.id)))
      .returning();
    if (updatedEmployee.length === 0)
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    return NextResponse.json(updatedEmployee[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedEmployee = await db
      .delete(employees)
      .where(eq(employees.id, parseInt(params.id)))
      .returning();
    if (deletedEmployee.length === 0)
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
