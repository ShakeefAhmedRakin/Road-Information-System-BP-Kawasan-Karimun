"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { Spinner } from "../../../../../../components/ui/spinner";
import { paragraphVariants } from "../../../../../../components/ui/typography";
import { StaticRoutes } from "../../../../../../config/static-routes";
import { orpc } from "../../../../../../utils/orpc";

export default function AllRoads() {
  const { data, isLoading } = useQuery(orpc.road.listAllRoads.queryOptions());
  {
    /* <Link
          href={StaticRoutes.CREATE_ROAD}
          className={buttonVariants({ variant: "default" })}
        >
          Create Road
        </Link> */
  }
  return (
    <div>
      {isLoading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-y-2 p-2">
          <Spinner className="size-10" />
        </div>
      ) : (
        <div className="space-y-2">
          {data?.roads.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-y-2 p-2">
              <h1 className="text-lg font-medium">No roads found</h1>
              <p className="text-muted-foreground text-sm">
                Create a new road to get started.
              </p>
              <Link
                href={StaticRoutes.CREATE_ROAD}
                className={buttonVariants({ variant: "default" })}
              >
                Create Road
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mb-4 flex justify-end">
                <Link
                  href={StaticRoutes.CREATE_ROAD}
                  className={buttonVariants({ variant: "default" })}
                >
                  Create Road
                </Link>
              </div>

              {data?.roads.map((road) => (
                <div key={road.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h1
                        className={paragraphVariants({
                          size: "lg",
                          className: "truncate font-medium",
                        })}
                      >
                        {road.name}
                      </h1>
                      <div className="mt-0.5 flex flex-col gap-x-2">
                        <h2
                          className={paragraphVariants({
                            size: "sm",
                            className: "text-muted-foreground",
                          })}
                        >
                          Road Number: {road.number}
                        </h2>
                        <h2
                          className={paragraphVariants({
                            size: "sm",
                            className: "text-muted-foreground",
                          })}
                        >
                          Length: {road.totalLengthKm} km
                        </h2>
                      </div>
                      <h2
                        className={
                          paragraphVariants({
                            size: "xs",
                            className: "text-muted-foreground mt-1",
                          }) +
                          " max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                        }
                      >
                        User: {road.createdBy}
                      </h2>
                    </div>
                    <div>
                      <Link
                        href={`${StaticRoutes.MANAGE_ROADS}/${road.id}`}
                        className={buttonVariants({ variant: "outline" })}
                      >
                        View <ArrowBigRight />
                      </Link>
                    </div>
                  </div>
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
