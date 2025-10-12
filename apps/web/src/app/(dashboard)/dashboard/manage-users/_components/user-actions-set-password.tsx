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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    form.reset({ password: "" });
    setShowPassword(false);
  }, [form]);

  const handleSetPassword = async (
    values: z.infer<typeof setPasswordSchema>
  ) => {
    if (isCurrentUser) {
      toast.error("You cannot change your own password through this dialog");
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await authClient.admin.setUserPassword({
        userId: user.id,
        newPassword: values.password,
      });

      if (error) {
        toast.error(error.message || "Failed to set password");
        return;
      }

      toast.success("Password set successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to set password");
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
    toast.success("Password generated and copied to clipboard!");
    navigator.clipboard.writeText(newPassword);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <KeyIcon className="size-4" /> Set New Password
        </h3>
        <DialogDescription className="mt-1.5 text-xs">
          Set a new password for this user
        </DialogDescription>
      </div>
      {isCurrentUser ? (
        <Item variant="destructive">
          <ItemMedia>
            <AlertCircleIcon className="text-destructive size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-destructive">
              Cannot Change Own Password
            </ItemTitle>
            <ItemDescription>
              You cannot change your own password through this dialog. Use your
              account settings instead.
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
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockIcon className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Enter new password"
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
                          title="Generate password"
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
                            showPassword ? "Hide password" : "Show password"
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
                    Password must be at least 8 characters long.
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
              Set Password
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
