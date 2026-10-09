import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: Kiểm thử & Chất lượng (4 vị trí - 120 câu hỏi)
export const testingQAQuestionBanks: RoleQuestionBank[] = [
  {
    "role": "QA Engineer",
    "group": "testingQA",
    "groupLabel": "Kiểm thử & Chất lượng",
    "aliases": [
      "qa engineer",
      "quality assurance engineer",
      "software tester",
      "kiem thu vien",
      "qa",
      "manual qa",
      "ky su dam bao chat luong"
    ],
    "questions": [
      {
        "id": "QA-FOUND-01",
        "role": "QA Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong QA Engineer, phân biệt ISTQB, Equivalence Partitioning, Boundary Value Analysis, Test Design; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của ISTQB.",
          "Phân biệt được các khái niệm liên quan Equivalence Partitioning, Boundary Value Analysis, Test Design ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí QA Engineer."
        ],
        "followUps": [
          "Nếu mới học ISTQB, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "ISTQB",
          "Equivalence Partitioning",
          "Boundary Value Analysis",
          "Test Design"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "QA-FOUND-02",
        "role": "QA Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Bảng quyết định (Decision Table Testing) và Kiểm thử chuyển trạng thái (State Transition Testing) được áp dụng trong những trường hợp nghiệp vụ nào? Hãy vẽ bảng quyết định cho tính năng áp dụng mã giảm giá phụ thuộc vào hạng thành viên và giá trị đơn hàng?",
        "evaluationCriteria": [
          "Decision Table phù hợp cho các luồng có nhiều điều kiện kết hợp (Conditions) dẫn đến các hành động khác nhau (Actions)",
          "State Transition phù hợp cho các thực thể có vòng đời chuyển đổi trạng thái (vd: Đơn hàng: Chờ duyệt -> Đang giao -> Đã giao / Hủy)",
          "Trình bày được ma trận điều kiện và loại bỏ các trường hợp bất khả thi (Infeasible combinations)"
        ],
        "followUps": [
          "Làm thế nào để phát hiện các chuyển đổi trạng thái không hợp lệ (Invalid State Transitions)?",
          "Khi nào độ phức tạp của Decision Table quá lớn và cách rút gọn bảng?"
        ],
        "tags": [
          "Decision Table",
          "State Transition",
          "Test Design",
          "Business Logic"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Bỏ sót các kịch bản chuyển đổi trạng thái ngược hoặc kết hợp điều kiện phủ định"
        ]
      },
      {
        "id": "QA-FOUND-03",
        "role": "QA Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Phân biệt giữa Mức độ nghiêm trọng (Severity) và Mức độ ưu tiên (Priority) của một lỗi phần mềm (Bug). Nêu 2 ví dụ thực tế: một lỗi có Severity Cao nhưng Priority Thấp, và một lỗi có Severity Thấp nhưng Priority Cao?",
        "evaluationCriteria": [
          "Severity phản ánh mức độ ảnh hưởng kỹ thuật đến hệ thống (Blocker, Critical, Major, Minor)",
          "Priority phản ánh mức độ khẩn cấp cần sửa chữa dưới góc độ kinh doanh và người dùng (P1, P2, P3)",
          "Ví dụ Severity Cao - Priority Thấp: crash tính năng phụ ít người dùng trên dòng máy hiếm; Severity Thấp - Priority Cao: sai chính tả logo công ty ở trang chủ"
        ],
        "followUps": [
          "Ai là người đưa ra quyết định cuối cùng về Priority trong buổi họp Bug Triage?",
          "Khi có sự bất đồng giữa Dev và QA về mức Severity của một bug, em xử lý thế nào?"
        ],
        "tags": [
          "Severity vs Priority",
          "Bug Triage",
          "Defect Management",
          "ISTQB"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Đồng nhất hoàn toàn Severity và Priority làm một, cho rằng Severity cao thì bắt buộc Priority phải cao"
        ]
      },
      {
        "id": "QA-FOUND-04",
        "role": "QA Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Mô hình V-Model trong kiểm thử phần mềm ánh xạ các giai đoạn phát triển với các cấp độ kiểm thử tương ứng như thế nào? Sự khác biệt về mục tiêu giữa Component/Unit Testing, Integration Testing, System Testing và Acceptance Testing (UAT)?",
        "evaluationCriteria": [
          "Yêu cầu nghiệp vụ ánh xạ với Acceptance Testing; Thiết kế kiến trúc ánh xạ với System Testing; Thiết kế chi tiết ánh xạ với Integration Testing; Lập trình ánh xạ với Unit Testing",
          "Unit test: kiểm tra hàm/module cô lập; Integration test: kiểm tra giao tiếp giữa các module; System test: kiểm tra toàn diện hệ thống; UAT: kiểm tra tính sẵn sàng kinh doanh",
          "Áp dụng tư duy Shift-Left: QA tham gia đọc hiểu và kiểm thử tĩnh (Static Testing) ngay từ khâu phân tích yêu cầu"
        ],
        "followUps": [
          "Static Testing (kiểm thử tĩnh) khác với Dynamic Testing (kiểm thử động) ở những điểm cốt lõi nào?",
          "Tại sao phát hiện lỗi ở giai đoạn Requirement lại tiết kiệm chi phí gấp hàng chục lần so với ở System Testing?"
        ],
        "tags": [
          "V-Model",
          "Testing Levels",
          "Shift-Left",
          "UAT",
          "Static Testing"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Nghĩ rằng QA chỉ bắt đầu làm việc khi Developers đã hoàn thành việc viết code và deploy lên môi trường test"
        ]
      },
      {
        "id": "QA-FOUND-05",
        "role": "QA Engineer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Nguyên lý kiểm thử 'Thuốc trừ sâu' (Pesticide Paradox) trong 7 nguyên lý kiểm thử cốt lõi của ISTQB có ý nghĩa gì? Làm thế nào để đội ngũ QA vượt qua hiện tượng này khi chạy kiểm thử hồi quy (Regression Testing)?",
        "evaluationCriteria": [
          "Nguyên lý: Nếu lặp đi lặp lại cùng một bộ test case cũ thì hệ thống sẽ 'miễn dịch' và không thể phát hiện thêm lỗi mới",
          "Biện pháp: Thường xuyên rà soát, cập nhật, viết bổ sung test case mới và áp dụng kiểm thử khám phá (Exploratory Testing)",
          "Tự động hóa các test case hồi quy ổn định để dành thời gian của con người cho việc đào sâu các góc khuất mới của sản phẩm"
        ],
        "followUps": [
          "Phân biệt giữa Regression Testing (kiểm tra lỗi phát sinh ở tính năng cũ) và Retesting/Confirmation Testing (kiểm tra lại đúng bug đã fix)?",
          "Chiến lược chọn lọc bộ test Regression có trọng số rủi ro (Risk-based Regression) diễn ra sao?"
        ],
        "tags": [
          "Pesticide Paradox",
          "7 Testing Principles",
          "Regression Testing",
          "Exploratory Testing"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Duy trì bộ test case cứng nhắc trong nhiều năm mà không bao giờ xem xét bổ sung kịch bản mới"
        ]
      },
      {
        "id": "QA-FOUND-06",
        "role": "QA Engineer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Cấu trúc của một bản báo cáo lỗi (Bug Report) tiêu chuẩn chuyên nghiệp gồm những trường thông tin bắt buộc nào? Tại sao trường 'Các bước tái hiện' (Steps to Reproduce) và 'Kết quả mong đợi' (Expected Result) lại quan trọng nhất?",
        "evaluationCriteria": [
          "Các trường bắt buộc: Tiêu đề súc tích, Môi trường (OS, Browser, Device, Version), Pre-conditions, Các bước tái hiện rõ ràng (1, 2, 3), Kết quả thực tế (Actual Result), Kết quả mong đợi (Expected Result), Bằng chứng (Screenshot, Video, Log, Network file)",
          "Steps to Reproduce chuẩn giúp lập trình viên tái hiện được lỗi ngay lần thử đầu tiên, tránh việc bị từ chối với lý do 'Cannot Reproduce'",
          "Expected Result đối chiếu trực tiếp với tài liệu đặc tả yêu cầu (BRD/PRD) để chứng minh đây là bug chứ không phải tính năng"
        ],
        "followUps": [
          "Khi gặp một lỗi chập chờn (Intermittent Bug) chỉ xảy ra 1 lần trong 10 lần thử, em ghi nhận báo cáo lỗi như thế nào?",
          "Làm thế nào để đính kèm file log hoặc HAR file từ Network tab khi báo bug liên quan đến API?"
        ],
        "tags": [
          "Bug Report",
          "Defect Tracking",
          "Steps to Reproduce",
          "Jira Bug Standard"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Viết tiêu đề mơ hồ như 'Trang web bị lỗi không thanh toán được' mà không có các bước tái hiện và bằng chứng"
        ]
      },
      {
        "id": "QA-SKILL-01",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng API Testing (Postman, JSON Schema, Status Codes, Assertions) cho QA Engineer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng API Testing trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "API Testing",
          "Postman",
          "JSON Schema",
          "Status Codes",
          "Assertions"
        ],
        "sourceRefs": [
          "https://learning.postman.com/docs/writing-scripts/test-scripts/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "QA-SKILL-02",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập QA Engineer: dựa trên Exploratory Testing, phối hợp SBTM, Test Charter, Heuristics; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Exploratory Testing trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Exploratory Testing",
          "SBTM",
          "Test Charter",
          "Heuristics"
        ],
        "sourceRefs": [
          "https://www.satisfice.com/exploratory-testing"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "QA-SKILL-03",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi tham gia vào quy trình phát triển Agile/Scrum: Vai trò của QA trong buổi họp Three Amigos (PO, Dev, QA) và quy trình chuyển đổi User Story thành các tiêu chí nghiệm thu theo chuẩn BDD (Given-When-Then) là gì?",
        "evaluationCriteria": [
          "Đóng vai trò người phản biện: đặt các câu hỏi 'Điều gì xảy ra nếu...?' (Edge cases, Error paths, Negative flows) ngay từ lúc câu chuyện được thảo luận",
          "Viết Acceptance Criteria theo cú pháp Gherkin: Given (tiền điều kiện) - When (hành động người dùng) - Then (kết quả mong đợi)",
          "Đảm bảo User Story đạt tiêu chuẩn Definition of Ready (DoR) trước khi đưa vào Sprint Backlog"
        ],
        "followUps": [
          "Làm thế nào để ngăn chặn hiện tượng 'QA là nút thắt cổ chai' (QA Bottleneck) vào những ngày cuối của Sprint?",
          "Definition of Done (DoD) của một User Story cần có những tiêu chí chất lượng nào?"
        ],
        "tags": [
          "Agile QA",
          "Three Amigos",
          "BDD",
          "Gherkin",
          "Acceptance Criteria"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Ngồi im thụ động trong buổi refinement và chỉ đọc User Story khi dev đã giao code sang để test"
        ]
      },
      {
        "id": "QA-SKILL-04",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quy trình kiểm thử tính tương thích (Cross-Browser & Cross-Device Testing): Em lập ma trận thiết bị kiểm thử (Device Matrix) dựa trên dữ liệu Google Analytics như thế nào? Cách phân tích các điểm khác biệt giữa trình duyệt Chromium, Safari (WebKit) và Firefox?",
        "evaluationCriteria": [
          "Thu thập số liệu người dùng thật: tỷ lệ phiên bản hệ điều hành, trình duyệt, độ phân giải màn hình phổ biến nhất từ analytics",
          "Chọn lọc danh sách thiết bị đại diện: top thiết bị phổ biến nhất + thiết bị có tỷ lệ lỗi cao + thiết bị cấu hình yếu nhất",
          "Lưu ý các điểm đặc thù của Safari/WebKit: xử lý date format (Safari không parse `YYYY-MM-DD HH:mm:ss`), rendering engine font, video autoplay"
        ],
        "followUps": [
          "Làm thế nào để sử dụng BrowserStack hoặc Sauce Labs để kiểm thử trên hàng trăm thiết bị thực tế trên đám mây?",
          "Responsive Testing: các điểm gãy (Breakpoints) trên giao diện cần được kiểm tra những gì?"
        ],
        "tags": [
          "Cross-Browser Testing",
          "Device Matrix",
          "WebKit Compatibility",
          "Responsive QA"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ kiểm thử duy nhất trên trình duyệt Google Chrome trên màn hình máy tính cá nhân"
        ]
      },
      {
        "id": "QA-SKILL-05",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Kỹ năng sử dụng SQL phục vụ kiểm thử dữ liệu (Database Testing): Em viết các câu truy vấn SQL để xác minh tính toàn vẹn dữ liệu, kiểm tra quan hệ khóa ngoại (Foreign Key integrity), và đối soát dữ liệu sau khi thực hiện giao dịch trên UI như thế nào?",
        "evaluationCriteria": [
          "Sử dụng thành thạo `SELECT`, `JOIN` (INNER, LEFT), `WHERE`, `GROUP BY`, `HAVING` để kiểm tra dữ liệu lưu đúng bảng và đúng trường",
          "Xác minh các ràng buộc dữ liệu: kiểm tra không có bản ghi con mồ côi (Orphan records), dữ liệu không bị NULL ở các cột bắt buộc",
          "Kiểm tra tính đúng đắn của dữ liệu tính toán (vd: tổng tiền đơn hàng phải bằng tổng các item con trừ khuyến mãi)"
        ],
        "followUps": [
          "Làm thế nào để chuẩn bị dữ liệu kiểm thử (Test Data Preparation) bằng SQL script trước khi chạy test?",
          "Tại sao không nên chạy trực tiếp câu lệnh `UPDATE` hoặc `DELETE` trên database dùng chung mà không có điều kiện `WHERE`?"
        ],
        "tags": [
          "SQL for QA",
          "Database Testing",
          "Data Integrity",
          "Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ kiểm tra những gì hiển thị trên màn hình mà không kiểm tra xem dữ liệu trong database có được lưu chính xác hay không"
        ]
      },
      {
        "id": "QA-SKILL-06",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Kiểm thử bảo mật cơ bản dành cho QA (Web Security Testing): Em kiểm tra các lỗ hổng OWASP Top 10 phổ biến như SQL Injection, Cross-Site Scripting (XSS), và Broken Authentication trên giao diện và API bằng những kịch bản kiểm thử nào?",
        "evaluationCriteria": [
          "SQL Injection: chèn các chuỗi ký tự đặc biệt (`' OR '1'='1`, `'; DROP TABLE--`) vào các ô tìm kiếm, form đăng nhập và tham số query API",
          "XSS: chèn các payload mã độc JavaScript (`<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`) để xem hệ thống có escape đầu ra không",
          "Broken Authentication: kiểm tra chính sách độ phức tạp mật khẩu, thử brute-force xem có bị khóa tài khoản không, kiểm tra session timeout"
        ],
        "followUps": [
          "IDOR (Insecure Direct Object Reference) được kiểm tra bằng cách thay đổi ID tài nguyên trên URL ra sao?",
          "Công cụ OWASP ZAP hỗ trợ quét bảo mật tự động cho QA như thế nào?"
        ],
        "tags": [
          "Security Testing",
          "OWASP Top 10",
          "SQL Injection",
          "XSS",
          "IDOR"
        ],
        "sourceRefs": [
          "https://owasp.org/Top10"
        ],
        "redFlags": [
          "Cho rằng bảo mật là việc riêng của Security team và QA không cần quan tâm đến các lỗ hổng cơ bản"
        ]
      },
      {
        "id": "QA-SKILL-07",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quản lý và điều phối buổi họp Phân loại lỗi (Bug Triage Meeting): Quy trình đánh giá, phân loại mức độ ưu tiên, chỉ định người sửa, và xử lý các bug gây tranh cãi giữa Product, Dev và QA diễn ra như thế nào?",
        "evaluationCriteria": [
          "Thiết lập nhịp sinh hoạt định kỳ (hàng ngày hoặc 2 lần/tuần) với sự tham gia của Product Owner, Tech Lead, và QA Lead",
          "Tiêu chí xem xét: mức độ ảnh hưởng đến khách hàng, tần suất xảy ra, chi phí sửa chữa, và mục tiêu của bản release hiện tại",
          "Xử lý các bug tranh cãi: QA cung cấp dữ liệu số lượng người dùng bị ảnh hưởng và bằng chứng khách quan, PO là người đưa ra quyết định kinh doanh cuối cùng"
        ],
        "followUps": [
          "Quy trình đóng lỗi với trạng thái 'Won't Fix' hoặc 'By Design' cần được phê duyệt ra sao?",
          "Làm thế nào để theo dõi và ngăn chặn tình trạng số lượng bug tồn đọng (Bug Backlog) bị phình to theo thời gian?"
        ],
        "tags": [
          "Bug Triage",
          "Defect Management",
          "Cross-functional Meeting",
          "Jira Workflow"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Để mặc các bug trong Jira không có người phân loại dẫn đến việc bỏ sót lỗi nghiêm trọng khi release"
        ]
      },
      {
        "id": "QA-SKILL-08",
        "role": "QA Engineer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết lập và theo dõi các chỉ số đo lường chất lượng phần mềm (Quality Metrics): Em thu thập và phân tích các chỉ số Mật độ lỗi (Defect Density), Tỷ lệ lỗi lọt lên production (Defect Leakage Rate), và Thời gian trung bình sửa lỗi (MTTR) như thế nào để cải tiến quy trình?",
        "evaluationCriteria": [
          "Defect Density: số lượng bug trên 1.000 dòng code (KLOC) hoặc trên mỗi Story Point để đánh giá độ ổn định của từng module",
          "Defect Leakage: tỷ lệ phần trăm số bug do khách hàng phát hiện trên tổng số bug, chỉ số phản ánh trực tiếp hiệu quả của đội QA",
          "Mean Time to Resolve (MTTR): thời gian từ lúc mở bug đến lúc fix và verify thành công, đo lường tốc độ phản ứng của đội ngũ"
        ],
        "followUps": [
          "Làm thế nào để trình bày báo cáo chất lượng (Quality Dashboard) trực quan cho ban lãnh đạo C-level?",
          "Khi chỉ số Defect Leakage tăng đột biến trong một sprint, các bước điều tra nguyên nhân gốc rễ (RCA) của em là gì?"
        ],
        "tags": [
          "Quality Metrics",
          "Defect Density",
          "Defect Leakage",
          "MTTR",
          "Process Improvement"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Chỉ đếm tổng số lượng bug mà không phân tích nguyên nhân và xu hướng chất lượng qua các chỉ số định lượng"
        ]
      },
      {
        "id": "QA-SCEN-01",
        "role": "QA Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại QA Engineer, khi Vague Requirements cùng Requirement Clarification, User Story Quality, Edge Case Discovery xuất hiện và kết quả kiểm thử thay đổi giữa các lần chạy, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong QA Engineer.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Vague Requirements",
          "Requirement Clarification",
          "User Story Quality",
          "Edge Case Discovery"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "QA-SCEN-02",
        "role": "QA Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Chỉ còn 2 tiếng trước giờ phát hành phiên bản mới lên Production theo kế hoạch của toàn công ty, em phát hiện một lỗi nghiêm trọng ở mức độ Blocker trong luồng đăng ký tài khoản mới. Tech Lead cho rằng lỗi này hiếm gặp và đề xuất cứ release rồi sửa sau trong bản vá. Em đưa ra quyết định và xử lý ra sao?",
        "evaluationCriteria": [
          "Giữ vững nguyên tắc chất lượng: bình tĩnh trình bày dữ liệu chứng minh lỗi (Steps to reproduce, tỷ lệ ảnh hưởng, rủi ro khách hàng mới không thể đăng ký dịch vụ)",
          "Đánh giá tác động kinh doanh: việc release sản phẩm lỗi đăng ký sẽ làm lãng phí toàn bộ ngân sách marketing và làm mất uy tín thương hiệu nghiêm trọng",
          "Khuyến nghị hoãn việc release hoặc đề xuất phương án tạm tắt tính năng liên quan bằng Feature Flag nếu khả thi; nếu ban lãnh đạo vẫn quyết định release, yêu cầu ghi nhận quyết định rủi ro bằng văn bản"
        ],
        "followUps": [
          "Làm thế nào để giao tiếp kiên quyết bảo vệ chất lượng mà không tạo cảm giác đối đầu gay gắt với Tech Lead?",
          "Quy trình kiểm thử khẩn cấp (Sanity test) sau khi nhận bản hotfix được tiến hành ra sao?"
        ],
        "tags": [
          "Release Go/No-Go Decision",
          "Blocker Defect",
          "Risk Management",
          "Ethical Courage"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Dễ dàng thỏa hiệp bỏ qua lỗi nghiêm trọng theo ý của Tech Lead để 'cho xong việc'"
        ]
      },
      {
        "id": "QA-SCEN-03",
        "role": "QA Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Lập trình viên từ chối một báo cáo lỗi của em với lý do 'Lỗi này trên máy của tôi không bị (Cannot Reproduce) / Not a Bug' và đóng bug trong Jira. Em phản hồi và làm việc lại với lập trình viên đó như thế nào để chứng minh sự tồn tại của lỗi?",
        "evaluationCriteria": [
          "Kiểm tra lại kỹ lưỡng môi trường kiểm thử: phiên bản code, dữ liệu mẫu trong DB, cấu hình cache trình duyệt, quyền của tài khoản test",
          "Mời lập trình viên sang trực tiếp máy của mình hoặc quay video màn hình chi tiết kèm Network log để chứng minh các bước tái hiện từng bước",
          "Nếu lỗi chỉ xảy ra trên môi trường Staging mà không bị trên máy Local của dev, cùng dev kiểm tra sự khác biệt về cấu hình server và dữ liệu"
        ],
        "followUps": [
          "Khi nào một lỗi không tái hiện được liên tục lại là dấu hiệu của lỗi Race Condition hoặc Network Lag?",
          "Làm thế nào để giữ thái độ hợp tác hòa nhã, không biến vấn đề kỹ thuật thành mâu thuẫn cá nhân?"
        ],
        "tags": [
          "Cannot Reproduce",
          "Conflict Resolution",
          "Bug Verification",
          "Dev-QA Collaboration"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tức giận mở lại bug liên tục (Reopen war) mà không cung cấp thêm bằng chứng hoặc trao đổi trực tiếp với dev"
        ]
      },
      {
        "id": "QA-SCEN-04",
        "role": "QA Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Sau khi một tính năng mới được phát hành lên Production, khách hàng phàn nàn rằng một tính năng cũ hoàn toàn không liên quan bị hỏng (Regression Bug). Quản lý hỏi tại sao đội ngũ QA không phát hiện ra lỗi này trước khi release. Em điều tra và trả lời như thế nào?",
        "evaluationCriteria": [
          "Thực hiện phân tích nguyên nhân gốc rễ (Root Cause Analysis): lỗi bắt nguồn từ đoạn code nào, tại sao thay đổi ở tính năng mới lại ảnh hưởng đến tính năng cũ (thiếu tính đóng gói, dùng chung state/DB)",
          "Rà soát lại phạm vi kiểm thử hồi quy (Regression Scope) của sprint đó: do thiếu test case, do đánh giá thấp phạm vi ảnh hưởng (Impact Analysis), hay do thiếu thời gian kiểm thử",
          "Đề xuất giải pháp khắc phục triệt để: bổ sung test case vào bộ Regression bắt buộc, tự động hóa test case đó và yêu cầu Dev làm Impact Analysis kỹ hơn trước khi merge code"
        ],
        "followUps": [
          "Làm thế nào để nhận trách nhiệm chuyên nghiệp mà không bị đẩy toàn bộ lỗi cho khâu QA?",
          "Quy trình Hotfix trên production cần tuân thủ những bước kiểm thử nào để không gây thêm lỗi mới?"
        ],
        "tags": [
          "Regression Defect Leakage",
          "Root Cause Analysis",
          "Impact Analysis",
          "Professional Accountability"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chối bỏ trách nhiệm và đổ lỗi hoàn toàn cho Dev viết code ẩu làm hỏng tính năng cũ"
        ]
      },
      {
        "id": "QA-SCEN-05",
        "role": "QA Engineer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Đội ngũ phát triển chuyển đổi từ mô hình phát hành 1 tháng/lần sang mô hình Triển khai liên tục (CI/CD - release nhiều lần mỗi tuần). Khâu kiểm thử thủ công truyền thống không thể bắt kịp tốc độ phát hành này. Em tái cơ cấu chiến lược kiểm thử (Testing Strategy) của nhóm QA như thế nào?",
        "evaluationCriteria": [
          "Chuyển dịch sang mô hình Shift-Left: kiểm thử sớm ngay từ khâu thiết kế User Story và kiểm thử tích hợp tự động trong pipeline",
          "Xây dựng bộ kiểm thử Smoke Test và Sanity Test tự động ngắn gọn (chạy dưới 10 phút) để làm Quality Gate cho mỗi lần deploy",
          "Phân loại rõ: tự động hóa toàn bộ các luồng lặp lại ổn định; dành nhân lực QA thủ công tập trung vào Kiểm thử khám phá (Exploratory Testing) và kiểm tra tính năng mới"
        ],
        "followUps": [
          "Làm thế nào để đào tạo và nâng cao kỹ năng kiểm thử tự động cho các bạn Manual QA trong nhóm?",
          "Chiến lược gắn thẻ tính năng (Feature Toggles / Flags) hỗ trợ việc phát hành liên tục an toàn ra sao?"
        ],
        "tags": [
          "Agile Transformation",
          "CI/CD Testing Strategy",
          "Test Automation Transition",
          "Shift-Left QA"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Yêu cầu đội ngũ phát triển phải dừng việc release liên tục và quay lại quy trình release chậm hàng tháng như cũ"
        ]
      },
      {
        "id": "QA-SCEN-06",
        "role": "QA Engineer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Ứng dụng chuẩn bị bước vào giai đoạn Nghiệm thu người dùng (User Acceptance Testing - UAT) với đối tác khách hàng khó tính. Khách hàng thường xuyên mở bug cho những tính năng không nằm trong hợp đồng phạm vi ban đầu. Em hỗ trợ Product Owner quản lý danh sách bug và kiểm soát phạm vi (Scope Creep) ra sao?",
        "evaluationCriteria": [
          "Đối chiếu từng phản hồi của khách hàng với tài liệu phạm vi yêu cầu (BRD / Scope of Work) đã được hai bên ký kết ban đầu",
          "Phân loại rõ ràng thành 2 nhóm: Nhóm 1 là Lỗi thực tế (Defects) không đúng với cam kết -> ưu tiên fix; Nhóm 2 là Yêu cầu thay đổi / Tính năng mới (Change Requests - CR) -> bàn giao cho PO đàm phán chi phí và thời gian",
          "Tổ chức buổi họp nghiệm thu định kỳ hàng tuần, cập nhật minh bạch bảng tiến độ UAT và danh sách các hạng mục đã được nghiệm thu (Sign-off)"
        ],
        "followUps": [
          "Làm thế nào để từ chối các yêu cầu phát sinh của khách hàng một cách khéo léo giữ gìn mối quan hệ hợp tác?",
          "Tiêu chí để tuyên bố kết thúc giai đoạn UAT thành công (UAT Sign-off Criteria) là gì?"
        ],
        "tags": [
          "UAT Management",
          "Scope Creep",
          "Change Request vs Defect",
          "Customer Communication"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhận toàn bộ các yêu cầu mới vào danh sách bug và ép dev phải sửa hết mà không báo cáo cho PO"
        ]
      },
      {
        "id": "QA-CV-01",
        "role": "QA Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong dự án lớn nhất trên CV của em: Kế hoạch kiểm thử (Test Plan) do em trực tiếp xây dựng gồm những nội dung chính nào? Em đã xác định mục tiêu chất lượng và chiến lược giảm thiểu rủi ro (Risk-based Testing) ra sao?",
        "evaluationCriteria": [
          "Mô tả các mục cốt lõi của Test Plan theo chuẩn IEEE 829: Mục tiêu, Phạm vi kiểm thử (In-scope / Out-of-scope), Môi trường kiểm thử, Chiến lược kiểm thử, Lịch trình, Nhân sự, Tiêu chí bắt đầu và kết thúc (Entry/Exit Criteria)",
          "Phân tích ma trận rủi ro: xác định các module có rủi ro kinh doanh cao nhất (thanh toán, bảo mật) để phân bổ 70% nguồn lực kiểm thử",
          "Kết quả thực tế: tỷ lệ lỗi lọt sang giai đoạn sau được kiểm soát dưới ngưỡng mục tiêu"
        ],
        "followUps": [
          "Nếu thời gian dành cho kiểm thử bị cắt giảm một nửa so với kế hoạch ban đầu, em ưu tiên cắt bớt phần kiểm thử nào?",
          "Bài học quan trọng nhất về việc lập kế hoạch kiểm thử mà em đúc kết được là gì?"
        ],
        "tags": [
          "Test Plan",
          "Risk-based Testing",
          "IEEE 829",
          "Quality Strategy",
          "CV Deep Dive"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Nói chung chung là 'viết test case rồi test' mà không biết cấu trúc và mục đích của một bản Test Plan chuyên nghiệp"
        ]
      },
      {
        "id": "QA-CV-02",
        "role": "QA Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trên CV em có nêu kinh nghiệm kiểm thử ứng dụng di động (Mobile App Testing). Hãy chia sẻ những điểm khác biệt đặc thù mà em luôn phải kiểm tra trên Mobile mà ứng dụng Web không có (gián đoạn cuộc gọi, mất mạng, xoay màn hình, quyền truy cập)?",
        "evaluationCriteria": [
          "Kiểm tra gián đoạn (Interruption Testing): cuộc gọi đến, tin nhắn SMS, báo thức, thông báo ứng dụng khác xen ngang",
          "Kiểm tra điều kiện mạng: chuyển đổi giữa Wi-Fi sang 4G, mạng chập chờn (Network Throttling), chế độ máy bay (Airplane mode)",
          "Kiểm tra phần cứng và hệ thống: xoay màn hình, cấp/thu hồi quyền (Camera, Location) trong cài đặt máy, mức độ hao pin và nóng máy"
        ],
        "followUps": [
          "Cách em thu thập log lỗi từ thiết bị di động thật bằng Xcode Organizer hoặc Android logcat?",
          "Sự khác biệt khi kiểm thử trên máy ảo (Simulator/Emulator) so với thiết bị thật (Real Device)?"
        ],
        "tags": [
          "Mobile Testing",
          "Interruption Testing",
          "Network Throttling",
          "Real Device Testing",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ kiểm thử mobile app trên giao diện responsive của trình duyệt web trên máy tính"
        ]
      },
      {
        "id": "QA-CV-03",
        "role": "QA Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi nhận kinh nghiệm kiểm thử API chuyên sâu trên CV. Hãy dẫn chứng một trường hợp cụ thể em phát hiện ra lỗi logic nghiêm trọng ở tầng API mà nếu chỉ test trên giao diện (UI) thì hoàn toàn không thể phát hiện được?",
        "evaluationCriteria": [
          "Ví dụ thực tế: lỗ hổng IDOR (thay đổi `order_id` trên payload để xem thông tin người khác), lỗi truyền giá trị âm để gian lận số tiền, hoặc lỗi thiếu validation khi gửi chuỗi rỗng",
          "Giải thích tại sao UI validation bị bỏ qua (kẻ xấu dùng Postman/Burp Suite gọi trực tiếp vào endpoint backend)",
          "Hành động khắc phục: phối hợp với backend để bổ sung validation tầng máy chủ và cập nhật bộ test tự động"
        ],
        "followUps": [
          "Làm thế nào để kiểm thử tính toàn vẹn của mã hóa dữ liệu nhạy cảm truyền qua API?",
          "Quy trình kiểm thử hồi quy API khi backend cập nhật phiên bản mới?"
        ],
        "tags": [
          "API Testing Experience",
          "Business Logic Flaw",
          "Backend Validation",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không đưa ra được ví dụ cụ thể nào hoặc chỉ kiểm thử API bằng cách nhìn giao diện người dùng"
        ]
      },
      {
        "id": "QA-CV-04",
        "role": "QA Engineer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Em hãy kể về một lỗi ẩn sâu (Edge-case Bug) tinh vi nhất mà em từng phát hiện được trong quá trình làm việc khiến toàn bộ đội ngũ lập trình viên đều bất ngờ và khen ngợi sự tỉ mỉ của em?",
        "evaluationCriteria": [
          "Trình bày cụ thể bối cảnh: kịch bản chuỗi hành động phức tạp (Concurrency, múi giờ đặc thù, năm nhuận, ký tự Unicode đặc biệt)",
          "Tư duy phát hiện: lý do em quyết định thử kịch bản đó (dựa trên sự tò mò kỹ thuật và phán đoán rủi ro)",
          "Tác động ngăn ngừa: nếu lỗi này lọt lên production thì sẽ gây ra tổn thất dữ liệu hoặc thiệt hại tài chính nghiêm trọng như thế nào"
        ],
        "followUps": [
          "Làm thế nào để rèn luyện tư duy tìm kiếm các trường hợp biên góc khuất (Edge-case mindset)?",
          "Em đã tài liệu hóa kịch bản lỗi đó thành tài nguyên học tập cho cả nhóm ra sao?"
        ],
        "tags": [
          "Complex Bug Discovery",
          "Edge Case",
          "Attention to Detail",
          "Critical Thinking",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kể về một lỗi hiển thị giao diện cơ bản (sai màu sắc, lệch chữ) thay vì một lỗi logic chuyên sâu"
        ]
      },
      {
        "id": "QA-CV-05",
        "role": "QA Engineer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong dự án áp dụng hệ thống quản lý lỗi Jira trên CV, em đã tùy biến quy trình vòng đời lỗi (Bug Life Cycle Workflow) và các trường thông tin ra sao để tối ưu hóa việc phân tích nguyên nhân lỗi (Root Cause Analysis)?",
        "evaluationCriteria": [
          "Thiết kế các trạng thái rõ ràng: New -> Assigned -> In Progress -> Ready for Retest -> Retest Passed (Closed) / Retest Failed (Reopened)",
          "Bổ sung các trường phân tích: Root Cause Category (Coding error, Requirement ambiguity, Design flaw), Phase Detected, Module",
          "Định kỳ xuất báo cáo biểu đồ Pareto phân tích 20% nguyên nhân gây ra 80% số lỗi để giúp team Dev cải tiến chất lượng viết mã"
        ],
        "followUps": [
          "Làm thế nào để tránh tình trạng 'Reopened Loop' khi một bug bị mở lại nhiều lần?",
          "Quy trình xác nhận một bug đã được sửa xong (Bug Verification Protocol) gồm những bước nào?"
        ],
        "tags": [
          "Jira Workflow",
          "Bug Lifecycle",
          "Root Cause Tagging",
          "Pareto Analysis",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ sử dụng workflow mặc định của Jira mà không hiểu cách khai thác dữ liệu bug để cải tiến quy trình"
        ]
      },
      {
        "id": "QA-BEHAV-01",
        "role": "QA Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Đôi khi lập trình viên có tâm lý phòng thủ và khó chịu khi bị QA bắt nhiều lỗi, cho rằng QA đang 'bới lông tìm vết'. Em xây dựng mối quan hệ làm việc thân thiện, tin cậy và tôn trọng lẫn nhau với các bạn Developers như thế nào?",
        "evaluationCriteria": [
          "Tâm thế đồng hành: cùng chung mục tiêu tạo ra sản phẩm hoàn hảo phục vụ người dùng, không phải 'QA đối đầu với Dev'",
          "Giao tiếp tinh tế: nhận xét về sản phẩm và mã nguồn chứ không bao giờ chỉ trích năng lực cá nhân; khen ngợi khi dev viết code tốt và sửa lỗi nhanh",
          "Viết bug report rõ ràng, dễ tái hiện, đính kèm đầy đủ log để tiết kiệm tối đa thời gian điều tra của lập trình viên"
        ],
        "followUps": [
          "Em làm gì khi một Developer tỏ thái độ cáu gắt trực tiếp với em trong phòng làm việc?",
          "Làm thế nào để tạo dựng văn hóa cùng nhau ăn mừng khi sản phẩm release thành công không có lỗi?"
        ],
        "tags": [
          "Dev-QA Relationship",
          "Empathy",
          "Constructive Communication",
          "Trust Building"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Giữ thái độ hách dịch xem việc bắt lỗi như một thành tích để chê bai đồng nghiệp"
        ]
      },
      {
        "id": "QA-BEHAV-02",
        "role": "QA Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi một tính năng mới được giao sang cho em kiểm thử muộn hơn 3 ngày so với kế hoạch ban đầu, nhưng thời hạn release của Sprint vẫn giữ nguyên không đổi. Em quản lý thời gian và trao đổi với Scrum Master ra sao?",
        "evaluationCriteria": [
          "Minh bạch hóa rủi ro ngay lập tức trong buổi Daily Scrum: thời gian kiểm thử bị rút ngắn đồng nghĩa với việc rủi ro lỗi lọt lên production tăng cao",
          "Áp dụng chiến lược kiểm thử dựa trên rủi ro (Risk-based Testing): ưu tiên kiểm thử toàn diện các luồng chính và rủi ro cao trước; các luồng phụ kiểm thử sau",
          "Đàm phán với Scrum Master và PO: hoặc dời lịch release 1-2 ngày, hoặc chấp nhận release phạm vi MVP đã được test kỹ"
        ],
        "followUps": [
          "Tại sao việc âm thầm làm thêm giờ thâu đêm để test vội vàng lại thường dẫn đến việc bỏ sót lỗi nghiêm trọng?",
          "Làm thế nào để cải tiến quy trình ước lượng (Estimation) cho các sprint tiếp theo?"
        ],
        "tags": [
          "Time Pressure",
          "Agile Negotiation",
          "Risk-based Prioritization",
          "Transparency"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Im lặng chấp nhận ép tiến độ rồi bấm nút xác nhận qua loa mà không test kỹ lưỡng"
        ]
      },
      {
        "id": "QA-BEHAV-03",
        "role": "QA Engineer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Khi em vô tình bỏ sót một lỗi nghiêm trọng lọt lên môi trường Production và bị khách hàng phát hiện, phản ứng và hành động đầu tiên của em là gì?",
        "evaluationCriteria": [
          "Dũng cảm đối diện và nhận trách nhiệm cá nhân, không tìm cách chối quanh hay đổ lỗi cho người khác",
          "Tập trung ngay lập tức vào việc hỗ trợ tái hiện lỗi, ghi chép log chi tiết để giúp đội ngũ kỹ thuật ra bản hotfix nhanh nhất",
          "Sau khi sự cố được khắc phục: tự giác phân tích nguyên nhân vì sao mình bỏ sót (thiếu test case, thiếu thiết bị test) và bổ sung ngay vào checklist kiểm thử"
        ],
        "followUps": [
          "Làm thế nào để lấy lại sự tự tin và uy tín chuyên môn sau một sự cố đáng tiếc?",
          "Bài học quan trọng nhất về việc không bao giờ chủ quan trong kiểm thử là gì?"
        ],
        "tags": [
          "Accountability",
          "Integrity",
          "Learning from Mistakes",
          "Incident Handling"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tìm cách giấu giếm hoặc đổ lỗi cho Tester khác hay đổ lỗi do tài liệu không ghi"
        ]
      },
      {
        "id": "QA-BEHAV-04",
        "role": "QA Engineer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Khi Product Owner và Ban Giám đốc có xu hướng xem nhẹ vai trò của kiểm thử, coi QA như một bộ phận 'chi phí tốn kém làm chậm tốc độ release', em chứng minh giá trị kinh doanh (Business Value) của QA ra sao?",
        "evaluationCriteria": [
          "Trình bày bằng ngôn ngữ kinh tế và số liệu kinh doanh: chi phí sửa lỗi trên production đắt gấp 30-100 lần so với lúc phát hiện ở khâu QA",
          "Dẫn chứng các tổn thất tiềm tàng: tỷ lệ người dùng gỡ app vì lỗi, tổn thất doanh thu nếu cổng thanh toán bị gián đoạn, chi phí đền bù hợp đồng",
          "Minh họa chất lượng như một lợi thế cạnh tranh cốt lõi giúp giữ chân khách hàng và bảo vệ uy tín thương hiệu công ty"
        ],
        "followUps": [
          "Làm thế nào để tính toán chỉ số Lợi tức đầu tư của kiểm thử (Return on Investment - ROI of QA)?",
          "Cách thúc đẩy toàn bộ tổ chức cùng chia sẻ trách nhiệm về chất lượng (Whole Team Quality)?"
        ],
        "tags": [
          "QA Value Proposition",
          "Business Impact",
          "ROI of Quality",
          "Executive Advocacy"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bất mãn tiêu cực và làm việc với thái độ đối phó khi không được công nhận"
        ]
      },
      {
        "id": "QA-BEHAV-05",
        "role": "QA Engineer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi hướng dẫn và đào tạo một bạn Fresher QA mới gia nhập nhóm còn thiếu kinh nghiệm và thường viết test case còn sơ sài, em đồng hành và giúp bạn ấy nâng cao kỹ năng nghề nghiệp như thế nào?",
        "evaluationCriteria": [
          "Dành thời gian Review Test Case chi tiết cho bạn: giải thích lý do tại sao cần bổ sung các trường hợp biên, luồng phụ và dữ liệu âm bản",
          "Tổ chức các buổi thực hành pair-testing (cùng nhau kiểm thử một màn hình thực tế) để truyền đạt tư duy đặt câu hỏi và cách đào sâu lỗi",
          "Khuyến khích bạn tìm hiểu thêm tài liệu chuẩn mực (ISTQB, Mindmaps) và động viên khi bạn phát hiện được những bug hay"
        ],
        "followUps": [
          "Làm thế nào để góp ý mang tính khích lệ mà không làm bạn mới cảm thấy tự ti hoặc áp lực?",
          "Cách đo lường sự tiến bộ của một thành viên mới sau 2 tháng thử việc?"
        ],
        "tags": [
          "Mentorship",
          "Coaching",
          "Knowledge Sharing",
          "Team Development"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chê bai bạn mới thiếu năng lực hoặc tự mình làm hết mọi việc thay vì hướng dẫn bạn tự làm"
        ]
      }
    ]
  },
  {
    "role": "Automation Tester (Selenium/Playwright)",
    "group": "testingQA",
    "groupLabel": "Kiểm thử & Chất lượng",
    "aliases": [
      "automation tester",
      "automation test engineer",
      "selenium tester",
      "playwright tester",
      "kiem thu tu dong",
      "automation qa"
    ],
    "questions": [
      {
        "id": "AUTO_TEST-FOUND-01",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong Automation Tester (Selenium/Playwright), phân biệt Playwright, Selenium, WebDriver, Architecture; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Playwright.",
          "Phân biệt được các khái niệm liên quan Selenium, WebDriver, Architecture ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí Automation Tester (Selenium/Playwright)."
        ],
        "followUps": [
          "Nếu mới học Playwright, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Playwright",
          "Selenium",
          "WebDriver",
          "Architecture",
          "CDP"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "https://www.selenium.dev/documentation/"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "AUTO_TEST-FOUND-02",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Thiết kế mô hình Page Object Model (POM) và Component Object Model trong kiểm thử tự động: Tại sao POM giúp giảm thiểu chi phí bảo trì test script khi giao diện người dùng (UI) thay đổi?",
        "evaluationCriteria": [
          "POM đóng gói cấu trúc định vị phần tử (Locators) và các hành vi tương tác của trang vào một Class độc lập",
          "Tách rời hoàn toàn mã kiểm thử (Test Scripts & Assertions) khỏi mã giao diện (UI Locators)",
          "Khi giao diện đổi cấu trúc HTML, chỉ cần cập nhật selector tại duy nhất một nơi trong Page Object class mà không phải sửa hàng chục file test"
        ],
        "followUps": [
          "Sự khác biệt giữa Page Object Model và Screenplay Pattern trong kiểm thử tự động là gì?",
          "Làm thế nào để tránh việc biến Page Object thành 'God Class' chứa hàng trăm phương thức lộn xộn?"
        ],
        "tags": [
          "Page Object Model",
          "POM",
          "Test Architecture",
          "Maintainability"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Hardcode selector trực tiếp trong các câu lệnh test lặp đi lặp lại khắp mọi file"
        ]
      },
      {
        "id": "AUTO_TEST-FOUND-03",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Nguyên nhân gốc rễ và chiến lược loại bỏ hiện tượng 'Kiểm thử không ổn định' (Flaky Tests - lúc pass lúc fail): Tại sao việc lạm dụng lệnh chờ cứng (`Thread.sleep()`) lại là giải pháp tồi tệ nhất?",
        "evaluationCriteria": [
          "Flaky tests thường do: bất đồng bộ mạng (AJAX/Fetch chưa xong), hiệu ứng animation đang chạy, phần tử bị che khuất, hoặc phụ thuộc dữ liệu chung",
          "`Thread.sleep()` làm chậm toàn bộ test suite một cách vô ích và vẫn có thể fail nếu mạng đột ngột chậm hơn thời gian sleep",
          "Giải pháp chuẩn: sử dụng Auto-waiting dựa trên trạng thái (Actionability checks: visible, enabled, stable) và cơ chế Polling Assertions (`expect().toPass()`)"
        ],
        "followUps": [
          "Làm thế nào để đo lường tỷ lệ Flaky Test Rate của toàn bộ test suite trên CI/CD dashboard?",
          "Cơ chế Test Retry tự động có nên được bật vô tội vạ để che giấu flaky tests không?"
        ],
        "tags": [
          "Flaky Tests",
          "Auto-waiting",
          "Thread.sleep Anti-pattern",
          "Test Stability"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Khuyên chèn `Thread.sleep(5000)` vào mọi bước test để giải quyết lỗi không tìm thấy phần tử"
        ]
      },
      {
        "id": "AUTO_TEST-FOUND-04",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Chiến lược lựa chọn bộ định vị phần tử (Locators Strategy): So sánh mức độ tin cậy và độ bền vững giữa ID, Data Attributes (`data-testid`), XPath, CSS Selector, và User-facing Locators (getByRole, getByText)?",
        "evaluationCriteria": [
          "User-facing locators (`getByRole`, `getByLabel`) và `data-testid` có độ bền vững cao nhất, không bị ảnh hưởng khi đổi cấu trúc CSS layout",
          "XPath tuyệt đối (`/html/body/div[2]/div[1]/button`) cực kỳ mỏng manh, sẽ hỏng ngay khi có một thay đổi nhỏ về DOM",
          "CSS selector theo class trang trí (`.btn-primary-v2`) dễ bị phá vỡ khi designer cập nhật lại stylesheet"
        ],
        "followUps": [
          "Khi nào việc sử dụng XPath tương đối (`//button[contains(text(), ...)]`) vẫn là lựa chọn bắt buộc?",
          "Làm thế nào để thuyết phục đội Frontend cam kết gắn `data-testid` chuẩn cho các phần tử quan trọng?"
        ],
        "tags": [
          "Locators Strategy",
          "data-testid",
          "getByRole",
          "XPath",
          "CSS Selector"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Lấy toàn bộ selector bằng cách click chuột phải 'Copy Full XPath' từ Chrome DevTools"
        ]
      },
      {
        "id": "AUTO_TEST-FOUND-05",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Cơ chế quản lý trạng thái lưu trữ và phiên đăng nhập (Storage State / Cookies / Session Storage) trong Playwright: Làm thế nào để đăng nhập một lần duy nhất và tái sử dụng phiên cho hàng trăm bài test tiếp theo?",
        "evaluationCriteria": [
          "Thực hiện đăng nhập trong bước Global Setup, lưu toàn bộ cookies và localStorage vào tệp `auth.json`",
          "Các bài test sau chỉ cần nạp `storageState: 'auth.json'` vào Browser Context để khởi động trực tiếp ở trạng thái đã đăng nhập",
          "Tiết kiệm 80-90% tổng thời gian chạy test suite vì không phải gõ username/password lại ở mỗi ca test"
        ],
        "followUps": [
          "Làm thế nào để xử lý kiểm thử đồng thời nhiều vai trò người dùng (Admin và User) trong cùng một kịch bản test?",
          "Cách xử lý khi token đăng nhập lưu trong storageState bị hết hạn giữa chừng?"
        ],
        "tags": [
          "Storage State",
          "Authentication Sharing",
          "Execution Speed",
          "Session Reuse"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Bắt mọi test case đều phải mở trang đăng nhập và gõ lại mật khẩu từ đầu"
        ]
      },
      {
        "id": "AUTO_TEST-FOUND-06",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Kim tự tháp kiểm thử tự động (Test Automation Pyramid): Tỷ lệ phân bổ lý tưởng giữa Unit Test, API/Integration Test, và UI E2E Test là gì? Tại sao các tổ chức cố gắng tự động hóa 100% bằng UI test thường thất bại (mô hình Ice-cream Cone)?",
        "evaluationCriteria": [
          "Tỷ lệ lý tưởng: 70% Unit Test (nhanh, rẻ, cô lập), 20% API/Integration Test (ổn định, bao quát luồng dữ liệu), 10% UI E2E Test (kiểm tra luồng cốt lõi)",
          "Mô hình ngược Ice-cream Cone: quá nhiều UI test dẫn đến thời gian chạy hàng giờ, chi phí bảo trì khổng lồ, và liên tục bị fail ảo",
          "Nguyên tắc: Đẩy việc kiểm thử xuống tầng thấp nhất có thể; chỉ dùng UI test cho các luồng hành trình người dùng thực sự quan trọng"
        ],
        "followUps": [
          "Làm thế nào để chuyển đổi các ca test validation logic từ tầng UI xuống tầng API testing?",
          "Chi phí ROI của việc duy trì một bộ test UI tự động được tính toán dựa trên các thông số nào?"
        ],
        "tags": [
          "Test Automation Pyramid",
          "Ice-cream Cone Anti-pattern",
          "ROI of Automation",
          "Testing Strategy"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Cho rằng mục tiêu của Automation Tester là phải tự động hóa 100% mọi thứ bằng giao diện UI"
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-01",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Framework Architecture (Playwright Fixtures, Clean Code, Custom Runners) cho Automation Tester (Selenium/Playwright): em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Framework Architecture trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Framework Architecture",
          "Playwright Fixtures",
          "Clean Code",
          "Custom Runners"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-02",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập Automation Tester (Selenium/Playwright): dựa trên iFrames, phối hợp Shadow DOM, Multiple Tabs, File Upload, Complex UI; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng iFrames trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "iFrames",
          "Shadow DOM",
          "Multiple Tabs",
          "File Upload",
          "Complex UI"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-03",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Chặn và giả lập lưu lượng mạng (Network Mocking & Interception) trong kiểm thử tự động: Em sử dụng phương thức `page.route()` của Playwright để mock phản hồi API, giả lập lỗi 500, hoặc làm chậm mạng (Network Throttling) ra sao?",
        "evaluationCriteria": [
          "Sử dụng `page.route('**/api/v1/orders', route => route.fulfill({ status: 500 }))` để kiểm tra khả năng hiển thị thông báo lỗi của UI mà không cần can thiệp server thật",
          "Mock các dữ liệu trả về phức tạp để kiểm thử các trạng thái giao diện hiếm gặp (tài khoản VIP, giỏ hàng có 100 món)",
          "Hủy bỏ việc tải các tài nguyên nặng không cần thiết (Google Analytics, font chữ, banner ngoài) để tăng tốc độ chạy test lên 50%"
        ],
        "followUps": [
          "Khi nào việc lạm dụng Mock API làm mất đi giá trị của bài test E2E thực sự?",
          "Làm thế nào để ghi lại (HAR recording) và phát lại lưu lượng mạng cho các bài test ngoại tuyến?"
        ],
        "tags": [
          "Network Interception",
          "API Mocking",
          "HAR Recording",
          "Negative Testing"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Chỉ biết test với dữ liệu thật của backend mà không biết cách mock API để kiểm thử các kịch bản lỗi"
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-04",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tối ưu hóa thời gian thực thi: Em thiết lập chạy kiểm thử song song (Parallel Execution) trên nhiều Workers trong Playwright hoặc Selenium Grid/Docker như thế nào? Cách giải quyết xung đột dữ liệu dùng chung (Data Collisions)?",
        "evaluationCriteria": [
          "Cấu hình số lượng Workers tối ưu dựa trên số lõi CPU của máy chạy test (vd: `workers: 4`)",
          "Đảm bảo tính độc lập tuyệt đối giữa các test case (No Shared State): mỗi test case tự sinh tài khoản hoặc dữ liệu mẫu ngẫu nhiên (Faker.js)",
          "Sử dụng tag (`@smoke`, `@regression`) để phân chia các bộ test chạy theo lịch trình khác nhau trong CI"
        ],
        "followUps": [
          "Tại sao việc nhiều bài test cùng đăng nhập vào 1 tài khoản test duy nhất sẽ làm hỏng hoàn toàn việc chạy song song?",
          "Cách cấu hình Docker shm-size (`/dev/shm`) để tránh crash trình duyệt Chrome khi chạy song song?"
        ],
        "tags": [
          "Parallel Execution",
          "Workers Optimization",
          "Selenium Grid",
          "Data Isolation"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Viết các test case có thứ tự phụ thuộc lẫn nhau (Test B chỉ chạy được nếu Test A chạy pass)"
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-05",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tích hợp Automation Test vào CI/CD Pipeline (GitHub Actions / GitLab CI): Em cấu hình workflow tự động kích hoạt test khi có Pull Request mới, lưu trữ Video/Trace/Screenshot khi test fail, và xuất bản báo cáo HTML ra sao?",
        "evaluationCriteria": [
          "Viết file cấu hình `.github/workflows/test.yml` cài đặt môi trường Node, cache dependencies và cài đặt browser binaries",
          "Cấu hình lưu trữ Artifacts (`actions/upload-artifact`) để tự động upload thư mục báo cáo khi có bước test bị fail",
          "Tích hợp Playwright Trace Viewer (`trace: 'on-first-retry'`) cho phép xem lại từng frame video và log mạng của lần chạy bị lỗi"
        ],
        "followUps": [
          "Làm thế nào để gửi thông báo tóm tắt kết quả kiểm thử (Slack / Telegram Webhook) sau khi pipeline hoàn tất?",
          "Cách thiết lập cơ chế chạy thử nghiệm (Canary run) trước khi merge code vào nhánh main?"
        ],
        "tags": [
          "CI/CD Integration",
          "GitHub Actions",
          "Trace Viewer",
          "Artifacts",
          "Allure Report"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Chỉ biết chạy test trên máy tính cá nhân bằng lệnh npm test mà không biết cách đưa vào CI/CD"
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-06",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Kiểm thử hồi quy thị giác (Visual Regression Testing): Em thiết lập kiểm thử so sánh ảnh chụp màn hình tự động (`toHaveScreenshot()`) trong Playwright như thế nào? Cách xử lý các yếu tố động (giờ hệ thống, ảnh quảng cáo, avatar động) để tránh so sánh sai lệch (False Failures)?",
        "evaluationCriteria": [
          "Sử dụng lệnh `expect(page).toHaveScreenshot('landing.png')` để so sánh với ảnh chuẩn (Golden Baseline)",
          "Che mờ hoặc ẩn các phần tử động bằng tùy chọn `mask: [locator]` (đồng hồ thời gian, banner quảng cáo, dữ liệu ngẫu nhiên)",
          "Điều chỉnh ngưỡng dung sai (threshold / pixel ratio) để bỏ qua các sai lệch siêu nhỏ do render font chữ trên các hệ điều hành khác nhau"
        ],
        "followUps": [
          "Tại sao việc chạy Visual Test trên máy Mac của dev lại ra kết quả khác với khi chạy trên máy chủ Linux trong CI?",
          "Làm thế nào để cập nhật hàng loạt ảnh baseline (`--update-snapshots`) khi có sự thay đổi thiết kế giao diện chính thức?"
        ],
        "tags": [
          "Visual Regression",
          "Screenshot Testing",
          "Pixel Comparison",
          "Masking Dynamic Content"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "So sánh ảnh toàn màn hình có chứa cả đồng hồ đếm ngược dẫn đến việc test bị fail 100% mọi lần chạy"
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-07",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Kiểm thử hiệu năng trang web và khả năng tiếp cận (Accessibility Testing) tự động: Cách tích hợp thư viện `@axe-core/playwright` và thu thập các chỉ số Web Vitals trực tiếp trong kịch bản kiểm thử tự động?",
        "evaluationCriteria": [
          "Tích hợp AxeBuilder để tự động quét toàn bộ cây DOM tìm các vi phạm chuẩn WCAG 2.1 (độ tương phản màu sắc, thiếu thẻ alt, thiếu nhãn form)",
          "Sử dụng Chrome DevTools Protocol để trích xuất các chỉ số hiệu năng (LCP, CLS, TTFB) sau khi trang tải xong",
          "Thiết lập quy tắc gãy build (Assertion failure) nếu phát hiện bất kỳ lỗi accessibility nào ở mức độ Critical"
        ],
        "followUps": [
          "Làm thế nào để tạo báo cáo vi phạm accessibility chi tiết xuất ra định dạng JSON/HTML?",
          "Cách bỏ qua (Exclude) tạm thời một số lỗi a11y của thư viện ngoài trong khi chờ nhà cung cấp sửa chữa?"
        ],
        "tags": [
          "Axe-core",
          "Accessibility Automation",
          "Web Vitals",
          "Automated Audit"
        ],
        "sourceRefs": [
          "https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright"
        ],
        "redFlags": [
          "Chỉ kiểm tra tính năng chức năng (Functional) mà bỏ qua hoàn toàn việc kiểm thử tự động các tiêu chuẩn accessibility"
        ]
      },
      {
        "id": "AUTO_TEST-SKILL-08",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Quản lý dữ liệu kiểm thử động (Dynamic Test Data Generation): Em sử dụng thư viện Faker.js kết hợp trực tiếp gọi API Backend để chuẩn bị trạng thái dữ liệu (Pre-condition setup) trước khi chạy UI test ra sao?",
        "evaluationCriteria": [
          "Không dùng UI để chuẩn bị dữ liệu: gọi thẳng API Backend (sử dụng Playwright `request` context) để tạo nhanh tài khoản, nạp tiền và tạo đơn hàng trong 100ms",
          "Dùng Faker.js sinh dữ liệu ngẫu nhiên hợp lệ (email, số điện thoại, tên tuổi) đảm bảo tính duy nhất cho mỗi bài test",
          "Tự động dọn dẹp (Teardown) dữ liệu sau khi test xong bằng API DELETE hoặc khôi phục snapshot database"
        ],
        "followUps": [
          "Tại sao việc chuẩn bị dữ liệu qua API lại giúp bộ test E2E chạy nhanh hơn gấp 5 lần so với làm qua giao diện UI?",
          "Chiến lược quản lý dữ liệu kiểm thử phân tán khi nhiều môi trường test dùng chung 1 database?"
        ],
        "tags": [
          "Test Data Management",
          "Faker.js",
          "API Preconditions",
          "Speed Optimization"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Dùng UI để click chuột qua 15 bước chỉ để tạo một dữ liệu mẫu phục vụ cho việc kiểm thử tính năng khác"
        ]
      },
      {
        "id": "AUTO_TEST-SCEN-01",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại Automation Tester (Selenium/Playwright), khi Execution Time Optimization cùng Sharding, Parallelism, CI Bottleneck xuất hiện và kết quả kiểm thử thay đổi giữa các lần chạy, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong Automation Tester (Selenium/Playwright).",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Execution Time Optimization",
          "Sharding",
          "Parallelism",
          "CI Bottleneck"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "AUTO_TEST-SCEN-02",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Một bài test kiểm thử luồng thanh toán giỏ hàng chạy trên máy tính cá nhân (Local) luôn thành công 100%, nhưng khi chạy trên máy chủ CI (Headless Linux Docker) thì bị fail ngẫu nhiên 40% các lần chạy. Em điều tra và khắc phục sự cố môi trường này thế nào?",
        "evaluationCriteria": [
          "Bật chế độ chụp Video và Trace Viewer của Playwright trên CI để xem lại chính xác những gì đã xảy ra tại thời điểm fail",
          "Kiểm tra sự khác biệt về kích thước màn hình mặc định (Viewport): môi trường Headless thường có resolution nhỏ làm ẩn nút bấm vào menu burger",
          "Kiểm tra sự khác biệt về múi giờ (Timezone UTC vs Local), ngôn ngữ hệ thống, và tốc độ mạng trên máy chủ CI"
        ],
        "followUps": [
          "Làm thế nào để đồng bộ kích thước Viewport cố định (`viewport: { width: 1920, height: 1080 }`) trong cấu hình framework?",
          "Cách debug trực tiếp trên môi trường Docker bằng giao diện đồ họa (VNC viewer) khi cần thiết?"
        ],
        "tags": [
          "Headless Debugging",
          "CI Failure",
          "Trace Viewer",
          "Viewport Difference"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đoán mò và liên tục commit mã thử nghiệm lên git để 'cầu may' cho pipeline chạy pass"
        ]
      },
      {
        "id": "AUTO_TEST-SCEN-03",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Đội ngũ Frontend thay đổi toàn bộ thư viện UI component từ Bootstrap sang Tailwind CSS và đổi cấu trúc DOM, khiến 70% bộ test tự động của em bị báo lỗi 'Element not found' đồng loạt. Em xử lý khủng hoảng này ra sao và phòng ngừa cho tương lai?",
        "evaluationCriteria": [
          "Tập trung sửa chữa các lớp Page Object tương ứng thay vì sửa từng file test (nếu đã áp dụng POM chuẩn thì chỉ cần sửa tại 1 nơi duy nhất)",
          "Làm việc với đội Frontend để thống nhất gắn các thuộc tính `data-testid` hoặc `aria-label` bất biến, độc lập với class CSS của Tailwind",
          "Cập nhật các locator sang dạng hướng tới người dùng (User-facing locators như `getByRole('button', { name: 'Thanh toán' })`) để không bao giờ bị phụ thuộc vào class CSS nữa"
        ],
        "followUps": [
          "Tại sao việc sử dụng CSS class làm locator trong dự án dùng Tailwind CSS là một sai lầm chết người?",
          "Quy trình phối hợp giữa Frontend và QA khi có đợt tái cấu trúc giao diện lớn (UI Revamp) là gì?"
        ],
        "tags": [
          "UI Revamp",
          "Broken Locators",
          "Tailwind CSS",
          "data-testid Governance"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đi sửa thủ công hàng trăm file test bằng cách paste lại các class mới của Tailwind vào"
        ]
      },
      {
        "id": "AUTO_TEST-SCEN-04",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Ứng dụng tích hợp tính năng xác thực hai yếu tố (2FA / OTP qua Email hoặc SMS) khi đăng nhập. Kịch bản kiểm thử tự động E2E bị chặn lại ở bước nhập mã OTP 6 số. Em giải quyết bài toán tự động hóa luồng 2FA này như thế nào?",
        "evaluationCriteria": [
          "Giải pháp 1 (TOTP): Sử dụng thuật toán Time-based One-Time Password với thư viện `otplib` bằng Secret Key dùng chung để tự sinh mã 6 số hợp lệ trong code test",
          "Giải pháp 2 (Email Mock/API): Sử dụng dịch vụ Mailosaur hoặc Mailpit để đọc mã OTP tự động từ hộp thư test qua API",
          "Giải pháp 3 (Bypass in Test): Thống nhất với Backend cung cấp tài khoản test chuyên dụng có mã OTP cố định hoặc header bí mật trên môi trường Staging"
        ],
        "followUps": [
          "Tại sao không bao giờ nên dùng số điện thoại thật để nhận SMS OTP trong kiểm thử tự động?",
          "Làm thế nào để đảm bảo cơ chế bypass trên Staging tuyệt đối không bị lọt lên môi trường Production?"
        ],
        "tags": [
          "2FA Automation",
          "OTP Handling",
          "TOTP Algorithm",
          "Mailosaur",
          "Security in Testing"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tắt hoàn toàn tính năng 2FA trên toàn bộ hệ thống để làm automation cho dễ"
        ]
      },
      {
        "id": "AUTO_TEST-SCEN-05",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Trang web có tính năng Infinite Scroll (cuộn chuột vô tận để tải thêm dữ liệu). Kịch bản test tự động cần cuộn xuống để tìm và bấm vào một phần tử nằm ở vị trí thứ 150. Em viết kịch bản cuộn và kiểm tra điều kiện dừng an toàn ra sao để tránh vòng lặp vô tận?",
        "evaluationCriteria": [
          "Viết vòng lặp có điều kiện dừng rõ ràng: kiểm tra sự xuất hiện của phần tử mục tiêu sau mỗi lần cuộn màn hình (`locator.scrollIntoViewIfNeeded()`)",
          "Thiết lập giới hạn số lần cuộn tối đa (Max Scroll Attempts = 20) và thời gian timeout để tránh vòng lặp vô tận nếu phần tử không tồn tại",
          "Đợi dữ liệu mới tải xong (chờ network idle hoặc chờ số lượng phần tử tăng lên) trước khi thực hiện lần cuộn tiếp theo"
        ],
        "followUps": [
          "Cách thay thế bằng việc gọi API để lấy trực tiếp dữ liệu thay vì cuộn chuột 50 lần trên UI?",
          "Xử lý virtual list (chỉ giữ một số lượng DOM node nhất định trong RAM khi cuộn) trong kịch bản test ra sao?"
        ],
        "tags": [
          "Infinite Scroll",
          "Dynamic Loading",
          "Infinite Loop Prevention",
          "DOM Scrolling"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Viết vòng lặp `while (true)` cuộn chuột không có điều kiện thoát khiến test case bị treo vĩnh viễn"
        ]
      },
      {
        "id": "AUTO_TEST-SCEN-06",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Khi kiểm thử tính năng tải file báo cáo PDF về máy, kịch bản test cần xác minh xem file PDF có thực sự được tải về thành công và nội dung bên trong file có chứa đúng tên khách hàng hay không. Em tự động hóa việc đọc và kiểm tra nội dung file nhị phân này ra sao?",
        "evaluationCriteria": [
          "Sử dụng sự kiện `page.waitForEvent('download')` trong Playwright để bắt lấy đối tượng tệp tin được tải xuống",
          "Lưu file vào thư mục tạm và sử dụng thư viện xử lý PDF (`pdf-parse`) để trích xuất văn bản từ tệp PDF thành chuỗi",
          "Thực hiện các câu lệnh `expect(pdfText).toContain('Tên khách hàng')` để xác minh nội dung chính xác mà không cần mở giao diện đọc PDF"
        ],
        "followUps": [
          "Làm thế nào để dọn dẹp các tệp tin tạm sau khi bài test hoàn tất để không làm đầy ổ đĩa CI?",
          "Cách kiểm tra các định dạng tệp khác như Excel (.xlsx) bằng thư viện `xlsx` hoặc CSV trong automation test?"
        ],
        "tags": [
          "File Download",
          "PDF Parsing",
          "Binary Verification",
          "Automated Validation"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ kiểm tra nút bấm Tải về có bấm được không mà không xác minh xem file có tải về thật và nội dung có đúng không"
        ]
      },
      {
        "id": "AUTO_TEST-CV-01",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong dự án xây dựng Automation Framework được ghi trên CV của em: Em đã tự tay thiết kế những thành phần kiến trúc nào? Quy mô bộ test đạt bao nhiêu kịch bản và tỷ lệ bao phủ tự động hóa (Automation Coverage) là bao nhiêu phần trăm?",
        "evaluationCriteria": [
          "Mô tả cấu trúc framework: ngôn ngữ, công cụ cốt lõi, cơ chế quản lý cấu hình, báo cáo, logging",
          "Nêu rõ số liệu cụ thể: số lượng test cases tự động (vd: 300+ tests), thời gian chạy toàn bộ (vd: 12 phút với 4 workers), tần suất chạy trong CI",
          "Tỷ lệ bao phủ thực tế trên các luồng nghiệp vụ cốt lõi (Core Regression Flow)"
        ],
        "followUps": [
          "Những khó khăn kỹ thuật lớn nhất khi triển khai framework đó cho toàn đội ngũ là gì?",
          "Nếu được bắt đầu lại dự án đó, em sẽ lựa chọn công nghệ hoặc thư viện nào khác?"
        ],
        "tags": [
          "Framework Design",
          "Scale",
          "Coverage Metric",
          "CV Deep Dive"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ viết vài script đơn giản theo mẫu có sẵn của người khác nhưng ghi nhận là tự xây dựng toàn bộ framework"
        ]
      },
      {
        "id": "AUTO_TEST-CV-02",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trên CV em có nêu kỹ năng chuyển đổi từ Selenium sang Playwright. Em đã lập kế hoạch chuyển đổi như thế nào và sự khác biệt về độ ổn định cũng như thời gian thực thi sau khi chuyển đổi được đo lường ra sao?",
        "evaluationCriteria": [
          "Lý do chuyển đổi: Selenium chạy chậm, nhiều flaky tests do timing, cấu hình grid phức tạp",
          "Chiến lược chuyển đổi từng bước (Gradual Migration): viết tính năng mới bằng Playwright, chuyển đổi dần các module cũ có rủi ro cao",
          "Số liệu cải thiện rõ rệt: giảm thời gian chạy từ 45 phút xuống 8 phút, giảm tỷ lệ flaky tests từ 15% xuống dưới 1%"
        ],
        "followUps": [
          "Những tính năng nào của Playwright mà Selenium không có đã mang lại giá trị lớn nhất cho đội ngũ của em?",
          "Cách đào tạo các thành viên quen với Selenium chuyển sang viết cú pháp async/await của Playwright?"
        ],
        "tags": [
          "Selenium to Playwright",
          "Migration Strategy",
          "ROI Metric",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nói chung chung là 'Playwright nhanh hơn' mà không đưa ra được số liệu so sánh cụ thể từ dự án thực tế"
        ]
      },
      {
        "id": "AUTO_TEST-CV-03",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi nhận kinh nghiệm kiểm thử tự động API kết hợp với UI trên cùng một kịch bản kiểm thử (Hybrid Automation). Hãy dẫn chứng một bài test cụ thể mà việc kết hợp cả hai tầng đã mang lại hiệu quả vượt trội?",
        "evaluationCriteria": [
          "Mô tả kịch bản: Dùng API để chuẩn bị dữ liệu (tạo tài khoản, thêm sản phẩm vào kho trong 200ms) -> Dùng UI để thực hiện hành vi người dùng cần test (bấm thanh toán) -> Dùng API để đối soát trạng thái đơn hàng trong DB",
          "Lợi ích: tiết kiệm 80% thời gian thực thi so với làm toàn bộ qua UI và tăng độ tin cậy của bài test lên tối đa",
          "Sử dụng cùng một framework và chia sẻ context phiên đăng nhập liền mạch giữa API client và Browser page"
        ],
        "followUps": [
          "Làm thế nào để đồng bộ token xác thực từ API response vào browser cookies của Playwright?",
          "Khi bài test bị fail, làm sao để biết lỗi phát sinh từ tầng API hay tầng UI?"
        ],
        "tags": [
          "Hybrid Automation",
          "API and UI Integration",
          "Execution Efficiency",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chưa từng kết hợp API vào UI test mà chỉ chạy hai bộ test tách biệt hoàn toàn"
        ]
      },
      {
        "id": "AUTO_TEST-CV-04",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Em hãy kể về một con bọ (Bug) nghiêm trọng trên môi trường production mà chính bộ test tự động của em đã bắt được thành công ngay trong pipeline CI/CD trước khi kịp phát hành ra ngoài?",
        "evaluationCriteria": [
          "Mô tả cụ thể lỗi: lỗi tính sai thuế VAT trong giỏ hàng, lỗi vỡ giao diện thanh toán trên trình duyệt Safari, hoặc lỗi quyền hạn người dùng",
          "Cách bài test phát hiện ra lỗi: assertion nào đã kích hoạt báo động trong pipeline",
          "Tác động ngăn ngừa: giúp công ty tránh được tổn thất tài chính hoặc sự cố ngưng trệ dịch vụ nghiêm trọng"
        ],
        "followUps": [
          "Tại sao lập trình viên không phát hiện ra lỗi đó trong quá trình code và unit test?",
          "Sau sự cố đó, em có bổ sung thêm kịch bản kiểm thử biên nào liên quan không?"
        ],
        "tags": [
          "Production Bug Prevention",
          "Automation Value",
          "CI/CD Safety Gate",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kể về một lỗi nhỏ không đáng kể hoặc thừa nhận bộ test tự động chưa bao giờ bắt được bug nào hữu ích"
        ]
      },
      {
        "id": "AUTO_TEST-CV-05",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong dự án có cấu hình báo cáo Allure Report hoặc Playwright HTML Report trên CV, em đã tùy biến báo cáo để cung cấp thông tin hữu ích cho các bên liên quan (Developers, QA Lead, Management) như thế nào?",
        "evaluationCriteria": [
          "Tích hợp tự động đính kèm ảnh chụp màn hình (Screenshot on Failure), video ghi lại quá trình chạy, và log console của trình duyệt",
          "Phân loại test cases theo tính năng (Epics, Features, Stories), độ nghiêm trọng và môi trường kiểm thử",
          "Xuất bản báo cáo tự động lên GitHub Pages hoặc máy chủ nội bộ để toàn đội ngũ có thể truy cập xem kết quả tức thời"
        ],
        "followUps": [
          "Làm thế nào để theo dõi lịch sử xu hướng kết quả kiểm thử (History Trend) qua các lần chạy trên Allure Report?",
          "Cách gửi tóm tắt tỷ lệ Pass/Fail kèm đường link báo cáo lên kênh chat Slack của nhóm?"
        ],
        "tags": [
          "Allure Report",
          "HTML Reporting",
          "Test Analytics",
          "Artifact Publishing",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ đọc kết quả test qua màn hình console log đen trắng mà không có hệ thống báo cáo trực quan"
        ]
      },
      {
        "id": "AUTO_TEST-BEHAV-01",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi bộ test tự động thường xuyên bị fail ảo (Flaky Tests) khiến các Developers mất niềm tin và coi kết quả kiểm thử tự động như 'tiếng ồn' (Noise) rồi tự ý bấm bypass để merge code, em hành động ra sao để khôi phục niềm tin?",
        "evaluationCriteria": [
          "Thừa nhận vấn đề một cách cầu thị: cách ly ngay các test case bị flaky ra khỏi pipeline chính (gắn tag `@quarantine` hoặc tắt tạm thời) để pipeline chạy xanh ổn định",
          "Tập trung điều tra và phân tích nguyên nhân gốc rễ của từng test flaky: sửa selector, tăng độ tin cậy chờ đợi, xử lý dữ liệu cô lập",
          "Chỉ đưa test case quay trở lại pipeline chính sau khi đã chứng minh nó chạy pass liên tục 50 lần không lỗi trên môi trường thử nghiệm"
        ],
        "followUps": [
          "Làm thế nào để duy trì văn hóa 'Đỏ là phải dừng' (Stop-the-line culture) khi pipeline test bị fail?",
          "Cách truyền thông minh bạch về độ ổn định của bộ test cho toàn thể đội ngũ kỹ thuật?"
        ],
        "tags": [
          "Flaky Test Quarantine",
          "Restoring Trust",
          "Engineering Discipline",
          "Test Reliability"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bảo thủ cho rằng code test của mình không có lỗi và đổ lỗi cho máy chủ CI chạy chậm"
        ]
      },
      {
        "id": "AUTO_TEST-BEHAV-02",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Khi một lập trình viên phàn nàn rằng việc chạy bộ kiểm thử tự động của em trong Pull Request mất quá nhiều thời gian làm chậm tốc độ merge code của họ, em phản hồi và hợp tác giải quyết thế nào?",
        "evaluationCriteria": [
          "Lắng nghe với tinh thần thấu cảm: tốc độ phản hồi nhanh là nhu cầu chính đáng của lập trình viên để giữ nhịp độ công việc",
          "Tối ưu hóa pipeline phân tầng: trên Pull Request chỉ chạy bộ Smoke Test cốt lõi (chạy dưới 5 phút) để xác nhận nhanh; bộ Full Regression sẽ chạy vào ban đêm (Nightly build)",
          "Phân tích xem có kịch bản test nào bị nghẽn thời gian và tối ưu hóa chạy song song để rút ngắn thời gian hơn nữa"
        ],
        "followUps": [
          "Làm thế nào để cân bằng giữa tốc độ phản hồi nhanh cho Developer và độ an toàn chất lượng của sản phẩm?",
          "Cách giải thích để Developer hiểu rằng 5 phút chờ test sẽ tiết kiệm hàng giờ đi fix bug trên production?"
        ],
        "tags": [
          "Developer Experience",
          "Pipeline Speed",
          "Smoke vs Regression",
          "Collaboration"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Phản ứng gay gắt cho rằng developer thiếu kiên nhẫn và từ chối tối ưu hóa thời gian chạy test"
        ]
      },
      {
        "id": "AUTO_TEST-BEHAV-03",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong nhóm có các bạn Manual QA lớn tuổi hoặc mới vào nghề còn e ngại việc học viết code tự động hóa. Em khuyến khích, hỗ trợ và chuyển giao kiến thức (Knowledge Transfer) cho các bạn ra sao?",
        "evaluationCriteria": [
          "Không tạo rào cản kỹ thuật phức tạp: bắt đầu bằng việc hướng dẫn các bạn sử dụng công cụ ghi nhận mã tự động (Playwright Codegen) để làm quen với cú pháp",
          "Xây dựng các Page Object và từ khóa dễ hiểu (Keyword-driven / Helper functions) để các bạn có thể viết test case tự động mà không cần hiểu sâu về kiến trúc",
          "Tổ chức các buổi workshop nội bộ cầm tay chỉ việc, động viên và ghi nhận công sức khi các bạn tự tay viết được bài test tự động đầu tiên"
        ],
        "followUps": [
          "Làm thế nào để phân chia công việc hài hòa giữa thành viên viết framework và thành viên viết test scripts?",
          "Cách xây dựng tài liệu hướng dẫn viết test (Contributing Guide) dễ hiểu cho người mới?"
        ],
        "tags": [
          "Knowledge Transfer",
          "Mentorship",
          "Team Upskilling",
          "Empathy"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tỏ thái độ thượng đẳng kỹ thuật xem thường các bạn Manual QA chỉ biết test tay"
        ]
      },
      {
        "id": "AUTO_TEST-BEHAV-04",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trước áp lực từ ban quản lý muốn cắt giảm nhân sự kiểm thử thủ công và yêu cầu em phải tự động hóa 100% toàn bộ hệ thống trong vòng 3 tháng, em phân tích tính khả thi và tư vấn chiến lược cho lãnh đạo như thế nào?",
        "evaluationCriteria": [
          "Giải thích khách quan dựa trên nguyên lý khoa học kiểm thử: tự động hóa 100% là ảo tưởng phi thực tế (Unrealistic Expectation) và cực kỳ tốn kém",
          "Chỉ ra những phần việc mà máy móc không bao giờ thay thế được con người: Trải nghiệm người dùng (UX), Kiểm thử khám phá (Exploratory), và Đánh giá tính thẩm mỹ",
          "Đề xuất lộ trình tự động hóa thực tế (Automation Roadmap): tập trung 70-80% vào các tính năng hồi quy ổn định có ROI cao nhất, kết hợp kiểm thử thủ công thông minh"
        ],
        "followUps": [
          "Làm thế nào để tính toán chi phí duy trì bảo trì (Maintenance Cost) của test script để lãnh đạo thấy được bức tranh toàn cảnh?",
          "Cách trình bày bài toán đầu tư kiểm thử tự động một cách thuyết phục trước ban giám đốc?"
        ],
        "tags": [
          "Realistic Expectations",
          "Automation Strategy",
          "Leadership Advisory",
          "ROI Analysis"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Hứa hão với ban giám đốc rằng mình sẽ làm được 100% rồi sau đó làm việc quá tải và thất bại toàn diện"
        ]
      },
      {
        "id": "AUTO_TEST-BEHAV-05",
        "role": "Automation Tester (Selenium/Playwright)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi có sự bất đồng quan điểm giữa em và Tech Lead về việc nên chọn Cypress hay Playwright cho dự án mới, em tiếp cận thảo luận, lập bảng so sánh Proof of Concept (PoC) và đưa ra quyết định dựa trên những tiêu chí nào?",
        "evaluationCriteria": [
          "Không tranh luận cảm tính: cùng Tech Lead thống nhất bộ tiêu chí đánh giá kỹ thuật (Khả năng hỗ trợ đa tab, tốc độ chạy, hỗ trợ Safari/WebKit, hỗ trợ iframe, cộng đồng và giấy phép)",
          "Thực hiện bản PoC thực tế: viết thử cùng 3 kịch bản kiểm thử phức tạp của chính dự án trên cả 2 công cụ để đo đạc số liệu khách quan",
          "Trình bày kết quả minh bạch và tôn trọng quyết định cuối cùng của đội ngũ vì mục tiêu chung của sản phẩm"
        ],
        "followUps": [
          "Những nhược điểm cố hữu nào của Cypress (chạy trong cùng tab trình duyệt) mà Playwright đã giải quyết triệt để?",
          "Làm thế nào để duy trì tinh thần đồng đội tích cực sau khi cuộc thảo luận công nghệ kết thúc?"
        ],
        "tags": [
          "PoC Evaluation",
          "Tool Selection",
          "Playwright vs Cypress",
          "Constructive Consensus"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bảo thủ khăng khăng bảo vệ công cụ mình thích mà không chịu làm thử nghiệm đánh giá khách quan"
        ]
      }
    ]
  },
  {
    "role": "QC Specialist",
    "group": "testingQA",
    "groupLabel": "Kiểm thử & Chất lượng",
    "aliases": [
      "qc specialist",
      "quality control specialist",
      "chuyen vien qc",
      "qc",
      "software qc"
    ],
    "questions": [
      {
        "id": "QC-FOUND-01",
        "role": "QC Specialist",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong QC Specialist, phân biệt QA vs QC, ISO 9000, Quality Control, Quality Gates; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của QA vs QC.",
          "Phân biệt được các khái niệm liên quan ISO 9000, Quality Control, Quality Gates ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí QC Specialist."
        ],
        "followUps": [
          "Nếu mới học QA vs QC, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "QA vs QC",
          "ISO 9000",
          "Quality Control",
          "Quality Gates"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "QC-FOUND-02",
        "role": "QC Specialist",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Các Cổng kiểm soát chất lượng (Quality Gates) trong quy trình phát triển và phát hành phần mềm: Tiêu chí đầu vào (Entry Criteria) và Tiêu chí nghiệm thu đầu ra (Exit Criteria) của từng giai đoạn được thiết lập như thế nào?",
        "evaluationCriteria": [
          "Entry Criteria: điều kiện tiên quyết để bắt đầu một giai đoạn (vd: Code hoàn tất, Unit test pass 100%, deploy staging thành công, tài liệu PRD có chữ ký duyệt)",
          "Exit Criteria: điều kiện bắt buộc để kết thúc giai đoạn và cho phép chuyển tiếp (vd: 100% test case trọng yếu được thực thi, 0 Blocker/Critical bug, độ bao phủ đạt chuẩn)",
          "Quy tắc không thỏa hiệp: nếu không đạt Exit Criteria thì cổng kiểm soát chất lượng sẽ tự động chặn việc chuyển giai đoạn"
        ],
        "followUps": [
          "Ai là người có thẩm quyền ký duyệt (Sign-off) cho phép một tính năng vượt qua Quality Gate?",
          "Quy trình xử lý ngoại lệ (Exception Approval) khi một tính năng chưa đạt chuẩn nhưng bắt buộc phải chuyển giai đoạn?"
        ],
        "tags": [
          "Quality Gates",
          "Entry Criteria",
          "Exit Criteria",
          "Sign-off Process"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Cho phép sản phẩm chuyển sang giai đoạn tiếp theo một cách tùy tiện mà không đối chiếu các tiêu chí nghiệm thu"
        ]
      },
      {
        "id": "QC-FOUND-03",
        "role": "QC Specialist",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Kỹ thuật Phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA): Em sử dụng phương pháp '5 Whys' và Biểu đồ xương cá (Ishikawa / Fishbone Diagram) để tìm ra nguồn gốc của một lỗi chất lượng nghiêm trọng như thế nào?",
        "evaluationCriteria": [
          "5 Whys: liên tục đặt câu hỏi 'Tại sao' ít nhất 5 lần để đào sâu từ triệu chứng bề mặt đến nguyên nhân gốc rễ trong quy trình hoặc con người",
          "Biểu đồ xương cá Ishikawa: phân loại nguyên nhân theo các nhóm chính (Con người - People, Quy trình - Process, Công nghệ - Technology, Môi trường - Environment, Dữ liệu - Data)",
          "Đưa ra hành động khắc phục phòng ngừa (CAPA - Corrective and Preventive Actions) chứ không chỉ dừng lại ở việc vá lỗi tạm thời"
        ],
        "followUps": [
          "Làm thế nào để tránh việc 5 Whys biến thành một cuộc thẩm vấn quy kết tội cá nhân?",
          "Cách đo lường hiệu quả của một hành động khắc phục sau 3 tháng triển khai?"
        ],
        "tags": [
          "Root Cause Analysis",
          "5 Whys",
          "Ishikawa Fishbone",
          "CAPA",
          "Problem Solving"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ dừng lại ở nguyên nhân bề mặt như 'Do lập trình viên gõ sai code' mà không tìm ra lỗ hổng trong quy trình"
        ]
      },
      {
        "id": "QC-FOUND-04",
        "role": "QC Specialist",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quy trình Kiểm soát Tài liệu và Cấu hình (Document & Configuration Control): Làm thế nào để đảm bảo đội ngũ kiểm soát chất lượng luôn đối chiếu trên đúng phiên bản tài liệu đặc tả (BRD/SRS) và phiên bản phần mềm (Build Version) chuẩn xác nhất?",
        "evaluationCriteria": [
          "Áp dụng quy tắc quản lý phiên bản tài liệu có lịch sử thay đổi (Document Revision History) và chữ ký phê duyệt của các bên liên quan",
          "Gắn thẻ phiên bản phần mềm (Semantic Versioning - SemVer) liên kết chặt chẽ với Git Commit Hash trên từng môi trường",
          "Kiểm tra tính nhất quán: đối chiếu bản kiểm thử với đúng tài liệu đã được phê duyệt, ghi nhận ngay sai lệch nếu tài liệu chưa được cập nhật"
        ],
        "followUps": [
          "Sự cố gì xảy ra nếu đội ngũ QC kiểm thử trên phiên bản tài liệu cũ đã bị sửa đổi mà không được thông báo?",
          "Làm thế nào để thiết lập quy trình quản lý yêu cầu thay đổi (Change Control Board - CCB)?"
        ],
        "tags": [
          "Configuration Control",
          "Document Management",
          "SemVer",
          "Audit Trail"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kiểm thử tùy tiện theo lời nói miệng mà không có tài liệu đối soát phiên bản chính thức"
        ]
      },
      {
        "id": "QC-FOUND-05",
        "role": "QC Specialist",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Kiểm tra khói (Smoke Testing) và Kiểm tra độ lành mạnh (Sanity Testing): Phân biệt mục tiêu, thời điểm thực hiện và phạm vi kiểm tra của hai loại kiểm thử kiểm soát chất lượng này?",
        "evaluationCriteria": [
          "Smoke Testing (Build Verification Test): kiểm tra các chức năng cơ bản nhất ngay khi nhận bản build mới để xác nhận bản build có đủ ổn định để bắt đầu kiểm thử hay không",
          "Sanity Testing: kiểm tra nhanh có trọng tâm vào một module vừa được sửa lỗi hoặc cập nhật để xác nhận tính hợp lý của chức năng trước khi đi vào kiểm thử sâu",
          "Cả hai đều có phạm vi hẹp, thực hiện nhanh (15-30 phút), và nếu fail thì bản build sẽ bị từ chối ngay lập tức"
        ],
        "followUps": [
          "Nếu bản build bị fail ở bước Smoke Test, quy trình từ chối bản build (Build Rejection Protocol) diễn ra ra sao?",
          "Tại sao không nên bắt đầu kiểm thử chi tiết khi Smoke Test chưa vượt qua?"
        ],
        "tags": [
          "Smoke Testing",
          "Sanity Testing",
          "Build Verification",
          "QC Checklist"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Nhầm lẫn Smoke Testing với kiểm thử hồi quy toàn diện (Regression Testing)"
        ]
      },
      {
        "id": "QC-FOUND-06",
        "role": "QC Specialist",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Phân tích Biểu đồ Pareto (Nguyên lý 80/20) trong kiểm soát chất lượng phần mềm: Làm thế nào để phân loại các lỗi theo danh mục và tập trung nguồn lực kiểm soát vào 20% nguyên nhân gây ra 80% số lỗi của sản phẩm?",
        "evaluationCriteria": [
          "Thu thập và gắn nhãn toàn bộ lỗi trong dự án theo danh mục nguyên nhân (Module, Loại lỗi: logic, giao diện, dữ liệu, hiệu năng)",
          "Vẽ biểu đồ Pareto sắp xếp các danh mục lỗi theo thứ tự giảm dần kết hợp đường tích lũy phần trăm (Cumulative % line)",
          "Xác định các 'yếu tố thiểu số trọng yếu' (Vital few) để đề xuất hành động cải tiến quy trình tập trung mang lại hiệu quả cao nhất"
        ],
        "followUps": [
          "Làm thế nào để sử dụng biểu đồ Pareto để thuyết phục ban lãnh đạo đầu tư tái cấu trúc một module thường xuyên phát sinh lỗi?",
          "Cách kết hợp biểu đồ Pareto với biểu đồ kiểm soát (Control Charts) để giám sát chất lượng ổn định?"
        ],
        "tags": [
          "Pareto Analysis",
          "80/20 Rule",
          "Quality Metrics",
          "Defect Distribution"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Xem mọi lỗi phát sinh đều có tầm quan trọng như nhau mà không biết ưu tiên tập trung vào các cụm lỗi trọng yếu"
        ]
      },
      {
        "id": "QC-SKILL-01",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Release Checklist (Post-deployment Verification, Production Sanity, Release Governance) cho QC Specialist: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Release Checklist trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Release Checklist",
          "Post-deployment Verification",
          "Production Sanity",
          "Release Governance"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "QC-SKILL-02",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập QC Specialist: dựa trên UAT Coordination, phối hợp User Acceptance, Business Scenarios, Sign-off Protocol; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng UAT Coordination trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "UAT Coordination",
          "User Acceptance",
          "Business Scenarios",
          "Sign-off Protocol"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "QC-SKILL-03",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Kiểm toán Tuân thủ Quy trình (Quality Audit & Process Compliance): Em tiến hành các buổi đánh giá nội bộ định kỳ để kiểm tra xem các dự án có tuân thủ đúng Quy trình Vận hành Tiêu chuẩn (SOP) và tiêu chuẩn chất lượng của tổ chức hay không ra sao?",
        "evaluationCriteria": [
          "Lập kế hoạch kiểm toán (Audit Plan): xác định phạm vi, tiêu chí đánh giá, danh sách dự án và nhân sự được phỏng vấn",
          "Thu thập bằng chứng khách quan (Objective Evidence): kiểm tra hồ sơ dự án, biên bản họp, tỷ lệ code review, tài liệu thiết kế và kết quả kiểm thử",
          "Lập báo cáo kiểm toán ghi nhận các điểm không phù hợp (Non-Conformities - NCs) và theo dõi hành động khắc phục của dự án"
        ],
        "followUps": [
          "Phân biệt giữa Điểm không phù hợp nghiêm trọng (Major NC), không phù hợp nhỏ (Minor NC), và Điểm cần lưu ý (Observation)?",
          "Làm thế nào để buổi kiểm toán chất lượng diễn ra trên tinh thần hỗ trợ cải tiến thay vì cảm giác bị thanh tra soi mói?"
        ],
        "tags": [
          "Quality Audit",
          "SOP Compliance",
          "Non-Conformity",
          "Process Assessment"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thực hiện kiểm toán mang tính hình thức đối phó trên giấy tờ mà không kiểm tra bằng chứng thực tế"
        ]
      },
      {
        "id": "QC-SKILL-04",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Đo lường và Báo cáo Hiệu quả Loại bỏ Lỗi (Defect Removal Efficiency - DRE): Cách tính toán chỉ số DRE và ứng dụng chỉ số này để đánh giá năng lực của các chặng kiểm soát chất lượng trước khi sản phẩm đến tay khách hàng?",
        "evaluationCriteria": [
          "Công thức: DRE = (Số lỗi phát hiện trước khi release / Tổng số lỗi phát hiện trước và sau khi release) * 100%",
          "Chỉ số DRE trên 90-95% phản ánh hệ thống kiểm soát chất lượng nội bộ hoạt động hiệu quả",
          "Phân rã DRE theo từng giai đoạn (DRE của Review Yêu cầu, DRE của Code Review, DRE của QA Testing) để tìm ra khâu nào đang để lọt nhiều lỗi nhất"
        ],
        "followUps": [
          "Khi chỉ số DRE của một dự án giảm xuống dưới 80%, các bước can thiệp khẩn cấp của QC Specialist là gì?",
          "Làm thế nào để gắn chỉ số DRE vào mục tiêu đánh giá chất lượng của toàn bộ phòng kỹ thuật?"
        ],
        "tags": [
          "DRE Metric",
          "Defect Removal Efficiency",
          "Quality Measurement",
          "Process Analytics"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Không biết cách tính toán và đo lường chỉ số hiệu quả loại bỏ lỗi DRE"
        ]
      },
      {
        "id": "QC-SKILL-05",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Xây dựng và Chuẩn hóa Quy trình Thao tác Chuẩn (Standard Operating Procedures - SOP): Em viết tài liệu SOP cho quy trình báo cáo lỗi, quy trình bàn giao phần mềm giữa Dev và QC, và quy trình nghiệm thu sản phẩm như thế nào?",
        "evaluationCriteria": [
          "Cấu trúc SOP chuẩn: Mục đích, Phạm vi áp dụng, Định nghĩa, Trách nhiệm của các bên (RACI matrix), Lưu đồ quy trình (Flowchart), và Các bước thực hiện chi tiết kèm biểu mẫu",
          "Ngôn từ rõ ràng, chính xác, có thể đo lường và thực thi được; tránh các hướng dẫn mơ hồ chung chung",
          "Quy trình xem xét, phê duyệt và đào tạo phổ biến SOP mới cho toàn thể nhân sự dự án"
        ],
        "followUps": [
          "Làm thế nào để kiểm tra tính khả thi của một SOP mới trước khi ban hành chính thức?",
          "Định kỳ rà soát và cập nhật SOP (Annual Review) diễn ra theo những tiêu chí nào?"
        ],
        "tags": [
          "SOP Authoring",
          "Process Standardization",
          "RACI Matrix",
          "Documentation Quality"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Viết tài liệu quy trình dài dòng lý thuyết nhưng không ai có thể áp dụng được vào công việc thực tế"
        ]
      },
      {
        "id": "QC-SKILL-06",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quản lý Khắc phục và Phòng ngừa (CAPA - Corrective and Preventive Action): Khi một sự cố chất lượng nghiêm trọng xảy ra trên môi trường sống của khách hàng, em điều phối quy trình CAPA từ khâu phân tích đến đóng hồ sơ như thế nào?",
        "evaluationCriteria": [
          "Bước 1: Khắc phục tức thời (Containment / Immediate Action) để ngăn chặn thiệt hại lan rộng",
          "Bước 2: Điều tra nguyên nhân gốc rễ (Root Cause Analysis bằng 5 Whys)",
          "Bước 3: Lập kế hoạch hành động khắc phục và phòng ngừa (CAPA Action Plan) có người chịu trách nhiệm và hạn chót",
          "Bước 4: Đánh giá tính hiệu quả (Effectiveness Review) sau 30-60 ngày để xác nhận sự cố tương tự không còn tái diễn trước khi đóng hồ sơ CAPA"
        ],
        "followUps": [
          "Tại sao việc đóng hồ sơ CAPA ngay sau khi vừa fix xong lỗi là một sai lầm về mặt kiểm soát chất lượng?",
          "Làm thế nào để lưu trữ cơ sở dữ liệu các bài học kinh nghiệm (Lessons Learned Database) cho toàn tổ chức?"
        ],
        "tags": [
          "CAPA Management",
          "Corrective Action",
          "Preventive Action",
          "Effectiveness Review"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ tập trung sửa phần mềm trước mắt mà không có bất kỳ hành động nào để phòng ngừa lỗi tái diễn"
        ]
      },
      {
        "id": "QC-SKILL-07",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Kiểm tra Tuân thủ Tiêu chuẩn Bàn giao Sản phẩm (Deliverables Acceptance Inspection): Khi đội ngũ phát triển bàn giao gói phần mềm kèm mã nguồn, tài liệu hướng dẫn và mã cài đặt, em thực hiện quy trình kiểm tra đối soát vật lý các thành phần bàn giao ra sao?",
        "evaluationCriteria": [
          "Đối chiếu danh mục sản phẩm bàn giao (Bill of Materials / Deliverables Checklist) so với hợp đồng",
          "Kiểm tra tính đầy đủ: mã nguồn có thể biên dịch thành công từ repo sạch (Clean Build Verification), tài liệu hướng dẫn cài đặt và vận hành có chính xác từng bước không",
          "Kiểm tra các báo cáo đi kèm: báo cáo Unit test, báo cáo quét mã tĩnh (SonarQube report), và biên bản nghiệm thu nội bộ"
        ],
        "followUps": [
          "Nếu thiếu một tài liệu hướng dẫn cài đặt trong gói bàn giao, quy trình phát hành Phiếu yêu cầu bổ sung (Discrepancy Notice) diễn ra ra sao?",
          "Cách xác thực mã băm tính toàn vẹn (Checksum / SHA-256 hash) của gói cài đặt bàn giao?"
        ],
        "tags": [
          "Deliverables Inspection",
          "Clean Build Verification",
          "Checklist Auditing",
          "Handover Process"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bỏ qua việc kiểm tra tài liệu và hướng dẫn cài đặt, chỉ kiểm tra xem ứng dụng có chạy được hay không"
        ]
      },
      {
        "id": "QC-SKILL-08",
        "role": "QC Specialist",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết lập Bảng điều khiển Chất lượng Doanh nghiệp (Enterprise Quality Dashboard): Em tổng hợp các dữ liệu chất lượng từ Jira, Git, CI/CD, và Hệ thống hỗ trợ khách hàng để xây dựng báo cáo sức khỏe chất lượng sản phẩm cho Ban Lãnh đạo như thế nào?",
        "evaluationCriteria": [
          "Xác định các chỉ số cốt lõi: Tỷ lệ lỗi theo mức độ nghiêm trọng, Xu hướng phát hiện và đóng lỗi, Tỷ lệ lỗi khách hàng báo (Customer Reported Defect Rate), và Tỷ lệ tuân thủ quy trình",
          "Trực quan hóa dữ liệu bằng biểu đồ cảnh báo (RAG Status: Red - Amber - Green) giúp lãnh đạo nắm bắt nhanh các điểm nóng cần can thiệp",
          "Phân tích xu hướng (Trend Analysis) để dự báo chất lượng của bản phát hành tiếp theo"
        ],
        "followUps": [
          "Làm thế nào để phát hiện sớm dấu hiệu suy giảm chất lượng của một dự án thông qua số liệu trên dashboard?",
          "Cách chuẩn bị bài thuyết trình định kỳ về bức tranh chất lượng trước Hội đồng Quản trị?"
        ],
        "tags": [
          "Quality Dashboard",
          "RAG Status",
          "Trend Analysis",
          "Executive Metrics"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Báo cáo chất lượng chỉ bằng cảm tính chung chung như 'Dự án dạo này chạy khá ổn định' mà không có số liệu chứng minh"
        ]
      },
      {
        "id": "QC-SCEN-01",
        "role": "QC Specialist",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại QC Specialist, khi Professional Ethics cùng Quality Gate Enforcement, Compliance Risk, Integrity xuất hiện và kết quả kiểm thử thay đổi giữa các lần chạy, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong QC Specialist.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Professional Ethics",
          "Quality Gate Enforcement",
          "Compliance Risk",
          "Integrity"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "QC-SCEN-02",
        "role": "QC Specialist",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Tỷ lệ lỗi do khách hàng phát hiện trên môi trường Production (Defect Leakage) trong quý vừa qua tăng vọt lên 25%, cao gấp đôi so với ngưỡng cam kết SLA là 10%. Ban Giám đốc yêu cầu em chủ trì cuộc điều tra toàn diện để xác định nguyên nhân và đưa ra kế hoạch chấn chỉnh. Em tiến hành ra sao?",
        "evaluationCriteria": [
          "Thu thập toàn bộ danh sách các lỗi bị lọt: phân loại theo từng module, mức độ nghiêm trọng và nguyên nhân trực tiếp",
          "Thực hiện RCA (Phân tích nguyên nhân gốc rễ): xác định lỗi lọt là do thiếu test case, môi trường Staging khác biệt với Production, hay do quy trình review vội vàng bị cắt bớt thời gian",
          "Lập kế hoạch hành động chấn chỉnh (Remediation Plan): bổ sung các cổng kiểm soát bắt buộc, nâng cao chất lượng môi trường test, và tái đào tạo đội ngũ về các kịch bản thường bị bỏ sót"
        ],
        "followUps": [
          "Làm thế nào để báo cáo kết quả điều tra một cách khách quan, tập trung vào giải pháp thay vì biến buổi họp thành nơi chỉ trích lẫn nhau?",
          "Cách đo lường hiệu quả của kế hoạch chấn chỉnh trong quý tiếp theo?"
        ],
        "tags": [
          "Defect Leakage Investigation",
          "Quality Crisis",
          "Remediation Plan",
          "RCA Facilitation"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Vội vã kết luận và đổ toàn bộ lỗi cho nhân viên kiểm thử cấp dưới mà không phân tích lỗ hổng hệ thống"
        ]
      },
      {
        "id": "QC-SCEN-03",
        "role": "QC Specialist",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Khi kiểm tra gói phần mềm bàn giao chuẩn bị chuyển giao cho đối tác, em phát hiện mã nguồn của dự án có nhúng một thư viện mã nguồn mở có giấy phép GNU GPL v3.0 nghiêm ngặt (yêu cầu toàn bộ mã nguồn của phần mềm thương mại phải được mở công khai nếu phân phối). Em xử lý rủi ro pháp trị bản quyền này ra sao?",
        "evaluationCriteria": [
          "Tạm dừng ngay lập tức việc phát hành gói phần mềm ra bên ngoài để ngăn chặn rủi ro vi phạm bản quyền và lộ bí mật kinh doanh",
          "Báo cáo ngay cho Đội ngũ Pháp chế (Legal) và Tech Lead về sự hiện diện của giấy phép copyleft nghiêm ngặt (GPL v3)",
          "Phối hợp với đội kỹ thuật tìm kiếm thư viện thay thế có giấy phép thoáng hơn (MIT, Apache 2.0, BSD) hoặc mua bản quyền thương mại để loại bỏ hoàn toàn rủi ro"
        ],
        "followUps": [
          "Tại sao việc không kiểm soát giấy phép mã nguồn mở (Open Source License Compliance) lại có thể dẫn đến các vụ kiện tụng hàng triệu đô la?",
          "Quy trình quét bản quyền mã nguồn mở tự động (SCA tools) cần được tích hợp vào bước nào của quy trình QC?"
        ],
        "tags": [
          "Open Source Compliance",
          "GPL License Risk",
          "Software Legal Risk",
          "Deliverables Inspection"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Xem nhẹ vấn đề bản quyền mã nguồn mở và cho rằng 'cứ lấy trên mạng về dùng miễn phí là được'"
        ]
      },
      {
        "id": "QC-SCEN-04",
        "role": "QC Specialist",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Hai bộ phận Phát triển (R&D) và Vận hành (Operations) liên tục đổ lỗi cho nhau khi có sự cố xảy ra sau mỗi đợt release: Dev cho rằng Ops triển khai sai cấu hình, Ops cho rằng Dev bàn giao mã nguồn kém chất lượng và thiếu tài liệu. Là một QC Specialist độc lập, em can thiệp và thiết lập cơ chế bàn giao chuẩn mực ra sao?",
        "evaluationCriteria": [
          "Đóng vai trò trọng tài chất lượng khách quan: phân tích các sự cố gần nhất dựa trên bằng chứng dữ liệu cụ thể chứ không nghe lời nói miệng",
          "Thiết lập Hợp đồng Bàn giao Chuẩn mực (Handover Contract / Release Package Standard): quy định rõ Dev phải bàn giao đầy đủ những gì (Artifacts, Config docs, Rollback script) và được QC nghiệm thu trước khi chuyển sang Ops",
          "Xây dựng buổi họp bàn giao chính thức (Pre-release Handover Meeting) và checklist có sự xác nhận của cả ba bên trước khi bấm nút deploy"
        ],
        "followUps": [
          "Làm thế nào để văn bản hóa trách nhiệm của từng bên thông qua ma trận RACI rõ ràng?",
          "Cách thúc đẩy văn hóa hợp tác DevOps để xóa bỏ ranh giới 'đổ lỗi qua hàng rào' (Over-the-wall syndrome)?"
        ],
        "tags": [
          "Cross-department Conflict",
          "Handover Governance",
          "DevOps Alignment",
          "Objective Arbitration"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đứng về một phía để chỉ trích phía còn lại làm mâu thuẫn nội bộ thêm sâu sắc"
        ]
      },
      {
        "id": "QC-SCEN-05",
        "role": "QC Specialist",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Trong buổi kiểm tra đánh giá chất lượng đột xuất tại một dự án phần mềm quan trọng, em phát hiện các lập trình viên đang bỏ qua hoàn toàn quy trình Code Review (tự tạo Pull Request và tự bấm Merge trực tiếp vào nhánh chính). Em xử lý sự việc không tuân thủ quy trình này như thế nào?",
        "evaluationCriteria": [
          "Ghi nhận điểm không phù hợp (Non-Conformity) kèm theo bằng chứng cụ thể từ lịch sử commit trên Git",
          "Trao đổi trực tiếp với Tech Lead và Scrum Master của dự án để tìm hiểu nguyên nhân: do áp lực tiến độ, do quy trình review quá rườm rà hay do thiếu nhân sự",
          "Cùng dự án thiết lập cấu hình bảo vệ nhánh chính (Branch Protection Rules trên GitHub/GitLab): bắt buộc phải có ít nhất 1 phê duyệt (Approval) từ đồng nghiệp và các bài kiểm tra tự động phải pass mới được merge"
        ],
        "followUps": [
          "Làm thế nào để hướng dẫn đội ngũ cải tiến quy trình review nhanh gọn mà không làm chậm nhịp độ công việc?",
          "Quy trình theo dõi và tái kiểm tra (Follow-up Audit) sau 2 tuần để xác nhận việc khắc phục diễn ra ra sao?"
        ],
        "tags": [
          "Process Non-Conformity",
          "Branch Protection",
          "Code Review Governance",
          "Quality Assurance"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bỏ qua vi phạm và không ghi nhận báo cáo chỉ vì dự án đang trong giai đoạn chạy nước rút"
        ]
      },
      {
        "id": "QC-SCEN-06",
        "role": "QC Specialist",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Khách hàng yêu cầu áp dụng tiêu chuẩn chất lượng khắt khe theo chuẩn quốc tế CMMI Level 3 cho dự án mới trong vòng 6 tháng tới. Hiện tại dự án đang làm theo mô hình Agile tự do và thiếu hầu hết các tài liệu quy trình chuẩn. Em lập lộ trình thu hẹp khoảng cách (Gap Analysis & Roadmap) như thế nào?",
        "evaluationCriteria": [
          "Thực hiện Đánh giá khoảng cách (Gap Analysis): so sánh hiện trạng thực tế của dự án với các mục tiêu và thực hành cụ thể của CMMI Level 3",
          "Lập lộ trình từng bước (CMMI Roadmap): chuẩn hóa các quy trình cốt lõi trước (Quản lý yêu cầu, Lập kế hoạch, Đảm bảo chất lượng, Quản lý cấu hình)",
          "Dung hòa giữa Agile và CMMI: giữ tính linh hoạt và tốc độ của Agile nhưng bổ sung các bằng chứng kiểm soát chất lượng cần thiết (Agile-CMMI hybrid)"
        ],
        "followUps": [
          "Làm thế nào để tránh biến việc tuân thủ CMMI thành một gánh nặng hành chính giấy tờ vô nghĩa?",
          "Cách chuẩn bị hồ sơ bằng chứng (Artifact Repository) sẵn sàng cho đợt đánh giá chính thức của chuyên gia thẩm định (Lead Appraiser)?"
        ],
        "tags": [
          "CMMI Level 3",
          "Gap Analysis",
          "Agile CMMI Hybrid",
          "Process Transformation"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Áp đặt máy móc toàn bộ quy trình sách vở khiến đội ngũ bị quá tải giấy tờ và tê liệt tốc độ phát triển"
        ]
      },
      {
        "id": "QC-CV-01",
        "role": "QC Specialist",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong các dự án trên CV mà em đảm nhận vai trò QC Specialist: Dự án áp dụng tiêu chuẩn chất lượng hoặc quy trình nào (ISO 9001, ISO 27001, CMMI, hoặc Agile SOP)? Em đã đóng góp gì cụ thể vào việc xây dựng hoặc cải tiến quy trình kiểm soát chất lượng đó?",
        "evaluationCriteria": [
          "Trình bày cụ thể tiêu chuẩn chất lượng áp dụng và vai trò cá nhân trong việc ban hành hoặc giám sát quy trình",
          "Dẫn chứng quy trình cụ thể do chính mình cải tiến (vd: tái cấu trúc checklist nghiệm thu, chuẩn hóa quy trình release)",
          "Số liệu định lượng chứng minh hiệu quả: giảm thời gian nghiệm thu, giảm tỷ lệ lỗi lọt, tăng điểm hài lòng của khách hàng"
        ],
        "followUps": [
          "Khó khăn lớn nhất khi thuyết phục các đội ngũ kỹ thuật tuân thủ quy trình chất lượng mới là gì?",
          "Nếu được thay đổi một điều trong quy trình chất lượng cũ đó, em sẽ thay đổi điều gì?"
        ],
        "tags": [
          "Quality Standards",
          "Process Improvement",
          "Compliance",
          "CV Deep Dive"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ghi tên các chứng chỉ hoặc tiêu chuẩn trên CV nhưng không hiểu nguyên lý vận hành thực tế trong dự án"
        ]
      },
      {
        "id": "QC-CV-02",
        "role": "QC Specialist",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trên CV em có nêu kinh nghiệm quản lý và điều phối các đợt kiểm thử nghiệm thu UAT với khách hàng doanh nghiệp lớn (Enterprise). Hãy chia sẻ cách em thiết lập tiêu chí ký nghiệm thu (Sign-off Criteria) và xử lý các tranh chấp về lỗi trong dự án đó?",
        "evaluationCriteria": [
          "Mô tả quy mô đợt UAT: số lượng người dùng tham gia, số lượng kịch bản nghiệp vụ, thời gian diễn ra",
          "Tiêu chí Sign-off rõ ràng: 100% kịch bản nghiệp vụ chính được thông qua, 0 lỗi mức độ 1 và mức độ 2, các lỗi mức độ 3 có cam kết lộ trình sửa chữa",
          "Cách giải quyết tranh chấp: đối chiếu tài liệu phạm vi ban đầu và tổ chức trao đổi trực tiếp tìm giải pháp kỹ thuật dung hòa"
        ],
        "followUps": [
          "Làm thế nào để hỗ trợ khách hàng không rành công nghệ hoàn thành bài kiểm thử UAT đúng hạn?",
          "Kinh nghiệm soạn thảo biên bản bàn giao và bảo hành sản phẩm sau UAT?"
        ],
        "tags": [
          "Enterprise UAT",
          "Sign-off Criteria",
          "Dispute Resolution",
          "Customer Alignment",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không nêu được tiêu chí nghiệm thu cụ thể và cho rằng UAT kết thúc khi khách hàng không phàn nàn gì nữa"
        ]
      },
      {
        "id": "QC-CV-03",
        "role": "QC Specialist",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi nhận kinh nghiệm thực hiện Phân tích nguyên nhân gốc rễ (RCA) cho các sự cố chất lượng trên CV. Hãy dẫn chứng một ca sự cố cụ thể mà phân tích RCA của em đã giúp thay đổi tận gốc quy trình làm việc của công ty?",
        "evaluationCriteria": [
          "Tường thuật sự cố cụ thể: nguyên nhân bề mặt là gì và sau khi đào sâu 5 Whys thì phát hiện ra nguyên nhân cốt lõi ở đâu (vd: do thiếu môi trường test giống thật hoặc do yêu cầu nghiệp vụ bị hiểu sai)",
          "Hành động phòng ngừa (CAPA) được đưa ra và áp dụng cho toàn công ty",
          "Kết quả theo dõi sau 6 tháng: không còn bất kỳ sự cố tương tự nào tái diễn trong toàn bộ tổ chức"
        ],
        "followUps": [
          "Làm thế nào để đảm bảo các hành động CAPA được thực thi nghiêm túc chứ không chỉ nằm trên giấy tờ?",
          "Cách lưu trữ và chia sẻ bài học kinh nghiệm cho các dự án mới gia nhập?"
        ],
        "tags": [
          "RCA Case Study",
          "5 Whys",
          "Process Transformation",
          "CAPA Success",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Kể về một lần sửa lỗi thông thường của lập trình viên thay vì một phân tích nguyên nhân gốc rễ ở tầng quy trình"
        ]
      },
      {
        "id": "QC-CV-04",
        "role": "QC Specialist",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Em hãy kể về một lần em kiên quyết từ chối ký duyệt xuất xưởng một sản phẩm phần mềm (Rejection of Release) trên dự án CV vì không đạt tiêu chuẩn chất lượng, dù phải chịu áp lực rất lớn từ các bên liên quan?",
        "evaluationCriteria": [
          "Trình bày cụ thể bối cảnh: sản phẩm vi phạm tiêu chí chất lượng nào (lỗi bảo mật, hiệu năng không đạt, rò rỉ dữ liệu)",
          "Áp lực phải đối mặt: sức ép từ Giám đốc kinh doanh hoặc Quản lý dự án về việc giao hàng đúng hẹn",
          "Cách xử lý dũng cảm và chuyên nghiệp: bảo vệ lập trường dựa trên dữ liệu phân tích rủi ro, đưa ra phương án khắc phục và kết quả cuối cùng đã chứng minh quyết định từ chối là hoàn toàn chính xác"
        ],
        "followUps": [
          "Lãnh đạo công ty đã phản ứng như thế nào sau khi hiểu rõ rủi ro mà em đã giúp ngăn chặn?",
          "Bài học về bản lĩnh nghề nghiệp của một người kiểm soát chất lượng là gì?"
        ],
        "tags": [
          "Release Rejection",
          "Quality Gatekeeper",
          "Ethical Decision",
          "Courage",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thừa nhận mình luôn luôn ký duyệt mọi thứ theo lệnh của sếp và chưa bao giờ dám từ chối điều gì"
        ]
      },
      {
        "id": "QC-CV-05",
        "role": "QC Specialist",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong dự án xây dựng hệ thống báo cáo và bảng điều khiển chỉ số chất lượng (Quality Metrics Dashboard) trên CV, em đã thu thập dữ liệu từ những nguồn nào và ban giám đốc đã sử dụng các chỉ số đó để ra quyết định kinh doanh ra sao?",
        "evaluationCriteria": [
          "Nguồn thu thập dữ liệu: Jira API (dữ liệu bug), GitHub/GitLab (tần suất commit và PR review), SonarQube (độ sạch của code), Zendesk (phản hồi khách hàng)",
          "Các chỉ số chính hiển thị: Defect Density, MTTR, DRE, Test Execution Progress, Code Coverage",
          "Tác động kinh doanh: giúp ban giám đốc quyết định chính xác thời điểm sản phẩm sẵn sàng mở bán rộng rãi ra thị trường"
        ],
        "followUps": [
          "Làm thế nào để tự động hóa việc cập nhật dữ liệu lên dashboard mà không phải làm báo cáo Excel thủ công hàng tuần?",
          "Cách giải thích các chỉ số kỹ thuật cho ban lãnh đạo không chuyên về công nghệ hiểu được?"
        ],
        "tags": [
          "Quality Dashboard",
          "Automated Metrics",
          "Executive Decision",
          "Data-driven Management",
          "CV Verification"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ làm báo cáo thủ công bằng file Word/Excel gửi email mà không có hệ thống theo dõi trực quan"
        ]
      },
      {
        "id": "QC-BEHAV-01",
        "role": "QC Specialist",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Bộ phận Kiểm soát chất lượng (QC) thường bị xem là 'người đi phán xét', 'kẻ khó tính làm chậm tiến độ' của các đội ngũ phát triển. Em làm thế nào để thay đổi định kiến này và xây dựng hình ảnh QC như một đối tác hỗ trợ (Supportive Partner) đồng hành cùng thành công của dự án?",
        "evaluationCriteria": [
          "Chủ động tham gia sớm với thái độ hỗ trợ: cung cấp checklist rõ ràng ngay từ đầu để dev biết tiêu chuẩn cần đạt, không 'đánh úp' vào phút chót",
          "Giải thích rõ ràng mục tiêu: QC không phải đi tìm người có lỗi mà là cùng nhau bảo vệ sản phẩm trước khi đến tay khách hàng",
          "Ghi nhận và tôn vinh những nỗ lực làm tốt của đội ngũ phát triển; luôn đưa ra giải pháp khắc phục đi kèm thay vì chỉ chỉ trích điểm yếu"
        ],
        "followUps": [
          "Làm thế nào để xây dựng sự tin tưởng và tôn trọng từ các kỹ sư phần mềm cao cấp?",
          "Cách xử lý khi một thành viên trong nhóm có thái độ bất hợp tác khi QC kiểm tra hồ sơ?"
        ],
        "tags": [
          "Quality Mindset",
          "Partnering not Policing",
          "Interpersonal Skills",
          "Culture Building"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Hành xử như một cảnh sát quan liêu chỉ biết hạch sách và bắt bẻ đồng nghiệp"
        ]
      },
      {
        "id": "QC-BEHAV-02",
        "role": "QC Specialist",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Khi có sự bất đồng lớn giữa Tiêu chuẩn Chất lượng lý thuyết và Áp lực Thực tế kinh doanh (Thị trường đòi hỏi phải ra mắt ngay nếu không sẽ mất khách hàng vào tay đối thủ), em cân bằng giữa nguyên tắc và sự linh hoạt thực tế (Pragmatism) ra sao?",
        "evaluationCriteria": [
          "Tư duy linh hoạt có kiểm soát: chất lượng không phải là sự hoàn hảo tuyệt đối mà là sự phù hợp với mục đích sử dụng (Fitness for purpose)",
          "Đánh giá mức độ rủi ro có thể chấp nhận được: phân biệt giữa lỗi an toàn nghiêm trọng (tuyệt đối không thỏa hiệp) và các lỗi trải nghiệm nhỏ (có thể chấp nhận khắc phục sau)",
          "Xây dựng phương án phát hành có kiểm soát: giới hạn số lượng người dùng thử nghiệm ban đầu (Beta release) kèm theo cam kết lộ trình hoàn thiện chất lượng ngay sau đó"
        ],
        "followUps": [
          "Làm thế nào để văn bản hóa các cam kết nợ kỹ thuật (Tech Debt) và kế hoạch trả nợ chất lượng sau khi phát hành?",
          "Bài học về việc không cứng nhắc giáo điều trong kinh doanh là gì?"
        ],
        "tags": [
          "Pragmatic Quality",
          "Business Alignment",
          "Controlled Risk",
          "Flexibility"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cứng nhắc giáo điều từ chối mọi sự linh hoạt khiến công ty mất cơ hội kinh doanh sống còn"
        ]
      },
      {
        "id": "QC-BEHAV-03",
        "role": "QC Specialist",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi một khách hàng giận dữ phàn nàn gay gắt về chất lượng sản phẩm trong buổi họp nghiệm thu, em giữ bình tĩnh, lắng nghe và dẫn dắt cuộc thảo luận quay trở lại hướng giải quyết vấn đề chuyên nghiệp như thế nào?",
        "evaluationCriteria": [
          "Giữ thái độ điềm tĩnh, lắng nghe thấu cảm và không ngắt lời hay tranh cãi phòng thủ khi khách hàng đang bức xúc",
          "Ghi nhận đầy đủ các phản ánh cụ thể của khách hàng, xác nhận lại để đảm bảo đã hiểu đúng trọng tâm vấn đề",
          "Chuyển hướng cuộc trò chuyện sang kế hoạch hành động: trình bày rõ ràng các bước cô lập sự cố, cam kết thời hạn khắc phục và phương thức cập nhật tiến độ minh bạch cho khách hàng"
        ],
        "followUps": [
          "Tại sao việc xin lỗi chân thành về trải nghiệm không tốt của khách hàng lại giúp hạ nhiệt căng thẳng nhanh chóng?",
          "Làm thế nào để bảo vệ đội ngũ kỹ thuật nội bộ trước các chỉ trích quá đà của khách hàng?"
        ],
        "tags": [
          "Customer De-escalation",
          "Crisis Communication",
          "Active Listening",
          "Professional Composure"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tranh cãi đôi co với khách hàng hoặc đổ lỗi cho khách hàng không biết dùng phần mềm"
        ]
      },
      {
        "id": "QC-BEHAV-04",
        "role": "QC Specialist",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Khi bản thân em vô tình phát hiện ra một tài liệu nghiệm thu quan trọng do chính mình ký duyệt trước đây có một sai sót số liệu, em hành động và chịu trách nhiệm ra sao?",
        "evaluationCriteria": [
          "Trung thực và minh bạch: chủ động báo cáo ngay lập tức cho quản lý trực tiếp và các bên liên quan về sai sót phát hiện được, không che giấu",
          "Đánh giá ngay mức độ ảnh hưởng của sai sót đó đến các quyết định hoặc giai đoạn tiếp theo của dự án",
          "Đề xuất phương án đính chính chính thức bằng phụ lục hoặc bản hiệu chỉnh tài liệu, rút kinh nghiệm sâu sắc để kiểm tra kỹ lưỡng hơn trong tương lai"
        ],
        "followUps": [
          "Tại sao tính liêm chính và trung thực lại là phẩm chất số 1 của một người làm công tác kiểm soát chất lượng?",
          "Làm thế nào để duy trì sự cẩn trọng và không bị cuốn theo thói quen kiểm tra qua loa?"
        ],
        "tags": [
          "Professional Integrity",
          "Accountability",
          "Self-Correction",
          "Transparency"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Âm thầm sửa tài liệu lén lút hoặc che giấu sai sót với hy vọng không ai phát hiện ra"
        ]
      },
      {
        "id": "QC-BEHAV-05",
        "role": "QC Specialist",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Làm thế nào để em thúc đẩy và lan tỏa 'Văn hóa Chất lượng Tự thân' (Quality Culture) trong toàn công ty, để mỗi lập trình viên, designer, và product manager đều tự giác xem mình là một người kiểm soát chất lượng?",
        "evaluationCriteria": [
          "Tuyên truyền triết lý: 'Chất lượng không thể kiểm tra vào một sản phẩm, nó phải được xây dựng vào sản phẩm ngay từ đầu'",
          "Công khai minh bạch các chỉ số chất lượng và vinh danh các cá nhân, dự án có sáng kiến nâng cao chất lượng tiêu biểu",
          "Tổ chức các chương trình đào tạo nội bộ thực tế, cung cấp các bộ công cụ tự kiểm tra (Self-check tools) giúp các thành viên dễ dàng làm đúng ngay từ lần đầu tiên"
        ],
        "followUps": [
          "Làm thế nào để gắn chất lượng vào tiêu chí đánh giá hiệu quả công việc (KPIs/OKRs) của toàn bộ nhân viên?",
          "Cách duy trì ngọn lửa nhiệt huyết về chất lượng trong một tổ chức đang phát triển nóng?"
        ],
        "tags": [
          "Quality Culture",
          "Whole Team Quality",
          "Leadership Advocacy",
          "Continuous Excellence"
        ],
        "sourceRefs": [
          "Kinh nghiệm vận hành và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Xem chất lượng là việc độc quyền của riêng phòng QC và để mặc các bộ phận khác làm việc thiếu trách nhiệm"
        ]
      }
    ]
  },
  {
    "role": "SDET (Software Dev Engineer in Test)",
    "group": "testingQA",
    "groupLabel": "Kiểm thử & Chất lượng",
    "aliases": [
      "sdet",
      "software development engineer in test",
      "software dev engineer in test",
      "test automation architect",
      "ky su phat trien kiem thu"
    ],
    "questions": [
      {
        "id": "SDET-FOUND-01",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong SDET (Software Dev Engineer in Test), phân biệt SDET, Test Framework Architecture, Page Object Model, Clean Code; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của SDET.",
          "Phân biệt được các khái niệm liên quan Test Framework Architecture, Page Object Model, Clean Code ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí SDET (Software Dev Engineer in Test)."
        ],
        "followUps": [
          "Nếu mới học SDET, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "SDET",
          "Test Framework Architecture",
          "Page Object Model",
          "Clean Code"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "https://martinfowler.com/articles/practical-test-pyramid.html"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "SDET-FOUND-02",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Nguyên lý thực thi kiểm thử song song (Parallel Execution) an toàn đa luồng (Thread-safety) hoạt động như thế nào trong JUnit 5 / TestNG hoặc Playwright Workers? Cần quản lý WebDriver instance và Test Context như thế nào để tránh race condition?",
        "evaluationCriteria": [
          "Sử dụng ThreadLocal để cô lập WebDriver instance cho từng luồng thực thi trong Java/Selenium",
          "Hiểu cơ chế isolated worker processes và browser contexts trong Playwright",
          "Tránh sử dụng biến static chia sẻ trạng thái dùng chung giữa các test methods"
        ],
        "followUps": [
          "Làm thế nào để xử lý deadlock hoặc cạn kiệt tài nguyên (CPU, RAM, Socket connection) khi chạy 16 workers song song?",
          "Tại sao test database state lại là điểm nghẽn lớn nhất khi chạy test song song?"
        ],
        "tags": [
          "Thread-safety",
          "Parallel Execution",
          "ThreadLocal",
          "Playwright Workers"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "https://www.selenium.dev/documentation/"
        ],
        "redFlags": [
          "Sử dụng biến WebDriver toàn cục (public static WebDriver driver) khi chạy kiểm thử đa luồng"
        ]
      },
      {
        "id": "SDET-FOUND-03",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Kiểm thử hợp đồng (Contract Testing) giải quyết vấn đề gì mà E2E Testing truyền thống gặp bế tắc trong kiến trúc Microservices? Phân biệt Consumer-Driven Contract và Provider Contract bằng công cụ như Pact?",
        "evaluationCriteria": [
          "E2E test microservices thường chậm, dễ vỡ (brittle), phụ thuộc môi trường tích hợp đầy đủ",
          "Contract Testing kiểm tra thỏa thuận payload/schema giữa Consumer và Provider một cách độc lập mà không cần dựng toàn bộ cụm services",
          "Pact sinh file contract (pact file) từ consumer test và chạy xác minh tự động trên CI của provider"
        ],
        "followUps": [
          "Pact Broker hỗ trợ quản lý phiên bản và tính năng can-i-deploy ra sao?",
          "Khi nào nên dùng Schema Validation thông thường và khi nào bắt buộc dùng Contract Testing?"
        ],
        "tags": [
          "Contract Testing",
          "Pact",
          "Microservices",
          "API Testing"
        ],
        "sourceRefs": [
          "https://docs.pact.io/",
          "https://martinfowler.com/articles/practical-test-pyramid.html"
        ],
        "redFlags": [
          "Nghĩ rằng Contract Testing thay thế hoàn toàn Unit Testing hoặc kiểm tra sâu về business logic bên trong service"
        ]
      },
      {
        "id": "SDET-FOUND-04",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Thế nào là một kiến trúc phần mềm 'dễ kiểm thử' (Testability)? SDET cần tác động lên thiết kế mã nguồn của Developer như thế nào (Dependency Injection, Idempotency, Test Hooks, Observable State) để việc tự động hóa hiệu quả?",
        "evaluationCriteria": [
          "Thiết kế mã nguồn tuân thủ SOLID, Dependency Injection để dễ dàng tiêm Mock/Stub",
          "Các API phục vụ kiểm thử có tính Idempotent và cung cấp test endpoints/cleanup hooks an toàn",
          "Giao diện bổ sung các thuộc tính testability ổn định như data-testid thay vì phụ thuộc vào XPath động phức tạp"
        ],
        "followUps": [
          "Làm sao để cân bằng giữa việc thêm test hooks hỗ trợ kiểm thử và rủi ro rò rỉ mã test lên production?",
          "SDET đóng góp ý kiến vào Architecture Review như thế nào để nâng cao tính kiểm thử?"
        ],
        "tags": [
          "Testability",
          "Software Architecture",
          "Dependency Injection",
          "data-testid"
        ],
        "sourceRefs": [
          "https://martinfowler.com/articles/practical-test-pyramid.html",
          "https://www.istqb.org/certifications/certified-tester-foundation-level"
        ],
        "redFlags": [
          "Chấp nhận thiết kế khó kiểm thử và cố gắng viết các kịch bản test workaround phức tạp, dễ gãy"
        ]
      },
      {
        "id": "SDET-FOUND-05",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Chỉ số Code Coverage (Line, Branch) có hạn chế gì khi đánh giá chất lượng thực sự của bộ kiểm thử? Kỹ thuật Mutation Testing (Kiểm thử đột biến với Pitest/Stryker) hoạt động ra sao để đo lường độ tin cậy của test suite?",
        "evaluationCriteria": [
          "Code coverage 100% không chứng minh được code không có lỗi vì không đảm bảo assertion đầy đủ",
          "Mutation Testing cố ý tiêm các lỗi nhỏ (mutants: đổi toán tử > thành <, xóa dòng lệnh) vào code nguồn",
          "Một test suite chất lượng cao phải 'tiêu diệt' (kill) được các mutant đó; tỷ lệ sống sót của mutant phản ánh lỗ hổng trong assertion"
        ],
        "followUps": [
          "Chi phí thực thi của Mutation Testing rất cao trên dự án lớn, làm sao để tối ưu hóa thời gian chạy trên CI?",
          "Làm thế nào để thuyết phục team dev áp dụng Mutation Testing cho các module thanh toán trọng yếu?"
        ],
        "tags": [
          "Mutation Testing",
          "Code Coverage",
          "Pitest",
          "Test Suite Quality"
        ],
        "sourceRefs": [
          "https://pitest.org/",
          "https://martinfowler.com/articles/practical-test-pyramid.html"
        ],
        "redFlags": [
          "Tuyệt đối hóa chỉ số 100% Line Coverage mà không quan tâm đến chất lượng của các câu lệnh assert"
        ]
      },
      {
        "id": "SDET-FOUND-06",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Mô hình Shift-Left và Shift-Right trong chiến lược kiểm thử phần mềm khác biệt như thế nào? SDET triển khai những công cụ và kỹ thuật cụ thể nào ở cả hai đầu của quy trình?",
        "evaluationCriteria": [
          "Shift-Left: Đưa kiểm thử về sớm nhất có thể (Static Analysis với SonarQube, Pre-commit hooks, Unit/Component test tự động trên PR)",
          "Shift-Right: Kiểm thử và theo dõi trên môi trường thực tế (Synthetic Monitoring, Feature Flags, Chaos Testing, Log Tracing)",
          "SDET không chỉ viết automation test mà kiến tạo toàn bộ hạ tầng bảo đảm chất lượng xuyên suốt SDLC"
        ],
        "followUps": [
          "Làm thế nào để thiết lập Synthetic Monitoring mô phỏng hành vi người dùng thật trên production mỗi 5 phút?",
          "Dark Launching và Canary Deployment hỗ trợ kiểm thử tính năng mới an toàn ra sao?"
        ],
        "tags": [
          "Shift-Left",
          "Shift-Right",
          "Synthetic Monitoring",
          "SDLC Quality"
        ],
        "sourceRefs": [
          "https://www.istqb.org/certifications/certified-tester-foundation-level",
          "https://martinfowler.com/articles/practical-test-pyramid.html"
        ],
        "redFlags": [
          "Chỉ tập trung vào automation test sau khi phần mềm đã đóng gói và bàn giao sang môi trường QA"
        ]
      },
      {
        "id": "SDET-SKILL-01",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Playwright (TypeScript, Fixtures, Auto-waiting) cho SDET (Software Dev Engineer in Test): em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Playwright trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Playwright",
          "TypeScript",
          "Fixtures",
          "Auto-waiting"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "SDET-SKILL-02",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập SDET (Software Dev Engineer in Test): dựa trên Docker, phối hợp Kubernetes, Containerized Testing, Test Infrastructure; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Docker trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Docker",
          "Kubernetes",
          "Containerized Testing",
          "Test Infrastructure"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "https://docs.docker.com/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "SDET-SKILL-03",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi kiểm thử hệ thống tích hợp bên thứ ba (Cổng thanh toán Stripe/VNPay, SMS OTP), em thiết kế hệ thống Mock/Stub bằng WireMock hoặc MSW (Mock Service Worker) như thế nào để độc lập môi trường?",
        "evaluationCriteria": [
          "Dựng WireMock server hoặc MSW handlers mô phỏng chính xác cả kịch bản thành công lẫn các mã lỗi mạng/timeout",
          "Hỗ trợ State Scenario trong WireMock để test quy trình thanh toán nhiều bước (Khởi tạo -> Xác thực -> Hoàn tất)",
          "Cấu hình chuyển đổi linh hoạt giữa real service và mock service thông qua biến môi trường"
        ],
        "followUps": [
          "Làm sao để đảm bảo mock service luôn phản ánh đúng hành vi của API bên thứ ba khi họ thay đổi phiên bản?",
          "Cách ghi lại (Record & Playback) traffic thực tế từ sandbox để làm stub mẫu trong WireMock?"
        ],
        "tags": [
          "WireMock",
          "MSW",
          "Mocking",
          "Integration Testing"
        ],
        "sourceRefs": [
          "https://wiremock.org/docs/",
          "https://mswjs.io/docs/"
        ],
        "redFlags": [
          "Phụ thuộc hoàn toàn vào môi trường sandbox bên thứ ba hay chập chờn khiến bài test CI thường xuyên rớt oan"
        ]
      },
      {
        "id": "SDET-SKILL-04",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Thiết kế một bộ kiểm thử tự động API toàn diện bằng REST-Assured hoặc Supertest kết hợp JSON Schema Validator. Quy trình tự động refresh Auth Token và kiểm tra tính toàn vẹn dữ liệu được xử lý thế nào?",
        "evaluationCriteria": [
          "Tạo Request/Response Specification dùng chung (Base URI, Headers, Logging filters)",
          "Kiểm tra tự động cấu trúc schema JSON bằng json-schema-validator trước khi assert chi tiết trường dữ liệu",
          "Bộ lọc Filter tự động kiểm tra token hết hạn và gọi API refresh token trong suốt chuỗi test suites"
        ],
        "followUps": [
          "Làm thế nào để trích xuất dữ liệu trả về từ API trước để truyền làm tham số cho API kế tiếp một cách mượt mà?",
          "Cách xử lý logging có che giấu dữ liệu nhạy cảm (Passwords, Tokens) khi test chạy trên CI công khai?"
        ],
        "tags": [
          "REST-Assured",
          "Supertest",
          "JSON Schema",
          "API Automation"
        ],
        "sourceRefs": [
          "https://rest-assured.io/"
        ],
        "redFlags": [
          "Chỉ assert HTTP Status Code 200 mà không kiểm tra cấu trúc schema hay nội dung phản hồi"
        ]
      },
      {
        "id": "SDET-SKILL-05",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Chiến lược quản trị dữ liệu kiểm thử (Test Data Management - TDM): Em xử lý bài toán sinh dữ liệu động (Dynamic Seeding) và dọn dẹp dữ liệu (Cleanup/Teardown) ra sao để các bài test độc lập hoàn toàn?",
        "evaluationCriteria": [
          "Sử dụng thư viện Data Factory kết hợp Faker để sinh dữ liệu ngẫu nhiên có nghĩa cho từng phiên test",
          "Sử dụng API trực tiếp hoặc direct database queries để seed pre-conditions thay vì thao tác qua UI",
          "Cơ chế cleanup tự động qua hooks hoặc sử dụng Database Transactions có rollback sau mỗi bài test"
        ],
        "followUps": [
          "Trong trường hợp test bị crash đột ngột giữa chừng, làm thế nào để đảm bảo dữ liệu rác không lưu lại trong database?",
          "Tại sao việc hardcoded tài khoản test 'testuser@gmail.com' lại gây họa khi chạy parallel?"
        ],
        "tags": [
          "Test Data Management",
          "Data Factory",
          "Seeding",
          "Database Cleanup"
        ],
        "sourceRefs": [
          "https://martinfowler.com/articles/practical-test-pyramid.html",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Phụ thuộc vào dữ liệu cố định trong database và để các bài test làm bẩn dữ liệu của nhau"
        ]
      },
      {
        "id": "SDET-SKILL-06",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em xây dựng pipeline CI/CD trên GitHub Actions hoặc GitLab CI để tự động chạy kiểm thử khi có Pull Request như thế nào? Kỹ thuật Test Sharding (phân mảnh bài test) được cấu hình ra sao để tối ưu thời gian?",
        "evaluationCriteria": [
          "Cấu hình ma trận matrix: { shard: [1/4, 2/4, 3/4, 4/4] } để phân chia song song các file test trên nhiều máy ảo",
          "Tích hợp tính năng PR comment báo cáo số lượng pass/fail kèm đường link xem Playwright HTML report / Allure report",
          "Chỉ chạy bộ smoke test nhanh trên PR thông thường, và chạy bộ regression đầy đủ khi merge vào main"
        ],
        "followUps": [
          "Làm thế nào để merge nhiều file kết quả blob report từ các shards thành một bản report tổng thể duy nhất?",
          "Cách thiết lập rule chặn merge PR (Quality Gate) nếu tỷ lệ test thất bại > 0% hoặc coverage giảm?"
        ],
        "tags": [
          "CI/CD",
          "GitHub Actions",
          "Test Sharding",
          "Allure Report"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "https://docs.github.com/en/actions"
        ],
        "redFlags": [
          "Chạy toàn bộ 1000 test case tuần tự trên 1 máy ảo duy nhất trong pipeline làm tắc nghẽn cả team phát triển"
        ]
      },
      {
        "id": "SDET-SKILL-07",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Làm thế nào để viết Custom Matchers và Assertions mở rộng (sử dụng AssertJ trong Java hoặc Chai/Jest trong JavaScript/TypeScript) nhằm cung cấp thông báo lỗi rõ ràng, mang tính đặc thù của nghiệp vụ?",
        "evaluationCriteria": [
          "Tạo custom assertion class kế thừa AbstractAssert trong AssertJ hoặc expect.extend trong Jest/Playwright",
          "Viết thông báo lỗi chi tiết chỉ ra rõ giá trị kỳ vọng (Expected) so với giá trị thực tế (Actual) theo ngôn ngữ nghiệp vụ",
          "Giúp code test trở nên thanh thoát, dễ đọc tựa như câu văn (Fluent Assertion)"
        ],
        "followUps": [
          "Ưu điểm của Soft Assertions là gì và khi nào nên dùng thay thế Hard Assertions?",
          "Làm thế nào để gom nhóm nhiều lỗi assertion trong một màn hình phức tạp mà không dừng test ngay lỗi đầu tiên?"
        ],
        "tags": [
          "Custom Matchers",
          "AssertJ",
          "Fluent Assertions",
          "Soft Assertions"
        ],
        "sourceRefs": [
          "https://assertj.github.io/doc/"
        ],
        "redFlags": [
          "Viết câu lệnh assert chung chung `assertTrue(result)` khiến khi fail chỉ báo `expected true but found false` không rõ lý do"
        ]
      },
      {
        "id": "SDET-SKILL-08",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Em tích hợp kiểm thử hiệu năng nhẹ (Performance Smoke Testing với k6) và kiểm thử độ bền (Resilience / Chaos Testing) vào luồng CI/CD như thế nào để phát hiện hồi quy hiệu năng (Performance Regression)?",
        "evaluationCriteria": [
          "Viết k6 script dạng code (JavaScript) đặt cùng repo và định nghĩa ngưỡng chấp nhận (Thresholds: p95 < 200ms, error rate < 1%)",
          "Chạy k6 smoke test tự động sau khi deploy lên staging để verify các API huyết mạch",
          "Sử dụng Toxiproxy để giả lập rớt mạng, tăng độ trễ 2000ms nhằm kiểm tra tính năng retry và circuit breaker của client"
        ],
        "followUps": [
          "Làm thế nào để phân biệt giữa lỗi suy giảm hiệu năng do code mới và do biến động tài nguyên hạ tầng staging?",
          "Cách lưu trữ lịch sử chỉ số latency qua các bản build để vẽ biểu đồ xu hướng (Trend Analysis)?"
        ],
        "tags": [
          "k6",
          "Performance Smoke",
          "Thresholds",
          "Toxiproxy",
          "Chaos Testing"
        ],
        "sourceRefs": [
          "https://k6.io/docs/using-k6/thresholds/"
        ],
        "redFlags": [
          "Nghĩ rằng kiểm thử hiệu năng chỉ là việc làm định kỳ cuối quý chứ không thể tự động hóa trong CI/CD"
        ]
      },
      {
        "id": "SDET-SCEN-01",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại SDET (Software Dev Engineer in Test), khi Flaky Tests cùng Quarantine, Root Cause Analysis, Test Reliability xuất hiện và kết quả kiểm thử thay đổi giữa các lần chạy, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong SDET (Software Dev Engineer in Test).",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Flaky Tests",
          "Quarantine",
          "Root Cause Analysis",
          "Test Reliability"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://playwright.dev/docs/intro"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "SDET-SCEN-02",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Toàn bộ suite E2E test gồm 600 ca kiểm thử mất gần 2 giờ để chạy xong, khiến thời gian phản hồi PR quá chậm. Em thực hiện chiến lược tái cấu trúc và tối ưu hóa hạ tầng test ra sao để rút ngắn thời gian xuống dưới 15 phút mà không giảm độ bao phủ?",
        "evaluationCriteria": [
          "Rà soát kim tự tháp kiểm thử: đẩy 60% các kịch bản kiểm tra logic chi tiết xuống tầng API và Component test",
          "Áp dụng Test Sharding chạy trên 8 containers song song trên Kubernetes",
          "Triển khai Smart Test Execution: chỉ chạy các test suite liên quan trực tiếp đến các file code bị thay đổi trong PR (dựa trên git diff)"
        ],
        "followUps": [
          "Làm thế nào để xây dựng bản đồ phụ thuộc (Dependency Graph) giữa mã nguồn frontend/backend và các file test E2E?",
          "Chi phí tài nguyên đám mây thay đổi ra sao khi chuyển từ chạy tuần tự sang chạy song song nhiều máy ảo ngắn hạn?"
        ],
        "tags": [
          "Test Optimization",
          "Execution Time",
          "Test Pyramid",
          "Smart Test Selection"
        ],
        "sourceRefs": [
          "https://martinfowler.com/articles/practical-test-pyramid.html",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cắt bỏ bừa bãi các bài test quan trọng chỉ để làm đẹp con số thời gian chạy pipeline"
        ]
      },
      {
        "id": "SDET-SCEN-03",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Khi chạy kiểm thử song song 4 workers trên cùng một cơ sở dữ liệu Staging, các bài test liên tục bị fail do xung đột khóa chính (Duplicate Key) và tranh chấp dữ liệu giữa các luồng. Em giải quyết triệt để vấn đề cô lập dữ liệu thế nào?",
        "evaluationCriteria": [
          "Sinh dữ liệu động với tiền tố ID hoặc UUID duy nhất gắn liền với Worker ID và Test Run ID",
          "Thiết lập chiến lược multi-tenancy ảo: mỗi worker thao tác trên một không gian tenant riêng biệt",
          "Sử dụng database container tạm thời (ephemeral database) hoặc transaction rollback cho các test thao tác ghi dữ liệu nặng"
        ],
        "followUps": [
          "Khi bắt buộc phải kiểm thử tính năng thống kê toàn bảng (Aggregate Query), làm sao để tránh ảnh hưởng từ worker khác?",
          "Cách sử dụng Testcontainers để cấp phát một instance PostgreSQL riêng biệt cho mỗi suite kiểm thử?"
        ],
        "tags": [
          "Data Isolation",
          "Parallel Testing",
          "Testcontainers",
          "Concurrency Conflict"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://testcontainers.com/"
        ],
        "redFlags": [
          "Giải quyết xung đột bằng cách cho chạy tuần tự từng test một làm tăng gấp 4 lần thời gian chờ"
        ]
      },
      {
        "id": "SDET-SCEN-04",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Hệ thống xử lý đơn hàng chuyển đổi sang kiến trúc hướng sự kiện (Event-Driven) dùng Kafka. Sau khi bấm nút 'Đặt hàng' trên web, trạng thái đơn chuyển sang 'Đã tiếp nhận', nhưng việc trừ kho và gửi email diễn ra bất đồng bộ qua message queue. Em thiết kế bài test tự động xác minh toàn trình ra sao mà không dùng sleep tĩnh?",
        "evaluationCriteria": [
          "Tách bài test thành 2 giai đoạn: Verify UI phản hồi tức thời 'Đã tiếp nhận', sau đó verify sự kiện qua Consumer API",
          "Sử dụng thư viện Awaitility (Java) hoặc custom polling helper (TypeScript) để kiểm tra trạng thái với timeout tối đa (vd: chờ tối đa 10s, kiểm tra mỗi 500ms)",
          "Kết nối trực tiếp vào Kafka topic test để assert message payload được publish đúng định dạng và partition"
        ],
        "followUps": [
          "Nếu message bị đẩy vào Dead Letter Queue (DLQ), làm thế nào để test framework phát hiện và báo lỗi ngay lập tức?",
          "Làm thế nào để mock broker Kafka khi chạy kiểm thử tích hợp cô lập ở máy cá nhân?"
        ],
        "tags": [
          "Event-Driven Testing",
          "Kafka",
          "Awaitility",
          "Asynchronous Verification"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://github.com/awaitility/awaitility"
        ],
        "redFlags": [
          "Sử dụng Thread.sleep(15000) cứng để chờ message xử lý xong, làm bài test vừa chậm vừa không chắc chắn"
        ]
      },
      {
        "id": "SDET-SCEN-05",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Một đợt cập nhật lớn của hệ thống làm thay đổi toàn bộ cấu trúc DOM và class names (chuyển sang CSS Modules hoặc Tailwind mã hóa ngẫu nhiên), khiến 80% locators trong automation suite bị gãy hàng loạt. Em tổ chức chiến lược sửa chữa khẩn cấp và nâng cấp độ bền vững của locators thế nào?",
        "evaluationCriteria": [
          "Chuyển đổi toàn bộ locators sang Accessible Roles (getByRole, getByLabel, getByText) và data-testid chuẩn hóa",
          "Thỏa thuận với team Frontend quy chuẩn đặt `data-testid` bắt buộc cho tất cả các thành phần tương tác trong Design System",
          "Viết script tự động quét và cảnh báo các component mới chưa có data-testid ngay từ khâu pull request của dev"
        ],
        "followUps": [
          "Tại sao việc bám theo Accessible Role (như button name='Thanh toán') lại bền vững hơn và hỗ trợ luôn cả accessibility?",
          "Trong các trường hợp component phức tạp (Shadow DOM, Canvas, iframe), giải pháp định danh phần tử là gì?"
        ],
        "tags": [
          "Locator Resilience",
          "data-testid",
          "Accessibility Locators",
          "Refactoring Suite"
        ],
        "sourceRefs": [
          "https://playwright.dev/docs/intro",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tiếp tục sử dụng các đường dẫn XPath tuyệt đối dài ngoằng (vd: /html/body/div[2]/div[1]/button) để sửa tạm thời"
        ]
      },
      {
        "id": "SDET-SCEN-06",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Sản phẩm chuẩn bị ra mắt tính năng thanh toán quốc tế mới. Ban giám đốc yêu cầu phải có một đợt đánh giá độ bền (Resilience Testing) mô phỏng tình huống mạng chập chờn, API cổng thanh toán phản hồi chậm 10 giây hoặc trả về mã lỗi 503 ngẫu nhiên. Em triển khai kịch bản kiểm thử tự động này thế nào?",
        "evaluationCriteria": [
          "Sử dụng tính năng Network Interception của Playwright/Puppeteer hoặc proxy như MockServer/Toxiproxy để can thiệp tầng mạng",
          "Giả lập độ trễ (latency injection) và lỗi ngắt kết nối (connection drop) tại đúng thời điểm client gọi API thanh toán",
          "Kiểm tra xem ứng dụng có hiển thị thông báo lỗi rõ ràng, cho phép retry an toàn và không bị trừ tiền lặp lại (kiểm tra Idempotency)"
        ],
        "followUps": [
          "Làm thế nào để xác minh cơ chế Circuit Breaker của backend có tự động mở khi cổng thanh toán liên tục trả về lỗi 503?",
          "Quy trình bàn giao kết quả Resilience Test này cho đội SRE và Backend diễn ra ra sao?"
        ],
        "tags": [
          "Resilience Testing",
          "Chaos Simulation",
          "Network Interception",
          "Idempotency"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://github.com/Shopify/toxiproxy"
        ],
        "redFlags": [
          "Chỉ kiểm thử trên môi trường mạng hoàn hảo và cho rằng lỗi mạng là việc của hạ tầng không cần test"
        ]
      },
      {
        "id": "SDET-CV-01",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong dự án em ghi trong CV về việc xây dựng mới hoặc tái cấu trúc Test Automation Framework từ đầu: Em đã lựa chọn tech stack dựa trên tiêu chí nào, cấu trúc kiến trúc framework ra sao và mang lại con số định lượng cụ thể gì cho dự án?",
        "evaluationCriteria": [
          "Trình bày rõ lý do chọn ngôn ngữ và thư viện (vd: Playwright/TypeScript vì đồng bộ tech stack với team FE, tốc độ nhanh)",
          "Mô tả kiến trúc module hóa: core, driver, reporting, test data, CI runners",
          "Dẫn chứng số liệu cụ thể: giảm thời gian chạy hồi quy từ 3 ngày xuống 30 phút, tỷ lệ pass ổn định > 98%"
        ],
        "followUps": [
          "Khó khăn kỹ thuật lớn nhất ngoài dự kiến khi thiết kế framework đó là gì và em đã giải quyết ra sao?",
          "Framework đó được bao nhiêu thành viên trong team sử dụng và quy trình đóng góp mã nguồn (contribution guidelines) như thế nào?"
        ],
        "tags": [
          "CV Validation",
          "Framework Design",
          "ROI",
          "Quantitative Impact"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nói chung chung là dùng framework có sẵn trên mạng mà không giải thích được cấu trúc hay quyết định kỹ thuật"
        ]
      },
      {
        "id": "SDET-CV-02",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "CV của em có nhắc đến việc tích hợp kiểm thử tự động vào CI/CD pipeline làm Quality Gate chặn lỗi trước khi release. Em đã thiết lập tiêu chí Quality Gate cụ thể nào và xử lý tình huống 'báo động giả' (false alarm) làm tắc nghẽn deploy ra sao?",
        "evaluationCriteria": [
          "Định nghĩa Quality Gate rõ ràng: 100% Smoke tests pass, 0 blocker bugs, coverage không giảm, không có CVE bảo mật cao",
          "Cơ chế tự động phân loại lỗi: phân biệt giữa lỗi hệ thống (infrastructure timeout) và lỗi ứng dụng thực tế",
          "Quy trình bypass khẩn cấp (Hotfix Override) có thẩm quyền phê duyệt rõ ràng từ Tech Lead/QA Lead"
        ],
        "followUps": [
          "Làm thế nào để duy trì sự tôn trọng của các lập trình viên đối với Quality Gate mà không bị xem là rào cản làm chậm tiến độ?",
          "Tỷ lệ phát hiện lỗi sớm trên pipeline so với lỗi lọt lên production (Defect Escape Rate) thay đổi ra sao?"
        ],
        "tags": [
          "CI/CD Gate",
          "Quality Gate",
          "False Alarm",
          "Release Pipeline"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thiết lập rule quá cứng nhắc khiến pipeline liên tục fail vì lỗi mạng làm cả team bỏ qua luôn kết quả test"
        ]
      },
      {
        "id": "SDET-CV-03",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi trên CV kinh nghiệm tự động hóa kiểm thử API và dịch vụ Microservices. Em đã thiết kế chiến lược quản lý môi trường (Environment Config) và xử lý phụ thuộc dữ liệu giữa các dịch vụ như thế nào trong dự án thực tế?",
        "evaluationCriteria": [
          "Tách biệt biến môi trường qua tệp cấu hình động (.env hoặc config maps) cho từng môi trường (Dev, Staging, Pre-prod)",
          "Sử dụng API token quản trị để tự động thiết lập dữ liệu mẫu cần thiết trước mỗi đợt chạy test",
          "Áp dụng mocking cho các dịch vụ bên ngoài chưa sẵn sàng hoặc có chi phí gọi API cao"
        ],
        "followUps": [
          "Khi một microservice phụ thuộc bị cập nhật schema bất ngờ, bộ test của em phát hiện và cảnh báo ra sao?",
          "Em đã từng xây dựng công cụ nội bộ nào để hỗ trợ team dev tự chạy test API trên máy local chưa?"
        ],
        "tags": [
          "Microservices Testing",
          "Environment Management",
          "API Dependencies"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Hardcode địa chỉ IP và token cố định trong mã nguồn kiểm thử"
        ]
      },
      {
        "id": "SDET-CV-04",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong một dự án kiểm thử hiệu năng hoặc tải trọng mà em từng thực hiện trên CV: Hãy mô tả chi tiết mô hình tải (Load Profile), số lượng Virtual Users (VU), các chỉ số đo lường (RPS, Latency p95/p99) và điểm nghẽn cổ chai (Bottleneck) lớn nhất mà em đã phát hiện?",
        "evaluationCriteria": [
          "Mô tả kịch bản tải thực tế: Ramp-up, Steady state, Ramp-down phản ánh giờ cao điểm của người dùng",
          "Chỉ rõ các metrics theo dõi: Throughput (RPS), Response Time Percentiles (p90, p95, p99), Error Rate, CPU/Memory Utilization",
          "Phát hiện chính xác bottleneck: thiếu Database Connection Pool, thiếu Indexing hoặc rò rỉ bộ nhớ ở backend"
        ],
        "followUps": [
          "Sau khi phát hiện bottleneck, em đã phối hợp với team Dev và DevOps thế nào để xác minh việc tối ưu thành công?",
          "Làm thế nào để đảm bảo môi trường test tải phản ánh đúng tỷ lệ tương xứng với production?"
        ],
        "tags": [
          "Performance Testing",
          "Load Profile",
          "Bottleneck Analysis",
          "k6 / JMeter"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ đưa ra con số người dùng ảo chung chung mà không nắm được các chỉ số phân vị p95/p99 hay nguyên nhân gây nghẽn"
        ]
      },
      {
        "id": "SDET-CV-05",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Một dự án trong CV có đề cập đến việc giảm thiểu Flaky Test hoặc nâng cao độ tin cậy của bộ kiểm thử tự động. Em đã dùng phương pháp đo lường khoa học nào để chứng minh tỷ lệ thành công của cải tiến đó?",
        "evaluationCriteria": [
          "Thu thập số liệu lịch sử chạy test qua CI analytics (Test Analytics Dashboard) để tính toán Flakiness Index",
          "Gắn thẻ phân loại nguyên nhân gây flaky: 40% do locator không ổn định, 35% do dữ liệu trùng, 25% do độ trễ mạng",
          "Chứng minh kết quả: đưa tỷ lệ pass lần chạy đầu tiên (First-time Pass Rate) từ 75% lên 96%, tiết kiệm trung bình 10 giờ chờ đợi mỗi tuần cho team"
        ],
        "followUps": [
          "Biện pháp nào em thực hiện để duy trì chất lượng đó lâu dài sau khi em rời dự án?",
          "Em thiết lập quy định Code Review cho test code như thế nào để ngăn chặn các bài test kém chất lượng mới được đưa vào?"
        ],
        "tags": [
          "Flakiness Metric",
          "First-time Pass Rate",
          "Test Analytics",
          "Engineering Quality"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tự nhận tỷ lệ flaky giảm về 0% mà không đưa ra được bất kỳ số liệu hay dashboard đo lường chứng minh"
        ]
      },
      {
        "id": "SDET-BEHAV-01",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi lập trình viên cho rằng 'Việc kiểm thử là trách nhiệm của SDET/QA, dev chỉ cần tập trung viết tính năng cho kịp deadline', em làm thế nào để thay đổi nhận thức và xây dựng văn hóa chất lượng (Quality Culture) trong toàn đội ngũ?",
        "evaluationCriteria": [
          "Tổ chức chia sẻ kiến thức, hướng dẫn dev cách viết unit test và integration test dễ dàng bằng các mẫu template có sẵn",
          "Thuyết phục dựa trên số liệu: chi phí sửa bug lúc dev vừa viết code rẻ hơn 10 lần so với lúc test E2E phát hiện",
          "Cung cấp công cụ CI/CD mượt mà để dev nhận kết quả phản hồi kiểm thử tự động ngay trong 5 phút sau khi push code"
        ],
        "followUps": [
          "Nếu một senior developer kiên quyết từ chối viết test cho module mới của họ, em xử lý tình huống đó thế nào?",
          "Em làm thế nào để việc viết test trở thành một phần tự nhiên trong Definition of Done (DoD) của Sprint?"
        ],
        "tags": [
          "Quality Culture",
          "Evangelism",
          "Definition of Done",
          "Collaboration"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chấp nhận làm thay toàn bộ công việc test cho dev hoặc xung đột gay gắt mang tính cá nhân"
        ]
      },
      {
        "id": "SDET-BEHAV-02",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Khi sắp đến giờ release sản phẩm lên Production nhưng một bài test tự động quan trọng bất ngờ bị fail, Tech Lead đề xuất tạm thời `@Ignore` (bỏ qua) bài test đó để kịp tiến độ release. Em đánh giá rủi ro và thương lượng trong tình huống này ra sao?",
        "evaluationCriteria": [
          "Bình tĩnh điều tra nhanh trong 15 phút: xác định đây là bug nghiệp vụ thực tế hay lỗi do môi trường/test script",
          "Nếu là bug thực tế: trình bày rõ ràng mức độ rủi ro kinh doanh và kịch bản ảnh hưởng đến người dùng cuối cho Tech Lead và Product Owner",
          "Nếu buộc phải release khẩn cấp: yêu cầu ghi nhận rủi ro chính thức, tạo ticket hotfix ưu tiên cao nhất ngay sau release và thiết lập giám sát chủ động"
        ],
        "followUps": [
          "Em đã từng phải kiên quyết giữ vững quyết định chặn release (Block Release) chưa? Hậu quả và bài học là gì?",
          "Làm thế nào để tránh tình trạng bài test bị gắn `@Ignore` rồi bị lãng quên vĩnh viễn trong codebase?"
        ],
        "tags": [
          "Risk Assessment",
          "Release Pressure",
          "Negotiation",
          "Blocker Decision"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Dễ dàng nhượng bộ bỏ qua bài test mà không phân tích rủi ro, hoặc chống đối cứng nhắc mà không đưa ra giải pháp thay thế"
        ]
      },
      {
        "id": "SDET-BEHAV-03",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Các lập trình viên phàn nàn rằng bộ test tự động của em chạy quá lâu và thường xuyên báo lỗi sai khiến họ bị chậm nhịp độ làm việc. Em tiếp nhận phản hồi tiêu cực này như thế nào và các bước hành động cụ thể để lấy lại niềm tin của đội ngũ?",
        "evaluationCriteria": [
          "Lắng nghe cởi mở, không tự ái hay bảo thủ bảo vệ bộ test của mình",
          "Khảo sát và ngồi trực tiếp cùng dev để trải nghiệm nỗi đau của họ khi chạy test",
          "Minh bạch lộ trình khắc phục: cam kết rút ngắn thời gian chạy 50% trong 2 tuần và đưa các bài test thiếu ổn định vào diện cách ly ngay lập tức"
        ],
        "followUps": [
          "Làm thế nào để biến các developers thành đồng minh cùng tham gia đóng góp cải tiến framework kiểm thử?",
          "Em báo cáo tiến độ khắc phục độ ổn định của hệ thống test cho team như thế nào?"
        ],
        "tags": [
          "Feedback Reception",
          "Customer Empathy",
          "Continuous Improvement",
          "Developer Trust"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đổ lỗi ngược lại cho dev là 'do code của các anh nhiều bug nên test mới fail'"
        ]
      },
      {
        "id": "SDET-BEHAV-04",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Sau khi phát hành phiên bản mới, một lỗi nghiêm trọng lọt lên Production (Defect Escape) do bộ automation test của em không bao phủ kịch bản này. Em tham gia buổi họp Post-mortem (Rút kinh nghiệm sự cố) với tinh thần thế nào và đề xuất giải pháp gì?",
        "evaluationCriteria": [
          "Tham gia với tinh thần cầu thị không đổ lỗi (Blameless Post-mortem), thẳng thắn nhận diện lỗ hổng trong kịch bản kiểm thử",
          "Phân tích nguyên nhân gốc rễ: tại sao test case không bắt được bug (thiếu dữ liệu biên, hay do logic assertion bị sót)",
          "Bổ sung ngay bài test tự động tái hiện chính xác bug đó vào Regression Suite để đảm bảo lỗi không bao giờ tái diễn (Never Regression)"
        ],
        "followUps": [
          "Làm thế nào để biến một sự cố nghiêm trọng thành cơ hội nâng cấp quy trình chất lượng của toàn team?",
          "Em có cập nhật lại checklist thiết kế test case sau sự cố đó không?"
        ],
        "tags": [
          "Blameless Post-Mortem",
          "Defect Escape",
          "Root Cause Analysis",
          "Accountability"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tìm cách bao biện, chối bỏ trách nhiệm hoặc đổ lỗi cho QA thủ công hay bên phân tích yêu cầu"
        ]
      },
      {
        "id": "SDET-BEHAV-05",
        "role": "SDET (Software Dev Engineer in Test)",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "senior_lead",
        "question": "Trong vai trò một SDET có thâm niên, em đã từng hướng dẫn (mentor) hoặc chuyển giao năng lực tự động hóa cho các bạn Manual QA hoặc kỹ sư mới vào nghề như thế nào? Em giúp họ vượt qua rào cản sợ lập trình ra sao?",
        "evaluationCriteria": [
          "Xây dựng lộ trình học tập từng bước: từ tư duy lập trình cơ bản, cách đọc hiểu DOM, đến sử dụng các helper function có sẵn trong framework",
          "Thực hiện Pair Programming: ngồi code cùng nhau để hướng dẫn cách debug bài test và viết locator chuẩn",
          "Tạo môi trường an toàn để các bạn dám thử và sai, kiên nhẫn review code test và khen ngợi sự tiến bộ"
        ],
        "followUps": [
          "Tiêu chí nào để em đánh giá một Manual QA đã sẵn sàng tự chủ viết và duy trì các bài test tự động độc lập?",
          "Em duy trì tài liệu hướng dẫn (Documentation) cho framework ra sao để nhân sự mới có thể onboard nhanh chóng?"
        ],
        "tags": [
          "Mentorship",
          "Knowledge Sharing",
          "Upskilling QA",
          "Pair Programming"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Giữ khư khư bí quyết kỹ thuật một mình, coi thường khả năng lập trình của Manual QA"
        ]
      }
    ]
  }
];
