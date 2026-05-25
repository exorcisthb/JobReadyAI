import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/theme-switcher";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Palette, ChevronDown } from "lucide-react";

export function NotFoundPage() {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <div className="absolute top-6 right-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)] hover:scale-[1.02]"
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
                  onClick={() => {
                    setTheme("light");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "light"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                  Giao diện sáng
                </button>
                <button
                  onClick={() => {
                    setTheme("dark");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "dark"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Moon className="h-4 w-4 text-blue-400" />
                  Giao diện tối
                </button>
                <button
                  onClick={() => {
                    setTheme("rose");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "rose"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Palette className="h-4 w-4 text-rose-500" />
                  Hồng nhung
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Không tìm thấy trang</h1>
        <p className="mt-4 text-muted-foreground">
          Đường dẫn này chưa có trong router React hiện tại.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </a>
      </div>
    </main>
  );
}
