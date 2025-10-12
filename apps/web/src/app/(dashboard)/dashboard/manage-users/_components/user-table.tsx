import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import type { User } from "better-auth";
import { SortAsc, SortDesc } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import UserTableFillerRow from "./user-table-filler-row";
import UserTableRow from "./user-table-row";

export default function UserTable({
  users,
  limit,
  user,
  visibleCols,
  sortBy,
  sortOrder,
  toggleSort,
  refetch,
}: {
  users: UsersAdminUserType[];
  limit: number;
  user: User;
  visibleCols: {
    name: boolean;
    email: boolean;
    role: boolean;
    status: boolean;
    created: boolean;
    updated: boolean;
    actions: boolean;
  };
  sortBy: "name" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
  toggleSort: (column: "name" | "createdAt" | "updatedAt") => void;
  refetch: () => void;
}) {
  const currentUserId = user.id;

  return (
    <div className="thin-styled-scroll-container h-full flex-1 overflow-x-auto overflow-y-auto rounded-md border">
      <Table className="table-fixed">
        <colgroup>
          {visibleCols.name && <col style={{ width: "200px" }} />}
          {visibleCols.email && <col style={{ width: "200px" }} />}
          {visibleCols.role && <col style={{ width: "80px" }} />}
          {visibleCols.status && <col style={{ width: "120px" }} />}
          {visibleCols.created && <col style={{ width: "100px" }} />}
          {visibleCols.updated && <col style={{ width: "100px" }} />}
          {visibleCols.actions && <col style={{ width: "100px" }} />}
        </colgroup>
        <TableHeader className="bg-muted sticky top-0">
          <TableRow>
            {visibleCols.name && (
              <TableHead className="text-xs">
                <div className="flex items-center gap-1">
                  Name - ID
                  <Button
                    variant="secondary"
                    size="icon-xs"
                    onClick={() => toggleSort("name")}
                  >
                    {sortBy === "name" && sortOrder === "asc" ? (
                      <SortAsc className="size-3" />
                    ) : (
                      <SortDesc className="size-3" />
                    )}
                  </Button>
                </div>
              </TableHead>
            )}
            {visibleCols.email && (
              <TableHead className="text-xs">Email</TableHead>
            )}
            {visibleCols.role && (
              <TableHead className="text-xs">Role</TableHead>
            )}
            {visibleCols.status && (
              <TableHead className="text-xs">Status</TableHead>
            )}
            {visibleCols.created && (
              <TableHead className="text-xs">
                <div className="flex items-center gap-1">
                  Created
                  <Button
                    variant="secondary"
                    size="icon-xs"
                    onClick={() => toggleSort("createdAt")}
                  >
                    {sortBy === "createdAt" && sortOrder === "asc" ? (
                      <SortAsc className="size-3" />
                    ) : (
                      <SortDesc className="size-3" />
                    )}
                  </Button>
                </div>
              </TableHead>
            )}
            {visibleCols.updated && (
              <TableHead className="text-xs">
                <div className="flex items-center gap-1">
                  Updated
                  <Button
                    variant="secondary"
                    size="icon-xs"
                    onClick={() => toggleSort("updatedAt")}
                  >
                    {sortBy === "updatedAt" && sortOrder === "asc" ? (
                      <SortAsc className="size-3" />
                    ) : (
                      <SortDesc className="size-3" />
                    )}
                  </Button>
                </div>
              </TableHead>
            )}
            {visibleCols.actions && (
              <TableHead className="text-right text-xs">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <UserTableRow
              key={u.id}
              user={u}
              currentUserId={currentUserId}
              visibleCols={visibleCols}
              refetch={refetch}
            />
          ))}

          {Array.from({ length: Math.max(0, limit - users.length) }).map(
            (_, index) => (
              <UserTableFillerRow
                key={`empty-${index}`}
                index={index}
                visibleCols={visibleCols}
              />
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
