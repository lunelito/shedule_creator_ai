import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/db/schema';

export async function GET() {
  try {
    const allNotifications = await db.select().from(notifications);
    return NextResponse.json(allNotifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newNotification = await db.insert(notifications).values(body).returning();
    return NextResponse.json(newNotification[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}