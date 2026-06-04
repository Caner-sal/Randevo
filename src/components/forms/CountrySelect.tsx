"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_OPTIONS } from "@/data/country-options";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function CountrySelect({
  value,
  onChange,
  className,
  placeholder = "Select country",
}: CountrySelectProps) {
  const t = useTranslations("countries");

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {COUNTRY_OPTIONS.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t(c.code as any)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
