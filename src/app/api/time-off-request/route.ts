import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { time_off_requests } from '@/db/schema';

export async function GET() {
  try {
    const allTimeOffRequests = await db.select().from(time_off_requests);
    return NextResponse.json(allTimeOffRequests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time off requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTimeOffRequest = await db.insert(time_off_requests).values(body).returning();
    return NextResponse.json(newTimeOffRequest[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create time off request' }, { status: 500 });
  }
}