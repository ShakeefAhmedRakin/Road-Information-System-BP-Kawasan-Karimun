"use client";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function DashboardNavigationItem({
  title,
  titleKey,
  path,
  icon,
  onClick,
}: {
  title?: string;
  titleKey?: string;
  path: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  const currentPath = usePathname();
  const { t } = useTranslation("dashboard");

  const isActive = currentPath === path;
  const displayTitle = titleKey ? t(titleKey) : title || "";

  return (
    <Link
      href={path}
      title={displayTitle}
      aria-label={displayTitle}
      onClick={onClick ? onClick : undefined}
      className={buttonVariants({
        variant: isActive ? "default" : "outline",
        className: "w-full justify-start border",
        size: "lg",
      })}
    >
      {icon}
      <span>{displayTitle}</span>
    </Link>
  );
}
