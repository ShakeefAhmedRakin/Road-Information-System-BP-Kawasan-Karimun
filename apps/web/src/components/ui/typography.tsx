import { cva } from "class-variance-authority";

export const headingVariants = cva("", {
  variants: {
    level: {
      h1: "text-5xl md:text-6xl",
      h2: "text-4xl md:text-5xl",
      h3: "text-3xl md:text-4xl",
      h4: "text-2xl md:text-3xl",
      h5: "text-xl md:text-2xl",
    },
  },
  defaultVariants: {
    level: "h3",
  },
});

export const paragraphVariants = cva("", {
  variants: {
    size: {
      xs: "text-[11px] md:text-xs",
      sm: "text-sm md:text-[15px]",
      default: "text-base md:text-lg",
      lg: "text-lg md:text-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export function Heading({
  level = "h3",
  className,
  children,
}: {
  level?: "h1" | "h2" | "h3" | "h4" | "h5";
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = level as "h1" | "h2" | "h3" | "h4" | "h5";
  return (
    <Tag className={`${headingVariants({ level })} ${className}`}>
      {children}
    </Tag>
  );
}

export function Paragraph({
  size = "default",
  className,
  children,
}: {
  size?: "xs" | "sm" | "default" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`${paragraphVariants({ size })} ${className}`}>{children}</p>
  );
}
