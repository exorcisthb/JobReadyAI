import { BrandLogo } from "@/components/BrandLogo";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Share2,
  RefreshCw,
  Mail,
  ArrowLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { SharedHeader } from "@/components/shared-header";
import { ScrollReveal } from "@/components/scroll-reveal";


function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <BrandLogo size={32} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Giải pháp tối ưu hóa CV và luyện phỏng vấn trực tuyến với trí tuệ nhân tạo đột phá.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Khám phá
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="/#about" className="hover:text-primary transition-colors duration-200">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-primary transition-colors duration-200">
                  Tính năng
                </a>
              </li>
              <li>
                <a href="/#how" className="hover:text-primary transition-colors duration-200">
                  Cách hoạt động
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Chính sách
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="/chinh-sach" className="hover:text-primary transition-colors duration-200 text-primary font-medium">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/chinh-sach#terms" className="hover:text-primary transition-colors duration-200">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Kết nối
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">Email:</span> jobreadya@gmail.com
              </li>
              <li>
                <span className="text-foreground">Hotline:</span> 1900 1234
              </li>
              <li>
                <span className="text-foreground">Địa chỉ:</span> Hà Nội, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 JobReadyAI. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  // Detect where the user came from via ?from= query param
  const fromParam = new URLSearchParams(window.location.search).get("from");
  const isFromAuth = fromParam === "login" || fromParam === "register";
  const backHref =
    fromParam === "login"
      ? "/authentication/login"
      : fromParam === "register"
        ? "/authentication/register"
        : "/";
  const backLabel =
    fromParam === "login"
      ? "Quay lại Đăng nhập"
      : fromParam === "register"
        ? "Quay lại Đăng ký"
        : "Quay lại Trang chủ";

  const sections = [
    { id: "overview", title: "1. Tổng quan & Giới thiệu", icon: ShieldCheck },
    { id: "data-collection", title: "2. Thu thập thông tin", icon: Eye },
    { id: "data-usage", title: "3. Sử dụng thông tin", icon: FileText },
    { id: "data-security", title: "4. Bảo mật dữ liệu", icon: Lock },
    { id: "data-sharing", title: "5. Chia sẻ thông tin", icon: Share2 },
    { id: "user-rights", title: "6. Quyền lợi người dùng", icon: UserCheck },
    { id: "updates", title: "7. Cập nhật chính sách", icon: RefreshCw },
    { id: "contact", title: "8. Thông tin liên hệ", icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = isFromAuth ? 24 : 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Full homepage header when accessed from nav */}
      {!isFromAuth && <SharedHeader activeNav="chinh-sach" />}

      {/* Minimal floating back button when accessed from login / register */}
      {isFromAuth && (
        <div className="sticky top-4 z-50 px-6 pt-4 pb-2 flex items-center">
          <a
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] backdrop-blur-md transition-all duration-300 hover:bg-secondary hover:shadow-[var(--shadow-elegant)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </a>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Điều khoản & Pháp lý
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              Chính sách Bảo mật
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Cam kết bảo vệ thông tin cá nhân và dữ liệu riêng tư của bạn khi đồng hành cùng JobReady AI trên con đường chinh phục sự nghiệp.
            </p>
            <div className="mt-4 text-xs text-muted-foreground/80">
              Cập nhật lần cuối: Ngày 28 tháng 5 năm 2026
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Side Navigation */}
          <aside className="lg:col-span-4 sticky top-28 bg-card/60 border border-border/80 rounded-3xl p-5 shadow-[var(--shadow-soft)] backdrop-blur-md hidden lg:block">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider px-3 mb-4">
              Mục lục chính sách
            </h3>
            <nav className="space-y-1.5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] scale-[1.02]"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    <span>{sec.title}</span>
                    {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary-foreground animate-pulse" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Policy content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview Section */}
            <ScrollReveal>
              <section id="overview" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">1. Tổng quan & Giới thiệu</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>
                    Chào mừng bạn đến với <strong>JobReady AI</strong>. Chúng tôi cực kỳ coi trọng sự riêng tư và bảo mật thông tin cá nhân của bạn.
                  </p>
                  <p>
                    Chính sách Bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ, và bảo vệ thông tin của bạn khi bạn sử dụng nền tảng JobReady AI (bao gồm trang web, công cụ tối ưu hóa CV và phòng luyện phỏng vấn giả lập AI).
                  </p>
                  <p>
                    Bằng việc truy cập hoặc sử dụng bất kỳ dịch vụ nào của chúng tôi, bạn đồng ý với các điều khoản được quy định trong chính sách này. Nếu bạn không đồng ý, vui lòng tạm dừng việc sử dụng các dịch vụ của JobReady AI.
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Data Collection */}
            <ScrollReveal>
              <section id="data-collection" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">2. Thu thập thông tin</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>Chúng tôi thu thập các loại thông tin sau nhằm cung cấp dịch vụ tốt nhất cho bạn:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Thông tin tài khoản:</strong> Tên, địa chỉ Email, số điện thoại, mật khẩu, và ảnh đại diện khi bạn đăng ký tài khoản.
                    </li>
                    <li>
                      <strong>Thông tin CV và Hồ sơ:</strong> Các nội dung, thông tin học vấn, kinh nghiệm làm việc, và kỹ năng mà bạn tải lên hoặc điền trực tiếp vào công cụ tối ưu hóa CV.
                    </li>
                    <li>
                      <strong>Thông tin phỏng vấn:</strong> Bản ghi âm, video (nếu bạn cho phép camera/micro), nội dung trả lời phỏng vấn trong quá trình luyện tập phỏng vấn giả lập với Trí tuệ nhân tạo (AI).
                    </li>
                    <li>
                      <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian truy cập, và các trang bạn đã xem trên hệ thống của chúng tôi.
                    </li>
                  </ul>
                </div>
              </section>
            </ScrollReveal>

            {/* Data Usage */}
            <ScrollReveal>
              <section id="data-usage" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">3. Sử dụng thông tin</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>Mọi thông tin thu thập được chỉ sử dụng cho các mục đích hợp pháp sau:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cung cấp và duy trì các tính năng tối ưu hóa CV và luyện phỏng vấn AI.</li>
                    <li>Gửi các báo cáo đánh giá, phân tích lỗi và đề xuất cải thiện kỹ năng cho bạn.</li>
                    <li>Nâng cấp thuật toán AI và cải thiện chất lượng dịch vụ tổng thể của hệ thống.</li>
                    <li>Thông báo về các thay đổi dịch vụ, cập nhật tính năng mới hoặc chính sách quan trọng.</li>
                    <li>Ngăn chặn các hoạt động gian lận, spam, hoặc phá hoại bảo mật hệ thống.</li>
                  </ul>
                </div>
              </section>
            </ScrollReveal>

            {/* Data Security */}
            <ScrollReveal>
              <section id="data-security" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">4. Bảo mật dữ liệu</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>
                    Bảo mật thông tin của bạn là ưu tiên hàng đầu của chúng tôi. JobReady AI áp dụng các biện pháp kỹ thuật và tổ chức nghiêm ngặt:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Mã hóa dữ liệu trong quá trình truyền tải (HTTPS/SSL) và mã hóa dữ liệu khi lưu trữ.</li>
                    <li>Hạn chế quyền truy cập thông tin cá nhân của người dùng chỉ cho nhân viên được ủy quyền cần thiết để vận hành và bảo trì hệ thống.</li>
                    <li>Các tập tin CV, ghi âm phỏng vấn đều được lưu trữ trên hệ thống đám mây có tường lửa bảo vệ cấp cao.</li>
                  </ul>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    * Lưu ý: Mặc dù chúng tôi nỗ lực tối đa, không có phương thức truyền tải qua Internet hoặc lưu trữ điện tử nào là bảo mật 100%. Vì vậy, chúng tôi khuyến cáo bạn tự bảo vệ mật khẩu tài khoản của mình một cách an toàn.
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Data Sharing */}
            <ScrollReveal>
              <section id="data-sharing" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">5. Chia sẻ thông tin</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>
                    JobReady AI cam kết <strong>KHÔNG BÁN, KHÔNG CHO THUÊ</strong> thông tin cá nhân của bạn cho bên thứ ba vì bất kỳ mục đích tiếp thị nào.
                  </p>
                  <p>Chúng tôi chỉ chia sẻ dữ liệu trong các trường hợp đặc biệt sau:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Nhà cung cấp dịch vụ phụ trợ:</strong> Chúng tôi có thể chia sẻ dữ liệu với các đối tác cung cấp dịch vụ lưu trữ đám mây hoặc API xử lý ngôn ngữ tự nhiên AI đáng tin cậy (như Google Cloud, OpenAI) để thực hiện tính năng dịch vụ.
                    </li>
                    <li>
                      <strong>Tuân thủ pháp luật:</strong> Khi có yêu cầu bằng văn bản chính thức từ các cơ quan pháp luật có thẩm quyền theo quy định của pháp luật Việt Nam.
                    </li>
                  </ul>
                </div>
              </section>
            </ScrollReveal>

            {/* User Rights */}
            <ScrollReveal>
              <section id="user-rights" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">6. Quyền lợi người dùng</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>Bạn hoàn toàn có đầy đủ các quyền kiểm soát dữ liệu cá nhân của mình:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Quyền truy cập & chỉnh sửa:</strong> Bạn có thể kiểm tra, cập nhật hoặc thay đổi thông tin cá nhân, CV và hồ sơ trực tiếp trong phần Cài đặt tài khoản của mình.</li>
                    <li><strong>Quyền yêu cầu xóa dữ liệu:</strong> Bạn có quyền yêu cầu xóa vĩnh viễn tài khoản và các dữ liệu liên quan khỏi hệ thống của chúng tôi bất kỳ lúc nào bằng cách liên hệ với bộ phận hỗ trợ.</li>
                    <li><strong>Quyền từ chối nhận email tiếp thị:</strong> Bạn có thể hủy đăng ký nhận các tin nhắn quảng bá thông qua liên kết hủy đăng ký ở cuối mỗi email chúng tôi gửi.</li>
                  </ul>
                </div>
              </section>
            </ScrollReveal>

            {/* Updates */}
            <ScrollReveal>
              <section id="updates" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">7. Cập nhật chính sách</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>
                    Chúng tôi có thể cập nhật Chính sách Bảo mật này định kỳ để phản ánh các thay đổi trong dịch vụ hoặc các quy định mới của pháp luật.
                  </p>
                  <p>
                    Mọi thay đổi lớn sẽ được thông báo rõ ràng trên trang chủ hoặc gửi trực tiếp qua email của bạn trước khi chính sách mới có hiệu lực. Chúng tôi khuyến khích bạn thường xuyên truy cập trang này để nắm bắt thông tin mới nhất.
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Contact */}
            <ScrollReveal>
              <section id="contact" className="bg-card/45 border border-border/60 rounded-3xl p-6 md:p-8 shadow-[var(--shadow-soft)] hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">8. Thông tin liên hệ</h2>
                </div>
                <div className="prose prose-neutral dark:prose-invert space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  <p>
                    Nếu bạn có bất kỳ câu hỏi, phản hồi hoặc yêu cầu liên quan đến Chính sách Bảo mật này hoặc cách chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ với chúng tôi:
                  </p>
                  <div className="bg-secondary/40 border border-border/60 rounded-2xl p-4 md:p-5 space-y-2 text-sm">
                    <p><strong>Cơ quan vận hành:</strong> Ban Quản trị JobReady AI Team</p>
                    <p><strong>Email hỗ trợ:</strong> <a href="mailto:jobreadya@gmail.com" className="text-primary hover:underline font-medium">jobreadya@gmail.com</a></p>
                    <p><strong>Hotline khẩn cấp:</strong> 1900 1234</p>
                    <p><strong>Văn phòng:</strong> Hà Nội, Việt Nam</p>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
