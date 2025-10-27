import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employee_roles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = await db.select().from(employee_roles).where(eq(employee_roles.id, parseInt(params.id)));
    if (role.length === 0) return NextResponse.json({ error: 'Employee role not found' }, { status: 404 });
    return NextResponse.json(role[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee role' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedRole = await db.update(employee_roles)
      .set(body)
      .where(eq(employee_roles.id, parseInt(params.id)))
      .returning();
    if (updatedRole.length === 0) return NextResponse.json({ error: 'Employee role not found' }, { status: 404 });
    return NextResponse.json(updatedRole[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee role' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedRole = await db.delete(employee_roles)
      .where(eq(employee_roles.id, parseInt(params.id)))
      .returning();
    if (deletedRole.length === 0) return NextResponse.json({ error: 'Employee role not found' }, { status: 404 });
    return NextResponse.json({ message: 'Employee role deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee role' }, { status: 500 });
  }
}