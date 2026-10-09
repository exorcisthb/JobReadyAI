import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, BookOpen, Briefcase, ChevronDown, CircleHelp, FileText,
  CreditCard, Headset, Mail, MessageCircle, Search, ShieldCheck, Sparkles, Users,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useAuth } from "@/components/auth-provider";

const CONTACT_EMAIL = "jobreadya@gmail.com";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent("Yêu cầu hỗ trợ JobReady AI")}&body=${encodeURIComponent("Xin chào đội ngũ JobReady AI,\n\nMô tả vấn đề tôi gặp phải:\n\nEmail tài khoản JobReady AI:\n\nCác bước để gặp lỗi:\n\n")}`;

export default function SupportPage() {
  const { t } = useTranslation();
  const tx = (key: string, fallback: string) => t(key, { defaultValue: fallback });
  const { logout } = useAuth();
  const navItems = useUserNavItems();
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    { icon: FileText, title: tx("supportPage.categories.cv", "Tạo và chỉnh sửa CV"), description: tx("supportPage.categories.cvDesc", "Mẫu CV, lưu nháp, xuất file và bố cục nội dung."), query: tx("supportPage.categories.cv", "Tạo và chỉnh sửa CV") },
    { icon: Sparkles, title: tx("supportPage.categories.interview", "Phỏng vấn AI"), description: tx("supportPage.categories.interviewDesc", "Chọn vị trí, bắt đầu buổi phỏng vấn và xem kết quả."), query: tx("supportPage.categories.interview", "Phỏng vấn AI") },
    { icon: ShieldCheck, title: tx("supportPage.categories.account", "Tài khoản và bảo mật"), description: tx("supportPage.categories.accountDesc", "Đăng nhập, hồ sơ cá nhân và bảo vệ tài khoản."), query: tx("supportPage.categories.account", "Tài khoản và bảo mật") },
    { icon: CreditCard, title: tx("supportPage.categories.payment", "Gói dịch vụ và thanh toán"), description: tx("supportPage.categories.paymentDesc", "Nâng cấp, thanh toán và trạng thái gói dịch vụ."), query: tx("supportPage.categories.payment", "Gói dịch vụ và thanh toán") },
    { icon: Users, title: tx("supportPage.categories.community", "Nhóm và cộng đồng"), description: tx("supportPage.categories.communityDesc", "Tham gia nhóm, bài viết và trao đổi cùng cộng đồng."), query: tx("supportPage.categories.community", "Nhóm và cộng đồng") },
    { icon: Briefcase, title: tx("supportPage.categories.technical", "Sự cố kỹ thuật"), description: tx("supportPage.categories.technicalDesc", "Lỗi trang, tính năng không phản hồi hoặc vấn đề tải dữ liệu."), query: tx("supportPage.categories.technical", "Sự cố kỹ thuật") },
  ];
  const faqs = [
    [tx("supportPage.faqs.saveQuestion", "CV của tôi được lưu ở đâu?"), tx("supportPage.faqs.saveAnswer", "CV đang chỉnh sửa được lưu trong mục CV nháp. Hãy đăng nhập đúng tài khoản để tiếp tục chỉnh sửa hoặc mở lại CV.")],
    [tx("supportPage.faqs.interviewQuestion", "Tôi không thể bắt đầu hoặc tiếp tục phỏng vấn AI?"), tx("supportPage.faqs.interviewAnswer", "Kiểm tra kết nối mạng, cho phép trình duyệt sử dụng micro và tải lại trang. Nếu vẫn gặp lỗi, hãy gửi email kèm thời điểm xảy ra và ảnh chụp thông báo lỗi.")],
    [tx("supportPage.faqs.paymentQuestion", "Tôi đã thanh toán nhưng gói dịch vụ chưa cập nhật?"), tx("supportPage.faqs.paymentAnswer", "Hãy kiểm tra lại trạng thái giao dịch và đăng nhập đúng tài khoản đã mua gói. Nếu gói chưa cập nhật, gửi email hỗ trợ kèm mã giao dịch để được kiểm tra.")],
    [tx("supportPage.faqs.accountQuestion", "Tôi quên mật khẩu hoặc không vào được tài khoản?"), tx("supportPage.faqs.accountAnswer", "Dùng chức năng Quên mật khẩu tại trang đăng nhập. Nếu đăng nhập qua Google hoặc Facebook, hãy tiếp tục dùng đúng phương thức đó.")],
  ];
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredCategories = categories.filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase().includes(normalizedQuery));
  const filteredFaqs = faqs
    .map((faq, index) => ({ faq, index }))
    .filter(({ faq }) => !normalizedQuery || faq.join(" ").toLocaleLowerCase().includes(normalizedQuery));

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      <DashboardHeader navItems={navItems} activePath="/support" role="user" onLogout={handleLogout} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-6 py-10 text-center shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Headset className="h-7 w-7" /></span>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{tx("supportPage.eyebrow", "JobReady AI · Trung tâm trợ giúp")}</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{tx("supportPage.title", "Chúng tôi có thể giúp gì cho bạn?")}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{tx("supportPage.subtitle", "Tìm hướng dẫn cho CV, phỏng vấn AI, tài khoản và các tính năng khác của JobReady AI.")}</p>
            <label className="mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-md shadow-slate-900/5 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-blue-950">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tx("supportPage.searchPlaceholder", "Tìm kiếm vấn đề hoặc câu hỏi...")} className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
            </label>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><h2 className="text-xl font-bold text-slate-900 dark:text-white">{tx("supportPage.categoriesTitle", "Duyệt theo chủ đề")}</h2><p className="mt-1 text-sm text-muted-foreground">{tx("supportPage.categoriesSubtitle", "Chọn một chủ đề để tìm hướng dẫn phù hợp.")}</p></div>
            <BookOpen className="hidden h-6 w-6 text-blue-500 sm:block" />
          </div>
          {filteredCategories.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map(({ icon: Icon, title, description, query: categoryQuery }) => (
              <button data-square-button="true" key={title} onClick={() => setQuery(categoryQuery)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950"><Icon className="h-5 w-5" /></span>
                <span className="flex items-center justify-between gap-2 font-semibold text-slate-900 dark:text-white">{title}<ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" /></span>
                <span className="mt-2 block text-sm leading-5 text-muted-foreground">{description}</span>
              </button>
            ))}
          </div> : <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{tx("supportPage.noResults", "Không tìm thấy nội dung phù hợp. Hãy thử từ khóa khác hoặc gửi email cho chúng tôi.")}</p>}
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950"><CircleHelp className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">{tx("supportPage.faqTitle", "Câu hỏi thường gặp")}</h2><p className="text-sm text-muted-foreground">{tx("supportPage.faqSubtitle", "Một vài câu trả lời nhanh để bạn bắt đầu.")}</p></div></div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFaqs.map(({ faq, index }) => <div key={faq[0]}>
                <button className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-800 dark:text-slate-100" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                  {faq[0]}<ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && <p className="pb-4 pr-8 text-sm leading-6 text-muted-foreground">{faq[1]}</p>}
              </div>)}
              {!filteredFaqs.length && <p className="py-6 text-sm text-muted-foreground">{tx("supportPage.noResults", "Không tìm thấy nội dung phù hợp. Hãy thử từ khóa khác hoặc gửi email cho chúng tôi.")}</p>}
            </div>
          </section>

          <aside className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg dark:bg-slate-800">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><MessageCircle className="h-5 w-5" /></span>
            <h2 className="text-xl font-bold">{tx("supportPage.contactTitle", "Bạn vẫn cần trợ giúp?")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{tx("supportPage.contactSubtitle", "Gửi mô tả vấn đề và ảnh chụp màn hình (nếu có). Đội ngũ hỗ trợ sẽ giúp bạn.")}</p>
            <a href={GMAIL_COMPOSE_URL} target="_blank" rel="noreferrer" aria-label={tx("supportPage.openGmail", "Mở Gmail để soạn email hỗ trợ")} className="mt-6 flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10">
              <Mail className="h-5 w-5 shrink-0 text-cyan-300" />
              <span className="min-w-0"><span className="block text-xs text-slate-400">{tx("supportPage.emailLabel", "Email hỗ trợ")}</span><span className="break-all text-sm font-semibold">{CONTACT_EMAIL}</span></span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
            </a>
            <p className="mt-3 text-xs text-slate-400">{tx("supportPage.replyTime", "Vui lòng gửi kèm email tài khoản và các bước gây ra lỗi để chúng tôi hỗ trợ nhanh hơn.")}</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
