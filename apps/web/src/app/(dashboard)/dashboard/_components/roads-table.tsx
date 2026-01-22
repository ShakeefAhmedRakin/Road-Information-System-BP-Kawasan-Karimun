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
import { useTranslation } from "@/i18n/hooks/useTranslation";
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

  if (roads.length === 0) {
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
    <div className="w-full overflow-x-auto rounded-lg border thin-styled-scroll-container">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="w-10 min-w-[40px] text-center align-middle">
              {t("roadsTable.headers.no")}
            </TableHead>
            <TableHead rowSpan={2} className="align-middle w-[50px] min-w-[50px]">
              {t("roadsTable.headers.roadNumber")}
            </TableHead>
            <TableHead rowSpan={2} className="align-middle w-[100px] min-w-[100px]">
              {t("roadsTable.headers.roadName")}
            </TableHead>
            <TableHead rowSpan={2} className="w-[100px] min-w-[100px] text-right align-middle">
              {t("roadsTable.headers.totalLength")}
            </TableHead>
            <TableHead rowSpan={2} className="w-[100px] min-w-[100px] text-right align-middle">
              {t("roadsTable.headers.sectionWidth")}
            </TableHead>
            <TableHead
              colSpan={PAVEMENT_TYPES.length}
              className="!text-center whitespace-normal"
            >
              <div className="px-1 break-words">{t("roadsTable.headers.percentagesOfSurfaceType")}</div>
            </TableHead>
            <TableHead
              colSpan={CONDITION_ORDER.length * 2}
              className="!text-center whitespace-normal"
            >
              <div className="px-1 break-words">{t("roadsTable.headers.lengthByCondition")}</div>
            </TableHead>
          </TableRow>
          <TableRow>
            {PAVEMENT_TYPES.map((type) => (
              <TableHead key={type} className="w-[70px] min-w-[70px] text-center">
                {formatPavementLabel(type)}
              </TableHead>
            ))}
            {CONDITION_ORDER.map((condition) => (
              <TableHead
                key={`${condition}-group`}
                className="w-[90px] min-w-[90px] text-center"
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
              <TableHead key={`${type}-percent`} className="w-[70px] min-w-[70px] text-center">
                {t("roadsTable.headers.percent")}
              </TableHead>
            ))}
            {CONDITION_ORDER.map((condition) => (
              <Fragment key={`${condition}-labels`}>
                <TableHead className="w-[45px] min-w-[45px] text-center">{t("roadsTable.headers.km")}</TableHead>
                <TableHead className="w-[45px] min-w-[45px] text-center">{t("roadsTable.headers.percent")}</TableHead>
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
                <TableCell className="w-[50px] max-w-[50px] overflow-hidden">
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
                <TableCell className="w-[100px] max-w-[100px] overflow-hidden">
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
                  {formatNumber(totalLength)}
                </TableCell>
                <TableCell className="w-[100px] min-w-[100px] text-right">
                  {formatNumber(width)}
                </TableCell>
                {hasReport ? (
                  PAVEMENT_TYPES.map((type) => (
                    <TableCell key={type} className="w-[70px] min-w-[70px] text-center">
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
                {hasReport ? (
                  CONDITION_ORDER.map((condition) => (
                    <Fragment key={`${condition}-value`}>
                      <TableCell className="w-[45px] min-w-[45px] text-center">
                        {formatNumber(
                          reportSummary.conditionLengthStats[condition]
                            ?.lengthKm ?? 0
                        )}
                      </TableCell>
                      <TableCell className="w-[45px] min-w-[45px] text-center">
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
