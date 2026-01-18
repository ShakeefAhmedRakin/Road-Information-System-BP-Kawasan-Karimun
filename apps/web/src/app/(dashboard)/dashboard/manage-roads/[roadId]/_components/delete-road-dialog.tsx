"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { AlertCircleIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { StaticRoutes } from "../../../../../../config/static-routes";

interface DeleteRoadDialogProps {
  roadId: string;
  roadName: string;
  roadNumber: string;
  segmentCount: number;
  onDeleteSuccess?: () => void;
}

export default function DeleteRoadDialog({
  roadId,
  roadName,
  roadNumber,
  segmentCount,
  onDeleteSuccess,
}: DeleteRoadDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteRoadMutation = useMutation(
    orpc.road.deleteRoad.mutationOptions()
  );

  const handleDelete = async () => {
    deleteRoadMutation.mutate(
      { roadId },
      {
        onSuccess: () => {
          toast.success("Road deleted successfully");
          setOpen(false);
          if (onDeleteSuccess) {
            onDeleteSuccess();
          } else {
            router.push(StaticRoutes.MANAGE_ROADS);
          }
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete road");
        },
      }
    );
  };

  const isDeleting = deleteRoadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          Delete Road
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircleIcon className="text-destructive size-5" /> Delete Road
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <DialogDescription>
          This action cannot be undone. This will permanently delete the road
          and all associated data.
        </DialogDescription>

        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">Warning</ItemTitle>
            <ItemDescription>
              This road will be deleted forever and all segment data will be
              gone as well. This action cannot be reversed.
            </ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemHeader className="flex w-full items-center justify-between gap-2">
            <span className="whitespace-nowrap">Road Information</span>
          </ItemHeader>
          <ItemSeparator />
          <ItemContent>
            <ItemTitle className="line-clamp-1">{roadName}</ItemTitle>
            <ItemDescription>
              Road Number: {roadNumber}
              <br />
              Segments: {segmentCount}
            </ItemDescription>
          </ItemContent>
          <ItemFooter className="text-muted-foreground text-xs font-bold">
            Note: All {segmentCount} segment{segmentCount !== 1 ? "s" : ""} and
            their associated data will be permanently deleted.
          </ItemFooter>
        </Item>

        <div className="flex w-full flex-col gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className="mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Road"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
