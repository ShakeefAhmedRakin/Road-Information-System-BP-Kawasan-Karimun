import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonGroupSeparator } from "@/components/ui/button-group";

import { ButtonGroupText } from "@/components/ui/button-group";

import { ButtonGroup } from "@/components/ui/button-group";

import { Paragraph } from "@/components/ui/typography";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { Spinner } from "../../../../../components/ui/spinner";

export default function UsersTableBottomControls({
  offset,
  limit,
  total,
  isLoading,
  totalPages,
  hasPrevPage,
  hasNextPage,
  currentPage,
  prevPage,
  nextPage,
}: {
  offset: number;
  limit: number;
  total: number;
  isLoading: boolean;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-x-2">
      {isLoading ? (
        <Skeleton className="h-4 w-36" />
      ) : (
        <Paragraph className="text-muted-foreground font-semibold" size="xs">
          Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}{" "}
          users
        </Paragraph>
      )}
      <div className="flex items-center space-x-2">
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!hasPrevPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <ButtonGroupSeparator />
          <ButtonGroupText className="whitespace-nowrap">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {currentPage} of {totalPages}
              </>
            )}
          </ButtonGroupText>
          <ButtonGroupSeparator />
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!hasNextPage || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
