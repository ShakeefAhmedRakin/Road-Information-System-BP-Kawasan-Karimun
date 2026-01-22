"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import { Filter, ShieldCheck, User } from "lucide-react";
import { Checkbox } from "../../../../../components/ui/checkbox";

export default function UserTableFilterDropdown({
  isLoading,
  roleFilter,
  setRoleFilter,
  bannedFilter,
  setBannedFilter,
}: {
  isLoading: boolean;
  roleFilter: string | undefined;
  setRoleFilter: (value: string | undefined) => void;
  bannedFilter: boolean | undefined;
  setBannedFilter: (value: boolean | undefined) => void;
}) {
  const handleRoleFilterChange = (role: string) => {
    if (roleFilter === role) {
      setRoleFilter(undefined);
    } else {
      setRoleFilter(role);
    }
  };

  const { t } = useTranslation("manageUsers");
  const handleBannedFilterChange = (banned: boolean) => {
    if (bannedFilter === banned) {
      setBannedFilter(undefined);
    } else {
      setBannedFilter(banned);
    }
  };

  const renderMenuRow = (label: string, isActive: boolean) => (
    <div className="flex w-full items-center gap-2">
      <Checkbox checked={isActive} className="size-3" iconClassName="size-2" />
      <span className="text-xs capitalize">{label}</span>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <Filter className="h-4 w-4" />
          <span className="hidden md:flex">{t("table.filters.title")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <User className="size-3.5" />
          {t("table.filters.role")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleRoleFilterChange(USER_ROLES.ADMIN);
          }}
        >
          {renderMenuRow(USER_ROLES.ADMIN, roleFilter === USER_ROLES.ADMIN)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleRoleFilterChange(USER_ROLES.OPERATOR);
          }}
        >
          {renderMenuRow(
            USER_ROLES.OPERATOR,
            roleFilter === USER_ROLES.OPERATOR
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleRoleFilterChange(USER_ROLES.VISITOR);
          }}
        >
          {renderMenuRow(USER_ROLES.VISITOR, roleFilter === USER_ROLES.VISITOR)}
        </DropdownMenuItem>

        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <ShieldCheck className="size-3.5" />
          {t("table.filters.status")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleBannedFilterChange(true);
          }}
        >
          {renderMenuRow(t("table.filters.banned"), bannedFilter === true)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleBannedFilterChange(false);
          }}
        >
          {renderMenuRow(t("table.filters.active"), bannedFilter === false)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
