import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employee_skill } from '@/db/schema';

export async function GET() {
  try {
    const allEmployeeSkills = await db.select().from(employee_skill);
    return NextResponse.json(allEmployeeSkills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEmployeeSkill = await db.insert(employee_skill).values(body).returning();
    return NextResponse.json(newEmployeeSkill[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee skill' }, { status: 500 });
  }
}