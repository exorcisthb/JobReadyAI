import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CloudRain, Flower2, QrCode, RotateCcw, Sun, Trees } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { drawPaymentTree, TREE_COLORS } from "@/lib/payment-tree";
import type { TreeColor, TreeSeason } from "@/lib/payment-tree";

const seasons = [
  { id: "spring", icon: Flower2 },
  { id: "summer", icon: Sun },
  { id: "autumn", icon: CloudRain },
] as const;
const colors = Object.keys(TREE_COLORS) as TreeColor[];

function PaymentTree({ size, season, color }: { size: number; season: TreeSeason; color: TreeColor | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    context.scale(ratio, ratio);

    let frame = 0;
    const startedAt = performance.now();
    const draw = (now: number) => {
      drawPaymentTree(context, size, reduceMotion ? 1.5 : (now - startedAt) / 1000, season, color);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [size, reduceMotion, season, color]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden="true" />;
}

/** Keep the payment payload intact; the tree is a decorative, opt-in view. */
export function PaymentQRCode({ value, size = 190 }: { value: string; size?: number }) {
  const { t } = useTranslation();
  // A different order always starts with a scannable QR, even in the same modal.
  const [treeForValue, setTreeForValue] = useState<string | null>(null);
  const [season, setSeason] = useState<TreeSeason>("summer");
  const [color, setColor] = useState<TreeColor | null>(null);
  const showTree = treeForValue === value;
  const reduceMotion = useReducedMotion();
  const frameSize = size + 32;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative isolate overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-lg ring-4 ring-primary/5"
        style={{ width: frameSize, height: frameSize }}
      >
        <AnimatePresence initial={false}>
          {showTree ? (
            <motion.div
              key="tree"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              className="absolute inset-0 flex items-center justify-center bg-[#f7f8ee]"
              role="img"
              aria-label={t("pricing.ui.paymentTreeLabel")}
            >
              <PaymentTree size={frameSize} season={season} color={color} />
            </motion.div>
          ) : (
            <motion.div
              key="qr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-white"
            >
              <QRCodeSVG
                value={value}
                size={size}
                level="M"
                marginSize={4}
                fgColor="#000000"
                bgColor="#ffffff"
                title={t("pricing.ui.paymentQrLabel")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showTree && (
        <div className="space-y-2" style={{ width: frameSize }}>
          <div
            role="group"
            aria-label={t("pricing.ui.treeSeason")}
            className="grid grid-cols-3 gap-1 rounded-2xl bg-muted/60 p-1"
          >
            {seasons.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={season === id}
                onClick={() => setSeason(id)}
                className={`flex min-h-10 items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  season === id ? "bg-background text-foreground shadow-sm ring-1 ring-primary/40" : "text-muted-foreground hover:bg-background/70"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {t(`pricing.ui.treeSeasons.${id}`)}
              </button>
            ))}
          </div>
          <div role="group" aria-label={t("pricing.ui.treeColor")} className="grid grid-cols-6 gap-0.5">
            {colors.map(id => (
              <button
                key={id}
                type="button"
                aria-label={t(`pricing.ui.treeColors.${id}`)}
                aria-pressed={color === id}
                onClick={() => setColor(id)}
                className="flex h-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span
                  className={`h-6 w-6 rounded-full border border-black/5 ring-offset-2 ring-offset-background transition-shadow ${color === id ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/30"}`}
                  style={{ backgroundColor: TREE_COLORS[id] }}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setColor(null)}
            disabled={color === null}
            className="mx-auto flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            {t("pricing.ui.treeSeasonColor")}
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setTreeForValue(showTree ? null : value)}
        aria-pressed={showTree}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {showTree ? <QrCode className="h-4 w-4" /> : <Trees className="h-4 w-4" />}
        {t(showTree ? "pricing.ui.showPaymentQr" : "pricing.ui.showPaymentTree")}
      </button>
      {showTree && (
        <p className="max-w-[250px] text-center text-[11px] leading-relaxed text-muted-foreground" role="status">
          {t("pricing.ui.paymentTreeHint")}
        </p>
      )}
    </div>
  );
}
