const fs = require('fs');
const path = require('path');

// Định nghĩa dữ liệu chuyên sâu cho 7 vị trí Web & Mobile
const WEB_MOBILE_DATA = [
  {
    role: "Frontend Developer",
    prefix: "FE",
    aliases: ["frontend developer", "frontend engineer", "front-end developer", "lap trinh vien frontend", "fe dev"],
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "State Management", "Web Performance", "Accessibility (a11y)"],
    categories: {
      foundation: [
        {
          q: "Giải thích cơ chế Virtual DOM trong React hoặc cơ chế Reactivity trong modern frontend framework. Tại sao nó giúp tối ưu hóa hiệu năng render so với thao tác trực tiếp trên DOM?",
          crit: ["Hiểu bản chất DOM ảo là cấu trúc JavaScript Object trong bộ nhớ", "Nắm rõ thuật toán Diffing và quá trình Reconciliation", "Giải thích được batching update và việc giảm thiểu reflow/repaint của trình duyệt", "Nhận thức được overhead của Virtual DOM so với fine-grained reactivity"],
          fu: ["Trong trường hợp nào việc dùng Virtual DOM vẫn có thể gây lag giao diện?", "React Fiber giải quyết bài toán non-blocking rendering như thế nào?"],
          tags: ["Virtual DOM", "React", "Reconciliation", "Rendering Engine"],
          rf: ["Nói Virtual DOM luôn nhanh hơn thao tác DOM thuần trong mọi trường hợp mà không hiểu lý do", "Không phân biệt được reflow và repaint"]
        },
        {
          q: "Phân biệt sâu sắc giữa Server-Side Rendering (SSR), Static Site Generation (SSG) và Client-Side Rendering (CSR). Tiêu chí kỹ thuật nào giúp em quyết định chọn mô hình render cho một trang web?",
          crit: ["Phân tích đúng trade-off giữa Time to First Byte (TTFB) và First Contentful Paint (FCP)", "Hiểu ảnh hưởng của từng mô hình tới SEO và chỉ số Core Web Vitals", "Nêu rõ bối cảnh trang dashboard (CSR), blog/tin tức (SSG) và e-commerce cần dữ liệu tươi mới (SSR/ISR)"],
          fu: ["Hydration mismatch xảy ra khi nào và cách khắc phục trong Next.js?", "Incremental Static Regeneration (ISR) vận hành như thế nào?"],
          tags: ["SSR", "SSG", "CSR", "Next.js", "SEO"],
          rf: ["Cho rằng SSR luôn tốt nhất cho mọi loại website", "Không hiểu cơ chế Hydration ở client"]
        },
        {
          q: "CSS Box Model hoạt động như thế nào? Sự khác nhau giữa `content-box` và `border-box` là gì, và tại sao reset CSS hầu như luôn gán `box-sizing: border-box`?",
          crit: ["Giải thích đúng 4 thành phần: content, padding, border, margin", "Nêu rõ cách tính width/height thực tế của phần tử trong từng chế độ", "Giải thích margin collapsing và các trường hợp xảy ra margin collapsing"],
          fu: ["BFC (Block Formatting Context) là gì và làm thế nào để tạo ra một BFC?", "Thuộc tính margin âm (negative margin) hoạt động như thế nào trong layout?"],
          tags: ["CSS", "Box Model", "Layout", "BFC"],
          rf: ["Nhầm lẫn giữa padding và margin", "Không biết cách xử lý margin collapse"]
        },
        {
          q: "Trình duyệt thực thi quá trình Critical Rendering Path (CRP) từ lúc nhận HTML đến khi hiển thị pixel lên màn hình như thế nào?",
          crit: ["Trình bày đầy đủ: HTML -> DOM tree, CSS -> CSSOM tree, Render Tree, Layout, Paint, Composite", "Chỉ rõ vai trò của parser-blocking script và render-blocking stylesheet", "Hiểu sự khác biệt giữa `async` và `defer` trong thẻ script"],
          fu: ["Làm thế nào để đo lường và tối ưu LCP (Largest Contentful Paint) dựa trên CRP?", "Thuộc tính CSS nào kích hoạt GPU compositing mà không gây reflow?"],
          tags: ["Critical Rendering Path", "Browser Internals", "Performance", "Web Vitals"],
          rf: ["Nghĩ rằng JavaScript chỉ chạy sau khi toàn bộ giao diện đã hiển thị xong", "Không biết thuộc tính transform/opacity không kích hoạt layout"]
        },
        {
          q: "Giải thích cơ chế Closure và Lexical Scope trong JavaScript. Nêu một ví dụ thực tế em đã sử dụng Closure và cách phòng tránh rò rỉ bộ nhớ (memory leak)?",
          crit: ["Định nghĩa chính xác: hàm ghi nhớ phạm vi bao bọc nó ngay cả khi được thực thi ngoài phạm vi đó", "Lấy ví dụ thiết thực: function factory, debounce/throttle, memoization hoặc private variables", "Chỉ ra nguy cơ memory leak do giữ tham chiếu DOM hoặc interval không được clear"],
          fu: ["Scope chain khác gì với Prototype chain?", "V8 Garbage Collector thu hồi bộ nhớ của Closure dựa trên nguyên lý nào?"],
          tags: ["JavaScript", "Closure", "Scope", "Memory Management"],
          rf: ["Nhầm lẫn Closure với Callback thông thường", "Không chỉ ra được nguyên nhân gây rò rỉ bộ nhớ"]
        },
        {
          q: "Accessibility (a11y) trong phát triển web bao gồm những nguyên tắc cơ bản nào? Làm thế nào để đảm bảo một component như Modal hoặc Dropdown thân thiện với người dùng dùng bàn phím và Screen Reader?",
          crit: ["Hiểu tiêu chuẩn WCAG và các thuộc tính WAI-ARIA (role, aria-expanded, aria-modal)", "Xử lý Focus Trapping bên trong modal khi mở và trả lại focus khi đóng", "Hỗ trợ phím Escape, phím Tab, Enter và Arrow keys cho bàn phím"],
          fu: ["Khi nào nên dùng HTML5 Semantic tags thay vì lạm dụng ARIA roles?", "Làm thế nào để kiểm thử tự động accessibility trong pipeline CI/CD?"],
          tags: ["Accessibility", "WCAG", "ARIA", "Focus Management"],
          rf: ["Xem nhẹ a11y, chỉ bọc mọi component bằng thẻ div", "Không biết cách xử lý focus trap"]
        }
      ],
      practical_skills: [
        {
          q: "Làm thế nào để tối ưu hóa hiệu năng render trong ứng dụng React lớn khi xuất hiện re-render không cần thiết? Em sử dụng `useMemo`, `useCallback`, `React.memo` trong tình huống cụ thể nào?",
          crit: ["Phân tích chi phí tính toán so với chi phí so sánh shallow prop comparison", "Biết cách dùng React DevTools Profiler để trace commit phase và re-render causes", "Nêu rõ `useCallback` chỉ có giá trị khi truyền hàm xuống component con được bọc `React.memo` hoặc phụ thuộc trong hook"],
          fu: ["Tại sao việc lạm dụng `useCallback` bừa bãi có thể làm app chạy chậm hơn?", "React 19 Compiler giải quyết vấn đề memoization tự động như thế nào?"],
          tags: ["React", "Performance", "useMemo", "useCallback", "React.memo"],
          rf: ["Bọc tất cả hàm và biến bằng useCallback/useMemo mà không có căn cứ", "Không biết dùng DevTools Profiler"]
        },
        {
          q: "Em quản lý Server State và Client State như thế nào? Tại sao xu hướng hiện nay chuyển từ Redux toàn cục sang kết hợp React Query / TanStack Query và Zustand?",
          crit: ["Phân định rạch ròi giữa Server Cache (caching, deduplication, invalidation, optimistic update) và UI State cục bộ", "Nêu rõ lợi ích của React Query trong việc tự động hóa refetch, stale-while-revalidate", "Lý giải Zustand nhẹ nhàng, không boilerplate cho các state chia sẻ ở client"],
          fu: ["Làm thế nào để xử lý Race Condition khi nhiều request tìm kiếm được gửi liên tục bằng React Query?", "Cơ chế Optimistic Updates hoạt động ra sao khi rollback nếu API báo lỗi?"],
          tags: ["React Query", "Zustand", "State Management", "Server State"],
          rf: ["Lưu toàn bộ dữ liệu gọi từ API vào Redux store mà không có cơ chế invalidate/cache rõ ràng", "Không hiểu khái niệm stale time vs cache time"]
        },
        {
          q: "Khi một danh sách dữ liệu có hơn 10.000 bản ghi cần hiển thị trên giao diện, em áp dụng kỹ thuật Windowing / Virtual List như thế nào?",
          crit: ["Hiểu nguyên lý chỉ render các DOM nodes nằm trong viewport hiển thị kèm overscan", "Nắm rõ các thư viện như `@tanstack/react-virtual` hoặc `react-window`", "Xử lý trường hợp item có chiều cao động (dynamic height) và giữ vị trí cuộn (scroll restoration)"],
          fu: ["Làm sao để đảm bảo tính năng tìm kiếm bằng Ctrl+F hoặc Screen Reader vẫn hoạt động tốt khi dùng Virtual List?", "Intersection Observer API hỗ trợ gì cho infinite scroll?"],
          tags: ["Virtual List", "Performance", "TanStack Virtual", "DOM Optimization"],
          rf: ["Đề xuất render toàn bộ 10.000 DOM nodes rồi dùng CSS ẩn", "Không giải thích được cơ chế tính toán offset/scrollTop"]
        },
        {
          q: "Quy trình xây dựng một UI Design System hoặc Component Library dùng chung trong dự án thực tế của em gồm những bước nào?",
          crit: ["Định nghĩa Design Tokens (spacing, color palettes, typography, shadows)", "Đảm bảo tính linh hoạt qua Compound Components pattern hoặc Slot/Polymorphic components", "Tài liệu hóa bằng Storybook, viết unit test với Testing Library và visual regression test"],
          fu: ["Làm thế nào để quản lý versioning (SemVer) và breaking changes khi cập nhật component cho nhiều dự án?", "Cách em xử lý override style mà không phá vỡ tính đóng gói của component?"],
          tags: ["Design System", "Storybook", "Component Architecture", "Design Tokens"],
          rf: ["Hardcode css inline hoặc màu sắc tùy tiện không qua tokens", "Thiết kế component thiếu khả năng mở rộng prop"]
        },
        {
          q: "Em xử lý Authentication & Authorization ở phía Frontend như thế nào? Làm sao lưu trữ Access Token & Refresh Token an toàn chống lại XSS và CSRF?",
          crit: ["Phân tích rủi ro khi lưu token trong LocalStorage (dễ bị tấn công XSS trích xuất)", "Đề xuất lưu Refresh Token trong HttpOnly Secure SameSite Cookie, Access Token trong memory", "Thiết lập Axios/Fetch Interceptor tự động bắt mã lỗi 401, gọi Refresh Token và replay lại các request đang pending"],
          fu: ["Nếu 5 API đồng thời trả về lỗi 401 cùng lúc, làm sao để chỉ gọi refresh token đúng 1 lần duy nhất?", "Cơ chế PKCE trong OAuth2 dành cho SPA hoạt động như thế nào?"],
          tags: ["Authentication", "Security", "XSS", "CSRF", "Axios Interceptor"],
          rf: ["Mặc định lưu Access Token lâu dài vào LocalStorage mà không biết rủi ro XSS", "Không biết cơ chế queue request khi đang refresh token"]
        },
        {
          q: "Giải thích chiến lược tối ưu hóa Bundle Size trong dự án web hiện đại. Em phân tích và giảm dung lượng JavaScript tải về bằng những công cụ và phương pháp nào?",
          crit: ["Sử dụng Bundle Analyzer (Rollup/Webpack) để phát hiện thư viện phình to", "Áp dụng Route-based Code Splitting (`React.lazy`, `Suspense`, Dynamic Import)", "Tree-shaking hiệu quả với ES Modules, thay thế các thư viện cồng kềnh (vd: Lodash/Moment bằng date-fns)"],
          fu: ["Tại sao cú pháp CommonJS (`require`) cản trở Tree-shaking?", "Modern image formats (AVIF, WebP) và responsive `srcset` đóng góp gì cho FCP?"],
          tags: ["Bundle Size", "Code Splitting", "Tree Shaking", "Webpack", "Vite"],
          rf: ["Import toàn bộ thư viện lớn chỉ để dùng 1 hàm nhỏ", "Không kiểm tra kích thước bundle trước khi đưa lên production"]
        },
        {
          q: "Em thiết lập quy trình kiểm thử (Testing Strategy) cho Frontend như thế nào? Sự khác biệt về mục đích giữa Unit Test, Component Integration Test và End-to-End (E2E) Test?",
          crit: ["Theo dõi Testing Trophy: ưu tiên Integration Test với React Testing Library (test theo hành vi người dùng, không test implementation detail)", "Unit test cho helper, utility functions, custom hooks cô lập", "E2E test với Playwright/Cypress cho các luồng nghiệp vụ cốt lõi (Checkout, Login)"],
          fu: ["Làm thế nào để mock API gọi từ server bằng MSW (Mock Service Worker)?", "Khi nào nên viết Snapshot testing và rủi ro của việc lạm dụng snapshot?"],
          tags: ["Testing", "React Testing Library", "Playwright", "MSW", "Jest/Vitest"],
          rf: ["Kiểm thử bằng cách assert state nội bộ của component thay vì hành vi người dùng", "Bỏ qua kiểm thử tự động, chỉ test tay"]
        },
        {
          q: "Em áp dụng WebSocket hoặc Server-Sent Events (SSE) để xây dựng tính năng real-time (như chat hoặc thông báo) trên giao diện như thế nào? Cách xử lý tái kết nối (reconnect) và đồng bộ dữ liệu khi mất mạng?",
          crit: ["Phân biệt SSE (một chiều từ server) và WebSocket (hai chiều toàn phần)", "Triển khai Exponential Backoff algorithm khi thử kết nối lại", "Cơ chế Heartbeat (Ping/Pong) để phát hiện kết nối chết âm thầm (zombie connection)"],
          fu: ["Làm sao để đảm bảo tin nhắn không bị duplicate hoặc mất thứ tự khi client reconnect?", "Quản lý đóng kết nối khi component unmount để tránh rò rỉ socket?"],
          tags: ["WebSocket", "SSE", "Realtime", "Exponential Backoff", "Network Resilience"],
          rf: ["Viết vòng lặp reconnect liên tục không có độ trễ gây quá tải server", "Quên dọn dẹp event listener khi component unmount"]
        }
      ],
      scenario: [
        {
          q: "Người dùng phản ánh trang Web Dashboard bị treo đơ (Freeze) khoảng 2-3 giây mỗi khi bấm nút lọc hoặc xuất báo cáo dữ liệu. Các bước cụ thể em dùng để khoanh vùng và xử lý sự cố này?",
          crit: ["Mở Chrome DevTools Performance panel, record thao tác và tìm Long Tasks (>50ms)", "Xác định nguyên nhân: Blocking Main Thread do thuật toán xử lý dữ liệu nặng hoặc Layout Thrashing", "Giải pháp: chuyển tác vụ tính toán nặng sang Web Worker, chia nhỏ tác vụ bằng `scheduler.postTask` hoặc `requestIdleCallback`"],
          fu: ["Web Worker giao tiếp với Main Thread như thế nào và chi phí serialization dữ liệu là bao nhiêu?", "Layout Thrashing là gì và làm sao để tránh đọc/ghi DOM đan xen?"],
          tags: ["Chrome DevTools", "Performance Profiling", "Web Worker", "Main Thread"],
          rf: ["Đoán mò không dùng DevTools Performance", "Thử giải quyết bằng `setTimeout(..., 0)` một cách mù quáng"]
        },
        {
          q: "Đội marketing yêu cầu trang Landing Page phải đạt điểm Google Lighthouse trên 90 ở thiết bị di động, nhưng hiện tại chỉ đạt 45 do chứa nhiều hình ảnh, font chữ ngoài và mã tracking (GTM, Facebook Pixel). Em xử lý thế nào?",
          crit: ["Tối ưu font: dùng `font-display: swap`, preload critical fonts, tự host font thay vì gọi Google Fonts", "Tối ưu ảnh: dùng thẻ `<picture>`, nén WebP/AVIF, định rõ `width/height` để tránh Layout Shift (CLS)", "Trì hoãn tải mã tracking bên thứ ba (Partytown, tải sau khi trang đã tương tác)"],
          fu: ["Chỉ số FID/INP đo lường điều gì và tối ưu INP khác tối ưu LCP thế nào?", "Cơ chế Priority Hints (`fetchpriority='high'`) hỗ trợ gì cho LCP image?"],
          tags: ["Lighthouse", "Core Web Vitals", "CLS", "INP", "Third-party Scripts"],
          rf: ["Đề xuất xóa bỏ hết mã marketing mà không có giải pháp kỹ thuật dung hòa", "Không biết nguyên nhân gây CLS do thiếu kích thước ảnh"]
        },
        {
          q: "Sau khi release phiên bản mới lên production, một số người dùng vẫn thấy giao diện cũ và bị lỗi API do phiên bản cũ gọi payload không tương thích. Em thiết kế cơ chế cache busting và thông báo cập nhật phiên bản mới thế nào?",
          crit: ["Cấu hình Cache-Control headers: `index.html` để `no-cache`, các file assets (js, css) có content-hash trong tên file và để `immutable`", "Triển khai Service Worker kiểm tra phiên bản mới định kỳ hoặc qua version file `version.json`", "Hiển thị Toast thông báo: 'Đã có phiên bản mới, bấm để tải lại' kèm hàm cập nhật mượt mà"],
          fu: ["Làm thế nào để Service Worker kích hoạt ngay lập tức với `skipWaiting()` mà không gây hỏng state đang chạy?", "Tại sao không bao giờ nên cache file `index.html` vĩnh viễn ở CDN?"],
          tags: ["Cache Invalidation", "Service Worker", "Cache-Control", "Deployment"],
          rf: ["Yêu cầu người dùng bấm Ctrl + F5 thủ công", "Không hiểu cơ chế content hash của bundler"]
        },
        {
          q: "Một form đăng ký phức tạp gồm 5 bước (Multi-step form) với hơn 40 trường dữ liệu và nhiều validation phụ thuộc lẫn nhau. Em tổ chức state, validation và UX lưu nháp (draft) như thế nào để người dùng không bị mất dữ liệu khi vô tình F5?",
          crit: ["Sử dụng thư viện quản lý form hiệu năng cao như React Hook Form để hạn chế re-render toàn bộ form", "Tách schema validation bằng Zod/Yup theo từng bước và gộp thành tổng thể", "Lưu tự động vào LocalStorage/IndexedDB có debounce, xóa bản nháp khi nộp thành công"],
          fu: ["Làm sao để xử lý upload file tạm thời trong luồng lưu nháp nhiều bước?", "Cách cấu trúc form step để hỗ trợ deep linking (URL query param cho từng step)?"],
          tags: ["React Hook Form", "Zod", "Multi-step Form", "LocalStorage"],
          rf: ["Dùng useState riêng lẻ cho 40 trường dữ liệu dẫn đến re-render liên tục", "Không có cơ chế validate từng bước độc lập"]
        },
        {
          q: "Ứng dụng của em cần hỗ trợ đa ngôn ngữ (i18n) và hỗ trợ giao diện sáng/tối (Dark/Light mode) mượt mà không bị giật nháy (FOUC - Flash of Unstyled Content) khi nạp trang. Kỹ thuật triển khai của em là gì?",
          crit: ["Tải file dịch theo từng namespace/ngôn ngữ (lazy loading translation chunks)", "Dark mode: chèn inline script chặn render ở `<head>` để đọc localStorage/system preference và gán class `.dark` lên thẻ `<html>` trước khi paint", "Dùng CSS variables cho màu sắc hệ thống để chuyển đổi theme tức thời không cần re-render toàn bộ React tree"],
          fu: ["Làm sao để format ngày tháng, tiền tệ chuẩn theo từng locale mà không làm phình bundle?", "Xử lý hướng văn bản RTL (Right-to-Left) cho ngôn ngữ như tiếng Ả Rập ra sao?"],
          tags: ["i18n", "Theming", "Dark Mode", "FOUC", "CSS Variables"],
          rf: ["Dùng useEffect ở client để gán dark mode dẫn đến màn hình nhấp nháy sáng trắng trước khi chuyển đen", "Load toàn bộ file json ngôn ngữ của cả app một lần"]
        },
        {
          q: "Khi tích hợp thanh toán qua cổng thứ ba (ví điện tử/ngân hàng), người dùng bấm nút thanh toán nhiều lần do mạng chập chờn dẫn đến nguy cơ gửi nhiều request trừ tiền trùng lặp. Em ngăn chặn điều này ở phía client ra sao?",
          crit: ["Vô hiệu hóa nút bấm (Disable & Loading state) ngay lần click đầu tiên", "Tạo Idempotency Key (UUID) cho mỗi phiên thanh toán gửi kèm header request", "Hiển thị thông báo rõ ràng về trạng thái đang xử lý, ngăn người dùng back trang hoặc refresh"],
          fu: ["Nếu request timeout nhưng phía server đã trừ tiền thì client nên hiển thị trạng thái gì?", "Tại sao chặn click ở client là chưa đủ nếu không có idempotency key ở server?"],
          tags: ["Payment UX", "Idempotency", "Concurrency", "Network Debounce"],
          rf: ["Chỉ dựa vào việc disable nút bấm bằng CSS mà không có cơ chế chặn logic hoặc idempotency key", "Không xử lý kịch bản timeout"]
        }
      ],
      cv_validation: [
        {
          q: "Trong dự án gần nhất được ghi trên CV, kiến trúc component và luồng dữ liệu (data flow) lớn nhất mà em trực tiếp thiết kế là gì? Những quyết định kỹ thuật nào em đưa ra đã mang lại hiệu quả rõ rệt?",
          crit: ["Mô tả cụ thể bối cảnh dự án, sơ đồ luồng dữ liệu và ranh giới trách nhiệm giữa các module", "Nêu rõ trade-off khi chọn công nghệ/pattern thay vì giải pháp khác", "Có số liệu hoặc kết quả định lượng: giảm thời gian render, tăng tốc độ dev, tái sử dụng component"],
          fu: ["Nếu được làm lại từ đầu dự án đó với kiến thức hiện tại, em sẽ thay đổi quyết định nào?", "Đâu là đoạn code em tự hào nhất trong dự án đó?"],
          tags: ["Architecture", "Component Design", "System Decisions", "CV Deep Dive"],
          rf: ["Nói chung chung lý thuyết, không nhớ cấu trúc thư mục hoặc luồng dữ liệu của chính dự án mình làm", "Quy hết thành tích cho team mà không nêu được đóng góp cá nhân"]
        },
        {
          q: "Trên CV em có đề cập kỹ năng TypeScript. Em có thể chia sẻ một trường hợp thực tế em phải dùng Generic phức tạp, Conditional Types, hoặc Mapped Types để đảm bảo Type-safety cho dự án?",
          crit: ["Trình bày được use-case thực tế: typing cho dynamic form, API client response handler, hoặc event emitter", "Hiểu từ khóa `infer`, `keyof`, `typeof` và phân biệt giữa `type` vs `interface`", "Giải thích cách tránh việc lạm dụng `any` hoặc `unknown` bừa bãi"],
          fu: ["Làm thế nào để Type Narrowing với Discriminated Unions trong TypeScript?", "Tại sao nên hạn chế Type Assertion (`as Type`)?"],
          tags: ["TypeScript", "Generics", "Type Safety", "Utility Types"],
          rf: ["Ghi thạo TypeScript trên CV nhưng trong dự án toàn dùng `any` để bypass lỗi biên dịch", "Không giải thích được sự khác biệt giữa interface và type"]
        },
        {
          q: "Em ghi nhận đã từng tối ưu Core Web Vitals hoặc tốc độ tải trang trong dự án. Em đã xuất phát từ chỉ số đo lường nào trước khi tối ưu và kết quả cụ thể đạt được sau đó là gì?",
          crit: ["Chỉ rõ công cụ đo: Lighthouse, Web Vitals Chrome Extension, RUM (Real User Monitoring)", "Liệt kê số liệu trước và sau (ví dụ: LCP từ 4.2s xuống 1.8s, CLS từ 0.25 xuống 0.02)", "Nêu chính xác các kỹ thuật cốt lõi đã áp dụng để đạt được con số đó"],
          fu: ["Có sự chênh lệch nào giữa dữ liệu Lab test (Lighthouse máy dev) và Field test (người dùng thật) không?", "Em duy trì hiệu năng đó thế nào để không bị suy giảm theo các sprint sau?"],
          tags: ["Web Vitals", "Optimization Metric", "Case Study", "CV Verification"],
          rf: ["Đưa ra số liệu ảo không có căn cứ hoặc không giải thích được kỹ thuật tương ứng đã thực hiện", "Không phân biệt được Lab Data và Field Data"]
        },
        {
          q: "Em hãy kể về một bug khó nhất liên quan đến Frontend (ví dụ: memory leak, race condition, lỗi chỉ bị trên Safari/iOS) mà em từng gặp trong quá trình làm việc. Em đã dùng quy trình nào để tái hiện và fix triệt để?",
          crit: ["Trình bày mạch lạc: triệu chứng -> giả thuyết -> phương pháp cô lập (reproduce) -> nguyên nhân gốc (root cause) -> giải pháp", "Biết sử dụng debugger, network throttling, memory heap snapshot để tìm manh mối", "Rút ra bài học hoặc viết regression test để ngăn lỗi tái diễn"],
          fu: ["Tại sao bug đó lại lọt qua được khâu dev và test ban đầu?", "Làm thế nào để debug một lỗi chỉ xảy ra trên Safari trên máy tính Windows nếu không có máy Mac?"]
          tags: ["Troubleshooting", "Debugging", "Cross-browser", "Memory Leak"],
          rf: ["Mô tả bug quá sơ sài hoặc nói 'chưa bao giờ gặp bug khó'", "Fix bug bằng cách thử sửa đại cho đến khi chạy được mà không hiểu bản chất"]
        },
        {
          q: "Khi làm việc với các bên thứ ba (Third-party SDK) như Google Maps, Stripe, Live Chat widget, dự án trên CV của em đã gặp những thách thức gì về bảo mật, hiệu năng hoặc xung đột script?",
          crit: ["Kỹ thuật tải không đồng bộ (asynchronous script loading) và lazy load khi người dùng cuộn đến vị trí cần thiết", "Bảo vệ khóa bí mật và thiết lập Content Security Policy (CSP) cho phép domain bên thứ ba", "Xử lý fallback khi SDK bên thứ ba bị chặn bởi AdBlocker hoặc mất kết nối"],
          fu: ["Làm sao để đo lường mức độ ảnh hưởng của script bên thứ ba lên Total Blocking Time (TBT)?", "Iframe vs Direct Script: ưu nhược điểm khi nhúng widget ngoài?"],
          tags: ["Third-party Integration", "CSP", "AdBlocker Resilience", "SDK"],
          rf: ["Nhúng trực tiếp script đồng bộ vào thẻ `<head>` mà không lường trước hậu quả chặn render", "Không có phương án xử lý khi dịch vụ ngoài bị sập"]
        }
      ],
      behavioral: [
        {
          q: "Khi nhận bản thiết kế từ UI/UX Designer chứa những hiệu ứng chuyển động rất phức tạp hoặc thành phần không tương thích với trải nghiệm trên thiết bị di động, em trao đổi và làm việc với Designer thế nào?",
          crit: ["Tôn trọng thẩm mỹ của Designer nhưng phân tích dựa trên dữ liệu kỹ thuật và trải nghiệm người dùng thực tế", "Chủ động đề xuất giải pháp thay thế khả thi (alternative) kèm bản demo nhỏ", "Cùng Designer thống nhất phiên bản MVP trước khi đầu tư animation cầu kỳ"],
          fu: ["Nếu Designer kiên quyết giữ ý kiến của họ, em xử lý bước tiếp theo ra sao?", "Em làm gì để xây dựng tiếng nói chung giữa Dev và Designer ngay từ giai đoạn wireframe?"],
          tags: ["Collaboration", "Designer-Dev", "Conflict Resolution", "Negotiation"],
          rf: ["Tự ý cắt bỏ thiết kế mà không trao đổi với Designer", "Bảo thủ hoặc cãi vã thiếu tinh thần xây dựng"]
        },
        {
          q: "Khi Backend API chậm trễ tiến độ hoặc API trả về cấu trúc dữ liệu không tối ưu cho giao diện (nested quá sâu hoặc thiếu trường tính toán), em phối hợp với Backend Developer thế nào để không làm chậm tiến độ chung?",
          crit: ["Chủ động thống nhất hợp đồng API (API Contract / Swagger / OpenAPI) từ đầu sprint", "Sử dụng Mock API (MSW, MirageJS) để độc lập phát triển frontend trước", "Đóng góp ý kiến chuyên môn với backend về việc tối ưu payload hoặc áp dụng BFF (Backend for Frontend)"],
          fu: ["Nếu Backend không thể đổi cấu trúc do ảnh hưởng hệ thống cũ, em xử lý Adapter pattern ở Frontend thế nào?", "Làm sao để đảm bảo khi ráp API thật không bị phát sinh lỗi schema mismatch?"],
          tags: ["Backend Collaboration", "API Contract", "Mocking", "BFF"],
          rf: ["Ngồi chờ backend xong mới bắt đầu làm frontend", "Đổ lỗi cho backend khi tiến độ bị chậm"]
        },
        {
          q: "Trước ngày phát hành tính năng quan trọng chỉ 24 giờ, Product Owner yêu cầu bổ sung gấp một thay đổi giao diện làm xáo trộn luồng người dùng đã test kỹ. Em phản hồi và xử lý tình huống này thế nào?",
          crit: ["Bình tĩnh lắng nghe lý do kinh doanh đằng sau yêu cầu thay đổi", "Phân tích minh bạch rủi ro kỹ thuật: khả năng phát sinh bug hồi quy (regression), thời gian test không đủ", "Đưa ra các phương án lựa chọn: lùi lịch release 1-2 ngày để test kỹ, hoặc release phiên bản hiện tại rồi ra mắt thay đổi trong hotfix tiếp theo"],
          fu: ["Làm thế nào để từ chối một yêu cầu mà vẫn giữ được sự tin cậy từ phía Product Owner?", "Em rút ra kinh nghiệm gì về quy trình Change Management cho các sprint sau?"],
          tags: ["Stakeholder Management", "Scope Creep", "Risk Assessment", "Decision Making"],
          rf: ["Cả nể nhận làm gấp thâu đêm rồi release sản phẩm đầy lỗi", "Phản ứng gay gắt, từ chối thẳng thừng mà không giải thích rủi ro"]
        },
        {
          q: "Em tiếp cận và đánh giá một công nghệ / thư viện Frontend mới (ví dụ: một state manager mới, meta-framework mới) như thế nào trước khi quyết định đề xuất áp dụng vào sản phẩm của công ty?",
          crit: ["Đánh giá tính bền vững: cộng đồng, số lượng GitHub stars, tần suất bảo trì, corporate backing", "Đánh giá chi phí chuyển đổi: learning curve của đội ngũ, khả năng tương thích với code base hiện tại, độ rủi ro lock-in", "Thực hiện Proof of Concept (PoC) trong phạm vi nhỏ trước khi nhân rộng"],
          fu: ["Em từng đề xuất một công nghệ mới nào vào team chưa? Quá trình thuyết phục diễn ra thế nào?", "Khi một thư viện trong dự án bị tác giả ngừng duy trì (deprecated), kế hoạch ứng phó của em là gì?"],
          tags: ["Technology Evaluation", "PoC", "Decision Making", "Tech Debt"],
          rf: ["Chạy theo xu hướng vì công nghệ đó đang 'hot' trên mạng xã hội mà không quan tâm bài toán dự án", "Bảo thủ không muốn học hỏi công nghệ mới"]
        },
        {
          q: "Khi một thành viên Junior trong nhóm liên tục tạo Pull Request không đạt chuẩn (viết code lộn xộn, không tuân thủ conventions, thiếu xử lý lỗi), em thực hiện code review và hỗ trợ bạn ấy tiến bộ như thế nào?",
          crit: ["Review mang tính xây dựng: giải thích lý do 'tại sao' nên viết như vậy thay vì chỉ ra lệnh", "Thiết lập công cụ tự động hóa (ESLint, Prettier, Husky, CI check) để giảm tải việc bắt lỗi cú pháp thủ công", "Dành thời gian 1-on-1 hoặc pair-programming để hướng dẫn tư duy thiết kế"],
          fu: ["Làm sao để cân bằng giữa việc review kỹ và giữ nhịp độ release của sprint?", "Nếu Junior đó có thái độ tự ái khi nhận góp ý, em giải quyết ra sao?"],
          tags: ["Mentorship", "Code Review", "Teamwork", "Empathy"],
          rf: ["Dùng lời lẽ chỉ trích, hạ thấp đồng nghiệp trên PR", "Tự tay sửa hết code cho xong thay vì hướng dẫn bạn tự sửa"]
        }
      ]
    }
  }
];

console.log("Web Mobile Data sample ready for expansion.");
