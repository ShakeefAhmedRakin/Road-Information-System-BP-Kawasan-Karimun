"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function UserActionsUpdateName({
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
  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name },
  });

  useEffect(() => {
    form.reset({ name: user.name });
  }, [user.name, form]);

  const handleUpdateName = async (values: z.infer<typeof updateNameSchema>) => {
    if (isCurrentUser) {
      toast.error("You cannot update your own name");
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await authClient.admin.updateUser({
        userId: user.id,
        data: { name: values.name },
      });

      if (error) {
        toast.error(error.message || "Failed to update name");
        return;
      }

      toast.success("Name updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update name");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <UserIcon className="size-4" /> Update Name
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          Change the user's display name
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              Cannot Update Own Name
            </ItemTitle>
            <ItemDescription>
              You cannot update your own name through this dialog for security
              reasons.
            </ItemDescription>
          </ItemContent>
        </Item>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateName)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      disabled={isUpdating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                isUpdating || !form.formState.isValid || !form.formState.isDirty
              }
              className="w-full"
            >
              {isUpdating && <Spinner />}
              Update Name
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
