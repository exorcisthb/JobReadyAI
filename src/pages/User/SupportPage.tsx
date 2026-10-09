import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CircleHelp, Mail, MailCheck, MessageCircle, Send, X,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useAuth } from "@/components/auth-provider";

const CONTACT_EMAIL = "admin@jobreadyai.vn";

export default function SupportPage() {
  const { t } = useTranslation();
  const tx = (key: string, fallback: string) => t(key, { defaultValue: fallback });
  const { logout, user } = useAuth();
  const navItems = useUserNavItems();
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactCategory, setContactCategory] = useState("Sự cố kỹ thuật");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const faqs = [
    [tx("supportPage.faqs.saveQuestion", "CV của tôi được lưu ở đâu?"), tx("supportPage.faqs.saveAnswer", "CV đang chỉnh sửa được lưu trong mục CV nháp. Hãy đăng nhập đúng tài khoản để tiếp tục chỉnh sửa hoặc mở lại CV.")],
    [tx("supportPage.faqs.interviewQuestion", "Tôi không thể bắt đầu hoặc tiếp tục phỏng vấn AI?"), tx("supportPage.faqs.interviewAnswer", "Kiểm tra kết nối mạng, cho phép trình duyệt sử dụng micro và tải lại trang. Nếu vẫn gặp lỗi, hãy gửi email kèm thời điểm xảy ra và ảnh chụp thông báo lỗi.")],
    [tx("supportPage.faqs.paymentQuestion", "Tôi đã thanh toán nhưng gói dịch vụ chưa cập nhật?"), tx("supportPage.faqs.paymentAnswer", "Hãy kiểm tra lại trạng thái giao dịch và đăng nhập đúng tài khoản đã mua gói. Nếu gói chưa cập nhật, gửi email hỗ trợ kèm mã giao dịch để được kiểm tra.")],
    [tx("supportPage.faqs.accountQuestion", "Tôi quên mật khẩu hoặc không vào được tài khoản?"), tx("supportPage.faqs.accountAnswer", "Dùng chức năng Quên mật khẩu tại trang đăng nhập. Nếu đăng nhập qua Google hoặc Facebook, hãy tiếp tục dùng đúng phương thức đó.")],
  ];
  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  const handleSendSupportEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setSendStatus(null);
    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "user",
        },
        body: JSON.stringify({
          category: contactCategory,
          subject: contactSubject,
          message: contactMessage,
          senderName: user?.name ?? "",
          senderEmail: user?.email ?? "",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || tx("supportPage.sendError", "Không gửi được email. Vui lòng thử lại."));
      setSendStatus({
        type: "success",
        message: result.emailSent
          ? tx("supportPage.sendSuccess", "Đã gửi yêu cầu tới đội ngũ hỗ trợ. Cảm ơn bạn!")
          : tx("supportPage.sendQueued", "Yêu cầu đã được ghi nhận và admin đã nhận thông báo. Email có thể chưa gửi được, bạn vẫn theo dõi trạng thái tại Thư đã gửi."),
      });
      setContactSubject("");
      setContactMessage("");
    } catch (error) {
      setSendStatus({ type: "error", message: error instanceof Error ? error.message : tx("supportPage.sendError", "Không gửi được email. Vui lòng thử lại.") });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      <DashboardHeader navItems={navItems} activePath="/support" role="user" onLogout={handleLogout} />
      <div className="fixed right-6 top-20 z-40 group/supportfaq">
        <button
          type="button"
          aria-label={tx("supportPage.faqTitle", "Câu hỏi thường gặp")}
          aria-expanded={faqOpen}
          onClick={() => setFaqOpen((open) => !open)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/90 text-primary shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary/60 hover:bg-primary/10"
        >
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75 group-hover/supportfaq:opacity-100" />
          <CircleHelp className="relative h-6 w-6" />
        </button>
        <div className={`absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border bg-card/95 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 ${faqOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0 group-hover/supportfaq:pointer-events-auto group-hover/supportfaq:translate-y-0 group-hover/supportfaq:opacity-100 group-focus-within/supportfaq:pointer-events-auto group-focus-within/supportfaq:translate-y-0 group-focus-within/supportfaq:opacity-100"}`}>
          <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 via-card to-indigo-500/10 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-black text-foreground"><CircleHelp className="h-4 w-4 text-primary" />{tx("supportPage.faqTitle", "Câu hỏi thường gặp (FAQ)")}</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{tx("supportPage.faqSubtitle", "Một vài câu trả lời nhanh để bạn bắt đầu.")}</p>
              </div>
              <button type="button" onClick={() => setFaqOpen(false)} aria-label={tx("supportPage.closeFaq", "Đóng câu hỏi thường gặp")} className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="max-h-[60vh] divide-y divide-border/40 overflow-y-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="px-5 py-3.5 transition-colors hover:bg-muted/30">
                <p className="mb-1 flex items-start gap-1.5 text-xs font-bold text-foreground"><span className="mt-0.5 text-primary">•</span>{faq[0]}</p>
                <p className="pl-3 text-[11px] font-normal leading-relaxed text-muted-foreground">{faq[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="pt-4">
          <aside className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 text-slate-900 shadow-sm sm:p-9">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><MessageCircle className="h-5 w-5" /></span>
            <h2 className="text-xl font-bold">{tx("supportPage.contactTitle", "Bạn cần hỗ trợ gì?")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tx("supportPage.contactSubtitle", "Mô tả sự cố hoặc gửi góp ý, đội ngũ hỗ trợ sẽ phản hồi.")}</p>
            <form onSubmit={handleSendSupportEmail} className="mt-5 space-y-3">
              <p className="flex items-center gap-2 text-xs text-slate-600"><Mail className="h-4 w-4 text-emerald-600" />{tx("supportPage.sendTo", "Gửi tới")}: <strong className="text-slate-900">{CONTACT_EMAIL}</strong></p>
              <label className="block text-xs font-medium text-slate-700">
                {tx("supportPage.categoryLabel", "Loại yêu cầu")}
                <select value={contactCategory} onChange={(event) => setContactCategory(event.target.value)} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                  <option>Sự cố kỹ thuật</option><option>Đóng góp ý kiến</option><option>Tài khoản</option><option>Thanh toán</option><option>Khác</option>
                </select>
              </label>
              <label className="block text-xs font-medium text-slate-700">
                {tx("supportPage.subjectLabel", "Tiêu đề")}
                <input required minLength={3} maxLength={160} value={contactSubject} onChange={(event) => setContactSubject(event.target.value)} placeholder={tx("supportPage.subjectPlaceholder", "Ví dụ: Không tải được CV") } className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                {tx("supportPage.messageLabel", "Nội dung")}
                <textarea required minLength={10} maxLength={8000} rows={7} value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} placeholder={tx("supportPage.messagePlaceholder", "Mô tả sự cố hoặc ý kiến đóng góp của bạn...")} className="mt-1.5 w-full resize-y rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
              </label>
              {sendStatus && <p role={sendStatus.type === "error" ? "alert" : "status"} className={`rounded-xl px-3 py-2 text-sm ${sendStatus.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>{sendStatus.message}</p>}
              <button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">
                <Send className="h-4 w-4" />{sending ? tx("supportPage.sending", "Đang gửi...") : tx("supportPage.sendButton", "Gửi email hỗ trợ")}
              </button>
              <button type="button" onClick={() => window.location.assign("/support/sent")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
                <MailCheck className="h-4 w-4" />{tx("supportPage.sentButton", "Thư đã gửi")}
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-500">{tx("supportPage.replyTime", "Email tài khoản của bạn sẽ được đính kèm để đội ngũ hỗ trợ phản hồi.")}</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
