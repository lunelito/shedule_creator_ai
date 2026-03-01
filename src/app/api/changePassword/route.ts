// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { users } from "@/db/schema";
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
// import { eq } from "drizzle-orm";

// export async function POST(req: Request) {
//   try {
//     const { oldPassword, newPassword, userId } = await req.json();

//     const userResult = await db
//       .select()
//       .from(users)
//       .where(eq(userId, users.id));
//     const user = userResult[0];

//     const isPasswordValid = await bcrypt.compare(
//       oldPassword,
//       user.password
//     );

//     if (isPasswordValid) {
//       const saltRounds = 10;
//       const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

//       const changedPass = await db.update(users).set({ password: newPasswordHash }).where(eq(users.id, userId)).returning();
//       if(changedPass.length > 0) {
//         return NextResponse.json({ success: true, status: 200 });
//       } else {
//         return NextResponse.json({ success: false, status: 400, message: "error changing a password" });
//       }
//     } else {
//       return NextResponse.json({ success: false, status: 400 });
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Wystąpił błąd podczas rejestracji." },
//       { status: 500 }
//     );
//   }
// }
