import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employee_team } from '@/db/schema';

export async function GET() {
  try {
    const allEmployeeTeams = await db.select().from(employee_team);
    return NextResponse.json(allEmployeeTeams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee team relations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRelation = await db.insert(employee_team).values(body).returning();
    return NextResponse.json(newRelation[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee team relation' }, { status: 500 });
  }
}