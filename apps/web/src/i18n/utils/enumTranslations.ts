/**
 * Helper function to translate enum values to display labels
 * This keeps enum values intact while providing translated labels for UI
 */
import { useTranslation } from "../hooks/useTranslation";

export function useEnumTranslation() {
  const { t } = useTranslation("createRoad");

  const translateEnum = (
    enumType: string,
    value: string
  ): string => {
    const key = `enums.${enumType}.${value}`;
    const translated = t(key);
    // If translation not found, return formatted value
    if (translated === key) {
      return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return translated;
  };

  return { translateEnum };
}
