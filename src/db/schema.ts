import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  boolean,
  text,
  numeric,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const EmployeeStatus = pgEnum("employee_status", [
  "active",
  "inactive",
  "on_leave",
  "terminated",
]);
export const ShiftStatus = pgEnum("shift_status", [
  "published",
  "draft",
  "cancelled",
  "completed",
]);
export const TimeOffType = pgEnum("time_off_type", [
  "paid_leave",
  "unpaid_leave",
  "sick",
  "parental",
  "other",
]);
export const RepeatFrequency = pgEnum("repeat_frequency", [
  "none",
  "daily",
  "weekly",
  "monthly",
]);
export const ContractType = pgEnum("contract_type", [
  "full_time",
  "part_time",
  "hourly",
  "contractor",
]);
export const OvertimePolicy = pgEnum("overtime_policy", [
  "none",
  "fixed_after_hours",
  "daily_threshold",
  "weekly_threshold",
]);

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  timezone: varchar("timezone", { length: 64 }).default("UTC"),
  settings: jsonb("settings").default("{}"),
  icon: varchar("icon", { length: 2048 }),
  created_by: integer("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  password: text("password"),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 2048 }),

  phone: varchar("phone", { length: 32 }),
  timezone: varchar("timezone", { length: 64 }).default("UTC"),
  is_admin: boolean("is_admin").notNull().default(false),
  is_active: boolean("is_active").notNull().default(true),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  last_login_at: timestamp("last_login_at"),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 255 }).notNull(), // 'oauth', 'email', 'credentials'
  provider: varchar("provider", { length: 255 }).notNull(), // 'google', 'github', etc.
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const verification_tokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
  employee_code: varchar("employee_code", { length: 64 }).notNull().unique(),
  status: EmployeeStatus("status").notNull().default("active"),
  default_hourly_rate: numeric("default_hourly_rate", {
    precision: 10,
    scale: 2,
  }).default("0"),
  position:varchar("position"),
  timezone: varchar("timezone", { length: 64 }).notNull().default("UTC"),
  contract_type: ContractType("contract_type").notNull().default("full_time"),
  contracted_hours_per_week: numeric("contracted_hours_per_week", {
    precision: 5,
    scale: 2,
  }).default("40"),
  max_consecutive_days: integer("max_consecutive_days").default(7),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

//not need to use it
export const teams = pgTable("teams", {
  // grupy pracowników np kuchnia, zarząd
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
});

export const locations = pgTable("locations", {
  //  różne adresy/oddziały typu Restauracja Warszawa Centrum - ul. Marszałkowska 1, Restauracja Kraków Stare Miasto - ul. Grodzka 5
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  address: varchar("address", { length: 255 }),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const roles = pgEnum("roles", [
  "admin",
  "manager",
  "supervisor",
  "employee",
]);

export const employee_roles = pgTable("employee_roles", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
  team_id: integer("team_id").references(() => teams.id),
  role: roles("role").notNull(),
  permissions: jsonb("permissions").default("{}"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

//not need to use it
export const employee_team = pgTable("employee_team", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  team_id: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  is_primary: boolean("is_primary").notNull().default(false),
});

//not need to use it
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  description: text("description"),
});

//not need to use it
export const employee_skill = pgTable("employee_skill", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  skill_id: integer("skill_id")
    .references(() => skills.id)
    .notNull(),
  level: integer("level").default(1), // e.g. 1..5
});

export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  day_of_week: integer("day_of_week"),
  start_time: varchar("start_time", { length: 16 }), // np."08:00"
  end_time: varchar("end_time", { length: 16 }),
  date: timestamp("date"),
  weight: integer("weight").default(1),
  note: text("note"),
});

export const time_off_requests = pgTable("time_off_requests", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  type: TimeOffType("type").notNull().default("paid_leave"),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  hours_per_day: numeric("hours_per_day", { precision: 5, scale: 2 }),
  approved_by: integer("approved_by").references(() => users.id),
  approved_at: timestamp("approved_at"),
  rejection_reason: text("rejection_reason"),
  status: varchar("status", { length: 60 }).notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  meta: jsonb("meta").default("{}"),
});

