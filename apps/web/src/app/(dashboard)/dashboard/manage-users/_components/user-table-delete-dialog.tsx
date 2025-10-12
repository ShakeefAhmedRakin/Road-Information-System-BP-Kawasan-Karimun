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
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import { AlertCircleIcon, CopyIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "../../../../../components/ui/separator";

export default function UserTableDeleteDialog({
  user,
  refetch,
  currentUserId,
}: {
  user: UsersAdminUserType;
  refetch: () => void;
  currentUserId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyUserId = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(user.id);
      toast.success("User ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy User ID");
    } finally {
      setIsCopying(false);
    }
  };

  const handleDelete = async () => {
    if (user.id === currentUserId) {
      toast.error("You cannot delete yourself");
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await authClient.admin.removeUser({
        userId: user.id,
      });

      if (error) {
        toast.error(error.message || "Failed to delete user");
        return;
      }

      toast.success("User deleted successfully");
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="mt-2"
          disabled={user.id === currentUserId}
        >
          <Trash2 className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircleIcon className="text-destructive size-5" /> Delete User
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <DialogDescription>
          This action cannot be undone. This will permanently delete the user.
        </DialogDescription>

        <Item variant="outline">
          <ItemHeader className="flex w-full items-center justify-between gap-2">
            <span className="whitespace-nowrap">User Information</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground line-clamp-1 max-w-20 text-xs break-all">
                {user.id}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyUserId}
                disabled={isCopying}
              >
                {isCopying ? (
                  <Spinner className="size-2.5" />
                ) : (
                  <CopyIcon className="size-2.5" />
                )}
              </Button>
            </div>
          </ItemHeader>
          <ItemSeparator />
          <ItemContent>
            <div className="flex w-full items-center gap-2">
              <ItemTitle className="line-clamp-1 flex-1">{user.name}</ItemTitle>
              <Badge
                className="text-[9px] uppercase"
                variant={
                  user.role === USER_ROLES.ADMIN
                    ? "destructive"
                    : user.role === USER_ROLES.OPERATOR
                      ? "default"
                      : "outline"
                }
              >
                {user.role}
              </Badge>
            </div>
            <ItemDescription>{user.email}</ItemDescription>
          </ItemContent>
          <ItemFooter className="text-muted-foreground text-xs font-bold">
            Note: The user related data will not be deleted
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
              "Delete User"
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
