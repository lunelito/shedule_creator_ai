import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shift_swaps } from '@/db/schema';

export async function GET() {
  try {
    const allShiftSwaps = await db.select().from(shift_swaps);
    return NextResponse.json(allShiftSwaps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shift swaps' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newShiftSwap = await db.insert(shift_swaps).values(body).returning();
    return NextResponse.json(newShiftSwap[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shift swap' }, { status: 500 });
  }
}