import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Sun, Moon, Palette, ChevronDown } from "lucide-react";
import GooeyNav from "@/components/gooey-nav";
import { useTheme } from "@/components/theme-provider";

interface SharedHeaderProps {
  /** Highlight a specific nav item as active. Defaults to "" (none). */
  activeNav?: string;
}

export function SharedHeader({ activeNav = "" }: SharedHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-background/85 shadow-[var(--shadow-soft)] backdrop-blur-lg py-1"
          : "border-border/0 bg-background/70 backdrop-blur-md py-3"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:scale-110"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">JobReady AI</span>
        </a>

        {/* Navigation */}
        <div className="hidden md:flex">
          <GooeyNav
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giới thiệu", href: "/#about" },
              { label: "Tính năng", href: "/#features" },
              { label: "Cách hoạt động", href: "/#how" },
              { label: "Chính sách bảo mật", href: "/chinh-sach" },
            ]}
            initialActiveIndex={
              activeNav === "chinh-sach" ? 4 : activeNav === "about" ? 1 : activeNav === "features" ? 2 : activeNav === "how" ? 3 : 0
            }
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            animationTime={600}
            timeVariance={300}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)]"
              title="Chọn giao diện"
            >
              {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" />}
              {theme === "dark" && <Moon className="h-3.5 w-3.5 text-blue-400" />}
              {theme === "rose" && <Palette className="h-3.5 w-3.5 text-rose-500" />}
              <span className="hidden sm:inline capitalize">
                {theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Hồng"}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-border bg-card/95 p-1.5 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50">
                <button
                  onClick={() => { setTheme("light"); setDropdownOpen(false); }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "light" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Sun className={`h-4 w-4 ${theme === "light" ? "text-amber-500" : "text-muted-foreground"}`} />
                  Giao diện sáng
                </button>
                <button
                  onClick={() => { setTheme("dark"); setDropdownOpen(false); }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "dark" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Moon className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-muted-foreground"}`} />
                  Giao diện tối
                </button>
                <button
                  onClick={() => { setTheme("rose"); setDropdownOpen(false); }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "rose" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Palette className={`h-4 w-4 ${theme === "rose" ? "text-rose-500" : "text-muted-foreground"}`} />
                  Giao diện hồng
                </button>
              </div>
            )}
          </div>

          <a
            href="/authentication/login"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Đăng nhập
          </a>
          <a
            href="/authentication/register"
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:opacity-90 hover:scale-105 premium-shimmer-btn"
            style={{ background: "var(--gradient-hero)" }}
          >
            Tạo CV ngay <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
