import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await db.select().from(notifications).where(eq(notifications.id, parseInt(params.id)));
    if (notification.length === 0) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    return NextResponse.json(notification[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notification' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedNotification = await db.update(notifications)
      .set(body)
      .where(eq(notifications.id, parseInt(params.id)))
      .returning();
    if (updatedNotification.length === 0) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    return NextResponse.json(updatedNotification[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedNotification = await db.delete(notifications)
      .where(eq(notifications.id, parseInt(params.id)))
      .returning();
    if (deletedNotification.length === 0) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}