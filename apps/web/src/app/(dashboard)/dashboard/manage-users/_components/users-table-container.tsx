"use client";

import useUsersAdmin from "@/hooks/admin/useUsersAdmin";
import type { User } from "better-auth";
import { useState } from "react";
import ErrorCard from "../../../../../components/error-card";
import UnauthorizedCard from "../../../../../components/unauthorized-card";
import UserTable from "./user-table";
import UsersTableBottomControls from "./users-table-bottom-controls";
import UsersTableTopControls from "./users-table-top-controls";

export default function UsersTableContainer({ user }: { user: User }) {
  const {
    data,
    error,
    isLoading,
    // Pagination state
    currentPage,
    limit,
    offset,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    // Pagination actions
    nextPage,
    prevPage,
    searchValue,
    setSearchValue,
    roleFilter,
    setRoleFilter,
    bannedFilter,
    setBannedFilter,
    sortBy,
    sortOrder,
    toggleSort,
    refetch,
    isRefetching,
  } = useUsersAdmin(10);

  // client-side column visibility state
  const [visibleCols, setVisibleCols] = useState({
    name: true,
    email: true,
    role: true,
    status: true,
    created: true,
    updated: true,
    actions: true,
  });

  if (error) {
    if (error.message === "Forbidden") {
      return <UnauthorizedCard />;
    }
    return <ErrorCard refetch={refetch} isRefetching={isRefetching} />;
  }

  return (
    <div className="flex h-full max-h-full flex-col space-y-4">
      <UsersTableTopControls
        isLoading={isLoading}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        bannedFilter={bannedFilter}
        setBannedFilter={setBannedFilter}
        visibleCols={visibleCols}
        setVisibleCols={setVisibleCols}
        refetch={refetch}
      />

      <UserTable
        users={data?.users || []}
        limit={limit}
        user={user}
        visibleCols={visibleCols}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
        refetch={refetch}
      />

      <UsersTableBottomControls
        offset={offset}
        limit={limit}
        total={total}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        currentPage={currentPage}
        prevPage={prevPage}
        nextPage={nextPage}
        isLoading={isLoading}
      />
    </div>
  );
}
