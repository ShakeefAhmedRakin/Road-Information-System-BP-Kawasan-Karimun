"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import {
  BanIcon,
  CopyIcon,
  KeyIcon,
  LockIcon,
  Pencil,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UserActionsBanManagement from "./user-actions-ban-management";
import UserActionsRevokeSessions from "./user-actions-revoke-sessions";
import UserActionsSetPassword from "./user-actions-set-password";
import UserActionsUpdateName from "./user-actions-update-name";
import UserActionsUpdateRole from "./user-actions-update-role";

export default function UserTableActionsDialog({
  user,
  currentUserId,
  refetch,
}: {
  user: UsersAdminUserType;
  currentUserId: string;
  refetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "name" | "role" | "password" | "ban" | "sessions"
  >("name");

  // Loading states
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const isCurrentUser = user.id === currentUserId;

  const handleSuccess = () => {
    setOpen(false);
    refetch();
  };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm" className="mt-2">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-5" /> Manage User
          </DialogTitle>
        </DialogHeader>
        <Separator />

        {/* User Info Card */}
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
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <ItemTitle className="line-clamp-1">{user.name}</ItemTitle>
                  {isCurrentUser && (
                    <Badge variant="default" className="text-[8px] uppercase">
                      You
                    </Badge>
                  )}
                </div>
                <ItemDescription className="line-clamp-1">
                  {user.email}
                </ItemDescription>
              </div>
              <Badge
                variant={
                  user.role === USER_ROLES.ADMIN
                    ? "destructive"
                    : user.role === USER_ROLES.OPERATOR
                      ? "default"
                      : "outline"
                }
                className="text-[9px] uppercase"
              >
                {user.role}
              </Badge>
            </div>
          </ItemContent>
        </Item>

        {/* Tab Buttons */}
        <div className="grid grid-cols-5 gap-1">
          <Button
            variant={activeTab === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("name")}
            className="text-xs"
          >
            <UserIcon className="size-3" />
          </Button>
          <Button
            variant={activeTab === "role" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("role")}
            className="text-xs"
          >
            <ShieldIcon className="size-3" />
          </Button>
          <Button
            variant={activeTab === "password" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("password")}
            className="text-xs"
          >
            <KeyIcon className="size-3" />
          </Button>
          <Button
            variant={activeTab === "ban" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("ban")}
            className="text-xs"
          >
            <BanIcon className="size-3" />
          </Button>
          <Button
            variant={activeTab === "sessions" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("sessions")}
            className="text-xs"
          >
            <LockIcon className="size-3" />
          </Button>
        </div>

        <Separator />

        {/* Tab Content */}
        {activeTab === "name" && (
          <UserActionsUpdateName
            user={user}
            isCurrentUser={isCurrentUser}
            isUpdating={isUpdatingName}
            setIsUpdating={setIsUpdatingName}
            onSuccess={handleSuccess}
          />
        )}

        {activeTab === "role" && (
          <UserActionsUpdateRole
            user={user}
            isCurrentUser={isCurrentUser}
            isUpdating={isUpdatingRole}
            setIsUpdating={setIsUpdatingRole}
            onSuccess={handleSuccess}
          />
        )}

        {activeTab === "password" && (
          <UserActionsSetPassword
            user={user}
            isCurrentUser={isCurrentUser}
            isUpdating={isUpdatingPassword}
            setIsUpdating={setIsUpdatingPassword}
            onSuccess={handleSuccess}
          />
        )}

        {activeTab === "ban" && (
          <UserActionsBanManagement
            user={user}
            isCurrentUser={isCurrentUser}
            isBanning={isBanning}
            setIsBanning={setIsBanning}
            isUnbanning={isUnbanning}
            setIsUnbanning={setIsUnbanning}
            onSuccess={handleSuccess}
          />
        )}

        {activeTab === "sessions" && (
          <UserActionsRevokeSessions
            user={user}
            isCurrentUser={isCurrentUser}
            isRevoking={isRevokingSessions}
            setIsRevoking={setIsRevokingSessions}
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
