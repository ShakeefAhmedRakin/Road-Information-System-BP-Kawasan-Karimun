import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Paragraph, paragraphVariants } from "@/components/ui/typography";

export default function PageHeader({
  title,
  description,
  showBreadcrumb = true,
  titleFirst = true,
}: {
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
  titleFirst?: boolean;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      {showBreadcrumb && <Breadcrumbs showHome={false} />}
      {titleFirst ? (
        <>
          {title && (
            <h1
              className={paragraphVariants({
                className: "font-semibold",
              })}
            >
              {title}
            </h1>
          )}
          {description && (
            <Paragraph className="text-muted-foreground" size="xs">
              {description}
            </Paragraph>
          )}
        </>
      ) : (
        <>
          {description && (
            <Paragraph className="text-muted-foreground" size="xs">
              {description}
            </Paragraph>
          )}
          {title && (
            <h1
              className={paragraphVariants({
                className: "font-semibold",
              })}
            >
              {title}
            </h1>
          )}
        </>
      )}
      <Separator />
    </div>
  );
}
