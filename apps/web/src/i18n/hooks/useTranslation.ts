"use client";

import { useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getNestedValue } from "../utils";

// Import translation files
import enAuth from "../locales/en/auth.json";
import idAuth from "../locales/id/auth.json";
import enDashboard from "../locales/en/dashboard.json";
import idDashboard from "../locales/id/dashboard.json";

type TranslationKeys = {
  auth: typeof enAuth;
  dashboard: typeof enDashboard;
};

const translations: Record<string, TranslationKeys> = {
  en: {
    auth: enAuth,
    dashboard: enDashboard,
  },
  id: {
    auth: idAuth,
    dashboard: idDashboard,
  },
};

// Map common backend error messages to translation keys
const errorMessageMap: Record<string, string> = {
  "Invalid credentials": "messages.error.signInFailed",
  "Invalid email or password": "messages.error.signInFailed",
  "User not found": "messages.error.signInFailed",
  "Account is banned": "messages.error.accountBanned",
  "Account is disabled": "messages.error.accountDisabled",
};

export function useTranslation(namespace: keyof TranslationKeys = "auth") {
  const { locale } = useLanguage();

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = translations[locale]?.[namespace];
      if (!translation) {
        console.warn(
          `Translation namespace "${namespace}" not found for locale "${locale}"`
        );
        return key;
      }

      let value = getNestedValue(translation, key);

      if (value === undefined) {
        console.warn(
          `Translation key "${key}" not found in namespace "${namespace}" for locale "${locale}"`
        );
        // Fallback to English if key not found
        const fallbackTranslation = translations["en"]?.[namespace];
        value = getNestedValue(fallbackTranslation, key) || key;
      }

      // Replace parameters if provided
      if (params && typeof value === "string") {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }

      return value || key;
    },
    [locale, namespace]
  );

  // Helper to translate error messages from backend
  const translateError = useCallback(
    (errorMessage: string): string => {
      // Check if we have a direct mapping for this error
      const mappedKey = errorMessageMap[errorMessage];
      if (mappedKey) {
        return t(mappedKey);
      }

      // Check if the error message is already a translation key
      const translation = translations[locale]?.[namespace];
      const translatedValue = getNestedValue(translation, errorMessage);
      if (translatedValue) {
        return translatedValue;
      }

      // Fallback: return the original error message
      return errorMessage;
    },
    [t, locale, namespace]
  );

  return { t, locale, translateError };
}
