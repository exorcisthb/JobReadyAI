import { BarChart3, BookOpen, Crown, FileText, Newspaper, Users, FileClock, MessageCircle, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { NavItem } from "@/components/dashboard-header";

export function useUserNavItems(): NavItem[] {
  const { t } = useTranslation();
  return [
    { label: t("nav.overview"), icon: <BarChart3 className="h-5 w-5" />, href: "/user/dashboard" },
    { label: t("nav.viewCV"), icon: <FileText className="h-5 w-5" />, href: "/cv" },
    { label: t("nav.cvDrafts"), icon: <FileClock className="h-5 w-5" />, href: "/cv/drafts" },
    { label: t("nav.upgrade"), icon: <Crown className="h-5 w-5" />, href: "/pricing" },
    { label: t("nav.chat"), icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
    { label: t("nav.groups"), icon: <Users className="h-5 w-5" />, href: "/groups" },
    { label: t("nav.blogCareer"), icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
    { label: t("nav.news"), icon: <Newspaper className="h-5 w-5" />, href: "/news" },
    { label: t("nav.support"), icon: <Headset className="h-5 w-5" />, href: "/support" },
  ];
}
