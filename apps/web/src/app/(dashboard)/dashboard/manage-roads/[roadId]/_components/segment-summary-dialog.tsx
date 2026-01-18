"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PavementType } from "@repo/shared";
import {
    CRACK_TYPES,
    CRACK_WIDTH_TYPES,
    CROSSFALL_CONDITIONS,
    DAMAGE_PERCENTAGE_RANGES,
    DRAINAGE_TYPES,
    EDGE_DAMAGE_TYPES,
    GRAVEL_DISTRIBUTION_TYPES,
    GRAVEL_THICKNESS_TYPES,
    LAND_USE_TYPES,
    PARTICLE_SIZE_TYPES,
    POTHOLE_AREA_PERCENTAGE_RANGES,
    POTHOLE_COUNT_TYPES,
    POTHOLE_SIZE_TYPES,
    RUT_DEPTH_TYPES,
    SHOULDER_TYPES,
    SHOULDER_WIDTHS,
    SURFACE_CONDITIONS,
    TERRAIN_TYPES,
    UNPAVED_RUT_DEPTH_TYPES,
    YES_NO_TYPES,
} from "@repo/shared";
import type { ReadRoadSegmentType } from "api/src/modules/segment/segment.schema";
import { List } from "lucide-react";
import { useState } from "react";

interface SegmentSummaryDialogProps {
  segments: ReadRoadSegmentType[];
  roadName: string;
}

const formatNumber = (
  value: number | null | undefined,
  fractionDigits = 2,
  fallback = "-"
) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }
  return Number(value).toFixed(fractionDigits);
};

const formatStationing = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  const km = Math.floor(value / 1000);
  const m = Math.round(value % 1000);
  return `${km}+${m.toString().padStart(3, "0")} m`;
};

const formatPavementLabel = (type: PavementType) =>
  type.charAt(0).toUpperCase() + type.slice(1);

// Helper functions to get index from value (1-based index per spec)
const getIndex = <T extends readonly string[]>(
  value: string | undefined | null,
  array: T
): string => {
  if (!value) return "-";
  const index = array.indexOf(value as T[number]);
  return index >= 0 ? String(index + 1) : "-";
};

// Helper function to get index (0-based for edge damage and pothole count)
const getIndexZeroBased = <T extends readonly string[]>(
  value: string | undefined | null,
  array: T
): string => {
  if (!value) return "-";
  const index = array.indexOf(value as T[number]);
  return index >= 0 ? String(index) : "-";
};

