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

// B. Terrain types (Pavement Inventory)
// Index: 1 = Flat, 2 = Rolling, 3 = Mountainous
export const TERRAIN_TYPES = ["flat", "rolling", "mountainous"] as const;

// A. Shoulder types (Left & Right) - Road Side Attributes
// Index: 1 = None, 2 = Earth, 3 = Concrete, 4 = Asphalt, 5 = Block
export const SHOULDER_TYPES = [
  "none", // Index 0/1 = None
  "earth", // Index 1/2 = Earth
  "concrete", // Index 2/3 = Concrete
  "asphalt", // Index 3/4 = Asphalt
  "block", // Index 4/5 = Block
] as const;

// A. Shoulder widths (Left & Right) - Road Side Attributes
// Index: 1 = 0 m, 2 = 0.5 m, 3 = 1 m, 4 = 1.5 m, 5 = 2 m
export const SHOULDER_WIDTHS = [
  "0", // Index 0/1 = 0 m
  "0.5", // Index 1/2 = 0.5 m
  "1", // Index 2/3 = 1 m
  "1.5", // Index 3/4 = 1.5 m
  "2", // Index 4/5 = 2 m
] as const;

// A. Drainage types (Left & Right) - Road Side Attributes
// Index: 1 = None, 2 = Not Required, 3 = Earth, 4 = Masonry Open, 5 = Masonry Covered
export const DRAINAGE_TYPES = [
  "none", // Index 0/1 = None
  "not_required", // Index 1/2 = Not Required
  "earth", // Index 2/3 = Earth
  "masonry_open", // Index 3/4 = Masonry Open
  "masonry_covered", // Index 4/5 = Masonry Covered
] as const;

// A. Land use types (Left & Right) - Road Side Attributes
// Index: 1 = None, 2 = Agriculture, 3 = Rural, 4 = Urban, 5 = Forest
export const LAND_USE_TYPES = [
  "none", // Index 0/1 = None
  "agriculture", // Index 1/2 = Agriculture
  "rural", // Index 2/3 = Rural
  "urban", // Index 3/4 = Urban
  "forest", // Index 4/5 = Forest
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
