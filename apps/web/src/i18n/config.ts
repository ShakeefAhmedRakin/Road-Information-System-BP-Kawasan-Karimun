export type Locale = "en" | "id";

export const defaultLocale: Locale = "en";
export const supportedLocales: Locale[] = ["en", "id"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export const storageKey = "app-locale";
