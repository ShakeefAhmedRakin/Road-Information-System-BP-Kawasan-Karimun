"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { passwordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LockIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const setPasswordSchema = z.object({
  password: passwordSchema,
});

// Generate a secure random password
const generatePassword = (length: number = 12): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;

  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export default function UserActionsSetPassword({
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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    form.reset({ password: "" });
    setShowPassword(false);
  }, [form]);

  useEffect(() => {
    form.clearErrors();
    form.trigger();
  }, [locale, form]);

  const handleSetPassword = async (
    values: z.infer<typeof setPasswordSchema>
  ) => {
    if (isCurrentUser) {
      toast.error(t("setPassword.toasts.cannotChangeSelf"));
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await authClient.admin.setUserPassword({
        userId: user.id,
        newPassword: values.password,
      });

      if (error) {
        toast.error(error.message || t("setPassword.toasts.error"));
        return;
      }

      toast.success(t("setPassword.toasts.success"));
      onSuccess();
    } catch (error) {
      toast.error(t("setPassword.toasts.error"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    form.setValue("password", newPassword, {
      shouldValidate: true,
      shouldDirty: true,
    });
    toast.success(t("setPassword.toasts.passwordGenerated"));
    navigator.clipboard.writeText(newPassword);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <KeyIcon className="size-4" /> {t("setPassword.title")}
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          {t("setPassword.description")}
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              {t("setPassword.cannotChangeSelf.title")}
            </ItemTitle>
            <ItemDescription>
              {t("setPassword.cannotChangeSelf.description")}
            </ItemDescription>
          </ItemContent>
        </Item>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSetPassword)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("setPassword.label")}</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockIcon className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder={t("setPassword.placeholder")}
                        type={showPassword ? "text" : "password"}
                        disabled={isUpdating}
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          onClick={handleGeneratePassword}
                          disabled={isUpdating}
                          variant="ghost"
                          size="icon-sm"
                          title={t("setPassword.generate")}
                        >
                          <RefreshCwIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isUpdating}
                          variant="ghost"
                          size="icon-sm"
                          title={
                            showPassword
                              ? t("setPassword.hide")
                              : t("setPassword.show")
                          }
                        >
                          {showPassword ? (
                            <EyeOffIcon className="size-3.5" />
                          ) : (
                            <EyeIcon className="size-3.5" />
                          )}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs">
                    {t("setPassword.descriptionText")}
                  </FormDescription>
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
              {t("setPassword.button")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
