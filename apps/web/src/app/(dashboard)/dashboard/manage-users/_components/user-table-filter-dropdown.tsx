import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <span className="hidden md:flex">Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <User className="size-3.5" />
          Role
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
          Status
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleBannedFilterChange(true);
          }}
        >
          {renderMenuRow("Banned", bannedFilter === true)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleBannedFilterChange(false);
          }}
        >
          {renderMenuRow("Active", bannedFilter === false)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
