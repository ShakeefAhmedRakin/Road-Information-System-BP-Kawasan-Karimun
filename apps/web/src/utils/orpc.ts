import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getStoredLocale } from "@/i18n/utils";
import { defaultLocale } from "@/i18n/config";
import enDashboard from "@/i18n/locales/en/dashboard.json";
import idDashboard from "@/i18n/locales/id/dashboard.json";

import type { RouterClient } from "@orpc/server";
import type { appRouter } from "api";

// Simple translation function for use outside React components
const getTranslation = (key: string): string => {
  const locale = getStoredLocale() ?? defaultLocale;
  const translations: Record<string, any> = {
    en: enDashboard,
    id: idDashboard,
  };
  const translationObj = translations[locale] ?? translations[defaultLocale];
  const keys = key.split(".");
  let value: any = translationObj;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  return typeof value === "string" ? value : key;
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: getTranslation("messages.error.retry"),
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export const client: RouterClient<typeof appRouter> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
