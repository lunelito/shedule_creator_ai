import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employee_team } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const relation = await db.select().from(employee_team).where(eq(employee_team.id, parseInt(params.id)));
    if (relation.length === 0) return NextResponse.json({ error: 'Employee team relation not found' }, { status: 404 });
    return NextResponse.json(relation[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee team relation' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedRelation = await db.update(employee_team)
      .set(body)
      .where(eq(employee_team.id, parseInt(params.id)))
      .returning();
    if (updatedRelation.length === 0) return NextResponse.json({ error: 'Employee team relation not found' }, { status: 404 });
    return NextResponse.json(updatedRelation[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee team relation' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedRelation = await db.delete(employee_team)
      .where(eq(employee_team.id, parseInt(params.id)))
      .returning();
    if (deletedRelation.length === 0) return NextResponse.json({ error: 'Employee team relation not found' }, { status: 404 });
    return NextResponse.json({ message: 'Employee team relation deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee team relation' }, { status: 500 });
  }
}