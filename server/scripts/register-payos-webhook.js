/**
 * Script đăng ký webhook với PayOS
 *
 * QUAN TRỌNG: Chỉ chạy script này MỘT LẦN DUY NHẤT sau khi deploy lên production với HTTPS
 *
 * Cách chạy:
 * node server/scripts/register-payos-webhook.js
 */

import "../config/env.js";
import payos from "../config/payos.js";

const WEBHOOK_URL = process.env.PAYOS_WEBHOOK_URL;

async function registerWebhook() {
  if (!WEBHOOK_URL) {
    console.error("❌ Thiếu PAYOS_WEBHOOK_URL (ví dụ: https://jobreadyai.vn/api/payment/webhook).");
    process.exit(1);
  }
  if (!payos) {
    console.error("❌ PayOS client chưa được khởi tạo. Kiểm tra biến môi trường:");
    console.error("   - PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID ? "✅ có" : "❌ THIẾU");
    console.error("   - PAYOS_API_KEY:", process.env.PAYOS_API_KEY ? "✅ có" : "❌ THIẾU");
    console.error("   - PAYOS_CHECKSUM_KEY:", process.env.PAYOS_CHECKSUM_KEY ? "✅ có" : "❌ THIẾU");
    process.exit(1);
  }

  console.log("🔗 Đang đăng ký webhook với PayOS...");
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);

  // Không dùng try/catch im lặng — để lỗi nổi hoàn toàn
  const result = await payos.webhooks.confirm(WEBHOOK_URL);

  console.log("✅ Đăng ký webhook thành công!");
  console.log("📋 FULL RESPONSE:", JSON.stringify(result, null, 2));
  console.log("\n⚠️  Lưu ý: PayOS sẽ gửi webhook đến URL này khi có thanh toán thành công.");
  console.log("⚠️  Không cần chạy script này lại trừ khi bạn thay đổi domain/URL.");

  process.exit(0);
}

registerWebhook().catch((error) => {
  console.error("❌ Lỗi khi đăng ký webhook!");
  console.error("   message  :", error.message);
  console.error("   code     :", error.code);
  console.error("   status   :", error.response?.status);
  console.error("   response :", JSON.stringify(error.response?.data ?? error.response ?? null, null, 2));
  console.error("   stack    :", error.stack);
  process.exit(1);
});
