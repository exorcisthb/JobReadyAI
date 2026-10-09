const fs = require('fs');
const path = require('path');

const entryQuestionCounts = new Map();

function q(id, role, category, difficulty, seniority, question, evaluationCriteria, followUps, tags, sourceRefs, redFlags) {
  const questionData = {
    id, role, category, difficulty, seniority, question, evaluationCriteria, followUps, tags, sourceRefs, redFlags
  };

  const counterKey = `${role}:${category}`;
  const index = entryQuestionCounts.get(counterKey) || 0;
  entryQuestionCounts.set(counterKey, index + 1);

  const tag = (position) => tags?.[position] || role;
  const topicDetails = (count = 4) => (tags || []).slice(1, count).join(", ") || role;
  const group = /security|penetration|pentest|soc analyst|red team|appsec|grc|threat|incident/i.test(role)
    ? "cybersecurity"
    : /data|machine learning|ai \/|nlp|computer vision|business intelligence|mlops|analytics/i.test(role)
    ? "dataAI"
    : /tester|testing|qa engineer|qc specialist|sdet/i.test(role)
    ? "testingQA"
    : /designer|design system|ux researcher/i.test(role)
    ? "productUX"
    : "webMobile";

  const scenarioContext = {
    cybersecurity: "em bắt gặp cảnh báo đáng ngờ trong môi trường thực hành được cấp phép",
    dataAI: "bộ dữ liệu có giá trị thiếu hoặc kết quả phân tích bất thường",
    testingQA: "kết quả kiểm thử thay đổi giữa các lần chạy",
    productUX: "người tham gia thử nghiệm không hoàn thành được tác vụ chính",
    webMobile: "thay đổi giao diện hoặc API tạo ra kết quả sai",
  }[group];

  if (category === "foundation" && index === 0) {
    questionData.seniority = "fresher_intern";
    questionData.difficulty = "basic";
    questionData.question = `Trong ${role}, phân biệt ${(tags || []).slice(0, 4).join(", ")}; mô tả khi nào em áp dụng chúng trong bài tập.`;
    questionData.evaluationCriteria = [
      `Giải thích đúng ý nghĩa cơ bản của ${tag(0)}.`,
      `Phân biệt được các khái niệm liên quan ${topicDetails(4)} ở mức nhập môn.`,
      `Đưa ra được ví dụ học tập phù hợp với vị trí ${role}.`,
    ];
    questionData.followUps = [`Nếu mới học ${tag(0)}, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?`];
    questionData.redFlags = ["Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."];
  } else if (category === "practical_skills" && index < 2) {
    questionData.seniority = "fresher_intern";
    questionData.difficulty = index === 0 ? "basic" : "intermediate";
    questionData.question = index === 0
      ? `Mô phỏng ${tag(0)} (${topicDetails(5)}) cho ${role}: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?`
      : `Bài tập ${role}: dựa trên ${tag(0)}, phối hợp ${topicDetails(5)}; đầu ra sẽ được kiểm tra bằng tiêu chí nào?`;
    questionData.evaluationCriteria = [
      `Nêu mục đích sử dụng ${tag(0)} trong một bài tập hoặc dự án nhỏ.`,
      `Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.`,
      `Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn.`,
    ];
    questionData.followUps = [`Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?`];
    questionData.redFlags = ["Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."];
  } else if (category === "scenario" && index === 0) {
    questionData.seniority = "fresher_intern";
    questionData.difficulty = "intermediate";
    questionData.question = `Tại ${role}, khi ${tag(0)} cùng ${topicDetails(5)} xuất hiện và ${scenarioContext}, em kiểm tra log hay dữ liệu nào trước?`;
    questionData.evaluationCriteria = [
      "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
      `Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong ${role}.`,
      "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết.",
    ];
    questionData.followUps = ["Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"];
    questionData.redFlags = ["Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."];
  }

  return questionData;
}

const SRC = {
  mdn: "https://developer.mozilla.org/en-US/docs/Web",
  react: "https://react.dev",
  next: "https://nextjs.org/docs",
  node: "https://nodejs.org/docs",
  ts: "https://www.typescriptlang.org/docs",
  flutter: "https://docs.flutter.dev",
  apple: "https://developer.apple.com/documentation",
  android: "https://developer.android.com/guide",
  vue: "https://vuejs.org/guide",
  angular: "https://angular.dev",
  rn: "https://reactnative.dev/docs",
  webperf: "https://web.dev/explore/fast",
  owasp: "https://owasp.org/Top10",
  internal: "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
};

