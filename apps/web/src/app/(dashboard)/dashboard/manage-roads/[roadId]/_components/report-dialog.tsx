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
import { Loader2, View } from "lucide-react";
import { Fragment, useMemo, useState } from "react";

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
  disabled,
  isChecking,
}: ReportDialogProps) {
  const [open, setOpen] = useState(false);

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
              <TableHead rowSpan={2}>No</TableHead>
              <TableHead rowSpan={2}>Road Section No.</TableHead>
              <TableHead rowSpan={2}>Road Section Name</TableHead>
              <TableHead rowSpan={2}>Section Length (km)</TableHead>
              <TableHead rowSpan={2}>Section Width (m)</TableHead>
              <TableHead colSpan={SURFACE_TYPES.length}>
                Percentages of Surface Type
              </TableHead>
              <TableHead colSpan={CONDITION_ORDER.length * 2}>
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
              <TableCell>1</TableCell>
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
          <DialogTitle>Road Condition Report</DialogTitle>
          <DialogDescription>
            Review the latest surface type distribution and TTI per segment.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto pr-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
