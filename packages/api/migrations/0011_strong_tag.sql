DROP INDEX "result_road_id_idx";--> statement-breakpoint
ALTER TABLE "result" ADD COLUMN "pavement_type_percentages" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "result" ADD COLUMN "condition_length_stats" jsonb NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "result_road_id_unique" ON "result" USING btree ("road_id");