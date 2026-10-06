import React from "react";
import logoJr from "@/assets/logo.png";
import { useAuth } from "@/components/auth-provider";

export function getRoleDashboardUrl(role?: string | null): string {
  if (role === "admin") return "/admin/dashboard";
  if (role === "content_manager") return "/content-manager/dashboard";
  if (role === "user") return "/user/dashboard";
  return "/";
}

export interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  size?: number;
  showText?: boolean;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function BrandLogo({
  className = "",
  textClassName = "",
  size = 36,
  showText = true,
  to,
  onClick,
}: BrandLogoProps) {
  const { user } = useAuth();
  const targetHref = to ?? getRoleDashboardUrl(user?.role);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }
    e.preventDefault();
    window.location.assign(targetHref);
  };

  return (
    <a
      href={targetHref}
      onClick={handleClick}
      className={`flex items-center gap-2 group logo-sparkle-link cursor-pointer select-none ${className}`}
      aria-label="JobReady AI Dashboard"
    >
      <div className="logo-sparkle-wrapper" style={{ width: size, height: size }}>
        <div className="logo-glow-ring" />
        <span className="logo-spark logo-spark-1" />
        <span className="logo-spark logo-spark-2" />
        <span className="logo-spark logo-spark-3" />
        <span className="logo-spark logo-spark-4" />
        <span className="logo-spark logo-spark-5" />
        <span className="logo-spark logo-spark-6" />
        <img
          src={logoJr}
          alt="JobReady AI Logo"
          className="logo-img"
          style={{ width: size, height: size }}
        />
      </div>
      {showText && (
        <span
          className={`text-lg font-bold tracking-tight logo-brand-text ${textClassName}`}
        >
          JobReady AI
        </span>
      )}
    </a>
  );
}

export default BrandLogo;
