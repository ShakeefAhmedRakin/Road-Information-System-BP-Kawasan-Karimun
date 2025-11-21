import { pgEnum } from "drizzle-orm/pg-core";

// Enum values as constants (single source of truth)
export const SHOULDER_TYPES = [
  "none",
  "earth",
  "concrete",
  "asphalt",
  "block",
] as const;

export const SHOULDER_WIDTHS = ["0", "0.5", "1", "1.5", "2"] as const;

export const DRAINAGE_TYPES = [
  "none",
  "not_required",
  "earth",
  "masonry_open",
  "masonry_covered",
] as const;

export const LAND_USE_TYPES = [
  "none",
  "agriculture",
  "rural",
  "urban",
  "forest",
] as const;

export const PAVEMENT_TYPES = [
  "asphalt",
  "concrete",
  "block",
  "unpaved",
  "gravel",
] as const;

export const TERRAIN_TYPES = ["flat", "rolling", "mountainous"] as const;

export const SEGMENT_GENERATION_MODES = ["exact", "rounded"] as const;

// TypeScript types derived from constants
export type ShoulderType = (typeof SHOULDER_TYPES)[number];
export type ShoulderWidth = (typeof SHOULDER_WIDTHS)[number];
export type DrainageType = (typeof DRAINAGE_TYPES)[number];
export type LandUseType = (typeof LAND_USE_TYPES)[number];
export type PavementType = (typeof PAVEMENT_TYPES)[number];
export type TerrainType = (typeof TERRAIN_TYPES)[number];
export type SegmentGenerationMode = (typeof SEGMENT_GENERATION_MODES)[number];

// Postgres enums for schema
export const shoulderTypeEnum = pgEnum("shoulder_type", SHOULDER_TYPES);
export const shoulderWidthEnum = pgEnum("shoulder_width", SHOULDER_WIDTHS);
export const drainageTypeEnum = pgEnum("drainage_type", DRAINAGE_TYPES);
export const landUseTypeEnum = pgEnum("land_use_type", LAND_USE_TYPES);
export const pavementTypeEnum = pgEnum("pavement_type", PAVEMENT_TYPES);
export const terrainTypeEnum = pgEnum("terrain_type", TERRAIN_TYPES);
export const segmentGenerationModeEnum = pgEnum(
  "segment_generation_mode",
  SEGMENT_GENERATION_MODES
);
