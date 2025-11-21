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
import { useQuery } from "@tanstack/react-query";
import type { SegmentCondition } from "api/src/modules/results/results.schema";
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

export function ReportDialogTrigger({
  roadId,
  roadName,
  roadNumber,
  disabled,
  isChecking,
}: ReportDialogProps) {
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
      toast.error("Report content not available");
      return;
    }

    setIsGeneratingPdf(true);
    const toastId = "pdf-generation";

    try {
      toast.loading("Generating PDF...", { id: toastId });

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
      pdf.text("Road Condition Report", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.text(`Road Name: ${roadName}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Road Number: ${roadNumber}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Road ID: ${roadId}`, margin, yPosition);
      yPosition += 5;
      pdf.text(
        `Result Generated: ${reportQuery.data.report.updatedAt.toLocaleString()}`,
        margin,
        yPosition
      );
      yPosition += 5;
      pdf.text(
        `PDF Generated: ${new Date().toLocaleString()}`,
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
        pdf.text(`Page ${i} of ${totalPages}`, pdfWidth / 2, pdfHeight - 8, {
          align: "center",
        });
      }

      // Save the PDF
      const fileName = `Road_Report_${roadNumber}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      toast.success("PDF generated successfully", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF", { id: toastId });
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
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Road Number</TableHead>
              <TableHead rowSpan={2}>Road Name</TableHead>
              <TableHead rowSpan={2}>Total Length (km)</TableHead>
              <TableHead rowSpan={2}>Section Width (m)</TableHead>
              <TableHead
                colSpan={SURFACE_TYPES.length}
                className="!text-center"
              >
                Percentages of Surface Type
              </TableHead>
              <TableHead
                colSpan={CONDITION_ORDER.length * 2}
                className="!text-center"
              >
                Length by Condition
              </TableHead>
            </TableRow>
            <TableRow>
              {SURFACE_TYPES.map((type) => (
                <TableHead key={type} className="text-center">
                  {formatPavementLabel(type)}
                </TableHead>
              ))}
              {CONDITION_ORDER.map((condition) => (
                <TableHead
                  key={`${condition}-km`}
                  className="text-center"
                  colSpan={2}
                >
                  {condition}
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
                  %
                </TableHead>
              ))}
              {CONDITION_ORDER.map((condition) => (
                <Fragment key={`${condition}-labels`}>
                  <TableHead className="text-center">km</TableHead>
                  <TableHead className="text-center">%</TableHead>
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

  const renderSegmentTable = () => {
    if (!segmentRows.length) {
      return (
        <p className="text-muted-foreground text-sm">
          No segment results found for this road.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Segment No.</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Length (m)</TableHead>
              <TableHead>Pavement Type</TableHead>
              <TableHead>TTI</TableHead>
              <TableHead>Condition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segmentRows.map((segmentSummary, index) => (
              <TableRow key={segmentSummary.segmentId}>
                <TableCell>{segmentSummary.segmentNumber ?? "-"}</TableCell>
                <TableCell>
                  {formatStationing(segmentSummary.stationingFromM)}
                </TableCell>
                <TableCell>
                  {formatStationing(segmentSummary.stationingToM)}
                </TableCell>
                <TableCell>
                  {formatNumber(segmentSummary.segmentLengthM, 2, "-")}
                </TableCell>
                <TableCell>
                  {formatPavementLabel(segmentSummary.pavementType)}
                </TableCell>
                <TableCell>{formatNumber(segmentSummary.tti)}</TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      "bg-green-600": segmentSummary.condition === "Good",
                      "bg-yellow-500 text-black":
                        segmentSummary.condition === "Fair",
                      "bg-orange-500": segmentSummary.condition === "Poor",
                      "bg-red-600": segmentSummary.condition === "Bad",
                    })}
                  >
                    {segmentSummary.condition}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            Unable to load the report for this road.
          </p>
          <Button
            variant="outline"
            onClick={() => reportQuery.refetch()}
            disabled={reportQuery.isFetching}
          >
            Retry
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
              Checking report...
            </>
          ) : (
            <>
              View Report
              <View className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] min-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mr-5 flex items-center justify-between">
            <span>Road Condition Report</span>
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
                  <span className="hidden md:inline">Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Download PDF</span>
                </>
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Review the latest surface type distribution and TTI per segment.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto pr-4">
          <div ref={contentRef}>
            <div className="bg-muted/30 mb-4 space-y-1 rounded-md border p-3">
              <p className="text-xs">
                <strong>Road ID:</strong> {roadId}
              </p>
              <p className="text-xs">
                <strong>Road Name:</strong> {roadName}
              </p>
              <p className="text-xs">
                <strong>Road Number:</strong> {roadNumber}
              </p>
            </div>
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
