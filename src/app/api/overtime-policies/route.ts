import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { overtime_policies } from '@/db/schema';

export async function GET() {
  try {
    const allOvertimePolicies = await db.select().from(overtime_policies);
    return NextResponse.json(allOvertimePolicies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch overtime policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOvertimePolicy = await db.insert(overtime_policies).values(body).returning();
    return NextResponse.json(newOvertimePolicy[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create overtime policy' }, { status: 500 });
  }
}