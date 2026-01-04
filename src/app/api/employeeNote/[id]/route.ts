import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    const updatedEmployee = await db
      .update(employees)
      .set(body)
      .where(eq(employees.id, id))
      .returning();

    if (updatedEmployee.length === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee);
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
    const id = parseInt(params.id);
    const updatedEmployee = await db
      .update(employees)
      .set({
        note: null,
      })
      .where(eq(employees.id, id))
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
