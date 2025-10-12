import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export default function Pill({
  pillContent,
  badgeContent,
  className,
}: {
  pillContent?: string;
  badgeContent?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-primary/20 flex flex-nowrap items-center gap-2 rounded-full border py-2 pr-3 pl-2",
        className
      )}
    >
      {badgeContent && (
        <Badge className="h-5 rounded-full text-[10px] font-bold md:h-8 md:text-sm">
          {badgeContent}
        </Badge>
      )}
      {pillContent && (
        <span className="from-primary/70 to-primary bg-linear-to-r bg-clip-text text-[10px] text-transparent md:text-sm">
          {pillContent}
        </span>
      )}
    </span>
  );
}
