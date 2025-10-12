import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "8",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: string }) {
  const sizeClassMap: Record<string, string> = {
    "4": "h-4 w-4",
    "5": "h-5 w-5",
    "6": "h-6 w-6",
    "7": "h-7 w-7",
    "8": "h-8 w-8",
    "9": "h-9 w-9",
    "10": "h-10 w-10",
    "11": "h-11 w-11",
    "12": "h-12 w-12",
    "14": "h-14 w-14",
    "16": "h-16 w-16",
    "20": "h-20 w-20",
    "24": "h-24 w-24",
    "28": "h-28 w-28",
    "32": "h-32 w-32",
    "36": "h-36 w-36",
    "40": "h-40 w-40",
    "48": "h-48 w-48",
    "56": "h-56 w-56",
    "64": "h-64 w-64",
  };

  const resolvedSizeClass = sizeClassMap[size] ?? sizeClassMap["8"];
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        `relative flex ${resolvedSizeClass} shrink-0 overflow-hidden rounded-full`,
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      draggable={false}
      className={cn(
        "aspect-square size-full object-cover object-center",
        className
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
