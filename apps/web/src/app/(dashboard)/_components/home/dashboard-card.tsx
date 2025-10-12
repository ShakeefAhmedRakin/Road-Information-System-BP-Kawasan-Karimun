import type { LucideIcon } from "lucide-react";
import { Item, ItemContent, ItemHeader } from "../../../../components/ui/item";
import {
  headingVariants,
  Paragraph,
  paragraphVariants,
} from "../../../../components/ui/typography";

interface DashboardCardProps {
  title: string;
  description?: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
}

export default function DashboardCard({
  title,
  description = "Last 30 days",
  value,
  icon: Icon,
  iconColor = "text-foreground",
  valueColor = "text-foreground",
}: DashboardCardProps) {
  return (
    <Item variant={"outline"}>
      <ItemHeader>
        <div>
          <h2
            className={paragraphVariants({
              size: "lg",
              className: "font-medium",
            })}
          >
            {title}
          </h2>
          <Paragraph size="xs" className="text-muted-foreground font-semibold">
            {description}
          </Paragraph>
        </div>
        <div
          className={`flex items-center justify-center rounded-full border p-2 ${iconColor}`}
        >
          <Icon className="size-4" />
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex items-center gap-2">
          <Icon className={`size-4 ${iconColor}`} />
          <h3
            className={headingVariants({
              level: "h5",
              className: `leading-[0px] font-bold ${valueColor}`,
            })}
          >
            {value}
          </h3>
        </div>
      </ItemContent>
    </Item>
  );
}
