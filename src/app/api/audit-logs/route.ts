import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { audit_logs } from '@/db/schema';

export async function GET() {
  try {
    const allAuditLogs = await db.select().from(audit_logs);
    return NextResponse.json(allAuditLogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAuditLog = await db.insert(audit_logs).values(body).returning();
    return NextResponse.json(newAuditLog[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}