import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "../../../../../lib/utils";

const rowHeight = "h-[63.5px]";

export default function UserTableFillerRow({
  index,
  visibleCols,
}: {
  index: number;
  visibleCols: {
    name: boolean;
    email: boolean;
    role: boolean;
    status: boolean;
    created: boolean;
    updated: boolean;
    actions: boolean;
  };
}) {
  return (
    <TableRow
      key={`empty-${index}`}
      className={cn("even:bg-accent dark:even:bg-muted/20", rowHeight)}
    >
      {visibleCols.name && (
        <TableCell>
          <div className="text-muted-foreground w-full pl-2 text-[11px] md:text-xs">
            -
          </div>
        </TableCell>
      )}
      {visibleCols.email && (
        <TableCell>
          <div className="text-muted-foreground w-full pl-2 text-[11px] md:text-xs">
            -
          </div>
        </TableCell>
      )}
      {visibleCols.role && (
        <TableCell>
          <div className="text-muted-foreground w-full pl-2 text-[11px] md:text-xs">
            -
          </div>
        </TableCell>
      )}
      {visibleCols.status && (
        <TableCell>
          <div className="text-muted-foreground w-full pl-2 text-[11px] md:text-xs">
            -
          </div>
        </TableCell>
      )}
      {visibleCols.created && (
        <TableCell>
          <div className="text-muted-foreground w-full pl-2 text-[11px] md:text-xs">
            -
          </div>
        </TableCell>
      )}
      {visibleCols.updated && (
        <TableCell className="text-xs whitespace-normal">
          <div className="text-muted-foreground w-full pl-2 text-[11px] md:text-xs">
            -
          </div>
        </TableCell>
      )}
      {visibleCols.actions && (
        <TableCell className="flex items-center justify-end gap-1">
          <Button variant="outline" size="icon-sm" className="mt-2" disabled>
            <Pencil className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm" className="mt-2" disabled>
            <Trash2 className="text-destructive" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
