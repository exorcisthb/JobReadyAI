import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: Lập trình Web & Mobile (7 vị trí - 210 câu hỏi)
export const webMobileQuestionBanks: RoleQuestionBank[] = [
    {
      "role": "Frontend Developer",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "frontend developer",
        "frontend engineer",
        "front-end developer",
        "lap trinh vien frontend",
        "fe dev"
      ],
      "questions": [
        {
          "id": "FE-FOUND-01",
          "role": "Frontend Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong Frontend Developer, phân biệt Virtual DOM, React, Reconciliation, Diffing; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của Virtual DOM.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc Frontend Developer."
          ],
          "followUps": [
            "Nếu phải giải thích Virtual DOM cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "Virtual DOM",
            "React",
            "Reconciliation",
            "Diffing"
          ],
          "sourceRefs": [
            "https://react.dev",
            "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "FE-FOUND-02",
          "role": "Frontend Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Phân biệt sâu sắc giữa Server-Side Rendering (SSR), Static Site Generation (SSG), Client-Side Rendering (CSR) và Incremental Static Regeneration (ISR). Tiêu chuẩn nào quyết định lựa chọn kiến trúc render?",
          "evaluationCriteria": [
            "Phân tích được trade-off giữa Time to First Byte (TTFB) và First Contentful Paint (FCP)",
            "Nêu rõ ảnh hưởng của từng mô hình render đối với SEO và chỉ số Core Web Vitals",
            "Đưa ra use-case chuẩn xác: Dashboard (CSR), Báo chí/Blog (SSG), E-commerce biến động giá (SSR/ISR)"
          ],
          "followUps": [
            "Hydration mismatch trong Next.js xảy ra do nguyên nhân nào và cách khắc phục?",
            "Streaming SSR với React Server Components hoạt động ra sao?"
          ],
          "tags": [
            "SSR",
            "SSG",
            "CSR",
            "ISR",
            "Next.js"
          ],
          "sourceRefs": [
            "https://nextjs.org/docs",
            "https://web.dev/explore/fast"
          ],
          "redFlags": [
            "Mặc định cho rằng SSR là phương pháp tối ưu cho mọi loại trang web"
          ]
        },
        {
          "id": "FE-FOUND-03",
          "role": "Frontend Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "CSS Box Model hoạt động như thế nào? Sự khác biệt giữa content-box và border-box là gì, và tại sao reset CSS hầu như luôn gán box-sizing: border-box?",
          "evaluationCriteria": [
            "Trình bày chính xác 4 lớp: content, padding, border, margin",
            "Cách tính toán width/height thực tế của phần tử trong từng chế độ box-sizing",
            "Hiểu hiện tượng margin collapsing và các điều kiện xảy ra"
          ],
          "followUps": [
            "Block Formatting Context (BFC) là gì và làm thế nào để tạo ra một BFC?",
            "Thuộc tính margin âm (negative margin) hoạt động như thế nào trong layout?"
          ],
          "tags": [
            "CSS",
            "Box Model",
            "Layout",
            "BFC"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model"
          ],
          "redFlags": [
            "Nhầm lẫn giữa padding và margin khi tính toán kích thước tổng"
          ]
        },
        {
          "id": "FE-FOUND-04",
          "role": "Frontend Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trình duyệt thực thi Critical Rendering Path (CRP) từ lúc nhận file HTML đến khi hiển thị pixel lên màn hình qua những bước nào? Kỹ thuật nào giúp giảm render-blocking resources?",
          "evaluationCriteria": [
            "Trình bày đủ 6 bước: HTML parse -> DOM, CSS parse -> CSSOM, Render Tree, Layout/Reflow, Paint, Composite",
            "Chỉ rõ vai trò của parser-blocking script và render-blocking stylesheet",
            "Phân biệt thuộc tính async và defer trong thẻ script"
          ],
          "followUps": [
            "Thuộc tính CSS nào kích hoạt GPU compositing mà không gây reflow/repaint?",
            "Làm thế nào để tối ưu chỉ số LCP dựa trên hiểu biết về CRP?"
          ],
          "tags": [
            "Critical Rendering Path",
            "Browser Internals",
            "Web Performance",
            "Reflow"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path"
          ],
          "redFlags": [
            "Nghĩ rằng JavaScript chỉ chạy sau khi toàn bộ giao diện đã hoàn thành paint"
          ]
        },
        {
          "id": "FE-FOUND-05",
          "role": "Frontend Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Giải thích cơ chế Closure và Lexical Scope trong JavaScript. Nêu ví dụ thực tế em đã ứng dụng Closure và cách phòng tránh rò rỉ bộ nhớ (memory leak)?",
          "evaluationCriteria": [
            "Định nghĩa chuẩn: hàm ghi nhớ phạm vi bao bọc nó ngay cả khi thực thi ngoài phạm vi đó",
            "Lấy ví dụ ứng dụng thực tế: debounce/throttle, function factory hoặc private variables",
            "Chỉ ra nguyên nhân rò rỉ bộ nhớ do giữ tham chiếu DOM hoặc interval không được dọn dẹp"
          ],
          "followUps": [
            "V8 Garbage Collector thu hồi bộ nhớ của Closure dựa trên nguyên lý nào?",
            "Scope Chain khác gì với Prototype Chain?"
          ],
          "tags": [
            "JavaScript",
            "Closure",
            "Scope",
            "Memory Management"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"
          ],
          "redFlags": [
            "Nhầm lẫn Closure với Callback thông thường"
          ]
        },
        {
          "id": "FE-FOUND-06",
          "role": "Frontend Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Accessibility (a11y) theo tiêu chuẩn WCAG yêu cầu những yếu tố cốt lõi nào? Làm thế nào để một Modal dialog hỗ trợ hoàn hảo người dùng bàn phím và Screen Reader?",
          "evaluationCriteria": [
            "Hiểu các nguyên tắc WCAG (Perceivable, Operable, Understandable, Robust)",
            "Xử lý Focus Trapping bên trong modal khi mở và trả lại focus khi đóng",
            "Sử dụng đúng ARIA attributes (role='dialog', aria-modal='true', aria-labelledby) và hỗ trợ phím Escape"
          ],
          "followUps": [
            "Khi nào nên dùng HTML5 Semantic elements thay vì lạm dụng ARIA roles?",
            "Làm thế nào để kiểm thử tự động accessibility trong pipeline CI/CD?"
          ],
          "tags": [
            "Accessibility",
            "WCAG",
            "ARIA",
            "Focus Trap"
          ],
          "sourceRefs": [
            "https://www.w3.org/WAI/standards-guidelines/wcag/"
          ],
          "redFlags": [
            "Xem nhẹ accessibility, chỉ bọc các phần tử bằng thẻ div không ngữ nghĩa"
          ]
        },
        {
          "id": "FE-SKILL-01",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng React (useCallback, useMemo, React.memo, Profiler) cho Frontend Developer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng React ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "React",
            "useCallback",
            "useMemo",
            "React.memo",
            "Profiler"
          ],
          "sourceRefs": [
            "https://react.dev"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "FE-SKILL-02",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập Frontend Developer: dựa trên React Query, phối hợp Zustand, State Management, Server State; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "React Query",
            "Zustand",
            "State Management",
            "Server State"
          ],
          "sourceRefs": [
            "https://tanstack.com/query/latest"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "FE-SKILL-03",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Khi hiển thị danh sách lớn (10.000+ bản ghi), em áp dụng kỹ thuật Windowing / Virtual List như thế nào? Cách xử lý các item có chiều cao động (dynamic height)?",
          "evaluationCriteria": [
            "Hiểu nguyên lý chỉ render các DOM node nằm trong khung nhìn (viewport) kèm overscan",
            "Sử dụng thư viện như @tanstack/react-virtual hoặc react-window",
            "Xử lý đo đạc kích thước động qua ResizeObserver và duy trì vị trí cuộn (scroll restoration)"
          ],
          "followUps": [
            "Làm sao để tính năng tìm kiếm Ctrl+F hoặc Screen Reader hoạt động tốt với Virtual List?",
            "Intersection Observer API hỗ trợ gì cho infinite scrolling?"
          ],
          "tags": [
            "Virtual List",
            "DOM Optimization",
            "ResizeObserver",
            "Performance"
          ],
          "sourceRefs": [
            "https://tanstack.com/virtual/latest"
          ],
          "redFlags": [
            "Đề xuất render toàn bộ 10.000 phần tử vào DOM rồi ẩn đi bằng CSS"
          ]
        },
        {
          "id": "FE-SKILL-04",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Quy trình xây dựng Design System hoặc Component Library dùng chung trong dự án của em gồm những bước nào? Cách cấu trúc Design Tokens và Compound Components?",
          "evaluationCriteria": [
            "Xác định hệ thống Design Tokens (màu sắc, typography, spacing, elevation)",
            "Áp dụng Compound Component pattern để linh hoạt tùy biến giao diện",
            "Tài liệu hóa bằng Storybook, viết unit test với Testing Library và visual regression test"
          ],
          "followUps": [
            "Làm thế nào để quản lý SemVer và breaking changes khi cập nhật component cho nhiều dự án?",
            "Cách xử lý override style mà không phá vỡ tính đóng gói của component?"
          ],
          "tags": [
            "Design System",
            "Storybook",
            "Component Pattern",
            "Design Tokens"
          ],
          "sourceRefs": [
            "https://storybook.js.org/docs"
          ],
          "redFlags": [
            "Hardcode mã màu hoặc kích thước trực tiếp trong component thay vì dùng tokens"
          ]
        },
        {
          "id": "FE-SKILL-05",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em xử lý Authentication và lưu trữ Token (Access Token & Refresh Token) ở Frontend như thế nào để vừa an toàn trước XSS vừa phòng chống CSRF?",
          "evaluationCriteria": [
            "Phân tích rủi ro khi lưu token trong LocalStorage (dễ bị tấn công XSS đánh cắp)",
            "Đề xuất lưu Refresh Token trong HttpOnly SameSite Cookie, Access Token trong memory",
            "Thiết lập Axios/Fetch Interceptor tự động bắt mã lỗi 401, gọi refresh token và replay lại request"
          ],
          "followUps": [
            "Nếu 5 API đồng thời trả về lỗi 401 cùng lúc, làm sao để chỉ gọi refresh token đúng 1 lần duy nhất?",
            "Cơ chế PKCE trong OAuth2 dành cho Single Page Apps hoạt động như thế nào?"
          ],
          "tags": [
            "Authentication",
            "Security",
            "XSS",
            "CSRF",
            "Axios Interceptor"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10"
          ],
          "redFlags": [
            "Lưu Access Token và Refresh Token lâu dài vào LocalStorage mà không nhận thức rủi ro XSS"
          ]
        },
        {
          "id": "FE-SKILL-06",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược phân tích và tối ưu Bundle Size trong dự án web hiện đại của em là gì? Em sử dụng công cụ nào và áp dụng Code Splitting ra sao?",
          "evaluationCriteria": [
            "Dùng Webpack Bundle Analyzer hoặc Rollup Visualizer để phát hiện package phình to",
            "Áp dụng Route-based Code Splitting (React.lazy, Suspense, Dynamic Import)",
            "Tree-shaking hiệu quả với ES Modules, thay thế các thư viện cồng kềnh (vd: Lodash/Moment bằng date-fns)"
          ],
          "followUps": [
            "Tại sao cú pháp CommonJS (require) cản trở Tree-shaking?",
            "Modern image formats (AVIF, WebP) và responsive srcset đóng góp gì cho FCP?"
          ],
          "tags": [
            "Bundle Size",
            "Code Splitting",
            "Tree Shaking",
            "Vite",
            "Webpack"
          ],
          "sourceRefs": [
            "https://web.dev/explore/fast"
          ],
          "redFlags": [
            "Import toàn bộ thư viện lớn chỉ để sử dụng một hàm tiện ích đơn giản"
          ]
        },
        {
          "id": "FE-SKILL-07",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em thiết lập chiến lược kiểm thử (Testing Strategy) cho Frontend như thế nào? Sự khác biệt về vai trò giữa Unit Test, Component Integration Test và End-to-End (E2E) Test?",
          "evaluationCriteria": [
            "Tuân thủ Testing Trophy: ưu tiên Integration Test với React Testing Library theo hành vi người dùng",
            "Unit test cho helper, utility functions, custom hooks cô lập",
            "E2E test với Playwright/Cypress cho các luồng nghiệp vụ quan trọng (Checkout, Login)"
          ],
          "followUps": [
            "Làm thế nào để mock API gọi từ server bằng MSW (Mock Service Worker)?",
            "Khi nào nên viết Snapshot testing và rủi ro của việc lạm dụng snapshot?"
          ],
          "tags": [
            "Testing",
            "React Testing Library",
            "Playwright",
            "MSW"
          ],
          "sourceRefs": [
            "https://testing-library.com/docs/react-testing-library/intro/"
          ],
          "redFlags": [
            "Kiểm thử bằng cách assert state nội bộ của component thay vì kiểm tra giao diện hiển thị cho người dùng"
          ]
        },
        {
          "id": "FE-SKILL-08",
          "role": "Frontend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi xây dựng tính năng real-time (như chat hoặc thông báo) bằng WebSocket hoặc Server-Sent Events (SSE), em quản lý kết nối, heartbeat và reconnection ra sao?",
          "evaluationCriteria": [
            "Phân biệt được use-case của SSE (một chiều từ server) và WebSocket (hai chiều)",
            "Cơ chế Exponential Backoff algorithm khi tái kết nối",
            "Quản lý đóng kết nối khi component unmount để tránh rò rỉ socket và xử lý mất gói tin"
          ],
          "followUps": [
            "Làm sao để đảm bảo tin nhắn không bị trùng lặp hoặc nhảy thứ tự khi client reconnect?",
            "Cơ chế Ping/Pong heartbeat giải quyết vấn đề zombie connection thế nào?"
          ],
          "tags": [
            "WebSocket",
            "SSE",
            "Realtime",
            "Exponential Backoff"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket"
          ],
          "redFlags": [
            "Tự động reconnect liên tục không có khoảng nghỉ dẫn đến tấn công từ chối dịch vụ vô tình lên server"
          ]
        },
        {
          "id": "FE-SCEN-01",
          "role": "Frontend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại Frontend Developer, khi DevTools Profiler cùng Performance, Web Worker, Long Tasks xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "DevTools Profiler",
            "Performance",
            "Web Worker",
            "Long Tasks"
          ],
          "sourceRefs": [
            "https://web.dev/explore/fast",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "FE-SCEN-02",
          "role": "Frontend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Trang thương mại điện tử bị chỉ số Cumulative Layout Shift (CLS) kém trên thiết bị di động khiến người dùng bấm nhầm nút khi ảnh và quảng cáo tải xong. Em khắc phục triệt để ra sao?",
          "evaluationCriteria": [
            "Quy định kích thước cứng width/height hoặc aspect-ratio bằng CSS cho ảnh và video",
            "Dành sẵn không gian (skeleton placeholder) cho các banner quảng cáo hoặc nội dung tải chậm",
            "Dùng font-display: optional hoặc swap kết hợp font metrics override để tránh layout shift do font"
          ],
          "followUps": [
            "Làm thế nào để debug CLS bằng PerformanceObserver API?",
            "Core Web Vitals INP (Interaction to Next Paint) bị ảnh hưởng thế nào nếu main thread bị nghẽn?"
          ],
          "tags": [
            "CLS",
            "Core Web Vitals",
            "Aspect Ratio",
            "Web Performance"
          ],
          "sourceRefs": [
            "https://web.dev/explore/fast",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ nén ảnh mà không cấp phát không gian hiển thị cố định trước cho ảnh"
          ]
        },
        {
          "id": "FE-SCEN-03",
          "role": "Frontend Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Sau khi release phiên bản web mới lên production, nhiều khách hàng vẫn tải phiên bản JavaScript cũ từ cache của trình duyệt dẫn đến lỗi gọi API không tương thích. Em thiết kế giải pháp cache busting ra sao?",
          "evaluationCriteria": [
            "Cấu hình Cache-Control headers: index.html để no-cache/must-revalidate, các file assets có content-hash để immutable",
            "Triển khai Service Worker kiểm tra phiên bản mới định kỳ hoặc qua version.json",
            "Hiển thị thông báo Toast: 'Đã có phiên bản mới, bấm để cập nhật' kèm logic reload an toàn"
          ],
          "followUps": [
            "Làm thế nào để Service Worker kích hoạt ngay lập tức với skipWaiting() mà không làm hỏng state đang chạy?",
            "Tại sao không bao giờ nên cache file index.html vĩnh viễn ở CDN?"
          ],
          "tags": [
            "Cache Busting",
            "Service Worker",
            "Cache-Control",
            "Deployment"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Yêu cầu người dùng bấm Ctrl + F5 thủ công để xóa cache"
          ]
        },
        {
          "id": "FE-SCEN-04",
          "role": "Frontend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Một biểu mẫu đăng ký hồ sơ gồm 5 bước (Multi-step Form) có hơn 40 trường dữ liệu và nhiều trường phụ thuộc nhau. Em tổ chức state, validation và cơ chế lưu nháp (draft) tự động như thế nào?",
          "evaluationCriteria": [
            "Sử dụng React Hook Form để hạn chế re-render toàn bộ form",
            "Tách schema validation bằng Zod/Yup theo từng bước và gộp thành tổng thể",
            "Lưu tự động vào LocalStorage/IndexedDB có debounce, xóa bản nháp khi submit thành công"
          ],
          "followUps": [
            "Làm sao để xử lý upload file tạm thời trong luồng lưu nháp nhiều bước?",
            "Cách cấu trúc form step để hỗ trợ deep linking (URL query param cho từng step)?"
          ],
          "tags": [
            "React Hook Form",
            "Zod",
            "Multi-step Form",
            "LocalStorage"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Dùng useState riêng lẻ cho 40 trường dữ liệu dẫn đến re-render liên tục trên mọi thao tác gõ phím"
          ]
        },
        {
          "id": "FE-SCEN-05",
          "role": "Frontend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Ứng dụng hỗ trợ Dark/Light mode nhưng người dùng bị hiện tượng Flash of Unstyled Content (FOUC) - màn hình chớp trắng sáng trước khi chuyển sang nền tối khi reload trang. Em xử lý thế nào?",
          "evaluationCriteria": [
            "Chèn một script nhỏ đồng bộ ở phần đầu thẻ `<head>` trước khi DOM hiển thị để đọc localStorage/system preference",
            "Gán class `.dark` lên thẻ `<html>` ngay lập tức trước khi render body",
            "Dùng CSS variables cho màu sắc hệ thống để chuyển đổi theme tức thời không phụ thuộc React render"
          ],
          "followUps": [
            "Làm sao để đồng bộ theme mượt mà với tùy chọn Dark Mode của hệ điều hành bằng CSS media query?",
            "Next-themes giải quyết vấn đề hydration mismatch với theme ra sao?"
          ],
          "tags": [
            "FOUC",
            "Dark Mode",
            "CSS Variables",
            "Render Blocking Script"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Dùng useEffect ở client để gán dark mode dẫn đến màn hình nhấp nháy sáng trắng trước khi chuyển đen"
          ]
        },
        {
          "id": "FE-SCEN-06",
          "role": "Frontend Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Người dùng bấm nút thanh toán nhiều lần do mạng chập chờn dẫn đến nguy cơ gửi nhiều request trừ tiền trùng lặp. Em ngăn chặn điều này ở phía client và phối hợp với backend ra sao?",
          "evaluationCriteria": [
            "Disable và chuyển nút sang loading state ngay sau click đầu tiên",
            "Tạo Idempotency Key (UUID) cho mỗi phiên thanh toán gửi kèm header request",
            "Hiển thị thông báo trạng thái rõ ràng, ngăn người dùng back trang hoặc refresh trong lúc giao dịch đang xử lý"
          ],
          "followUps": [
            "Nếu request timeout nhưng phía server đã trừ tiền thì client nên hiển thị trạng thái gì?",
            "Tại sao chặn click ở client là chưa đủ nếu không có idempotency key ở server?"
          ],
          "tags": [
            "Idempotency",
            "Payment Flow",
            "Race Condition",
            "Network Resilience"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ dựa vào việc disable nút bấm bằng CSS mà không có cơ chế chặn logic hoặc idempotency key"
          ]
        },
        {
          "id": "FE-CV-01",
          "role": "Frontend Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong dự án Frontend gần nhất trên CV, kiến trúc component và luồng dữ liệu (data flow) lớn nhất mà em trực tiếp thiết kế là gì? Những quyết định kỹ thuật nào em đưa ra đã mang lại hiệu quả rõ rệt?",
          "evaluationCriteria": [
            "Mô tả cụ thể bối cảnh dự án, sơ đồ luồng dữ liệu và ranh giới trách nhiệm giữa các module",
            "Nêu rõ trade-off khi chọn công nghệ/pattern thay vì giải pháp khác",
            "Có số liệu hoặc kết quả định lượng: giảm thời gian render, tăng tốc độ dev, tái sử dụng component"
          ],
          "followUps": [
            "Nếu được làm lại từ đầu dự án đó với kiến thức hiện tại, em sẽ thay đổi quyết định nào?",
            "Đâu là đoạn code em tự hào nhất trong dự án đó?"
          ],
          "tags": [
            "Architecture",
            "Component Design",
            "System Decisions",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nói chung chung lý thuyết, không nhớ cấu trúc thư mục hoặc luồng dữ liệu của chính dự án mình làm"
          ]
        },
        {
          "id": "FE-CV-02",
          "role": "Frontend Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em ghi thành thạo TypeScript. Em hãy chia sẻ một trường hợp thực tế em phải dùng Generic phức tạp, Conditional Types, hoặc Mapped Types để đảm bảo Type-safety cho dự án?",
          "evaluationCriteria": [
            "Trình bày được use-case thực tế: typing cho dynamic form, API client response handler, hoặc event emitter",
            "Hiểu từ khóa infer, keyof, typeof và phân biệt giữa type vs interface",
            "Giải thích cách tránh việc lạm dụng any hoặc unknown bừa bãi"
          ],
          "followUps": [
            "Làm thế nào để Type Narrowing với Discriminated Unions trong TypeScript?",
            "Tại sao nên hạn chế Type Assertion (as Type)?"
          ],
          "tags": [
            "TypeScript",
            "Generics",
            "Type Safety",
            "Utility Types"
          ],
          "sourceRefs": [
            "https://www.typescriptlang.org/docs",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ghi thạo TypeScript trên CV nhưng trong dự án toàn dùng any để bypass lỗi biên dịch"
          ]
        },
        {
          "id": "FE-CV-03",
          "role": "Frontend Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em ghi nhận đã từng tối ưu Core Web Vitals hoặc tốc độ tải trang trong dự án. Em đã xuất phát từ chỉ số đo lường nào trước khi tối ưu và kết quả cụ thể đạt được sau đó là gì?",
          "evaluationCriteria": [
            "Chỉ rõ công cụ đo: Lighthouse, Web Vitals Chrome Extension, RUM (Real User Monitoring)",
            "Liệt kê số liệu trước và sau (ví dụ: LCP từ 4.2s xuống 1.8s, CLS từ 0.25 xuống 0.02)",
            "Nêu chính xác các kỹ thuật cốt lõi đã áp dụng để đạt được con số đó"
          ],
          "followUps": [
            "Có sự chênh lệch nào giữa dữ liệu Lab test (Lighthouse máy dev) và Field test (người dùng thật) không?",
            "Em duy trì hiệu năng đó thế nào để không bị suy giảm theo các sprint sau?"
          ],
          "tags": [
            "Web Vitals",
            "Optimization Metric",
            "Case Study",
            "CV Verification"
          ],
          "sourceRefs": [
            "https://web.dev/explore/fast",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra số liệu ảo không có căn cứ hoặc không giải thích được kỹ thuật tương ứng đã thực hiện"
          ]
        },
        {
          "id": "FE-CV-04",
          "role": "Frontend Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em hãy kể về một bug khó nhất liên quan đến Frontend (ví dụ: memory leak, race condition, lỗi chỉ bị trên Safari/iOS) mà em từng gặp trong quá trình làm việc. Em đã dùng quy trình nào để tái hiện và fix triệt để?",
          "evaluationCriteria": [
            "Trình bày mạch lạc: triệu chứng -> giả thuyết -> phương pháp cô lập -> nguyên nhân gốc -> giải pháp",
            "Biết sử dụng debugger, network throttling, memory heap snapshot để tìm manh mối",
            "Rút ra bài học hoặc viết regression test để ngăn lỗi tái diễn"
          ],
          "followUps": [
            "Tại sao bug đó lại lọt qua được khâu dev và test ban đầu?",
            "Làm thế nào để debug một lỗi chỉ xảy ra trên Safari trên máy tính Windows nếu không có máy Mac?"
          ],
          "tags": [
            "Troubleshooting",
            "Debugging",
            "Cross-browser",
            "Memory Leak"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Mô tả bug quá sơ sài hoặc nói 'chưa bao giờ gặp bug khó'"
          ]
        },
        {
          "id": "FE-CV-05",
          "role": "Frontend Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi làm việc với các bên thứ ba (Third-party SDK) như Google Maps, Stripe, Live Chat widget, dự án trên CV của em đã gặp những thách thức gì về bảo mật, hiệu năng hoặc xung đột script?",
          "evaluationCriteria": [
            "Kỹ thuật tải không đồng bộ (asynchronous script loading) và lazy load khi người dùng cuộn đến vị trí cần thiết",
            "Bảo vệ khóa bí mật và thiết lập Content Security Policy (CSP) cho phép domain bên thứ ba",
            "Xử lý fallback khi SDK bên thứ ba bị chặn bởi AdBlocker hoặc mất kết nối"
          ],
          "followUps": [
            "Làm sao để đo lường mức độ ảnh hưởng của script bên thứ ba lên Total Blocking Time (TBT)?",
            "Iframe vs Direct Script: ưu nhược điểm khi nhúng widget ngoài?"
          ],
          "tags": [
            "Third-party Integration",
            "CSP",
            "AdBlocker Resilience",
            "SDK"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nhúng trực tiếp script đồng bộ vào thẻ `<head>` mà không lường trước hậu quả chặn render"
          ]
        },
        {
          "id": "FE-BEHAV-01",
          "role": "Frontend Developer",
          "category": "behavioral",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Khi nhận bản thiết kế từ UI/UX Designer chứa những hiệu ứng chuyển động rất phức tạp hoặc thành phần không tương thích với trải nghiệm trên thiết bị di động, em trao đổi và làm việc với Designer thế nào?",
          "evaluationCriteria": [
            "Tôn trọng thẩm mỹ của Designer nhưng phân tích dựa trên dữ liệu kỹ thuật và trải nghiệm người dùng thực tế",
            "Chủ động đề xuất giải pháp thay thế khả thi (alternative) kèm bản demo nhỏ",
            "Cùng Designer thống nhất phiên bản MVP trước khi đầu tư animation cầu kỳ"
          ],
          "followUps": [
            "Nếu Designer kiên quyết giữ ý kiến của họ, em xử lý bước tiếp theo ra sao?",
            "Em làm gì để xây dựng tiếng nói chung giữa Dev và Designer ngay từ giai đoạn wireframe?"
          ],
          "tags": [
            "Collaboration",
            "Designer-Dev",
            "Conflict Resolution",
            "Negotiation"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tự ý cắt bỏ thiết kế mà không trao đổi với Designer"
          ]
        },
        {
          "id": "FE-BEHAV-02",
          "role": "Frontend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi Backend API chậm trễ tiến độ hoặc API trả về cấu trúc dữ liệu không tối ưu cho giao diện (nested quá sâu hoặc thiếu trường tính toán), em phối hợp với Backend Developer thế nào để không làm chậm tiến độ chung?",
          "evaluationCriteria": [
            "Chủ động thống nhất hợp đồng API (API Contract / Swagger / OpenAPI) từ đầu sprint",
            "Sử dụng Mock API (MSW, MirageJS) để độc lập phát triển frontend trước",
            "Đóng góp ý kiến chuyên môn với backend về việc tối ưu payload hoặc áp dụng BFF (Backend for Frontend)"
          ],
          "followUps": [
            "Nếu Backend không thể đổi cấu trúc do ảnh hưởng hệ thống cũ, em xử lý Adapter pattern ở Frontend thế nào?",
            "Làm sao để đảm bảo khi ráp API thật không bị phát sinh lỗi schema mismatch?"
          ],
          "tags": [
            "Backend Collaboration",
            "API Contract",
            "Mocking",
            "BFF"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ngồi chờ backend xong mới bắt đầu làm frontend hoặc đổ lỗi cho backend khi chậm tiến độ"
          ]
        },
        {
          "id": "FE-BEHAV-03",
          "role": "Frontend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trước ngày phát hành tính năng quan trọng chỉ 24 giờ, Product Owner yêu cầu bổ sung gấp một thay đổi giao diện làm xáo trộn luồng người dùng đã test kỹ. Em phản hồi và xử lý tình huống này thế nào?",
          "evaluationCriteria": [
            "Bình tĩnh lắng nghe lý do kinh doanh đằng sau yêu cầu thay đổi",
            "Phân tích minh bạch rủi ro kỹ thuật: khả năng phát sinh bug hồi quy (regression), thời gian test không đủ",
            "Đưa ra các phương án lựa chọn: lùi lịch release 1-2 ngày để test kỹ, hoặc release phiên bản hiện tại rồi ra mắt thay đổi trong hotfix tiếp theo"
          ],
          "followUps": [
            "Làm thế nào để từ chối một yêu cầu mà vẫn giữ được sự tin cậy từ phía Product Owner?",
            "Em rút ra kinh nghiệm gì về quy trình Change Management cho các sprint sau?"
          ],
          "tags": [
            "Stakeholder Management",
            "Scope Creep",
            "Risk Assessment",
            "Decision Making"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cả nể nhận làm gấp thâu đêm rồi release sản phẩm đầy lỗi"
          ]
        },
        {
          "id": "FE-BEHAV-04",
          "role": "Frontend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em tiếp cận và đánh giá một công nghệ hoặc thư viện Frontend mới (ví dụ: một state manager mới, meta-framework mới) như thế nào trước khi quyết định đề xuất áp dụng vào sản phẩm của công ty?",
          "evaluationCriteria": [
            "Đánh giá tính bền vững: cộng đồng, số lượng GitHub stars, tần suất bảo trì, corporate backing",
            "Đánh giá chi phí chuyển đổi: learning curve của đội ngũ, khả năng tương thích với code base hiện tại, độ rủi ro lock-in",
            "Thực hiện Proof of Concept (PoC) trong phạm vi nhỏ trước khi nhân rộng"
          ],
          "followUps": [
            "Em từng đề xuất một công nghệ mới nào vào team chưa? Quá trình thuyết phục diễn ra thế nào?",
            "Khi một thư viện trong dự án bị tác giả ngừng duy trì (deprecated), kế hoạch ứng phó của em là gì?"
          ],
          "tags": [
            "Technology Evaluation",
            "PoC",
            "Decision Making",
            "Tech Debt"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chạy theo xu hướng vì công nghệ đó đang 'hot' trên mạng xã hội mà không quan tâm bài toán dự án"
          ]
        },
        {
          "id": "FE-BEHAV-05",
          "role": "Frontend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi một thành viên Junior trong nhóm liên tục tạo Pull Request không đạt chuẩn (viết code lộn xộn, không tuân thủ conventions, thiếu xử lý lỗi), em thực hiện code review và hỗ trợ bạn ấy tiến bộ như thế nào?",
          "evaluationCriteria": [
            "Review mang tính xây dựng: giải thích lý do 'tại sao' nên viết như vậy thay vì chỉ ra lệnh",
            "Thiết lập công cụ tự động hóa (ESLint, Prettier, Husky, CI check) để giảm tải việc bắt lỗi cú pháp thủ công",
            "Dành thời gian 1-on-1 hoặc pair-programming để hướng dẫn tư duy thiết kế"
          ],
          "followUps": [
            "Làm sao để cân bằng giữa việc review kỹ và giữ nhịp độ release của sprint?",
            "Nếu Junior đó có thái độ tự ái khi nhận góp ý, em giải quyết ra sao?"
          ],
          "tags": [
            "Mentorship",
            "Code Review",
            "Teamwork",
            "Empathy"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Dùng lời lẽ chỉ trích, hạ thấp đồng nghiệp trên PR hoặc tự tay sửa hết code cho xong thay vì hướng dẫn bạn tự sửa"
          ]
        }
      ]
    },
    {
      "role": "Backend Developer",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "backend developer",
        "backend engineer",
        "back-end developer",
        "lap trinh vien backend",
        "be dev",
        "server developer"
      ],
      "questions": [
        {
          "id": "BE-FOUND-01",
          "role": "Backend Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong Backend Developer, phân biệt ACID, Database, Transaction Isolation, MVCC; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của ACID.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc Backend Developer."
          ],
          "followUps": [
            "Nếu phải giải thích ACID cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "ACID",
            "Database",
            "Transaction Isolation",
            "MVCC"
          ],
          "sourceRefs": [
            "https://www.postgresql.org/docs/current/transaction-iso.html"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "BE-FOUND-02",
          "role": "Backend Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Nguyên lý vận hành bên dưới của cấu trúc chỉ mục B-Tree và Hash Index trong cơ sở dữ liệu quan hệ là gì? Khi nào chỉ mục tổng hợp (Composite Index) không được sử dụng bởi Query Optimizer?",
          "evaluationCriteria": [
            "Hiểu B-Tree cân bằng độ cao O(log n), tối ưu cho truy vấn dải (range queries) và sắp xếp",
            "Nắm rõ nguyên tắc tiền tố bên trái nhất (Leftmost Prefix Rule) của Composite Index",
            "Giải thích chi phí ghi (write overhead) và phình to dung lượng khi tạo quá nhiều index"
          ],
          "followUps": [
            "Clustered Index và Non-Clustered Index khác nhau thế nào về lưu trữ con trỏ dữ liệu?",
            "Index Skip Scan là gì và hoạt động ra sao?"
          ],
          "tags": [
            "Indexing",
            "B-Tree",
            "SQL Optimization",
            "Database Internals"
          ],
          "sourceRefs": [
            "https://use-the-index-luke.com/"
          ],
          "redFlags": [
            "Nghĩ rằng gắn index vào tất cả các cột sẽ giúp hệ thống luôn nhanh"
          ]
        },
        {
          "id": "BE-FOUND-03",
          "role": "Backend Developer",
          "category": "foundation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Phân biệt giữa Concurrency và Parallelism. Kiến trúc Event Loop (Single-threaded I/O non-blocking) của Node.js khác với mô hình Thread-per-request của Java truyền thống và Goroutines (M:N scheduling) của Go như thế nào?",
          "evaluationCriteria": [
            "Phân biệt rạch ròi giữa Concurrency (xử lý nhiều việc cùng lúc) và Parallelism (chạy đồng thời vật lý)",
            "Giải thích cách Node.js xử lý I/O bound qua libuv và nhược điểm khi gặp CPU bound",
            "So sánh chi phí cấp phát bộ nhớ: Thread OS (~1MB) vs Goroutine (~2KB) vs Java Virtual Threads"
          ],
          "followUps": [
            "Cơ chế Work Stealing trong Go runtime scheduler hoạt động như thế nào?",
            "Làm thế nào để xử lý tác vụ tính toán nặng trong Node.js mà không làm đóng băng Event Loop?"
          ],
          "tags": [
            "Concurrency",
            "Event Loop",
            "Goroutines",
            "Thread Pool",
            "Go"
          ],
          "sourceRefs": [
            "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
          ],
          "redFlags": [
            "Nhầm lẫn giữa Concurrency và Parallelism hoặc cho rằng Node.js là multi-threaded hoàn toàn"
          ]
        },
        {
          "id": "BE-FOUND-04",
          "role": "Backend Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "So sánh giao thức truyền tải giữa RESTful (JSON qua HTTP/1.1) và gRPC (Protocol Buffers qua HTTP/2). Trường hợp nào nên sử dụng gRPC thay cho REST trong kiến trúc Backend?",
          "evaluationCriteria": [
            "Phân tích ưu thế của HTTP/2: multiplexing, header compression (HPACK), streaming 2 chiều",
            "Hiểu cơ chế serialize nhị phân gọn nhẹ của Protobuf so với văn bản JSON",
            "Chỉ ra use-case phù hợp: gRPC cho giao tiếp nội bộ giữa các Microservices, REST cho Public API client"
          ],
          "followUps": [
            "Làm thế nào để trình duyệt web gọi được dịch vụ gRPC qua gRPC-Web?",
            "Backward & Forward compatibility được quản lý thế nào trong Protocol Buffers?"
          ],
          "tags": [
            "gRPC",
            "REST",
            "HTTP/2",
            "Protocol Buffers",
            "Microservices"
          ],
          "sourceRefs": [
            "https://grpc.io/docs/what-is-grpc/core-concepts/"
          ],
          "redFlags": [
            "Cho rằng gRPC có thể thay thế hoàn toàn REST trong mọi tình huống bao gồm public web"
          ]
        },
        {
          "id": "BE-FOUND-05",
          "role": "Backend Developer",
          "category": "foundation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Định lý CAP và định lý PACELC giải thích sự đánh đổi trong hệ thống phân tán như thế nào? Giữa tính nhất quán mạnh (Strong Consistency) và tính nhất quán cuối cùng (Eventual Consistency), em chọn mô hình nào cho luồng thanh toán ví điện tử?",
          "evaluationCriteria": [
            "Giải thích CAP: Consistency, Availability, Partition Tolerance - không thể đạt cả 3 khi có network partition",
            "Giải thích PACELC: Khi có Partition thì chọn A hay C, Else thì chọn Latency hay Consistency",
            "Phân tích luồng thanh toán tài chính bắt buộc Strong Consistency để tránh chi tiêu trùng (Double spending)"
          ],
          "followUps": [
            "Thuật toán đồng thuận Raft giải quyết bài toán Leader Election và Log Replication thế nào?",
            "Cơ chế 2PC (Two-Phase Commit) có nhược điểm gì trong microservices?"
          ],
          "tags": [
            "CAP Theorem",
            "PACELC",
            "Distributed Systems",
            "Eventual Consistency"
          ],
          "sourceRefs": [
            "https://en.wikipedia.org/wiki/CAP_theorem"
          ],
          "redFlags": [
            "Khẳng định một hệ thống phân tán có thể đạt được cả 3 yếu tố C, A, P cùng lúc"
          ]
        },
        {
          "id": "BE-FOUND-06",
          "role": "Backend Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Bảo mật mật khẩu người dùng trong cơ sở dữ liệu: Tại sao không bao giờ được dùng MD5 hay SHA-256 thuần để hash mật khẩu? Các thuật toán như bcrypt, Argon2 và cơ chế Salt phòng chống tấn công Rainbow Table như thế nào?",
          "evaluationCriteria": [
            "Hiểu rằng SHA/MD5 được thiết kế để tính toán nhanh, dễ bị tấn công brute-force bằng GPU hiện đại",
            "Bcrypt và Argon2 tích hợp cost factor/work factor có thể điều chỉnh để làm chậm kẻ tấn công",
            "Salt ngẫu nhiên duy nhất cho mỗi tài khoản ngăn chặn hoàn toàn tấn công bằng Rainbow Table"
          ],
          "followUps": [
            "Argon2id vượt trội hơn bcrypt ở khả năng kháng tấn công bằng phần cứng chuyên dụng ASIC/GPU ra sao?",
            "Kỹ thuật Re-hashing mật khẩu khi nâng cấp cost factor diễn ra như thế nào?"
          ],
          "tags": [
            "Security",
            "Password Hashing",
            "bcrypt",
            "Argon2",
            "Salt"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10"
          ],
          "redFlags": [
            "Đề xuất mã hóa hai chiều mật khẩu (Reversible Encryption) thay vì dùng one-way salted hash"
          ]
        },
        {
          "id": "BE-SKILL-01",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng HikariCP (Connection Pooling, PostgreSQL, Database Optimization) cho Backend Developer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng HikariCP ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "HikariCP",
            "Connection Pooling",
            "PostgreSQL",
            "Database Optimization"
          ],
          "sourceRefs": [
            "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "BE-SKILL-02",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập Backend Developer: dựa trên Redis, phối hợp Caching Strategy, Cache Avalanche, Bloom Filter; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "Redis",
            "Caching Strategy",
            "Cache Avalanche",
            "Bloom Filter"
          ],
          "sourceRefs": [
            "https://redis.io/docs/latest/develop/use/patterns/"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "BE-SKILL-03",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Khi sử dụng Message Queue (Kafka hoặc RabbitMQ) cho xử lý bất đồng bộ, em thiết kế kiến trúc phân vùng (Partitioning), Consumer Group và cơ chế Idempotent Consumer ra sao để đảm bảo dữ liệu không bị trùng lặp hoặc mất mát?",
          "evaluationCriteria": [
            "Chọn Partition Key phù hợp để đảm bảo thứ tự xử lý dữ liệu cho từng thực thể (ví dụ: userId)",
            "Thiết kế Consumer lưu trữ Message ID đã xử lý vào DB có Unique Constraint hoặc Redis atomic SETNX",
            "Cấu hình ACK thủ công (Manual Acknowledgment) chỉ sau khi business logic hoàn tất"
          ],
          "followUps": [
            "Hiện tượng Consumer Lag là gì và làm sao để scale consumer mà không vi phạm quy tắc số partition?",
            "Dead Letter Queue (DLQ) được thiết lập thế nào khi tin nhắn lỗi liên tục?"
          ],
          "tags": [
            "Kafka",
            "Message Queue",
            "Idempotency",
            "Consumer Group"
          ],
          "sourceRefs": [
            "https://kafka.apache.org/documentation/#intro_concepts_and_terms"
          ],
          "redFlags": [
            "Mặc định tin tưởng message queue sẽ không bao giờ gửi trùng tin nhắn (at-least-once delivery)"
          ]
        },
        {
          "id": "BE-SKILL-04",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược quản lý Database Migration không gián đoạn dịch vụ (Zero-Downtime Migration) bằng Expand and Contract pattern khi cần đổi tên cột hoặc tách bảng lớn trong môi trường production?",
          "evaluationCriteria": [
            "Giai đoạn Expand: thêm cột mới, cập nhật code để ghi đồng thời cả 2 cột (Dual-write) và đọc từ cột cũ",
            "Giai đoạn Backfill: chạy background script copy dữ liệu cũ sang mới theo batch nhỏ",
            "Giai đoạn Contract: chuyển đọc sang cột mới hoàn toàn và drop cột cũ an toàn"
          ],
          "followUps": [
            "Tại sao việc chạy lệnh ALTER TABLE thêm NOT NULL không có DEFAULT trên bảng 50 triệu dòng có thể làm treo database?",
            "Công cụ như gh-ost hoặc pt-online-schema-change giải quyết khóa bảng ra sao?"
          ],
          "tags": [
            "Database Migration",
            "Zero-downtime",
            "Expand Contract",
            "Schema Design"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chạy trực tiếp câu lệnh DROP COLUMN hoặc RENAME COLUMN trực tiếp trên production đang chịu tải"
          ]
        },
        {
          "id": "BE-SKILL-05",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em xây dựng hệ thống Rate Limiting để bảo vệ API chống lạm dụng bằng thuật toán nào (Token Bucket, Leaky Bucket, Sliding Window Counter)? Cách triển khai phân tán với Redis?",
          "evaluationCriteria": [
            "So sánh: Token Bucket (hỗ trợ burst traffic), Leaky Bucket (tốc độ ra đều), Sliding Window (chính xác cao)",
            "Triển khai bằng Redis Sorted Set hoặc Redis Lua Script để đảm bảo tính nguyên tử (Atomicity)",
            "Trả về HTTP Status Code 429 Too Many Requests kèm header Retry-After và X-RateLimit-Remaining"
          ],
          "followUps": [
            "Làm thế nào để tránh race condition khi nhiều request từ cùng một user đến các server khác nhau?",
            "Tiered Rate Limiting theo cấp bậc tài khoản (Free vs Pro) được cấu hình thế nào?"
          ],
          "tags": [
            "Rate Limiting",
            "Token Bucket",
            "Redis Lua",
            "API Protection"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Lưu đếm rate limit trong memory của từng instance máy chủ đơn lẻ thay vì tập trung hóa"
          ]
        },
        {
          "id": "BE-SKILL-06",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong kiến trúc Microservices, khi một nghiệp vụ trải dài qua 3 dịch vụ khác nhau (Order, Payment, Inventory), em áp dụng Saga Pattern theo mô hình Choreography hay Orchestration? Cách thiết kế Compensating Transactions (giao dịch bù trừ)?",
          "evaluationCriteria": [
            "Choreography: dịch vụ phát event qua Message Bus, phù hợp hệ thống đơn giản ít service",
            "Orchestration: có dịch vụ Saga Orchestrator quản lý state machine và điều phối, dễ debug và kiểm soát",
            "Compensating Transaction: hoàn trả trạng thái khi có bước thất bại (ví dụ: hoàn tiền nếu kho hết hàng)"
          ],
          "followUps": [
            "Saga giải quyết bài toán thiếu tính Isolation trong ACID như thế nào?",
            "Làm sao để đảm bảo Saga Orchestrator không trở thành điểm nghẽn đơn độc (Single Point of Failure)?"
          ],
          "tags": [
            "Saga Pattern",
            "Microservices",
            "Compensating Transaction",
            "Distributed Architecture"
          ],
          "sourceRefs": [
            "https://microservices.io/patterns/data/saga.html"
          ],
          "redFlags": [
            "Nhầm lẫn Saga với 2-Phase Commit hoặc không chuẩn bị phương án hoàn tác khi bước sau bị lỗi"
          ]
        },
        {
          "id": "BE-SKILL-07",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em thiết lập hệ thống Observability cho Backend bao gồm Structured Logging, Distributed Tracing (OpenTelemetry) và Metrics (Prometheus) như thế nào để phát hiện nút thắt cổ chai?",
          "evaluationCriteria": [
            "Gắn Trace ID và Span ID xuyên suốt các microservices qua HTTP headers (W3C TraceContext)",
            "Ghi log theo định dạng JSON có ngữ cảnh (userId, requestId, durationMs) thay vì ghi plain text",
            "Thiết lập chỉ số RED (Rate, Errors, Duration) và USE (Utilization, Saturation, Errors) cho services"
          ],
          "followUps": [
            "Lấy mẫu log và trace (Sampling Rate) được cấu hình ra sao để tiết kiệm chi phí lưu trữ?",
            "Sự khác biệt giữa Liveness Probe và Readiness Probe trong Kubernetes đối với backend service?"
          ],
          "tags": [
            "OpenTelemetry",
            "Distributed Tracing",
            "Prometheus",
            "Observability"
          ],
          "sourceRefs": [
            "https://opentelemetry.io/docs/concepts/observability-primer/"
          ],
          "redFlags": [
            "Chỉ dùng console.log truyền thống không có cấu trúc hoặc không thể trace luồng qua nhiều service"
          ]
        },
        {
          "id": "BE-SKILL-08",
          "role": "Backend Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược kiểm thử tự động cho Backend: Em viết Unit Test và Integration Test như thế nào? Cách sử dụng Testcontainers để kiểm thử tích hợp với database thật thay vì dùng H2 in-memory DB?",
          "evaluationCriteria": [
            "Unit test tập trung kiểm tra logic nghiệp vụ thuần túy bằng Mock/Stub (Mockito, Jest)",
            "Integration test dùng Testcontainers khởi tạo container PostgreSQL/Redis thật trong Docker, phản ánh đúng dialect",
            "Tránh rủi ro của in-memory DB (H2) do khác biệt về cú pháp SQL, jsonb và transaction lock"
          ],
          "followUps": [
            "Làm thế nào để tăng tốc độ chạy Integration Test với Testcontainers (reuse container)?",
            "Chiến lược làm sạch dữ liệu kiểm thử giữa các test cases để tránh phụ thuộc lẫn nhau?"
          ],
          "tags": [
            "Testing",
            "Testcontainers",
            "Integration Test",
            "Docker"
          ],
          "sourceRefs": [
            "https://testcontainers.com/"
          ],
          "redFlags": [
            "Lạm dụng mock 100% trong kiểm thử DB dẫn đến test pass trên local nhưng lỗi cú pháp trên production"
          ]
        },
        {
          "id": "BE-SCEN-01",
          "role": "Backend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại Backend Developer, khi Race Condition cùng Optimistic Lock, Pessimistic Lock, Concurrency xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "Race Condition",
            "Optimistic Lock",
            "Pessimistic Lock",
            "Concurrency"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "BE-SCEN-02",
          "role": "Backend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Vào giờ cao điểm, API Gateway liên tục báo lỗi 504 Gateway Timeout. Log backend cho thấy toàn bộ database connection pool đã bị cạn kiệt, thời gian chờ lấy kết nối tăng vọt. Em khoanh vùng và xử lý sự cố thế nào?",
          "evaluationCriteria": [
            "Kiểm tra pg_stat_activity hoặc SHOW PROCESSLIST để tìm các Slow Queries đang chiếm giữ connection",
            "Rà soát code xem có tình trạng mở connection nhưng gọi API bên thứ ba chậm bên trong transaction không",
            "Tạm thời tăng pool size trong giới hạn RAM máy chủ DB, ngắt các long-running query và áp dụng query timeout bắt buộc"
          ],
          "followUps": [
            "Làm thế nào để cô lập một query chậm không làm chết toàn bộ các endpoint khác?",
            "Tại sao không bao giờ nên thực hiện I/O mạng (gọi external API) bên trong một DB Transaction?"
          ],
          "tags": [
            "Database Incident",
            "Connection Pool",
            "Slow Query",
            "Troubleshooting"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ tăng timeout của Nginx/Gateway mà không xử lý nguyên nhân gốc rễ connection bị chiếm giữ"
          ]
        },
        {
          "id": "BE-SCEN-03",
          "role": "Backend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Một đối tác cổng thanh toán gửi webhook thông báo thanh toán thành công 3 lần liên tiếp trong 2 giây cho cùng một đơn hàng do cơ chế retry tự động. Hệ thống của em bị cộng điểm thưởng 3 lần. Em thiết kế lại logic idempotent ra sao?",
          "evaluationCriteria": [
            "Tạo bảng `processed_webhooks` lưu trữ `idempotency_key` hoặc `transaction_id` từ đối tác với Unique Constraint",
            "Thực hiện kiểm tra và chèn khóa trong một transaction nguyên tử trước khi kích hoạt logic cộng điểm",
            "Nếu khóa đã tồn tại, trả về HTTP 200 OK ngay lập tức kèm thông báo giao dịch đã được ghi nhận trước đó"
          ],
          "followUps": [
            "Nếu server đang xử lý dở dang thì webhook thứ hai ập đến, làm sao dùng Redis SETNX with TTL làm lock tạm?",
            "Tại sao vẫn phải trả về 200 OK cho đối tác thay vì trả về lỗi 400?"
          ],
          "tags": [
            "Idempotency",
            "Webhook",
            "Payment Processing",
            "Distributed Lock"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Kiểm tra bằng câu lệnh SELECT thông thường rồi mới INSERT mà không có Unique Index dẫn đến race condition"
          ]
        },
        {
          "id": "BE-SCEN-04",
          "role": "Backend Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Dịch vụ backend viết bằng Node.js/Java chạy trên Kubernetes bị crash liên tục với mã lỗi OOMKilled (Exit Code 137) sau mỗi 6 tiếng hoạt động. Em thực hiện các bước thu thập thông tin và fix memory leak thế nào?",
          "evaluationCriteria": [
            "Cấu hình cờ JVM tự động tạo Heap Dump khi gặp OOM (-XX:+HeapDumpOnOutOfMemoryError) hoặc dùng v8-profiler cho Node.js",
            "Phân tích heap dump bằng Eclipse Memory Analyzer (MAT) hoặc Chrome DevTools Memory để tìm Dominator Tree",
            "Khoanh vùng nguyên nhân rò rỉ: lưu trữ cache trong biến static không có giới hạn kích thước, rò rỉ event listener hoặc unclosed resources"
          ],
          "followUps": [
            "Sự khác biệt giữa Memory Leak do code và cấu hình giới hạn RAM của container K8s quá thấp?",
            "Làm thế nào để thiết lập alert cảnh báo RAM tăng dần đều (Memory Leaking Trend) trên Grafana?"
          ],
          "tags": [
            "Memory Leak",
            "OOMKilled",
            "Heap Dump",
            "Kubernetes"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tự động khởi động lại pod định kỳ bằng cronjob thay vì tìm và sửa tận gốc memory leak"
          ]
        },
        {
          "id": "BE-SCEN-05",
          "role": "Backend Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Cơ sở dữ liệu báo lỗi Deadlock Detected khi nhiều luồng thực hiện cập nhật chéo giữa bảng đơn hàng và bảng kho hàng. Em phân tích đồ thị chờ đợi (Wait-for Graph) và sắp xếp lại thứ tự khóa thế nào?",
          "evaluationCriteria": [
            "Đọc Deadlock Log (LATEST DETECTED DEADLOCK trong MySQL hoặc log PostgreSQL) để xác định 2 transaction và 2 ổ khóa",
            "Nguyên tắc phòng ngừa: chuẩn hóa thứ tự cập nhật tài nguyên (luôn cập nhật bảng Order trước rồi đến Inventory, hoặc khóa theo ID tăng dần)",
            "Cấu hình retry logic tự động với khoảng nghỉ ngẫu nhiên khi bắt được lỗi deadlock"
          ],
          "followUps": [
            "Tại sao việc khóa theo thứ tự ID tăng dần (ORDER BY id ASC) lại ngăn chặn được deadlock trong batch update?",
            "Lock Escalation là gì và có thể dẫn đến deadlock bất ngờ ra sao?"
          ],
          "tags": [
            "Deadlock",
            "Lock Ordering",
            "Database Concurrency",
            "Wait-for Graph"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cho rằng deadlock là lỗi ngẫu nhiên của database và chỉ tăng deadlock_timeout để bỏ qua"
          ]
        },
        {
          "id": "BE-SCEN-06",
          "role": "Backend Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Ổ cứng máy chủ Database chính bị đầy 95% do bảng Audit Log lịch sử giao dịch tăng thêm 100GB mỗi tháng. Em thiết kế giải pháp phân vùng bảng (Table Partitioning) và lưu trữ dữ liệu nguội (Cold Storage) ra sao mà không gián đoạn dịch vụ?",
          "evaluationCriteria": [
            "Thiết kế Range Partitioning theo tháng hoặc năm cho bảng Audit Log",
            "Tạo partition mới tự động bằng pg_partman hoặc scheduler",
            "Xuất các partition cũ hơn 6 tháng thành file Parquet nén và tải lên Amazon S3 / Google Cloud Storage, sau đó DROP partition cũ trong DB"
          ],
          "followUps": [
            "Tại sao việc DROP một partition cũ lại nhanh hơn và không gây fragmentation so với chạy câu lệnh DELETE hàng triệu dòng?",
            "Làm thế nào để người dùng vẫn có thể tra cứu lịch sử cũ trên S3 bằng Athena/Trino khi cần?"
          ],
          "tags": [
            "Table Partitioning",
            "Data Archival",
            "Database Maintenance",
            "S3 Cold Storage"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chạy lệnh DELETE trực tiếp hàng triệu bản ghi làm nghẽn WAL log và khóa bảng nghiêm trọng"
          ]
        },
        {
          "id": "BE-CV-01",
          "role": "Backend Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong dự án backend trên CV mà em đảm nhận hệ thống chịu tải cao nhất: Kiến trúc tổng thể gồm những thành phần nào, thông số QPS/RPS đỉnh điểm đạt bao nhiêu, và nút thắt cổ chai lớn nhất nằm ở đâu?",
          "evaluationCriteria": [
            "Mô tả mạch lạc kiến trúc: Gateway, Service layers, Caching, DB, Message Queue",
            "Nêu số liệu thực tế về throughput (RPS), độ trễ P95/P99 và cấu hình tài nguyên phần cứng",
            "Chỉ rõ nút thắt cổ chai thực sự (DB I/O, network bandwidth, CPU serialization) và giải pháp đã làm"
          ],
          "followUps": [
            "Nếu lưu lượng truy cập tăng gấp 5 lần hiện tại, thành phần nào sẽ sập đầu tiên?",
            "Tại sao em lại chọn mô hình cơ sở dữ liệu đó thay vì NoSQL hoặc ngược lại?"
          ],
          "tags": [
            "Architecture",
            "System Scalability",
            "Throughput Profiling",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra số liệu RPS hàng triệu không tương xứng với cấu hình hệ thống hoặc nói hệ thống không có nút thắt nào"
          ]
        },
        {
          "id": "BE-CV-02",
          "role": "Backend Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em có ghi kinh nghiệm tối ưu hóa truy vấn SQL trên CV. Em hãy dẫn chứng một câu query cụ thể bị chậm, cách em đọc Execution Plan (EXPLAIN ANALYZE) để tìm nguyên nhân và kết quả sau khi tối ưu?",
          "evaluationCriteria": [
            "Chỉ rõ vấn đề phát hiện từ EXPLAIN: Seq Scan trên bảng lớn, Nested Loop không phù hợp, Sort trên đĩa",
            "Hành động cụ thể: thêm Composite Index, viết lại câu lệnh loại bỏ function trên cột được index, hoặc dùng CTE tối ưu",
            "Số liệu cải thiện rõ rệt: thời gian chạy từ vài giây xuống dưới 50ms, giảm số block read"
          ],
          "followUps": [
            "Tại sao đôi khi thêm index nhưng database optimizer vẫn quyết định chọn Sequential Scan?",
            "Chỉ số Cost trong EXPLAIN được tính toán dựa trên những yếu tố nào?"
          ],
          "tags": [
            "EXPLAIN ANALYZE",
            "Query Optimization",
            "Execution Plan",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nói chung chung là 'thêm index' mà không nhớ được cấu trúc query hoặc không hiểu cách đọc EXPLAIN"
          ]
        },
        {
          "id": "BE-CV-03",
          "role": "Backend Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em có nêu việc xây dựng hệ thống phân quyền Authentication & Authorization. Em đã triển khai mô hình RBAC (Role-Based) hay ABAC (Attribute-Based) và cơ chế kiểm tra quyền tại tầng API diễn ra như thế nào?",
          "evaluationCriteria": [
            "Mô tả cấu trúc bảng dữ liệu: Users, Roles, Permissions, User_Roles, Role_Permissions",
            "Giải thích cách đính kèm permissions vào JWT claims hoặc kiểm tra quyền qua Middleware/Interceptor với Redis cache",
            "Cách xử lý thu hồi quyền hạn tức thời (Revocation) khi admin thay đổi quyền của một user đang đăng nhập"
          ],
          "followUps": [
            "Sự khác biệt khi mở rộng từ RBAC sang ABAC cho các quy tắc phụ thuộc ngữ cảnh (vd: chỉ được sửa đơn hàng của chính mình)?",
            "Bảo mật chống tấn công BOLA (Broken Object Level Authorization) được triển khai ra sao?"
          ],
          "tags": [
            "RBAC",
            "Authorization",
            "JWT",
            "Security Architecture"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ kiểm tra quyền dựa trên role hardcode trong code mà không có cấu trúc phân quyền động"
          ]
        },
        {
          "id": "BE-CV-04",
          "role": "Backend Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em hãy chia sẻ về một sự cố dữ liệu hoặc outage nghiêm trọng nhất trên môi trường production trong các dự án trên CV mà em tham gia khắc phục. Em đã điều tra nguyên nhân gốc và phục hồi dữ liệu ra sao?",
          "evaluationCriteria": [
            "Tường thuật rõ ràng: thời điểm phát hiện -> đánh giá mức độ ảnh hưởng -> biện pháp ngăn chặn lây lan -> tìm root-cause -> phục hồi",
            "Trung thực về nguyên nhân (lỗi code, thiếu migration, hạ tầng) và áp dụng Point-in-time Recovery (PITR) nếu có mất dữ liệu",
            "Hành động phòng ngừa hậu sự cố: bổ sung automated test, alert giám sát, tài liệu runbook"
          ],
          "followUps": [
            "Thời gian RTO (Recovery Time Objective) và RPO (Recovery Point Objective) của hệ thống lúc đó là bao nhiêu?",
            "Bài học quan trọng nhất về mặt quy trình kỹ thuật mà em rút ra là gì?"
          ],
          "tags": [
            "Incident Response",
            "Root Cause Analysis",
            "PITR",
            "Disaster Recovery"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đổ lỗi hoàn toàn cho đồng nghiệp khác hoặc khẳng định chưa từng có sự cố nào xảy ra"
          ]
        },
        {
          "id": "BE-CV-05",
          "role": "Backend Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi tích hợp với các hệ thống đối tác thứ ba (Cổng thanh toán, Đơn vị vận chuyển, SMS/Email) trên dự án CV, em đã thiết kế các cơ chế Circuit Breaker, Retry và Fallback như thế nào để hệ thống không bị treo lây?",
          "evaluationCriteria": [
            "Sử dụng thư viện Circuit Breaker (Resilience4j, Opossum) với 3 trạng thái: Closed, Open, Half-Open",
            "Cấu hình Retry với Exponential Backoff kèm Jitter ngẫu nhiên để tránh hiện tượng thundering herd",
            "Thiết lập Timeout chặt chẽ cho các HTTP client và cơ chế Fallback (trả về dữ liệu tạm hoặc đẩy vào hàng đợi retry sau)"
          ],
          "followUps": [
            "Tại sao việc retry liên tục không có jitter có thể làm sập luôn hệ thống đối tác khi họ vừa hồi phục?",
            "Làm thế nào để giám sát tỷ lệ lỗi của Circuit Breaker trên dashboard?"
          ],
          "tags": [
            "Circuit Breaker",
            "Resilience",
            "Retry Pattern",
            "Third-party Integration"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Gọi API đối tác mà không cấu hình timeout hoặc không có cơ chế xử lý khi đối tác mất kết nối"
          ]
        },
        {
          "id": "BE-BEHAV-01",
          "role": "Backend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi cần thay đổi một API cốt lõi có breaking change nhưng có hàng chục nghìn ứng dụng di động phiên bản cũ của người dùng chưa cập nhật, em xử lý phiên bản hóa (API Versioning) và phối hợp với các bên ra sao?",
          "evaluationCriteria": [
            "Duy trì chiến lược Versioning rõ ràng (URI path `/v2` hoặc Header-based versioning)",
            "Không xóa bỏ logic cũ ngay lập tức mà duy trì song song cả 2 phiên bản trong giai đoạn deprecation",
            "Phối hợp với Mobile team và Product để lên kế hoạch thông báo ép người dùng cập nhật phiên bản (Force Update) sau thời gian ân hạn"
          ],
          "followUps": [
            "Làm thế nào để giảm thiểu chi phí bảo trì code khi phải duy trì nhiều phiên bản API cùng lúc?",
            "Quy trình thông báo Deprecation Header (Sunset header) theo chuẩn RFC được thiết lập thế nào?"
          ],
          "tags": [
            "API Versioning",
            "Backward Compatibility",
            "Stakeholder Collaboration",
            "Deprecation"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tự ý thay đổi schema API mà không thông báo trước cho mobile team dẫn đến app người dùng bị crash"
          ]
        },
        {
          "id": "BE-BEHAV-02",
          "role": "Backend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi xảy ra tranh cãi chuyên môn với Frontend Developer về việc một logic tính toán phức tạp nên được xử lý ở Backend hay Frontend, em tiếp cận thảo luận và đưa ra quyết định dựa trên những tiêu chí nào?",
          "evaluationCriteria": [
            "Lắng nghe góc nhìn của Frontend về độ mượt mà trải nghiệm và phản hồi tức thời cho người dùng",
            "Xem xét nguyên tắc Single Source of Truth và tính bảo mật của dữ liệu (không bao giờ tin tưởng client để tính toán giá tiền/khuyến mãi)",
            "Đánh giá chi phí tính toán phần cứng máy chủ so với tài nguyên thiết bị của người dùng để chọn giải pháp cân bằng"
          ],
          "followUps": [
            "Nếu Frontend cho rằng backend trả về dữ liệu quá cồng kềnh, em có giải pháp nào (BFF pattern, GraphQL)?",
            "Làm thế nào để giữ không khí thảo luận trên tinh thần xây dựng giải pháp kỹ thuật tốt nhất?"
          ],
          "tags": [
            "Collaboration",
            "Frontend-Backend",
            "Conflict Resolution",
            "Architecture Decision"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Áp đặt quyền hạn một cách cứng nhắc hoặc đẩy hết trách nhiệm cho phía bên kia"
          ]
        },
        {
          "id": "BE-BEHAV-03",
          "role": "Backend Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trước sức ép từ ban quản lý yêu cầu release gấp tính năng backend quan trọng trong 3 ngày, buộc phải bỏ qua khâu viết Unit Test và kiểm tra bảo mật, em phản hồi và quản trị rủi ro thế nào?",
          "evaluationCriteria": [
            "Minh bạch hóa nợ kỹ thuật (Tech Debt) và rủi ro trực tiếp: lỗi dữ liệu tài chính, rủi ro bảo mật lộ thông tin",
            "Đề xuất phương án giảm bớt phạm vi tính năng (Scope Trimming) thành MVP để kịp thời hạn mà vẫn đảm bảo kiểm thử phần cốt lõi",
            "Cam kết kế hoạch bổ sung test và rà soát an toàn ngay trong sprint tiếp theo nếu được chấp thuận giải pháp tạm thời"
          ],
          "followUps": [
            "Làm thế nào để giải thích rủi ro kỹ thuật cho người quản lý không có nền tảng công nghệ hiểu được?",
            "Nếu lãnh đạo vẫn kiên quyết chấp nhận rủi ro để chạy thử, em cần làm gì để tự bảo vệ hệ thống (Audit log, Feature Flag)?"
          ],
          "tags": [
            "Technical Debt",
            "Risk Management",
            "Stakeholder Communication",
            "Deadline Pressure"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Âm thầm làm ẩu không báo cáo rủi ro hoặc phản kháng tiêu cực bất hợp tác"
          ]
        },
        {
          "id": "BE-BEHAV-04",
          "role": "Backend Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Sau khi hệ thống gặp một sự cố nghiêm trọng do chính đoạn code backend của em gây ra làm gián đoạn dịch vụ, em chủ trì buổi họp rút kinh nghiệm (Post-mortem) với thái độ và hành động thế nào?",
          "evaluationCriteria": [
            "Dũng cảm nhận trách nhiệm cá nhân nhưng duy trì văn hóa không đổ lỗi (Blameless Post-mortem) tập trung vào lỗ hổng quy trình",
            "Phân tích nguyên nhân khách quan: tại sao unit test không bắt được lỗi, tại sao staging không phát hiện, cơ chế canary deployment ở đâu",
            "Đưa ra danh sách hành động cải tiến cụ thể (Action Items) có người phụ trách và thời hạn hoàn thành"
          ],
          "followUps": [
            "Làm thế nào để xây dựng văn hóa blameless post-mortem trong một nhóm có nhiều thành viên sợ bị phạt?",
            "Em chia sẻ bài học kinh nghiệm này cho toàn bộ phòng kỹ thuật như thế nào?"
          ],
          "tags": [
            "Blameless Post-mortem",
            "Accountability",
            "Engineering Culture",
            "Continuous Improvement"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tìm cách giấu lỗi, đổ thừa cho môi trường hoặc đồng nghiệp khác"
          ]
        },
        {
          "id": "BE-BEHAV-05",
          "role": "Backend Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Khi nhận thấy hệ thống Backend nguyên khối (Monolith) hiện tại bắt đầu xuất hiện nhiều điểm nghẽn, em đánh giá và thuyết phục đội ngũ kỹ thuật về việc chuyển đổi sang Microservices hoặc Modular Monolith như thế nào?",
          "evaluationCriteria": [
            "Đánh giá trung thực năng lực vận hành, kích thước đội ngũ và chi phí phức tạp của hệ thống phân tán",
            "Ưu tiên giải pháp Modular Monolith trước để làm sạch ranh giới nghiệp vụ (Bounded Contexts) thay vì vội vã tách service",
            "Thuyết phục dựa trên số liệu thực tế về tốc độ release, độ trễ và chi phí hạ tầng thay vì chạy theo trào lưu"
          ],
          "followUps": [
            "Khi nào Microservices thực sự là một sai lầm đối với một startup quy mô nhỏ?",
            "Chiến lược bóc tách từng module (Strangler Fig Pattern) diễn ra từng bước như thế nào?"
          ],
          "tags": [
            "Architecture Evolution",
            "Monolith vs Microservices",
            "Technical Leadership",
            "Strategic Thinking"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cổ súy chia nhỏ microservices một cách mù quáng khi đội ngũ chưa có đủ năng lực DevOps và CI/CD"
          ]
        }
      ]
    },
    {
      "role": "Fullstack Developer",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "fullstack developer",
        "full stack developer",
        "full-stack developer",
        "lap trinh vien fullstack"
      ],
      "questions": [
        {
          "id": "FS-FOUND-01",
          "role": "Fullstack Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong Fullstack Developer, phân biệt Request Lifecycle, Networking, Architecture, Fullstack Flow; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của Request Lifecycle.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc Fullstack Developer."
          ],
          "followUps": [
            "Nếu phải giải thích Request Lifecycle cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "Request Lifecycle",
            "Networking",
            "Architecture",
            "Fullstack Flow"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "FS-FOUND-02",
          "role": "Fullstack Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Cơ chế CORS (Cross-Origin Resource Sharing) hoạt động như thế nào? Sự khác nhau giữa Simple Request và Preflight Request (OPTIONS) là gì, và tại sao việc cấu hình sai CORS có thể dẫn đến rủi ro bảo mật nghiêm trọng?",
          "evaluationCriteria": [
            "Giải thích Same-Origin Policy (Protocol, Domain, Port) của trình duyệt",
            "Điều kiện kích hoạt Preflight Request (phương thức PUT/DELETE, custom headers, content-type application/json)",
            "Phân tích rủi ro khi để `Access-Control-Allow-Origin: *` kết hợp với `Access-Control-Allow-Credentials: true`"
          ],
          "followUps": [
            "Tại sao việc test bằng Postman hoặc curl luôn thành công dù trình duyệt bị chặn CORS?",
            "Làm thế nào để cấu hình reverse proxy (Nginx) để bypass CORS trong môi trường dev?"
          ],
          "tags": [
            "CORS",
            "Security",
            "HTTP Headers",
            "Preflight Request"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
          ],
          "redFlags": [
            "Cho rằng CORS là tính năng bảo vệ máy chủ thay vì cơ chế bảo vệ của trình duyệt phía người dùng"
          ]
        },
        {
          "id": "FS-FOUND-03",
          "role": "Fullstack Developer",
          "category": "foundation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "So sánh ưu và nhược điểm giữa kiến trúc Monorepo (sử dụng Turborepo/Nx/pnpm workspaces) và Polyrepo (chia tách repository riêng biệt cho Frontend và Backend). Cơ chế chia sẻ Types và DTOs giữa Client và Server được thiết kế ra sao?",
          "evaluationCriteria": [
            "Phân tích lợi ích Monorepo: chia sẻ kiểu dữ liệu nguyên vẹn, atomic commits, tái sử dụng CI/CD tooling",
            "Nhược điểm Monorepo: quyền truy cập repository, thời gian clone/build lớn nếu không có remote caching",
            "Thiết kế package chung `shared-types` chứa Zod schemas và TypeScript types cho cả frontend và backend"
          ],
          "followUps": [
            "Turborepo giải quyết bài toán Remote Caching và Task Graph như thế nào?",
            "Làm thế nào để quản lý versioning độc lập cho các micro-packages trong monorepo?"
          ],
          "tags": [
            "Monorepo",
            "Turborepo",
            "Code Sharing",
            "TypeScript DTO"
          ],
          "sourceRefs": [
            "https://turbo.build/repo/docs"
          ],
          "redFlags": [
            "Chỉ biết copy-paste thủ công file types giữa 2 repository riêng biệt khi API thay đổi"
          ]
        },
        {
          "id": "FS-FOUND-04",
          "role": "Fullstack Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "So sánh cơ chế xác thực Session-based (HttpOnly Cookie kết hợp Redis session store) và Token-based (Stateless JWT). Khi nào nên chọn Session và khi nào nên chọn JWT cho một sản phẩm Fullstack?",
          "evaluationCriteria": [
            "Session-based: lưu state trên server, thu hồi phiên (revoke) tức thời dễ dàng, tốn tài nguyên RAM server",
            "JWT: stateless, giảm tải truy vấn DB khi verify, khó thu hồi token trước khi hết hạn (cần blacklist)",
            "Đề xuất phù hợp: SaaS nội bộ/ngân hàng ưu tiên Session; Hệ thống đa nền tảng phân tán ưu tiên JWT kèm Refresh Token"
          ],
          "followUps": [
            "Làm thế nào để xử lý tính năng 'Đăng xuất khỏi tất cả các thiết bị' với cả 2 mô hình?",
            "Tại sao việc nhúng quá nhiều claims vào JWT có thể làm phình to HTTP header của mọi request?"
          ],
          "tags": [
            "Authentication",
            "Session",
            "JWT",
            "Security Architecture"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10"
          ],
          "redFlags": [
            "Nghĩ rằng JWT luôn hiện đại và tốt hơn Session trong mọi trường hợp mà không lường trước vấn đề revoke token"
          ]
        },
        {
          "id": "FS-FOUND-05",
          "role": "Fullstack Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi nào một ứng dụng Fullstack nên sử dụng WebSocket, khi nào nên dùng Server-Sent Events (SSE) và khi nào Long-Polling là đủ? Phân tích chi phí tài nguyên máy chủ và độ phức tạp triển khai của từng giao thức?",
          "evaluationCriteria": [
            "SSE: nhẹ, chạy trên HTTP chuẩn, tự động reconnect, một chiều server -> client, lý tưởng cho streaming AI / tin tức",
            "WebSocket: hai chiều toàn phần, giao thức riêng (ws/wss), giữ kết nối TCP mở, lý tưởng cho chat / game",
            "Long-polling: tốn tài nguyên nhất do overhead bắt tay HTTP liên tục, chỉ dùng làm fallback cho mạng cũ"
          ],
          "followUps": [
            "Làm thế nào để scale WebSocket qua nhiều server backend bằng Redis Pub/Sub adapter?",
            "Tại sao HTTP/2 multiplexing giúp SSE hiệu quả hơn trên trình duyệt?"
          ],
          "tags": [
            "WebSocket",
            "SSE",
            "Long Polling",
            "Realtime Architecture"
          ],
          "sourceRefs": [
            "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"
          ],
          "redFlags": [
            "Dùng WebSocket cho mọi bài toán realtime đơn giản dù chỉ cần hiển thị thông báo một chiều"
          ]
        },
        {
          "id": "FS-FOUND-06",
          "role": "Fullstack Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Sự khác biệt giữa chuẩn hóa dữ liệu (Database Normalization - 3NF) và phi chuẩn hóa (Denormalization). Trong ứng dụng Web thực tế, khi nào em quyết định phi chuẩn hóa dữ liệu để tối ưu hóa hiệu năng đọc của giao diện?",
          "evaluationCriteria": [
            "3NF loại bỏ dư thừa dữ liệu, đảm bảo tính toàn vẹn khi ghi/sửa, nhưng yêu cầu nhiều JOIN khi truy vấn",
            "Denormalization lưu sẵn các trường tính toán (ví dụ: total_orders, author_name) để đọc nhanh trong 1 query",
            "Chi phí đánh đổi: phải quản lý đồng bộ dữ liệu khi cập nhật để tránh mâu thuẫn số liệu"
          ],
          "followUps": [
            "Kỹ thuật Materialized View trong PostgreSQL hỗ trợ bài toán denormalization như thế nào?",
            "Cơ sở dữ liệu Document NoSQL (MongoDB) áp dụng triết lý embedding vs referencing ra sao?"
          ],
          "tags": [
            "Database Normalization",
            "Denormalization",
            "3NF",
            "Performance"
          ],
          "sourceRefs": [
            "https://en.wikipedia.org/wiki/Database_normalization"
          ],
          "redFlags": [
            "Phi chuẩn hóa dữ liệu tùy tiện mà không có cơ chế đảm bảo tính nhất quán khi cập nhật"
          ]
        },
        {
          "id": "FS-SKILL-01",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng tRPC (Type Safety, Prisma, Zod, Fullstack Architecture) cho Fullstack Developer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng tRPC ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "tRPC",
            "Type Safety",
            "Prisma",
            "Zod",
            "Fullstack Architecture"
          ],
          "sourceRefs": [
            "https://trpc.io/docs"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "FS-SKILL-02",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập Fullstack Developer: dựa trên Pre-signed URL, phối hợp S3 Upload, Cloud Architecture, Multipart Upload; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "Pre-signed URL",
            "S3 Upload",
            "Cloud Architecture",
            "Multipart Upload"
          ],
          "sourceRefs": [
            "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "FS-SKILL-03",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em xây dựng tính năng truyền phát câu trả lời dạng gõ chữ (Streaming Response) giống ChatGPT từ Backend (NestJS/Express/FastAPI) đến giao diện React bằng Server-Sent Events (SSE) như thế nào?",
          "evaluationCriteria": [
            "Cấu hình HTTP headers ở backend: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`",
            "Truyền dữ liệu dạng chunk qua Readable Stream và flush buffer tức thì",
            "Ở frontend dùng `fetch` với `ReadableStreamDefaultReader` để đọc từng chunk và cập nhật giao diện mượt mà"
          ],
          "followUps": [
            "Làm thế nào để xử lý ngắt kết nối (abort request) khi người dùng bấm nút 'Dừng sinh văn bản'?",
            "Cơ chế xử lý markdown streaming render mượt mà không bị vỡ thẻ cú pháp ở client ra sao?"
          ],
          "tags": [
            "Streaming Response",
            "SSE",
            "ReadableStream",
            "Fullstack AI Integration"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chờ toàn bộ nội dung sinh xong rồi mới trả về một JSON cục bộ làm người dùng phải chờ đợi lâu"
          ]
        },
        {
          "id": "FS-SKILL-04",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em quản lý biến môi trường (.env) và cấu hình ứng dụng đa môi trường (Local, Staging, Production) như thế nào? Cách xác thực tính toàn vẹn của biến môi trường lúc khởi động bằng Zod/Envalid?",
          "evaluationCriteria": [
            "Tạo schema validation cho process.env bằng Zod/Joi, crash ứng dụng ngay lúc khởi động nếu thiếu biến bắt buộc",
            "Tách biệt rõ ràng biến công khai ở client (NEXT_PUBLIC_) và biến bí mật chỉ chạy trên server (DATABASE_URL, SECRET_KEY)",
            "Sử dụng secret management an toàn trong CI/CD (GitHub Secrets) và Docker Compose cho môi trường phát triển"
          ],
          "followUps": [
            "Rủi ro lộ bí mật khi vô tình import file cấu hình server vào component client là gì?",
            "Làm thế nào để cấu hình Docker multi-stage build tối ưu kích thước image cho fullstack app?"
          ],
          "tags": [
            "Environment Configuration",
            "Zod Validation",
            "Docker",
            "Secrets Management"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Hardcode thông tin bí mật trực tiếp vào code hoặc để lọt secret vào bundle client"
          ]
        },
        {
          "id": "FS-SKILL-05",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em thiết lập quy trình CI/CD tự động hóa cho dự án Fullstack bằng GitHub Actions như thế nào: từ khâu linting, type check, unit test, database migration đến triển khai không gián đoạn?",
          "evaluationCriteria": [
            "Thiết kế pipeline theo các stage rõ ràng: Lint & Test -> Build Docker Images -> Run DB Migration -> Deploy",
            "Chạy automated tests trên ephemeral environment (Testcontainers / Postgres service container)",
            "Triển khai chiến lược Blue/Green hoặc Rolling Update để đảm bảo zero-downtime khi release"
          ],
          "followUps": [
            "Làm thế nào để rollback tự động nếu health check endpoint trả về lỗi 500 sau khi deploy?",
            "Chiến lược caching node_modules và Docker layers để giảm thời gian chạy CI xuống dưới 5 phút?"
          ],
          "tags": [
            "CI/CD",
            "GitHub Actions",
            "Docker",
            "Deployment Pipeline"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Deploy thủ công bằng cách SSH vào server rồi pull code và restart app bằng tay trên production"
          ]
        },
        {
          "id": "FS-SKILL-06",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Xử lý tác vụ nền nặng (Background Jobs - ví dụ xuất file báo cáo Excel lớn hoặc gửi email hàng loạt) bằng hàng đợi BullMQ/Redis: Em thiết kế luồng xử lý và cập nhật tiến độ (Progress) lên UI thế nào?",
          "evaluationCriteria": [
            "Client gửi request tạo job, backend đẩy payload vào hàng đợi BullMQ và trả về ngay `jobId` kèm HTTP 202 Accepted",
            "Worker độc lập lấy job từ queue xử lý, định kỳ emit sự kiện `job.progress(percent)`",
            "Frontend lắng nghe tiến độ qua WebSocket hoặc polling endpoint `/api/jobs/:id` để hiển thị thanh tiến trình"
          ],
          "followUps": [
            "Cơ chế Dead Letter Queue và Auto-retry với Exponential Backoff của BullMQ hoạt động ra sao?",
            "Làm thế nào để dọn dẹp các job đã hoàn thành để tránh tràn RAM Redis?"
          ],
          "tags": [
            "Background Jobs",
            "BullMQ",
            "Redis Queue",
            "Progress Tracking"
          ],
          "sourceRefs": [
            "https://docs.bullmq.io/"
          ],
          "redFlags": [
            "Xử lý tác vụ xuất báo cáo 10 phút trực tiếp trong luồng request-response HTTP thông thường gây timeout"
          ]
        },
        {
          "id": "FS-SKILL-07",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Làm thế nào để tối ưu hóa SEO và chia sẻ mạng xã hội (Open Graph & Twitter Cards) cho các trang có dữ liệu động trong Next.js / Nuxt? Kỹ thuật sinh ảnh thumbnail động (Dynamic OG Image Generation) hoạt động ra sao?",
          "evaluationCriteria": [
            "Sử dụng hàm `generateMetadata` trong Next.js App Router để fetch dữ liệu server và chèn các thẻ meta title, description, og:image",
            "Áp dụng `@vercel/og` hoặc Satori để render JSX thành ảnh SVG/PNG động theo tên bài viết và tác giả",
            "Cấu hình robots.txt và sitemap.xml động tự động cập nhật theo các bài viết mới xuất bản"
          ],
          "followUps": [
            "Làm thế nào để cache các ảnh OG động tại CDN edge để không phải render lại mỗi lần bot quét?",
            "Sự khác biệt khi bot của Facebook/Twitter quét trang SSR so với trang CSR thuần?"
          ],
          "tags": [
            "SEO",
            "Open Graph",
            "Next.js Metadata",
            "Dynamic Images"
          ],
          "sourceRefs": [
            "https://nextjs.org/docs"
          ],
          "redFlags": [
            "Để trang web ở dạng CSR thuần khiến bot mạng xã hội không thể đọc được tiêu đề và ảnh đại diện"
          ]
        },
        {
          "id": "FS-SKILL-08",
          "role": "Fullstack Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược kiểm thử tự động End-to-End (E2E) cho ứng dụng Fullstack bằng Playwright: Em thiết lập môi trường test database độc lập, dữ liệu mẫu (Seeding) và kịch bản test luồng thanh toán ra sao?",
          "evaluationCriteria": [
            "Khởi tạo database test sạch sẽ cho mỗi lượt chạy kiểm thử bằng Docker container hoặc isolated schema",
            "Viết kịch bản Playwright giả lập hành vi người dùng thật từ đăng nhập, thêm giỏ hàng đến checkout",
            "Mock các dịch vụ thanh toán bên thứ ba để đảm bảo test chạy ổn định không phụ thuộc mạng ngoài"
          ],
          "followUps": [
            "Làm thế nào để chạy song song (Parallel execution) các bài test Playwright mà không xung đột dữ liệu?",
            "Xử lý kiểm thử các trạng thái bất đồng bộ (visual wait, network idle) trong Playwright thế nào?"
          ],
          "tags": [
            "Playwright",
            "E2E Testing",
            "Database Seeding",
            "Test Automation"
          ],
          "sourceRefs": [
            "https://playwright.dev/docs/intro"
          ],
          "redFlags": [
            "Kiểm thử E2E trực tiếp trên database staging chứa dữ liệu chung làm hỏng dữ liệu của đồng nghiệp"
          ]
        },
        {
          "id": "FS-SCEN-01",
          "role": "Fullstack Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại Fullstack Developer, khi Cache Invalidation cùng Stale Data, Data Synchronization, Next.js Cache xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "Cache Invalidation",
            "Stale Data",
            "Data Synchronization",
            "Next.js Cache"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "FS-SCEN-02",
          "role": "Fullstack Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Hệ thống tích hợp cổng thanh toán trực tuyến. Khách hàng đã bị trừ tiền trong tài khoản ngân hàng nhưng trên màn hình ứng dụng vẫn hiển thị 'Chờ thanh toán' do webhook từ cổng thanh toán gửi về server bị trễ 30 giây. Em thiết kế trải nghiệm người dùng và cơ chế kiểm tra trạng thái bù trừ ra sao?",
          "evaluationCriteria": [
            "Frontend hiển thị trạng thái 'Đang xác thực giao dịch' kèm thanh đếm thời gian và nút 'Kiểm tra trạng thái'",
            "Client chủ động gửi polling hoặc mở kết nối WebSocket hỏi thăm trạng thái đơn hàng định kỳ 5 giây",
            "Backend cung cấp endpoint cho phép chủ động gọi API truy vấn trạng thái (Query Transaction API) sang cổng thanh toán thay vì chỉ ngồi chờ webhook"
          ],
          "followUps": [
            "Làm thế nào để xử lý trường hợp cả webhook lẫn query API đều báo timeout?",
            "Cơ chế bảo vệ chống gian lận khi client tự ý thông báo giao dịch thành công là gì?"
          ],
          "tags": [
            "Payment Gateway",
            "Webhook Latency",
            "Polling Fallback",
            "User Experience"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ biết hiển thị thông báo lỗi 'Thanh toán thất bại' ngay lập tức làm khách hàng hoang mang"
          ]
        },
        {
          "id": "FS-SCEN-03",
          "role": "Fullstack Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Một botnet liên tục cào dữ liệu (scraping) từ trang sản phẩm làm CPU máy chủ backend tăng 100% và ảnh hưởng nghiêm trọng đến người dùng thật. Em triển khai các tầng phòng thủ từ CDN, Nginx đến Backend API như thế nào?",
          "evaluationCriteria": [
            "Tầng CDN (Cloudflare): bật WAF Bot Management, chặn các ASN đáng ngờ và kích hoạt Managed Challenge",
            "Tầng Nginx/Gateway: giới hạn tần suất request (Rate Limiting) theo IP và User-Agent",
            "Tầng Application: ẩn các trường nhạy cảm, áp dụng Obfuscation, honeypot links và yêu cầu xác thực JWT cho API nội bộ"
          ],
          "followUps": [
            "Làm thế nào để phân biệt bot có hại với các công cụ tìm kiếm hợp lệ (Googlebot, Bingbot)?",
            "Cloudflare Turnstile hỗ trợ xác thực người dùng thật mà không gây ức chế như CAPTCHA truyền thống ra sao?"
          ],
          "tags": [
            "Anti-scraping",
            "Bot Protection",
            "WAF",
            "Rate Limiting"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đề xuất bắt tất cả người dùng phải nhập mã CAPTCHA hình ảnh cho mỗi lần xem sản phẩm"
          ]
        },
        {
          "id": "FS-SCEN-04",
          "role": "Fullstack Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Ứng dụng quản lý dự án hỗ trợ người dùng chỉnh sửa offline khi mất mạng và tự động đồng bộ lên máy chủ khi có mạng trở lại. Khi hai người cùng chỉnh sửa một tài liệu cùng lúc ở chế độ offline, em xử lý xung đột dữ liệu (Conflict Resolution) như thế nào?",
          "evaluationCriteria": [
            "Lưu trữ dữ liệu ngoại tuyến tại Client bằng IndexedDB / RxDB",
            "Chiến lược giải quyết xung đột: Last-Write-Wins (dựa trên vector clock/timestamp) hoặc 3-Way Merge",
            "Với văn bản cộng tác chuyên sâu: áp dụng cấu trúc CRDTs (Conflict-free Replicated Data Types) như Yjs hoặc Automerge"
          ],
          "followUps": [
            "Sự khác biệt giữa Operational Transformation (OT) của Google Docs và CRDTs là gì?",
            "Làm thế nào để hiển thị giao diện thông báo xung đột trực quan cho người dùng tự chọn phiên bản giữ lại?"
          ],
          "tags": [
            "Offline-first",
            "Conflict Resolution",
            "CRDTs",
            "IndexedDB"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ghi đè hoàn toàn dữ liệu mới nhất lên dữ liệu cũ làm mất sạch công sức chỉnh sửa của người dùng trước"
          ]
        },
        {
          "id": "FS-SCEN-05",
          "role": "Fullstack Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Trong quá trình triển khai phiên bản mới, quá trình migration cơ sở dữ liệu bị lỗi cú pháp ở bước thứ hai khiến một nửa bảng đã thay đổi còn một nửa chưa. Đội ngũ cần rollback về phiên bản cũ ngay lập tức. Các bước xử lý của em là gì?",
          "evaluationCriteria": [
            "Kích hoạt kịch bản Rollback trong transaction an toàn nếu migration tool hỗ trợ transactional DDL (PostgreSQL)",
            "Khôi phục phiên bản code trước đó (Revert commit / Redeploy previous Docker tag)",
            "Nếu bảng đã bị thay đổi không thể rollback tự động: chạy kịch bản Down Migration thủ công đã được kiểm thử trước trên staging"
          ],
          "followUps": [
            "Tại sao mọi script migration trước khi lên production đều bắt buộc phải có script 'Down' tương ứng?",
            "Chiến lược kiểm tra tính toàn vẹn dữ liệu (Data Integrity Check) sau sự cố rollback là gì?"
          ],
          "tags": [
            "Rollback Strategy",
            "Database Migration Failure",
            "Disaster Recovery",
            "Deployment Incident"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Hoảng loạn xóa database hoặc chạy các câu lệnh sửa cấu trúc ngẫu hứng trực tiếp trên production"
          ]
        },
        {
          "id": "FS-SCEN-06",
          "role": "Fullstack Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Ứng dụng phần mềm dạng dịch vụ (SaaS) chuyển đổi sang mô hình Đa người thuê (Multi-Tenancy). Em lựa chọn kiến trúc lưu trữ dữ liệu nào (Database per Tenant, Schema per Tenant, hay Shared Database với Tenant ID) và cách định tuyến subdomain ở Frontend?",
          "evaluationCriteria": [
            "Phân tích mô hình: Shared DB với Tenant ID (tiết kiệm chi phí, dễ bảo trì, cần Row-Level Security nghiêm ngặt)",
            "Schema per Tenant: cô lập tốt hơn, phù hợp khách hàng vừa và nhỏ; Database per Tenant: bảo mật tối đa cho khách hàng lớn",
            "Frontend định tuyến động: đọc subdomain từ hostname (vd: tenant.app.com) trong middleware và gán tenant context xuyên suốt các API call"
          ],
          "followUps": [
            "Làm thế nào để áp dụng Row Level Security (RLS) của PostgreSQL để ngăn chặn rò rỉ dữ liệu giữa các tenant?",
            "Cách quản lý dynamic SSL certificate cho các custom domain của khách hàng?"
          ],
          "tags": [
            "Multi-tenancy",
            "Row Level Security",
            "SaaS Architecture",
            "Subdomain Routing"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ lọc dữ liệu tenant ở tầng frontend bằng JavaScript mà không cô lập ở tầng cơ sở dữ liệu"
          ]
        },
        {
          "id": "FS-CV-01",
          "role": "Fullstack Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong dự án Fullstack toàn diện nhất trên CV, em đã trực tiếp xây dựng những phần nào từ Frontend đến Backend? Đâu là quyết định kiến trúc quan trọng nhất mà em đã đưa ra và kết quả thực tế ra sao?",
          "evaluationCriteria": [
            "Mô tả rõ ràng vai trò cá nhân trên toàn bộ ngăn xếp công nghệ (Frontend framework, Backend runtime, Database, Hosting)",
            "Trình bày lý do lựa chọn công nghệ và trade-offs liên quan (ví dụ: chọn monolithic hay chia tách)",
            "Dẫn chứng kết quả cụ thể: thời gian hoàn thành tính năng, hiệu năng trang web, số lượng người dùng thực tế"
          ],
          "followUps": [
            "Nếu có cơ hội làm lại dự án đó từ đầu với ngân sách gấp đôi, em sẽ thay đổi thành phần nào?",
            "Bài học kỹ thuật sâu sắc nhất mà em đúc kết được từ dự án đó là gì?"
          ],
          "tags": [
            "Fullstack Architecture",
            "System Design",
            "Technical Decision",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ làm phần giao diện hoặc chỉ viết vài API đơn giản nhưng ghi nhận là làm toàn bộ dự án"
          ]
        },
        {
          "id": "FS-CV-02",
          "role": "Fullstack Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em có ghi kinh nghiệm triển khai CI/CD và Cloud trên CV. Hãy mô tả chi tiết quy trình release một tính năng từ lúc merge Pull Request đến khi chạy thực tế trên production trong dự án đó?",
          "evaluationCriteria": [
            "Mô tả các bước tự động trong pipeline: testing, linting, build container, migrate DB, deploy",
            "Môi trường hosting thực tế: AWS ECS, Kubernetes, Vercel, VPS Linux, Docker Compose",
            "Cách quản lý rollback và theo dõi trạng thái hệ thống sau khi release"
          ],
          "followUps": [
            "Thời gian trung bình của pipeline từ lúc merge đến khi hoàn tất là bao lâu?",
            "Em đã từng xử lý sự cố nào khi pipeline release bị fail giữa chừng chưa?"
          ],
          "tags": [
            "CI/CD Pipeline",
            "Cloud Deployment",
            "DevOps for Fullstack",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ghi thạo CI/CD trên CV nhưng không nắm được các bước chạy trong workflow file"
          ]
        },
        {
          "id": "FS-CV-03",
          "role": "Fullstack Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trong dự án Fullstack có xử lý thanh toán hoặc giao dịch tài chính trên CV, em đã thiết kế luồng bảo mật chống tấn công giả mạo yêu cầu (CSRF), giả mạo dữ liệu giá tiền và rò rỉ API keys như thế nào?",
          "evaluationCriteria": [
            "Đảm bảo mọi logic tính giá, mã giảm giá đều thực hiện độc quyền ở Backend, không tin tưởng client",
            "Bảo vệ CSRF bằng SameSite Cookies hoặc CSRF Token cho các phương thức POST/PUT",
            "Lưu trữ khóa bí mật API trong biến môi trường máy chủ an toàn, không để lọt vào bundle client"
          ],
          "followUps": [
            "Làm thế nào để xác minh chữ ký điện tử (Signature Verification) của các gói tin webhook từ đối tác thanh toán?",
            "Cách ngăn chặn việc replay request đối với các giao dịch tài chính?"
          ],
          "tags": [
            "Payment Security",
            "CSRF Prevention",
            "Secure Design",
            "CV Verification"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cho phép client gửi trực tiếp số tiền cần thanh toán lên server mà không kiểm tra lại trong database"
          ]
        },
        {
          "id": "FS-CV-04",
          "role": "Fullstack Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em hãy kể về một tình huống mà em phải tự mình giải quyết một vấn đề kỹ thuật phức tạp nằm ở ranh giới giữa Frontend và Backend (ví dụ: memory leak, WebSocket disconnect hàng loạt, hoặc CORS kỳ lạ)?",
          "evaluationCriteria": [
            "Mô tả cụ thể triệu chứng lỗi và cách tư duy đa tầng để xác định lỗi thuộc về tầng nào",
            "Quy trình sử dụng công cụ điều tra: Network tab, server logs, Wireshark, debugger",
            "Giải pháp triệt để và bài học phòng ngừa cho đội ngũ"
          ],
          "followUps": [
            "Tại sao việc hiểu cả hai đầu Frontend và Backend giúp em giải quyết vấn đề nhanh hơn các bạn chỉ chuyên một mảng?",
            "Em đã chia sẻ giải pháp này cho nhóm bằng cách nào?"
          ],
          "tags": [
            "Cross-stack Debugging",
            "Problem Solving",
            "Troubleshooting",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đổ lỗi qua lại giữa frontend và backend thay vì tự mình tìm hiểu nguyên nhân gốc rễ"
          ]
        },
        {
          "id": "FS-CV-05",
          "role": "Fullstack Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em có nêu kỹ năng thiết kế cơ sở dữ liệu quan hệ. Em hãy vẽ lại mô hình thực thể (ERD) của phân hệ phức tạp nhất mà em từng thiết kế, giải thích cách đánh index và quan hệ giữa các bảng?",
          "evaluationCriteria": [
            "Trình bày các thực thể chính, khóa chính (PK), khóa ngoại (FK) và mối quan hệ (1-N, N-N)",
            "Giải thích chiến lược đánh index (Single vs Composite) phục vụ các câu truy vấn phổ biến nhất",
            "Xử lý xóa mềm (Soft Delete) và ảnh hưởng của nó đến Unique Constraint"
          ],
          "followUps": [
            "Làm thế nào để thiết kế bảng lịch sử thay đổi (Audit Log) cho các bảng dữ liệu trọng yếu?",
            "Tại sao việc dùng UUID làm khóa chính có thể ảnh hưởng đến hiệu năng ghi của B-Tree index so với Auto-increment ID?"
          ],
          "tags": [
            "Database Modeling",
            "ERD",
            "Index Strategy",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Không nhớ cấu trúc các bảng chính hoặc thiết kế quan hệ thiếu chuẩn hóa cơ bản"
          ]
        },
        {
          "id": "FS-BEHAV-01",
          "role": "Fullstack Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Là một Fullstack Developer, khi đứng trước áp lực vừa phải hoàn thành giao diện bóng bẩy vừa phải tối ưu hệ thống backend vững chắc trong một sprint ngắn, em phân bổ thời gian và ưu tiên công việc ra sao?",
          "evaluationCriteria": [
            "Xác định rõ ràng phần lõi (Core Business Value) và thỏa thuận phạm vi MVP trước",
            "Ưu tiên thiết kế API và luồng dữ liệu chuẩn chỉ trước để đảm bảo tính đúng đắn và an toàn",
            "Phần giao diện tập trung vào tính hữu dụng và trải nghiệm luồng chính, tinh chỉnh hiệu ứng thẩm mỹ sau"
          ],
          "followUps": [
            "Khi nhận thấy khối lượng công việc vượt quá thời gian của sprint, em báo cáo và đàm phán với ai?",
            "Làm thế nào để tránh việc trở thành 'Fullstack nhưng cái gì cũng làm nửa vời'?"
          ],
          "tags": [
            "Time Management",
            "Prioritization",
            "Fullstack Mindset",
            "Agile Sprint"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ tập trung làm giao diện đẹp mắt mà bỏ qua việc xử lý lỗi và bảo mật backend"
          ]
        },
        {
          "id": "FS-BEHAV-02",
          "role": "Fullstack Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi Product Manager yêu cầu một tính năng đòi hỏi logic tính toán rất phức tạp nhưng thời gian phản hồi API yêu cầu dưới 100ms, em giải thích các đánh đổi kỹ thuật (Trade-offs) và tư vấn phương án khả thi thế nào?",
          "evaluationCriteria": [
            "Giải thích dễ hiểu bằng thuật ngữ kinh doanh: sự đánh đổi giữa thời gian thực (Realtime) và chi phí tài nguyên phần cứng",
            "Đề xuất các phương án kỹ thuật thay thế: xử lý bất đồng bộ (Async job với tiến trình thông báo), tính toán sẵn (Pre-computation), hoặc Caching",
            "Cùng PM cân nhắc xem người dùng có thực sự cần kết quả tức thời trong 100ms hay chấp nhận chờ 2 giây"
          ],
          "followUps": [
            "Em làm gì khi PM vẫn khăng khăng muốn cả hai mà không chịu tăng tài nguyên server?",
            "Cách ghi lại biên bản thống nhất kỹ thuật để tránh tranh cãi sau này?"
          ],
          "tags": [
            "Stakeholder Communication",
            "Trade-off Analysis",
            "Technical Advisory",
            "Product Management"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đồng ý bừa với yêu cầu bất khả thi rồi trễ hạn release hoặc hệ thống bị sập khi chạy thật"
          ]
        },
        {
          "id": "FS-BEHAV-03",
          "role": "Fullstack Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi làm việc trong nhóm có các bạn chuyên sâu Frontend hoặc Backend riêng biệt, em tận dụng lợi thế hiểu biết toàn diện của mình để hỗ trợ và gắn kết hai đầu dự án như thế nào?",
          "evaluationCriteria": [
            "Đóng vai trò cầu nối: giúp Frontend hiểu các ràng buộc của cơ sở dữ liệu và giúp Backend hiểu nhu cầu hiển thị của UI",
            "Chủ động đề xuất các tiêu chuẩn chung (API Contract, error response format, type sharing)",
            "Hỗ trợ gỡ lỗi nhanh cho đồng nghiệp khi vấn đề phát sinh ở ranh giới giữa hai bên"
          ],
          "followUps": [
            "Làm sao để chia sẻ kiến thức mà không tạo cảm giác dạy đời đồng nghiệp chuyên sâu?",
            "Em tổ chức các buổi trao đổi kỹ thuật (Tech Sharing) trong nhóm như thế nào?"
          ],
          "tags": [
            "Team Bridge",
            "Cross-functional Collaboration",
            "Empathy",
            "Team Player"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Xem thường các bạn chỉ làm một mảng hoặc tự cô lập công việc của mình"
          ]
        },
        {
          "id": "FS-BEHAV-04",
          "role": "Fullstack Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi tiếp nhận một dự án Fullstack kế thừa (Legacy Codebase) có code lộn xộn, thiếu tài liệu và không có automated test, kế hoạch tiếp cận và cải tiến từng bước của em là gì?",
          "evaluationCriteria": [
            "Không vội vàng đập đi xây lại (Rewrite) toàn bộ vì tiềm ẩn rủi ro kinh doanh cực lớn",
            "Đọc hiểu luồng nghiệp vụ cốt lõi, viết bổ sung Integration Test bao bọc (Characterization Tests) để tạo lưới an toàn",
            "Tái cấu trúc từng phần nhỏ (Refactoring) theo Boy Scout Rule (luôn để lại code sạch hơn lúc nhận)"
          ],
          "followUps": [
            "Làm thế nào để thuyết phục ban quản lý cấp thời gian (Tech Debt budget) cho việc cải tiến code cũ?",
            "Cách cân bằng giữa việc sửa code cũ và làm tính năng mới của sprint?"
          ],
          "tags": [
            "Legacy Code",
            "Refactoring Strategy",
            "Technical Debt",
            "Patience"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đòi đập đi viết lại toàn bộ dự án từ đầu mà không lường trước chi phí và rủi ro"
          ]
        },
        {
          "id": "FS-BEHAV-05",
          "role": "Fullstack Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Lĩnh vực Fullstack biến đổi công nghệ rất nhanh chóng (frameworks mới, serverless, AI tooling). Em duy trì thói quen tự học và chọn lọc công nghệ nào đáng đầu tư lâu dài cho sự nghiệp của mình?",
          "evaluationCriteria": [
            "Tập trung sâu vào các nguyên lý nền tảng bền vững: Giao thức mạng, cấu trúc dữ liệu, kiến trúc hệ thống, bảo mật",
            "Thử nghiệm công nghệ mới thông qua các dự án cá nhân (Pet projects) trước khi áp dụng vào công việc chính thức",
            "Tham gia cộng đồng mã nguồn mở, đọc tài liệu kỹ thuật chính thức và rèn luyện tư duy phản biện trước các xu hướng 'hype'"
          ],
          "followUps": [
            "Em đánh giá thế nào về sự hỗ trợ của các công cụ AI (GitHub Copilot, Cursor) đối với vai trò Fullstack Developer hiện nay?",
            "Kỹ năng nào của kỹ sư phần mềm mà AI không thể thay thế được?"
          ],
          "tags": [
            "Continuous Learning",
            "Technology Evaluation",
            "Career Growth",
            "Engineering Mindset"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Bảo thủ từ chối học công nghệ mới hoặc ngược lại chạy theo mọi xu hướng nhất thời không có chiều sâu"
          ]
        }
      ]
    },
    {
      "role": "Mobile Developer (iOS/Android/Flutter)",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "mobile developer",
        "flutter developer",
        "ios developer",
        "android developer",
        "mobile app developer"
      ],
      "questions": [
        {
          "id": "MOB-FOUND-01",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong Mobile Developer (iOS/Android/Flutter), phân biệt Mobile Lifecycle, iOS, Android, State Restoration; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của Mobile Lifecycle.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc Mobile Developer (iOS/Android/Flutter)."
          ],
          "followUps": [
            "Nếu phải giải thích Mobile Lifecycle cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "Mobile Lifecycle",
            "iOS",
            "Android",
            "State Restoration"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation",
            "https://developer.android.com/guide"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "MOB-FOUND-02",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Cơ chế quản lý bộ nhớ của thiết bị di động: Phân biệt Automatic Reference Counting (ARC) trên iOS/Swift với Garbage Collection (GC) trên Android/Kotlin và Dart/Flutter. Hiện tượng Retain Cycle / Memory Leak xảy ra như thế nào?",
          "evaluationCriteria": [
            "ARC: đếm tham chiếu lúc compile time, tự giải phóng khi count = 0; GC: chạy định kỳ lúc runtime để quét object graph",
            "Retain cycle: hai đối tượng giữ strong reference chéo nhau khiến bộ nhớ không thể giải phóng",
            "Khắc phục: dùng `weak` và `unowned` references trong Swift, weak references trong Kotlin/Java"
          ],
          "followUps": [
            "Công cụ Xcode Memory Graph và Android Profiler hỗ trợ truy vết leak memory ra sao?",
            "Trong Flutter, tại sao việc quên dispose Controller hoặc StreamSubscription gây rò rỉ bộ nhớ?"
          ],
          "tags": [
            "ARC",
            "Garbage Collection",
            "Memory Leak",
            "Retain Cycle"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation",
            "https://developer.android.com/guide",
            "https://docs.flutter.dev"
          ],
          "redFlags": [
            "Nhầm lẫn giữa ARC (compile-time) và Tracing Garbage Collection (runtime)"
          ]
        },
        {
          "id": "MOB-FOUND-03",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Kiến trúc dựng hình của Flutter (Skia / Impeller) khác với kiến trúc của Native Android (Views/Jetpack Compose) và Native iOS (UIKit/SwiftUI) như thế nào? Tại sao Flutter có thể đạt hiệu năng 60fps/120fps ổn định?",
          "evaluationCriteria": [
            "Flutter tự vẽ mọi pixel lên Canvas bằng engine đồ họa riêng (Impeller/Skia) không qua OEM native widgets",
            "Cơ chế 3 cây trong Flutter: Widget Tree (cấu hình), Element Tree (vòng đời), RenderObject Tree (tính toán layout & paint)",
            "SwiftUI và Jetpack Compose sử dụng declarative UI nhưng biên dịch trực tiếp sang các thành phần native của hệ điều hành"
          ],
          "followUps": [
            "Impeller giải quyết triệt để vấn đề Shader Compilation Jank trên iOS như thế nào?",
            "Khi nào Native UI vẫn có ưu thế vượt trội hơn Flutter?"
          ],
          "tags": [
            "Flutter Engine",
            "Impeller",
            "Rendering Pipeline",
            "Jetpack Compose",
            "SwiftUI"
          ],
          "sourceRefs": [
            "https://docs.flutter.dev"
          ],
          "redFlags": [
            "Nghĩ rằng Flutter biên dịch các widget thành native Android Views và iOS UIViews"
          ]
        },
        {
          "id": "MOB-FOUND-04",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Nguyên lý hoạt động của Push Notification từ xa (Remote Push Notification): Luồng gửi nhận tin nhắn từ Server qua APNs (Apple) và FCM (Firebase/Google) đến thiết bị diễn ra như thế nào? Cách xử lý token thay đổi?",
          "evaluationCriteria": [
            "Quy trình: App xin quyền -> nhận Device Token từ APNs/FCM -> gửi Token lên Backend -> Backend gửi message qua FCM/APNs -> OS nhận và hiển thị",
            "Phân biệt Notification Message (OS tự hiển thị) và Data-only / Silent Notification (đánh thức app chạy ngầm)",
            "Xử lý refresh token khi người dùng đổi thiết bị, cài lại app hoặc token hết hạn"
          ],
          "followUps": [
            "Cách xử lý điều hướng Deep Link khi người dùng bấm vào Push Notification từ trạng thái app đang bị đóng (Cold Start)?",
            "Làm thế nào để mã hóa nội dung nhạy cảm của Push Notification bằng Notification Service Extension trên iOS?"
          ],
          "tags": [
            "Push Notification",
            "APNs",
            "FCM",
            "Deep Link"
          ],
          "sourceRefs": [
            "https://firebase.google.com/docs/cloud-messaging"
          ],
          "redFlags": [
            "Nghĩ rằng thiết bị duy trì kết nối socket trực tiếp liên tục với máy chủ của công ty để nhận thông báo"
          ]
        },
        {
          "id": "MOB-FOUND-05",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Kiến trúc Offline-First cho ứng dụng di động: Lựa chọn cơ sở dữ liệu cục bộ (SQLite/Room, Realm, Isar, CoreData) và chiến lược đồng bộ hóa 2 chiều (Bidirectional Sync) với server?",
          "evaluationCriteria": [
            "So sánh SQLite/Room/CoreData (chuẩn quan hệ, ACID vững chắc) với NoSQL nhúng (Hive, Realm, Isar - tốc độ đọc ghi cực nhanh)",
            "Thiết kế hàng đợi đồng bộ (Sync Queue / Outbox Pattern) lưu các hành động offline",
            "Chiến lược gán timestamp, Version Vector hoặc Change Tracking để phát hiện xung đột dữ liệu"
          ],
          "followUps": [
            "Làm thế nào để mã hóa cơ sở dữ liệu trên thiết bị bằng SQLCipher?",
            "Cách xử lý đồng bộ ảnh hoặc tệp đính kèm khi mạng chập chờn?"
          ],
          "tags": [
            "Offline-first",
            "SQLite",
            "Room",
            "CoreData",
            "Data Sync"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Lưu dữ liệu cấu trúc lớn vào SharedPreferences hoặc UserDefaults gây chậm ứng dụng"
          ]
        },
        {
          "id": "MOB-FOUND-06",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Bảo mật ứng dụng di động: Tại sao không được lưu trữ API keys hoặc mật khẩu người dùng dưới dạng văn bản thuần trong app? Cơ chế an toàn của iOS Keychain và Android Keystore/EncryptedSharedPreferences hoạt động ra sao?",
          "evaluationCriteria": [
            "Thiết bị đã root hoặc jailbreak có thể trích xuất toàn bộ dữ liệu lưu trong file phẳng hoặc SharedPreferences",
            "iOS Keychain và Android Keystore sử dụng phần cứng chuyên dụng (Secure Enclave / TEE) để mã hóa dữ liệu nhạy cảm",
            "Không hardcode Private Keys hoặc Client Secret trong mã nguồn vì dễ bị dịch ngược (Reverse Engineering) bằng decompiler"
          ],
          "followUps": [
            "SSL Pinning (Certificate Pinning) bảo vệ ứng dụng chống tấn công Man-in-the-Middle (MitM) ra sao?",
            "Rủi ro khi chứng chỉ SSL của server hết hạn nếu đã bật SSL Pinning cứng trong app?"
          ],
          "tags": [
            "Mobile Security",
            "Keychain",
            "Keystore",
            "SSL Pinning"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10"
          ],
          "redFlags": [
            "Lưu mật khẩu người dùng hoặc token xác thực vào UserDefaults/SharedPreferences"
          ]
        },
        {
          "id": "MOB-SKILL-01",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng State Management (Bloc, Riverpod, ViewModel, Unidirectional Data Flow) cho Mobile Developer (iOS/Android/Flutter): em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng State Management ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "State Management",
            "Bloc",
            "Riverpod",
            "ViewModel",
            "Unidirectional Data Flow"
          ],
          "sourceRefs": [
            "https://docs.flutter.dev"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "MOB-SKILL-02",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập Mobile Developer (iOS/Android/Flutter): dựa trên ListView Optimization, phối hợp RecyclerView, Image Caching, Jank Reduction; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "ListView Optimization",
            "RecyclerView",
            "Image Caching",
            "Jank Reduction"
          ],
          "sourceRefs": [
            "https://developer.android.com/guide",
            "https://docs.flutter.dev"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "MOB-SKILL-03",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em xây dựng và bảo trì cầu nối giao tiếp (Platform Channel / MethodChannel trong Flutter hoặc Native Bridge) giữa mã nguồn đa nền tảng và mã nguồn Native (Swift/Kotlin) như thế nào?",
          "evaluationCriteria": [
            "Hiểu cơ chế truyền thông điệp bất đồng bộ (BinaryMessenger) tuần tự hóa dữ liệu giữa Dart và Host platform",
            "Viết mã nguồn Swift/Kotlin xử lý các tính năng phần cứng đặc thù (Bluetooth BLE, Camera chuyên sâu, Sensors)",
            "Bắt lỗi và xử lý ngoại lệ (PlatformException) chặt chẽ khi native code trả về lỗi"
          ],
          "followUps": [
            "EventChannel khác gì với MethodChannel khi cần truyền luồng dữ liệu liên tục (streaming data)?",
            "Pigeon code generator hỗ trợ Type-safe Platform Channel trong Flutter như thế nào?"
          ],
          "tags": [
            "Platform Channel",
            "Native Bridge",
            "Swift",
            "Kotlin",
            "MethodChannel"
          ],
          "sourceRefs": [
            "https://docs.flutter.dev"
          ],
          "redFlags": [
            "Chỉ biết dùng các thư viện có sẵn trên pub.dev mà không biết viết code native khi thư viện bị lỗi"
          ]
        },
        {
          "id": "MOB-SKILL-04",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược giảm dung lượng tệp cài đặt (APK, AAB, IPA) của ứng dụng di động: Em sử dụng những phương pháp và công cụ nào để giảm tải tài nguyên?",
          "evaluationCriteria": [
            "Chuyển sang định dạng Android App Bundle (AAB) để Google Play tự tối ưu theo cấu hình thiết bị người dùng",
            "Kích hoạt R8 / ProGuard trên Android để thu nhỏ mã nguồn (shrinking), làm mờ (obfuscation) và tối ưu hóa",
            "Chuyển đổi tài nguyên ảnh PNG/JPG sang định dạng Vector Drawable, SVG hoặc WebP, loại bỏ font không dùng"
          ],
          "followUps": [
            "Cấu hình App Thinning (App Slicing, On-Demand Resources) trên iOS hoạt động ra sao?",
            "Làm thế nào để phân tích thành phần kích thước ứng dụng bằng công cụ APK Analyzer trong Android Studio?"
          ],
          "tags": [
            "App Size Optimization",
            "AAB",
            "R8 ProGuard",
            "App Thinning"
          ],
          "sourceRefs": [
            "https://developer.android.com/guide",
            "https://developer.apple.com/documentation"
          ],
          "redFlags": [
            "Để nguyên các file media âm thanh, video chất lượng cao chưa nén trong thư mục assets của app"
          ]
        },
        {
          "id": "MOB-SKILL-05",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em xử lý điều hướng màn hình nâng cao (Deep Linking & Universal Links trên iOS / App Links trên Android) như thế nào? Cách cấu hình tệp xác thực domain (assetlinks.json và apple-app-site-association)?",
          "evaluationCriteria": [
            "Hiểu sự khác biệt giữa Custom URL Scheme (dễ xung đột) và Universal/App Links (bảo mật, gắn liền với domain HTTPS)",
            "Cấu hình tệp `apple-app-site-association` trên máy chủ web không có đuôi .json và `assetlinks.json` có mã SHA-256",
            "Điều hướng ứng dụng mượt mà đến đúng màn hình đích (Deferred Deep Linking) kể cả khi người dùng chưa cài app trước đó"
          ],
          "followUps": [
            "Deferred Deep Linking hoạt động ra sao khi phải qua khâu tải app từ App Store / Google Play?",
            "Làm thế nào để xử lý state điều hướng ngăn nắp với AutoRoute hoặc GoRouter trong Flutter?"
          ],
          "tags": [
            "Deep Linking",
            "Universal Links",
            "App Links",
            "GoRouter"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation",
            "https://developer.android.com/guide"
          ],
          "redFlags": [
            "Chỉ cấu hình URL Scheme đơn giản mà không nắm được cơ chế Universal Links chuẩn bảo mật"
          ]
        },
        {
          "id": "MOB-SKILL-06",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em xây dựng quy trình tự động hóa kiểm thử và phát hành ứng dụng (CI/CD Mobile) bằng Fastlane kết hợp GitHub Actions như thế nào: từ quản lý chứng chỉ (Certificates & Provisioning Profiles) đến đẩy bản build lên TestFlight / Google Play Internal Track?",
          "evaluationCriteria": [
            "Sử dụng `fastlane match` để quản lý tập trung và mã hóa chứng chỉ iOS trong private git repository",
            "Tự động tăng số build (build number), ký số (code signing) và chạy automated tests trên CI",
            "Tự động tải bản build lên TestFlight và Firebase App Distribution kèm ghi chú phát hành (release notes)"
          ],
          "followUps": [
            "Làm thế nào để quản lý Keystore của Android an toàn trong môi trường CI mà không lộ mật khẩu?",
            "Sự khác biệt giữa Development, Ad-Hoc và App Store Provisioning Profiles trên iOS?"
          ],
          "tags": [
            "Fastlane",
            "CI/CD Mobile",
            "Code Signing",
            "TestFlight",
            "Match"
          ],
          "sourceRefs": [
            "https://docs.fastlane.tools/"
          ],
          "redFlags": [
            "Ký app và xuất file cài đặt thủ công bằng tay trên máy tính cá nhân cho mỗi bản release"
          ]
        },
        {
          "id": "MOB-SKILL-07",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược kiểm thử tự động cho Mobile: Em tổ chức Unit Test, Widget/Component Test và Integration/E2E Test như thế nào? Công cụ mock API và kiểm thử giao diện tự động trên thiết bị thật (Firebase Test Lab)?",
          "evaluationCriteria": [
            "Unit test cho tầng Business Logic (UseCases, Repositories, BLoCs/ViewModels) với Mocktail/Mockito",
            "Widget Test kiểm tra tương tác hiển thị và hành vi bấm nút cô lập không cần khởi động emulator",
            "Integration Test (Maestro, Patrol, Appium) kiểm tra luồng xuyên suốt và chạy trên đám mây thiết bị thật"
          ],
          "followUps": [
            "Golden Toolkit / Screenshot Testing giúp phát hiện lỗi sai lệch giao diện (Visual Regression) ra sao?",
            "Làm thế nào để cô lập hoàn toàn mạng ngoài trong quá trình chạy mobile automated tests?"
          ],
          "tags": [
            "Mobile Testing",
            "Widget Test",
            "Maestro",
            "Patrol",
            "Mocking"
          ],
          "sourceRefs": [
            "https://docs.flutter.dev"
          ],
          "redFlags": [
            "Không viết bất kỳ bài kiểm thử tự động nào, chỉ kiểm thử thủ công bằng mắt trên một máy duy nhất"
          ]
        },
        {
          "id": "MOB-SKILL-08",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Quản lý mức tiêu thụ pin và tài nguyên mạng trên thiết bị di động: Em thiết kế cơ chế tiết kiệm pin (Battery Optimization) khi ứng dụng cần theo dõi vị trí GPS ngầm hoặc đồng bộ dữ liệu định kỳ như thế nào?",
          "evaluationCriteria": [
            "Sử dụng Geofencing hoặc thay đổi tần suất lấy mẫu vị trí (Accuracy vs Power trade-off) thay vì liên tục bật GPS độ chính xác cao",
            "Gộp các request mạng thành từng mẻ (Request Batching) để tránh việc đánh thức chip sóng vô tuyến (Radio State) liên tục",
            "Tận dụng WorkManager trên Android và BackgroundTasks framework trên iOS với các ràng buộc về sạc pin và kết nối Wi-Fi"
          ],
          "followUps": [
            "Cơ chế Doze Mode trên Android ảnh hưởng như thế nào đến tác vụ chạy ngầm?",
            "Làm thế nào để đo lường mức độ tiêu thụ năng lượng bằng Energy Log trong Xcode Instruments?"
          ],
          "tags": [
            "Battery Optimization",
            "GPS Tracking",
            "WorkManager",
            "Background Processing"
          ],
          "sourceRefs": [
            "https://developer.android.com/guide",
            "https://developer.apple.com/documentation"
          ],
          "redFlags": [
            "Bật GPS độ chính xác cao chạy liên tục ở background khiến điện thoại người dùng bị nóng và cạn pin nhanh"
          ]
        },
        {
          "id": "MOB-SCEN-01",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại Mobile Developer (iOS/Android/Flutter), khi Crash on Launch cùng Emergency Response, Crashlytics, Hotfix Rollout xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "Crash on Launch",
            "Emergency Response",
            "Crashlytics",
            "Hotfix Rollout"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "MOB-SCEN-02",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Ứng dụng bị Apple Review từ chối (Rejection) theo Điều khoản 4.8 (Sign in with Apple) và 5.1.1 (Data Collection and Storage) do thiếu nút đăng nhập bằng Apple và xin quyền vị trí không rõ lý do. Em xử lý thế nào để pass review nhanh nhất?",
          "evaluationCriteria": [
            "Điều khoản 4.8: Bắt buộc bổ sung Sign in with Apple nếu app có đăng nhập bằng bên thứ ba (Google, Facebook); cấu hình đúng nút theo Apple Human Interface Guidelines",
            "Điều khoản 5.1.1: Cập nhật tệp `Info.plist` với nội dung giải thích lý do xin quyền (Usage Description) rõ ràng, cụ thể mục đích sử dụng cho người dùng",
            "Gửi phản hồi lịch sự kèm video demo qua Resolution Center của Apple giải thích rõ các điểm đã khắc phục"
          ],
          "followUps": [
            "Khi nào ứng dụng có thể được miễn trừ yêu cầu Sign in with Apple?",
            "Làm thế nào để chuẩn bị tài khoản test (Demo Account) hoàn hảo cho đội ngũ Review của Apple/Google?"
          ],
          "tags": [
            "App Store Rejection",
            "Sign in with Apple",
            "Permission Handling",
            "App Store Guidelines"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation"
          ],
          "redFlags": [
            "Cãi vã gay gắt với người kiểm duyệt của Apple hoặc gửi lại bản build mà không sửa chữa vi phạm"
          ]
        },
        {
          "id": "MOB-SCEN-03",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Người dùng phản ánh ứng dụng bị mất toàn bộ nội dung đang soạn dở trong biểu mẫu khi họ tạm thời chuyển sang ứng dụng khác để nhận cuộc gọi điện thoại hoặc sao chép mã OTP. Em khắc phục lỗi này ra sao?",
          "evaluationCriteria": [
            "Phân tích nguyên nhân: Hệ điều hành Android/iOS đã kill ứng dụng ở background do thiếu RAM (Process Death), làm mất state trong memory",
            "Khắc phục: Lưu tự động state của biểu mẫu vào SharedPreferences/UserDefaults hoặc SQLite ngay trong sự kiện `onPause`/`didEnterBackground`",
            "Khôi phục lại nội dung khi mở lại màn hình và xóa bản lưu nháp khi nộp form thành công"
          ],
          "followUps": [
            "Làm thế nào để mô phỏng Process Death trên máy ảo Android bằng lệnh `adb shell am kill`?",
            "Sự khác biệt giữa cấu hình thay đổi (Configuration Change như xoay màn hình) và Process Death?"
          ],
          "tags": [
            "Process Death",
            "State Preservation",
            "Background Kill",
            "Form UX"
          ],
          "sourceRefs": [
            "https://developer.android.com/guide",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ lưu state trong biến bộ nhớ của ViewModel mà không có cơ chế lưu trữ bền vững (Persistent Storage)"
          ]
        },
        {
          "id": "MOB-SCEN-04",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Màn hình chụp ảnh và chỉnh sửa ảnh liên tục bị crash do Out Of Memory (OOM) sau khi người dùng chụp từ 5 bức ảnh chất lượng cao trở lên trên các thiết bị cấu hình yếu. Các bước tối ưu hóa luồng xử lý ảnh của em là gì?",
          "evaluationCriteria": [
            "Ngay sau khi chụp, lập tức nén và resize ảnh (Downsampling) về độ phân giải phù hợp với mục đích sử dụng trước khi load vào bộ nhớ",
            "Giải phóng các đối tượng Bitmap / UIImage cũ ngay khi không còn dùng bằng cách hủy tham chiếu hoặc gọi `recycle()`",
            "Sử dụng bộ nhớ đệm dạng đĩa (Disk Cache) thay vì giữ nhiều ảnh kích thước lớn trong bộ nhớ RAM"
          ],
          "followUps": [
            "Làm thế nào để đọc metadata ảnh (kích thước, hướng xoay EXIF) mà không cần nạp toàn bộ byte ảnh vào RAM?",
            "Thư viện xử lý ảnh nào hỗ trợ memory pooling hiệu quả?"
          ],
          "tags": [
            "OOM Crash",
            "Image Processing",
            "Bitmap Memory",
            "Downsampling"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Giữ nguyên file ảnh raw 20MB trong RAM cho mỗi lần chỉnh sửa"
          ]
        },
        {
          "id": "MOB-SCEN-05",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Người dùng phàn nàn ứng dụng không hiển thị được giao diện chính xác trên các thiết bị có 'tai thỏ' (Notch), Dynamic Island, thanh điều hướng cử chỉ hoặc màn hình gập (Foldable). Em xử lý khả năng thích ứng màn hình ra sao?",
          "evaluationCriteria": [
            "Bọc giao diện bên trong thành phần `SafeArea` (Flutter/React Native) hoặc neo vào `Safe Area Layout Guide` (iOS) và `WindowInsets` (Android)",
            "Sử dụng Layout Builder / MediaQuery để phản hồi linh hoạt theo kích thước màn hình và tỷ lệ khung hình khác nhau",
            "Kiểm thử trên nhiều mẫu thiết bị thực tế hoặc simulator có Dynamic Island và màn hình gập để đảm bảo không bị che khuất nội dung"
          ],
          "followUps": [
            "Cách xử lý bàn phím ảo (Virtual Keyboard) đẩy vỡ giao diện (Bottom Overflow) bằng `SingleChildScrollView` và `resizeToAvoidBottomInset`?",
            "Hỗ trợ màn hình gập hai màn hình (Dual-screen posture) cần lưu ý điều gì?"
          ],
          "tags": [
            "SafeArea",
            "Dynamic Island",
            "Responsive Mobile",
            "WindowInsets"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation",
            "https://developer.android.com/guide"
          ],
          "redFlags": [
            "Hardcode kích thước chiều cao status bar bằng số pixel cố định khiến giao diện bị đè lên tai thỏ"
          ]
        },
        {
          "id": "MOB-SCEN-06",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Ứng dụng tích hợp mô hình Mua hàng trong ứng dụng (In-App Purchases - IAP) để đăng ký gói thành viên VIP. Người dùng đã bị trừ tiền thành công nhưng app không mở khóa tính năng do lỗi mạng lúc trả về. Em thiết kế cơ chế hoàn tất giao dịch (Transaction Receipt Validation) thế nào?",
          "evaluationCriteria": [
            "Không bao giờ hoàn tất giao dịch (finishTransaction) tại Client trước khi backend xác thực thành công",
            "Client gửi biên lai (Receipt / Purchase Token) lên Backend để server gọi trực tiếp sang Apple StoreKit API / Google Play Developer API xác thực tính hợp lệ",
            "Lắng nghe sự kiện giao dịch chưa hoàn tất (Unfinished Transactions) ngay khi app khởi động để kích hoạt lại quy trình mở khóa"
          ],
          "followUps": [
            "Tại sao việc xác thực biên lai IAP trực tiếp từ Client là cực kỳ nguy hiểm (dễ bị bẻ khóa bằng app patcher)?",
            "Cơ chế Server-to-Server Notifications của Apple và Real-Time Developer Notifications của Google hỗ trợ gì cho việc gia hạn gói VIP?"
          ],
          "tags": [
            "In-App Purchase",
            "IAP Validation",
            "Receipt Verification",
            "StoreKit"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation",
            "https://developer.android.com/guide"
          ],
          "redFlags": [
            "Chỉ dựa vào kết quả callback trả về ở client để mở khóa tính năng VIP cho người dùng"
          ]
        },
        {
          "id": "MOB-CV-01",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong các ứng dụng di động được ghi trên CV của em: Ứng dụng nào có kiến trúc phức tạp nhất và có lượng người dùng hoạt động (DAU/MAU) lớn nhất? Em đã đóng góp gì vào kiến trúc và trải nghiệm người dùng?",
          "evaluationCriteria": [
            "Trình bày mô hình kiến trúc áp dụng: Clean Architecture, MVVM, BLoC, MVI",
            "Nêu rõ số lượng màn hình, số người dùng thực tế và đánh giá sao (Rating) trên cửa hàng ứng dụng",
            "Chỉ rõ tính năng khó nhất do chính mình xây dựng và giải pháp vượt qua thách thức"
          ],
          "followUps": [
            "Nếu được viết lại ứng dụng đó từ đầu với công nghệ hiện tại, em sẽ thay đổi điều gì?",
            "Chỉ số Crash-free users của ứng dụng đó duy trì ở mức bao nhiêu phần trăm?"
          ],
          "tags": [
            "Architecture",
            "App Store Presence",
            "Scale",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nói chung chung lý thuyết mà không nhớ tên ứng dụng, cấu trúc màn hình hoặc các tính năng chính"
          ]
        },
        {
          "id": "MOB-CV-02",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em có nêu kinh nghiệm xử lý tính năng bản đồ và định vị GPS. Hãy chia sẻ cách em tối ưu hóa việc vẽ hàng nghìn điểm đánh dấu (Markers) trên bản đồ mà không làm lag ứng dụng?",
          "evaluationCriteria": [
            "Áp dụng kỹ thuật gom cụm điểm đánh dấu (Marker Clustering) để chỉ render số lượng điểm vừa phải theo mức zoom",
            "Tải trước các icon đánh dấu vào bộ nhớ đệm (Bitmap cache) thay vì tạo mới cho từng marker",
            "Chỉ tải và hiển thị các địa điểm nằm trong ranh giới khung nhìn bản đồ hiện tại (Visible Map Bounds)"
          ],
          "followUps": [
            "Làm thế nào để xử lý vẽ đường đi mượt mà (Polyline animation) theo thời gian thực?",
            "Cách xin quyền vị trí theo ngữ cảnh (When in use vs Always) để tăng tỷ lệ người dùng chấp thuận?"
          ],
          "tags": [
            "Google Maps",
            "Marker Clustering",
            "GPS Tracking",
            "Performance"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Render trực tiếp hàng nghìn marker lên bản đồ cùng một lúc khiến ứng dụng bị đơ cứng"
          ]
        },
        {
          "id": "MOB-CV-03",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em ghi nhận kinh nghiệm tích hợp SDK bên thứ ba trên mobile (ví dụ Facebook SDK, Firebase, MoEngage, Zalo SDK). Em đã gặp xung đột thư viện (Dependency Conflict) hoặc lỗi biên dịch nào và cách giải quyết ra sao?",
          "evaluationCriteria": [
            "Giải quyết xung đột phiên bản trong Gradle (Dependency Resolution Strategy) hoặc CocoaPods/SPM",
            "Xử lý lỗi MultiDex khi số lượng phương thức vượt quá 65.536 methods trên Android",
            "Đảm bảo tuân thủ chính sách bảo mật App Tracking Transparency (ATT) của iOS khi tích hợp SDK quảng cáo"
          ],
          "followUps": [
            "Làm thế nào để đo lường dung lượng mà một SDK ngoài cộng thêm vào kích thước app?",
            "Chiến lược bọc các SDK bên thứ ba bằng Adapter Pattern để dễ dàng thay thế khi cần?"
          ],
          "tags": [
            "Third-party SDK",
            "MultiDex",
            "CocoaPods",
            "Dependency Conflict"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Thêm SDK vào dự án một cách tùy tiện mà không đọc kỹ tài liệu cấp quyền và ảnh hưởng bảo mật"
          ]
        },
        {
          "id": "MOB-CV-04",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em hãy kể về một lỗi kỳ lạ chỉ xảy ra trên một dòng máy hoặc phiên bản hệ điều hành cụ thể (ví dụ: máy Xiaomi/Oppo bị tắt ngầm thông báo, hoặc máy Samsung lỗi camera) mà em đã từng xử lý thành công?",
          "evaluationCriteria": [
            "Xác định nguyên nhân đặc thù phần cứng hoặc hệ điều hành tùy biến (MIUI/ColorOS tối ưu pin cực đoan làm ngắt background service)",
            "Quy trình tái hiện lỗi: mượn thiết bị thật, dùng cloud device farm hoặc kiểm tra logs chi tiết qua Crashlytics",
            "Giải pháp thích ứng: hướng dẫn người dùng bật quyền tự khởi chạy (Auto-start) hoặc dùng cơ chế fallback phù hợp"
          ],
          "followUps": [
            "Tại sao việc chỉ test trên máy ảo Pixel/iPhone là không đủ đối với một ứng dụng Android quy mô lớn?",
            "Làm thế nào để duy trì danh sách thiết bị kiểm thử đại diện trong công ty?"
          ],
          "tags": [
            "Device Fragmentation",
            "Vendor Customization",
            "Android OEM",
            "Troubleshooting"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Phủ nhận lỗi và cho rằng nếu máy ảo chạy tốt thì lỗi là do điện thoại của người dùng"
          ]
        },
        {
          "id": "MOB-CV-05",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trong dự án có chức năng chat hoặc gọi video thời gian thực trên CV, em đã xử lý các sự kiện vòng đời cuộc gọi (như cuộc gọi điện thoại thông thường xen ngang, hoặc mất mạng giữa chừng) như thế nào?",
          "evaluationCriteria": [
            "Tích hợp CallKit trên iOS và ConnectionService trên Android để cuộc gọi VoIP hiển thị như cuộc gọi hệ thống",
            "Lắng nghe sự kiện audio session interruption để tạm dừng và kích hoạt lại luồng âm thanh mượt mà",
            "Xử lý tái kết nối phòng gọi (Room reconnection) tự động và hiển thị trạng thái kết nối mạng yếu cho người dùng"
          ],
          "followUps": [
            "Cơ chế VoIP Push Notification (PushKit) hoạt động ra sao và yêu cầu nghiêm ngặt nào của Apple?",
            "Cách tối ưu hóa chất lượng video thích ứng theo băng thông mạng (Adaptive Bitrate)?"
          ],
          "tags": [
            "WebRTC",
            "CallKit",
            "VoIP",
            "Realtime Communication"
          ],
          "sourceRefs": [
            "https://developer.apple.com/documentation",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Không xử lý sự cố khi có cuộc gọi di động xen ngang khiến âm thanh của app bị mất hoàn toàn"
          ]
        },
        {
          "id": "MOB-BEHAV-01",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "behavioral",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Khi Designer đưa ra bản thiết kế giao diện theo phong cách iOS (Human Interface Guidelines) nhưng Product Owner muốn dùng chung 100% giao diện đó cho cả Android, em trao đổi và bảo vệ trải nghiệm người dùng trên từng nền tảng thế nào?",
          "evaluationCriteria": [
            "Tôn trọng phong cách đặc thù của từng hệ điều hành: nút Back vật lý, vị trí Tabs, thanh điều hướng, cử chỉ vuốt",
            "Chỉ ra rủi ro: người dùng Android sẽ cảm thấy xa lạ và khó chịu nếu bị ép dùng trải nghiệm gượng gạo của iOS",
            "Đề xuất giải pháp hài hòa: giữ nguyên nhận diện thương hiệu cốt lõi nhưng linh hoạt thích ứng các thành phần điều hướng chuẩn theo platform"
          ],
          "followUps": [
            "Khi nào việc sử dụng một giao diện tùy biến hoàn toàn (Branded UI) là chấp nhận được cho cả hai nền tảng?",
            "Làm thế nào để demo trực tiếp trên 2 máy thật để thuyết phục PO và Designer?"
          ],
          "tags": [
            "Platform Guidelines",
            "Material Design",
            "HIG",
            "Design Collaboration"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Thụ động làm theo mà không lên tiếng hoặc ngược lại từ chối cộc lốc không giải thích lý do"
          ]
        },
        {
          "id": "MOB-BEHAV-02",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Ứng dụng di động khi đã phát hành thì không thể sửa lỗi tức thời như Web (phải chờ người dùng cập nhật qua store). Em xây dựng quy trình kiểm soát chất lượng (QA) và tư duy an toàn trước mỗi đợt release như thế nào?",
          "evaluationCriteria": [
            "Tâm thế cẩn trọng: mỗi dòng code lên mobile đều phải được kiểm thử kỹ lưỡng vì chi phí sửa sai cực kỳ đắt đỏ",
            "Thiết lập quy trình Staged Rollout (phát hành dần từ 5% -> 20% -> 50% -> 100%) để theo dõi tỷ lệ crash trước khi mở rộng",
            "Xây dựng hệ thống Feature Flags và Remote Config để có thể tắt tính năng bị lỗi từ xa mà không cần submit bản build mới"
          ],
          "followUps": [
            "Nếu phát hiện bug nghiêm trọng khi app vừa đạt 10% rollout, hành động đầu tiên của em là gì?",
            "Làm thế nào để thông báo cho người dùng cập nhật phiên bản mới một cách tinh tế?"
          ],
          "tags": [
            "Release Management",
            "Staged Rollout",
            "Feature Flags",
            "Mobile Mindset"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cẩu thả release ngay 100% người dùng mà không có giai đoạn thử nghiệm hoặc không chuẩn bị phương án dự phòng"
          ]
        },
        {
          "id": "MOB-BEHAV-03",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi Backend API thay đổi cấu trúc dữ liệu đột ngột khiến ứng dụng di động của người dùng bị vỡ giao diện hoặc crash, em xử lý giao tiếp với đội ngũ Backend và xây dựng cơ chế phòng vệ (Defensive Programming) ở Client ra sao?",
          "evaluationCriteria": [
            "Nguyên tắc phòng vệ: Client không bao giờ tin tưởng tuyệt đối vào API, luôn kiểm tra null an toàn và có giá trị fallback mặc định",
            "Góp ý với đội Backend về tầm quan trọng của tính tương thích ngược (Backward Compatibility) và tuân thủ hợp đồng API",
            "Thống nhất quy trình kiểm thử hợp đồng (Contract Testing) trước khi deploy backend mới"
          ],
          "followUps": [
            "Làm thế nào để parse JSON an toàn trong Swift/Kotlin mà không làm crash app khi thiếu một trường không bắt buộc?",
            "Cách ứng xử chuyên nghiệp không đổ lỗi khi sự cố xảy ra giữa hai đội?"
          ],
          "tags": [
            "Defensive Programming",
            "Backend Collaboration",
            "API Mismatch",
            "Crash Prevention"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Viết code parse JSON ép kiểu cứng (force unwrap) rồi đổ lỗi hoàn toàn cho Backend khi có lỗi phát sinh"
          ]
        },
        {
          "id": "MOB-BEHAV-04",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi ứng dụng nhận phải hàng loạt đánh giá 1 sao (1-star reviews) tiêu cực trên Google Play và App Store do một lỗi giật lag ở phiên bản mới, em tiếp nhận phản hồi và hành động cùng đội ngũ ra sao?",
          "evaluationCriteria": [
            "Bình tĩnh lắng nghe, phân loại các đánh giá để trích xuất thông tin lỗi kỹ thuật (dòng máy, phiên bản hệ điều hành)",
            "Phối hợp với Customer Support phản hồi chân thành xin lỗi người dùng và cam kết thời gian khắc phục",
            "Tập trung cao độ tái hiện và sửa lỗi dứt điểm, release bản vá và mời những người dùng đó trải nghiệm lại để nâng điểm đánh giá"
          ],
          "followUps": [
            "Làm thế nào để khuyến khích những người dùng hài lòng đánh giá 5 sao cho app (In-App Review prompt) đúng thời điểm?",
            "Bài học kinh nghiệm về việc thử nghiệm hiệu năng trước khi release là gì?"
          ],
          "tags": [
            "User Feedback",
            "App Store Rating",
            "Customer Empathy",
            "Reputation Management"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Phớt lờ phản hồi của người dùng hoặc phản hồi với thái độ bực bội, tiêu cực trên store"
          ]
        },
        {
          "id": "MOB-BEHAV-05",
          "role": "Mobile Developer (iOS/Android/Flutter)",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trước cuộc tranh luận nội bộ về việc nên phát triển Native thuần (Swift & Kotlin) hay dùng Cross-Platform (Flutter / React Native) cho sản phẩm mới của công ty, em phân tích và đưa ra khuyến nghị dựa trên những yếu tố nào?",
          "evaluationCriteria": [
            "Đánh giá dựa trên bài toán kinh doanh: ngân sách, thời gian đưa sản phẩm ra thị trường (Time to Market), nguồn nhân lực hiện có",
            "Đánh giá yêu cầu kỹ thuật: mức độ can thiệp vào phần cứng sâu (Bluetooth, Camera AR, xử lý âm thanh phức tạp thì ưu tiên Native)",
            "Khuyến nghị phương án phù hợp nhất cho bối cảnh doanh nghiệp thay vì chỉ chọn theo sở thích cá nhân"
          ],
          "followUps": [
            "Khi nào việc chọn Cross-platform có thể trở thành cái bẫy kỹ thuật tốn kém hơn cả làm Native?",
            "Chiến lược chuyển đổi từng bước nếu một ngày dự án cần chuyển từ Cross-platform sang Native là gì?"
          ],
          "tags": [
            "Native vs Cross-platform",
            "Technology Evaluation",
            "Strategic Decision",
            "Business Alignment"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra ý kiến phiến diện bảo thủ ca ngợi một công nghệ duy nhất mà bỏ qua bối cảnh bài toán doanh nghiệp"
          ]
        }
      ]
    },
    {
      "role": "React Native Developer",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "react native developer",
        "react native engineer",
        "rn developer"
      ],
      "questions": [
        {
          "id": "RN-FOUND-01",
          "role": "React Native Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong React Native Developer, phân biệt New Architecture, JSI, Fabric, TurboModules; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của New Architecture.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc React Native Developer."
          ],
          "followUps": [
            "Nếu phải giải thích New Architecture cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "New Architecture",
            "JSI",
            "Fabric",
            "TurboModules",
            "Bridge"
          ],
          "sourceRefs": [
            "https://reactnative.dev/docs"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "RN-FOUND-02",
          "role": "React Native Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Công cụ máy ảo JavaScript Hermes Engine đóng vai trò gì trong React Native? Tại sao Hermes giúp cải thiện đáng kể thời gian khởi động (Time to Interactive - TTI), dung lượng bộ nhớ RAM và kích thước app?",
          "evaluationCriteria": [
            "Hermes biên dịch trước mã JavaScript thành mã bytecode tối ưu lúc build-time (AOT Compilation) thay vì JIT lúc runtime",
            "Cơ chế Garbage Collection tối ưu riêng biệt cho môi trường thiết bị di động với bộ nhớ hạn chế",
            "Giảm thiểu thời gian phân tích cú pháp (parsing) và biên dịch script khi người dùng mở ứng dụng lần đầu (Cold Start)"
          ],
          "followUps": [
            "Khi nào việc bật Hermes có thể gây lỗi không tương thích với một số tính năng JavaScript hiện đại (như Intl hoặc Proxy cũ)?",
            "Làm thế nào để phân tích CPU và Heap profile của Hermes bằng Chrome DevTools hoặc Flipper?"
          ],
          "tags": [
            "Hermes Engine",
            "Bytecode",
            "TTI",
            "Garbage Collection",
            "Performance"
          ],
          "sourceRefs": [
            "https://hermesengine.dev/"
          ],
          "redFlags": [
            "Không biết Hermes Engine là gì và nghĩ rằng React Native luôn dùng JavaScriptCore mặc định"
          ]
        },
        {
          "id": "RN-FOUND-03",
          "role": "React Native Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Trong React Native, sự khác biệt giữa JavaScript Thread và UI Thread (Native Main Thread) là gì? Hiện tượng sụt giảm khung hình (Frame Drop) khi chạy animation nặng xảy ra do nguyên nhân nào?",
          "evaluationCriteria": [
            "JavaScript Thread: xử lý logic React, tính toán state, gọi API và chạy các hàm JS",
            "UI Thread: phụ trách vẽ pixel, xử lý cử chỉ vuốt chạm và animation native",
            "Nếu JS Thread bị block bởi tác vụ tính toán nặng, animation dựa trên JS sẽ bị giật lag; cần dùng `useNativeDriver: true` hoặc Reanimated để đẩy tính toán sang UI Thread"
          ],
          "followUps": [
            "React Native Reanimated thực thi code animation trên UI Thread thông qua cơ chế Worklet như thế nào?",
            "Sự khác biệt giữa layout engine Yoga (Flexbox C++) và layout engine của trình duyệt web?"
          ],
          "tags": [
            "JS Thread",
            "UI Thread",
            "useNativeDriver",
            "Reanimated",
            "Yoga"
          ],
          "sourceRefs": [
            "https://reactnative.dev/docs"
          ],
          "redFlags": [
            "Không phân biệt được tác vụ nào đang chạy trên JS Thread và tác vụ nào chạy trên UI Thread"
          ]
        },
        {
          "id": "RN-FOUND-04",
          "role": "React Native Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Cơ chế Layout Yoga Engine trong React Native: Yoga hiện thực hóa Flexbox CSS trên C++ để tương thích cả iOS và Android như thế nào? Những thuộc tính CSS Web nào KHÔNG được hỗ trợ hoặc có hành vi khác trong React Native?",
          "evaluationCriteria": [
            "Yoga tính toán layout dựa trên Flexbox tiêu chuẩn và gán tọa độ x, y, width, height trực tiếp cho các view native",
            "Sự khác biệt cốt lõi: `flexDirection` mặc định là `column` (không phải `row` như web), không hỗ trợ CSS Grid, không kế thừa style (no cascading)",
            "Đơn vị kích thước trong React Native là Density-independent Pixels (dp/pt), không có `px`, `rem`, `em`"
          ],
          "followUps": [
            "Tại sao việc lồng ghép quá nhiều tầng View có thể làm suy giảm hiệu năng tính toán layout của Yoga?",
            "Cơ chế hiển thị văn bản (Text component) trong React Native có gì đặc thù so với thẻ `span`/`p` trên Web?"
          ],
          "tags": [
            "Yoga Engine",
            "Flexbox",
            "Layout Architecture",
            "Styling Differences"
          ],
          "sourceRefs": [
            "https://yogalayout.dev/"
          ],
          "redFlags": [
            "Nhầm lẫn flex-direction mặc định của React Native giống như CSS trên trình duyệt web"
          ]
        },
        {
          "id": "RN-FOUND-05",
          "role": "React Native Developer",
          "category": "foundation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Quy trình xây dựng một Native Module tùy chỉnh (Custom Native Module) trong React Native: Làm thế nào để viết mã Swift/Objective-C trên iOS và Kotlin/Java trên Android để phơi bày (expose) một tính năng phần cứng sang JavaScript?",
          "evaluationCriteria": [
            "iOS: dùng macro `RCT_EXPORT_MODULE()` và `RCT_EXPORT_METHOD()`, trả kết quả qua Callback hoặc Promise",
            "Android: kế thừa `ReactContextBaseJavaModule`, dùng annotation `@ReactMethod`, xử lý luồng background an toàn",
            "Với kiến trúc mới TurboModules: định nghĩa giao diện trừu tượng bằng TypeScript/Flow Spec và Codegen tự sinh mã C++"
          ],
          "followUps": [
            "Làm thế nào để gửi sự kiện (Event Emitter) từ Native ngược về JavaScript mà không cần JS chủ động gọi hàm?",
            "Cách xử lý đồng bộ luồng (Thread Safety) khi gọi phương thức native từ JS?"
          ],
          "tags": [
            "Native Modules",
            "TurboModules",
            "Codegen",
            "Swift",
            "Kotlin"
          ],
          "sourceRefs": [
            "https://reactnative.dev/docs"
          ],
          "redFlags": [
            "Chỉ biết cài thư viện có sẵn qua npm mà không hiểu cấu trúc của một Native Module bên dưới"
          ]
        },
        {
          "id": "RN-FOUND-06",
          "role": "React Native Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Các giải pháp lưu trữ dữ liệu ngoại tuyến (Offline Storage) trong React Native: So sánh AsyncStorage, MMKV (Tencent), WatermelonDB và SQLite. Tại sao react-native-mmkv có tốc độ đọc ghi nhanh gấp hàng chục lần AsyncStorage?",
          "evaluationCriteria": [
            "AsyncStorage lưu trữ qua SQLite/file và truyền dữ liệu bất đồng bộ qua Bridge, tốc độ chậm khi đọc ghi lượng lớn",
            "MMKV sử dụng cơ chế Memory-mapped file (mmap) trong C++ kết hợp JSI, cho phép đọc ghi đồng bộ tức thì trực tiếp vào RAM",
            "WatermelonDB và SQLite tối ưu cho dữ liệu quan hệ phức tạp, hỗ trợ truy vấn dải và quan sát thay đổi (Observable)"
          ],
          "followUps": [
            "Khi nào việc lưu dữ liệu đồng bộ bằng MMKV có thể gây block JS Thread nếu lạm dụng lưu trữ object quá lớn?",
            "Làm thế nào để mã hóa dữ liệu nhạy cảm được lưu trong MMKV bằng khóa bảo mật?"
          ],
          "tags": [
            "MMKV",
            "AsyncStorage",
            "SQLite",
            "mmap",
            "Offline Storage"
          ],
          "sourceRefs": [
            "https://github.com/mrousavy/react-native-mmkv"
          ],
          "redFlags": [
            "Mặc định sử dụng AsyncStorage để lưu toàn bộ cache dữ liệu lớn của ứng dụng"
          ]
        },
        {
          "id": "RN-SKILL-01",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng FlatList (FlashList, Performance Optimization, List Recycling) cho React Native Developer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng FlatList ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "FlatList",
            "FlashList",
            "Performance Optimization",
            "List Recycling"
          ],
          "sourceRefs": [
            "https://shopify.github.io/flash-list/"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "RN-SKILL-02",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập React Native Developer: dựa trên Reanimated, phối hợp Gesture Handler, Worklets, UI Thread Animation; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "Reanimated",
            "Gesture Handler",
            "Worklets",
            "UI Thread Animation"
          ],
          "sourceRefs": [
            "https://docs.swmansion.com/react-native-reanimated/"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "RN-SKILL-03",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em triển khai giải pháp Cập nhật qua mạng (Over-The-Air - OTA Updates) bằng CodePush hoặc Expo Updates như thế nào? Những thay đổi nào KHÔNG THỂ cập nhật qua OTA mà bắt buộc phải submit bản build mới lên App Store/Google Play?",
          "evaluationCriteria": [
            "OTA chỉ có thể cập nhật gói bundle JavaScript và các tài nguyên hình ảnh tĩnh (assets)",
            "Mọi thay đổi liên quan đến Native Code (cài thêm thư viện native mới, sửa Podfile, sửa build.gradle, đổi quyền hệ thống) đều không thể cập nhật qua OTA",
            "Thiết lập cơ chế Rollback tự động nếu bản bundle mới tải về bị crash ngay khi khởi động (Rollback on error)"
          ],
          "followUps": [
            "Quy định của Apple App Store (Điều khoản 3.3.2) về việc cập nhật code qua OTA cho phép những gì và cấm những gì?",
            "Làm thế nào để chia nhỏ việc phát hành OTA theo tỷ lệ phần trăm (Targeted Rollout)?"
          ],
          "tags": [
            "CodePush",
            "OTA Updates",
            "Expo Updates",
            "Release Strategy"
          ],
          "sourceRefs": [
            "https://reactnative.dev/docs"
          ],
          "redFlags": [
            "Nghĩ rằng có thể thêm thư viện Native mới bằng OTA mà không cần build lại file APK/IPA"
          ]
        },
        {
          "id": "RN-SKILL-04",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Quy trình nâng cấp phiên bản React Native (React Native Upgrade): Em sử dụng công cụ React Native Upgrade Helper để xử lý các xung đột native code (Podfile, Gradle, AppDelegate, MainApplication) giữa các phiên bản lớn ra sao?",
          "evaluationCriteria": [
            "Đọc kỹ bản so sánh diff trên Upgrade Helper giữa phiên bản cũ và phiên bản đích",
            "Cập nhật từng bước: nâng cấp file package.json, dọn dẹp node_modules, cập nhật Podfile/build.gradle, resolve conflict trong native code",
            "Chạy thử nghiệm toàn diện trên cả iOS Simulator và Android Emulator, kiểm tra tính tương thích của tất cả các thư viện thứ ba"
          ],
          "followUps": [
            "Khi nào nên cân nhắc tạo một dự án mới hoàn toàn ở phiên bản đích rồi chuyển code sang thay vì upgrade in-place?",
            "Chiến lược xử lý khi một thư viện native quan trọng chưa hỗ trợ phiên bản React Native mới nhất là gì?"
          ],
          "tags": [
            "Upgrade Helper",
            "Dependency Management",
            "Gradle",
            "CocoaPods",
            "Maintenance"
          ],
          "sourceRefs": [
            "https://react-native-community.github.io/upgrade-helper/"
          ],
          "redFlags": [
            "Chỉ tăng số phiên bản trong package.json rồi chạy npm install mà không cập nhật các tệp native"
          ]
        },
        {
          "id": "RN-SKILL-05",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em tổ chức điều hướng ứng dụng bằng React Navigation (Stack, Tab, Drawer, Modal) như thế nào? Cách cấu trúc TypeScript Types cho các màn hình và tham số điều hướng (Navigation Prop Type-Safety)?",
          "evaluationCriteria": [
            "Định nghĩa kiểu dữ liệu `RootStackParamList` ánh xạ tên màn hình với kiểu dữ liệu của params",
            "Sử dụng `NativeStackNavigationProp` và `RouteProp` để đảm bảo type-safety hoàn hảo lúc truyền và nhận params",
            "Tối ưu hóa bộ nhớ: chỉ nạp màn hình khi cần thiết (unmountInactiveRoutes) và tránh lồng ghép quá nhiều Navigator phức tạp"
          ],
          "followUps": [
            "Sự khác biệt giữa JS-based Stack Navigator và Native Stack Navigator (sử dụng UINavigationController/Fragment) là gì?",
            "Làm thế nào để đồng bộ trạng thái điều hướng với Universal Links và Deep Linking?"
          ],
          "tags": [
            "React Navigation",
            "Native Stack",
            "Type Safety",
            "Deep Linking"
          ],
          "sourceRefs": [
            "https://reactnavigation.org/docs/typescript/"
          ],
          "redFlags": [
            "Truyền các object dữ liệu quá lớn hoặc callback functions qua route params gây lỗi cảnh báo non-serializable values"
          ]
        },
        {
          "id": "RN-SKILL-06",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em thiết lập quy trình kiểm thử tự động cho dự án React Native: Cách sử dụng React Native Testing Library (RNTL) để kiểm thử component và Maestro / Detox để kiểm thử E2E trên ứng dụng thật?",
          "evaluationCriteria": [
            "RNTL kiểm thử hành vi người dùng (fireEvent, waitFor, findByText) dựa trên component render cô lập không cần native runtime",
            "Maestro viết kịch bản E2E bằng YAML trực quan, chạy trực tiếp trên simulator với tốc độ cao và ít bị flaky",
            "Detox chạy E2E với cơ chế Gray-box synchronization, tự động chờ JS Thread và UI Thread nhàn rỗi mới thực thi lệnh tiếp theo"
          ],
          "followUps": [
            "Tại sao việc test component với Jest trong React Native cần mock rất nhiều native modules?",
            "Làm thế nào để thiết lập CI tự động chạy Maestro tests trên GitHub Actions?"
          ],
          "tags": [
            "Testing",
            "RNTL",
            "Maestro",
            "Detox",
            "E2E Testing"
          ],
          "sourceRefs": [
            "https://callstack.github.io/react-native-testing-library/"
          ],
          "redFlags": [
            "Không viết bất kỳ unit test nào và cho rằng React Native rất khó để tự động hóa kiểm thử"
          ]
        },
        {
          "id": "RN-SKILL-07",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em quản lý các biến môi trường nhạy cảm và cấu hình nhiều phiên bản app (Staging, Production với Bundle ID / Package Name khác nhau) trong React Native bằng phương pháp nào?",
          "evaluationCriteria": [
            "Sử dụng Build Flavors trên Android (staging/prod trong build.gradle) và Schemes/Configurations trên iOS (Xcode Schemes)",
            "Tách biệt Application ID / Bundle ID để có thể cài đặt đồng thời cả bản Test và bản Production trên cùng một điện thoại",
            "Dùng `react-native-config` để truyền biến môi trường vào cả native code (AndroidManifest, Info.plist) và JavaScript"
          ],
          "followUps": [
            "Làm thế nào để đổi icon và tên hiển thị của app theo từng build flavor tự động?",
            "Cách bảo vệ các API keys quan trọng không bị lộ khi phân tích file APK bằng decompiler?"
          ],
          "tags": [
            "Build Flavors",
            "Xcode Schemes",
            "Environment Configuration",
            "Multi-environment"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Thay đổi thủ công biến môi trường trong code trước mỗi lần build và xuất file cài đặt"
          ]
        },
        {
          "id": "RN-SKILL-08",
          "role": "React Native Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Làm thế nào để sử dụng Flipper, React DevTools Profiler và Xcode Instruments / Android Studio Profiler để phát hiện rò rỉ bộ nhớ (Memory Leak) và tối ưu hóa thời gian khởi động (Startup Time) trong React Native?",
          "evaluationCriteria": [
            "Sử dụng React DevTools Profiler để theo dõi các component bị re-render liên tục trên JS Thread",
            "Dùng Xcode Instruments (Allocations, Time Profiler) để tìm kiếm các native view không được thu hồi bộ nhớ",
            "Phân tích Startup Time bằng Android Systrace / Perfetto để đo chính xác thời gian nạp native framework, khởi tạo JS engine và chạy root component"
          ],
          "followUps": [
            "Làm thế nào để đo lường chỉ số JS Heap Size trong môi trường production thông qua Crashlytics hoặc New Relic?",
            "Kỹ thuật Inline Requires hỗ trợ giảm thời gian khởi động ban đầu ra sao?"
          ],
          "tags": [
            "Profiling",
            "Instruments",
            "Flipper",
            "Memory Leak",
            "Startup Optimization"
          ],
          "sourceRefs": [
            "https://reactnative.dev/docs"
          ],
          "redFlags": [
            "Chỉ dựa vào cảm tính cá nhân khi đánh giá ứng dụng nhanh hay chậm mà không dùng công cụ đo đạc số liệu"
          ]
        },
        {
          "id": "RN-SCEN-01",
          "role": "React Native Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại React Native Developer, khi Keyboard Handling cùng TextInput, KeyboardAvoidingView, Cross-platform UI xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "Keyboard Handling",
            "TextInput",
            "KeyboardAvoidingView",
            "Cross-platform UI"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "RN-SCEN-02",
          "role": "React Native Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Sau khi người dùng mở ứng dụng và lướt xem danh sách sản phẩm khoảng 15 phút, điện thoại bắt đầu nóng lên và tốc độ khung hình sụt giảm từ 60fps xuống 15fps. Em khoanh vùng và khắc phục hiện tượng rò rỉ bộ nhớ hoặc vòng lặp tác vụ ra sao?",
          "evaluationCriteria": [
            "Kết nối app với Flipper hoặc Chrome DevTools Memory để chụp Memory Heap Snapshot tại phút thứ 1 và phút thứ 15",
            "Kiểm tra xem có component nào unmount nhưng không dọn dẹp interval, event listener hoặc subscription (Redux/EventEmitter)",
            "Rà soát cache hình ảnh xem thư viện image có giải phóng bộ nhớ đệm hay đang tích lũy hàng nghìn ảnh kích thước lớn trong RAM"
          ],
          "followUps": [
            "Làm thế nào để sử dụng biến cờ `isMounted` hoặc AbortController để ngăn chặn cập nhật state sau khi component đã unmount?",
            "Tại sao việc lưu trữ quá nhiều dữ liệu vào Redux store mà không dọn dẹp có thể làm nặng JS engine?"
          ],
          "tags": [
            "Memory Leak",
            "Performance Degradation",
            "Heap Snapshot",
            "Jank Investigation"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Khuyên người dùng khởi động lại ứng dụng định kỳ thay vì tìm kiếm nguyên nhân rò rỉ tài nguyên"
          ]
        },
        {
          "id": "RN-SCEN-03",
          "role": "React Native Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Khi người dùng bấm vào đường link chia sẻ sản phẩm từ Zalo hoặc Facebook Messenger, ứng dụng React Native chỉ mở màn hình trang chủ (Home) chứ không mở đúng màn hình chi tiết sản phẩm. Em điều tra và sửa lỗi Deep Linking như thế nào?",
          "evaluationCriteria": [
            "Kiểm tra cấu hình scheme và prefixes trong cấu hình `linking` của React Navigation container",
            "Xử lý 2 kịch bản: Cold Start (sử dụng `getInitialURL()`) và Warm Start (lắng nghe sự kiện `Linking.addEventListener('url')`)",
            "Rà soát cấu hình URL parsing để đảm bảo trích xuất chính xác `productId` từ path hoặc query parameter"
          ],
          "followUps": [
            "Làm thế nào để test deep link nhanh chóng từ terminal bằng lệnh `adb shell am start` và `xcrun simctl openurl`?",
            "Khi đường link bị ứng dụng mạng xã hội mở trong In-App Browser của họ, làm sao để kích hoạt mở app chính?"
          ],
          "tags": [
            "Deep Linking",
            "Universal Links",
            "React Navigation",
            "Cold Start Routing"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ kiểm tra khi app đang mở sẵn mà bỏ qua trường hợp app bị đóng hoàn toàn từ trước"
          ]
        },
        {
          "id": "RN-SCEN-04",
          "role": "React Native Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Đội ngũ cập nhật một thư viện Native Module mới bằng npm nhưng lệnh `pod install` trên iOS báo lỗi xung đột phiên bản phụ thuộc (CocoaPods dependency conflict) và Android build báo lỗi trùng lặp tệp trùng tên trong `mergeDexDebug`. Các bước giải quyết xung đột của em là gì?",
          "evaluationCriteria": [
            "Trên iOS: kiểm tra file `Podfile.lock`, phân tích đồ thị phụ thuộc để xem thư viện nào đang yêu cầu phiên bản cũ hơn, dùng `pod update [pod_name]` hoặc override version",
            "Trên Android: kiểm tra `gradle dependencies` để tìm dependency trùng lặp, dùng lệnh `exclude group: '...', module: '...'` để loại bỏ thư viện dư thừa",
            "Kiểm tra tài liệu của thư viện để đảm bảo nó tương thích với phiên bản React Native hiện tại và có hỗ trợ New Architecture hay không"
          ],
          "followUps": [
            "Làm thế nào để sử dụng `patch-package` để sửa tạm thời lỗi biên dịch của một thư viện bên thứ ba trong node_modules?",
            "Sự khác biệt giữa CocoaPods truyền thống và Swift Package Manager (SPM) trong các dự án React Native mới?"
          ],
          "tags": [
            "Dependency Conflict",
            "CocoaPods",
            "Gradle Build",
            "Patch-package"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Xóa sạch dự án tải lại từ đầu mà không hiểu bản chất xung đột của các package phụ thuộc"
          ]
        },
        {
          "id": "RN-SCEN-05",
          "role": "React Native Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Ứng dụng tích hợp thông báo đẩy (Push Notifications). Khi ứng dụng đang mở (Foreground), thông báo từ FCM không tự hiển thị biểu ngữ (Banner) trên màn hình iOS. Em xử lý thông báo Foreground và tương tác bấm thông báo ra sao?",
          "evaluationCriteria": [
            "iOS mặc định không hiển thị banner thông báo khi ứng dụng đang ở Foreground trừ khi cấu hình rõ trong delegate",
            "Sử dụng callback `willPresentNotification` trong iOS Native code hoặc cấu hình `onMessage` trong Firebase Messaging để hiển thị in-app banner hoặc notification cục bộ",
            "Thống nhất payload dữ liệu để khi người dùng bấm vào thông báo ở cả Foreground, Background hay Quit state đều kích hoạt điều hướng chính xác"
          ],
          "followUps": [
            "Làm thế nào để sử dụng thư viện Notifee để tùy biến thông báo hiển thị cục bộ mượt mà trong React Native?",
            "Cách xử lý số lượng huy hiệu thông báo (Badge count) trên icon ứng dụng?"
          ],
          "tags": [
            "Push Notification",
            "Foreground Notification",
            "FCM",
            "Notifee"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cho rằng thông báo không hiển thị ở foreground là lỗi của máy chủ Firebase"
          ]
        },
        {
          "id": "RN-SCEN-06",
          "role": "React Native Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Ứng dụng tài chính ngân hàng yêu cầu phải phát hiện thiết bị đã bị can thiệp hệ thống (Root trên Android hoặc Jailbreak trên iOS) và chặn không cho mở ứng dụng để đảm bảo an toàn. Em triển khai giải pháp này và phòng chống bị bypass ra sao?",
          "evaluationCriteria": [
            "Tích hợp thư viện bảo mật native (như JailMonkey, react-native-security) kiểm tra sự tồn tại của các tệp binary nguy hiểm (su, Cydia, Frida, Magisk)",
            "Kiểm tra tính toàn vẹn của ứng dụng thông qua Google Play Integrity API trên Android và Apple DeviceCheck / App Attest trên iOS",
            "Đưa ra màn hình cảnh báo từ chối dịch vụ và xóa sạch dữ liệu phiên đăng nhập lưu trong bộ nhớ tạm"
          ],
          "followUps": [
            "Làm thế nào để chống kẻ tấn công can thiệp sửa đổi mã JavaScript bằng công cụ Frida để bypass hàm kiểm tra root?",
            "Tại sao không nên đặt tên hàm kiểm tra là `isJailbroken` một cách công khai trong mã nguồn?"
          ],
          "tags": [
            "Root Detection",
            "Jailbreak Detection",
            "Play Integrity",
            "Device Security"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ kiểm tra đơn giản bằng một hàm JS ở client rất dễ dàng bị kẻ xấu vô hiệu hóa qua Frida"
          ]
        },
        {
          "id": "RN-CV-01",
          "role": "React Native Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong dự án React Native tiêu biểu nhất trên CV, em đã trực tiếp viết đoạn mã Native Code (Swift hoặc Kotlin) nào để giải quyết một tính năng mà các thư viện mã nguồn mở có sẵn không đáp ứng được?",
          "evaluationCriteria": [
            "Mô tả tính năng thực tế: xử lý kết nối máy in Bluetooth đặc thù, tích hợp SDK phần cứng, xử lý camera scan mã vạch tốc độ cao",
            "Trình bày cách thức liên kết giữa Native Module và React Native (viết Method, Callback, Promise, Event Emitter)",
            "Khó khăn gặp phải về đồng bộ luồng hoặc quản trị bộ nhớ và cách giải quyết"
          ],
          "followUps": [
            "Tại sao em không chọn phương án chờ thư viện cộng đồng cập nhật?",
            "Đoạn mã native đó được kiểm thử và bảo trì như thế nào khi nâng cấp phiên bản hệ điều hành mới?"
          ],
          "tags": [
            "Custom Native Module",
            "Swift",
            "Kotlin",
            "Hardware Integration",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ghi thạo Native Module trên CV nhưng không giải thích được cấu trúc của một file module native đơn giản"
          ]
        },
        {
          "id": "RN-CV-02",
          "role": "React Native Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em có nêu kinh nghiệm tối ưu hóa hiệu năng ứng dụng React Native từ mức giật lag lên 60fps mượt mà. Hãy dẫn chứng màn hình cụ thể em đã tối ưu, công cụ dùng để đo đạc và các kỹ thuật đã áp dụng?",
          "evaluationCriteria": [
            "Chỉ rõ màn hình: Bảng tin cuộn dài, màn hình biểu đồ tài chính, hoặc giỏ hàng có nhiều tương tác phức tạp",
            "Công cụ đo lường thực tế: React DevTools Profiler, Flipper, Android GPU Rendering profile",
            "Kỹ thuật áp dụng: chuyển sang FlashList, áp dụng Reanimated worklets, bọc memo chuẩn xác, nén ảnh thông minh"
          ],
          "followUps": [
            "Chỉ số thời gian render của component trước và sau khi tối ưu giảm từ bao nhiêu ms xuống bao nhiêu ms?",
            "Có sự đánh đổi nào về dung lượng bộ nhớ khi áp dụng các kỹ thuật caching đó không?"
          ],
          "tags": [
            "Performance Optimization",
            "60fps",
            "Profiler",
            "Case Study",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra con số 60fps chung chung mà không nhớ được màn hình nào và kỹ thuật cụ thể đã can thiệp"
          ]
        },
        {
          "id": "RN-CV-03",
          "role": "React Native Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em ghi nhận kinh nghiệm triển khai OTA Update bằng CodePush trong dự án trên CV. Em đã thiết lập chiến lược phát hành bản cập nhật (Staged Rollout) và xử lý tình huống bản cập nhật JS bị lỗi runtime ra sao?",
          "evaluationCriteria": [
            "Cấu hình triển khai dần theo tỷ lệ phần trăm (vd: 10% -> 25% -> 100%) để theo dõi tỷ lệ crash qua Crashlytics",
            "Kích hoạt cơ chế tự động Rollback của CodePush nếu ứng dụng không gọi hàm `codePush.notifyAppReady()` trong lần mở đầu tiên",
            "Quản lý phiên bản nhắm mục tiêu (Target Binary Version) chính xác để tránh việc cập nhật bundle cho app phiên bản native cũ hơn"
          ],
          "followUps": [
            "Nếu bản cập nhật OTA bị lỗi nghiêm trọng làm crash app ngay lập tức, lệnh CLI nào của CodePush giúp rollback tức thời?",
            "Làm thế nào để hiển thị thanh tiến trình tải cập nhật ngầm cho người dùng?"
          ],
          "tags": [
            "CodePush",
            "Rollback Strategy",
            "Target Binary Version",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Không biết cơ chế Target Binary Version dẫn đến việc gửi bản cập nhật JS dùng tính năng native mới cho app phiên bản cũ"
          ]
        },
        {
          "id": "RN-CV-04",
          "role": "React Native Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em hãy chia sẻ về một bug phức tạp nhất mà em từng gặp chỉ xảy ra trên phiên bản Release (Production build) nhưng hoàn toàn KHÔNG THỂ tái hiện trong môi trường Debug (Development mode)?",
          "evaluationCriteria": [
            "Phân tích nguyên nhân phổ biến: tối ưu hóa mã nguồn của ProGuard/R8 làm xóa nhầm class native cần thiết, Hermes bytecode optimization, hoặc khác biệt về tính đồng bộ I/O",
            "Quy trình điều tra: build bản release cục bộ có kèm source map, đọc logcat qua Android Studio và thiết lập log crash chi tiết",
            "Giải pháp dứt điểm: cấu hình rule giữ lại class (keep rules) trong `proguard-rules.pro` hoặc fix lỗi logic phụ thuộc timing debug"
          ],
          "followUps": [
            "Tại sao việc bật debugger từ xa (Remote JS Debugging) lại làm sai lệch tốc độ thực thi của Event Loop?",
            "Làm thế nào để debug bản release build bằng source map trong Sentry?"
          ],
          "tags": [
            "Release-only Bug",
            "ProGuard Rules",
            "Hermes Bytecode",
            "Debugging",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Bỏ qua lỗi chỉ vì 'trên máy dev của em chạy bình thường' và không biết cách build bản release để kiểm tra cục bộ"
          ]
        },
        {
          "id": "RN-CV-05",
          "role": "React Native Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trong dự án đa ngôn ngữ và hỗ trợ giao diện người dùng theo hướng từ phải sang trái (RTL) trên CV, em đã tổ chức cấu trúc chuỗi ngôn ngữ và thích ứng layout Flexbox ra sao?",
          "evaluationCriteria": [
            "Sử dụng thư viện `i18next` hoặc `react-intl` quản lý tệp tài nguyên ngôn ngữ theo namespace",
            "Hỗ trợ RTL bằng API `I18nManager.allowRTL(true)` và sử dụng các thuộc tính hướng linh hoạt (`start`/`end` thay vì `left`/`right`)",
            "Khởi động lại ứng dụng tự động khi người dùng thay đổi ngôn ngữ sang khu vực có chiều văn bản ngược lại"
          ],
          "followUps": [
            "Tại sao việc dùng `marginRight` cố định có thể làm vỡ giao diện trên thiết bị tiếng Ả Rập (Arabic)?",
            "Cách định dạng ngày tháng, tiền tệ theo đúng Locale của thiết bị di động?"
          ],
          "tags": [
            "i18n",
            "RTL Support",
            "Localization",
            "Flexbox Adaptation",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Hardcode chuỗi văn bản trực tiếp trong các file component JSX"
          ]
        },
        {
          "id": "RN-BEHAV-01",
          "role": "React Native Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi đội ngũ Native iOS/Android trong công ty có cái nhìn nghi ngại về hiệu năng và độ ổn định của React Native, em chứng minh năng lực công nghệ và xây dựng mối quan hệ hợp tác tôn trọng lẫn nhau như thế nào?",
          "evaluationCriteria": [
            "Tôn trọng chuyên môn sâu của các kỹ sư Native và thừa nhận trung thực các giới hạn của React Native",
            "Chứng minh bằng số liệu thực tế: thời gian ra mắt tính năng nhanh gấp đôi, chia sẻ 80-90% mã nguồn, chỉ số FPS và độ trễ đạt chuẩn người dùng",
            "Chủ động học hỏi và nhờ các bạn Native hỗ trợ ở các phần việc liên quan đến hạ tầng native, bridge và CI/CD"
          ],
          "followUps": [
            "Làm thế nào để thúc đẩy tinh thần học hỏi chung giữa nhóm Web, nhóm Mobile Native và nhóm React Native?",
            "Em xử lý thế nào khi một bạn Native phản ánh rằng code React Native làm chậm ứng dụng chung?"
          ],
          "tags": [
            "Cross-team Collaboration",
            "Professional Respect",
            "Advocacy",
            "Engineering Culture"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tranh cãi cực đoan cho rằng React Native sẽ thay thế hoàn toàn Native hoặc ngược lại tự ti thu mình"
          ]
        },
        {
          "id": "RN-BEHAV-02",
          "role": "React Native Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi có một thư viện mã nguồn mở quan trọng trong dự án bị tác giả ngừng duy trì (abandoned/deprecated) sau khi React Native nâng cấp phiên bản mới, em xử lý tình huống này thế nào để không làm đình trệ dự án?",
          "evaluationCriteria": [
            "Đánh giá mức độ phụ thuộc: thư viện làm nhiệm vụ gì, có thể tự viết thay thế bằng code nội bộ được không",
            "Phương án ngắn hạn: dùng `patch-package` để tự sửa lỗi biên dịch hoặc fork repository về tổ chức để duy trì",
            "Phương án dài hạn: tìm kiếm thư viện cộng đồng tương đương có bảo trì tích cực hoặc tự viết giải pháp riêng cho team"
          ],
          "followUps": [
            "Quy trình đánh giá mức độ rủi ro của một thư viện bên thứ ba trước khi quyết định đưa vào dự án là gì?",
            "Em đã từng đóng góp bản sửa lỗi (Pull Request) ngược lại cho cộng đồng mã nguồn mở chưa?"
          ],
          "tags": [
            "Deprecated Library",
            "Open Source Maintenance",
            "Risk Mitigation",
            "Patch-package"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Bỏ cuộc hoặc dừng việc nâng cấp phiên bản của toàn bộ dự án chỉ vì một thư viện phụ bị lỗi"
          ]
        },
        {
          "id": "RN-BEHAV-03",
          "role": "React Native Developer",
          "category": "behavioral",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Khi Designer yêu cầu tạo các chuyển động hoạt cảnh (animations) rất phức tạp nhưng việc triển khai có thể khiến các dòng máy Android đời cũ bị giật lag, em trao đổi và tìm điểm cân bằng với Designer ra sao?",
          "evaluationCriteria": [
            "Mang trực tiếp thiết bị Android đời cũ đến trao đổi trực tiếp với Designer để họ nhìn thấy trải nghiệm thực tế",
            "Giải thích nguyên nhân giới hạn phần cứng và đề xuất phương án tinh chỉnh: giữ nguyên hiệu ứng mượt mà trên máy mạnh và tự động hạ độ phức tạp trên máy yếu",
            "Cùng Designer thống nhất một phiên bản animation thanh lịch, tối ưu mà vẫn giữ trọn vẹn cảm xúc thương hiệu"
          ],
          "followUps": [
            "Làm thế nào để kiểm tra năng lực phần cứng thiết bị (low-end device detection) để giảm bớt hiệu ứng tự động?",
            "Cách giải thích trade-off trải nghiệm một cách thấu cảm không làm Designer nản lòng?"
          ],
          "tags": [
            "Designer Empathy",
            "Hardware Constraints",
            "Animation Compromise",
            "Communication"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Âm thầm cắt bỏ animation mà không thông báo cho Designer hoặc cố đấm ăn xôi làm lag app của người dùng"
          ]
        },
        {
          "id": "RN-BEHAV-04",
          "role": "React Native Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trước hạn chót phát hành ứng dụng, Product Owner muốn đưa thêm gấp một tính năng mới vào bản build. Em phân tích quy trình kiểm duyệt của App Store (có thể mất 24-48 tiếng) và tư vấn phương án cho PO như thế nào?",
          "evaluationCriteria": [
            "Giải thích rõ ràng về chu kỳ release của Mobile: thời gian kiểm duyệt của Apple/Google nằm ngoài tầm kiểm soát của công ty",
            "Cảnh báo rủi ro: việc thêm tính năng gấp thiếu kiểm thử có thể dẫn đến bị rejected và làm chậm ngày ra mắt chính thức của toàn công ty",
            "Đề xuất phương án an toàn: phát hành bản build hiện tại đã được kiểm thử kỹ lưỡng đúng hạn, tính năng mới sẽ ra mắt ngay trong bản cập nhật tiếp theo"
          ],
          "followUps": [
            "Nếu PO vẫn yêu cầu phải đưa vào bằng mọi giá, em thiết lập cơ chế bảo vệ (Feature Flag / Remote Config) thế nào?",
            "Kinh nghiệm yêu cầu Apple duyệt khẩn cấp (Expedited Review) khi có lý do chính đáng là gì?"
          ],
          "tags": [
            "Release Planning",
            "App Store Review Cycle",
            "Scope Management",
            "Stakeholder Alignment"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đồng ý thêm vội vàng tính năng mới vào sát giờ submit khiến ứng dụng bị Apple từ chối và trễ kế hoạch toàn công ty"
          ]
        },
        {
          "id": "RN-BEHAV-05",
          "role": "React Native Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Khi đứng trước quyết định kỹ thuật: Tiếp tục sử dụng React Native truyền thống (CLI thuần) hay chuyển dịch sang sử dụng Expo Application Services (EAS) cho các dự án mới của công ty, em phân tích bài toán ra sao?",
          "evaluationCriteria": [
            "Phân tích sự phát triển của Expo hiện đại (EAS Build, Config Plugins, Continuous Native Generation) đã giải quyết hầu hết nhược điểm trước đây",
            "So sánh chi phí vận hành: Expo giúp giảm tải rất lớn công sức duy trì native build environment cho các lập trình viên frontend",
            "Đánh giá các ranh giới: dự án có dùng SDK native nội bộ cực kỳ đặc thù không thể viết Config Plugin không để quyết định chọn lựa"
          ],
          "followUps": [
            "Khi nào React Native CLI truyền thống vẫn là sự lựa chọn bắt buộc cho doanh nghiệp lớn?",
            "Chiến lược di chuyển từ React Native CLI sang Expo Prebuild diễn ra như thế nào?"
          ],
          "tags": [
            "Expo vs RN CLI",
            "EAS",
            "Strategic Decision",
            "Developer Experience"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Giữ định kiến cũ cho rằng 'Expo chỉ dành cho dự án học tập/đồ án sinh viên' mà không cập nhật tiến bộ công nghệ mới"
          ]
        }
      ]
    },
    {
      "role": "Vue.js / Angular Developer",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "vue developer",
        "angular developer",
        "vue.js developer",
        "angular engineer"
      ],
      "questions": [
        {
          "id": "VUE_NG-FOUND-01",
          "role": "Vue.js / Angular Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong Vue.js / Angular Developer, phân biệt Reactivity, Vue 3 Proxy, Angular Zone.js, Angular Signals; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của Reactivity.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc Vue.js / Angular Developer."
          ],
          "followUps": [
            "Nếu phải giải thích Reactivity cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "Reactivity",
            "Vue 3 Proxy",
            "Angular Zone.js",
            "Angular Signals",
            "Change Detection"
          ],
          "sourceRefs": [
            "https://vuejs.org/guide",
            "https://angular.dev"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "VUE_NG-FOUND-02",
          "role": "Vue.js / Angular Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Hệ thống Tiêm phụ thuộc (Dependency Injection - DI) phân cấp trong Angular: Phân biệt sự khác nhau giữa `@Injectable({ providedIn: 'root' })`, cung cấp ở cấp Module (`providers: [...]`), và cung cấp ở cấp Component (`Component({ providers: [...] })`)?",
          "evaluationCriteria": [
            "`providedIn: 'root'`: tạo dịch vụ Singleton toàn cục, hỗ trợ Tree-shaking nếu service không được dùng",
            "Module providers: chia sẻ thể hiện (instance) cho toàn bộ các component thuộc module đó và module con",
            "Component providers: tạo một instance mới độc lập cho mỗi component và chia sẻ cho các component con của nó theo cây phân cấp"
          ],
          "followUps": [
            "Resolution Modifiers trong Angular (@Self, @SkipSelf, @Optional, @Host) điều khiển hướng tìm kiếm dependency ra sao?",
            "Trong Vue 3, cơ chế Provide/Inject có điểm gì tương đồng và khác biệt so với hệ thống DI của Angular?"
          ],
          "tags": [
            "Dependency Injection",
            "Angular Providers",
            "Singleton",
            "Hierarchical Injector",
            "Vue Provide Inject"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "https://vuejs.org/guide"
          ],
          "redFlags": [
            "Nghĩ rằng mọi service khai báo trong Angular đều tự động là Singleton duy nhất trong toàn ứng dụng"
          ]
        },
        {
          "id": "VUE_NG-FOUND-03",
          "role": "Vue.js / Angular Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trong Angular và ứng dụng Vue lớn: RxJS đóng vai trò gì trong việc xử lý luồng dữ liệu bất đồng bộ? Phân biệt giữa Observable, Subject, BehaviorSubject và ReplaySubject?",
          "evaluationCriteria": [
            "Observable: luồng dữ liệu đơn hướng lạnh (cold), chỉ chạy khi có người subscribe",
            "Subject: hot multicast, phát giá trị cho nhiều subscriber cùng lúc",
            "BehaviorSubject: luôn lưu trữ giá trị hiện tại (current value) và phát ngay lập tức cho subscriber mới",
            "ReplaySubject: lưu trữ số lượng giá trị quá khứ nhất định để phát lại cho subscriber mới"
          ],
          "followUps": [
            "Toán tử `switchMap`, `mergeMap`, `concatMap` và `exhaustMap` khác nhau thế nào trong xử lý tác vụ mạng?",
            "Tại sao việc quên `unsubscribe()` trong Angular là nguyên nhân hàng đầu gây ra memory leak?"
          ],
          "tags": [
            "RxJS",
            "Observable",
            "BehaviorSubject",
            "switchMap",
            "Memory Leak"
          ],
          "sourceRefs": [
            "https://rxjs.dev/guide/overview"
          ],
          "redFlags": [
            "Không phân biệt được sự khác biệt giữa switchMap (hủy request cũ) và mergeMap (chạy song song tất cả)"
          ]
        },
        {
          "id": "VUE_NG-FOUND-04",
          "role": "Vue.js / Angular Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Trong Vue 3, sự khác biệt giữa Composition API (`setup()`, `<script setup>`) và Options API (`data`, `methods`, `computed`) là gì? Tại sao Composition API giúp tổ chức mã nguồn tốt hơn trong các dự án phức tạp?",
          "evaluationCriteria": [
            "Options API phân chia mã nguồn theo loại thuộc tính (data/methods), khiến logic của cùng một tính năng bị phân tán khắp file",
            "Composition API gom nhóm mã nguồn theo tính năng logic (Composables), dễ dàng tái sử dụng và kiểm thử độc lập",
            "`<script setup>` mang lại cú pháp ngắn gọn, hiệu năng biên dịch nhanh hơn và hỗ trợ TypeScript Type-inference hoàn hảo"
          ],
          "followUps": [
            "Phân biệt sâu sắc giữa `ref` (bọc giá trị nguyên thủy) và `reactive` (chỉ nhận object) trong Vue 3?",
            "Cơ chế `shallowRef` và `triggerRef` được áp dụng trong tình huống tối ưu hóa nào?"
          ],
          "tags": [
            "Vue 3",
            "Composition API",
            "Options API",
            "Composables",
            "TypeScript"
          ],
          "sourceRefs": [
            "https://vuejs.org/guide"
          ],
          "redFlags": [
            "Vẫn giữ tư duy Options API gò bó khi viết Composition API hoặc lạm dụng biến toàn cục"
          ]
        },
        {
          "id": "VUE_NG-FOUND-05",
          "role": "Vue.js / Angular Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Cơ chế đóng gói CSS (View Encapsulation) trong Angular: Sự khác biệt giữa `ViewEncapsulation.Emulated`, `None`, và `ShadowDom` là gì? Điều này tương đồng thế nào với thuộc tính `<style scoped>` và CSS Modules trong Vue?",
          "evaluationCriteria": [
            "`Emulated` (mặc định): Angular tự động sinh các thuộc tính duy nhất (ví dụ `_ngcontent-c12`) vào HTML và CSS selector để giới hạn phạm vi",
            "`None`: style trở thành toàn cục (Global CSS) ảnh hưởng toàn bộ ứng dụng",
            "`ShadowDom`: sử dụng Shadow DOM chuẩn của trình duyệt web, cô lập hoàn toàn style nhưng không kế thừa được CSS ngoài"
          ],
          "followUps": [
            "Toán tử `::ng-deep` trong Angular hoặc `:deep()` trong Vue scoped CSS được sử dụng khi nào và rủi ro gì?",
            "Tại sao việc lạm dụng `:deep()` có thể phá vỡ tính đóng gói của component thư viện?"
          ],
          "tags": [
            "View Encapsulation",
            "Scoped CSS",
            "Shadow DOM",
            "Component Styling"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "https://vuejs.org/guide"
          ],
          "redFlags": [
            "Tùy tiện dùng ViewEncapsulation.None để sửa CSS component con làm hỏng giao diện của các trang khác"
          ]
        },
        {
          "id": "VUE_NG-FOUND-06",
          "role": "Vue.js / Angular Developer",
          "category": "foundation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Kiến trúc Standalone Components trong Angular hiện đại (từ v14+) thay đổi cách tổ chức ứng dụng thế nào so với kiến trúc dựa trên NgModule truyền thống? Xu hướng loại bỏ Zone.js (Zoneless Angular) mang lại lợi ích gì?",
          "evaluationCriteria": [
            "Standalone Components cho phép component trực tiếp import các dependency mà không cần bọc trong NgModule cồng kềnh",
            "Giảm đáng kể boilerplate code, hỗ trợ Lazy Loading từng component đơn lẻ dễ dàng qua Router",
            "Zoneless Angular loại bỏ hoàn toàn chi phí overhead của Zone.js, giúp ứng dụng nhẹ hơn, debug stack trace rõ ràng và tối ưu hiệu năng tối đa"
          ],
          "followUps": [
            "Làm thế nào để di chuyển từng bước (Migration) một dự án Angular dùng NgModule sang Standalone?",
            "Angular Router cấu hình lazy load standalone component với `loadComponent` ra sao?"
          ],
          "tags": [
            "Standalone Components",
            "NgModule",
            "Zoneless Angular",
            "Angular Modernization"
          ],
          "sourceRefs": [
            "https://angular.dev"
          ],
          "redFlags": [
            "Vẫn khăng khăng tạo NgModule cho mọi component mới mà không nắm bắt kiến trúc Standalone hiện đại"
          ]
        },
        {
          "id": "VUE_NG-SKILL-01",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng Pinia (NgRx, Signal Store, State Management, Redux Pattern) cho Vue.js / Angular Developer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng Pinia ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "Pinia",
            "NgRx",
            "Signal Store",
            "State Management",
            "Redux Pattern"
          ],
          "sourceRefs": [
            "https://vuejs.org/guide",
            "https://angular.dev"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "VUE_NG-SKILL-02",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập Vue.js / Angular Developer: dựa trên OnPush, phối hợp ChangeDetectorRef, Async Pipe, Performance Optimization; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "OnPush",
            "ChangeDetectorRef",
            "Async Pipe",
            "Performance Optimization"
          ],
          "sourceRefs": [
            "https://angular.dev"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "VUE_NG-SKILL-03",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Xây dựng Custom Composables trong Vue 3 hoặc Custom Directives / Pipes trong Angular: Em thiết kế các module tái sử dụng logic (như theo dõi kích thước cửa sổ, debounce input, hoặc phân quyền theo role) ra sao?",
          "evaluationCriteria": [
            "Vue Composables: tuân thủ quy ước đặt tên `useXxx`, trả về các `ref` để duy trì tính reactive khi destructuring",
            "Angular Custom Directive: can thiệp trực tiếp vào Host Element bằng `@HostBinding` và `@HostListener` hoặc `hostDirectives` mới",
            "Angular Pure Pipe: tự động memoize kết quả tính toán, chỉ chạy lại khi tham số đầu vào thay đổi tham chiếu"
          ],
          "followUps": [
            "Tại sao không nên tạo Impure Pipe trong Angular nếu hàm tính toán nặng?",
            "Làm thế nào để quản lý việc dọn dẹp event listener (cleanup on scope dispose) bên trong một Composable bằng `onScopeDispose`?"
          ],
          "tags": [
            "Composables",
            "Custom Directives",
            "Pure Pipes",
            "Logic Reuse"
          ],
          "sourceRefs": [
            "https://vuejs.org/guide",
            "https://angular.dev"
          ],
          "redFlags": [
            "Destructure trực tiếp các thuộc tính từ reactive object trong Vue làm mất tính reactivity của biến"
          ]
        },
        {
          "id": "VUE_NG-SKILL-04",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Bảo vệ luồng điều hướng (Route Guards): Em thiết lập các Guard kiểm tra đăng nhập (CanActivate), kiểm tra quyền hạn (Role-based), và cảnh báo người dùng khi thoát form chưa lưu (CanDeactivate) trong Vue Router hoặc Angular Router như thế nào?",
          "evaluationCriteria": [
            "Angular: triển khai `CanActivateFn` và `CanDeactivateFn` dạng functional guards hiện đại, trả về boolean, UrlTree hoặc Promise/Observable",
            "Vue Router: sử dụng navigation guards toàn cục `router.beforeEach` hoặc per-route guards `beforeEnter`",
            "CanDeactivate: kiểm tra trạng thái form `isDirty`, hiển thị hộp thoại xác nhận nếu người dùng cố tình chuyển trang khi chưa lưu dữ liệu"
          ],
          "followUps": [
            "Làm thế nào để xử lý Race Condition khi chuyển trang liên tục trong Router?",
            "Cơ chế Route Resolvers giúp nạp sẵn dữ liệu trước khi render component ra sao?"
          ],
          "tags": [
            "Route Guards",
            "CanActivate",
            "CanDeactivate",
            "Vue Router",
            "Angular Router"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "https://vuejs.org/guide"
          ],
          "redFlags": [
            "Chỉ kiểm tra quyền ở giao diện mà không chặn ở Route Guard khiến người dùng gõ trực tiếp URL vẫn truy cập được"
          ]
        },
        {
          "id": "VUE_NG-SKILL-05",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Xây dựng ứng dụng Enterprise quy mô lớn bằng kiến trúc Micro-Frontends sử dụng Module Federation trong Webpack / Vite cho Angular hoặc Vue: Em giải quyết bài toán chia sẻ thư viện chung (Shared Dependencies) và định tuyến độc lập thế nào?",
          "evaluationCriteria": [
            "Cấu hình Module Federation: Host app và Remote apps biên dịch độc lập, chia sẻ các singleton dependency (Angular Core, Vue, Pinia)",
            "Quản lý phiên bản SemVer giữa các micro-frontends để tránh tải trùng lặp nhiều phiên bản framework",
            "Định tuyến tích hợp: Host Router điều hướng đến các route vỏ bọc, tải remote bundle theo cơ chế lười (Dynamic Import)"
          ],
          "followUps": [
            "Làm thế nào để truyền thông điệp giữa các micro-frontends độc lập (Custom Events, Event Bus phân tán)?",
            "Chiến lược xử lý CSS isolation để tránh style của micro-frontend A làm vỡ giao diện của micro-frontend B?"
          ],
          "tags": [
            "Micro-Frontends",
            "Module Federation",
            "Enterprise Architecture",
            "Vite",
            "Webpack"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nhúng các micro-frontend qua thẻ iframe thô sơ gây khó khăn cho việc đồng bộ state và trải nghiệm người dùng"
          ]
        },
        {
          "id": "VUE_NG-SKILL-06",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tối ưu hóa thời gian tải trang và hiệu năng hiển thị trong Nuxt 3 hoặc Angular SSR (Universal): Kỹ thuật Server Engine (Nitro), Hydration, và giải quyết lỗi gọi API lặp lại 2 lần (Double Data Fetching)?",
          "evaluationCriteria": [
            "Sử dụng `useAsyncData` hoặc `useFetch` trong Nuxt 3 để tự động cache payload từ server truyền xuống client qua window.__NUXT__",
            "Trong Angular Universal: áp dụng `TransferState` để chuyển dữ liệu từ server render sang client, ngăn client gọi lại API một lần nữa",
            "Tối ưu hóa Nitro engine: cấu hình server storage, hybrid rendering (route rules: SSR cho sản phẩm, SWR cho tin tức)"
          ],
          "followUps": [
            "Lỗi Hydration mismatch trong Nuxt/Angular SSR thường phát sinh do những thẻ HTML hoặc mã JS nào?",
            "Làm thế nào để cấu hình Island Architecture hoặc Server Components trong Nuxt 3?"
          ],
          "tags": [
            "Nuxt 3",
            "Angular Universal",
            "SSR",
            "TransferState",
            "Hydration"
          ],
          "sourceRefs": [
            "https://nuxt.com/docs"
          ],
          "redFlags": [
            "Không sử dụng cơ chế Transfer State khiến ứng dụng gọi API 2 lần liên tiếp (1 lần ở server và 1 lần ở client)"
          ]
        },
        {
          "id": "VUE_NG-SKILL-07",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Chiến lược kiểm thử tự động cho Vue (Vitest + Vue Test Utils) và Angular (Jasmine/Karma hoặc Jest/Angular Testing Library): Cách viết bài test giả lập sự kiện người dùng, mock service qua Dependency Injection và kiểm thử async pipe?",
          "evaluationCriteria": [
            "Angular: dùng `TestBed.configureTestingModule` để ghi đè providers bằng mock services hoặc `provideMockStore`",
            "Vue: dùng `shallowMount` / `mount` từ Vue Test Utils, mock Pinia bằng `createTestingPinia`",
            "Kiểm thử các tác vụ bất đồng bộ với `fakeAsync`, `tick()`, `flushMicrotasks()` trong Angular hoặc `flushPromises()` trong Vue"
          ],
          "followUps": [
            "Tại sao xu hướng hiện nay của Angular chuyển từ Karma/Jasmine sang Jest hoặc Vitest để tăng tốc độ chạy test?",
            "Harnesses component trong Angular Material hỗ trợ việc viết test UI ổn định ra sao?"
          ],
          "tags": [
            "Testing",
            "Vitest",
            "Vue Test Utils",
            "TestBed",
            "Jest"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "https://vuejs.org/guide"
          ],
          "redFlags": [
            "Kiểm thử bằng cách can thiệp trực tiếp vào biến private nội bộ của class thay vì kiểm tra output và DOM"
          ]
        },
        {
          "id": "VUE_NG-SKILL-08",
          "role": "Vue.js / Angular Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Quản lý biểu mẫu phức tạp (Forms): So sánh Reactive Forms trong Angular với giải pháp VeeValidate / FormKit trong Vue. Cách xây dựng Custom Async Validator kiểm tra tính duy nhất của dữ liệu (vd: kiểm tra email đã tồn tại qua API)?",
          "evaluationCriteria": [
            "Angular Reactive Forms: mô hình hướng đối tượng dựa trên luồng (`FormControl`, `FormGroup`, `FormArray`) với Observable theo dõi giá trị",
            "Custom Async Validator: trả về Observable/Promise phát ra lỗi hoặc null, áp dụng debounceTime để tránh spam request lên server",
            "Vue 3 với VeeValidate + Zod: liên kết schema validation chặt chẽ, tự động quản lý trạng thái touched/dirty/errors"
          ],
          "followUps": [
            "Tại sao không nên dùng Template-driven Forms cho các form doanh nghiệp phức tạp trong Angular?",
            "Làm thế nào để quản lý mảng các trường động (Dynamic FormArray) thêm/bớt linh hoạt?"
          ],
          "tags": [
            "Reactive Forms",
            "Async Validator",
            "VeeValidate",
            "Zod",
            "Form Architecture"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "https://vuejs.org/guide"
          ],
          "redFlags": [
            "Gọi API kiểm tra validation trực tiếp trên mỗi phím bấm mà không có debounceTime làm nghẽn máy chủ"
          ]
        },
        {
          "id": "VUE_NG-SCEN-01",
          "role": "Vue.js / Angular Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại Vue.js / Angular Developer, khi Memory Leak cùng RxJS Unsubscribe, takeUntilDestroyed, Angular Profiling xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "Memory Leak",
            "RxJS Unsubscribe",
            "takeUntilDestroyed",
            "Angular Profiling"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "VUE_NG-SCEN-02",
          "role": "Vue.js / Angular Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Trong Vue 3, một component cha truyền dữ liệu xuống component con qua prop. Component con muốn chỉnh sửa trực tiếp thuộc tính của prop đó nhưng Vue đưa ra cảnh báo 'Avoid mutating a prop directly'. Em xử lý kiến trúc luồng dữ liệu 2 chiều (v-model) chuẩn mực ra sao?",
          "evaluationCriteria": [
            "Tuân thủ nguyên tắc dòng dữ liệu một chiều (One-Way Data Flow): component con không được đột biến prop của cha",
            "Sử dụng cú pháp `v-model:propName` kết hợp emit sự kiện `update:propName` từ component con lên cha",
            "Tận dụng hàm tiện ích `useVModel` từ thư viện VueUse hoặc computed property có getter/setter để viết mã ngắn gọn"
          ],
          "followUps": [
            "Tại sao việc sửa prop trực tiếp làm mã nguồn trở nên khó đoán định và phá vỡ kiến trúc cây component?",
            "Cách định nghĩa nhiều v-model trên cùng một component trong Vue 3?"
          ],
          "tags": [
            "Vue v-model",
            "One-Way Data Flow",
            "Component Communication",
            "Props Mutation"
          ],
          "sourceRefs": [
            "https://vuejs.org/guide",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cố tình mutate trực tiếp prop object để 'tiện lợi' và bỏ qua cảnh báo của Vue console"
          ]
        },
        {
          "id": "VUE_NG-SCEN-03",
          "role": "Vue.js / Angular Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Một bảng dữ liệu lớn trong Angular chứa 2.000 dòng có nhiều tính toán phức tạp. Mỗi khi người dùng gõ phím vào ô tìm kiếm ở góc màn hình, toàn bộ 2.000 dòng đều bị tính toán lại khiến gõ phím bị trễ (Keypress Lag). Em áp dụng OnPush và Angular CDK Virtual Scroll thế nào?",
          "evaluationCriteria": [
            "Chuyển toàn bộ các component dòng (Row Component) sang `ChangeDetectionStrategy.OnPush`",
            "Thay thế việc render toàn bộ DOM bằng `cdk-virtual-scroll-viewport` từ Angular CDK để chỉ render các dòng nhìn thấy",
            "Tách các hàm tính toán phức tạp trong template ra thành Pure Pipe có tính năng memoize kết quả"
          ],
          "followUps": [
            "Tại sao gọi trực tiếp một hàm `calculateValue()` trong template HTML của Angular lại là thảm họa hiệu năng?",
            "Làm thế nào để đo lường số lần chạy Change Detection bằng công cụ Angular DevTools Profiler?"
          ],
          "tags": [
            "Keypress Lag",
            "OnPush",
            "Virtual Scroll",
            "Angular CDK",
            "Performance"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Gọi hàm JavaScript trực tiếp trong biểu thức template `{{ calculate(item) }}` lặp lại hàng nghìn lần mỗi frame"
          ]
        },
        {
          "id": "VUE_NG-SCEN-04",
          "role": "Vue.js / Angular Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Khi triển khai ứng dụng Vue 3 lên production, một số người dùng sử dụng trình duyệt cũ trên máy tính bảng chuyên dụng của doanh nghiệp gặp lỗi màn hình trắng xóa do thiếu Polyfills cho các tính năng hiện đại. Em cấu hình build tool (Vite) ra sao để tương thích?",
          "evaluationCriteria": [
            "Cấu hình plugin `@vitejs/plugin-legacy` để tự động sinh bản build dự phòng kèm polyfills cho các trình duyệt cũ",
            "Thiết lập danh sách `targets` trong cấu hình Browserslist phù hợp với yêu cầu thực tế của doanh nghiệp",
            "Kiểm tra xem các tính năng CSS hiện đại (như CSS Grid, aspect-ratio) có cần Autoprefixer và PostCSS polyfill hay không"
          ],
          "followUps": [
            "Tại sao bản build legacy thường có kích thước lớn hơn đáng kể so với bản build ES modules hiện đại?",
            "Cơ chế `<script type='module'>` kết hợp `<script nomodule>` giúp tải đúng bản build cho từng trình duyệt ra sao?"
          ],
          "tags": [
            "Browser Compatibility",
            "Vite Legacy",
            "Polyfills",
            "Production Build"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đổ lỗi cho khách hàng dùng trình duyệt cũ mà không có phương án kỹ thuật xử lý khả năng tương thích ngược"
          ]
        },
        {
          "id": "VUE_NG-SCEN-05",
          "role": "Vue.js / Angular Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Một ứng dụng Nuxt 3 thương mại điện tử bị lỗi rò rỉ bộ nhớ (Memory Leak) ở tầng Node.js Server khiến dịch vụ SSR bị crash sau mỗi 12 tiếng chịu tải cao. Nguyên nhân được xác định do chia sẻ state toàn cục không an toàn giữa các request. Em khắc phục lỗi này ra sao?",
          "evaluationCriteria": [
            "Phân tích nguyên nhân: Khởi tạo biến state bên ngoài phạm vi hàm của request handler, khiến biến này bị chia sẻ chung cho mọi người dùng (Cross-request State Pollution)",
            "Khắc phục: Luôn sử dụng `useState()` của Nuxt hoặc tạo Pinia store mới cho mỗi SSR request",
            "Đảm bảo không lưu trữ dữ liệu cá nhân của người dùng vào các biến singleton hoặc global module scope ở server"
          ],
          "followUps": [
            "State Pollution trong SSR có thể dẫn đến rủi ro lộ lọt thông tin của người dùng này cho người dùng khác ra sao?",
            "Cách dùng công cụ autocannon kết hợp clinicjs để stress-test và phát hiện rò rỉ bộ nhớ SSR cục bộ?"
          ],
          "tags": [
            "SSR Memory Leak",
            "Nuxt 3",
            "Cross-request State Pollution",
            "Security Vulnerability"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Khai báo biến lưu trữ thông tin user ở top-level của file JavaScript trong môi trường chạy SSR"
          ]
        },
        {
          "id": "VUE_NG-SCEN-06",
          "role": "Vue.js / Angular Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Trong Angular, khi gọi đồng thời 3 API phụ thuộc nhau (API 1 lấy User, API 2 lấy Danh sách quyền dựa trên User, API 3 lấy Cấu hình giao diện dựa trên quyền). Nếu dùng `subscribe` lồng nhau (Callback Hell) thì code rất lộn xộn và dễ lỗi. Em tái cấu trúc bằng các toán tử RxJS ra sao?",
          "evaluationCriteria": [
            "Sử dụng toán tử `switchMap` để xâu chuỗi các Observable tuần tự theo một luồng đơn hướng mạch lạc",
            "Nếu các API độc lập có thể chạy song song: kết hợp bằng toán tử `forkJoin` hoặc `combineLatest` để giảm tổng thời gian chờ",
            "Bổ sung toán tử `catchError` để xử lý bắt lỗi tập trung và trả về giá trị fallback an toàn"
          ],
          "followUps": [
            "Sự khác biệt cốt lõi giữa `forkJoin` (chờ tất cả hoàn thành và chỉ lấy giá trị cuối) và `combineLatest` là gì?",
            "Cách xử lý retry tự động khi 1 trong 3 request bị lỗi mạng bằng `retryWhen`?"
          ],
          "tags": [
            "RxJS Chaining",
            "switchMap",
            "forkJoin",
            "Clean Code",
            "Reactive Architecture"
          ],
          "sourceRefs": [
            "https://angular.dev",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Viết lồng 3 hàm subscribe vào nhau theo phong cách Callback Hell truyền thống"
          ]
        },
        {
          "id": "VUE_NG-CV-01",
          "role": "Vue.js / Angular Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong dự án Vue hoặc Angular quy mô lớn nhất trên CV của em: Cấu trúc thư mục của dự án được tổ chức theo kiến trúc nào (Feature Modules, Clean Architecture, hay Monorepo)? Đâu là thách thức lớn nhất khi mở rộng quy mô dự án lên hàng trăm component?",
          "evaluationCriteria": [
            "Trình bày cấu trúc module rõ ràng: Core (singletons), Shared (reusable components/pipes), Features (lazy-loaded domain modules)",
            "Giải thích cơ chế kiểm soát phụ thuộc để tránh vòng lặp tham chiếu (Circular Dependency)",
            "Dẫn chứng về số lượng lập trình viên cùng tham gia và cách duy trì quy chuẩn code nhất quán"
          ],
          "followUps": [
            "Nếu có một module mới cần dùng một phần nhỏ của module cũ, em xử lý chia sẻ code ra sao?",
            "Em đã áp dụng công cụ nào (Nx boundaries, ESLint rules) để ngăn chặn việc import sai tầng kiến trúc?"
          ],
          "tags": [
            "Project Architecture",
            "Modular Design",
            "Scale",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tập hợp toàn bộ hàng trăm component vào chung một thư mục phẳng duy nhất không có phân cấp"
          ]
        },
        {
          "id": "VUE_NG-CV-02",
          "role": "Vue.js / Angular Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em có nêu kinh nghiệm chuyển đổi (Migration) dự án từ Vue 2 sang Vue 3 hoặc nâng cấp phiên bản Angular cũ lên Angular hiện đại. Em đã lập kế hoạch và vượt qua những breaking changes lớn nào trong quá trình chuyển đổi?",
          "evaluationCriteria": [
            "Vue: chuyển đổi từ Options API sang Composition API, cập nhật Vue Router 4, chuyển từ Vuex sang Pinia, xử lý Event Bus bị loại bỏ",
            "Angular: chạy `ng update` từng phiên bản tuần tự, chuyển từ ViewEngine sang Ivy compiler, refactor sang Standalone components",
            "Duy trì hoạt động liên tục của sản phẩm: kế hoạch phát hành theo từng giai đoạn và kiểm thử hồi quy kỹ lưỡng"
          ],
          "followUps": [
            "Chiến lược xử lý các thư viện bên thứ ba chưa tương thích với phiên bản mới là gì?",
            "Làm thế nào để đảm bảo đội ngũ không bị gián đoạn công việc phát triển tính năng mới trong lúc nâng cấp?"
          ],
          "tags": [
            "Migration",
            "Vue 2 to Vue 3",
            "Angular Upgrade",
            "Ivy Compiler",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nói chung chung là 'chỉ cần đổi version rồi build lại' mà không kể được các breaking changes thực tế"
          ]
        },
        {
          "id": "VUE_NG-CV-03",
          "role": "Vue.js / Angular Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em ghi nhận kinh nghiệm làm việc chuyên sâu với RxJS trên CV. Em hãy dẫn chứng một use-case phức tạp nhất mà em từng giải quyết bằng cách kết hợp nhiều toán tử RxJS trong dự án thực tế?",
          "evaluationCriteria": [
            "Trình bày bài toán cụ thể: tính năng tìm kiếm realtime có debounce, tự động hủy request cũ (`switchMap`), caching kết quả và retry khi lỗi",
            "Các toán tử kết hợp: `debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, `shareReplay`",
            "Lợi ích mang lại: code ngắn gọn, kiểm soát hoàn hảo trạng thái loading và không bị race condition"
          ],
          "followUps": [
            "Tại sao toán tử `shareReplay(1)` lại quan trọng khi muốn chia sẻ dữ liệu stream cho nhiều subscribers?",
            "Làm thế nào để viết Unit Test cho một luồng RxJS phức tạp bằng Marble Testing?"
          ],
          "tags": [
            "RxJS Mastery",
            "Complex Stream",
            "Marble Testing",
            "shareReplay",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ghi thạo RxJS trên CV nhưng chỉ biết mỗi lệnh subscribe và catchError cơ bản"
          ]
        },
        {
          "id": "VUE_NG-CV-04",
          "role": "Vue.js / Angular Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em hãy chia sẻ về một vấn đề hiệu năng khó khăn nhất trong dự án Vue/Angular trên CV mà em đã trực tiếp dùng công cụ Profiler để tìm ra điểm nghẽn và cải thiện thành công?",
          "evaluationCriteria": [
            "Xác định công cụ đo: Angular DevTools Profiler, Vue DevTools Performance tab, Chrome DevTools Timeline",
            "Chỉ rõ nguyên nhân gốc rễ: quá nhiều watcher sâu (deep watchers) trong Vue, hoặc Change Detection chạy liên tục do setInterval ngoài Zone",
            "Số liệu cải thiện rõ rệt: giảm thời gian render frame từ 80ms xuống dưới 16ms, giảm tải CPU"
          ],
          "followUps": [
            "Hàm `NgZone.runOutsideAngular()` được em sử dụng trong tình huống nào để tránh kích hoạt Change Detection?",
            "Cách tránh việc lạm dụng deep watcher trong Vue 3?"
          ],
          "tags": [
            "Profiler Investigation",
            "Performance Bottleneck",
            "NgZone",
            "Deep Watcher",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Không nhớ công cụ nào đã sử dụng hoặc đưa ra các giải pháp đoán mò không có số liệu chứng minh"
          ]
        },
        {
          "id": "VUE_NG-CV-05",
          "role": "Vue.js / Angular Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trong dự án xây dựng thư viện thành phần giao diện (UI Component Library) dùng chung cho công ty trên CV, em đã đóng gói và xuất bản (publish) thư viện đó như thế nào bằng Angular CLI (ng-packagr) hoặc Vite Library Mode?",
          "evaluationCriteria": [
            "Angular: sử dụng `ng-packagr` xuất bản chuẩn định dạng Angular Package Format (APF) tương thích Ivy và ESM",
            "Vue: cấu hình Vite Library Mode (`build.lib`), định nghĩa externals để không đóng gói kèm Vue vào bundle",
            "Quản lý types định dạng `.d.ts`, cấu hình `exports` trong `package.json` và tài liệu hóa bằng Storybook"
          ],
          "followUps": [
            "Làm thế nào để kiểm tra tính tương thích của thư viện trên các dự án mẫu trước khi publish lên npm registry?",
            "Chiến lược quản lý Semantic Versioning khi có breaking changes trong component library?"
          ],
          "tags": [
            "Component Library",
            "ng-packagr",
            "Vite Library Mode",
            "NPM Package",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ copy các file component dạng thô giữa các dự án mà chưa từng đóng gói thành package chuẩn"
          ]
        },
        {
          "id": "VUE_NG-BEHAV-01",
          "role": "Vue.js / Angular Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Angular và Vue thường có các chuẩn mực kiến trúc và quy ước đặt tên rất rõ ràng (Opinionated). Khi một thành viên mới trong nhóm liên tục viết code theo thói quen tự do phá vỡ quy ước chung, em hỗ trợ và duy trì kỷ luật kỹ thuật ra sao?",
          "evaluationCriteria": [
            "Tổ chức buổi trao đổi 1-on-1 nhẹ nhàng để giải thích lý do tại sao quy ước chung giúp toàn đội ngũ bảo trì code dễ dàng hơn",
            "Thiết lập công cụ tự động hóa bắt lỗi: cấu hình Angular ESLint / Vue ESLint nghiêm ngặt kết hợp Git hooks (Husky)",
            "Đồng hành pair-programming cùng bạn trong vài Pull Request đầu tiên để giúp bạn nhanh chóng làm quen với văn hóa chung"
          ],
          "followUps": [
            "Nếu thành viên đó vẫn bảo thủ không tuân thủ, em xử lý bước tiếp theo thế nào?",
            "Làm sao để tiếp nhận các ý kiến đóng góp cải tiến quy ước nếu bạn ấy có đề xuất hợp lý?"
          ],
          "tags": [
            "Code Conventions",
            "Mentorship",
            "Engineering Standards",
            "Automated Linting"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ trích gay gắt trên kênh chat chung hoặc tự mình âm thầm sửa lại toàn bộ code của bạn ấy"
          ]
        },
        {
          "id": "VUE_NG-BEHAV-02",
          "role": "Vue.js / Angular Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Khi công ty cân nhắc lựa chọn công nghệ cho một sản phẩm web lớn mới giữa React, Vue 3 và Angular, em tham gia đóng góp ý kiến và phân tích khách quan các điểm mạnh/yếu của từng framework như thế nào?",
          "evaluationCriteria": [
            "Phân tích dựa trên bài toán tổ chức: quy mô đội ngũ, nguồn nhân lực sẵn có trên thị trường tuyển dụng, thời gian hoàn vốn",
            "So sánh khách quan: Angular phù hợp cho hệ thống doanh nghiệp lớn cần tính chuẩn hóa cao; Vue 3 linh hoạt, dễ học, tốc độ phát triển nhanh; React có hệ sinh thái thư viện khổng lồ",
            "Khuyến nghị giải pháp tối ưu cho mục tiêu kinh doanh của công ty thay vì đưa ra nhận định mang tính thiên vị cá nhân"
          ],
          "followUps": [
            "Khi nào việc chọn một framework 'ít phổ biến hơn' lại mang lại lợi thế cạnh tranh cho công ty?",
            "Làm thế nào để xây dựng lộ trình đào tạo cho đội ngũ nếu công ty quyết định chuyển sang framework mới?"
          ],
          "tags": [
            "Framework Comparison",
            "Technology Selection",
            "Strategic Thinking",
            "Objective Evaluation"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Tranh luận mang tính tôn giáo công nghệ (framework war) và hạ thấp các framework khác một cách thiếu căn cứ"
          ]
        },
        {
          "id": "VUE_NG-BEHAV-03",
          "role": "Vue.js / Angular Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi thư viện bên thứ ba đang sử dụng trong dự án bất ngờ phát hiện lỗ hổng bảo mật nghiêm trọng (CVE) và phiên bản vá lỗi yêu cầu phải nâng cấp toàn bộ framework lên phiên bản lớn tiếp theo, em quản trị rủi ro và điều phối kế hoạch ra sao?",
          "evaluationCriteria": [
            "Đánh giá phạm vi ảnh hưởng thực tế: lỗ hổng có nằm trên luồng code mà ứng dụng thực sự gọi tới hay không",
            "Nếu cần nâng cấp khẩn cấp: cô lập phạm vi thay đổi, tạo branch riêng và chạy kiểm thử tự động toàn diện để phát hiện breaking changes",
            "Giao tiếp minh bạch với Product Manager và Ban Quản lý về sự đánh đổi giữa an toàn thông tin và tiến độ tính năng mới"
          ],
          "followUps": [
            "Giải pháp vá lỗi tạm thời (Hot-patch) trong khi chờ kế hoạch nâng cấp lớn là gì?",
            "Làm thế nào để thiết lập quy trình quét lỗ hổng tự động (Snyk, Dependabot) vào CI/CD để phát hiện sớm?"
          ],
          "tags": [
            "Security Incident",
            "CVE Remediation",
            "Dependency Risk",
            "Stakeholder Communication"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Xem nhẹ cảnh báo bảo mật và tiếp tục để lỗ hổng tồn tại trên môi trường production"
          ]
        },
        {
          "id": "VUE_NG-BEHAV-04",
          "role": "Vue.js / Angular Developer",
          "category": "behavioral",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Khi nhận được phản hồi từ Tester rằng trang web chạy rất chậm trên máy tính của họ nhưng trên máy tính cấu hình mạnh của em thì chạy mượt mà, em phối hợp với Tester để kiểm chứng và giải quyết vấn đề thế nào?",
          "evaluationCriteria": [
            "Không bao giờ nói 'trên máy em vẫn chạy bình thường' để gạt bỏ phản hồi của Tester",
            "Chủ động mượn máy tính của Tester hoặc sử dụng tính năng CPU Throttling (hạ 4x/6x CPU) và Network Throttling trong Chrome DevTools để mô phỏng chính xác môi trường",
            "Thu thập dữ liệu hiệu năng cụ thể và tìm kiếm giải pháp tối ưu hóa để đảm bảo ứng dụng chạy mượt mà trên cả thiết bị phổ thông"
          ],
          "followUps": [
            "Tại sao việc kiểm thử trên thiết bị cấu hình trung bình lại quan trọng đối với trải nghiệm người dùng cuối?",
            "Cách em cảm ơn và khuyến khích Tester tiếp tục phát hiện các lỗi hiệu năng như vậy?"
          ],
          "tags": [
            "Empathy with QA",
            "CPU Throttling",
            "Cross-environment Testing",
            "Professional Attitude"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Phản ứng khó chịu và cho rằng Tester đang săm soi lỗi vặt"
          ]
        },
        {
          "id": "VUE_NG-BEHAV-05",
          "role": "Vue.js / Angular Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Khi các thành viên trong nhóm có sự chia rẽ: một nửa muốn viết Vue theo phong cách Composition API hiện đại, một nửa muốn giữ Options API truyền thống cho dễ đọc, em đóng góp ý kiến để thống nhất định hướng nhóm ra sao?",
          "evaluationCriteria": [
            "Thừa nhận ưu điểm của cả hai: Options API dễ tiếp cận cho người mới, Composition API vượt trội khi dự án mở rộng phức tạp",
            "Đề xuất lộ trình hài hòa: giữ nguyên các component cũ đang chạy ổn định, nhưng thống nhất áp dụng Composition API cho các tính năng mới và các logic cần tái sử dụng (Composables)",
            "Tổ chức một buổi chia sẻ nội bộ trình bày các mẫu thiết kế thực tế để giúp các bạn quen với tư duy mới"
          ],
          "followUps": [
            "Làm thế nào để văn bản hóa (Document) quyết định kỹ thuật này vào sổ tay kỹ thuật của nhóm (Architecture Decision Record - ADR)?",
            "Cách theo dõi mức độ tiếp nhận của đội ngũ sau khi thống nhất định hướng?"
          ],
          "tags": [
            "Team Alignment",
            "Architecture Decision",
            "Consensus Building",
            "Change Management"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Áp đặt ý kiến cá nhân bằng quyền hạn hoặc để tranh cãi nội bộ kéo dài gây mất đoàn kết"
          ]
        }
      ]
    },
    {
      "role": "TypeScript / Node.js Developer",
      "group": "webMobile",
      "groupLabel": "Lập trình Web & Mobile",
      "aliases": [
        "typescript developer",
        "node.js developer",
        "nodejs developer",
        "backend typescript engineer"
      ],
      "questions": [
        {
          "id": "TS_NODE-FOUND-01",
          "role": "TypeScript / Node.js Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Trong TypeScript / Node.js Developer, phân biệt Node.js Event Loop, Libuv, process.nextTick, setImmediate; mô tả khi nào em áp dụng chúng trong bài tập.",
          "evaluationCriteria": [
            "Giải thích đúng ý nghĩa cơ bản của Node.js Event Loop.",
            "Đưa ra ví dụ đơn giản, phù hợp với người mới học hoặc dự án cá nhân.",
            "Nêu được vì sao kiến thức này hữu ích trong công việc TypeScript / Node.js Developer."
          ],
          "followUps": [
            "Nếu phải giải thích Node.js Event Loop cho một bạn mới bắt đầu, em sẽ dùng ví dụ nào?"
          ],
          "tags": [
            "Node.js Event Loop",
            "Libuv",
            "process.nextTick",
            "setImmediate",
            "Microtasks"
          ],
          "sourceRefs": [
            "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
          ],
          "redFlags": [
            "Nhầm lẫn khái niệm cốt lõi hoặc không thể đưa ra ví dụ cơ bản."
          ]
        },
        {
          "id": "TS_NODE-FOUND-02",
          "role": "TypeScript / Node.js Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Hệ thống kiểu dữ liệu nâng cao trong TypeScript: Phân biệt `any`, `unknown` và `never`. Từ khóa `infer`, Mapped Types và Conditional Types (`T extends U ? X : Y`) giải quyết những bài toán Type-level programming nào?",
          "evaluationCriteria": [
            "`any` tắt hoàn toàn type-checker; `unknown` là type an toàn yêu cầu Type Narrowing trước khi sử dụng; `never` đại diện cho giá trị không bao giờ xảy ra (hàm throw exception hoặc exhaustive checking)",
            "Conditional Types cho phép lập trình logic ở tầng kiểu dữ liệu; từ khóa `infer` dùng để suy luận kiểu ẩn bên trong generics",
            "Mapped Types (`[K in keyof T]: ...`) biến đổi cấu trúc object type hàng loạt (tạo Readonly, Partial, Record)"
          ],
          "followUps": [
            "Exhaustive Type Checking với `never` trong câu lệnh `switch-case` bảo vệ ứng dụng khi thêm enum mới ra sao?",
            "Tại sao nên hạn chế tối đa việc sử dụng ép kiểu cưỡng bức (`as unknown as Type`)?"
          ],
          "tags": [
            "TypeScript",
            "Type System",
            "Conditional Types",
            "infer",
            "never"
          ],
          "sourceRefs": [
            "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html"
          ],
          "redFlags": [
            "Lạm dụng `any` khắp nơi để tắt cảnh báo của compiler hoặc không phân biệt được `unknown` và `any`"
          ]
        },
        {
          "id": "TS_NODE-FOUND-03",
          "role": "TypeScript / Node.js Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Cơ chế Stream và Buffer trong Node.js: Phân biệt 4 loại Stream (Readable, Writable, Duplex, Transform). Hiện tượng Backpressure xảy ra khi nào và hàm `stream.pipeline()` giải quyết việc rò rỉ bộ nhớ và dọn dẹp lỗi ra sao?",
          "evaluationCriteria": [
            "Buffer lưu trữ dữ liệu nhị phân thô bên ngoài V8 heap memory; Stream xử lý dữ liệu theo từng chunk liên tục thay vì nạp toàn bộ vào RAM",
            "Backpressure xảy ra khi Writable Stream ghi dữ liệu chậm hơn tốc độ đọc của Readable Stream, làm dữ liệu ứ đọng trong bộ đệm (highWaterMark)",
            "`pipeline()` tự động lắng nghe sự kiện drain, xử lý lỗi tập trung và đảm bảo đóng luồng an toàn khi có ngoại lệ phát sinh"
          ],
          "followUps": [
            "Tại sao sử dụng `readable.pipe(writable)` truyền thống có thể gây rò rỉ file descriptor nếu luồng bị lỗi giữa chừng?",
            "Transform Stream được ứng dụng trong các bài toán nén dữ liệu (gzip) hoặc mã hóa dữ liệu ra sao?"
          ],
          "tags": [
            "Node.js Streams",
            "Buffer",
            "Backpressure",
            "pipeline",
            "Memory Optimization"
          ],
          "sourceRefs": [
            "https://nodejs.org/api/stream.html"
          ],
          "redFlags": [
            "Đọc toàn bộ file 2GB vào bộ nhớ bằng `fs.readFile()` thông thường làm crash V8 heap memory"
          ]
        },
        {
          "id": "TS_NODE-FOUND-04",
          "role": "TypeScript / Node.js Developer",
          "category": "foundation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Xử lý tác vụ tính toán nặng (CPU-Intensive Tasks) trong Node.js: Phân biệt sự khác nhau giữa Worker Threads (`worker_threads`), Cluster Module (`cluster`) và Child Process (`child_process`). Chi phí chia sẻ bộ nhớ qua `SharedArrayBuffer` và `Atomics`?",
          "evaluationCriteria": [
            "Node.js mặc định đơn luồng cho JS; tác vụ CPU nặng sẽ làm block Event Loop, khiến mọi request khác bị treo",
            "Worker Threads chia sẻ cùng một tiến trình OS, có V8 instance riêng và có thể chia sẻ bộ nhớ qua SharedArrayBuffer",
            "Cluster Module phân nhánh (fork) thành nhiều tiến trình OS độc lập dùng chung cổng mạng (IPC), phù hợp scale số lượng CPU core"
          ],
          "followUps": [
            "Atomics API trong JavaScript giải quyết bài toán đồng bộ hóa (Race Condition) trên SharedArrayBuffer thế nào?",
            "Tại sao không nên khởi tạo Worker Thread mới cho mỗi request HTTP mà nên dùng Thread Pool?"
          ],
          "tags": [
            "Worker Threads",
            "Cluster Module",
            "SharedArrayBuffer",
            "CPU-bound",
            "Atomics"
          ],
          "sourceRefs": [
            "https://nodejs.org/api/worker_threads.html"
          ],
          "redFlags": [
            "Cho rằng Node.js không thể xử lý tác vụ CPU-bound hoặc cố gắng giải quyết CPU-bound bằng `setTimeout`"
          ]
        },
        {
          "id": "TS_NODE-FOUND-05",
          "role": "TypeScript / Node.js Developer",
          "category": "foundation",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Phân biệt sâu sắc giữa CommonJS (`require` / `module.exports`) và ES Modules (`import` / `export`) trong hệ sinh thái Node.js hiện đại. Tại sao việc kết hợp cả hai chuẩn module trong cùng một dự án thường gây ra lỗi phức tạp?",
          "evaluationCriteria": [
            "CommonJS nạp module đồng bộ lúc runtime; ES Modules phân tích cú pháp tĩnh lúc compile-time và hỗ trợ nạp bất đồng bộ",
            "ES Modules hỗ trợ Tree-shaking tự nhiên vì cấu trúc import là tĩnh, không cho phép import có điều kiện bên trong hàm",
            "Lỗi phổ biến: không thể `require()` một ES Module thuần túy mà không dùng `await import()`, sự vắng mặt của `__dirname` và `__filename` trong ESM"
          ],
          "followUps": [
            "Làm thế nào để lấy đường dẫn tệp hiện tại trong ES Modules bằng `import.meta.url` và `fileURLToPath`?",
            "Cấu hình trường `\"type\": \"module\"` và `\"exports\"` trong package.json điều khiển hành vi nạp module ra sao?"
          ],
          "tags": [
            "CommonJS",
            "ES Modules",
            "Node.js Internals",
            "Module System"
          ],
          "sourceRefs": [
            "https://nodejs.org/api/esm.html"
          ],
          "redFlags": [
            "Nhầm lẫn cú pháp import/export của Babel/TypeScript với cơ chế native ES Modules của Node.js"
          ]
        },
        {
          "id": "TS_NODE-FOUND-06",
          "role": "TypeScript / Node.js Developer",
          "category": "foundation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Kiến trúc Type Narrowing và Discriminated Unions (Tagged Unions) trong TypeScript: Làm thế nào để TypeScript tự động thu hẹp kiểu dữ liệu một cách an toàn mà không cần ép kiểu thủ công (`as Type`)?",
          "evaluationCriteria": [
            "Sử dụng thuộc tính phân biệt chung (literal discriminator ví dụ: `kind: 'success' | 'error'`) trên các interface",
            "Tận dụng các Type Guards tích hợp: `typeof`, `instanceof`, `in`, và Custom Type Guard predicates (`val is Type`)",
            "Giúp trình biên dịch loại trừ các nhánh không thể xảy ra và cảnh báo lỗi lúc biên dịch nếu thiếu trường hợp xử lý"
          ],
          "followUps": [
            "Assertion Functions trong TypeScript (`asserts condition`) hoạt động ra sao?",
            "Tại sao việc lạm dụng Optional Chaining (`?.`) bừa bãi có thể che giấu các lỗi logic dữ liệu nghiêm trọng?"
          ],
          "tags": [
            "Type Narrowing",
            "Discriminated Unions",
            "Type Guards",
            "Type Safety"
          ],
          "sourceRefs": [
            "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
          ],
          "redFlags": [
            "Dùng ép kiểu thô bạo (`as any as SpecificType`) thay vì sử dụng cơ chế Type Narrowing an toàn của TypeScript"
          ]
        },
        {
          "id": "TS_NODE-SKILL-01",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "basic",
          "seniority": "fresher_intern",
          "question": "Mô phỏng NestJS (Dependency Injection, Interceptors, Pipes, Enterprise Architecture) cho TypeScript / Node.js Developer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
          "evaluationCriteria": [
            "Nêu đúng mục đích sử dụng NestJS ở mức cơ bản.",
            "Trình bày được một quy trình thực hiện có thứ tự.",
            "Biết kiểm tra kết quả và thừa nhận phần cần tra cứu hoặc nhờ hỗ trợ."
          ],
          "followUps": [
            "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và vì sao?"
          ],
          "tags": [
            "NestJS",
            "Dependency Injection",
            "Interceptors",
            "Pipes",
            "Enterprise Architecture"
          ],
          "sourceRefs": [
            "https://docs.nestjs.com/"
          ],
          "redFlags": [
            "Không xác định được mục đích cơ bản của công cụ hoặc quy trình."
          ]
        },
        {
          "id": "TS_NODE-SKILL-02",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Bài tập TypeScript / Node.js Developer: dựa trên TypeORM, phối hợp Prisma, N+1 Query, Database Access, Data Mapper; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
          "evaluationCriteria": [
            "Đề xuất được thử nghiệm nhỏ, khả thi cho người mới.",
            "Mô tả được đầu vào, thao tác và kết quả mong đợi.",
            "Có cách quan sát hoặc xác nhận kết quả thay vì chỉ nói đã làm."
          ],
          "followUps": [
            "Em sẽ thay đổi yếu tố nào để kiểm tra thêm một trường hợp khác?"
          ],
          "tags": [
            "TypeORM",
            "Prisma",
            "N+1 Query",
            "Database Access",
            "Data Mapper"
          ],
          "sourceRefs": [
            "https://www.prisma.io/docs"
          ],
          "redFlags": [
            "Chỉ nêu lý thuyết mà không thể đề xuất một bước thực hành nhỏ."
          ]
        },
        {
          "id": "TS_NODE-SKILL-03",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Xử lý xác thực dữ liệu đầu vào (Input Validation & Serialization) an toàn bằng Zod hoặc Class-Validator: Làm thế nào để ngăn chặn tấn công Mass Assignment và tự động loại bỏ các trường không mong muốn (Strip unknown fields)?",
          "evaluationCriteria": [
            "Sử dụng Zod `.strict()` hoặc Class-Validator `whitelist: true, forbidNonWhitelisted: true` để từ chối các trường ngoài schema",
            "Tự động parse và sanitize dữ liệu đầu vào thành kiểu TypeScript an toàn trước khi vào service logic",
            "Ngăn chặn hoàn toàn việc kẻ xấu chèn các trường đặc quyền như `isAdmin: true` hoặc `role: 'admin'` qua payload"
          ],
          "followUps": [
            "Làm thế nào để sinh OpenAPI / Swagger documentation tự động từ Zod schemas hoặc NestJS DTOs?",
            "Custom validation logic bất đồng bộ (Async Refinement) trong Zod được cấu hình ra sao?"
          ],
          "tags": [
            "Zod",
            "Validation",
            "Mass Assignment",
            "Data Sanitization",
            "Class-Validator"
          ],
          "sourceRefs": [
            "https://zod.dev/"
          ],
          "redFlags": [
            "Chấp nhận trực tiếp `req.body` thô vào câu lệnh INSERT/UPDATE của database mà không có bước validate/sanitize"
          ]
        },
        {
          "id": "TS_NODE-SKILL-04",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Xử lý lỗi toàn diện (Comprehensive Error Handling): Em thiết kế cấu trúc Custom Error Hierarchy trong TypeScript và cơ chế bắt lỗi toàn cục (Global Exception Handler / Unhandled Rejection) trong Node.js như thế nào?",
          "evaluationCriteria": [
            "Tạo lớp `AppError` kế thừa từ `Error` chứa `statusCode`, `isOperational`, `errorCode`, và ngữ cảnh chi tiết",
            "Phân biệt rạch ròi giữa Operational Errors (lỗi dự kiến được: sai input, không tìm thấy) và Programmer Errors (lỗi code, bug)",
            "Lắng nghe `unhandledRejection` và `uncaughtException`, ghi log chi tiết và thực hiện Graceful Shutdown dịch vụ"
          ],
          "followUps": [
            "Tại sao sau khi bắt được `uncaughtException` thì bắt buộc phải thoát tiến trình (process.exit) thay vì cố chạy tiếp?",
            "Làm thế nào để đảm bảo không để lộ chi tiết Stack Trace cho client trên môi trường production?"
          ],
          "tags": [
            "Error Handling",
            "Custom Errors",
            "Graceful Shutdown",
            "Operational Errors"
          ],
          "sourceRefs": [
            "https://nodejs.org/api/process.html#event-uncaughtexception"
          ],
          "redFlags": [
            "Bỏ qua việc bắt lỗi trong Promise khiến ứng dụng bị crash âm thầm hoặc nuốt lỗi (swallow errors) không ghi log"
          ]
        },
        {
          "id": "TS_NODE-SKILL-05",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tắt ứng dụng an toàn (Graceful Shutdown) trong Node.js: Khi nhận tín hiệu `SIGTERM` hoặc `SIGINT` từ hệ điều hành hoặc Kubernetes, em triển khai quy trình đóng các kết nối đang mở ra sao để không làm gián đoạn request của người dùng?",
          "evaluationCriteria": [
            "Lắng nghe tín hiệu `process.on('SIGTERM', ...)` và dừng nhận các request mới (`server.close()`)",
            "Chờ các request đang xử lý dở hoàn tất trong một khoảng thời gian timeout an toàn (grace period)",
            "Đóng an toàn các kết nối: Database Connection Pool, Redis client, WebSocket connections và Message Queue consumers trước khi `process.exit(0)`"
          ],
          "followUps": [
            "Tại sao việc không cấu hình Graceful Shutdown khiến người dùng gặp lỗi 502 Bad Gateway mỗi lần deploy pod mới trên K8s?",
            "Làm thế nào để cấu hình `terminationGracePeriodSeconds` trong Kubernetes pod spec phù hợp với thời gian shutdown của Node.js?"
          ],
          "tags": [
            "Graceful Shutdown",
            "SIGTERM",
            "Kubernetes",
            "Connection Teardown"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Ngắt ứng dụng ngay lập tức bằng process.exit(0) khiến các transaction đang chạy dở bị đứt gãy và lỗi dữ liệu"
          ]
        },
        {
          "id": "TS_NODE-SKILL-06",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Bảo mật ứng dụng Node.js: Cách phòng chống các lỗ hổng phổ biến như ReDoS (Regular Expression Denial of Service), Prototype Pollution, và Command Injection trong môi trường runtime JavaScript?",
          "evaluationCriteria": [
            "ReDoS: tránh các biểu thức chính quy có tính backtracking theo hàm mũ (Evil Regex), dùng linter kiểm tra hoặc timeout",
            "Prototype Pollution: sử dụng `Object.create(null)`, `Map`, hoặc đóng băng `Object.freeze()` khi gộp đối tượng (deep merge)",
            "Command Injection: không bao giờ truyền input trực tiếp vào `child_process.exec()`, luôn dùng `execFile` hoặc `spawn` với danh sách tham số mảng"
          ],
          "followUps": [
            "Làm thế nào để cấu hình các HTTP security headers bằng thư viện Helmet trong Node.js?",
            "Công cụ npm audit hoặc Snyk hỗ trợ rà soát các gói thư viện chứa lỗ hổng bảo mật ra sao?"
          ],
          "tags": [
            "Node Security",
            "ReDoS",
            "Prototype Pollution",
            "Command Injection",
            "Helmet"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10"
          ],
          "redFlags": [
            "Nối chuỗi trực tiếp input của người dùng vào câu lệnh thực thi hệ điều hành `exec('rm ' + input)`"
          ]
        },
        {
          "id": "TS_NODE-SKILL-07",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Ghi log có cấu trúc (Structured Logging) và Giám sát hiệu năng: Em cấu hình thư viện Pino hoặc Winston trong Node.js như thế nào? Tại sao Pino có tốc độ ghi log nhanh hơn Winston gấp nhiều lần?",
          "evaluationCriteria": [
            "Pino tối ưu hóa ghi log bất đồng bộ trực tiếp ra stdout dưới dạng JSON nhị phân, giảm tối đa overhead trên Event Loop",
            "Đính kèm Trace ID / Correlation ID vào mỗi dòng log thông qua `AsyncLocalStorage` trong Node.js",
            "Tránh việc format log phức tạp hoặc ghi log đồng bộ ra file đĩa làm nghẽn Event Loop của ứng dụng"
          ],
          "followUps": [
            "Cơ chế `AsyncLocalStorage` trong Node.js hoạt động tương tự như ThreadLocal của Java như thế nào?",
            "Làm thế nào để ẩn (redact) các trường nhạy cảm như mật khẩu, số thẻ tín dụng trong log tự động?"
          ],
          "tags": [
            "Structured Logging",
            "Pino",
            "AsyncLocalStorage",
            "Correlation ID",
            "Winston"
          ],
          "sourceRefs": [
            "https://getpino.io/"
          ],
          "redFlags": [
            "Sử dụng `console.log()` thông thường khắp nơi hoặc ghi log đồng bộ làm nghẽn hiệu năng của server"
          ]
        },
        {
          "id": "TS_NODE-SKILL-08",
          "role": "TypeScript / Node.js Developer",
          "category": "practical_skills",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Chiến lược kiểm thử tự động toàn diện cho TypeScript/Node.js: Em tổ chức Unit Test bằng Vitest / Jest, Mocking dữ liệu, và Integration Test với Testcontainers / Supertest như thế nào?",
          "evaluationCriteria": [
            "Tách biệt Unit test cho business logic cô lập với tốc độ chạy mili-giây",
            "Sử dụng Supertest để kiểm tra toàn diện các HTTP endpoints bao gồm cả Middleware, Pipes, và Guard validation",
            "Dùng Testcontainers để chạy cơ sở dữ liệu thật trong Docker cho Integration Test, tránh sự sai lệch cú pháp SQL"
          ],
          "followUps": [
            "Làm thế nào để đo lường và thiết lập ngưỡng Code Coverage (Branches, Statements) trong CI/CD pipeline?",
            "Sự khác biệt khi viết test cho NestJS bằng `Test.createTestingModule` so với viết test Express thông thường?"
          ],
          "tags": [
            "Testing",
            "Vitest",
            "Supertest",
            "Testcontainers",
            "Integration Test"
          ],
          "sourceRefs": [
            "https://vitest.dev/"
          ],
          "redFlags": [
            "Bỏ qua khâu kiểm thử tích hợp và chỉ dựa vào việc test tay qua Postman"
          ]
        },
        {
          "id": "TS_NODE-SCEN-01",
          "role": "TypeScript / Node.js Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "fresher_intern",
          "question": "Tại TypeScript / Node.js Developer, khi Event Loop Block cùng Heap Out of Memory, Streaming File, Worker Threads xuất hiện với lệnh gọi trả về dữ liệu sai, em kiểm tra log hay dữ liệu nào trước?",
          "evaluationCriteria": [
            "Làm rõ vấn đề và thu thập thông tin trước khi kết luận.",
            "Đề xuất bước xử lý an toàn, vừa sức với Intern/Fresher.",
            "Biết xác nhận kết quả và báo người hướng dẫn khi vượt quá phạm vi hiểu biết."
          ],
          "followUps": [
            "Em sẽ trình bày tiến độ và điều chưa chắc chắn với người hướng dẫn ra sao?"
          ],
          "tags": [
            "Event Loop Block",
            "Heap Out of Memory",
            "Streaming File",
            "Worker Threads"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đưa ra hành động rủi ro hoặc vượt quyền, đặc biệt trong môi trường an ninh mạng."
          ]
        },
        {
          "id": "TS_NODE-SCEN-02",
          "role": "TypeScript / Node.js Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Sau khi refactor mã nguồn sang TypeScript Strict Mode, dự án xuất hiện hàng trăm lỗi biên dịch. Một lập trình viên trong nhóm bắt đầu thêm `// @ts-ignore` và `as any` hàng loạt để kịp tiến độ release. Em xử lý tình huống này và đưa ra quy chuẩn kiểm soát ra sao?",
          "evaluationCriteria": [
            "Tạm dừng việc bypass cẩu thả: giải thích cho nhóm hiểu rằng việc dùng `any` và `ts-ignore` phá vỡ hoàn toàn giá trị của TypeScript và tạo ra các lỗi runtime nguy hiểm",
            "Cấu hình ESLint rule `@typescript-eslint/no-explicit-any: error` và cấm `@ts-ignore` trong pre-commit hook và CI pipeline",
            "Hướng dẫn nhóm kỹ thuật sử dụng `unknown`, Type Narrowing, và utility types để sửa lỗi kiểu dữ liệu đúng đắn"
          ],
          "followUps": [
            "Chiến lược bật dần dần các cờ strict (`strictNullChecks`, `noImplicitAny`) từng bước trong `tsconfig.json` là gì?",
            "Làm thế nào để viết migration script hoặc codemod hỗ trợ refactor type an toàn?"
          ],
          "tags": [
            "TypeScript Strict",
            "Code Quality",
            "Linting Governance",
            "Technical Debt"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Đồng tình với việc lạm dụng `as any` để chạy cho nhanh mà bỏ qua sự an toàn của hệ thống"
          ]
        },
        {
          "id": "TS_NODE-SCEN-03",
          "role": "TypeScript / Node.js Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Một endpoint API bỗng nhiên có thời gian phản hồi tăng từ 50ms lên 10 giây trong khi cơ sở dữ liệu hoàn toàn không bị quá tải. Em nghi ngờ Event Loop đang bị nghẽn (Event Loop Delay). Các bước sử dụng công cụ Profiling để tìm chính xác dòng code gây nghẽn?",
          "evaluationCriteria": [
            "Sử dụng thư viện `clinicjs` (cụ thể là `clinic doctor` và `clinic flame`) hoặc cờ `--prof` của Node.js để tạo Flame Graph",
            "Theo dõi chỉ số Event Loop Lag thông qua API `perf_hooks.monitorEventLoopDelay()`",
            "Xác định dòng code gây nghẽn: thuật toán xử lý chuỗi phức tạp, biểu thức chính quy (ReDoS), hoặc hàm mã hóa/nén đồng bộ (`crypto.pbkdf2Sync`, `fs.readFileSync`)"
          ],
          "followUps": [
            "Làm thế nào để thay thế các hàm đồng bộ bằng phiên bản bất đồng bộ hoặc chuyển sang Worker Thread?",
            "Cách thiết lập alert cảnh báo khi Event Loop Lag vượt ngưỡng 100ms trên Prometheus?"
          ],
          "tags": [
            "Event Loop Lag",
            "Clinic.js",
            "Flame Graph",
            "CPU Profiling",
            "Performance"
          ],
          "sourceRefs": [
            "https://clinicjs.org/"
          ],
          "redFlags": [
            "Đoán mò không dùng công cụ profiling hoặc đổ lỗi cho mạng/database mà không kiểm tra Event Loop"
          ]
        },
        {
          "id": "TS_NODE-SCEN-04",
          "role": "TypeScript / Node.js Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Một dịch vụ Node.js microservice liên tục bị sập và khởi động lại ngẫu nhiên trên Kubernetes. Log hệ thống chỉ hiển thị dòng chữ `UnhandledPromiseRejection` mà không có ngữ cảnh hoặc stack trace rõ ràng. Em truy vết và sửa lỗi ra sao?",
          "evaluationCriteria": [
            "Cấu hình cờ `--unhandled-rejections=strict` để Node.js in đầy đủ stack trace và dừng an toàn thay vì nuốt lỗi",
            "Tìm kiếm các Promise không có khối `.catch()` hoặc hàm async không được bọc trong `try-catch`",
            "Tạo middleware hoặc interceptor bắt lỗi tập trung đảm bảo mọi Promise trong luồng request đều được xử lý ngoại lệ"
          ],
          "followUps": [
            "Tại sao việc không await một Promise trong hàm async có thể dẫn đến Unhandled Rejection ngoài luồng try-catch?",
            "Làm thế nào để sử dụng thư viện `express-async-errors` trong các dự án Express cũ?"
          ],
          "tags": [
            "UnhandledPromiseRejection",
            "Async Await",
            "Error Tracing",
            "Node.js Debugging"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Bật chế độ bỏ qua unhandled rejection để app không crash mà không tìm nguyên nhân gốc rễ"
          ]
        },
        {
          "id": "TS_NODE-SCEN-05",
          "role": "TypeScript / Node.js Developer",
          "category": "scenario",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Tình huống: Khi triển khai ứng dụng Node.js chạy nhiều tiến trình qua PM2 hoặc Kubernetes cluster, tính năng đặt lịch gửi thông báo (Cron Job / Scheduled Task) bị chạy lặp lại 4 lần cùng lúc trên cả 4 instance. Em xử lý vấn đề lập lịch phân tán (Distributed Cron) ra sao?",
          "evaluationCriteria": [
            "Phân tích nguyên nhân: Mỗi tiến trình Node.js độc lập đều khởi chạy cronjob riêng của nó trong bộ nhớ cục bộ",
            "Giải pháp 1: Sử dụng Distributed Lock (Redis Lock với Redlock) để đảm bảo chỉ có duy nhất 1 instance giành được quyền thực thi job tại một thời điểm",
            "Giải pháp 2: Tách biệt cronjob ra thành một service/pod riêng biệt hoặc sử dụng hệ thống quản lý queue phân tán (BullMQ repeatable jobs / Kubernetes CronJob)"
          ],
          "followUps": [
            "Làm thế nào để xử lý trường hợp instance đang giữ lock bị crash giữa chừng bằng cơ chế Lock TTL?",
            "Tại sao không nên hardcode cronjob chạy trên instance số 0 (instance_id = 0) trong môi trường autoscaling?"
          ],
          "tags": [
            "Distributed Cron",
            "Redis Lock",
            "BullMQ Repeatable",
            "Clustering"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Để mặc cronjob chạy lặp lại 4 lần gửi spam email cho khách hàng"
          ]
        },
        {
          "id": "TS_NODE-SCEN-06",
          "role": "TypeScript / Node.js Developer",
          "category": "scenario",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Tình huống: Một dịch vụ tải tệp media cho phép người dùng truyền tham số đường dẫn tệp vào URL. Tin tặc lợi dụng điều này để tấn công Path Traversal (`../../etc/passwd`) nhằm đọc các tệp cấu hình nhạy cảm của máy chủ. Em kiểm tra và vá lỗ hổng này như thế nào?",
          "evaluationCriteria": [
            "Phân tích rủi ro: Nối chuỗi đường dẫn trực tiếp bằng `path.join(__dirname, userInput)` mà không kiểm tra ranh giới thư mục",
            "Vá lỗi: Sử dụng `path.resolve()` để chuẩn hóa đường dẫn tuyệt đối, sau đó kiểm tra xem đường dẫn kết quả có bắt đầu bằng thư mục gốc cho phép hay không (`resolvedPath.startsWith(ALLOWED_DIR)`)",
            "Sử dụng whitelist tên tệp hoặc lưu trữ tệp theo ID ngẫu nhiên thay vì cho phép truyền tên tệp tùy ý từ người dùng"
          ],
          "followUps": [
            "Làm thế nào để viết bài kiểm thử tự động (Security Test) giả lập các chuỗi path traversal nguy hiểm?",
            "Quyền hạn của tài xế hệ điều hành chạy ứng dụng Node.js (Non-root user trong Docker) bảo vệ hệ thống ra sao?"
          ],
          "tags": [
            "Path Traversal",
            "Directory Traversal",
            "File System Security",
            "Vulnerability Remediation"
          ],
          "sourceRefs": [
            "https://owasp.org/Top10",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ dùng hàm replace đơn giản `input.replace('../', '')` rất dễ dàng bị kẻ xấu vượt qua bằng chuỗi `....//`"
          ]
        },
        {
          "id": "TS_NODE-CV-01",
          "role": "TypeScript / Node.js Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Trong dự án Node.js phức tạp nhất trên CV của em: Em đã thiết kế kiến trúc backend theo mô hình nào (Layered Architecture, Hexagonal / Ports & Adapters, Clean Architecture)? Ranh giới trách nhiệm giữa các tầng được phân định ra sao?",
          "evaluationCriteria": [
            "Mô tả ranh giới rõ ràng: Tầng Domain (Business Rules độc lập), Tầng Application (UseCases), Tầng Infrastructure (DB, Redis, External APIs)",
            "Thể hiện nguyên lý Dependency Inversion: Tầng Domain không phụ thuộc vào Framework hay ORM cụ thể",
            "Lợi ích thực tế: khả năng thay đổi cơ sở dữ liệu hoặc viết unit test mà không cần dựng database thật"
          ],
          "followUps": [
            "Tại sao việc không để entity của ORM (TypeORM entity) rò rỉ vào tầng Domain logic lại giúp code bền vững hơn?",
            "Đánh đổi về số lượng file và boilerplate code khi áp dụng Clean Architecture là gì?"
          ],
          "tags": [
            "Clean Architecture",
            "Hexagonal Architecture",
            "Domain Driven Design",
            "CV Deep Dive"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nói rằng mình áp dụng Clean Architecture nhưng trong code tầng Service gọi trực tiếp raw SQL và xử lý cả HTTP response"
          ]
        },
        {
          "id": "TS_NODE-CV-02",
          "role": "TypeScript / Node.js Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trên CV em có nêu kinh nghiệm làm việc với WebSocket thời gian thực quy mô lớn. Hãy chia sẻ cách em thiết kế cụm WebSocket Server mở rộng ngang (Horizontal Scaling) qua nhiều pod với Redis Adapter?",
          "evaluationCriteria": [
            "Mỗi máy chủ Node.js giữ kết nối TCP của các client kết nối tới nó",
            "Tích hợp `@socket.io/redis-adapter` hoặc Redis Pub/Sub để phát tán tin nhắn (broadcast) xuyên suốt tất cả các instance",
            "Cấu hình Session Affinity (Sticky Sessions) trên Load Balancer nếu cần nâng cấp handshake từ HTTP sang WebSocket"
          ],
          "followUps": [
            "Làm thế nào để xử lý việc lưu trữ trạng thái người dùng online/offline phân tán trên Redis?",
            "Cách đo lường số lượng kết nối đồng thời tối đa (Concurrent Connections) mà một instance Node.js có thể chịu tải?"
          ],
          "tags": [
            "WebSocket Scaling",
            "Redis Adapter",
            "Socket.io",
            "Realtime Architecture",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ biết dùng WebSocket trên 1 server duy nhất và không biết cách scale khi chạy nhiều container"
          ]
        },
        {
          "id": "TS_NODE-CV-03",
          "role": "TypeScript / Node.js Developer",
          "category": "cv_validation",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Em ghi nhận kinh nghiệm xây dựng các tiện ích Custom Decorators hoặc Metadata Reflection trong TypeScript trên CV. Em hãy dẫn chứng một trường hợp cụ thể em tự tạo decorator và cách Reflection API hoạt động bên dưới?",
          "evaluationCriteria": [
            "Trình bày use-case: tạo Decorator `@CurrentUser()` trích xuất user từ request, `@Roles('ADMIN')` để kiểm tra quyền, hoặc `@AuditLog()` ghi lại thao tác",
            "Sử dụng `Reflect.defineMetadata` và `Reflect.getMetadata` từ thư viện `reflect-metadata` để lưu trữ và đọc metadata lúc runtime",
            "Cấu hình cờ `experimentalDecorators` và `emitDecoratorMetadata` trong `tsconfig.json`"
          ],
          "followUps": [
            "Sự khác biệt giữa TypeScript Stage 3 Decorators (chuẩn ECMAScript mới) và Legacy Experimental Decorators?",
            "Cách một Decorator can thiệp sửa đổi hành vi của một phương thức (Method Wrapper) diễn ra ra sao?"
          ],
          "tags": [
            "TypeScript Decorators",
            "Reflect Metadata",
            "Metaprogramming",
            "CV Verification"
          ],
          "sourceRefs": [
            "https://www.typescriptlang.org/docs",
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Dùng decorator có sẵn của framework nhưng không hiểu cách thức một decorator được định nghĩa và thực thi"
          ]
        },
        {
          "id": "TS_NODE-CV-04",
          "role": "TypeScript / Node.js Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Em hãy kể về một tình huống mà em phải điều tra và xử lý một lỗi rò rỉ bộ nhớ (Memory Leak) khó khăn trong ứng dụng Node.js trên CV. Em đã dùng công cụ gì để phân tích Heap Snapshot và nguyên nhân gốc rễ là gì?",
          "evaluationCriteria": [
            "Sử dụng lệnh `node --inspect` kết hợp Chrome DevTools hoặc clinicjs để chụp 3 lần Heap Snapshot tại các thời điểm khác nhau",
            "Sử dụng tính năng so sánh (Comparison View) để tìm các đối tượng tăng dần về số lượng (Delta > 0) mà không được thu hồi",
            "Chỉ rõ nguyên nhân gốc rễ: tích lũy dữ liệu trong biến Global Cache không có giới hạn, rò rỉ EventEmitter listener, hoặc closure giữ tham chiếu DOM/Buffer lớn"
          ],
          "followUps": [
            "Chỉ số Shallow Size và Retained Size của một đối tượng trong Heap Snapshot mang ý nghĩa gì?",
            "Làm thế nào để phòng chống rò rỉ EventEmitter bằng phương thức `emitter.setMaxListeners()`?"
          ],
          "tags": [
            "Memory Leak",
            "Heap Snapshot",
            "V8 Engine",
            "Debugging",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Nói chung chung là 'tăng RAM cho server' thay vì tìm và sửa nguyên nhân gây rò rỉ bộ nhớ"
          ]
        },
        {
          "id": "TS_NODE-CV-05",
          "role": "TypeScript / Node.js Developer",
          "category": "cv_validation",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trong dự án có tích hợp hệ thống thanh toán hoặc xử lý giao dịch tài chính trên CV, em đã đảm bảo tính toàn vẹn dữ liệu (Data Consistency) và tính bất biến (Immutability) của lịch sử giao dịch như thế nào?",
          "evaluationCriteria": [
            "Áp dụng mô hình Sổ cái kép (Double-entry Bookkeeping) với mỗi giao dịch đều có dòng Nợ (Debit) và Có (Credit) cân bằng",
            "Không bao giờ thực hiện lệnh `UPDATE` số dư trực tiếp, mà ghi nhận bản ghi giao dịch mới trong một Transaction ACID duy nhất",
            "Sử dụng UUID cho Idempotency Key và cơ chế khóa dòng lạc quan hoặc bi quan để ngăn chặn Race Condition"
          ],
          "followUps": [
            "Tại sao việc không cho phép xóa (No hard deletes) là nguyên tắc bắt buộc trong hệ thống tài chính?",
            "Làm thế nào để kiểm toán đối soát số dư tài khoản định kỳ bằng background job?"
          ],
          "tags": [
            "Financial Architecture",
            "Double-entry Bookkeeping",
            "ACID",
            "Immutability",
            "CV Verification"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cập nhật trực tiếp số dư tài khoản bằng câu lệnh `UPDATE accounts SET balance = balance + 100` không có transaction bảo vệ"
          ]
        },
        {
          "id": "TS_NODE-BEHAV-01",
          "role": "TypeScript / Node.js Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Hệ sinh thái Node.js/npm có số lượng thư viện mã nguồn mở khổng lồ. Khi một thành viên trong nhóm muốn cài đặt một package mới cho một tác vụ đơn giản (ví dụ chỉ để format ngày tháng hoặc kiểm tra chuỗi), em trao đổi và đánh giá rủi ro Dependency Bloat ra sao?",
          "evaluationCriteria": [
            "Nhẹ nhàng chỉ ra rủi ro: việc thêm package kéo theo hàng chục sub-dependencies, tăng kích thước bundle, tăng nguy cơ dính lỗ hổng bảo mật chuỗi cung ứng (Supply Chain Attack)",
            "Khuyến khích tận dụng các API native hiện đại của Node.js (như `Intl`, `crypto`, `fetch`) hoặc viết helper function nội bộ nhỏ nếu yêu cầu đơn giản",
            "Cùng nhóm xây dựng quy tắc đánh giá package: kiểm tra số lượng tải hàng tuần, tần suất bảo trì, số lượng open issues và dung lượng package"
          ],
          "followUps": [
            "Em làm gì nếu thành viên đó cho rằng 'tự viết thì tốn thời gian hơn là cài thư viện có sẵn'?",
            "Công cụ bundlephobia hỗ trợ phân tích kích thước và rủi ro của package như thế nào?"
          ],
          "tags": [
            "Dependency Management",
            "Supply Chain Security",
            "Code Review",
            "Pragmatism"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Cài đặt bừa bãi hàng chục thư viện không rõ nguồn gốc vào dự án công ty"
          ]
        },
        {
          "id": "TS_NODE-BEHAV-02",
          "role": "TypeScript / Node.js Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Khi phát hiện một đồng nghiệp Senior khác trong nhóm viết code tắt bỏ qua các quy chuẩn Type-safety của TypeScript (dùng `any` vô tội vạ) khiến các module khác bị lỗi runtime bất ngờ, em tiếp cận phản hồi và giải quyết vấn đề thế nào?",
          "evaluationCriteria": [
            "Trao đổi riêng tư với tinh thần tôn trọng chuyên môn, mang theo bằng chứng cụ thể về lỗi runtime đã phát sinh để thảo luận khách quan",
            "Lắng nghe lý do của đồng nghiệp: có thể do áp lực thời gian hoặc do kiểu dữ liệu của bên thứ ba quá phức tạp chưa kịp gõ type",
            "Chủ động hỗ trợ viết type định nghĩa chuẩn và đề xuất đưa quy tắc chặn `any` vào CI để trở thành tiêu chuẩn chung của cả nhóm, không nhắm vào cá nhân"
          ],
          "followUps": [
            "Làm thế nào để tạo môi trường cởi mở tiếp nhận góp ý kỹ thuật trong nhóm?",
            "Cách cân bằng giữa tính nghiêm ngặt của TypeScript và tốc độ phát triển trong giai đoạn thử nghiệm?"
          ],
          "tags": [
            "Peer Review",
            "Constructive Feedback",
            "Professionalism",
            "Type Safety Culture"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Chỉ trích gay gắt đồng nghiệp công khai hoặc im lặng chịu đựng rồi âm thầm phàn nàn sau lưng"
          ]
        },
        {
          "id": "TS_NODE-BEHAV-03",
          "role": "TypeScript / Node.js Developer",
          "category": "behavioral",
          "difficulty": "intermediate",
          "seniority": "middle",
          "question": "Trước yêu cầu từ khách hàng muốn xây dựng một tính năng mới rất gấp nhưng yêu cầu nghiệp vụ còn mơ hồ và có nguy cơ thay đổi liên tục, em thiết kế mã nguồn Backend như thế nào để vừa kịp tiến độ vừa linh hoạt thích ứng?",
          "evaluationCriteria": [
            "Chủ động làm việc với Product Owner để chốt phạm vi phiên bản tối thiểu khả dụng (MVP) với các giả định rõ ràng",
            "Thiết kế kiến trúc lỏng lẻo có tính module hóa cao (Decoupled Architecture), che giấu các phần logic biến động đằng sau các Interface",
            "Viết mã nguồn ngắn gọn, dễ hiểu và dễ xóa/thay thế; không cố gắng thiết kế kiến trúc quá phức tạp vượt trước nhu cầu (tránh Over-engineering)"
          ],
          "followUps": [
            "Làm thế nào để ghi chép lại các giả định kỹ thuật để đối soát sau này khi yêu cầu thay đổi?",
            "Bài học về việc không tối ưu hóa sớm (Premature Optimization) trong giai đoạn khám phá sản phẩm là gì?"
          ],
          "tags": [
            "Agile Mindset",
            "Unclear Requirements",
            "Decoupled Design",
            "Pragmatic Architecture"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Từ chối làm việc cho đến khi có bản đặc tả hoàn hảo 100% hoặc xây dựng một kiến trúc quá cồng kềnh không cần thiết"
          ]
        },
        {
          "id": "TS_NODE-BEHAV-04",
          "role": "TypeScript / Node.js Developer",
          "category": "behavioral",
          "difficulty": "basic",
          "seniority": "junior",
          "question": "Khi nhận được thông báo lỗi từ hệ thống giám sát vào ban đêm về việc dịch vụ API chính bị sập, em giữ bình tĩnh và thực hiện quy trình xử lý sự cố khẩn cấp (On-call Incident Management) ra sao?",
          "evaluationCriteria": [
            "Bình tĩnh tiếp nhận thông tin, thông báo lên kênh sự cố xác nhận bản thân đang xử lý để các bên liên quan nắm tình hình",
            "Kiểm tra nhanh dashboard giám sát và log lỗi gần nhất để khoanh vùng nguyên nhân (sập DB, tràn RAM, lỗi code mới deploy)",
            "Ưu tiên phục hồi dịch vụ trước tiên (Rollback phiên bản cũ hoặc khởi động lại pod), sau đó mới tiến hành phân tích sâu nguyên nhân gốc rễ vào ngày hôm sau"
          ],
          "followUps": [
            "Tại sao việc đầu tiên trong sự cố sản xuất là phục hồi hoạt động chứ không phải ngồi debug từng dòng code?",
            "Quy trình viết báo cáo sự cố (Post-incident Report) sau khi hệ thống hoạt động ổn định trở lại?"
          ],
          "tags": [
            "Incident Response",
            "On-call Duty",
            "Emergency Handling",
            "Composure"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Hoảng loạn không biết bắt đầu từ đâu hoặc cố gắng debug trực tiếp trên môi trường production đang sập"
          ]
        },
        {
          "id": "TS_NODE-BEHAV-05",
          "role": "TypeScript / Node.js Developer",
          "category": "behavioral",
          "difficulty": "advanced",
          "seniority": "senior_lead",
          "question": "Là một kỹ sư Backend chủ chốt, em định hình văn hóa kiểm thử tự động (Automated Testing Culture) và quy chuẩn viết mã (Code Review Standards) cho các thành viên mới trong nhóm như thế nào?",
          "evaluationCriteria": [
            "Làm gương thông qua các Pull Request cá nhân: luôn có unit/integration test đi kèm, mô tả rõ ràng mục đích và kết quả test",
            "Xây dựng tài liệu hướng dẫn bắt đầu (Onboarding Guide) có các dự án mẫu và mẫu test chuẩn mực",
            "Review code với tinh thần người hướng dẫn: giải thích nguyên lý 'tại sao', đặt câu hỏi gợi mở tư duy thay vì chỉ bắt bẻ lỗi cú pháp"
          ],
          "followUps": [
            "Làm thế nào để đo lường hiệu quả của quy trình Code Review (giảm tỷ lệ bug lọt lên production)?",
            "Cách khuyến khích các bạn Junior chủ động tham gia review code của các bạn Senior?"
          ],
          "tags": [
            "Engineering Culture",
            "Mentorship",
            "Code Review Standards",
            "Leadership"
          ],
          "sourceRefs": [
            "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
          ],
          "redFlags": [
            "Xem việc review code như một thủ tục hình thức bấm nút duyệt qua loa mà không đọc kỹ nội dung"
          ]
        }
      ]
    }
];
