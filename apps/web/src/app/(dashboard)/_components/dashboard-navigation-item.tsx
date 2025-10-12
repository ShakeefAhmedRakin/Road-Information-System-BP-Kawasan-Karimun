"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function DashboardNavigationItem({
  title,
  path,
  icon,
  onClick,
}: {
  title: string;
  path: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  const currentPath = usePathname();

  const isActive = currentPath === path;

  return (
    <Link
      href={path}
      title={title}
      aria-label={title}
      onClick={onClick ? onClick : undefined}
      className={buttonVariants({
        variant: isActive ? "default" : "outline",
        className: "w-full justify-start border",
        size: "lg",
      })}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}
