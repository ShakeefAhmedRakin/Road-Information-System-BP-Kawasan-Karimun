CREATE TYPE "public"."drainage_type" AS ENUM('none', 'not_required', 'earth', 'masonry_open', 'masonry_covered');--> statement-breakpoint
CREATE TYPE "public"."land_use_type" AS ENUM('none', 'agriculture', 'rural', 'urban', 'forest');--> statement-breakpoint
CREATE TYPE "public"."pavement_type" AS ENUM('asphalt', 'concrete', 'block', 'unpaved');--> statement-breakpoint
CREATE TYPE "public"."shoulder_type" AS ENUM('none', 'earth', 'concrete', 'asphalt', 'block');--> statement-breakpoint
CREATE TYPE "public"."shoulder_width" AS ENUM('0', '0.5', '1', '1.5', '2');--> statement-breakpoint
CREATE TYPE "public"."terrain_type" AS ENUM('flat', 'rolling', 'mountainous');--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "pavement_type" "pavement_type" DEFAULT 'asphalt' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "carriageway_width_m" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "right_of_way_width_m" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "terrain" "terrain_type" DEFAULT 'flat' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "not_passable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "left_shoulder_type" "shoulder_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "left_shoulder_width_m" "shoulder_width" DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "left_drainage_type" "drainage_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "left_land_use_type" "land_use_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "right_shoulder_type" "shoulder_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "right_shoulder_width_m" "shoulder_width" DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "right_drainage_type" "drainage_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "road" ADD COLUMN "right_land_use_type" "land_use_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "pavement_type" "pavement_type" DEFAULT 'asphalt' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "pavement_width_m" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "carriageway_width_m" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "right_of_way_width_m" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "terrain" "terrain_type" DEFAULT 'flat' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "not_passable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "left_shoulder_type" "shoulder_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "left_shoulder_width_m" "shoulder_width" DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "left_drainage_type" "drainage_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "left_land_use_type" "land_use_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "right_shoulder_type" "shoulder_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "right_shoulder_width_m" "shoulder_width" DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "right_drainage_type" "drainage_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "segment" ADD COLUMN "right_land_use_type" "land_use_type" DEFAULT 'none' NOT NULL;