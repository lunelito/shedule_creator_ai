import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { schedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedule = await db.select().from(schedules).where(eq(schedules.id, parseInt(params.id)));
    if (schedule.length === 0) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    return NextResponse.json(schedule[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedSchedule = await db.update(schedules)
      .set(body)
      .where(eq(schedules.id, parseInt(params.id)))
      .returning();
    if (updatedSchedule.length === 0) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    return NextResponse.json(updatedSchedule[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedSchedule = await db.delete(schedules)
      .where(eq(schedules.id, parseInt(params.id)))
      .returning();
    if (deletedSchedule.length === 0) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}