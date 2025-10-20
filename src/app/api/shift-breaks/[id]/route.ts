import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shift_breaks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shiftBreak = await db.select().from(shift_breaks).where(eq(shift_breaks.id, parseInt(params.id)));
    if (shiftBreak.length === 0) return NextResponse.json({ error: 'Shift break not found' }, { status: 404 });
    return NextResponse.json(shiftBreak[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shift break' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedShiftBreak = await db.update(shift_breaks)
      .set(body)
      .where(eq(shift_breaks.id, parseInt(params.id)))
      .returning();
    if (updatedShiftBreak.length === 0) return NextResponse.json({ error: 'Shift break not found' }, { status: 404 });
    return NextResponse.json(updatedShiftBreak[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shift break' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedShiftBreak = await db.delete(shift_breaks)
      .where(eq(shift_breaks.id, parseInt(params.id)))
      .returning();
    if (deletedShiftBreak.length === 0) return NextResponse.json({ error: 'Shift break not found' }, { status: 404 });
    return NextResponse.json({ message: 'Shift break deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shift break' }, { status: 500 });
  }
}