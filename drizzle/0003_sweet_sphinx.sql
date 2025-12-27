CREATE TABLE "worksheet_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"maintenance_request_id" integer NOT NULL,
	"content" text NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "worksheet_lines" ADD CONSTRAINT "worksheet_lines_maintenance_request_id_maintenance_requests_id_fk" FOREIGN KEY ("maintenance_request_id") REFERENCES "public"."maintenance_requests"("id") ON DELETE no action ON UPDATE no action;