// 1. FRONTEND DEVELOPER
const feQuestions = [
  // Foundation (6)
  q("FE-FOUND-01", "Frontend Developer", "foundation", "basic", "junior",
    "Giải thích cơ chế Virtual DOM trong React. Quá trình Reconciliation và thuật toán Diffing diễn ra như thế nào để giảm thiểu thao tác trên Real DOM?",
    ["Hiểu bản chất Virtual DOM là JavaScript Object đại diện cho DOM tree", "Nắm rõ thuật toán Diffing theo cấu trúc cây (O(n))", "Giải thích cơ chế batching cập nhật state giúp tránh layout thrashing"],
    ["Tại sao việc dùng index làm key trong danh sách có thể làm sai lệch state của component con?", "React Fiber giải quyết bài toán non-blocking render như thế nào?"],
    ["Virtual DOM", "React", "Reconciliation", "Diffing"],
    [SRC.react, "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path"],
    ["Cho rằng Virtual DOM luôn nhanh hơn thao tác DOM thuần trong mọi tình huống"]
  ),
  q("FE-FOUND-02", "Frontend Developer", "foundation", "intermediate", "middle",
    "Phân biệt sâu sắc giữa Server-Side Rendering (SSR), Static Site Generation (SSG), Client-Side Rendering (CSR) và Incremental Static Regeneration (ISR). Tiêu chuẩn nào quyết định lựa chọn kiến trúc render?",
    ["Phân tích được trade-off giữa Time to First Byte (TTFB) và First Contentful Paint (FCP)", "Nêu rõ ảnh hưởng của từng mô hình render đối với SEO và chỉ số Core Web Vitals", "Đưa ra use-case chuẩn xác: Dashboard (CSR), Báo chí/Blog (SSG), E-commerce biến động giá (SSR/ISR)"],
    ["Hydration mismatch trong Next.js xảy ra do nguyên nhân nào và cách khắc phục?", "Streaming SSR với React Server Components hoạt động ra sao?"],
    ["SSR", "SSG", "CSR", "ISR", "Next.js"],
    [SRC.next, SRC.webperf],
    ["Mặc định cho rằng SSR là phương pháp tối ưu cho mọi loại trang web"]
  ),
  q("FE-FOUND-03", "Frontend Developer", "foundation", "basic", "junior",
    "CSS Box Model hoạt động như thế nào? Sự khác biệt giữa content-box và border-box là gì, và tại sao reset CSS hầu như luôn gán box-sizing: border-box?",
    ["Trình bày chính xác 4 lớp: content, padding, border, margin", "Cách tính toán width/height thực tế của phần tử trong từng chế độ box-sizing", "Hiểu hiện tượng margin collapsing và các điều kiện xảy ra"],
    ["Block Formatting Context (BFC) là gì và làm thế nào để tạo ra một BFC?", "Thuộc tính margin âm (negative margin) hoạt động như thế nào trong layout?"],
    ["CSS", "Box Model", "Layout", "BFC"],
    ["https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model"],
    ["Nhầm lẫn giữa padding và margin khi tính toán kích thước tổng"]
  ),
  q("FE-FOUND-04", "Frontend Developer", "foundation", "intermediate", "middle",
    "Trình duyệt thực thi Critical Rendering Path (CRP) từ lúc nhận file HTML đến khi hiển thị pixel lên màn hình qua những bước nào? Kỹ thuật nào giúp giảm render-blocking resources?",
    ["Trình bày đủ 6 bước: HTML parse -> DOM, CSS parse -> CSSOM, Render Tree, Layout/Reflow, Paint, Composite", "Chỉ rõ vai trò của parser-blocking script và render-blocking stylesheet", "Phân biệt thuộc tính async và defer trong thẻ script"],
    ["Thuộc tính CSS nào kích hoạt GPU compositing mà không gây reflow/repaint?", "Làm thế nào để tối ưu chỉ số LCP dựa trên hiểu biết về CRP?"],
    ["Critical Rendering Path", "Browser Internals", "Web Performance", "Reflow"],
    ["https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path"],
    ["Nghĩ rằng JavaScript chỉ chạy sau khi toàn bộ giao diện đã hoàn thành paint"]
  ),
  q("FE-FOUND-05", "Frontend Developer", "foundation", "basic", "junior",
    "Giải thích cơ chế Closure và Lexical Scope trong JavaScript. Nêu ví dụ thực tế em đã ứng dụng Closure và cách phòng tránh rò rỉ bộ nhớ (memory leak)?",
    ["Định nghĩa chuẩn: hàm ghi nhớ phạm vi bao bọc nó ngay cả khi thực thi ngoài phạm vi đó", "Lấy ví dụ ứng dụng thực tế: debounce/throttle, function factory hoặc private variables", "Chỉ ra nguyên nhân rò rỉ bộ nhớ do giữ tham chiếu DOM hoặc interval không được dọn dẹp"],
    ["V8 Garbage Collector thu hồi bộ nhớ của Closure dựa trên nguyên lý nào?", "Scope Chain khác gì với Prototype Chain?"],
    ["JavaScript", "Closure", "Scope", "Memory Management"],
    ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"],
    ["Nhầm lẫn Closure với Callback thông thường"]
  ),
  q("FE-FOUND-06", "Frontend Developer", "foundation", "intermediate", "middle",
    "Accessibility (a11y) theo tiêu chuẩn WCAG yêu cầu những yếu tố cốt lõi nào? Làm thế nào để một Modal dialog hỗ trợ hoàn hảo người dùng bàn phím và Screen Reader?",
    ["Hiểu các nguyên tắc WCAG (Perceivable, Operable, Understandable, Robust)", "Xử lý Focus Trapping bên trong modal khi mở và trả lại focus khi đóng", "Sử dụng đúng ARIA attributes (role='dialog', aria-modal='true', aria-labelledby) và hỗ trợ phím Escape"],
    ["Khi nào nên dùng HTML5 Semantic elements thay vì lạm dụng ARIA roles?", "Làm thế nào để kiểm thử tự động accessibility trong pipeline CI/CD?"],
    ["Accessibility", "WCAG", "ARIA", "Focus Trap"],
    ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
    ["Xem nhẹ accessibility, chỉ bọc các phần tử bằng thẻ div không ngữ nghĩa"]
  ),

  // Practical Skills (8)
  q("FE-SKILL-01", "Frontend Developer", "practical_skills", "intermediate", "middle",
    "Làm thế nào để nhận diện và loại bỏ re-render không cần thiết trong React? Em sử dụng React.memo, useMemo và useCallback trong trường hợp cụ thể nào?",
    ["Biết dùng React DevTools Profiler để đo render duration và commit phase", "Phân biệt được chi phí tính toán so với chi phí shallow prop comparison", "Hiểu rằng useCallback chỉ phát huy tác dụng khi truyền xuống component con đã được memoize"],
    ["Tại sao việc lạm dụng useCallback bừa bãi có thể làm ứng dụng chạy chậm hơn?", "React 19 Compiler giải quyết vấn đề memoization tự động như thế nào?"],
    ["React", "useCallback", "useMemo", "React.memo", "Profiler"],
    [SRC.react],
    ["Bọc mọi hàm và biến trong useCallback/useMemo một cách máy móc không có căn cứ"]
  ),
  q("FE-SKILL-02", "Frontend Developer", "practical_skills", "intermediate", "middle",
    "Em quản lý Server State và Client State như thế nào? Tại sao xu hướng hiện nay tách biệt React Query/TanStack Query cho server cache và Zustand/Jotai cho UI state?",
    ["Phân định rạch ròi giữa Server Cache (caching, deduplication, invalidation, stale-while-revalidate) và UI State", "Nêu bật lợi ích của TanStack Query trong việc giảm boilerplate code so với Redux", "Lý giải sự gọn nhẹ, dễ kiểm thử của Zustand cho UI state toàn cục"],
    ["Làm thế nào để xử lý race condition khi nhiều request tìm kiếm được gửi liên tục?", "Chiến lược Optimistic Updates hoạt động ra sao khi rollback nếu API báo lỗi?"],
    ["React Query", "Zustand", "State Management", "Server State"],
    ["https://tanstack.com/query/latest"],
    ["Lưu toàn bộ dữ liệu gọi từ API vào global Redux store mà không có cơ chế invalidate/cache rõ ràng"]
  ),
  q("FE-SKILL-03", "Frontend Developer", "practical_skills", "advanced", "senior_lead",
    "Khi hiển thị danh sách lớn (10.000+ bản ghi), em áp dụng kỹ thuật Windowing / Virtual List như thế nào? Cách xử lý các item có chiều cao động (dynamic height)?",
    ["Hiểu nguyên lý chỉ render các DOM node nằm trong khung nhìn (viewport) kèm overscan", "Sử dụng thư viện như @tanstack/react-virtual hoặc react-window", "Xử lý đo đạc kích thước động qua ResizeObserver và duy trì vị trí cuộn (scroll restoration)"],
    ["Làm sao để tính năng tìm kiếm Ctrl+F hoặc Screen Reader hoạt động tốt với Virtual List?", "Intersection Observer API hỗ trợ gì cho infinite scrolling?"],
    ["Virtual List", "DOM Optimization", "ResizeObserver", "Performance"],
    ["https://tanstack.com/virtual/latest"],
    ["Đề xuất render toàn bộ 10.000 phần tử vào DOM rồi ẩn đi bằng CSS"]
  ),
  q("FE-SKILL-04", "Frontend Developer", "practical_skills", "intermediate", "middle",
    "Quy trình xây dựng Design System hoặc Component Library dùng chung trong dự án của em gồm những bước nào? Cách cấu trúc Design Tokens và Compound Components?",
    ["Xác định hệ thống Design Tokens (màu sắc, typography, spacing, elevation)", "Áp dụng Compound Component pattern để linh hoạt tùy biến giao diện", "Tài liệu hóa bằng Storybook, viết unit test với Testing Library và visual regression test"],
    ["Làm thế nào để quản lý SemVer và breaking changes khi cập nhật component cho nhiều dự án?", "Cách xử lý override style mà không phá vỡ tính đóng gói của component?"],
    ["Design System", "Storybook", "Component Pattern", "Design Tokens"],
    ["https://storybook.js.org/docs"],
    ["Hardcode mã màu hoặc kích thước trực tiếp trong component thay vì dùng tokens"]
  ),
  q("FE-SKILL-05", "Frontend Developer", "practical_skills", "advanced", "senior_lead",
    "Em xử lý Authentication và lưu trữ Token (Access Token & Refresh Token) ở Frontend như thế nào để vừa an toàn trước XSS vừa phòng chống CSRF?",
    ["Phân tích rủi ro khi lưu token trong LocalStorage (dễ bị tấn công XSS đánh cắp)", "Đề xuất lưu Refresh Token trong HttpOnly SameSite Cookie, Access Token trong memory", "Thiết lập Axios/Fetch Interceptor tự động bắt mã lỗi 401, gọi refresh token và replay lại request"],
    ["Nếu 5 API đồng thời trả về lỗi 401 cùng lúc, làm sao để chỉ gọi refresh token đúng 1 lần duy nhất?", "Cơ chế PKCE trong OAuth2 dành cho Single Page Apps hoạt động như thế nào?"],
    ["Authentication", "Security", "XSS", "CSRF", "Axios Interceptor"],
    [SRC.owasp],
    ["Lưu Access Token và Refresh Token lâu dài vào LocalStorage mà không nhận thức rủi ro XSS"]
  ),
  q("FE-SKILL-06", "Frontend Developer", "practical_skills", "intermediate", "middle",
    "Chiến lược phân tích và tối ưu Bundle Size trong dự án web hiện đại của em là gì? Em sử dụng công cụ nào và áp dụng Code Splitting ra sao?",
    ["Dùng Webpack Bundle Analyzer hoặc Rollup Visualizer để phát hiện package phình to", "Áp dụng Route-based Code Splitting (React.lazy, Suspense, Dynamic Import)", "Tree-shaking hiệu quả với ES Modules, thay thế các thư viện cồng kềnh (vd: Lodash/Moment bằng date-fns)"],
    ["Tại sao cú pháp CommonJS (require) cản trở Tree-shaking?", "Modern image formats (AVIF, WebP) và responsive srcset đóng góp gì cho FCP?"],
    ["Bundle Size", "Code Splitting", "Tree Shaking", "Vite", "Webpack"],
    [SRC.webperf],
    ["Import toàn bộ thư viện lớn chỉ để sử dụng một hàm tiện ích đơn giản"]
  ),
  q("FE-SKILL-07", "Frontend Developer", "practical_skills", "intermediate", "middle",
    "Em thiết lập chiến lược kiểm thử (Testing Strategy) cho Frontend như thế nào? Sự khác biệt về vai trò giữa Unit Test, Component Integration Test và End-to-End (E2E) Test?",
    ["Tuân thủ Testing Trophy: ưu tiên Integration Test với React Testing Library theo hành vi người dùng", "Unit test cho helper, utility functions, custom hooks cô lập", "E2E test với Playwright/Cypress cho các luồng nghiệp vụ quan trọng (Checkout, Login)"],
    ["Làm thế nào để mock API gọi từ server bằng MSW (Mock Service Worker)?", "Khi nào nên viết Snapshot testing và rủi ro của việc lạm dụng snapshot?"],
    ["Testing", "React Testing Library", "Playwright", "MSW"],
    ["https://testing-library.com/docs/react-testing-library/intro/"],
    ["Kiểm thử bằng cách assert state nội bộ của component thay vì kiểm tra giao diện hiển thị cho người dùng"]
  ),
  q("FE-SKILL-08", "Frontend Developer", "practical_skills", "intermediate", "middle",
    "Khi xây dựng tính năng real-time (như chat hoặc thông báo) bằng WebSocket hoặc Server-Sent Events (SSE), em quản lý kết nối, heartbeat và reconnection ra sao?",
    ["Phân biệt được use-case của SSE (một chiều từ server) và WebSocket (hai chiều)", "Cơ chế Exponential Backoff algorithm khi tái kết nối", "Quản lý đóng kết nối khi component unmount để tránh rò rỉ socket và xử lý mất gói tin"],
    ["Làm sao để đảm bảo tin nhắn không bị trùng lặp hoặc nhảy thứ tự khi client reconnect?", "Cơ chế Ping/Pong heartbeat giải quyết vấn đề zombie connection thế nào?"],
    ["WebSocket", "SSE", "Realtime", "Exponential Backoff"],
    ["https://developer.mozilla.org/en-US/docs/Web/API/WebSocket"],
    ["Tự động reconnect liên tục không có khoảng nghỉ dẫn đến tấn công từ chối dịch vụ vô tình lên server"]
  ),

  // Scenario (6)
  q("FE-SCEN-01", "Frontend Developer", "scenario", "intermediate", "middle",
    "Tình huống: Người dùng phản ánh trang Web Dashboard bị treo đơ (Freeze) khoảng 2-3 giây mỗi khi bấm nút lọc hoặc xuất dữ liệu bảng lớn. Em tiến hành profiling và xử lý sự cố thế nào?",
    ["Mở Chrome DevTools Performance panel, record thao tác và tìm Long Tasks (>50ms)", "Xác định nguyên nhân: Blocking Main Thread do thuật toán nặng hoặc Layout Thrashing", "Giải pháp: chuyển tác vụ sang Web Worker hoặc chia nhỏ bằng scheduler.postTask / requestIdleCallback"],
    ["Web Worker giao tiếp với Main Thread như thế nào và chi phí serialization dữ liệu là bao nhiêu?", "Layout Thrashing là gì và làm sao để tránh đọc/ghi DOM đan xen?"],
    ["DevTools Profiler", "Performance", "Web Worker", "Long Tasks"],
    [SRC.webperf, SRC.internal],
    ["Đoán mò nguyên nhân mà không dùng DevTools Performance để thu thập chứng cứ"]
  ),
  q("FE-SCEN-02", "Frontend Developer", "scenario", "intermediate", "middle",
    "Tình huống: Trang thương mại điện tử bị chỉ số Cumulative Layout Shift (CLS) kém trên thiết bị di động khiến người dùng bấm nhầm nút khi ảnh và quảng cáo tải xong. Em khắc phục triệt để ra sao?",
    ["Quy định kích thước cứng width/height hoặc aspect-ratio bằng CSS cho ảnh và video", "Dành sẵn không gian (skeleton placeholder) cho các banner quảng cáo hoặc nội dung tải chậm", "Dùng font-display: optional hoặc swap kết hợp font metrics override để tránh layout shift do font"],
    ["Làm thế nào để debug CLS bằng PerformanceObserver API?", "Core Web Vitals INP (Interaction to Next Paint) bị ảnh hưởng thế nào nếu main thread bị nghẽn?"],
    ["CLS", "Core Web Vitals", "Aspect Ratio", "Web Performance"],
    [SRC.webperf, SRC.internal],
    ["Chỉ nén ảnh mà không cấp phát không gian hiển thị cố định trước cho ảnh"]
  ),
  q("FE-SCEN-03", "Frontend Developer", "scenario", "advanced", "senior_lead",
    "Tình huống: Sau khi release phiên bản web mới lên production, nhiều khách hàng vẫn tải phiên bản JavaScript cũ từ cache của trình duyệt dẫn đến lỗi gọi API không tương thích. Em thiết kế giải pháp cache busting ra sao?",
    ["Cấu hình Cache-Control headers: index.html để no-cache/must-revalidate, các file assets có content-hash để immutable", "Triển khai Service Worker kiểm tra phiên bản mới định kỳ hoặc qua version.json", "Hiển thị thông báo Toast: 'Đã có phiên bản mới, bấm để cập nhật' kèm logic reload an toàn"],
    ["Làm thế nào để Service Worker kích hoạt ngay lập tức với skipWaiting() mà không làm hỏng state đang chạy?", "Tại sao không bao giờ nên cache file index.html vĩnh viễn ở CDN?"],
    ["Cache Busting", "Service Worker", "Cache-Control", "Deployment"],
    [SRC.internal],
    ["Yêu cầu người dùng bấm Ctrl + F5 thủ công để xóa cache"]
  ),
  q("FE-SCEN-04", "Frontend Developer", "scenario", "intermediate", "middle",
    "Tình huống: Một biểu mẫu đăng ký hồ sơ gồm 5 bước (Multi-step Form) có hơn 40 trường dữ liệu và nhiều trường phụ thuộc nhau. Em tổ chức state, validation và cơ chế lưu nháp (draft) tự động như thế nào?",
    ["Sử dụng React Hook Form để hạn chế re-render toàn bộ form", "Tách schema validation bằng Zod/Yup theo từng bước và gộp thành tổng thể", "Lưu tự động vào LocalStorage/IndexedDB có debounce, xóa bản nháp khi submit thành công"],
    ["Làm sao để xử lý upload file tạm thời trong luồng lưu nháp nhiều bước?", "Cách cấu trúc form step để hỗ trợ deep linking (URL query param cho từng step)?"],
    ["React Hook Form", "Zod", "Multi-step Form", "LocalStorage"],
    [SRC.internal],
    ["Dùng useState riêng lẻ cho 40 trường dữ liệu dẫn đến re-render liên tục trên mọi thao tác gõ phím"]
  ),
  q("FE-SCEN-05", "Frontend Developer", "scenario", "intermediate", "middle",
    "Tình huống: Ứng dụng hỗ trợ Dark/Light mode nhưng người dùng bị hiện tượng Flash of Unstyled Content (FOUC) - màn hình chớp trắng sáng trước khi chuyển sang nền tối khi reload trang. Em xử lý thế nào?",
    ["Chèn một script nhỏ đồng bộ ở phần đầu thẻ `<head>` trước khi DOM hiển thị để đọc localStorage/system preference", "Gán class `.dark` lên thẻ `<html>` ngay lập tức trước khi render body", "Dùng CSS variables cho màu sắc hệ thống để chuyển đổi theme tức thời không phụ thuộc React render"],
    ["Làm sao để đồng bộ theme mượt mà với tùy chọn Dark Mode của hệ điều hành bằng CSS media query?", "Next-themes giải quyết vấn đề hydration mismatch với theme ra sao?"],
    ["FOUC", "Dark Mode", "CSS Variables", "Render Blocking Script"],
    [SRC.internal],
    ["Dùng useEffect ở client để gán dark mode dẫn đến màn hình nhấp nháy sáng trắng trước khi chuyển đen"]
  ),
  q("FE-SCEN-06", "Frontend Developer", "scenario", "advanced", "senior_lead",
    "Tình huống: Người dùng bấm nút thanh toán nhiều lần do mạng chập chờn dẫn đến nguy cơ gửi nhiều request trừ tiền trùng lặp. Em ngăn chặn điều này ở phía client và phối hợp với backend ra sao?",
    ["Disable và chuyển nút sang loading state ngay sau click đầu tiên", "Tạo Idempotency Key (UUID) cho mỗi phiên thanh toán gửi kèm header request", "Hiển thị thông báo trạng thái rõ ràng, ngăn người dùng back trang hoặc refresh trong lúc giao dịch đang xử lý"],
    ["Nếu request timeout nhưng phía server đã trừ tiền thì client nên hiển thị trạng thái gì?", "Tại sao chặn click ở client là chưa đủ nếu không có idempotency key ở server?"],
    ["Idempotency", "Payment Flow", "Race Condition", "Network Resilience"],
    [SRC.internal],
    ["Chỉ dựa vào việc disable nút bấm bằng CSS mà không có cơ chế chặn logic hoặc idempotency key"]
  ),

  // CV Validation (5)
  q("FE-CV-01", "Frontend Developer", "cv_validation", "advanced", "senior_lead",
    "Trong dự án Frontend gần nhất trên CV, kiến trúc component và luồng dữ liệu (data flow) lớn nhất mà em trực tiếp thiết kế là gì? Những quyết định kỹ thuật nào em đưa ra đã mang lại hiệu quả rõ rệt?",
    ["Mô tả cụ thể bối cảnh dự án, sơ đồ luồng dữ liệu và ranh giới trách nhiệm giữa các module", "Nêu rõ trade-off khi chọn công nghệ/pattern thay vì giải pháp khác", "Có số liệu hoặc kết quả định lượng: giảm thời gian render, tăng tốc độ dev, tái sử dụng component"],
    ["Nếu được làm lại từ đầu dự án đó với kiến thức hiện tại, em sẽ thay đổi quyết định nào?", "Đâu là đoạn code em tự hào nhất trong dự án đó?"],
    ["Architecture", "Component Design", "System Decisions", "CV Deep Dive"],
    [SRC.internal],
    ["Nói chung chung lý thuyết, không nhớ cấu trúc thư mục hoặc luồng dữ liệu của chính dự án mình làm"]
  ),
  q("FE-CV-02", "Frontend Developer", "cv_validation", "intermediate", "middle",
    "Trên CV em ghi thành thạo TypeScript. Em hãy chia sẻ một trường hợp thực tế em phải dùng Generic phức tạp, Conditional Types, hoặc Mapped Types để đảm bảo Type-safety cho dự án?",
    ["Trình bày được use-case thực tế: typing cho dynamic form, API client response handler, hoặc event emitter", "Hiểu từ khóa infer, keyof, typeof và phân biệt giữa type vs interface", "Giải thích cách tránh việc lạm dụng any hoặc unknown bừa bãi"],
    ["Làm thế nào để Type Narrowing với Discriminated Unions trong TypeScript?", "Tại sao nên hạn chế Type Assertion (as Type)?"],
    ["TypeScript", "Generics", "Type Safety", "Utility Types"],
    [SRC.ts, SRC.internal],
    ["Ghi thạo TypeScript trên CV nhưng trong dự án toàn dùng any để bypass lỗi biên dịch"]
  ),
  q("FE-CV-03", "Frontend Developer", "cv_validation", "intermediate", "middle",
    "Em ghi nhận đã từng tối ưu Core Web Vitals hoặc tốc độ tải trang trong dự án. Em đã xuất phát từ chỉ số đo lường nào trước khi tối ưu và kết quả cụ thể đạt được sau đó là gì?",
    ["Chỉ rõ công cụ đo: Lighthouse, Web Vitals Chrome Extension, RUM (Real User Monitoring)", "Liệt kê số liệu trước và sau (ví dụ: LCP từ 4.2s xuống 1.8s, CLS từ 0.25 xuống 0.02)", "Nêu chính xác các kỹ thuật cốt lõi đã áp dụng để đạt được con số đó"],
    ["Có sự chênh lệch nào giữa dữ liệu Lab test (Lighthouse máy dev) và Field test (người dùng thật) không?", "Em duy trì hiệu năng đó thế nào để không bị suy giảm theo các sprint sau?"],
    ["Web Vitals", "Optimization Metric", "Case Study", "CV Verification"],
    [SRC.webperf, SRC.internal],
    ["Đưa ra số liệu ảo không có căn cứ hoặc không giải thích được kỹ thuật tương ứng đã thực hiện"]
  ),
  q("FE-CV-04", "Frontend Developer", "cv_validation", "advanced", "senior_lead",
    "Em hãy kể về một bug khó nhất liên quan đến Frontend (ví dụ: memory leak, race condition, lỗi chỉ bị trên Safari/iOS) mà em từng gặp trong quá trình làm việc. Em đã dùng quy trình nào để tái hiện và fix triệt để?",
    ["Trình bày mạch lạc: triệu chứng -> giả thuyết -> phương pháp cô lập -> nguyên nhân gốc -> giải pháp", "Biết sử dụng debugger, network throttling, memory heap snapshot để tìm manh mối", "Rút ra bài học hoặc viết regression test để ngăn lỗi tái diễn"],
    ["Tại sao bug đó lại lọt qua được khâu dev và test ban đầu?", "Làm thế nào để debug một lỗi chỉ xảy ra trên Safari trên máy tính Windows nếu không có máy Mac?"],
    ["Troubleshooting", "Debugging", "Cross-browser", "Memory Leak"],
    [SRC.internal],
    ["Mô tả bug quá sơ sài hoặc nói 'chưa bao giờ gặp bug khó'"]
  ),
  q("FE-CV-05", "Frontend Developer", "cv_validation", "intermediate", "middle",
    "Khi làm việc với các bên thứ ba (Third-party SDK) như Google Maps, Stripe, Live Chat widget, dự án trên CV của em đã gặp những thách thức gì về bảo mật, hiệu năng hoặc xung đột script?",
    ["Kỹ thuật tải không đồng bộ (asynchronous script loading) và lazy load khi người dùng cuộn đến vị trí cần thiết", "Bảo vệ khóa bí mật và thiết lập Content Security Policy (CSP) cho phép domain bên thứ ba", "Xử lý fallback khi SDK bên thứ ba bị chặn bởi AdBlocker hoặc mất kết nối"],
    ["Làm sao để đo lường mức độ ảnh hưởng của script bên thứ ba lên Total Blocking Time (TBT)?", "Iframe vs Direct Script: ưu nhược điểm khi nhúng widget ngoài?"],
    ["Third-party Integration", "CSP", "AdBlocker Resilience", "SDK"],
    [SRC.internal],
    ["Nhúng trực tiếp script đồng bộ vào thẻ `<head>` mà không lường trước hậu quả chặn render"]
  ),

  // Behavioral (5)
  q("FE-BEHAV-01", "Frontend Developer", "behavioral", "basic", "junior",
    "Khi nhận bản thiết kế từ UI/UX Designer chứa những hiệu ứng chuyển động rất phức tạp hoặc thành phần không tương thích với trải nghiệm trên thiết bị di động, em trao đổi và làm việc với Designer thế nào?",
    ["Tôn trọng thẩm mỹ của Designer nhưng phân tích dựa trên dữ liệu kỹ thuật và trải nghiệm người dùng thực tế", "Chủ động đề xuất giải pháp thay thế khả thi (alternative) kèm bản demo nhỏ", "Cùng Designer thống nhất phiên bản MVP trước khi đầu tư animation cầu kỳ"],
    ["Nếu Designer kiên quyết giữ ý kiến của họ, em xử lý bước tiếp theo ra sao?", "Em làm gì để xây dựng tiếng nói chung giữa Dev và Designer ngay từ giai đoạn wireframe?"],
    ["Collaboration", "Designer-Dev", "Conflict Resolution", "Negotiation"],
    [SRC.internal],
    ["Tự ý cắt bỏ thiết kế mà không trao đổi với Designer"]
  ),
  q("FE-BEHAV-02", "Frontend Developer", "behavioral", "intermediate", "middle",
    "Khi Backend API chậm trễ tiến độ hoặc API trả về cấu trúc dữ liệu không tối ưu cho giao diện (nested quá sâu hoặc thiếu trường tính toán), em phối hợp với Backend Developer thế nào để không làm chậm tiến độ chung?",
    ["Chủ động thống nhất hợp đồng API (API Contract / Swagger / OpenAPI) từ đầu sprint", "Sử dụng Mock API (MSW, MirageJS) để độc lập phát triển frontend trước", "Đóng góp ý kiến chuyên môn với backend về việc tối ưu payload hoặc áp dụng BFF (Backend for Frontend)"],
    ["Nếu Backend không thể đổi cấu trúc do ảnh hưởng hệ thống cũ, em xử lý Adapter pattern ở Frontend thế nào?", "Làm sao để đảm bảo khi ráp API thật không bị phát sinh lỗi schema mismatch?"],
    ["Backend Collaboration", "API Contract", "Mocking", "BFF"],
    [SRC.internal],
    ["Ngồi chờ backend xong mới bắt đầu làm frontend hoặc đổ lỗi cho backend khi chậm tiến độ"]
  ),
  q("FE-BEHAV-03", "Frontend Developer", "behavioral", "intermediate", "middle",
    "Trước ngày phát hành tính năng quan trọng chỉ 24 giờ, Product Owner yêu cầu bổ sung gấp một thay đổi giao diện làm xáo trộn luồng người dùng đã test kỹ. Em phản hồi và xử lý tình huống này thế nào?",
    ["Bình tĩnh lắng nghe lý do kinh doanh đằng sau yêu cầu thay đổi", "Phân tích minh bạch rủi ro kỹ thuật: khả năng phát sinh bug hồi quy (regression), thời gian test không đủ", "Đưa ra các phương án lựa chọn: lùi lịch release 1-2 ngày để test kỹ, hoặc release phiên bản hiện tại rồi ra mắt thay đổi trong hotfix tiếp theo"],
    ["Làm thế nào để từ chối một yêu cầu mà vẫn giữ được sự tin cậy từ phía Product Owner?", "Em rút ra kinh nghiệm gì về quy trình Change Management cho các sprint sau?"],
    ["Stakeholder Management", "Scope Creep", "Risk Assessment", "Decision Making"],
    [SRC.internal],
    ["Cả nể nhận làm gấp thâu đêm rồi release sản phẩm đầy lỗi"]
  ),
  q("FE-BEHAV-04", "Frontend Developer", "behavioral", "intermediate", "middle",
    "Em tiếp cận và đánh giá một công nghệ hoặc thư viện Frontend mới (ví dụ: một state manager mới, meta-framework mới) như thế nào trước khi quyết định đề xuất áp dụng vào sản phẩm của công ty?",
    ["Đánh giá tính bền vững: cộng đồng, số lượng GitHub stars, tần suất bảo trì, corporate backing", "Đánh giá chi phí chuyển đổi: learning curve của đội ngũ, khả năng tương thích với code base hiện tại, độ rủi ro lock-in", "Thực hiện Proof of Concept (PoC) trong phạm vi nhỏ trước khi nhân rộng"],
    ["Em từng đề xuất một công nghệ mới nào vào team chưa? Quá trình thuyết phục diễn ra thế nào?", "Khi một thư viện trong dự án bị tác giả ngừng duy trì (deprecated), kế hoạch ứng phó của em là gì?"],
    ["Technology Evaluation", "PoC", "Decision Making", "Tech Debt"],
    [SRC.internal],
    ["Chạy theo xu hướng vì công nghệ đó đang 'hot' trên mạng xã hội mà không quan tâm bài toán dự án"]
  ),
  q("FE-BEHAV-05", "Frontend Developer", "behavioral", "intermediate", "middle",
    "Khi một thành viên Junior trong nhóm liên tục tạo Pull Request không đạt chuẩn (viết code lộn xộn, không tuân thủ conventions, thiếu xử lý lỗi), em thực hiện code review và hỗ trợ bạn ấy tiến bộ như thế nào?",
    ["Review mang tính xây dựng: giải thích lý do 'tại sao' nên viết như vậy thay vì chỉ ra lệnh", "Thiết lập công cụ tự động hóa (ESLint, Prettier, Husky, CI check) để giảm tải việc bắt lỗi cú pháp thủ công", "Dành thời gian 1-on-1 hoặc pair-programming để hướng dẫn tư duy thiết kế"],
    ["Làm sao để cân bằng giữa việc review kỹ và giữ nhịp độ release của sprint?", "Nếu Junior đó có thái độ tự ái khi nhận góp ý, em giải quyết ra sao?"],
    ["Mentorship", "Code Review", "Teamwork", "Empathy"],
    [SRC.internal],
    ["Dùng lời lẽ chỉ trích, hạ thấp đồng nghiệp trên PR hoặc tự tay sửa hết code cho xong thay vì hướng dẫn bạn tự sửa"]
  )
];

console.log("FE questions defined:", feQuestions.length);
module.exports = { feQuestions, q, SRC };
