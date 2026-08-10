import express from "express";
import payos from "../config/payos.js";
import { query, withTransaction } from "../config/database.js";
import { INTERVIEW_PLANS, CV_PLANS } from "./subscription.js";
import { del } from "../utils/cache.js";
import { sendPurchaseEmail } from "../service/EmailService.js";

const router = express.Router();

// Middleware xác thực
function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

// Hàm tạo orderCode unique (timestamp + random)
function generateOrderCode() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return parseInt(`${timestamp}${random}`.slice(0, 13)); // PayOS chỉ chấp nhận số 13 chữ số
}

/**
 * POST /api/payment/create
 * Tạo payment link với PayOS
 */
router.post("/create", requireAuth, async (req, res, next) => {
  try {
    if (!payos) {
      return res.status(503).json({ 
        error: "Payment service is not configured" 
      });
    }

    const { planId, planName, amount, billingCycle = "monthly", requestId } = req.body;
    const userId = req.user.id;

    if (!planId || !planName) {
      return res.status(400).json({ 
        error: "Missing required fields: planId, planName" 
      });
    }

    // Tra cứu giá trị thật từ phía server
    const isInterview = ["pro_interview", "ultra_interview"].includes(planId);
    const isCv = ["pro_cv", "ultra_cv"].includes(planId);
    let planInfo = null;

    if (isInterview) {
      planInfo = INTERVIEW_PLANS[planId];
    } else if (isCv) {
      planInfo = CV_PLANS[planId];
    }

    if (!planInfo) {
      return res.status(400).json({ error: "Gói thanh toán không hợp lệ." });
    }

    const expectedAmount = billingCycle === "weekly" ? planInfo.weeklyPrice : planInfo.monthlyPrice;

    // Nếu client gửi amount khác với giá trị server tra cứu, lập tức REJECT
    if (amount !== undefined && amount !== null && Number(amount) !== expectedAmount) {
      return res.status(400).json({
        error: `Số tiền gửi lên không hợp lệ. Gói này có giá trị: ${expectedAmount}đ`
      });
    }

    const finalAmount = expectedAmount;

    // ─── Idempotency & anti double-submit ─────────────────────────────────────
    // (1) Same requestId → return the previous order (protects against double taps).
    if (requestId) {
      const existingById = await query(
        `SELECT * FROM payment_orders WHERE user_id = $1 AND metadata->>'requestId' = $2 ORDER BY created_at DESC LIMIT 1`,
        [userId, String(requestId)]
      );
      if (existingById.rows[0]) {
        const prev = existingById.rows[0];
        const prevQr = prev.metadata?.qrCode || null;
        // If it already succeeded, don't create anything new.
        if (["paid", "processing"].includes(prev.status)) {
          return res.json({ success: true, orderCode: prev.order_code, checkoutUrl: prev.checkout_url, qrCode: prevQr });
        }
        // Unpaid duplicate requestId → reuse the checkout URL if still fresh.
        if (prev.status === "pending" && prev.checkout_url) {
          const ageMinutes = (Date.now() - new Date(prev.created_at).getTime()) / 60000;
          if (ageMinutes <= 30) {
            return res.json({ success: true, orderCode: prev.order_code, checkoutUrl: prev.checkout_url, qrCode: prevQr });
          }
        }
      }
    }

    // (2) Reuse an existing PENDING order for the same plan + billing cycle, if
    //     it is still recent. Repeated taps then share ONE QR/link to pay.
    const existingPending = await query(
      `SELECT * FROM payment_orders
       WHERE user_id = $1 AND plan_id = $2 AND status = 'pending'
       ORDER BY created_at DESC LIMIT 1`,
      [userId, planId]
    );
    if (existingPending.rows[0]) {
      const pending = existingPending.rows[0];
      const pendingWasSameCycle = pending.metadata?.billingCycle === billingCycle;
      const ageMinutes = (Date.now() - new Date(pending.created_at).getTime()) / 60000;

      if (pendingWasSameCycle && pending.checkout_url && ageMinutes <= 30) {
        // Update the requestId if the caller provided one, then reuse the order.
        if (requestId) {
          await query(
            `UPDATE payment_orders SET metadata = $1 WHERE id = $2`,
            [JSON.stringify({ ...(pending.metadata || {}), billingCycle, requestId }), pending.id]
          );
        }
        return res.json({ success: true, orderCode: pending.order_code, checkoutUrl: pending.checkout_url, qrCode: pending.metadata?.qrCode || null });
      }

      // Stale/expired pending order → mark cancelled so a fresh order can be made.
      await query(`UPDATE payment_orders SET status = 'cancelled', cancelled_at = NOW() WHERE id = $1`, [pending.id]);
    }

    // Tạo orderCode unique
    const orderCode = generateOrderCode();

    // Lưu đơn hàng với status "pending"
    await query(
      `INSERT INTO payment_orders 
       (order_code, user_id, plan_id, plan_name, amount, status, metadata)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)`,
      [orderCode, userId, planId, planName, finalAmount, JSON.stringify({ billingCycle, requestId: requestId || null })]
    );

    // Tạo payment link với PayOS
    const paymentData = {
      orderCode,
      amount: finalAmount,
      // Webhook đối soát qua orderCode trong QR — description chỉ là text hiển thị trên app ngân hàng.
      description: planId.startsWith("ultra") ? "Ultra jobreadyai.vn" : "Pro jobreadyai.vn",
      items: [
        {
          name: planName,
          quantity: 1,
          price: finalAmount,
        },
      ],
      returnUrl: process.env.PAYOS_RETURN_URL || "http://localhost:5173/payment/success",
      cancelUrl: process.env.PAYOS_CANCEL_URL || "http://localhost:5173/payment/cancel",
    };

    const paymentLink = await payos.paymentRequests.create(paymentData);

    // Cập nhật checkout_url + lưu qrCode vào metadata để tái sử dụng khi mở lại
    await query(
      `UPDATE payment_orders SET checkout_url = $1, metadata = $2 WHERE order_code = $3`,
      [
        paymentLink.checkoutUrl,
        JSON.stringify({ billingCycle, requestId: requestId || null, qrCode: paymentLink.qrCode || null }),
        orderCode,
      ]
    );

    res.json({
      success: true,
      orderCode,
      checkoutUrl: paymentLink.checkoutUrl,
      qrCode: paymentLink.qrCode,
    });
  } catch (error) {
    console.error("❌ Payment creation error:", error);
    next(error);
  }
});