export const shift_templates = pgTable("shift_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  team_id: integer("team_id").references(() => teams.id),
  location_id: integer("location_id").references(() => locations.id),
  role: varchar("role", { length: 120 }),
  start_time: varchar("start_time", { length: 16 }).notNull(),
  end_time: varchar("end_time", { length: 16 }).notNull(),
  contracted_hours: numeric("contracted_hours", {
    precision: 5,
    scale: 2,
  }).default("0"),
  repeat_frequency: RepeatFrequency("repeat_frequency")
    .notNull()
    .default("none"),
  repeat_config: jsonb("repeat_config").default("{}"), // e.g. {weekdays:[1,3,5]}
  created_by: integer("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  template_id: integer("template_id").references(() => shift_templates.id),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
  assigned_employee_id: integer("assigned_employee_id").references(
    () => employees.id
  ),
  team_id: integer("team_id").references(() => teams.id),
  location_id: integer("location_id").references(() => locations.id),
  role: varchar("role", { length: 120 }),
  start_at: timestamp("start_at").notNull(),
  end_at: timestamp("end_at").notNull(),
  scheduled_hours: numeric("scheduled_hours", {
    precision: 6,
    scale: 2,
  }).notNull(),
  status: ShiftStatus("status").notNull().default("published"),
  is_published: boolean("is_published").default(false),
  published_by: integer("published_by").references(() => users.id),
  published_at: timestamp("published_at"),
  picked_up_at: timestamp("picked_up_at"),
  notes: text("notes"),
  meta: jsonb("meta").default("{}"),
  created_by: integer("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const shift_breaks = pgTable("shift_breaks", {
  id: serial("id").primaryKey(),
  shift_id: integer("shift_id")
    .references(() => schedules.id)
    .notNull(),
  start_at: timestamp("start_at").notNull(),
  end_at: timestamp("end_at").notNull(),
  paid: boolean("paid").notNull().default(false),
});

export const shift_swaps = pgTable("shift_swaps", {
  id: serial("id").primaryKey(),
  shift_id: integer("shift_id")
    .references(() => schedules.id)
    .notNull(),
  requester_employee_id: integer("requester_employee_id")
    .references(() => employees.id)
    .notNull(),
  offered_employee_id: integer("offered_employee_id").references(
    () => employees.id
  ),
  status: varchar("status", { length: 60 }).notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  resolved_at: timestamp("resolved_at"),
});

export const time_logs = pgTable("time_logs", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  shift_id: integer("shift_id").references(() => schedules.id),
  clock_in: timestamp("clock_in"),
  clock_out: timestamp("clock_out"),
  duration_minutes: integer("duration_minutes"),
  meta: jsonb("meta").default("{}"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id").references(() => employees.id),
  type: varchar("type", { length: 120 }),
  payload: jsonb("payload").default("{}"),
  read: boolean("read").notNull().default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const overtime_policies = pgTable("overtime_policies", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  policy_type: OvertimePolicy("policy_type").notNull(),
  daily_threshold_hours: numeric("daily_threshold_hours", {
    precision: 4,
    scale: 2,
  }),
  weekly_threshold_hours: numeric("weekly_threshold_hours", {
    precision: 4,
    scale: 2,
  }),
  overtime_multiplier: numeric("overtime_multiplier", {
    precision: 3,
    scale: 2,
  }).default("1.5"),
  enabled: boolean("enabled").default(true),
});

export const audit_logs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
  user_id: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 120 }).notNull(),
  resource_type: varchar("resource_type", { length: 80 }).notNull(),
  resource_id: integer("resource_id"),
  old_values: jsonb("old_values"),
  new_values: jsonb("new_values"),
  ip_address: varchar("ip_address", { length: 45 }),
  user_agent: text("user_agent"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// export const schema = {
//   users,
//   employees,
//   teams,
//   employee_team,
//   locations,
//   skills,
//   employee_skill,
//   availability,
//   time_off_requests,
//   shift_templates,
//   shifts,
//   shift_breaks,
//   shift_swaps,
//   scheduling_constraints,
//   overtime_policies,
//   time_logs,
//   payroll_entries,
//   audit_logs,
//   notifications,
// }
