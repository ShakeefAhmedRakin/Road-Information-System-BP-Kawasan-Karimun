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
import { useTranslation } from "@/i18n/hooks/useTranslation";
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
  const { t } = useTranslation("manageUsers");
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyUserId = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(user.id);
      toast.success(t("deleteUser.toasts.userIdCopied"));
    } catch (error) {
      toast.error(t("deleteUser.toasts.userIdCopyFailed"));
    } finally {
      setIsCopying(false);
    }
  };

  const handleDelete = async () => {
    if (user.id === currentUserId) {
      toast.error(t("deleteUser.toasts.cannotDeleteSelf"));
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await authClient.admin.removeUser({
        userId: user.id,
      });

      if (error) {
        toast.error(error.message || t("deleteUser.toasts.error"));
        return;
      }

      toast.success(t("deleteUser.toasts.success"));
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error(t("deleteUser.toasts.error"));
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
            <AlertCircleIcon className="text-destructive size-5" /> {t("deleteUser.title")}
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <DialogDescription>
          {t("deleteUser.description")}
        </DialogDescription>

        <Item variant="outline">
          <ItemHeader className="flex w-full items-center justify-between gap-2">
            <span className="whitespace-nowrap">{t("deleteUser.userInfo")}</span>
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
            {t("deleteUser.note")}
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
                {t("deleteUser.deleting")}
              </>
            ) : (
              t("deleteUser.deleteButton")
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            {t("buttons.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
