import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "better-auth";

export default function DashboardUserCard({ user }: { user: User | null }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={user?.image ?? undefined} />
        <AvatarFallback>{user?.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <div className="line-clamp-1 text-sm break-all">{user?.name}</div>
        <div className="text-muted-foreground line-clamp-1 text-xs break-all">
          {user?.email}
        </div>
      </div>
    </div>
  );
}
