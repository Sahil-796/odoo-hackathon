CREATE TYPE "public"."equipment_used_by" AS ENUM('employee', 'department', 'other');--> statement-breakpoint
CREATE TYPE "public"."maintenance_scope" AS ENUM('equipment', 'work_center', 'other');--> statement-breakpoint
CREATE TYPE "public"."request_stage" AS ENUM('new', 'in_progress', 'repaired', 'scrap');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('corrective', 'preventive');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('technician', 'manager');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"serial_number" text NOT NULL,
	"category" text NOT NULL,
	"company_id" integer,
	"location" text,
	"work_center" text,
	"used_by" "equipment_used_by" DEFAULT 'employee',
	"employee_id" integer,
	"assigned_date" date,
	"purchase_date" timestamp,
	"warranty_info" text,
	"scrap_date" date,
	"is_scrapped" boolean DEFAULT false,
	"maintenance_team_id" integer NOT NULL,
	"default_technician_id" integer,
	"description" text,
	CONSTRAINT "equipment_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"maintenance_scope" "maintenance_scope" DEFAULT 'equipment',
	"equipment_id" integer,
	"work_center_id" integer,
	"category" text,
	"description" text,
	"instruction" text,
	"notes" text,
	"team_id" integer NOT NULL,
	"technician_id" integer,
	"company_id" integer NOT NULL,
	"type" "request_type" NOT NULL,
	"stage" "request_stage" DEFAULT 'new' NOT NULL,
	"priority" integer DEFAULT 0,
	"request_date" date DEFAULT now(),
	"scheduled_date" timestamp,
	"duration" double precision,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'technician',
	"team_id" integer,
	"avatar_url" text,
	"company_id" integer
);
--> statement-breakpoint
CREATE TABLE "work_centers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"tag" text,
	"cost_per_hour" double precision,
	"capacity" double precision,
	"time_efficiency" double precision,
	"oee_target" double precision,
	"alternative_work_center_id" integer
);
--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_maintenance_team_id_teams_id_fk" FOREIGN KEY ("maintenance_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_default_technician_id_users_id_fk" FOREIGN KEY ("default_technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_work_center_id_work_centers_id_fk" FOREIGN KEY ("work_center_id") REFERENCES "public"."work_centers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_technician_id_users_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_centers" ADD CONSTRAINT "work_centers_alternative_work_center_id_work_centers_id_fk" FOREIGN KEY ("alternative_work_center_id") REFERENCES "public"."work_centers"("id") ON DELETE no action ON UPDATE no action;