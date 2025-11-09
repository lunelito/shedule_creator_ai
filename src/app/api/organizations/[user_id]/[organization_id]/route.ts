import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { organizations } from "@/db/schema";
import { eq,and } from "drizzle-orm";

// Typ dla params
interface Params {
  params: {
    user_id: string;
    organization_id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const org = await db
      .select()
      .from(organizations)
      .where(
        and(
          eq(organizations.id, parseInt(params.organization_id)),
          eq(organizations.created_by, parseInt(params.user_id))
        )
      );

    if (org.length === 0) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(org[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();

    const updatedOrg = await db
      .update(organizations)
      .set(body)
      .where(
        and(
          eq(organizations.id, parseInt(params.organization_id)),
          eq(organizations.created_by, parseInt(params.user_id))
        )
      )
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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const deletedOrg = await db
      .delete(organizations)
      .where(
        and(
          eq(organizations.id, parseInt(params.organization_id)),
          eq(organizations.created_by, parseInt(params.user_id))
        )
      )
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
