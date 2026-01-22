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
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Spinner } from "@/components/ui/spinner";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, UserIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  const { t, locale } = useTranslation("manageUsers");
  const updateNameSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("updateName.toasts.cannotUpdateSelf")),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof updateNameSchema>>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name },
  });

  useEffect(() => {
    form.reset({ name: user.name });
  }, [user.name, form]);

  useEffect(() => {
    form.clearErrors();
    form.trigger();
  }, [locale, form]);

  const handleUpdateName = async (values: z.infer<typeof updateNameSchema>) => {
    if (isCurrentUser) {
      toast.error(t("updateName.toasts.cannotUpdateSelf"));
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await authClient.admin.updateUser({
        userId: user.id,
        data: { name: values.name },
      });

      if (error) {
        toast.error(error.message || t("updateName.toasts.error"));
        return;
      }

      toast.success(t("updateName.toasts.success"));
      onSuccess();
    } catch (error) {
      toast.error(t("updateName.toasts.error"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <UserIcon className="size-4" /> {t("updateName.title")}
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          {t("updateName.description")}
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              {t("updateName.cannotUpdateSelf.title")}
            </ItemTitle>
            <ItemDescription>
              {t("updateName.cannotUpdateSelf.description")}
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
                  <FormLabel>{t("updateName.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("updateName.placeholder")}
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
              {t("updateName.button")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
