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
import { useTranslation } from "@/i18n/hooks/useTranslation";
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
  const { t } = useTranslation("roadDetails");
  const { t: tCreateRoad } = useTranslation("createRoad");
  const [open, setOpen] = useState(false);

  const sortedSegments = [...segments].sort((a, b) => {
    const aNum = a.segmentNumber ?? 0;
    const bNum = b.segmentNumber ?? 0;
    return aNum - bNum;
  });

  const renderInventoryTable = (segment: ReadRoadSegmentType) => {
    return (
      <div className="overflow-x-auto rounded-lg border bg-muted/20 thin-styled-scroll-container">
        <div className="p-2 text-sm font-semibold bg-muted/40">{tCreateRoad("segmentForms.roadInventory.title")}</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="bg-muted/30">
                {t("segmentSummary.inventory.roadSideAttributesLeft")}
              </TableHead>
              <TableHead colSpan={2} className="bg-muted/30">
                {t("segmentSummary.inventory.roadSideAttributesRight")}
              </TableHead>
              <TableHead colSpan={5} className="bg-muted/30">
                {tCreateRoad("segmentForms.roadInventory.title")}
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>{tCreateRoad("segmentForms.shoulderType.label")}</TableHead>
              <TableHead>{tCreateRoad("segmentForms.shoulderWidth.label")}</TableHead>
              <TableHead>{tCreateRoad("segmentForms.shoulderType.label")}</TableHead>
              <TableHead>{tCreateRoad("segmentForms.shoulderWidth.label")}</TableHead>
              <TableHead>{t("segmentSummary.inventory.pavementWidth")}</TableHead>
              <TableHead>{t("segmentSummary.inventory.carriagewayWidth")}</TableHead>
              <TableHead>{t("segmentSummary.inventory.rightOfWayWidth")}</TableHead>
              <TableHead>{t("segmentSummary.inventory.terrain")}</TableHead>
              <TableHead>{t("segmentSummary.inventory.notPassable")}</TableHead>
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
              <TableHead colSpan={2} className="bg-muted/30">{t("segmentSummary.inventory.drainageLandUseLeft")}</TableHead>
              <TableHead colSpan={2} className="bg-muted/30">{t("segmentSummary.inventory.drainageLandUseRight")}</TableHead>
            </TableRow>
            <TableRow>
              <TableHead>{tCreateRoad("segmentForms.drainageType.label")}</TableHead>
              <TableHead>{tCreateRoad("segmentForms.landUseType.label")}</TableHead>
              <TableHead>{tCreateRoad("segmentForms.drainageType.label")}</TableHead>
              <TableHead>{tCreateRoad("segmentForms.landUseType.label")}</TableHead>
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
          <div className="p-2 text-sm font-semibold bg-muted/40">{t("segmentSummary.damageAssessment.roadCondition", { pavementType: tCreateRoad(`enums.pavementType.asphalt`) })}</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={3} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.surfaceCondition")}
                </TableHead>
                <TableHead colSpan={4} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.crackDamage")}
                </TableHead>
                <TableHead colSpan={3} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.potholeDamage")}
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.ruttingDamage")}
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.edgeDamage")}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>{tCreateRoad("damageAssessment.fields.surfaceCondition")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.bleeding")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.disintegration")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.crackType")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.avgCrackWidth")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.otherCrackArea")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.reflectiveCracking")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.numberOfPotholes")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.potholeSize")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.potholeArea")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.rutting")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.avgRutDepth")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.leftEdge")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.rightEdge")}</TableHead>
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
          <div className="p-2 text-sm font-semibold bg-muted/40">{t("segmentSummary.damageAssessment.roadCondition", { pavementType: tCreateRoad(`enums.pavementType.concrete`) })}</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={4} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.structuralSurfaceDamage")}
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.waterJointDamage")}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>{tCreateRoad("damageAssessment.fields.cracking")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.spalling")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.structuralCracking")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.faulting")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.pumping")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.cornerBreak")}</TableHead>
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
          <div className="p-2 text-sm font-semibold bg-muted/40">{t("segmentSummary.damageAssessment.roadCondition", { pavementType: tCreateRoad(`enums.pavementType.block`) })}</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.surfaceDamage")}
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.edgeDamage")}
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.potholeDeformation")}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>{tCreateRoad("damageAssessment.fields.reflectiveCracking")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.disintegration")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.leftEdge")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.rightEdge")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.potholeArea")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.rutting")}</TableHead>
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
          <div className="p-2 text-sm font-semibold bg-muted/40">{t("segmentSummary.damageAssessment.roadCondition", { pavementType: tCreateRoad(`enums.pavementType.${pavementType}`) })}</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.crossfallShape")}
                </TableHead>
                <TableHead colSpan={2} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.surfaceFailure")}
                </TableHead>
                <TableHead colSpan={4} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.materialQuality")}
                </TableHead>
                <TableHead colSpan={3} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.corrugationDeformation")}
                </TableHead>
                <TableHead colSpan={3} className="bg-muted/40">
                  {tCreateRoad("damageAssessment.sections.potholeDamage")}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>{t("segmentSummary.damageAssessment.crossfallCondition")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.area")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.settlement")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.erosion")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.largestParticleSize")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.gravelThickness")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.gravelArea")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.gravelDistribution")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.corrugation")}</TableHead>
                <TableHead>{tCreateRoad("damageAssessment.fields.rutting")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.avgRutDepth")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.numberOfPotholes")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.potholeSize")}</TableHead>
                <TableHead>{t("segmentSummary.damageAssessment.potholeArea")}</TableHead>
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
          title={t("segmentSummary.buttonTitle")}
        >
          <List className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] min-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("segmentSummary.dialogTitle", { roadName })}</DialogTitle>
          <DialogDescription>
            {t("segmentSummary.dialogDescription")}
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
                        <TableHead>{t("segmentSummary.segmentNo")}</TableHead>
                        <TableHead>{t("segmentSummary.from")}</TableHead>
                        <TableHead>{t("segmentSummary.to")}</TableHead>
                        <TableHead>{t("segmentSummary.lengthM")}</TableHead>
                        <TableHead>{t("segmentSummary.pavementType")}</TableHead>
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
                          {tCreateRoad(`enums.pavementType.${segment.pavementType}`)}
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
