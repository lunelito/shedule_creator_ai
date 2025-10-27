import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { availability } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const availabilityRecord = await db.select().from(availability).where(eq(availability.id, parseInt(params.id)));
    if (availabilityRecord.length === 0) return NextResponse.json({ error: 'Availability not found' }, { status: 404 });
    return NextResponse.json(availabilityRecord[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedAvailability = await db.update(availability)
      .set(body)
      .where(eq(availability.id, parseInt(params.id)))
      .returning();
    if (updatedAvailability.length === 0) return NextResponse.json({ error: 'Availability not found' }, { status: 404 });
    return NextResponse.json(updatedAvailability[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedAvailability = await db.delete(availability)
      .where(eq(availability.id, parseInt(params.id)))
      .returning();
    if (deletedAvailability.length === 0) return NextResponse.json({ error: 'Availability not found' }, { status: 404 });
    return NextResponse.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete availability' }, { status: 500 });
  }
}