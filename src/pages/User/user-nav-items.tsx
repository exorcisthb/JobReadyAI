import { BarChart3, Bell, BookOpen, Dumbbell, FileText, MessageSquare, Users } from "lucide-react";
import type { NavItem } from "@/components/dashboard-header";

export const userNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/user/dashboard" },
  { label: "Phỏng vấn", icon: <MessageSquare className="h-5 w-5" />, href: "/interview/config" },
  { label: "Xem CV", icon: <FileText className="h-5 w-5" />, href: "/cv" },
  { label: "Nhóm", icon: <Users className="h-5 w-5" />, href: "/groups" },
  { label: "Lịch nhắc", icon: <Bell className="h-5 w-5" />, href: "/reminders" },
  { label: "Luyện tập", icon: <Dumbbell className="h-5 w-5" />, href: "/practice" },
  { label: "Blog Career", icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
];
