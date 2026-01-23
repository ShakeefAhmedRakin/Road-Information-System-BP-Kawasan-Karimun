"use client";

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
import { PAVEMENT_TYPES, type PavementType } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { SegmentCondition } from "api/src/modules/results/results.schema";
import { Loader2 } from "lucide-react";
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

export function RoadsTable() {
  const { t } = useTranslation("manageRoads");
  const { t: tCreateRoad } = useTranslation("createRoad");
  const { data, isLoading, isError, refetch } = useQuery(
    orpc.result.listRoadsWithReportSummary.queryOptions()
  );

  const formatPavementLabel = (type: PavementType) =>
    tCreateRoad(`enums.pavementType.${type}`);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          {t("roadsTable.loading")}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          {t("roadsTable.error.message")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-primary underline underline-offset-2"
        >
          {t("roadsTable.error.retry")}
        </button>
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
        <p className="text-muted-foreground text-sm">{t("roadsTable.noRoads.message")}</p>
        <Link
          href={StaticRoutes.CREATE_ROAD}
          className={buttonVariants({ variant: "default" })}
        >
          {t("roadsTable.noRoads.createButton")}
        </Link>
      </div>
    );
  }

  return (
    <div className="thin-styled-scroll-container h-full max-h-full flex-1 overflow-x-auto overflow-y-auto rounded-lg border">
      <Table className="table-fixed min-w-full">
        <colgroup>
          <col style={{ width: "40px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "200px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "100px" }} />
          {PAVEMENT_TYPES.map((type) => (
            <col key={type} style={{ width: "70px" }} />
          ))}
          <col style={{ width: "20px" }} />
          {CONDITION_ORDER.map((condition) => (
            <Fragment key={condition}>
              <col style={{ width: "45px" }} />
              <col style={{ width: "45px" }} />
            </Fragment>
          ))}
        </colgroup>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead rowSpan={2} className="text-center align-middle">
              {t("roadsTable.headers.no")}
            </TableHead>
            <TableHead rowSpan={2} className="align-middle">
              {t("roadsTable.headers.roadNumber")}
            </TableHead>
            <TableHead rowSpan={2} className="align-middle">
              {t("roadsTable.headers.roadName")}
            </TableHead>
            <TableHead rowSpan={2} className="text-right align-middle">
              {t("roadsTable.headers.totalLength")}
            </TableHead>
            <TableHead rowSpan={2} className="text-right align-middle">
              {t("roadsTable.headers.sectionWidth")}
            </TableHead>
            <TableHead
              colSpan={PAVEMENT_TYPES.length}
              className="!text-center whitespace-normal"
            >
              <div className="px-1 break-words">{t("roadsTable.headers.percentagesOfSurfaceType")}</div>
            </TableHead>
            <TableHead rowSpan={3} className="!p-0" />
            <TableHead
              colSpan={CONDITION_ORDER.length * 2}
              className="!text-center whitespace-normal"
            >
              <div className="px-1 break-words">{t("roadsTable.headers.lengthByCondition")}</div>
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
                {t(`roadsTable.headers.conditions.${condition.toLowerCase()}`)}
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
                {t("roadsTable.headers.percent")}
              </TableHead>
            ))}
            {CONDITION_ORDER.map((condition) => (
              <Fragment key={`${condition}-labels`}>
                <TableHead className="text-center">{t("roadsTable.headers.km")}</TableHead>
                <TableHead className="text-center">{t("roadsTable.headers.percent")}</TableHead>
              </Fragment>
            ))}
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
                <TableCell className="overflow-hidden" title={road.name}>
                  <div className="truncate max-w-full">{road.name}</div>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatNumber(totalLength)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatNumber(width)}
                </TableCell>
                {hasReport ? (
                  PAVEMENT_TYPES.map((type) => (
                    <TableCell key={type} className="text-center whitespace-nowrap">
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
                    {t("roadsTable.pendingLabel")}
                  </TableCell>
                )}
                <TableCell className="!p-0" />
                {hasReport ? (
                  CONDITION_ORDER.map((condition) => (
                    <Fragment key={`${condition}-value`}>
                      <TableCell className="text-center whitespace-nowrap">
                        {formatNumber(
                          reportSummary.conditionLengthStats[condition]
                            ?.lengthKm ?? 0
                        )}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
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
                    {t("roadsTable.pendingLabel")}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
