import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { schedules } from '@/db/schema';

export async function GET() {
  try {
    const allSchedules = await db.select().from(schedules);
    return NextResponse.json(allSchedules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSchedule = await db.insert(schedules).values(body).returning();
    return NextResponse.json(newSchedule[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}