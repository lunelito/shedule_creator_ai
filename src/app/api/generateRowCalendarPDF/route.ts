import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jsPDF from "jspdf";

export async function POST(request: Request) {
  const { url } = await request.json();
  const normalizedUrl = url.replace("127.0.0.1", "localhost");
  const hostname = new URL(normalizedUrl).hostname;

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map((c) => ({
    name: c.name,
    value: c.value,
    domain: hostname === "localhost" ? "localhost" : hostname,
  }));

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setCookie(...allCookies);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(normalizedUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector("#rowCalendarWrapper");

  const element = await page.$("#rowCalendarWrapper");
  const screenshot = await element!.screenshot({ type: "png" });

  await page.close();
  await browser.disconnect();

  const base64 = Buffer.from(screenshot).toString("base64");
  const imgData = `data:image/png;base64,${base64}`;

  const pdf = new jsPDF("landscape", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=calendar.pdf",
    },
  });
}
