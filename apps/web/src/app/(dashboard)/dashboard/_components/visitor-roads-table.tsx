"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ReportDialogTrigger } from "../manage-roads/[roadId]/_components/report-dialog";

const formatNumber = (
  value: number | string | null | undefined,
  fractionDigits = 2,
  fallback = "-"
) => {
  if (value === null || value === undefined) return fallback;
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return n.toFixed(fractionDigits);
};

export function VisitorRoadsTable() {
  const { t } = useTranslation("pageHeaders");
  const { t: tVisitor } = useTranslation("visitorRoads");

  const { data, isLoading, isError, refetch } = useQuery(
    orpc.result.listVisibleRoadsWithReportSummary.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          {tVisitor("loading")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          {tVisitor("error.message")}
        </p>
        <Button
          type="button"
          variant="link"
          onClick={() => refetch()}
        >
          {tVisitor("error.retry")}
        </Button>
      </div>
    );
  }

  const roads = data?.roads ?? [];

  // Sort roads by number (try numeric sort, fallback to string sort)
  const sortedRoads = [...roads].sort((a, b) => {
    const numA = Number(a.road.number);
    const numB = Number(b.road.number);
    
    // If both are valid numbers, sort numerically
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA - numB;
    }
    
    // Fallback to string comparison
    return a.road.number.localeCompare(b.road.number, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  if (sortedRoads.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          {tVisitor("noRoads.message")}
        </p>
      </div>
    );
  }

  return (
    <div className="thin-styled-scroll-container h-full flex-1 overflow-x-auto overflow-y-auto rounded-lg border">
      <Table className="table-fixed min-w-full">
        <colgroup>
          <col style={{ width: "40px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "200px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "150px" }} />
          <col style={{ width: "120px" }} />
        </colgroup>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-center">
              {tVisitor("table.headers.no")}
            </TableHead>
            <TableHead>
              {tVisitor("table.headers.roadNumber")}
            </TableHead>
            <TableHead>
              {tVisitor("table.headers.roadName")}
            </TableHead>
            <TableHead className="text-right">
              {tVisitor("table.headers.totalLength")}
            </TableHead>
            <TableHead className="text-right">
              {tVisitor("table.headers.sectionWidth")}
            </TableHead>
            <TableHead className="text-center">
              {tVisitor("table.headers.reportStatus")}
            </TableHead>
            <TableHead className="text-center">
              {tVisitor("table.headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRoads.map(({ road, reportSummary }, index) => {
            const hasReport = reportSummary != null;
            const totalLength = Number(road.totalLengthKm);
            const width = Number(road.pavementWidthM);

            return (
              <TableRow key={road.id}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {road.number}
                </TableCell>
                <TableCell className="break-words">
                  {road.name}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatNumber(totalLength)} km
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatNumber(width)} m
                </TableCell>
                <TableCell className="text-center">
                  {hasReport ? (
                    <Badge variant="default" className="bg-green-600">
                      {tVisitor("table.reportStatus.available")}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {tVisitor("table.reportStatus.pending")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <ReportStatusCell
                    roadId={road.id}
                    roadName={road.name}
                    roadNumber={road.number}
                    hasReport={hasReport}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ReportStatusCell({
  roadId,
  roadName,
  roadNumber,
  hasReport,
}: {
  roadId: string;
  roadName: string;
  roadNumber: string;
  hasReport: boolean;
}) {
  const { t } = useTranslation("visitorRoads");
  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    ...orpc.result.statusByRoadIdForVisitor.queryOptions({
      input: { roadId },
    }),
    enabled: hasReport,
  });

  if (!hasReport) {
    return (
      <p className="text-muted-foreground text-sm italic">
        {t("table.actions.reportPending")}
      </p>
    );
  }

  const isChecking = isStatusLoading;
  const isViewDisabled =
    isStatusLoading || !statusData || !statusData.hasReport;

  return (
    <ReportDialogTrigger
      roadId={roadId}
      roadName={roadName}
      roadNumber={roadNumber}
      disabled={isViewDisabled}
      isChecking={isChecking}
      useVisitorEndpoint={true}
    />
  );
}

