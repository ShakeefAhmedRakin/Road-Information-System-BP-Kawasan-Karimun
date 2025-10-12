import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { paragraphVariants } from "@/components/ui/typography";
import { USER_ROLES, type UserRole } from "api/src/modules/auth/auth.constants";
import type { User } from "better-auth";
import ButtonChangeAvatar from "./button-change-avatar";
import ButtonClearAvatar from "./button-clear-avatar";

export default function AccountsUserCard({
  user,
  userRole,
}: {
  user: User;
  userRole: UserRole;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
      <div className="flex flex-col items-center gap-2 md:flex-row">
        {/* AVATAR WITH BADGE */}
        <div className="relative">
          <Avatar size="20">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="text-lg">
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute right-0 bottom-0 left-0 mx-auto w-fit">
            <Badge
              variant={
                userRole === USER_ROLES.ADMIN
                  ? "destructive"
                  : userRole === USER_ROLES.OPERATOR
                    ? "default"
                    : "outline"
              }
              className="z-50 text-[8px] font-bold uppercase"
            >
              {userRole || "user"}
            </Badge>
          </div>
        </div>

        {/* USER INFO */}
        <div>
          <h1
            className={paragraphVariants({
              size: "default",
              className: "line-clamp-1 text-center font-semibold md:text-left",
            })}
          >
            {user.name}
          </h1>
          <h2
            className={paragraphVariants({
              size: "xs",
              className:
                "text-muted-foreground line-clamp-1 text-center break-all md:text-left",
            })}
          >
            {user.email}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ButtonChangeAvatar />
        <ButtonClearAvatar disabled={!!!user.image} />
      </div>
    </div>
  );
}
