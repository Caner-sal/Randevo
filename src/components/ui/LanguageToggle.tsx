"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { locales, localeMetadata, AppLocale } from "@/i18n/locales";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "next-intl";

export function LanguageToggle() {
  const router = useRouter();
  const currentLocale = useLocale() as AppLocale;

  function onChange(value: string) {
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <Select value={currentLocale} onValueChange={onChange}>
      <SelectTrigger style={{ width: 140, height: 36, background: "var(--color-card)", border: "1px solid var(--color-border)", color: "var(--color-foreground)", borderRadius: 10 }}>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {localeMetadata[l].flag} {localeMetadata[l].nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
