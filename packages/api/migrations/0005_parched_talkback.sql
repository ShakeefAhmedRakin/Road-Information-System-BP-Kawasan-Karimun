CREATE TYPE "public"."segment_generation_mode" AS ENUM('exact', 'rounded');--> statement-breakpoint
CREATE TABLE "segment" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"road_id" text NOT NULL,
	"segment_number" integer NOT NULL,
	"stationing_from_m" numeric(10, 2) NOT NULL,
	"stationing_to_m" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "road" ALTER COLUMN "segment_interval_m" SET DEFAULT 100;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "segment_generation_mode" "segment_generation_mode" DEFAULT 'rounded' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD CONSTRAINT "segment_road_id_road_id_fk" FOREIGN KEY ("road_id") REFERENCES "public"."road"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "road_segment_road_id_idx" ON "segment" USING btree ("road_id");--> statement-breakpoint
CREATE INDEX "road_segment_number_idx" ON "segment" USING btree ("segment_number");