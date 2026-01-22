"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Map path segments to translation keys
function getBreadcrumbLabel(
  segment: string,
  index: number,
  pathNames: string[],
  t: (key: string) => string
): string {
  // Handle dynamic routes (UUIDs, IDs, etc.)
  if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    // Check if previous segment is "manage-roads" to show "Road Details"
    if (index > 0 && pathNames[index - 1] === "manage-roads") {
      return t("roadDetails");
    }
    // Otherwise, just show "Road" for dynamic segments
    return t("road");
  }

  // Map known path segments to translation keys
  const pathMap: Record<string, string> = {
    dashboard: "dashboard",
    account: "account",
    "manage-roads": "manageRoads",
    "manage-users": "manageUsers",
    "create-road": "createRoad",
  };

  const translationKey = pathMap[segment];
  if (translationKey) {
    return t(translationKey);
  }

  // Fallback: capitalize the segment
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function Breadcrumbs({ showHome = true }: { showHome?: boolean }) {
  const currentPath = usePathname();
  const { t } = useTranslation("breadcrumbs");
  const pathNames = currentPath.split("/").filter((path) => path);

  return (
    <div className="scrollbar-hide w-full overflow-x-auto whitespace-nowrap">
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap text-[11px]">
          {showHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" title={t("home")}>
                    {t("home")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathNames.length > 0 && <BreadcrumbSeparator />}
            </>
          )}

          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const isActive = href === currentPath;
            const linkLabel = getBreadcrumbLabel(link, index, pathNames, t);

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isActive ? (
                    <BreadcrumbPage className="text-muted-foreground">
                      {linkLabel.length > 40
                        ? `${linkLabel.substring(0, 40)}...`
                        : linkLabel}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={href}
                        title={linkLabel}
                        className="text-foreground"
                      >
                        {linkLabel}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {pathNames.length !== index + 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
