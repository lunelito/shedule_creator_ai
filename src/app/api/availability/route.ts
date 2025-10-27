import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { availability } from '@/db/schema';

export async function GET() {
  try {
    const allAvailability = await db.select().from(availability);
    return NextResponse.json(allAvailability);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAvailability = await db.insert(availability).values(body).returning();
    return NextResponse.json(newAvailability[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 });
  }
}