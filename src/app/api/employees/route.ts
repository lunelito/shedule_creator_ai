import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { employees } from '@/db/schema';

export async function GET() {
  try {
    const allEmployees = await db.select().from(employees);
    return NextResponse.json(allEmployees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEmployee = await db.insert(employees).values(body).returning();
    return NextResponse.json(newEmployee[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}