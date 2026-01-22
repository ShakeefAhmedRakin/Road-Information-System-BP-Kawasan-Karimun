"use client";

import { AppLogoWithTranslation } from "./app-logo-with-translation";

// Client component wrapper for server components that need translated logo
export function AppLogoClient(props: {
  href?: string;
  className?: string;
  textColor?: string;
  logoSize?: string;
}) {
  return <AppLogoWithTranslation {...props} />;
}
