import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    const orgs = await db
      .select()
      .from(organizations)
      .where(eq(organizations.created_by, parseInt(params.user_id)));

    return NextResponse.json(orgs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    const body = await request.json();
    const updatedOrg = await db
      .update(organizations)
      .set(body)
      .where(eq(organizations.created_by, parseInt(params.user_id)))
      .returning();
    if (updatedOrg.length === 0)
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    return NextResponse.json(updatedOrg[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    const deletedOrg = await db
      .delete(organizations)
      .where(eq(organizations.created_by, parseInt(params.user_id)))
      .returning();
    if (deletedOrg.length === 0)
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    return NextResponse.json({ message: "Organization deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}