import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employee_skill } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeSkill = await db.select().from(employee_skill).where(eq(employee_skill.id, parseInt(params.id)));
    if (employeeSkill.length === 0) return NextResponse.json({ error: 'Employee skill not found' }, { status: 404 });
    return NextResponse.json(employeeSkill[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee skill' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedEmployeeSkill = await db.update(employee_skill)
      .set(body)
      .where(eq(employee_skill.id, parseInt(params.id)))
      .returning();
    if (updatedEmployeeSkill.length === 0) return NextResponse.json({ error: 'Employee skill not found' }, { status: 404 });
    return NextResponse.json(updatedEmployeeSkill[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee skill' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedEmployeeSkill = await db.delete(employee_skill)
      .where(eq(employee_skill.id, parseInt(params.id)))
      .returning();
    if (deletedEmployeeSkill.length === 0) return NextResponse.json({ error: 'Employee skill not found' }, { status: 404 });
    return NextResponse.json({ message: 'Employee skill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee skill' }, { status: 500 });
  }
}