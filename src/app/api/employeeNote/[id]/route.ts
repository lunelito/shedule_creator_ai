import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: paramId } = await params;
    const body = await request.json();
    const id = parseInt(paramId);

    const updatedEmployee = await db
      .update(employees)
      .set(body)
      .where(eq(employees.id, id))
      .returning();

    if (updatedEmployee.length === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
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
        { status: 404 },
      );
    return NextResponse.json(updatedEmployee[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 },
    );
  }
}
