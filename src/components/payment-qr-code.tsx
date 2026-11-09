import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QrCode, Trees } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { drawPaymentTree } from "@/lib/payment-tree";

function PaymentTree({ size }: { size: number }) {
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
      drawPaymentTree(context, size, reduceMotion ? 1.5 : (now - startedAt) / 1000);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [size, reduceMotion]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden="true" />;
}

/** Keep the payment payload intact; the tree is a decorative, opt-in view. */
export function PaymentQRCode({ value, size = 190 }: { value: string; size?: number }) {
  const { t } = useTranslation();
  // A different order always starts with a scannable QR, even in the same modal.
  const [treeForValue, setTreeForValue] = useState<string | null>(null);
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
              <PaymentTree size={frameSize} />
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
