import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { db } from "@/db";
import { verification_tokens } from "@/db/schema";

export async function sendVerificationEmail(userEmail: string) {
  const token = randomBytes(32).toString("hex");

  await db.insert(verification_tokens).values({
    identifier: userEmail,
    token,
    expires: new Date(Date.now() + 1000 * 60 * 60),
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: 587,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const verificationUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER!}>`,
    to: userEmail,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });
}
