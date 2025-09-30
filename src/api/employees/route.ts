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
    const newEmployee = await db.insert(employees).values({
      user_id: body.user_id,
      employee_code: body.employee_code,
      status: body.status || 'active',
      default_hourly_rate: body.default_hourly_rate,
      timezone: body.timezone || 'UTC',
      contract_type: body.contract_type || 'full_time',
      contracted_hours_per_week: body.contracted_hours_per_week,
      max_consecutive_days: body.max_consecutive_days,
    }).returning();
    
    return NextResponse.json(newEmployee[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}