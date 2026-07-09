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

const WEBHOOK_URL = process.env.PAYOS_WEBHOOK_URL || "https://jobreadyai.vn/api/payment/webhook";

async function registerWebhook() {
  try {
    if (!payos) {
      console.error("❌ PayOS client chưa được khởi tạo. Vui lòng kiểm tra biến môi trường:");
      console.error("   - PAYOS_CLIENT_ID");
      console.error("   - PAYOS_API_KEY");
      console.error("   - PAYOS_CHECKSUM_KEY");
      process.exit(1);
    }

    console.log("🔗 Đang đăng ký webhook với PayOS...");
    console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);

    const result = await payos.confirmWebhook(WEBHOOK_URL);

    console.log("✅ Đăng ký webhook thành công!");
    console.log("📋 Kết quả:", result);
    console.log("\n⚠️  Lưu ý: PayOS sẽ gửi webhook đến URL này khi có thanh toán thành công.");
    console.log("⚠️  Không cần chạy script này lại trừ khi bạn thay đổi domain/URL.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký webhook:", error.message);
    if (error.response) {
      console.error("📋 Chi tiết lỗi:", error.response.data);
    }
    console.error("\n💡 Kiểm tra:");
    console.error("   1. Các biến môi trường PayOS đã được set đúng chưa?");
    console.error("   2. URL webhook có HTTPS và truy cập được từ internet không?");
    console.error("   3. Tài khoản PayOS có hoạt động không?");
    process.exit(1);
  }
}

registerWebhook();
