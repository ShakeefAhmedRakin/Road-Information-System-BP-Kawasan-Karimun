import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Columns } from "lucide-react";
import { Checkbox } from "../../../../../components/ui/checkbox";

export default function UserTableColumnsDropdown({
  isLoading,
  visibleCols,
  setVisibleCols,
}: {
  isLoading: boolean;
  visibleCols: {
    name: boolean;
    email: boolean;
    role: boolean;
    status: boolean;
    created: boolean;
    updated: boolean;
    actions: boolean;
  };
  setVisibleCols: (v: {
    name: boolean;
    email: boolean;
    role: boolean;
    status: boolean;
    created: boolean;
    updated: boolean;
    actions: boolean;
  }) => void;
}) {
  const protectedKeys: Array<keyof typeof visibleCols> = ["name", "actions"];
  const toggle = (key: keyof typeof visibleCols) => {
    if (protectedKeys.includes(key)) return; // Name and Actions are always visible
    setVisibleCols({ ...visibleCols, [key]: !visibleCols[key] });
  };

  const Row = ({
    keyName,
    label,
  }: {
    keyName: keyof typeof visibleCols;
    label: string;
  }) => (
    <DropdownMenuItem
      disabled={protectedKeys.includes(keyName)}
      onSelect={(e) => {
        e.preventDefault();
        toggle(keyName);
      }}
    >
      <div className="flex w-full items-center gap-2">
        <Checkbox
          checked={visibleCols[keyName]}
          className="size-3"
          iconClassName="size-2"
          disabled={protectedKeys.includes(keyName)}
        />
        <span className="text-xs capitalize">{label}</span>
      </div>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <Columns />
          <span className="hidden md:flex">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <Columns className="size-3.5" />
          Columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Row keyName="name" label="Name" />
        <Row keyName="email" label="Email" />
        <Row keyName="role" label="Role" />
        <Row keyName="status" label="Status" />
        <Row keyName="created" label="Created" />
        <Row keyName="updated" label="Updated" />
        <Row keyName="actions" label="Actions" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
