import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shift_swaps } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shiftSwap = await db.select().from(shift_swaps).where(eq(shift_swaps.id, parseInt(params.id)));
    if (shiftSwap.length === 0) return NextResponse.json({ error: 'Shift swap not found' }, { status: 404 });
    return NextResponse.json(shiftSwap[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shift swap' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedShiftSwap = await db.update(shift_swaps)
      .set(body)
      .where(eq(shift_swaps.id, parseInt(params.id)))
      .returning();
    if (updatedShiftSwap.length === 0) return NextResponse.json({ error: 'Shift swap not found' }, { status: 404 });
    return NextResponse.json(updatedShiftSwap[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shift swap' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedShiftSwap = await db.delete(shift_swaps)
      .where(eq(shift_swaps.id, parseInt(params.id)))
      .returning();
    if (deletedShiftSwap.length === 0) return NextResponse.json({ error: 'Shift swap not found' }, { status: 404 });
    return NextResponse.json({ message: 'Shift swap deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shift swap' }, { status: 500 });
  }
}