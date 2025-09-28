import { pgTable, serial, varchar, integer, timestamp, boolean, text, numeric, jsonb, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const EmployeeStatus = pgEnum('employee_status', ['active', 'inactive', 'on_leave', 'terminated'])
export const ShiftStatus = pgEnum('shift_status', ['published', 'draft', 'cancelled', 'completed'])
export const TimeOffType = pgEnum('time_off_type', ['paid_leave', 'unpaid_leave', 'sick', 'parental', 'other'])
export const RepeatFrequency = pgEnum('repeat_frequency', ['none', 'daily', 'weekly', 'monthly'])
export const ContractType = pgEnum('contract_type', ['full_time', 'part_time', 'hourly', 'contractor'])
export const OvertimePolicy = pgEnum('overtime_policy', ['none', 'fixed_after_hours', 'daily_threshold', 'weekly_threshold'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 32 }),
  is_admin: boolean('is_admin').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  employee_code: varchar('employee_code', { length: 64 }).notNull().unique(),
  status: EmployeeStatus('status').notNull().default('active'),
  default_hourly_rate: numeric('default_hourly_rate', { precision: 10, scale: 2 }).default('0'),
  timezone: varchar('timezone', { length: 64 }).notNull().default('UTC'),
  contract_type: ContractType('contract_type').notNull().default('full_time'),
  contracted_hours_per_week: numeric('contracted_hours_per_week', { precision: 5, scale: 2 }).default('40'),
  max_consecutive_days: integer('max_consecutive_days').default(7),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

// export const locations = pgTable('locations', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 160 }).notNull(),
//   address: varchar('address', { length: 255 }),
//   description: text('description'),
//   created_at: timestamp('created_at').defaultNow().notNull(),
// })

export const employee_team = pgTable('employee_team', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id).notNull(),
  team_id: integer('team_id').references(() => teams.id).notNull(),
  is_primary: boolean('is_primary').notNull().default(false),
})

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull().unique(),
  description: text('description'),
})

export const employee_skill = pgTable('employee_skill', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id).notNull(),
  skill_id: integer('skill_id').references(() => skills.id).notNull(),
  level: integer('level').default(1), // e.g. 1..5
})

export const availability = pgTable('availability', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id).notNull(),
  day_of_week: integer('day_of_week'),
  start_time: varchar('start_time', { length: 16 }), // np."08:00"
  end_time: varchar('end_time', { length: 16 }),
  date: timestamp('date'),
  weight: integer('weight').default(1),
  note: text('note'),
})

export const time_off_requests = pgTable('time_off_requests', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id).notNull(),
  type: TimeOffType('type').notNull().default('paid_leave'),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  hours_per_day: numeric('hours_per_day', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 60 }).notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  meta: jsonb('meta').default('{}'),
})

export const shift_templates = pgTable('shift_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  team_id: integer('team_id').references(() => teams.id),
//   location_id: integer('location_id').references(() => locations.id),
  role: varchar('role', { length: 120 }),
  start_time: varchar('start_time', { length: 16 }).notNull(),
  end_time: varchar('end_time', { length: 16 }).notNull(),
  contracted_hours: numeric('contracted_hours', { precision: 5, scale: 2 }).default('0'),
  repeat_frequency: RepeatFrequency('repeat_frequency').notNull().default('none'),
  repeat_config: jsonb('repeat_config').default('{}'), // e.g. {weekdays:[1,3,5]}
  created_by: integer('created_by').references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const shifts = pgTable('shifts', {
  id: serial('id').primaryKey(),
  template_id: integer('template_id').references(() => shift_templates.id),
  assigned_employee_id: integer('assigned_employee_id').references(() => employees.id),
  team_id: integer('team_id').references(() => teams.id),
//   location_id: integer('location_id').references(() => locations.id),
  role: varchar('role', { length: 120 }),
  start_at: timestamp('start_at').notNull(),
  end_at: timestamp('end_at').notNull(),
  scheduled_hours: numeric('scheduled_hours', { precision: 6, scale: 2 }).notNull(),
  status: ShiftStatus('status').notNull().default('published'),
  published_at: timestamp('published_at'),
  picked_up_at: timestamp('picked_up_at'),
  notes: text('notes'),
  meta: jsonb('meta').default('{}'),
  created_by: integer('created_by').references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const shift_breaks = pgTable('shift_breaks', {
  id: serial('id').primaryKey(),
  shift_id: integer('shift_id').references(() => shifts.id).notNull(),
  start_at: timestamp('start_at').notNull(),
  end_at: timestamp('end_at').notNull(),
  paid: boolean('paid').notNull().default(false),
})

export const shift_swaps = pgTable('shift_swaps', {
  id: serial('id').primaryKey(),
  shift_id: integer('shift_id').references(() => shifts.id).notNull(),
  requester_employee_id: integer('requester_employee_id').references(() => employees.id).notNull(),
  offered_employee_id: integer('offered_employee_id').references(() => employees.id),
  status: varchar('status', { length: 60 }).notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at'),
})

export const scheduling_constraints = pgTable('scheduling_constraints', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  json_rule: jsonb('json_rule').notNull(), // np. {max_hours_per_week:40}
  priority: integer('priority').default(100),
  active: boolean('active').notNull().default(true),
})

export const overtime_policies = pgTable('overtime_policies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  policy_type: OvertimePolicy('policy_type').notNull().default('none'),
  config: jsonb('config').default('{}'), // np. {daily_threshold:8, rate:1.5}
  effective_from: timestamp('effective_from').defaultNow(),
})

export const time_logs = pgTable('time_logs', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id).notNull(),
  shift_id: integer('shift_id').references(() => shifts.id),
  clock_in: timestamp('clock_in'),
  clock_out: timestamp('clock_out'),
  duration_minutes: integer('duration_minutes'),
  meta: jsonb('meta').default('{}'),
})

export const payroll_entries = pgTable('payroll_entries', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id).notNull(),
  period_start: timestamp('period_start').notNull(),
  period_end: timestamp('period_end').notNull(),
  regular_hours: numeric('regular_hours', { precision: 8, scale: 2 }).default('0'),
  overtime_hours: numeric('overtime_hours', { precision: 8, scale: 2 }).default('0'),
  gross_pay: numeric('gross_pay', { precision: 12, scale: 2 }).default('0'),
  details: jsonb('details').default('{}'),
})

export const audit_logs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actor_user_id: integer('actor_user_id').references(() => users.id),
  action: varchar('action', { length: 200 }).notNull(),
  target: varchar('target', { length: 200 }),
  payload: jsonb('payload').default('{}'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id),
  type: varchar('type', { length: 120 }),
  payload: jsonb('payload').default('{}'),
  read: boolean('read').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

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
