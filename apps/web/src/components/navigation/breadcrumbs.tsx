"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Breadcrumbs({ showHome = true }: { showHome?: boolean }) {
  const currentPath = usePathname();
  const pathNames = currentPath.split("/").filter((path) => path);

  return (
    <div className="scrollbar-hide w-full overflow-x-auto whitespace-nowrap">
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap text-[11px]">
          {showHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" title="Home">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathNames.length > 0 && <BreadcrumbSeparator />}
            </>
          )}

          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const isActive = href === currentPath;
            const linkLabel = link
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

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
