CREATE TABLE "result" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"road_id" text NOT NULL,
	"segment_results" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "result" ADD CONSTRAINT "result_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "result" ADD CONSTRAINT "result_road_id_road_id_fk" FOREIGN KEY ("road_id") REFERENCES "public"."road"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "result_user_id_idx" ON "result" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "result_road_id_idx" ON "result" USING btree ("road_id");