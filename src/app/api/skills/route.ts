import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { skills } from '@/db/schema';

export async function GET() {
  try {
    const allSkills = await db.select().from(skills);
    return NextResponse.json(allSkills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSkill = await db.insert(skills).values(body).returning();
    return NextResponse.json(newSkill[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}