"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultLocale } from "../config";
import type { Locale } from "../config";
import { getStoredLocale, setStoredLocale } from "../utils";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Only run on client side - read from localStorage and update locale
    const storedLocale = getStoredLocale();
    setLocaleState(storedLocale);
    // Set initial document language
    if (typeof document !== "undefined") {
      document.documentElement.lang = storedLocale;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
    // Trigger a re-render by updating the document language
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
    }
  };

  // Always provide the context, even during SSR
  // Use defaultLocale during SSR and update on client mount
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
