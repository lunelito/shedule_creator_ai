import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dirPath = path.join(process.cwd(), "public/IconsForOrganization");
  const files = fs.readdirSync(dirPath);
  return NextResponse.json(files);
}