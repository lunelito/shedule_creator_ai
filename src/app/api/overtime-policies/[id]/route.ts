import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { overtime_policies } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const overtimePolicy = await db.select().from(overtime_policies).where(eq(overtime_policies.id, parseInt(params.id)));
    if (overtimePolicy.length === 0) return NextResponse.json({ error: 'Overtime policy not found' }, { status: 404 });
    return NextResponse.json(overtimePolicy[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch overtime policy' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedOvertimePolicy = await db.update(overtime_policies)
      .set(body)
      .where(eq(overtime_policies.id, parseInt(params.id)))
      .returning();
    if (updatedOvertimePolicy.length === 0) return NextResponse.json({ error: 'Overtime policy not found' }, { status: 404 });
    return NextResponse.json(updatedOvertimePolicy[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update overtime policy' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedOvertimePolicy = await db.delete(overtime_policies)
      .where(eq(overtime_policies.id, parseInt(params.id)))
      .returning();
    if (deletedOvertimePolicy.length === 0) return NextResponse.json({ error: 'Overtime policy not found' }, { status: 404 });
    return NextResponse.json({ message: 'Overtime policy deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete overtime policy' }, { status: 500 });
  }
}