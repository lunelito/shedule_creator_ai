import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees, organizations, schedules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params; 
    const userId = parseInt(user_id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const orgsWhereCreatedByUser = await db
      .select()
      .from(organizations)
      .where(eq(organizations.created_by, userId));

    const orgsWhereEmployeed = await db
      .select()
      .from(employees)
      .leftJoin(schedules, eq(employees.assigned_to_schedule, schedules.id))
      .leftJoin(organizations, eq(schedules.organization_id, organizations.id))
      .where(eq(employees.user_id, parseInt(user_id)));

    return NextResponse.json([orgsWhereCreatedByUser,orgsWhereEmployeed]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params; 
    const userId = parseInt(user_id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const body = await req.json();
    const updatedOrg = await db
      .update(organizations)
      .set(body)
      .where(eq(organizations.created_by, userId))
      .returning();

    if (updatedOrg.length === 0) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrg[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params; 
    const userId = parseInt(user_id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const deletedOrg = await db
      .delete(organizations)
      .where(eq(organizations.created_by, userId))
      .returning();

    if (deletedOrg.length === 0) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Organization deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}