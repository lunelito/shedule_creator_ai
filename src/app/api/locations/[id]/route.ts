import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const location = await db.select().from(locations).where(eq(locations.id, parseInt(params.id)));
    if (location.length === 0) return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    return NextResponse.json(location[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedLocation = await db.update(locations)
      .set(body)
      .where(eq(locations.id, parseInt(params.id)))
      .returning();
    if (updatedLocation.length === 0) return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    return NextResponse.json(updatedLocation[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedLocation = await db.delete(locations)
      .where(eq(locations.id, parseInt(params.id)))
      .returning();
    if (deletedLocation.length === 0) return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}