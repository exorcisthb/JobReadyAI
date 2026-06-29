"use client";

import { useTranslation } from "react-i18next";

interface OnlineDotProps {
  online: boolean;
  recent?: boolean;
  className?: string;
}

export function OnlineDot({ online, recent, className = "" }: OnlineDotProps) {
  const { t } = useTranslation();
  if (!online && !recent) return null;
  return (
    <span
      className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[#1a1a2e] shadow-sm ${online ? "bg-emerald-500 animate-pulse" : "bg-gray-400"} ${className}`}
      title={online ? t("onlineDot.active") : t("onlineDot.recent")}
    />
  );
}
