import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '@/db/schema';

export async function GET() {
  try {
    const allLocations = await db.select().from(locations);
    return NextResponse.json(allLocations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLocation = await db.insert(locations).values(body).returning();
    return NextResponse.json(newLocation[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}