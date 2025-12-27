import { pgTable, serial, text, timestamp, boolean, integer, pgEnum, doublePrecision, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- ENUMS (Strictly defined from Source 27-29, 55) ---
// Defining these ensures your frontend dropdowns match the DB exactly.
export const requestTypeEnum = pgEnum("request_type", [
  "corrective",
  "preventive",
]);
export const requestStageEnum = pgEnum("request_stage", [
  "new",
  "in_progress",
  "repaired",
  "scrap",
]);
export const userRoleEnum = pgEnum("user_role", ["technician", "manager"]);
export const maintenanceScopeEnum = pgEnum("maintenance_scope", ["equipment", "location", "other"]);

// --- 1. TEAMS (Source 19-24) ---
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Mechanics", "IT Support"
});

// --- 2. USERS (Source 22-23) ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: userRoleEnum("role").default("technician"),
  teamId: integer("team_id").references(() => teams.id), // Links user to a specialized team
  avatarUrl: text("avatar_url"), // For the Kanban visual indicator [cite: 59]
});

// --- 2.5 COMPANIES (Source: UI) ---
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// --- 3. EQUIPMENT (Source 7-18) ---
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "CNC Machine"
  serialNumber: text("serial_number").notNull().unique(),
  category: text("category").notNull(), // e.g., "Production"
  location: text("location"), // Physical location [cite: 18]
  purchaseDate: timestamp("purchase_date"),
  warrantyInfo: text("warranty_info"),

  // Default assignments for Auto-Fill Logic 
  maintenanceTeamId: integer("maintenance_team_id").references(() => teams.id).notNull(),
  defaultTechnicianId: integer("default_technician_id").references(() => users.id),

  // Logic: If a request hits "Scrap" stage, this flag turns true [cite: 76]
  isScrapped: boolean("is_scrapped").default(false),
});

// --- 4. MAINTENANCE REQUESTS (Source 25-35) ---
export const maintenanceRequests = pgTable("maintenance_requests", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(), // e.g., "Leaking Oil"

  // Scoping
  maintenanceScope: maintenanceScopeEnum("maintenance_scope").default("equipment"),
  equipmentId: integer("equipment_id").references(() => equipment.id),
  category: text("category"),

  // Details
  description: text("description"),
  instruction: text("instruction"),
  notes: text("notes"),

  // Links
  teamId: integer("team_id").references(() => teams.id).notNull(),
  technicianId: integer("technician_id").references(() => users.id),
  companyId: integer("company_id").references(() => companies.id).notNull(),

  // Workflow
  type: requestTypeEnum("type").notNull(),
  stage: requestStageEnum("stage").default("new").notNull(),
  priority: integer("priority").default(0),

  // Timing
  requestDate: date("request_date").defaultNow(),
  scheduledDate: timestamp("scheduled_date"),
  duration: doublePrecision("duration"),

  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- RELATIONS (Crucial for "Smart Buttons" & Joins) ---

export const teamsRelations = relations(teams, ({ many }) => ({
  users: many(users),
  equipment: many(equipment),
  requests: many(maintenanceRequests),
}));

export const equipmentRelations = relations(equipment, ({ one, many }) => ({
  team: one(teams, {
    fields: [equipment.maintenanceTeamId],
    references: [teams.id],
  }),
  requests: many(maintenanceRequests), // Needed for the "Badge" count on Equipment Form [cite: 73]
}));

export const requestsRelations = relations(maintenanceRequests, ({ one }) => ({
  equipment: one(equipment, {
    fields: [maintenanceRequests.equipmentId],
    references: [equipment.id],
  }),
  technician: one(users, {
    fields: [maintenanceRequests.technicianId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [maintenanceRequests.companyId],
    references: [companies.id],
  }),
}));

