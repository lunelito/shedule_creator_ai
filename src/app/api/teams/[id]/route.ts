import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = await db.select().from(teams).where(eq(teams.id, parseInt(params.id)));
    if (team.length === 0) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    return NextResponse.json(team[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTeam = await db.update(teams)
      .set(body)
      .where(eq(teams.id, parseInt(params.id)))
      .returning();
    if (updatedTeam.length === 0) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    return NextResponse.json(updatedTeam[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedTeam = await db.delete(teams)
      .where(eq(teams.id, parseInt(params.id)))
      .returning();
    if (deletedTeam.length === 0) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}