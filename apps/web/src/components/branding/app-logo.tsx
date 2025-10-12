import Link from "next/link";
import { Heading } from "../ui/typography";

function LogoImage({
  className,
  width = 105,
}: {
  className?: string;
  width?: number;
}) {
  return <Heading level="h5">Internal Portal</Heading>;
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string;
  className?: string;
  label?: string;
}) {
  return (
    <Link aria-label={label ?? "Home Page"} href={href ?? "/"}>
      <LogoImage className={className} />
    </Link>
  );
}
