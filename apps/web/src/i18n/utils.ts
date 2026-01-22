import { defaultLocale, storageKey, supportedLocales } from "./config";
import type { Locale } from "./config";

/**
 * Get the current locale from localStorage or return default
 */
export function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && supportedLocales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.error("Error reading locale from localStorage:", error);
  }

  return defaultLocale;
}

/**
 * Store the locale in localStorage
 */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(storageKey, locale);
  } catch (error) {
    console.error("Error storing locale to localStorage:", error);
  }
}

/**
 * Get nested value from object using dot notation path
 */
export function getNestedValue(
  obj: Record<string, any>,
  path: string
): string | undefined {
  const result = path.split(".").reduce<any>((current, key) => {
    return current && typeof current === "object" ? current[key] : undefined;
  }, obj);
  return typeof result === "string" ? result : undefined;
}
