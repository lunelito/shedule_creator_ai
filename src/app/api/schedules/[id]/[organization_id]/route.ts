import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees, schedules, schedules_day } from "@/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm";

type DayEmployees = {
  date: string;
  employeeCount: number;
};

type ScheduleWithEmployees = {
  id: number;
  name: string;
  organization_id: number;
  employeesPerDay: DayEmployees[];
};

export async function GET(
  req: NextResponse,
  { params }: { params: Promise<{ id: string; organization_id: string }> },
) {
  try {
    const { id: userId, organization_id: organizationId } = await params;

    if (!organizationId || !userId) {
      return NextResponse.json({ error: "id doesnt exist" }, { status: 404 });
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6);

    const todayString = today.toISOString().split("T")[0];

    const mondayString = mondayDate.toISOString().split("T")[0];
    const sundayString = sundayDate.toISOString().split("T")[0];

    const addDays = (dateStr: string, days: number): string => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    };

    const dateToShortText = new Map<string, string>([
      [mondayString, "Mon"],
      [addDays(mondayString, 1), "Tue"],
      [addDays(mondayString, 2), "Wed"],
      [addDays(mondayString, 3), "Thu"],
      [addDays(mondayString, 4), "Fri"],
      [addDays(mondayString, 5), "Sat"],
      [addDays(mondayString, 6), "Sun"],
    ]);

    console.log(todayString);

    const userSchedules = await db
      .select({
        id: schedules.id,
        name: schedules.name,
        organization_id: schedules.organization_id,
        isAnyoneWorkingNow: sql<boolean>`EXISTS (SELECT 1 FROM ${schedules_day} WHERE ${schedules_day.template_id} = ${schedules.id} AND NOW() BETWEEN ${schedules_day.start_at} AND ${schedules_day.end_at})`,
        totalEmployees: sql<number>`(SELECT COUNT(*) FROM ${employees} WHERE ${employees.assigned_to_schedule} = ${schedules.id} AND ${employees.accept_to_schedule} = 'accepted')`,
      })
      .from(schedules)
      .innerJoin(employees, eq(schedules.id, employees.assigned_to_schedule))
      .where(
        and(
          eq(schedules.organization_id, parseInt(organizationId)),
          eq(employees.user_id, parseInt(userId)),
          eq(employees.accept_to_schedule, "accepted"),
        ),
      );

    if (userSchedules.length === 0) {
      return NextResponse.json([]);
    }

    const scheduleIds = userSchedules.map((s) => s.id);

    const employeesPerDay = await db
      .select({
        template_id: schedules_day.template_id,
        date: schedules_day.date,
        employeeCount: sql<number>`count(distinct ${schedules_day.assigned_employee_id})`,
      })
      .from(schedules_day)
      .where(
        and(
          inArray(schedules_day.template_id, scheduleIds),
          gte(schedules_day.date, mondayString),
          lte(schedules_day.date, sundayString),
        ),
      )
      .groupBy(schedules_day.template_id, schedules_day.date);

    const result: ScheduleWithEmployees[] = userSchedules.map((schedule) => ({
      ...schedule,
      employeesPerDay: Array.from(dateToShortText.entries()).map(
        ([date, shortName]) => ({
          date: shortName,
          employeeCount:
            Number(
              employeesPerDay.find(
                (e) => e.template_id === schedule.id && e.date === date,
              )?.employeeCount,
            ) || 0,
        }),
      ),
    }));

    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch shift templates" },
      { status: 500 },
    );
  }
}