export default function SegmentSummaryDialog({
  segments,
  roadName,
}: SegmentSummaryDialogProps) {
  const [open, setOpen] = useState(false);

  const sortedSegments = [...segments].sort((a, b) => {
    const aNum = a.segmentNumber ?? 0;
    const bNum = b.segmentNumber ?? 0;
    return aNum - bNum;
  });

  const renderInventoryTable = (segment: ReadRoadSegmentType) => {
    return (
      <div className="overflow-x-auto rounded-lg border bg-muted/20 thin-styled-scroll-container">
        <div className="p-2 text-sm font-semibold bg-muted/40">Road Inventory</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="bg-muted/30">
                Road Side Attributes (Left)
              </TableHead>
              <TableHead colSpan={2} className="bg-muted/30">
                Road Side Attributes (Right)
              </TableHead>
              <TableHead colSpan={5} className="bg-muted/30">
                Pavement Inventory
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Shoulder Type</TableHead>
              <TableHead>Shoulder Width</TableHead>
              <TableHead>Shoulder Type</TableHead>
              <TableHead>Shoulder Width</TableHead>
              <TableHead>Pavement Width (m)</TableHead>
              <TableHead>Carriageway Width (m)</TableHead>
              <TableHead>Right of Way Width (m)</TableHead>
              <TableHead>Terrain</TableHead>
              <TableHead>Not Passable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{getIndex(segment.leftShoulderType, SHOULDER_TYPES)}</TableCell>
              <TableCell>{getIndex(segment.leftShoulderWidthM, SHOULDER_WIDTHS)}</TableCell>
              <TableCell>{getIndex(segment.rightShoulderType, SHOULDER_TYPES)}</TableCell>
              <TableCell>{getIndex(segment.rightShoulderWidthM, SHOULDER_WIDTHS)}</TableCell>
              <TableCell>{formatNumber(segment.pavementWidthM)}</TableCell>
              <TableCell>{formatNumber(segment.carriagewayWidthM)}</TableCell>
              <TableCell>{formatNumber(segment.rightOfWayWidthM)}</TableCell>
              <TableCell>{getIndex(segment.terrain, TERRAIN_TYPES)}</TableCell>
              <TableCell>{segment.notPassable ? "1 (Yes)" : "0 (No)"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead colSpan={2} className="bg-muted/30">Drainage & Land Use (Left)</TableHead>
              <TableHead colSpan={2} className="bg-muted/30">Drainage & Land Use (Right)</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Drainage Type</TableHead>
              <TableHead>Land Use Type</TableHead>
              <TableHead>Drainage Type</TableHead>
              <TableHead>Land Use Type</TableHead>
            </TableRow>
            <TableRow>
              <TableCell>{getIndex(segment.leftDrainageType, DRAINAGE_TYPES)}</TableCell>
              <TableCell>{getIndex(segment.leftLandUseType, LAND_USE_TYPES)}</TableCell>
              <TableCell>{getIndex(segment.rightDrainageType, DRAINAGE_TYPES)}</TableCell>
              <TableCell>{getIndex(segment.rightLandUseType, LAND_USE_TYPES)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderDamageAssessmentTable = (segment: ReadRoadSegmentType) => {
    if (!segment.damageAssessment?.data) return null;

    const damage = segment.damageAssessment.data;
    const pavementType = segment.pavementType;

    if (pavementType === "asphalt") {
      const asphalt = damage as any;
      return (
        <div className="overflow-x-auto rounded-lg border bg-muted/20 thin-styled-scroll-container">
          <div className="p-2 text-sm font-semibold bg-muted/40">Road Condition - Asphalt Pavement</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={3} className="bg-muted/40">
                  Surface Condition
                </TableHead>
                <TableHead colSpan={4} className="bg-muted/40">
                  Crack Damage
                </TableHead>
                <TableHead colSpan={3} className="bg-muted/40">
                  Pothole Damage
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  Rutting Damage
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  Edge Damage
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Surface Condition</TableHead>
                <TableHead>Bleeding</TableHead>
                <TableHead>Disintegration</TableHead>
                <TableHead>Crack Type</TableHead>
                <TableHead>Avg Crack Width</TableHead>
                <TableHead>Other Crack Area</TableHead>
                <TableHead>Reflective Cracking</TableHead>
                <TableHead>Number of Potholes</TableHead>
                <TableHead>Pothole Size</TableHead>
                <TableHead>Pothole Area</TableHead>
                <TableHead>Rutting</TableHead>
                <TableHead>Avg Rut Depth</TableHead>
                <TableHead>Left Edge</TableHead>
                <TableHead>Right Edge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {getIndex(asphalt.surfaceCondition, SURFACE_CONDITIONS)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.bleeding, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.disintegration, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>{getIndex(asphalt.crackType, CRACK_TYPES)}</TableCell>
                <TableCell>
                  {getIndex(asphalt.averageCrackWidth, CRACK_WIDTH_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.otherCrackArea, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.reflectiveCracking, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndexZeroBased(asphalt.numberOfPotholes, POTHOLE_COUNT_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.potholeSize, POTHOLE_SIZE_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.potholeArea, POTHOLE_AREA_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.rutting, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(asphalt.averageRutDepth, RUT_DEPTH_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndexZeroBased(asphalt.edgeDamageLeft, EDGE_DAMAGE_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndexZeroBased(asphalt.edgeDamageRight, EDGE_DAMAGE_TYPES)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    } else if (pavementType === "concrete") {
      const concrete = damage as any;
      return (
        <div className="overflow-x-auto rounded-lg border bg-muted/20 thin-styled-scroll-container">
          <div className="p-2 text-sm font-semibold bg-muted/40">Road Condition - Concrete Pavement</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4} className="bg-muted/40">
                  Structural & Surface Damage
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  Water & Joint Damage
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Cracking</TableHead>
                <TableHead>Spalling</TableHead>
                <TableHead>Structural Cracking</TableHead>
                <TableHead>Faulting</TableHead>
                <TableHead>Pumping</TableHead>
                <TableHead>Corner Break</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {getIndex(concrete.cracking, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(concrete.spalling, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(concrete.structuralCracking, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(concrete.faulting, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>{getIndex(concrete.pumping, YES_NO_TYPES)}</TableCell>
                <TableCell>{getIndex(concrete.cornerBreak, YES_NO_TYPES)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    } else if (pavementType === "block") {
      const block = damage as any;
      return (
        <div className="overflow-x-auto rounded-lg border bg-muted/20 thin-styled-scroll-container">
          <div className="p-2 text-sm font-semibold bg-muted/40">Road Condition - Block Pavement</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="bg-muted/40">
                  Surface Damage
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  Edge Damage
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  Pothole & Deformation
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Reflective Cracking</TableHead>
                <TableHead>Disintegration</TableHead>
                <TableHead>Left Edge</TableHead>
                <TableHead>Right Edge</TableHead>
                <TableHead>Pothole Area</TableHead>
                <TableHead>Rutting</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {getIndex(block.reflectiveCracking, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(block.disintegration, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndexZeroBased(block.edgeDamageLeft, EDGE_DAMAGE_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndexZeroBased(block.edgeDamageRight, EDGE_DAMAGE_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(block.potholeArea, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(block.rutting, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    } else if (pavementType === "unpaved" || pavementType === "gravel") {
      const unpaved = damage as any;
      return (
        <div className="overflow-x-auto rounded-lg border bg-muted/20 thin-styled-scroll-container">
          <div className="p-2 text-sm font-semibold bg-muted/40">Road Condition - {formatPavementLabel(pavementType)} Pavement</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="bg-muted/40">
                  Crossfall & Shape
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  Surface Failure
                </TableHead>
                <TableHead colSpan={4} className="bg-muted/40">
                  Material Quality
                </TableHead>
                <TableHead colSpan={3} className="bg-muted/40">
                  Corrugation & Deformation
                </TableHead>
                <TableHead colSpan={3} className="bg-muted/40">
                  Pothole Damage
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Crossfall Condition</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Settlement</TableHead>
                <TableHead>Erosion</TableHead>
                <TableHead>Largest Particle Size</TableHead>
                <TableHead>Gravel Thickness</TableHead>
                <TableHead>Gravel Area</TableHead>
                <TableHead>Gravel Distribution</TableHead>
                <TableHead>Corrugation</TableHead>
                <TableHead>Rutting</TableHead>
                <TableHead>Avg Rut Depth</TableHead>
                <TableHead>Number of Potholes</TableHead>
                <TableHead>Pothole Size</TableHead>
                <TableHead>Pothole Area</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {getIndex(unpaved.crossfallCondition, CROSSFALL_CONDITIONS)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.crossfallArea, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.settlement, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.erosion, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.largestParticleSize, PARTICLE_SIZE_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.gravelThickness, GRAVEL_THICKNESS_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.gravelArea, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.gravelDistribution, GRAVEL_DISTRIBUTION_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.corrugation, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.rutting, DAMAGE_PERCENTAGE_RANGES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.averageRutDepth, UNPAVED_RUT_DEPTH_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndexZeroBased(unpaved.numberOfPotholes, POTHOLE_COUNT_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.potholeSize, POTHOLE_SIZE_TYPES)}
                </TableCell>
                <TableCell>
                  {getIndex(unpaved.potholeArea, POTHOLE_AREA_PERCENTAGE_RANGES)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          variant="default"
          title="Segments Summary"
        >
          <List className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] min-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Segment Summary - {roadName}</DialogTitle>
          <DialogDescription>
            View all segment data with inventory and damage assessment details.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto pr-4 thin-styled-scroll-container">
          <div className="space-y-4">
            {sortedSegments.map((segment, index) => {
              const isFirst = index === 0;
              const isLast = index === sortedSegments.length - 1;
              const lengthM =
                Number(segment.stationingToM) - Number(segment.stationingFromM);

              let borderRadiusClass = "";
              if (isFirst && !isLast) {
                borderRadiusClass = "rounded-t-lg";
              } else if (!isFirst && isLast) {
                borderRadiusClass = "rounded-b-lg";
              } else if (isFirst && isLast) {
                borderRadiusClass = "rounded-lg";
              }

              return (
                <div
                  key={segment.id}
                  className={cn(
                    "overflow-x-auto border bg-muted/40 thin-styled-scroll-container",
                    borderRadiusClass,
                    {
                      "border-t-0": !isFirst,
                      "border-b": !isLast,
                    }
                  )}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Segment No.</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Length (m)</TableHead>
                        <TableHead>Pavement Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{segment.segmentNumber ?? "-"}</TableCell>
                        <TableCell>
                          {formatStationing(segment.stationingFromM)}
                        </TableCell>
                        <TableCell>
                          {formatStationing(segment.stationingToM)}
                        </TableCell>
                        <TableCell>
                          {formatNumber(lengthM, 2, "-")}
                        </TableCell>
                        <TableCell>
                          {formatPavementLabel(segment.pavementType)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="border-t p-4 space-y-4">
                    {renderInventoryTable(segment)}
                    {renderDamageAssessmentTable(segment)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
