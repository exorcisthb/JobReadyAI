import { RefreshCw, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MaintenancePage({ message }: { message?: string }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--accent-mint)_24%,transparent),transparent_34%),linear-gradient(135deg,var(--background)_0%,var(--card)_52%,var(--secondary)_100%)]" />
      <div className="absolute left-10 top-10 h-28 w-28 animate-pulse rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-16 right-10 h-36 w-36 animate-pulse rounded-full bg-accent-mint/25 blur-3xl" />
      <div className="absolute left-1/2 top-20 h-16 w-16 -translate-x-1/2 rounded-full bg-accent/40 blur-2xl" />

      <div className="relative w-full max-w-5xl rounded-[2rem] border border-border bg-card/85 p-6 text-center text-card-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
          <Sparkles className="h-4 w-4" />
          JobReady AI đang nâng cấp hệ thống
        </div>

        <div className="relative mx-auto max-w-2xl">
          <div
            className="mx-auto h-[230px] bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] bg-contain bg-center bg-no-repeat sm:h-[320px] md:h-[360px]"
            aria-hidden="true"
          />
          <div className="absolute right-8 top-10 hidden rounded-2xl bg-card/90 p-3 shadow-lg ring-1 ring-border md:block">
            <Wrench className="h-6 w-6 animate-pulse text-primary" />
          </div>
        </div>

        <div className="mx-auto mt-2 max-w-3xl space-y-5 sm:mt-0">
          <h1 className="px-4 pb-3 pt-4 text-4xl font-black leading-[1.35] tracking-tight text-primary sm:text-5xl md:text-6xl">
            Hệ thống đang bảo trì
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {message || "Chúng tôi đang nâng cấp hệ thống, vui lòng quay lại sau."}
          </p>

          <div className="flex items-center justify-center pt-2">
            <Button
              variant="default"
              onClick={() => window.location.reload()}
              className="group rounded-full bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
