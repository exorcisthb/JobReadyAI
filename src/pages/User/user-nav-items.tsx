import { BarChart3, Bell, BookOpen, Crown, FileText, Newspaper, Users, MessageSquare, MessageCircle } from "lucide-react";
import type { NavItem } from "@/components/dashboard-header";

export const userNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/user/dashboard" },
  { label: "Phỏng vấn AI", icon: <MessageSquare className="h-5 w-5" />, href: "/interview/config" },
  { label: "Xem CV", icon: <FileText className="h-5 w-5" />, href: "/cv" },
  { label: "Nhóm", icon: <Users className="h-5 w-5" />, href: "/groups" },
  { label: "Trò chuyện", icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
  { label: "Lịch nhắc", icon: <Bell className="h-5 w-5" />, href: "/reminders" },
  { label: "Blog Career", icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <Newspaper className="h-5 w-5" />, href: "/news" },
  { label: "Nâng cấp", icon: <Crown className="h-5 w-5" />, href: "/pricing" },
];

