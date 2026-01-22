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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  if (roads.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          {tVisitor("noRoads.message")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border thin-styled-scroll-container">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 min-w-[40px] text-center">
              {tVisitor("table.headers.no")}
            </TableHead>
            <TableHead className="w-[100px] min-w-[100px]">
              {tVisitor("table.headers.roadNumber")}
            </TableHead>
            <TableHead className="w-[150px] min-w-[150px]">
              {tVisitor("table.headers.roadName")}
            </TableHead>
            <TableHead className="w-[100px] min-w-[100px] text-right">
              {tVisitor("table.headers.totalLength")}
            </TableHead>
            <TableHead className="w-[100px] min-w-[100px] text-right">
              {tVisitor("table.headers.sectionWidth")}
            </TableHead>
            <TableHead className="w-[150px] min-w-[150px] text-center">
              {tVisitor("table.headers.reportStatus")}
            </TableHead>
            <TableHead className="w-[120px] min-w-[120px] text-center">
              {tVisitor("table.headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roads.map(({ road, reportSummary }, index) => {
            const hasReport = reportSummary != null;
            const totalLength = Number(road.totalLengthKm);
            const width = Number(road.pavementWidthM);

            return (
              <TableRow key={road.id}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="w-[100px] max-w-[100px] overflow-hidden">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help" title={road.number}>
                        {road.number}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs break-words">{road.number}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-[150px] max-w-[150px] overflow-hidden">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help" title={road.name}>
                        {road.name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs break-words">{road.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-[100px] min-w-[100px] text-right">
                  {formatNumber(totalLength)} km
                </TableCell>
                <TableCell className="w-[100px] min-w-[100px] text-right">
                  {formatNumber(width)} m
                </TableCell>
                <TableCell className="w-[150px] min-w-[150px] text-center">
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
                <TableCell className="w-[120px] min-w-[120px] text-center">
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

