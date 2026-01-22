"use client";

import { Badge } from "@/components/ui/badge";
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
import { orpc } from "@/utils/orpc";
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
import { useQuery } from "@tanstack/react-query";
import type { SegmentCondition } from "api/src/modules/results/results.schema";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { Download, Loader2, View } from "lucide-react";
import { Fragment, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const SURFACE_TYPES: PavementType[] = [
  "asphalt",
  "concrete",
  "block",
  "gravel",
  "unpaved",
];

const CONDITION_ORDER: SegmentCondition[] = ["Good", "Fair", "Poor", "Bad"];

interface ReportDialogProps {
  roadId: string;
  disabled: boolean;
  roadName: string;
  roadNumber: string;
  isChecking: boolean;
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

const formatPercent = (value: number | null | undefined) =>
  value === null || value === undefined ? "-" : `${formatNumber(value, 2)}%`;

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

export function ReportDialogTrigger({
  roadId,
  roadName,
  roadNumber,
  disabled,
  isChecking,
}: ReportDialogProps) {
  const { t } = useTranslation("roadDetails");
  const { t: tCreateRoad } = useTranslation("createRoad");
  const [open, setOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const reportQuery = useQuery({
    ...orpc.result.getReportByRoadId.queryOptions({
      input: { roadId },
    }),
    enabled: open && !disabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const handleOpenChange = (next: boolean) => {
    if (disabled && next) {
      return;
    }
    setOpen(next);
  };

  const generatePDF = async () => {
    if (!contentRef.current || !reportQuery.data) {
      toast.error(t("reportDialog.toasts.contentUnavailable"));
      return;
    }

    setIsGeneratingPdf(true);
    const toastId = "pdf-generation";

    try {
      toast.loading(t("reportDialog.generatingPdf"), { id: toastId });

      const element = contentRef.current;

      // Create a hidden clone with fixed desktop width for PDF rendering
      const clone = element.cloneNode(true) as HTMLElement;

      // Set fixed width and styling for consistent rendering
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "1920px"; // Fixed 1080p width
      clone.style.minWidth = "1920px";
      clone.style.maxWidth = "1920px";
      clone.style.overflow = "visible";
      clone.style.backgroundColor = "#ffffff";

      // Append to body to render
      document.body.appendChild(clone);

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture the clone as canvas with high quality
      const canvas = await html2canvas(clone, {
        scale: 2, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 1920,
        windowWidth: 1920,
      });

      // Remove the clone
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10; // mm
      const topMargin = 15; // mm for top
      const bottomMargin = 15; // mm for bottom

      // Calculate the usable dimensions
      const imgWidth = pdfWidth - 2 * margin;
      const pageContentHeight = pdfHeight - topMargin - bottomMargin;

      // Calculate image dimensions
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add title page info on first page
      let currentPage = 1;
      let yPosition = topMargin;

      pdf.setFontSize(16);
      pdf.text(t("reportDialog.title"), margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.text(`${t("reportDialog.roadName")}: ${roadName}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`${t("reportDialog.roadNumber")}: ${roadNumber}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`${t("reportDialog.roadId")}: ${roadId}`, margin, yPosition);
      yPosition += 5;
      pdf.text(
        t("reportDialog.resultGenerated", { date: reportQuery.data.report.updatedAt.toLocaleString() }),
        margin,
        yPosition
      );
      yPosition += 5;
      pdf.text(
        t("reportDialog.pdfGenerated", { date: new Date().toLocaleString() }),
        margin,
        yPosition
      );
      yPosition += 10;

      // Calculate how much content fits on the first page after header
      const firstPageContentHeight = pdfHeight - yPosition - bottomMargin;

      // Scale factor: how many mm of canvas height fits per mm of PDF
      const pxPerMm = canvas.height / imgHeight;

      // Render the image across pages
      let srcY = 0; // Current position in source image (in pixels)
      const totalCanvasHeight = canvas.height;

      // First page
      const firstPageHeightPx = firstPageContentHeight * pxPerMm;

      if (srcY < totalCanvasHeight) {
        const srcHeight = Math.min(
          Math.ceil(firstPageHeightPx),
          totalCanvasHeight - srcY
        );
        const destHeight = srcHeight / pxPerMm;

        // Create a temporary canvas for this slice
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = srcHeight;
        const tempCtx = tempCanvas.getContext("2d");

        if (tempCtx) {
          tempCtx.drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            srcHeight,
            0,
            0,
            canvas.width,
            srcHeight
          );

          const sliceData = tempCanvas.toDataURL("image/png");
          pdf.addImage(
            sliceData,
            "PNG",
            margin,
            yPosition,
            imgWidth,
            destHeight
          );
        }

        srcY += srcHeight;
      }

      // Subsequent pages
      const pageHeightPx = pageContentHeight * pxPerMm;

      while (srcY < totalCanvasHeight) {
        pdf.addPage();
        currentPage++;

        const srcHeight = Math.min(
          Math.ceil(pageHeightPx),
          totalCanvasHeight - srcY
        );
        const destHeight = srcHeight / pxPerMm;

        // Create a temporary canvas for this slice
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = srcHeight;
        const tempCtx = tempCanvas.getContext("2d");

        if (tempCtx) {
          tempCtx.drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            srcHeight,
            0,
            0,
            canvas.width,
            srcHeight
          );

          const sliceData = tempCanvas.toDataURL("image/png");
          pdf.addImage(
            sliceData,
            "PNG",
            margin,
            topMargin,
            imgWidth,
            destHeight
          );
        }

        srcY += srcHeight;
      }

      // Add page numbers
      const totalPages = currentPage;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(t("reportDialog.pageOf", { current: i, total: totalPages }), pdfWidth / 2, pdfHeight - 8, {
          align: "center",
        });
      }

      // Save the PDF
      const fileName = `Road_Report_${roadNumber}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      toast.success(t("reportDialog.toasts.pdfSuccess"), { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t("reportDialog.toasts.pdfFailed"), { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const segmentRows = useMemo(() => {
    if (!reportQuery.data?.report?.segments) {
      return [];
    }
    return [...reportQuery.data.report.segments].sort((a, b) => {
      const aNum = a.segmentNumber ?? 0;
      const bNum = b.segmentNumber ?? 0;
      return aNum - bNum;
    });
  }, [reportQuery.data]);

  const renderSummaryTable = () => {
    const road = reportQuery.data?.road;
    const report = reportQuery.data?.report;

    if (!road || !report) {
      return null;
    }

    return (
      <div className="overflow-x-auto rounded-lg border thin-styled-scroll-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>{t("reportDialog.summaryTable.roadNumber")}</TableHead>
              <TableHead rowSpan={2}>{t("reportDialog.summaryTable.roadName")}</TableHead>
              <TableHead rowSpan={2}>{t("reportDialog.summaryTable.totalLength")}</TableHead>
              <TableHead rowSpan={2}>{t("reportDialog.summaryTable.sectionWidth")}</TableHead>
              <TableHead
                colSpan={SURFACE_TYPES.length}
                className="!text-center"
              >
                {t("reportDialog.summaryTable.percentagesOfSurfaceType")}
              </TableHead>
              <TableHead
                colSpan={CONDITION_ORDER.length * 2}
                className="!text-center"
              >
                {t("reportDialog.summaryTable.lengthByCondition")}
              </TableHead>
            </TableRow>
            <TableRow>
              {SURFACE_TYPES.map((type) => (
                <TableHead key={type} className="text-center">
                  {tCreateRoad(`enums.pavementType.${type}`)}
                </TableHead>
              ))}
              {CONDITION_ORDER.map((condition) => (
                <TableHead
                  key={`${condition}-km`}
                  className="text-center"
                  colSpan={2}
                >
                  {t(`reportDialog.summaryTable.conditions.${condition.toLowerCase()}`)}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              <TableHead />
              <TableHead />
              <TableHead />
              <TableHead />
              {SURFACE_TYPES.map((type) => (
                <TableHead key={`${type}-percent`} className="text-center">
                  {t("reportDialog.summaryTable.percent")}
                </TableHead>
              ))}
              {CONDITION_ORDER.map((condition) => (
                <Fragment key={`${condition}-labels`}>
                  <TableHead className="text-center">{t("reportDialog.summaryTable.km")}</TableHead>
                  <TableHead className="text-center">{t("reportDialog.summaryTable.percent")}</TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{road.number}</TableCell>
              <TableCell>{road.name}</TableCell>
              <TableCell>{formatNumber(road.totalLengthKm)}</TableCell>
              <TableCell>{formatNumber(road.pavementWidthM)}</TableCell>
              {SURFACE_TYPES.map((type) => (
                <TableCell key={`${type}-value`} className="text-center">
                  {formatPercent(report.pavementTypePercentages[type] ?? 0)}
                </TableCell>
              ))}
              {CONDITION_ORDER.map((condition) => (
                <Fragment key={`${condition}-value`}>
                  <TableCell className="text-center">
                    {formatNumber(
                      report.conditionLengthStats[condition]?.lengthKm ?? 0
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatPercent(
                      report.conditionLengthStats[condition]?.percentage ?? 0
                    )}
                  </TableCell>
                </Fragment>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };


  const renderInventoryTable = (segment: any) => {
    if (!segment.inventory) return null;

    const inv = segment.inventory;

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
              <TableCell>{getIndex(inv.leftShoulderType, SHOULDER_TYPES)}</TableCell>
              <TableCell>{getIndex(inv.leftShoulderWidthM, SHOULDER_WIDTHS)}</TableCell>
              <TableCell>{getIndex(inv.rightShoulderType, SHOULDER_TYPES)}</TableCell>
              <TableCell>{getIndex(inv.rightShoulderWidthM, SHOULDER_WIDTHS)}</TableCell>
              <TableCell>{formatNumber(inv.pavementWidthM)}</TableCell>
              <TableCell>{formatNumber(inv.carriagewayWidthM)}</TableCell>
              <TableCell>{formatNumber(inv.rightOfWayWidthM)}</TableCell>
              <TableCell>{getIndex(inv.terrain, TERRAIN_TYPES)}</TableCell>
              <TableCell>{inv.notPassable ? t("segmentSummary.notPassableYes") : t("segmentSummary.notPassableNo")}</TableCell>
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
              <TableCell>{getIndex(inv.leftDrainageType, DRAINAGE_TYPES)}</TableCell>
              <TableCell>{getIndex(inv.leftLandUseType, LAND_USE_TYPES)}</TableCell>
              <TableCell>{getIndex(inv.rightDrainageType, DRAINAGE_TYPES)}</TableCell>
              <TableCell>{getIndex(inv.rightLandUseType, LAND_USE_TYPES)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderDamageAssessmentTable = (segment: any) => {
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

  const renderSegmentTable = () => {
    if (!segmentRows.length) {
      return (
        <p className="text-muted-foreground text-sm">
          No segment results found for this road.
        </p>
      );
    }

    return (
      <div>
        {segmentRows.map((segment, index) => {
          const isFirst = index === 0;
          const isLast = index === segmentRows.length - 1;
          
          // Border radius classes
          let borderRadiusClass = "";
          if (isFirst && !isLast) {
            // First segment: rounded top only
            borderRadiusClass = "rounded-t-lg";
          } else if (!isFirst && isLast) {
            // Last segment: rounded bottom only
            borderRadiusClass = "rounded-b-lg";
          } else if (isFirst && isLast) {
            // Only one segment: rounded all
            borderRadiusClass = "rounded-lg";
          }
          // Middle segments: no rounding

          return (
            <div
              key={segment.segmentId}
              className={cn("overflow-x-auto border bg-muted/40 thin-styled-scroll-container", borderRadiusClass, {
                "border-t-0": !isFirst,
                "border-b": !isLast,
              })}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("segmentSummary.segmentNo")}</TableHead>
                    <TableHead>{t("segmentSummary.from")}</TableHead>
                    <TableHead>{t("segmentSummary.to")}</TableHead>
                    <TableHead>{t("segmentSummary.lengthM")}</TableHead>
                    <TableHead>{t("segmentSummary.pavementType")}</TableHead>
                    <TableHead>{t("reportDialog.summaryTable.tti")}</TableHead>
                    <TableHead>{t("reportDialog.summaryTable.condition")}</TableHead>
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
                      {formatNumber(segment.segmentLengthM, 2, "-")}
                    </TableCell>
                    <TableCell>
                      {tCreateRoad(`enums.pavementType.${segment.pavementType}`)}
                    </TableCell>
                    <TableCell>{formatNumber(segment.tti)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn({
                          "bg-green-600": segment.condition === "Good",
                          "bg-yellow-500 text-black":
                            segment.condition === "Fair",
                          "bg-orange-500": segment.condition === "Poor",
                          "bg-red-600": segment.condition === "Bad",
                        })}
                      >
                        {t(`reportDialog.summaryTable.conditions.${segment.condition.toLowerCase()}`)}
                      </Badge>
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
    );
  };

  const renderContent = () => {
    if (reportQuery.isLoading || reportQuery.isFetching) {
      return (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="flex flex-col items-center gap-y-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Loading report details...
            </p>
          </div>
        </div>
      );
    }

    if (reportQuery.isError || !reportQuery.data) {
      return (
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm">
            {t("reportDialog.unableToLoad")}
          </p>
          <Button
            variant="outline"
            onClick={() => reportQuery.refetch()}
            disabled={reportQuery.isFetching}
          >
            {t("reportDialog.retry")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {renderSummaryTable()}
        <div>
          <h4 className="mb-2 text-base font-semibold">
            Treatment Trigger Index (TTI) by Segment
          </h4>
          {renderSegmentTable()}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={disabled}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("reportDialog.checking")}
            </>
          ) : (
            <>
              {t("reportDialog.viewReport")}
              <View className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] min-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mr-5 flex items-center justify-between">
            <span>{t("reportDialog.title")}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={generatePDF}
              disabled={
                isGeneratingPdf ||
                reportQuery.isLoading ||
                reportQuery.isError ||
                !reportQuery.data
              }
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden md:inline">{t("reportDialog.generatingPdf")}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">{t("reportDialog.downloadPdf")}</span>
                </>
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            {t("reportDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto pr-4">
          <div ref={contentRef}>
            <div className="bg-muted/30 mb-4 space-y-1 rounded-md border p-3">
              <p className="text-xs">
                <strong>{t("reportDialog.roadId")}:</strong> {roadId}
              </p>
              <p className="text-xs">
                <strong>{t("reportDialog.roadName")}:</strong> {roadName}
              </p>
              <p className="text-xs">
                <strong>{t("reportDialog.roadNumber")}:</strong> {roadNumber}
              </p>
            </div>
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
