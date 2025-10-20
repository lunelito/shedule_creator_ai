import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { time_off_requests } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timeOffRequest = await db.select().from(time_off_requests).where(eq(time_off_requests.id, parseInt(params.id)));
    if (timeOffRequest.length === 0) return NextResponse.json({ error: 'Time off request not found' }, { status: 404 });
    return NextResponse.json(timeOffRequest[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch time off request' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTimeOffRequest = await db.update(time_off_requests)
      .set(body)
      .where(eq(time_off_requests.id, parseInt(params.id)))
      .returning();
    if (updatedTimeOffRequest.length === 0) return NextResponse.json({ error: 'Time off request not found' }, { status: 404 });
    return NextResponse.json(updatedTimeOffRequest[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update time off request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedTimeOffRequest = await db.delete(time_off_requests)
      .where(eq(time_off_requests.id, parseInt(params.id)))
      .returning();
    if (deletedTimeOffRequest.length === 0) return NextResponse.json({ error: 'Time off request not found' }, { status: 404 });
    return NextResponse.json({ message: 'Time off request deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete time off request' }, { status: 500 });
  }
}