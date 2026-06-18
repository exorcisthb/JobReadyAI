import { useTheme } from "@/components/theme-provider";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Palette, ChevronDown, WifiOff } from "lucide-react";

export function NotFoundPage() {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <section className="bg-white font-serif min-h-screen flex items-center justify-center">
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
                onClick={() => { setTheme("light"); setDropdownOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${theme === "light" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <Sun className="h-4 w-4 text-amber-500" /> Giao diện sáng
              </button>
              <button
                onClick={() => { setTheme("dark"); setDropdownOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${theme === "dark" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <Moon className="h-4 w-4 text-blue-400" /> Giao diện tối
              </button>
              <button
                onClick={() => { setTheme("rose"); setDropdownOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${theme === "rose" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <Palette className="h-4 w-4 text-rose-500" /> Hồng nhung
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                {isOffline ? "!?" : "404"}
              </h1>
            </div>

            <div className="mt-[-50px]">
              {isOffline ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <WifiOff className="h-6 w-6 text-gray-500" />
                    <h3 className="text-2xl text-black sm:text-3xl font-bold">
                      Mất kết nối mạng
                    </h3>
                  </div>
                  <p className="text-black sm:mb-5">
                    Vui lòng kiểm tra lại đường truyền internet và thử lại.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl text-black sm:text-3xl font-bold mb-4">
                    Look like you're lost
                  </h3>
                  <p className="mb-6 text-black sm:mb-5">
                    The page you are looking for is not available!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
