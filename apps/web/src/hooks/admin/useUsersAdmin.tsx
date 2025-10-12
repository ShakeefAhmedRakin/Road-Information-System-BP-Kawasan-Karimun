import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type UsersAdminData = Awaited<
  ReturnType<ReturnType<typeof orpc.admin.getUsers.queryOptions>["queryFn"]>
>;

export type UsersAdminUserType = UsersAdminData["users"][number];

export default function useUsersAdmin(initialLimit = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const offset = (currentPage - 1) * limit;

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, roleFilter, bannedFilter, sortBy, sortOrder]);

  const options = orpc.admin.getUsers.queryOptions({
    input: {
      limit,
      offset,
      searchValue,
      roleFilter,
      bannedFilter,
      sortBy,
      sortOrder,
    },
  });

  const query = useQuery({
    ...options,
    queryKey: [
      "admin",
      "users",
      {
        limit,
        offset,
        searchValue,
        roleFilter,
        bannedFilter,
        sortBy,
        sortOrder,
      },
    ],
    enabled: !!limit && offset >= 0,
  });

  // Pagination calculations
  const total = query.data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const toggleSort = (column: "name" | "createdAt" | "updatedAt") => {
    if (sortBy === column) {
      // Toggle order if same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column with desc as default
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return {
    ...query,
    // Pagination state
    currentPage,
    limit,
    offset,
    searchValue,
    setSearchValue,
    roleFilter,
    setRoleFilter,
    bannedFilter,
    setBannedFilter,
    sortBy,
    sortOrder,
    toggleSort,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Pagination actions
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    setLimit,
  };
}
