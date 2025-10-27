import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { time_logs } from '@/db/schema';

export async function GET() {
  try {
    const allTimeLogs = await db.select().from(time_logs);
    return NextResponse.json(allTimeLogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTimeLog = await db.insert(time_logs).values(body).returning();
    return NextResponse.json(newTimeLog[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create time log' }, { status: 500 });
  }
}