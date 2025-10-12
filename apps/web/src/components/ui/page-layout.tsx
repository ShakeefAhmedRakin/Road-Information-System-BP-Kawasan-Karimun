import PageHeader from "../../app/(dashboard)/dashboard/_components/page-header";
import { cn } from "../../lib/utils";

export default function PageLayout({
  children,
  showHeader = true,
  title,
  description,
  showBreadcrumb = true,
  titleFirst = true,
  contained = false,
  containerClassName,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
  titleFirst?: boolean;
  contained?: boolean;
  containerClassName?: string;
}) {
  return (
    <div className="lg:bg-background thin-styled-scroll-container flex h-full w-full flex-1 flex-col p-2 xl:rounded-lg xl:border xl:p-4">
      {showHeader && (
        <PageHeader
          title={title}
          description={description}
          showBreadcrumb={showBreadcrumb}
          titleFirst={titleFirst}
        />
      )}
      <div
        className={cn(
          "h-full max-h-full flex-1",
          !contained
            ? "thin-styled-scroll-container overflow-y-auto"
            : "overflow-y-hidden",
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
