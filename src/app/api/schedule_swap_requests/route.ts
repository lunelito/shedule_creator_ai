import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  employees,
  schedule_swap_requests,
  schedules,
  schedules_day,
} from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { eq, InferSelectModel, and } from "drizzle-orm";
import { request } from "http";

export async function GET(request: NextRequest) {
  try {
    const employeeRecive = alias(employees, "employeeRecive");
    const employeeRequest = alias(employees, "employeeRequest");
    const scheduleDayRequest = alias(schedules_day, "scheduleDayRequest");
    const scheduleDayRecive = alias(schedules_day, "scheduleDayRecive");

    const scheduleSwapRequest = alias(
      schedule_swap_requests,
      "scheduleSwapRequest",
    );

    const result = await db
      .select()
      .from(scheduleSwapRequest)
      .leftJoin(
        employeeRecive,
        eq(scheduleSwapRequest.employee_id_recive, employeeRecive.id),
      )
      .leftJoin(
        employeeRequest,
        eq(scheduleSwapRequest.employee_id_request, employeeRequest.id),
      )
      .leftJoin(
        scheduleDayRequest,
        eq(scheduleSwapRequest.schedule_id_request, scheduleDayRequest.id),
      )
      .leftJoin(
        scheduleDayRecive,
        eq(scheduleSwapRequest.schedule_id_recive, scheduleDayRecive.id),
      );

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch schedule swap requests" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const offeredShift = body.schiftSwap.offeredShift;
    const desiredShift = body.schiftSwap.desiredShift;

    const schedule_id_recive = offeredShift.shift.id || null;
    const schedule_id_request = desiredShift.shift.id || null;

    const schedule_kind_recive = offeredShift.shift.id
      ? "schedule"
      : offeredShift.shift;
    const schedule_kind_request = desiredShift.shift.id
      ? "schedule"
      : desiredShift.shift;

    const employee_id_recive = offeredShift.employee.id;
    const employee_id_request = desiredShift.employee.id;

    const scheduleSwapRequest = await db
      .insert(schedule_swap_requests)
      .values({
        schedule_id_recive,
        schedule_id_request,
        schedule_kind_recive,
        employee_id_recive,
        schedule_kind_request,
        employee_id_request,
        status: "waiting",
        date_recive: new Date(offeredShift.date),
        date_request: new Date(desiredShift.date),
      })
      .returning();

    return NextResponse.json(
      { scheduleSwapRequest: scheduleSwapRequest[0], message: "OK" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create shift template" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed =
      typeof body.formDataObj?.body === "string"
        ? JSON.parse(body.formDataObj.body)
        : body.formDataObj?.body;

    const {
      switchScheduleSchiftRecive,
      switchScheduleSchiftRequest,
      status,
      scheduleSwapRequestId,
      rejectReasion,
    } = parsed;

    console.log(status, scheduleSwapRequestId, rejectReasion);

    const recive =
      typeof switchScheduleSchiftRecive === "string"
        ? JSON.parse(switchScheduleSchiftRecive)
        : switchScheduleSchiftRecive;

    const request =
      typeof switchScheduleSchiftRequest === "string"
        ? JSON.parse(switchScheduleSchiftRequest)
        : switchScheduleSchiftRequest;

    console.log(recive, request);

    if (!scheduleSwapRequestId) {
      throw new Error("Missing scheduleSwapRequestId");
    }

    const result = await db.transaction(async (tx) => {
      console.log("\n=== STARTING TRANSACTION ===");

      const updatedRequest = await tx
        .update(schedule_swap_requests)
        .set({
          status,
          rejection_reason: status === "declined" ? rejectReasion : null,
        })
        .where(eq(schedule_swap_requests.id, Number(scheduleSwapRequestId)))
        .returning();

      console.log(updatedRequest);

      if (updatedRequest.length === 0) {
        throw new Error(
          `Schedule swap request with id ${scheduleSwapRequestId} not found`,
        );
      }

      if (status === "accepted") {
        const reciveSchedule = recive.scheduleDayId
          ? await tx.query.schedules_day.findFirst({
              where: eq(schedules_day.id, Number(recive.scheduleDayId)),
            })
          : null;

        const requestSchedule = request.scheduleDayId
          ? await tx.query.schedules_day.findFirst({
              where: eq(schedules_day.id, Number(request.scheduleDayId)),
            })
          : null;

        if (reciveSchedule && requestSchedule) {
          await tx
            .update(schedules_day)
            .set({
              assigned_employee_id: null,
              updated_at: new Date(),
            })
            .where(eq(schedules_day.id, reciveSchedule.id));

          await tx
            .update(schedules_day)
            .set({
              assigned_employee_id: null,
              updated_at: new Date(),
            })
            .where(eq(schedules_day.id, requestSchedule.id));

          await tx
            .update(schedules_day)
            .set({
              assigned_employee_id: request.employeeId,
              updated_at: new Date(),
            })
            .where(eq(schedules_day.id, reciveSchedule.id));

          await tx
            .update(schedules_day)
            .set({
              assigned_employee_id: recive.employeeId,
              updated_at: new Date(),
            })
            .where(eq(schedules_day.id, requestSchedule.id));
        } else if (reciveSchedule && !requestSchedule) {
          await tx
            .update(schedules_day)
            .set({
              assigned_employee_id: request.employeeId,
              updated_at: new Date(),
            })
            .where(eq(schedules_day.id, reciveSchedule.id));
        } else if (!reciveSchedule && requestSchedule) {
          await tx
            .update(schedules_day)
            .set({
              assigned_employee_id: recive.employeeId,
              updated_at: new Date(),
            })
            .where(eq(schedules_day.id, requestSchedule.id));
        }
      }

      return updatedRequest[0];
    });

    return NextResponse.json({
      success: true,
      data: result,
      message:
        status === "accepted" ? "Schedule swap completed" : "Request updated",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Swap transaction failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
