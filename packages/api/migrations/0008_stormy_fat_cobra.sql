ALTER TYPE "public"."pavement_type" ADD VALUE 'gravel';--> statement-breakpoint
ALTER TABLE "road" ALTER COLUMN "segment_interval_m" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "road" ALTER COLUMN "segment_generation_mode" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "pavement_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "terrain" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "not_passable" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "left_shoulder_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "left_shoulder_width_m" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "left_drainage_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "left_land_use_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "right_shoulder_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "right_shoulder_width_m" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "right_drainage_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ALTER COLUMN "right_land_use_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "damage_assessment" jsonb;--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "pavement_type";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "carriageway_width_m";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "right_of_way_width_m";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "terrain";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "not_passable";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "left_shoulder_type";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "left_shoulder_width_m";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "left_drainage_type";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "left_land_use_type";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "right_shoulder_type";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "right_shoulder_width_m";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "right_drainage_type";--> statement-breakpoint
ALTER TABLE "road" DROP COLUMN "right_land_use_type";