/**
 * POST /api/payment/webhook
 * Nhận webhook từ PayOS khi thanh toán thành công
 */
router.post("/webhook", async (req, res) => {
  // ⚡ RAW LOG — xuất hiện ngay khi PayOS gọi tới, trước khi verify
  console.log("🔔 [WEBHOOK HIT]", new Date().toISOString(), JSON.stringify(req.body));
  console.log("🔔 [WEBHOOK HEADERS]", JSON.stringify(req.headers));

  try {
    if (!payos) {
      console.warn("⚠️  PayOS not configured, ignoring webhook");
      return res.status(200).json({ success: true });
    }

    const webhookData = req.body;
    console.log("📩 Received PayOS webhook:", JSON.stringify(webhookData, null, 2));

    // Verify webhook signature
    // NOTE: verify() là async — bắt buộc phải await!
    let verifiedData;
    try {
      verifiedData = await payos.webhooks.verify(webhookData);
    } catch (err) {
      console.error("❌ Invalid webhook signature:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    // verify() trả về inner data object trực tiếp (không có outer code)
    // Dùng webhookData.code để kiểm tra trạng thái thành công
    const successCode = webhookData.code ?? verifiedData?.code;
    if (successCode !== "00") {
      console.log(`ℹ️  Webhook not successful, code=${successCode}, skipping`);
      return res.status(200).json({ success: true });
    }

    // verifiedData = inner data = { orderCode, amount, transactionDateTime, ... }
    const data = verifiedData;

    const { orderCode, amount, transactionDateTime } = data;

    // Lấy thông tin đơn hàng để verify amount
    const orderResult = await query(
      `SELECT * FROM payment_orders WHERE order_code = $1`,
      [orderCode]
    );
    if (orderResult.rows.length === 0) {
      console.error(`❌ Order not found: ${orderCode}`);
      return res.status(200).json({ success: false, error: "Order not found" });
    }
    const order = orderResult.rows[0];

    // Kiểm tra số tiền khớp
    if (order.amount !== amount) {
      console.error(`❌ Amount mismatch: expected ${order.amount}, got ${amount}`);
      return res.status(200).json({ success: false, error: "Amount mismatch" });
    }

    // Kích hoạt gói (idempotent)
    await activateOrder(orderCode, data.id || String(orderCode), transactionDateTime);

    res.status(200).json({ success: true, message: "Payment processed" });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(200).json({ success: false, error: error.message });
  }
});

// ─── Shared: Kích hoạt gói sau thanh toán ────────────────────────────────────
async function activateOrder(orderCode, transactionId, transactionDateTime) {
  const orderResult = await query(
    `SELECT * FROM payment_orders WHERE order_code = $1`,
    [orderCode]
  );
  if (orderResult.rows.length === 0) throw new Error(`Order not found: ${orderCode}`);

  const order = orderResult.rows[0];

  // Idempotency — nếu đã paid rồi thì bỏ qua
  if (order.status === "paid") {
    console.log(`ℹ️  Order ${orderCode} already activated, skipping`);
    return order;
  }

  const { user_id, plan_id, amount, plan_name, metadata } = order;
  const billingCycle = metadata?.billingCycle || "monthly";
  const isInterview = ["pro_interview", "ultra_interview"].includes(plan_id);
  const expiresAt = new Date();
  if (billingCycle === "weekly") {
    expiresAt.setDate(expiresAt.getDate() + 7);
  } else {
    expiresAt.setDate(expiresAt.getDate() + 30);
  }
  const oldPlans = isInterview
    ? "('pro_interview', 'ultra_interview')"
    : "('pro_cv', 'ultra_cv')";

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE payment_orders SET status = 'paid', paid_at = $1, payos_transaction_id = $2 WHERE order_code = $3`,
      [transactionDateTime || new Date(), transactionId || String(orderCode), orderCode]
    );

    await client.query(
      `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = $1 AND plan IN ${oldPlans} AND status = 'active'`,
      [user_id]
    );

    await client.query(
      `INSERT INTO user_subscriptions (user_id, plan, status, started_at, expires_at) VALUES ($1, $2, 'active', NOW(), $3)`,
      [user_id, plan_id, expiresAt]
    );

    if (isInterview) {
      await client.query(
        `UPDATE users SET sub_plan_interview = $1, sub_expires_interview = $2, updated_at = NOW() WHERE id = $3`,
        [plan_id, expiresAt, user_id]
      );
    } else {
      await client.query(
        `UPDATE users SET sub_plan_cv = $1, sub_expires_cv = $2, updated_at = NOW() WHERE id = $3`,
        [plan_id, expiresAt, user_id]
      );
    }

    await client.query(
      `INSERT INTO transactions (user_id, item_type, item_id, item_name, amount, payment_method, status) VALUES ($1, 'subscription', $2, $3, $4, 'payos', 'completed')`,
      [user_id, plan_id, plan_name, amount]
    );

    console.log(`✅ Order ${orderCode} activated: plan=${plan_id}, user=${user_id}`);
  });

  // Invalidate user plan cache NGAY LẬP TỨC — không chờ TTL 120s
  del(`user_plan:${user_id}`);

  // Gửi email xác nhận đơn hàng (không chặn giao dịch nếu mail fail)
  try {
    const userResult = await query(`SELECT email FROM users WHERE id = $1`, [user_id]);
    const userEmail = userResult.rows[0]?.email;
    if (userEmail) {
      await sendPurchaseEmail(userEmail, {
        planName: plan_name,
        amount,
        billingCycle,
        expiresAt,
      });
    } else {
      console.warn(`⚠️  User ${user_id} has no email — skip purchase email`);
    }
  } catch (emailErr) {
    console.warn("⚠️  Purchase email failed (non-blocking):", emailErr.message);
  }

  return { ...order, status: "paid" };
}

/**
 * GET /api/payment/check/:orderCode
 * Polling từ frontend — hỏi thẳng PayOS nếu DB chưa cập nhật (bù cho webhook bị miss)
 */
router.get("/check/:orderCode", requireAuth, async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const userId = req.user.id;

    // 1. Kiểm tra DB trước
    const result = await query(
      `SELECT * FROM payment_orders WHERE order_code = $1 AND user_id = $2`,
      [orderCode, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = result.rows[0];

    // 2. Nếu đã paid trong DB → trả về luôn
    if (order.status === "paid") {
      return res.json({ order });
    }

    // 3. DB chưa paid → hỏi thẳng PayOS để bù webhook bị miss
    if (payos) {
      try {
        const payosInfo = await payos.paymentRequests.get(Number(orderCode));
        console.log(`🔍 PayOS check for order ${orderCode}: status=${payosInfo?.status}`);

        if (payosInfo?.status === "PAID") {
          console.log(`💡 Webhook missed — activating order ${orderCode} via polling fallback`);
          const activated = await activateOrder(
            Number(orderCode),
            payosInfo.transactions?.[0]?.reference,
            payosInfo.transactions?.[0]?.transactionDateTime
          );
          return res.json({ order: activated });
        }
      } catch (payosErr) {
        // Nếu hỏi PayOS lỗi thì vẫn trả về DB status, không crash
        console.warn(`⚠️  PayOS getPaymentLinkById failed for ${orderCode}:`, payosErr.message);
      }
    }

    // 4. PayOS chưa xác nhận → trả về pending
    return res.json({ order });
  } catch (error) {
    next(error);
  }
});

export default router;
