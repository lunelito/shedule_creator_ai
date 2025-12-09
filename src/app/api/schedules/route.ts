import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schedules } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id doesnt exist" }, { status: 404 });
    }

    const allShiftTemplates = await db
      .select()
      .from(schedules)
      .where(eq(schedules.organization_id, parseInt(id)));
    return NextResponse.json(allShiftTemplates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shift templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newShiftTemplate = await db
      .insert(schedules)
      .values(body)
      .returning();
    return NextResponse.json(newShiftTemplate[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create shift template" },
      { status: 500 }
    );
  }
}
