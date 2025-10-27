import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shift_templates } from '@/db/schema';

export async function GET() {
  try {
    const allShiftTemplates = await db.select().from(shift_templates);
    return NextResponse.json(allShiftTemplates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shift templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newShiftTemplate = await db.insert(shift_templates).values(body).returning();
    return NextResponse.json(newShiftTemplate[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shift template' }, { status: 500 });
  }
}