import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teams } from '@/db/schema';

export async function GET() {
  try {
    const allTeams = await db.select().from(teams);
    return NextResponse.json(allTeams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTeam = await db.insert(teams).values(body).returning();
    return NextResponse.json(newTeam[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}