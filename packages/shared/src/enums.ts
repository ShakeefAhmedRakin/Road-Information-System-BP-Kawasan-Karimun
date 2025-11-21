// ============================================================================
// ROAD MANAGEMENT ENUMS - Single source of truth for all enum types
// ============================================================================

// Pavement types
export const PAVEMENT_TYPES = [
  "asphalt",
  "concrete",
  "block",
  "gravel",
  "unpaved",
] as const;

// Segment generation modes
export const SEGMENT_GENERATION_MODES = ["exact", "rounded"] as const;

// Terrain types
export const TERRAIN_TYPES = ["flat", "rolling", "mountainous"] as const;

// Shoulder types
export const SHOULDER_TYPES = [
  "none",
  "earth",
  "concrete",
  "asphalt",
  "block",
] as const;

// Shoulder widths
export const SHOULDER_WIDTHS = ["0", "0.5", "1", "1.5", "2"] as const;

// Drainage types
export const DRAINAGE_TYPES = [
  "none",
  "not_required",
  "earth",
  "masonry_open",
  "masonry_covered",
] as const;

// Land use types
export const LAND_USE_TYPES = [
  "none",
  "agriculture",
  "rural",
  "urban",
  "forest",
] as const;

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type PavementType = (typeof PAVEMENT_TYPES)[number];
export type SegmentGenerationMode = (typeof SEGMENT_GENERATION_MODES)[number];
export type TerrainType = (typeof TERRAIN_TYPES)[number];
export type ShoulderType = (typeof SHOULDER_TYPES)[number];
export type ShoulderWidth = (typeof SHOULDER_WIDTHS)[number];
export type DrainageType = (typeof DRAINAGE_TYPES)[number];
export type LandUseType = (typeof LAND_USE_TYPES)[number];

// ============================================================================
// DRIZZLE ENUMS (for backend use only)
// ============================================================================

// Re-export Drizzle enums for backend usage
// These are only available when drizzle-orm is installed
export const createDrizzleEnums = () => {
  try {
    const { pgEnum } = require("drizzle-orm/pg-core");
    return {
      shoulderTypeEnum: pgEnum("shoulder_type", SHOULDER_TYPES),
      shoulderWidthEnum: pgEnum("shoulder_width", SHOULDER_WIDTHS),
      drainageTypeEnum: pgEnum("drainage_type", DRAINAGE_TYPES),
      landUseTypeEnum: pgEnum("land_use_type", LAND_USE_TYPES),
      pavementTypeEnum: pgEnum("pavement_type", PAVEMENT_TYPES),
      terrainTypeEnum: pgEnum("terrain_type", TERRAIN_TYPES),
      segmentGenerationModeEnum: pgEnum(
        "segment_generation_mode",
        SEGMENT_GENERATION_MODES
      ),
    };
  } catch {
    // Return empty object if drizzle-orm is not available (e.g., in frontend)
    return {};
  }
};
