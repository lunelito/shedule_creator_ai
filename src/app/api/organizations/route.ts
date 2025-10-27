import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { organizations } from '@/db/schema';

export async function GET() {
  try {
    const allOrgs = await db.select().from(organizations);
    return NextResponse.json(allOrgs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrg = await db.insert(organizations).values(body).returning();
    return NextResponse.json(newOrg[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}