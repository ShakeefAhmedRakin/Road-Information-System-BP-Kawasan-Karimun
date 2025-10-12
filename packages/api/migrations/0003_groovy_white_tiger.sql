CREATE TABLE "road" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"number" text NOT NULL,
	"total_length_km" numeric(10, 2) NOT NULL,
	"segment_interval_m" integer NOT NULL,
	"pavement_width_m" numeric(10, 2) NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "road_number_unique" UNIQUE("number")
);
--> statement-breakpoint
ALTER TABLE "road" ADD CONSTRAINT "road_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "road_name_idx" ON "road" USING btree ("name");--> statement-breakpoint
CREATE INDEX "road_number_idx" ON "road" USING btree ("number");--> statement-breakpoint
CREATE INDEX "road_created_by_idx" ON "road" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "road_created_at_idx" ON "road" USING btree ("created_at");