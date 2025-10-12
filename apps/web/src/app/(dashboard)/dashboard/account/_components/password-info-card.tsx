import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Paragraph, paragraphVariants } from "@/components/ui/typography";
import { InfoIcon } from "lucide-react";

export default function PasswordInfoCard() {
  return (
    <div className="space-y-2">
      <div>
        <h2
          className={paragraphVariants({
            size: "sm",
            className: "font-semibold",
          })}
        >
          Password Management
        </h2>
        <Paragraph size="xs" className="text-muted-foreground mt-0.5">
          Manage your password information
        </Paragraph>
      </div>
      <Item variant="destructive" size={"sm"}>
        <ItemMedia>
          <InfoIcon className="text-warning-foreground size-3" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-warning-foreground !text-xs">
            Password Change Disabled
          </ItemTitle>
          <ItemDescription className="!text-xs">
            To change your password, please contact your administrator. This
            helps maintain security and ensures proper access control.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
