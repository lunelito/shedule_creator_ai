import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shift_breaks } from '@/db/schema';

export async function GET() {
  try {
    const allShiftBreaks = await db.select().from(shift_breaks);
    return NextResponse.json(allShiftBreaks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shift breaks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newShiftBreak = await db.insert(shift_breaks).values(body).returning();
    return NextResponse.json(newShiftBreak[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shift break' }, { status: 500 });
  }
}