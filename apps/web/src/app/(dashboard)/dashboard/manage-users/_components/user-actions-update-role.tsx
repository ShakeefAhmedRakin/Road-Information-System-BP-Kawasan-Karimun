"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import { authClient } from "@/lib/auth-client";
import { USER_ROLES } from "api/src/modules/auth/auth.constants";
import { AlertCircleIcon, ShieldIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserActionsUpdateRole({
  user,
  isCurrentUser,
  isUpdating,
  setIsUpdating,
  onSuccess,
}: {
  user: UsersAdminUserType;
  isCurrentUser: boolean;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  onSuccess: () => void;
}) {
  const [selectedRole, setSelectedRole] = useState(user.role);

  useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);

  const handleUpdateRole = async () => {
    if (selectedRole === user.role) {
      toast.info("Role is already set to " + selectedRole);
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await authClient.admin.setRole({
        userId: user.id,
        role: selectedRole as any,
      });

      if (error) {
        toast.error(error.message || "Failed to update role");
        return;
      }

      toast.success("Role updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldIcon className="size-4" /> Update Role
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          Change the user's access level
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              Cannot Change Own Role
            </ItemTitle>
            <ItemDescription>
              You cannot change your own role for security reasons.
            </ItemDescription>
          </ItemContent>
        </Item>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setSelectedRole(
                  value as
                    | typeof USER_ROLES.ADMIN
                    | typeof USER_ROLES.OPERATOR
                    | typeof USER_ROLES.VISITOR
                )
              }
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={USER_ROLES.VISITOR}>Visitor</SelectItem>
                <SelectItem value={USER_ROLES.OPERATOR}>Operator</SelectItem>
                <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleUpdateRole}
            disabled={isUpdating || selectedRole === user.role}
            className="w-full"
          >
            {isUpdating && <Spinner />}
            Update Role
          </Button>
        </div>
      )}
    </div>
  );
}
