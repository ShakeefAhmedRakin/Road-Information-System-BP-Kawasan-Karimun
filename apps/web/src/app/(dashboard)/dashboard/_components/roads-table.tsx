"use client";

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
import { orpc } from "@/utils/orpc";
import { PAVEMENT_TYPES, type PavementType } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { SegmentCondition } from "api/src/modules/results/results.schema";
import { ArrowBigRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { buttonVariants } from "../../../../components/ui/button";
import { StaticRoutes } from "../../../../config/static-routes";

const CONDITION_ORDER: SegmentCondition[] = ["Good", "Fair", "Poor", "Bad"];

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

const formatPercent = (value: number | null | undefined) =>
  value === null || value === undefined ? "-" : `${formatNumber(value, 2)}%`;

const formatPavementLabel = (type: PavementType) =>
  type.charAt(0).toUpperCase() + type.slice(1);

const PENDING_LABEL = "Reports pending";

export function RoadsTable() {
  const { data, isLoading, isError, refetch } = useQuery(
    orpc.result.listRoadsWithReportSummary.queryOptions()
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Loading roads and report summaries...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          Failed to load roads. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-primary underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  const roads = data?.roads ?? [];

  if (roads.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">No roads in the system.</p>
        <Link
          href={StaticRoutes.CREATE_ROAD}
          className={buttonVariants({ variant: "default" })}
        >
          Create Road
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border thin-styled-scroll-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="w-10 text-center align-middle">
              No.
            </TableHead>
            <TableHead rowSpan={2} className="align-middle min-w-[120px] max-w-[200px]">
              Road Number
            </TableHead>
            <TableHead rowSpan={2} className="align-middle min-w-[150px] max-w-[300px]">
              Road Name
            </TableHead>
            <TableHead rowSpan={2} className="text-right align-middle">
              Total Length (km)
            </TableHead>
            <TableHead rowSpan={2} className="text-right align-middle">
              Section Width (m)
            </TableHead>
            <TableHead
              colSpan={PAVEMENT_TYPES.length}
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
            <TableHead rowSpan={2} className="text-right align-middle">
              Actions
            </TableHead>
          </TableRow>
          <TableRow>
            {PAVEMENT_TYPES.map((type) => (
              <TableHead key={type} className="text-center">
                {formatPavementLabel(type)}
              </TableHead>
            ))}
            {CONDITION_ORDER.map((condition) => (
              <TableHead
                key={`${condition}-group`}
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
            {PAVEMENT_TYPES.map((type) => (
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
          {roads.map(({ road, reportSummary }, index) => {
            const hasReport = reportSummary != null;
            const totalLength = Number(road.totalLengthKm);
            const width = Number(road.pavementWidthM);

            return (
              <TableRow key={road.id}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {road.number.length > 20 ? (
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
                  ) : (
                    <div className="truncate">{road.number}</div>
                  )}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  {road.name.length > 30 ? (
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
                  ) : (
                    <div className="truncate">{road.name}</div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(totalLength)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(width)}
                </TableCell>
                {hasReport ? (
                  PAVEMENT_TYPES.map((type) => (
                    <TableCell key={type} className="text-center">
                      {formatPercent(
                        reportSummary.pavementTypePercentages[type] ?? 0
                      )}
                    </TableCell>
                  ))
                ) : (
                  <TableCell
                    colSpan={PAVEMENT_TYPES.length}
                    className="text-center italic text-muted-foreground"
                  >
                    {PENDING_LABEL}
                  </TableCell>
                )}
                {hasReport ? (
                  CONDITION_ORDER.map((condition) => (
                    <Fragment key={`${condition}-value`}>
                      <TableCell className="text-center">
                        {formatNumber(
                          reportSummary.conditionLengthStats[condition]
                            ?.lengthKm ?? 0
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatPercent(
                          reportSummary.conditionLengthStats[condition]
                            ?.percentage ?? 0
                        )}
                      </TableCell>
                    </Fragment>
                  ))
                ) : (
                  <TableCell
                    colSpan={CONDITION_ORDER.length * 2}
                    className="text-center italic text-muted-foreground"
                  >
                    {PENDING_LABEL}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <Link
                    href={`${StaticRoutes.MANAGE_ROADS}/${road.id}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    View <ArrowBigRight className="ml-1 h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
