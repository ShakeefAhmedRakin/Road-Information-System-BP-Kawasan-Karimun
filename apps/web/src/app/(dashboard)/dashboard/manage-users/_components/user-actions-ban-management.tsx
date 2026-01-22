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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { UsersAdminUserType } from "@/hooks/admin/useUsersAdmin";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, BanIcon, UserXIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Helper function to format ban expiration as countdown
const formatBanExpiration = (
  banExpires: Date | string,
  t: (key: string) => string
): string => {
  const now = new Date();
  const expirationDate = new Date(banExpires);
  const diff = expirationDate.getTime() - now.getTime();

  if (diff <= 0) return t("table.status.expired");

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(" ") : "< 1m";
};

// Helper function to format full date
const formatBanExpirationDate = (banExpires: Date | string): string => {
  const expirationDate = new Date(banExpires);
  return expirationDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};


const getBanDurationInSeconds = (duration: string): number | undefined => {
  switch (duration) {
    case "1hour":
      return 60 * 60;
    case "1day":
      return 60 * 60 * 24;
    case "1week":
      return 60 * 60 * 24 * 7;
    case "1month":
      return 60 * 60 * 24 * 30;
    case "permanent":
      return undefined;
    default:
      return undefined;
  }
};

export default function UserActionsBanManagement({
  user,
  isCurrentUser,
  isBanning,
  setIsBanning,
  isUnbanning,
  setIsUnbanning,
  onSuccess,
}: {
  user: UsersAdminUserType;
  isCurrentUser: boolean;
  isBanning: boolean;
  setIsBanning: (value: boolean) => void;
  isUnbanning: boolean;
  setIsUnbanning: (value: boolean) => void;
  onSuccess: () => void;
}) {
  const { t, locale } = useTranslation("manageUsers");
  const banUserSchema = useMemo(
    () =>
      z.object({
        banReason: z.string().min(5, t("banManagement.banReason.minLength")),
        banDuration: z.enum(["1hour", "1day", "1week", "1month", "permanent"]),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof banUserSchema>>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      banReason: "",
      banDuration: "1week",
    },
  });

  useEffect(() => {
    form.reset({ banReason: "", banDuration: "1week" });
  }, [form]);

  useEffect(() => {
    form.clearErrors();
    form.trigger();
  }, [locale, form]);

  const handleBanUser = async (values: z.infer<typeof banUserSchema>) => {
    if (isCurrentUser) {
      toast.error(t("banManagement.toasts.cannotBanSelf"));
      return;
    }

    setIsBanning(true);
    try {
      const banExpiresIn = getBanDurationInSeconds(values.banDuration);

      await authClient.admin.banUser({
        userId: user.id,
        banReason: values.banReason,
        banExpiresIn,
      });

      toast.success(t("banManagement.toasts.success"));
      onSuccess();
    } catch (error) {
      toast.error(t("banManagement.toasts.error"));
    } finally {
      setIsBanning(false);
    }
  };

  const handleUnbanUser = async () => {
    setIsUnbanning(true);
    try {
      await authClient.admin.unbanUser({
        userId: user.id,
      });

      toast.success(t("banManagement.toasts.unbanSuccess"));
      onSuccess();
    } catch (error) {
      toast.error(t("banManagement.toasts.unbanError"));
    } finally {
      setIsUnbanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <BanIcon className="size-4" /> {t("banManagement.title")}
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          {t("banManagement.description")}
        </DialogDescription>
      </div>

      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              {t("banManagement.cannotBanSelf.title")}
            </ItemTitle>
            <ItemDescription>
              {t("banManagement.cannotBanSelf.description")}
            </ItemDescription>
          </ItemContent>
        </Item>
      ) : user.banned ? (
        <div className="space-y-4">
          <Item variant="destructive">
            <ItemMedia>
              <UserXIcon className="text-destructive size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-destructive">
                {t("banManagement.userBanned.title")}
              </ItemTitle>
              <ItemDescription className="line-clamp-none space-y-1">
                {user.banReason && (
                  <span className="block">
                    <span className="font-semibold">
                      {t("banManagement.userBanned.reason")}:
                    </span>{" "}
                    {user.banReason}
                  </span>
                )}
                {user.banExpires ? (
                  <>
                    <span className="block">
                      <span className="font-semibold">
                        {t("banManagement.userBanned.expiresIn")}:
                      </span>{" "}
                      {formatBanExpiration(user.banExpires, t)}
                    </span>
                    <span className="block">
                      <span className="font-semibold">
                        {t("banManagement.userBanned.expiresOn")}:
                      </span>{" "}
                      {formatBanExpirationDate(user.banExpires)}
                    </span>
                  </>
                ) : (
                  <span className="block">
                    <span className="font-semibold">
                      {t("banManagement.userBanned.duration")}:
                    </span>{" "}
                    {t("banManagement.banDuration.permanent")}
                  </span>
                )}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Button
            variant="default"
            onClick={handleUnbanUser}
            disabled={isUnbanning}
            className="w-full"
          >
            {isUnbanning && <Spinner />}
            {t("banManagement.unbanButton")}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleBanUser)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("banManagement.banReason.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("banManagement.banReason.placeholder")}
                      disabled={isBanning}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("banManagement.banDuration.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isBanning}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("banManagement.banDuration.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1hour">
                        {t("banManagement.banDuration.1hour")}
                      </SelectItem>
                      <SelectItem value="1day">
                        {t("banManagement.banDuration.1day")}
                      </SelectItem>
                      <SelectItem value="1week">
                        {t("banManagement.banDuration.1week")}
                      </SelectItem>
                      <SelectItem value="1month">
                        {t("banManagement.banDuration.1month")}
                      </SelectItem>
                      <SelectItem value="permanent">
                        {t("banManagement.banDuration.permanent")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="destructive"
              disabled={
                isBanning || !form.formState.isValid || !form.formState.isDirty
              }
              className="w-full"
            >
              {isBanning && <Spinner />}
              {t("banManagement.button")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
