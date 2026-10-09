import express from "express";
import { ensureSupportSchema, query, withTransaction } from "../config/database.js";
import { sendSupportEmail } from "../service/EmailService.js";

const router = express.Router();
const SUPPORT_CATEGORIES = new Set(["Sự cố kỹ thuật", "Đóng góp ý kiến", "Tài khoản", "Thanh toán", "Khác"]);
const SUPPORT_STATUSES = new Set(["received", "processing", "resolved"]);

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập để tiếp tục." });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

async function requireAdmin(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Vui lòng đăng nhập để tiếp tục." });
  try {
    const result = await query("select role from users where id = $1", [userId]);
    if (result.rows[0]?.role !== "admin") return res.status(403).json({ error: "Bạn không có quyền thực hiện thao tác này." });
    req.user = { id: userId, role: "admin" };
    return next();
  } catch (error) {
    return next(error);
  }
}

router.post("/contact", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const category = typeof req.body?.category === "string" ? req.body.category.trim() : "";
  const subject = typeof req.body?.subject === "string" ? req.body.subject.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const senderName = typeof req.body?.senderName === "string" ? req.body.senderName.trim().slice(0, 120) : "";
  const senderEmail = typeof req.body?.senderEmail === "string" ? req.body.senderEmail.trim().slice(0, 254) : "";

  if (!SUPPORT_CATEGORIES.has(category)) return res.status(400).json({ error: "Vui lòng chọn loại yêu cầu hợp lệ." });
  if (subject.length < 3 || subject.length > 160) return res.status(400).json({ error: "Tiêu đề cần từ 3 đến 160 ký tự." });
  if (message.length < 10 || message.length > 8000) return res.status(400).json({ error: "Nội dung cần từ 10 đến 8.000 ký tự." });
  if (senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) return res.status(400).json({ error: "Email liên hệ không hợp lệ." });

  try {
    await ensureSupportSchema();
    const profile = await query(
      `select coalesce(nullif(p.full_name, ''), nullif(u.email, ''), $2) as name,
              coalesce(nullif(u.email, ''), $3) as email
       from users u left join user_profiles p on p.user_id = u.id where u.id = $1`,
      [userId, senderName, senderEmail],
    );
    const sender = profile.rows[0];
    const ticket = await withTransaction(async (client) => {
      const inserted = await client.query(
        `insert into support_requests (user_id, sender_name, sender_email, category, subject, message)
         values ($1, $2, $3, $4, $5, $6)
         returning id, status, created_at`,
        [userId, sender?.name || senderName || "Người dùng JobReady AI", sender?.email || senderEmail, category, subject, message],
      );
      const item = inserted.rows[0];
      await client.query(
        `insert into notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
         select admins.id, $1, $2, 'user', 'Yêu cầu hỗ trợ mới', $3, 'info', $4
         from users admins where admins.role = 'admin'`,
        [userId, sender?.name || senderName || "Người dùng", `${category}: ${subject}`, `/admin/support?request=${item.id}`],
      );
      return item;
    });

    let emailSent = false;
    try {
      await sendSupportEmail({ category, subject, message, senderName: sender?.name || senderName, senderEmail: sender?.email || senderEmail, userId });
      emailSent = true;
      await query("update support_requests set email_sent = true where id = $1", [ticket.id]);
    } catch (emailError) {
      console.error("[Support] Ticket saved, but support email could not be sent:", emailError);
    }
    return res.status(201).json({ success: true, emailSent, request: ticket });
  } catch (error) {
    console.error("[Support] Unable to record support request:", error);
    return res.status(503).json({ error: "Chưa ghi nhận được yêu cầu hỗ trợ. Vui lòng thử lại sau." });
  }
});

router.get("/sent", requireAuth, async (req, res, next) => {
  try {
    await ensureSupportSchema();
    const result = await query(
      `select id, category, subject, message, status, email_sent, created_at, updated_at
       from support_requests where user_id = $1 order by created_at desc limit 100`,
      [req.user.id],
    );
    res.json({ requests: result.rows });
  } catch (error) { next(error); }
});

router.get("/admin/requests", requireAdmin, async (_req, res, next) => {
  try {
    await ensureSupportSchema();
    const result = await query(
      `select r.id, r.user_id, r.sender_name, r.sender_email, r.category, r.subject, r.message,
              r.status, r.email_sent, r.created_at, r.updated_at
       from support_requests r order by case r.status when 'received' then 0 when 'processing' then 1 else 2 end, r.created_at desc limit 500`,
    );
    res.json({ requests: result.rows });
  } catch (error) { next(error); }
});

router.patch("/admin/requests/:id/status", requireAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(400).json({ error: "Mã thư không hợp lệ." });
  }
  if (!SUPPORT_STATUSES.has(status)) return res.status(400).json({ error: "Trạng thái không hợp lệ." });
  try {
    await ensureSupportSchema();
    const result = await query(
      `update support_requests set status = $2, updated_at = now() where id = $1
       returning id, user_id, category, subject, status, updated_at`,
      [id, status],
    );
    if (!result.rowCount) return res.status(404).json({ error: "Không tìm thấy thư hỗ trợ." });
    const item = result.rows[0];
    const statusText = status === "received" ? "Đã nhận" : status === "processing" ? "Đang xử lý" : "Đã xử lý";
    await query(
      `insert into notifications (user_id, sender_name, sender_role, title, message, type, link)
       values ($1, 'JobReady AI', 'admin', 'Cập nhật yêu cầu hỗ trợ', $2, 'info', '/support/sent')`,
      [item.user_id, `Yêu cầu “${item.subject}” hiện ở trạng thái: ${statusText}.`],
    );
    return res.json({ request: item });
  } catch (error) { next(error); }
});

export default router;
