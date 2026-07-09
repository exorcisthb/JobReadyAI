import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface PaymentSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  orderCode: string | number;
  onProceed?: () => void;
}

export function PaymentSuccessPopup({
  isOpen,
  onClose,
  planName,
  amount,
  orderCode,
  onProceed,
}: PaymentSuccessPopupProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti firework effect
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  const formattedAmount = amount.toLocaleString("vi-VN") + "đ";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden bg-gradient-to-b from-card to-muted/20"
          >
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

            <div className="p-8 text-center flex flex-col items-center">
              {/* Success Badge / Icon Checkmark with Scale-in and Glow */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30 mb-6"
              >
                <Check className="h-12 w-12 stroke-[3]" />
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">
                Thanh toán thành công! 🎉
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                Hệ thống đã xác nhận thanh toán của bạn. Tài khoản của bạn đã được nâng cấp.
              </p>

              {/* Transaction details box */}
              <div className="w-full bg-muted/40 border border-border/60 rounded-2xl p-4 mb-6 text-left space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-foreground select-all">
                    {orderCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tên gói dịch vụ:</span>
                  <span className="font-bold text-foreground">{planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Số tiền đã trả:</span>
                  <span className="font-extrabold text-primary">{formattedAmount}</span>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={onProceed || onClose}
                className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group"
                style={{ background: "var(--gradient-hero)" }}
              >
                <span>Bắt đầu sử dụng ngay</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
