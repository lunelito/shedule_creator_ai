import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { audit_logs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditLog = await db.select().from(audit_logs).where(eq(audit_logs.id, parseInt(params.id)));
    if (auditLog.length === 0) return NextResponse.json({ error: 'Audit log not found' }, { status: 404 });
    return NextResponse.json(auditLog[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedAuditLog = await db.update(audit_logs)
      .set(body)
      .where(eq(audit_logs.id, parseInt(params.id)))
      .returning();
    if (updatedAuditLog.length === 0) return NextResponse.json({ error: 'Audit log not found' }, { status: 404 });
    return NextResponse.json(updatedAuditLog[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update audit log' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedAuditLog = await db.delete(audit_logs)
      .where(eq(audit_logs.id, parseInt(params.id)))
      .returning();
    if (deletedAuditLog.length === 0) return NextResponse.json({ error: 'Audit log not found' }, { status: 404 });
    return NextResponse.json({ message: 'Audit log deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete audit log' }, { status: 500 });
  }
}