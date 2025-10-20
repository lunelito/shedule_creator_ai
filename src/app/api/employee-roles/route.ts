import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employee_roles } from '@/db/schema';

export async function GET() {
  try {
    const allRoles = await db.select().from(employee_roles);
    return NextResponse.json(allRoles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRole = await db.insert(employee_roles).values(body).returning();
    return NextResponse.json(newRole[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee role' }, { status: 500 });
  }
}