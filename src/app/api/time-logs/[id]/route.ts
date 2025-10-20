import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { time_logs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timeLog = await db.select().from(time_logs).where(eq(time_logs.id, parseInt(params.id)));
    if (timeLog.length === 0) return NextResponse.json({ error: 'Time log not found' }, { status: 404 });
    return NextResponse.json(timeLog[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time log' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTimeLog = await db.update(time_logs)
      .set(body)
      .where(eq(time_logs.id, parseInt(params.id)))
      .returning();
    if (updatedTimeLog.length === 0) return NextResponse.json({ error: 'Time log not found' }, { status: 404 });
    return NextResponse.json(updatedTimeLog[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update time log' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedTimeLog = await db.delete(time_logs)
      .where(eq(time_logs.id, parseInt(params.id)))
      .returning();
    if (deletedTimeLog.length === 0) return NextResponse.json({ error: 'Time log not found' }, { status: 404 });
    return NextResponse.json({ message: 'Time log deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete time log' }, { status: 500 });
  }
}