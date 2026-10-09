const { q, SRC } = require('./fe_data.cjs');

const TEST_SRC = {
  istqb: "https://www.istqb.org/certifications/certified-tester-foundation-level",
  playwright: "https://playwright.dev/docs/intro",
  selenium: "https://www.selenium.dev/documentation/",
  pact: "https://docs.pact.io/",
  martin_fowler: "https://martinfowler.com/articles/practical-test-pyramid.html",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 5. SDET (Software Dev Engineer in Test)
const sdetQuestions = [
  // Foundation (6)
  q("SDET-FOUND-01", "SDET (Software Dev Engineer in Test)", "foundation", "intermediate", "junior",
    "Trình bày cấu trúc phân tầng kiến trúc của một Test Automation Framework hiện đại (từ Driver Management, Page Object/Screenplay, Test Data, Assertion đến Reporting). Tại sao việc tách biệt logic kiểm thử và logic tương tác giao diện lại mang tính sống còn?",
    ["Tách bạch rõ rệt giữa Test Layer (chứa asserts và kịch bản nghiệp vụ) và Page Object/Interaction Layer", "Cơ chế quản lý cấu hình tập trung (environment, browser capabilities, timeouts)", "Dễ bảo trì: khi UI thay đổi locator thì chỉ cần sửa ở 1 nơi duy nhất mà không phải sửa hàng trăm test scripts"],
    ["Tại sao áp dụng Screenplay Pattern lại giúp framework có khả năng mở rộng tốt hơn Page Object Model truyền thống?", "Làm thế nào để thiết kế custom exception handling giúp báo cáo lỗi rõ nghĩa cho team dev?"],
    ["SDET", "Test Framework Architecture", "Page Object Model", "Clean Code"],
    [TEST_SRC.playwright, TEST_SRC.martin_fowler],
    ["Viết trực tiếp các lệnh tìm kiếm locator và click/type lẫn lộn ngay trong phương thức test case"]
  ),
  q("SDET-FOUND-02", "SDET (Software Dev Engineer in Test)", "foundation", "advanced", "middle",
    "Nguyên lý thực thi kiểm thử song song (Parallel Execution) an toàn đa luồng (Thread-safety) hoạt động như thế nào trong JUnit 5 / TestNG hoặc Playwright Workers? Cần quản lý WebDriver instance và Test Context như thế nào để tránh race condition?",
    ["Sử dụng ThreadLocal để cô lập WebDriver instance cho từng luồng thực thi trong Java/Selenium", "Hiểu cơ chế isolated worker processes và browser contexts trong Playwright", "Tránh sử dụng biến static chia sẻ trạng thái dùng chung giữa các test methods"],
    ["Làm thế nào để xử lý deadlock hoặc cạn kiệt tài nguyên (CPU, RAM, Socket connection) khi chạy 16 workers song song?", "Tại sao test database state lại là điểm nghẽn lớn nhất khi chạy test song song?"],
    ["Thread-safety", "Parallel Execution", "ThreadLocal", "Playwright Workers"],
    [TEST_SRC.playwright, TEST_SRC.selenium],
    ["Sử dụng biến WebDriver toàn cục (public static WebDriver driver) khi chạy kiểm thử đa luồng"]
  ),
  q("SDET-FOUND-03", "SDET (Software Dev Engineer in Test)", "foundation", "advanced", "middle",
    "Kiểm thử hợp đồng (Contract Testing) giải quyết vấn đề gì mà E2E Testing truyền thống gặp bế tắc trong kiến trúc Microservices? Phân biệt Consumer-Driven Contract và Provider Contract bằng công cụ như Pact?",
    ["E2E test microservices thường chậm, dễ vỡ (brittle), phụ thuộc môi trường tích hợp đầy đủ", "Contract Testing kiểm tra thỏa thuận payload/schema giữa Consumer và Provider một cách độc lập mà không cần dựng toàn bộ cụm services", "Pact sinh file contract (pact file) từ consumer test và chạy xác minh tự động trên CI của provider"],
    ["Pact Broker hỗ trợ quản lý phiên bản và tính năng can-i-deploy ra sao?", "Khi nào nên dùng Schema Validation thông thường và khi nào bắt buộc dùng Contract Testing?"],
    ["Contract Testing", "Pact", "Microservices", "API Testing"],
    [TEST_SRC.pact, TEST_SRC.martin_fowler],
    ["Nghĩ rằng Contract Testing thay thế hoàn toàn Unit Testing hoặc kiểm tra sâu về business logic bên trong service"]
  ),
  q("SDET-FOUND-04", "SDET (Software Dev Engineer in Test)", "foundation", "intermediate", "middle",
    "Thế nào là một kiến trúc phần mềm 'dễ kiểm thử' (Testability)? SDET cần tác động lên thiết kế mã nguồn của Developer như thế nào (Dependency Injection, Idempotency, Test Hooks, Observable State) để việc tự động hóa hiệu quả?",
    ["Thiết kế mã nguồn tuân thủ SOLID, Dependency Injection để dễ dàng tiêm Mock/Stub", "Các API phục vụ kiểm thử có tính Idempotent và cung cấp test endpoints/cleanup hooks an toàn", "Giao diện bổ sung các thuộc tính testability ổn định như data-testid thay vì phụ thuộc vào XPath động phức tạp"],
    ["Làm sao để cân bằng giữa việc thêm test hooks hỗ trợ kiểm thử và rủi ro rò rỉ mã test lên production?", "SDET đóng góp ý kiến vào Architecture Review như thế nào để nâng cao tính kiểm thử?"],
    ["Testability", "Software Architecture", "Dependency Injection", "data-testid"],
    [TEST_SRC.martin_fowler, TEST_SRC.istqb],
    ["Chấp nhận thiết kế khó kiểm thử và cố gắng viết các kịch bản test workaround phức tạp, dễ gãy"]
  ),
  q("SDET-FOUND-05", "SDET (Software Dev Engineer in Test)", "foundation", "advanced", "senior_lead",
    "Chỉ số Code Coverage (Line, Branch) có hạn chế gì khi đánh giá chất lượng thực sự của bộ kiểm thử? Kỹ thuật Mutation Testing (Kiểm thử đột biến với Pitest/Stryker) hoạt động ra sao để đo lường độ tin cậy của test suite?",
    ["Code coverage 100% không chứng minh được code không có lỗi vì không đảm bảo assertion đầy đủ", "Mutation Testing cố ý tiêm các lỗi nhỏ (mutants: đổi toán tử > thành <, xóa dòng lệnh) vào code nguồn", "Một test suite chất lượng cao phải 'tiêu diệt' (kill) được các mutant đó; tỷ lệ sống sót của mutant phản ánh lỗ hổng trong assertion"],
    ["Chi phí thực thi của Mutation Testing rất cao trên dự án lớn, làm sao để tối ưu hóa thời gian chạy trên CI?", "Làm thế nào để thuyết phục team dev áp dụng Mutation Testing cho các module thanh toán trọng yếu?"],
    ["Mutation Testing", "Code Coverage", "Pitest", "Test Suite Quality"],
    ["https://pitest.org/", TEST_SRC.martin_fowler],
    ["Tuyệt đối hóa chỉ số 100% Line Coverage mà không quan tâm đến chất lượng của các câu lệnh assert"]
  ),
  q("SDET-FOUND-06", "SDET (Software Dev Engineer in Test)", "foundation", "intermediate", "middle",
    "Mô hình Shift-Left và Shift-Right trong chiến lược kiểm thử phần mềm khác biệt như thế nào? SDET triển khai những công cụ và kỹ thuật cụ thể nào ở cả hai đầu của quy trình?",
    ["Shift-Left: Đưa kiểm thử về sớm nhất có thể (Static Analysis với SonarQube, Pre-commit hooks, Unit/Component test tự động trên PR)", "Shift-Right: Kiểm thử và theo dõi trên môi trường thực tế (Synthetic Monitoring, Feature Flags, Chaos Testing, Log Tracing)", "SDET không chỉ viết automation test mà kiến tạo toàn bộ hạ tầng bảo đảm chất lượng xuyên suốt SDLC"],
    ["Làm thế nào để thiết lập Synthetic Monitoring mô phỏng hành vi người dùng thật trên production mỗi 5 phút?", "Dark Launching và Canary Deployment hỗ trợ kiểm thử tính năng mới an toàn ra sao?"],
    ["Shift-Left", "Shift-Right", "Synthetic Monitoring", "SDLC Quality"],
    [TEST_SRC.istqb, TEST_SRC.martin_fowler],
    ["Chỉ tập trung vào automation test sau khi phần mềm đã đóng gói và bàn giao sang môi trường QA"]
  ),

  // Practical Skills (8)
  q("SDET-SKILL-01", "SDET (Software Dev Engineer in Test)", "practical_skills", "intermediate", "middle",
    "Khi xây dựng framework kiểm thử E2E với Playwright và TypeScript, em tổ chức cấu trúc Fixtures, Page Objects, và cơ chế Auto-waiting ra sao để loại bỏ hoàn toàn các câu lệnh sleep cứng?",
    ["Tận dụng Playwright custom test.extend để inject Page Objects qua Fixtures tự động khởi tạo và dọn dẹp", "Sử dụng locator assertions với auto-retrying (expect(locator).toBeVisible()) thay cho hardcoded timeout", "Tổ chức class Page Object rõ ràng, phương thức trả về instance hoặc page tiếp theo"],
    ["Fixtures trong Playwright có ưu điểm gì vượt trội so với BeforeEach/AfterEach truyền thống?", "Cách xử lý custom dynamic wait cho các hiệu ứng animation CSS kéo dài hơn bình thường?"],
    ["Playwright", "TypeScript", "Fixtures", "Auto-waiting"],
    [TEST_SRC.playwright],
    ["Sử dụng page.waitForTimeout() hoặc Thread.sleep() rải rác khắp các bài test"]
  ),
  q("SDET-SKILL-02", "SDET (Software Dev Engineer in Test)", "practical_skills", "advanced", "senior_lead",
    "Em triển khai giải pháp container hóa hạ tầng kiểm thử tự động với Docker và Kubernetes như thế nào để chạy hàng trăm test cases song song với thời gian khởi tạo môi trường dưới 2 phút?",
    ["Đóng gói test runtime và dependencies vào Docker image tối ưu nhiều tầng (multi-stage build)", "Sử dụng Kubernetes Jobs hoặc KEDA để tự động scale-out số lượng test runner pods dựa trên số lượng test queues", "Cấu hình chia sẻ bộ nhớ tạm /dev/shm để tránh crash trình duyệt Chrome/Chromium khi chạy headless"],
    ["Làm thế nào để thu thập artifacts (video, trace, screenshot) từ các ephemeral pods khi test thất bại?", "Chiến lược cache npm/maven dependencies trong Docker build để tăng tốc khởi tạo runner?"],
    ["Docker", "Kubernetes", "Containerized Testing", "Test Infrastructure"],
    [TEST_SRC.playwright, "https://docs.docker.com/"],
    ["Cố định số lượng máy ảo test thủ công dẫn đến nghẽn hàng đợi CI trong giờ cao điểm"]
  ),
  q("SDET-SKILL-03", "SDET (Software Dev Engineer in Test)", "practical_skills", "intermediate", "middle",
    "Khi kiểm thử hệ thống tích hợp bên thứ ba (Cổng thanh toán Stripe/VNPay, SMS OTP), em thiết kế hệ thống Mock/Stub bằng WireMock hoặc MSW (Mock Service Worker) như thế nào để độc lập môi trường?",
    ["Dựng WireMock server hoặc MSW handlers mô phỏng chính xác cả kịch bản thành công lẫn các mã lỗi mạng/timeout", "Hỗ trợ State Scenario trong WireMock để test quy trình thanh toán nhiều bước (Khởi tạo -> Xác thực -> Hoàn tất)", "Cấu hình chuyển đổi linh hoạt giữa real service và mock service thông qua biến môi trường"],
    ["Làm sao để đảm bảo mock service luôn phản ánh đúng hành vi của API bên thứ ba khi họ thay đổi phiên bản?", "Cách ghi lại (Record & Playback) traffic thực tế từ sandbox để làm stub mẫu trong WireMock?"],
    ["WireMock", "MSW", "Mocking", "Integration Testing"],
    ["https://wiremock.org/docs/", "https://mswjs.io/docs/"],
    ["Phụ thuộc hoàn toàn vào môi trường sandbox bên thứ ba hay chập chờn khiến bài test CI thường xuyên rớt oan"]
  ),
  q("SDET-SKILL-04", "SDET (Software Dev Engineer in Test)", "practical_skills", "intermediate", "junior",
    "Thiết kế một bộ kiểm thử tự động API toàn diện bằng REST-Assured hoặc Supertest kết hợp JSON Schema Validator. Quy trình tự động refresh Auth Token và kiểm tra tính toàn vẹn dữ liệu được xử lý thế nào?",
    ["Tạo Request/Response Specification dùng chung (Base URI, Headers, Logging filters)", "Kiểm tra tự động cấu trúc schema JSON bằng json-schema-validator trước khi assert chi tiết trường dữ liệu", "Bộ lọc Filter tự động kiểm tra token hết hạn và gọi API refresh token trong suốt chuỗi test suites"],
    ["Làm thế nào để trích xuất dữ liệu trả về từ API trước để truyền làm tham số cho API kế tiếp một cách mượt mà?", "Cách xử lý logging có che giấu dữ liệu nhạy cảm (Passwords, Tokens) khi test chạy trên CI công khai?"],
    ["REST-Assured", "Supertest", "JSON Schema", "API Automation"],
    ["https://rest-assured.io/"],
    ["Chỉ assert HTTP Status Code 200 mà không kiểm tra cấu trúc schema hay nội dung phản hồi"]
  ),
  q("SDET-SKILL-05", "SDET (Software Dev Engineer in Test)", "practical_skills", "advanced", "middle",
    "Chiến lược quản trị dữ liệu kiểm thử (Test Data Management - TDM): Em xử lý bài toán sinh dữ liệu động (Dynamic Seeding) và dọn dẹp dữ liệu (Cleanup/Teardown) ra sao để các bài test độc lập hoàn toàn?",
    ["Sử dụng thư viện Data Factory kết hợp Faker để sinh dữ liệu ngẫu nhiên có nghĩa cho từng phiên test", "Sử dụng API trực tiếp hoặc direct database queries để seed pre-conditions thay vì thao tác qua UI", "Cơ chế cleanup tự động qua hooks hoặc sử dụng Database Transactions có rollback sau mỗi bài test"],
    ["Trong trường hợp test bị crash đột ngột giữa chừng, làm thế nào để đảm bảo dữ liệu rác không lưu lại trong database?", "Tại sao việc hardcoded tài khoản test 'testuser@gmail.com' lại gây họa khi chạy parallel?"],
    ["Test Data Management", "Data Factory", "Seeding", "Database Cleanup"],
    [TEST_SRC.martin_fowler, TEST_SRC.internal],
    ["Phụ thuộc vào dữ liệu cố định trong database và để các bài test làm bẩn dữ liệu của nhau"]
  ),
  q("SDET-SKILL-06", "SDET (Software Dev Engineer in Test)", "practical_skills", "intermediate", "middle",
    "Em xây dựng pipeline CI/CD trên GitHub Actions hoặc GitLab CI để tự động chạy kiểm thử khi có Pull Request như thế nào? Kỹ thuật Test Sharding (phân mảnh bài test) được cấu hình ra sao để tối ưu thời gian?",
    ["Cấu hình ma trận matrix: { shard: [1/4, 2/4, 3/4, 4/4] } để phân chia song song các file test trên nhiều máy ảo", "Tích hợp tính năng PR comment báo cáo số lượng pass/fail kèm đường link xem Playwright HTML report / Allure report", "Chỉ chạy bộ smoke test nhanh trên PR thông thường, và chạy bộ regression đầy đủ khi merge vào main"],
    ["Làm thế nào để merge nhiều file kết quả blob report từ các shards thành một bản report tổng thể duy nhất?", "Cách thiết lập rule chặn merge PR (Quality Gate) nếu tỷ lệ test thất bại > 0% hoặc coverage giảm?"],
    ["CI/CD", "GitHub Actions", "Test Sharding", "Allure Report"],
    [TEST_SRC.playwright, "https://docs.github.com/en/actions"],
    ["Chạy toàn bộ 1000 test case tuần tự trên 1 máy ảo duy nhất trong pipeline làm tắc nghẽn cả team phát triển"]
  ),
  q("SDET-SKILL-07", "SDET (Software Dev Engineer in Test)", "practical_skills", "intermediate", "junior",
    "Làm thế nào để viết Custom Matchers và Assertions mở rộng (sử dụng AssertJ trong Java hoặc Chai/Jest trong JavaScript/TypeScript) nhằm cung cấp thông báo lỗi rõ ràng, mang tính đặc thù của nghiệp vụ?",
    ["Tạo custom assertion class kế thừa AbstractAssert trong AssertJ hoặc expect.extend trong Jest/Playwright", "Viết thông báo lỗi chi tiết chỉ ra rõ giá trị kỳ vọng (Expected) so với giá trị thực tế (Actual) theo ngôn ngữ nghiệp vụ", "Giúp code test trở nên thanh thoát, dễ đọc tựa như câu văn (Fluent Assertion)"],
    ["Ưu điểm của Soft Assertions là gì và khi nào nên dùng thay thế Hard Assertions?", "Làm thế nào để gom nhóm nhiều lỗi assertion trong một màn hình phức tạp mà không dừng test ngay lỗi đầu tiên?"],
    ["Custom Matchers", "AssertJ", "Fluent Assertions", "Soft Assertions"],
    ["https://assertj.github.io/doc/"],
    ["Viết câu lệnh assert chung chung `assertTrue(result)` khiến khi fail chỉ báo `expected true but found false` không rõ lý do"]
  ),
  q("SDET-SKILL-08", "SDET (Software Dev Engineer in Test)", "practical_skills", "advanced", "senior_lead",
    "Em tích hợp kiểm thử hiệu năng nhẹ (Performance Smoke Testing với k6) và kiểm thử độ bền (Resilience / Chaos Testing) vào luồng CI/CD như thế nào để phát hiện hồi quy hiệu năng (Performance Regression)?",
    ["Viết k6 script dạng code (JavaScript) đặt cùng repo và định nghĩa ngưỡng chấp nhận (Thresholds: p95 < 200ms, error rate < 1%)", "Chạy k6 smoke test tự động sau khi deploy lên staging để verify các API huyết mạch", "Sử dụng Toxiproxy để giả lập rớt mạng, tăng độ trễ 2000ms nhằm kiểm tra tính năng retry và circuit breaker của client"],
    ["Làm thế nào để phân biệt giữa lỗi suy giảm hiệu năng do code mới và do biến động tài nguyên hạ tầng staging?", "Cách lưu trữ lịch sử chỉ số latency qua các bản build để vẽ biểu đồ xu hướng (Trend Analysis)?"],
    ["k6", "Performance Smoke", "Thresholds", "Toxiproxy", "Chaos Testing"],
    ["https://k6.io/docs/using-k6/thresholds/"],
    ["Nghĩ rằng kiểm thử hiệu năng chỉ là việc làm định kỳ cuối quý chứ không thể tự động hóa trong CI/CD"]
  ),

  // Scenario (6)
  q("SDET-SCEN-01", "SDET (Software Dev Engineer in Test)", "scenario", "advanced", "middle",
    "Tình huống: Đội ngũ phát triển phản ánh rằng bộ kiểm thử E2E trên CI có tỷ lệ 'Flaky Test' (chập chờn, chạy lại thì pass) lên tới 8%, làm giảm lòng tin của kỹ sư vào hệ thống test. Em áp dụng quy trình điều tra và triệt tiêu Flaky Test như thế nào?",
    ["Cách ly ngay lập tức các bài test flaky sang hàng đợi riêng (quarantine) để không chặn pipeline chính của team dev", "Phân tích logs, video ghi hình và trace của 20 lần chạy liên tiếp để tìm nguyên nhân gốc rễ (race condition, DOM animation, timezone, data collision)", "Sửa lỗi tận gốc bằng auto-retrying locators và deterministic data seeding, tuyệt đối không dùng giải pháp đối phó 'cho retry 3 lần'"],
    ["Làm thế nào để thiết lập bot tự động gắn tag @flaky và tạo ticket Jira khi phát hiện bài test pass sau khi rerun?", "Chỉ số Flakiness Rate được đo lường và theo dõi qua dashboard như thế nào theo thời gian?"],
    ["Flaky Tests", "Quarantine", "Root Cause Analysis", "Test Reliability"],
    [TEST_SRC.internal, TEST_SRC.playwright],
    ["Cài đặt retry 5 lần để bài test cố vượt qua mà không bao giờ tìm nguyên nhân gốc rễ"]
  ),
  q("SDET-SCEN-02", "SDET (Software Dev Engineer in Test)", "scenario", "advanced", "senior_lead",
    "Tình huống: Toàn bộ suite E2E test gồm 600 ca kiểm thử mất gần 2 giờ để chạy xong, khiến thời gian phản hồi PR quá chậm. Em thực hiện chiến lược tái cấu trúc và tối ưu hóa hạ tầng test ra sao để rút ngắn thời gian xuống dưới 15 phút mà không giảm độ bao phủ?",
    ["Rà soát kim tự tháp kiểm thử: đẩy 60% các kịch bản kiểm tra logic chi tiết xuống tầng API và Component test", "Áp dụng Test Sharding chạy trên 8 containers song song trên Kubernetes", "Triển khai Smart Test Execution: chỉ chạy các test suite liên quan trực tiếp đến các file code bị thay đổi trong PR (dựa trên git diff)"],
    ["Làm thế nào để xây dựng bản đồ phụ thuộc (Dependency Graph) giữa mã nguồn frontend/backend và các file test E2E?", "Chi phí tài nguyên đám mây thay đổi ra sao khi chuyển từ chạy tuần tự sang chạy song song nhiều máy ảo ngắn hạn?"],
    ["Test Optimization", "Execution Time", "Test Pyramid", "Smart Test Selection"],
    [TEST_SRC.martin_fowler, TEST_SRC.internal],
    ["Cắt bỏ bừa bãi các bài test quan trọng chỉ để làm đẹp con số thời gian chạy pipeline"]
  ),
  q("SDET-SCEN-03", "SDET (Software Dev Engineer in Test)", "scenario", "intermediate", "middle",
    "Tình huống: Khi chạy kiểm thử song song 4 workers trên cùng một cơ sở dữ liệu Staging, các bài test liên tục bị fail do xung đột khóa chính (Duplicate Key) và tranh chấp dữ liệu giữa các luồng. Em giải quyết triệt để vấn đề cô lập dữ liệu thế nào?",
    ["Sinh dữ liệu động với tiền tố ID hoặc UUID duy nhất gắn liền với Worker ID và Test Run ID", "Thiết lập chiến lược multi-tenancy ảo: mỗi worker thao tác trên một không gian tenant riêng biệt", "Sử dụng database container tạm thời (ephemeral database) hoặc transaction rollback cho các test thao tác ghi dữ liệu nặng"],
    ["Khi bắt buộc phải kiểm thử tính năng thống kê toàn bảng (Aggregate Query), làm sao để tránh ảnh hưởng từ worker khác?", "Cách sử dụng Testcontainers để cấp phát một instance PostgreSQL riêng biệt cho mỗi suite kiểm thử?"],
    ["Data Isolation", "Parallel Testing", "Testcontainers", "Concurrency Conflict"],
    [TEST_SRC.internal, "https://testcontainers.com/"],
    ["Giải quyết xung đột bằng cách cho chạy tuần tự từng test một làm tăng gấp 4 lần thời gian chờ"]
  ),
  q("SDET-SCEN-04", "SDET (Software Dev Engineer in Test)", "scenario", "advanced", "middle",
    "Tình huống: Hệ thống xử lý đơn hàng chuyển đổi sang kiến trúc hướng sự kiện (Event-Driven) dùng Kafka. Sau khi bấm nút 'Đặt hàng' trên web, trạng thái đơn chuyển sang 'Đã tiếp nhận', nhưng việc trừ kho và gửi email diễn ra bất đồng bộ qua message queue. Em thiết kế bài test tự động xác minh toàn trình ra sao mà không dùng sleep tĩnh?",
    ["Tách bài test thành 2 giai đoạn: Verify UI phản hồi tức thời 'Đã tiếp nhận', sau đó verify sự kiện qua Consumer API", "Sử dụng thư viện Awaitility (Java) hoặc custom polling helper (TypeScript) để kiểm tra trạng thái với timeout tối đa (vd: chờ tối đa 10s, kiểm tra mỗi 500ms)", "Kết nối trực tiếp vào Kafka topic test để assert message payload được publish đúng định dạng và partition"],
    ["Nếu message bị đẩy vào Dead Letter Queue (DLQ), làm thế nào để test framework phát hiện và báo lỗi ngay lập tức?", "Làm thế nào để mock broker Kafka khi chạy kiểm thử tích hợp cô lập ở máy cá nhân?"],
    ["Event-Driven Testing", "Kafka", "Awaitility", "Asynchronous Verification"],
    [TEST_SRC.internal, "https://github.com/awaitility/awaitility"],
    ["Sử dụng Thread.sleep(15000) cứng để chờ message xử lý xong, làm bài test vừa chậm vừa không chắc chắn"]
  ),
  q("SDET-SCEN-05", "SDET (Software Dev Engineer in Test)", "scenario", "intermediate", "middle",
    "Tình huống: Một đợt cập nhật lớn của hệ thống làm thay đổi toàn bộ cấu trúc DOM và class names (chuyển sang CSS Modules hoặc Tailwind mã hóa ngẫu nhiên), khiến 80% locators trong automation suite bị gãy hàng loạt. Em tổ chức chiến lược sửa chữa khẩn cấp và nâng cấp độ bền vững của locators thế nào?",
    ["Chuyển đổi toàn bộ locators sang Accessible Roles (getByRole, getByLabel, getByText) và data-testid chuẩn hóa", "Thỏa thuận với team Frontend quy chuẩn đặt `data-testid` bắt buộc cho tất cả các thành phần tương tác trong Design System", "Viết script tự động quét và cảnh báo các component mới chưa có data-testid ngay từ khâu pull request của dev"],
    ["Tại sao việc bám theo Accessible Role (như button name='Thanh toán') lại bền vững hơn và hỗ trợ luôn cả accessibility?", "Trong các trường hợp component phức tạp (Shadow DOM, Canvas, iframe), giải pháp định danh phần tử là gì?"],
    ["Locator Resilience", "data-testid", "Accessibility Locators", "Refactoring Suite"],
    [TEST_SRC.playwright, TEST_SRC.internal],
    ["Tiếp tục sử dụng các đường dẫn XPath tuyệt đối dài ngoằng (vd: /html/body/div[2]/div[1]/button) để sửa tạm thời"]
  ),
  q("SDET-SCEN-06", "SDET (Software Dev Engineer in Test)", "scenario", "advanced", "senior_lead",
    "Tình huống: Sản phẩm chuẩn bị ra mắt tính năng thanh toán quốc tế mới. Ban giám đốc yêu cầu phải có một đợt đánh giá độ bền (Resilience Testing) mô phỏng tình huống mạng chập chờn, API cổng thanh toán phản hồi chậm 10 giây hoặc trả về mã lỗi 503 ngẫu nhiên. Em triển khai kịch bản kiểm thử tự động này thế nào?",
    ["Sử dụng tính năng Network Interception của Playwright/Puppeteer hoặc proxy như MockServer/Toxiproxy để can thiệp tầng mạng", "Giả lập độ trễ (latency injection) và lỗi ngắt kết nối (connection drop) tại đúng thời điểm client gọi API thanh toán", "Kiểm tra xem ứng dụng có hiển thị thông báo lỗi rõ ràng, cho phép retry an toàn và không bị trừ tiền lặp lại (kiểm tra Idempotency)"],
    ["Làm thế nào để xác minh cơ chế Circuit Breaker của backend có tự động mở khi cổng thanh toán liên tục trả về lỗi 503?", "Quy trình bàn giao kết quả Resilience Test này cho đội SRE và Backend diễn ra ra sao?"],
    ["Resilience Testing", "Chaos Simulation", "Network Interception", "Idempotency"],
    [TEST_SRC.internal, "https://github.com/Shopify/toxiproxy"],
    ["Chỉ kiểm thử trên môi trường mạng hoàn hảo và cho rằng lỗi mạng là việc của hạ tầng không cần test"]
  ),

  // CV Validation (5)
  q("SDET-CV-01", "SDET (Software Dev Engineer in Test)", "cv_validation", "intermediate", "middle",
    "Trong dự án em ghi trong CV về việc xây dựng mới hoặc tái cấu trúc Test Automation Framework từ đầu: Em đã lựa chọn tech stack dựa trên tiêu chí nào, cấu trúc kiến trúc framework ra sao và mang lại con số định lượng cụ thể gì cho dự án?",
    ["Trình bày rõ lý do chọn ngôn ngữ và thư viện (vd: Playwright/TypeScript vì đồng bộ tech stack với team FE, tốc độ nhanh)", "Mô tả kiến trúc module hóa: core, driver, reporting, test data, CI runners", "Dẫn chứng số liệu cụ thể: giảm thời gian chạy hồi quy từ 3 ngày xuống 30 phút, tỷ lệ pass ổn định > 98%"],
    ["Khó khăn kỹ thuật lớn nhất ngoài dự kiến khi thiết kế framework đó là gì và em đã giải quyết ra sao?", "Framework đó được bao nhiêu thành viên trong team sử dụng và quy trình đóng góp mã nguồn (contribution guidelines) như thế nào?"],
    ["CV Validation", "Framework Design", "ROI", "Quantitative Impact"],
    [TEST_SRC.internal],
    ["Nói chung chung là dùng framework có sẵn trên mạng mà không giải thích được cấu trúc hay quyết định kỹ thuật"]
  ),
  q("SDET-CV-02", "SDET (Software Dev Engineer in Test)", "cv_validation", "advanced", "senior_lead",
    "CV của em có nhắc đến việc tích hợp kiểm thử tự động vào CI/CD pipeline làm Quality Gate chặn lỗi trước khi release. Em đã thiết lập tiêu chí Quality Gate cụ thể nào và xử lý tình huống 'báo động giả' (false alarm) làm tắc nghẽn deploy ra sao?",
    ["Định nghĩa Quality Gate rõ ràng: 100% Smoke tests pass, 0 blocker bugs, coverage không giảm, không có CVE bảo mật cao", "Cơ chế tự động phân loại lỗi: phân biệt giữa lỗi hệ thống (infrastructure timeout) và lỗi ứng dụng thực tế", "Quy trình bypass khẩn cấp (Hotfix Override) có thẩm quyền phê duyệt rõ ràng từ Tech Lead/QA Lead"],
    ["Làm thế nào để duy trì sự tôn trọng của các lập trình viên đối với Quality Gate mà không bị xem là rào cản làm chậm tiến độ?", "Tỷ lệ phát hiện lỗi sớm trên pipeline so với lỗi lọt lên production (Defect Escape Rate) thay đổi ra sao?"],
    ["CI/CD Gate", "Quality Gate", "False Alarm", "Release Pipeline"],
    [TEST_SRC.internal],
    ["Thiết lập rule quá cứng nhắc khiến pipeline liên tục fail vì lỗi mạng làm cả team bỏ qua luôn kết quả test"]
  ),
  q("SDET-CV-03", "SDET (Software Dev Engineer in Test)", "cv_validation", "intermediate", "middle",
    "Em ghi trên CV kinh nghiệm tự động hóa kiểm thử API và dịch vụ Microservices. Em đã thiết kế chiến lược quản lý môi trường (Environment Config) và xử lý phụ thuộc dữ liệu giữa các dịch vụ như thế nào trong dự án thực tế?",
    ["Tách biệt biến môi trường qua tệp cấu hình động (.env hoặc config maps) cho từng môi trường (Dev, Staging, Pre-prod)", "Sử dụng API token quản trị để tự động thiết lập dữ liệu mẫu cần thiết trước mỗi đợt chạy test", "Áp dụng mocking cho các dịch vụ bên ngoài chưa sẵn sàng hoặc có chi phí gọi API cao"],
    ["Khi một microservice phụ thuộc bị cập nhật schema bất ngờ, bộ test của em phát hiện và cảnh báo ra sao?", "Em đã từng xây dựng công cụ nội bộ nào để hỗ trợ team dev tự chạy test API trên máy local chưa?"],
    ["Microservices Testing", "Environment Management", "API Dependencies"],
    [TEST_SRC.internal],
    ["Hardcode địa chỉ IP và token cố định trong mã nguồn kiểm thử"]
  ),
  q("SDET-CV-04", "SDET (Software Dev Engineer in Test)", "cv_validation", "advanced", "middle",
    "Trong một dự án kiểm thử hiệu năng hoặc tải trọng mà em từng thực hiện trên CV: Hãy mô tả chi tiết mô hình tải (Load Profile), số lượng Virtual Users (VU), các chỉ số đo lường (RPS, Latency p95/p99) và điểm nghẽn cổ chai (Bottleneck) lớn nhất mà em đã phát hiện?",
    ["Mô tả kịch bản tải thực tế: Ramp-up, Steady state, Ramp-down phản ánh giờ cao điểm của người dùng", "Chỉ rõ các metrics theo dõi: Throughput (RPS), Response Time Percentiles (p90, p95, p99), Error Rate, CPU/Memory Utilization", "Phát hiện chính xác bottleneck: thiếu Database Connection Pool, thiếu Indexing hoặc rò rỉ bộ nhớ ở backend"],
    ["Sau khi phát hiện bottleneck, em đã phối hợp với team Dev và DevOps thế nào để xác minh việc tối ưu thành công?", "Làm thế nào để đảm bảo môi trường test tải phản ánh đúng tỷ lệ tương xứng với production?"],
    ["Performance Testing", "Load Profile", "Bottleneck Analysis", "k6 / JMeter"],
    [TEST_SRC.internal],
    ["Chỉ đưa ra con số người dùng ảo chung chung mà không nắm được các chỉ số phân vị p95/p99 hay nguyên nhân gây nghẽn"]
  ),
  q("SDET-CV-05", "SDET (Software Dev Engineer in Test)", "cv_validation", "intermediate", "middle",
    "Một dự án trong CV có đề cập đến việc giảm thiểu Flaky Test hoặc nâng cao độ tin cậy của bộ kiểm thử tự động. Em đã dùng phương pháp đo lường khoa học nào để chứng minh tỷ lệ thành công của cải tiến đó?",
    ["Thu thập số liệu lịch sử chạy test qua CI analytics (Test Analytics Dashboard) để tính toán Flakiness Index", "Gắn thẻ phân loại nguyên nhân gây flaky: 40% do locator không ổn định, 35% do dữ liệu trùng, 25% do độ trễ mạng", "Chứng minh kết quả: đưa tỷ lệ pass lần chạy đầu tiên (First-time Pass Rate) từ 75% lên 96%, tiết kiệm trung bình 10 giờ chờ đợi mỗi tuần cho team"],
    ["Biện pháp nào em thực hiện để duy trì chất lượng đó lâu dài sau khi em rời dự án?", "Em thiết lập quy định Code Review cho test code như thế nào để ngăn chặn các bài test kém chất lượng mới được đưa vào?"],
    ["Flakiness Metric", "First-time Pass Rate", "Test Analytics", "Engineering Quality"],
    [TEST_SRC.internal],
    ["Tự nhận tỷ lệ flaky giảm về 0% mà không đưa ra được bất kỳ số liệu hay dashboard đo lường chứng minh"]
  ),

  // Behavioral (5)
  q("SDET-BEHAV-01", "SDET (Software Dev Engineer in Test)", "behavioral", "intermediate", "junior",
    "Khi lập trình viên cho rằng 'Việc kiểm thử là trách nhiệm của SDET/QA, dev chỉ cần tập trung viết tính năng cho kịp deadline', em làm thế nào để thay đổi nhận thức và xây dựng văn hóa chất lượng (Quality Culture) trong toàn đội ngũ?",
    ["Tổ chức chia sẻ kiến thức, hướng dẫn dev cách viết unit test và integration test dễ dàng bằng các mẫu template có sẵn", "Thuyết phục dựa trên số liệu: chi phí sửa bug lúc dev vừa viết code rẻ hơn 10 lần so với lúc test E2E phát hiện", "Cung cấp công cụ CI/CD mượt mà để dev nhận kết quả phản hồi kiểm thử tự động ngay trong 5 phút sau khi push code"],
    ["Nếu một senior developer kiên quyết từ chối viết test cho module mới của họ, em xử lý tình huống đó thế nào?", "Em làm thế nào để việc viết test trở thành một phần tự nhiên trong Definition of Done (DoD) của Sprint?"],
    ["Quality Culture", "Evangelism", "Definition of Done", "Collaboration"],
    [TEST_SRC.internal],
    ["Chấp nhận làm thay toàn bộ công việc test cho dev hoặc xung đột gay gắt mang tính cá nhân"]
  ),
  q("SDET-BEHAV-02", "SDET (Software Dev Engineer in Test)", "behavioral", "advanced", "middle",
    "Khi sắp đến giờ release sản phẩm lên Production nhưng một bài test tự động quan trọng bất ngờ bị fail, Tech Lead đề xuất tạm thời `@Ignore` (bỏ qua) bài test đó để kịp tiến độ release. Em đánh giá rủi ro và thương lượng trong tình huống này ra sao?",
    ["Bình tĩnh điều tra nhanh trong 15 phút: xác định đây là bug nghiệp vụ thực tế hay lỗi do môi trường/test script", "Nếu là bug thực tế: trình bày rõ ràng mức độ rủi ro kinh doanh và kịch bản ảnh hưởng đến người dùng cuối cho Tech Lead và Product Owner", "Nếu buộc phải release khẩn cấp: yêu cầu ghi nhận rủi ro chính thức, tạo ticket hotfix ưu tiên cao nhất ngay sau release và thiết lập giám sát chủ động"],
    ["Em đã từng phải kiên quyết giữ vững quyết định chặn release (Block Release) chưa? Hậu quả và bài học là gì?", "Làm thế nào để tránh tình trạng bài test bị gắn `@Ignore` rồi bị lãng quên vĩnh viễn trong codebase?"],
    ["Risk Assessment", "Release Pressure", "Negotiation", "Blocker Decision"],
    [TEST_SRC.internal],
    ["Dễ dàng nhượng bộ bỏ qua bài test mà không phân tích rủi ro, hoặc chống đối cứng nhắc mà không đưa ra giải pháp thay thế"]
  ),
  q("SDET-BEHAV-03", "SDET (Software Dev Engineer in Test)", "behavioral", "intermediate", "middle",
    "Các lập trình viên phàn nàn rằng bộ test tự động của em chạy quá lâu và thường xuyên báo lỗi sai khiến họ bị chậm nhịp độ làm việc. Em tiếp nhận phản hồi tiêu cực này như thế nào và các bước hành động cụ thể để lấy lại niềm tin của đội ngũ?",
    ["Lắng nghe cởi mở, không tự ái hay bảo thủ bảo vệ bộ test của mình", "Khảo sát và ngồi trực tiếp cùng dev để trải nghiệm nỗi đau của họ khi chạy test", "Minh bạch lộ trình khắc phục: cam kết rút ngắn thời gian chạy 50% trong 2 tuần và đưa các bài test thiếu ổn định vào diện cách ly ngay lập tức"],
    ["Làm thế nào để biến các developers thành đồng minh cùng tham gia đóng góp cải tiến framework kiểm thử?", "Em báo cáo tiến độ khắc phục độ ổn định của hệ thống test cho team như thế nào?"],
    ["Feedback Reception", "Customer Empathy", "Continuous Improvement", "Developer Trust"],
    [TEST_SRC.internal],
    ["Đổ lỗi ngược lại cho dev là 'do code của các anh nhiều bug nên test mới fail'"]
  ),
  q("SDET-BEHAV-04", "SDET (Software Dev Engineer in Test)", "behavioral", "advanced", "middle",
    "Sau khi phát hành phiên bản mới, một lỗi nghiêm trọng lọt lên Production (Defect Escape) do bộ automation test của em không bao phủ kịch bản này. Em tham gia buổi họp Post-mortem (Rút kinh nghiệm sự cố) với tinh thần thế nào và đề xuất giải pháp gì?",
    ["Tham gia với tinh thần cầu thị không đổ lỗi (Blameless Post-mortem), thẳng thắn nhận diện lỗ hổng trong kịch bản kiểm thử", "Phân tích nguyên nhân gốc rễ: tại sao test case không bắt được bug (thiếu dữ liệu biên, hay do logic assertion bị sót)", "Bổ sung ngay bài test tự động tái hiện chính xác bug đó vào Regression Suite để đảm bảo lỗi không bao giờ tái diễn (Never Regression)"],
    ["Làm thế nào để biến một sự cố nghiêm trọng thành cơ hội nâng cấp quy trình chất lượng của toàn team?", "Em có cập nhật lại checklist thiết kế test case sau sự cố đó không?"],
    ["Blameless Post-Mortem", "Defect Escape", "Root Cause Analysis", "Accountability"],
    [TEST_SRC.internal],
    ["Tìm cách bao biện, chối bỏ trách nhiệm hoặc đổ lỗi cho QA thủ công hay bên phân tích yêu cầu"]
  ),
  q("SDET-BEHAV-05", "SDET (Software Dev Engineer in Test)", "behavioral", "intermediate", "senior_lead",
    "Trong vai trò một SDET có thâm niên, em đã từng hướng dẫn (mentor) hoặc chuyển giao năng lực tự động hóa cho các bạn Manual QA hoặc kỹ sư mới vào nghề như thế nào? Em giúp họ vượt qua rào cản sợ lập trình ra sao?",
    ["Xây dựng lộ trình học tập từng bước: từ tư duy lập trình cơ bản, cách đọc hiểu DOM, đến sử dụng các helper function có sẵn trong framework", "Thực hiện Pair Programming: ngồi code cùng nhau để hướng dẫn cách debug bài test và viết locator chuẩn", "Tạo môi trường an toàn để các bạn dám thử và sai, kiên nhẫn review code test và khen ngợi sự tiến bộ"],
    ["Tiêu chí nào để em đánh giá một Manual QA đã sẵn sàng tự chủ viết và duy trì các bài test tự động độc lập?", "Em duy trì tài liệu hướng dẫn (Documentation) cho framework ra sao để nhân sự mới có thể onboard nhanh chóng?"],
    ["Mentorship", "Knowledge Sharing", "Upskilling QA", "Pair Programming"],
    [TEST_SRC.internal],
    ["Giữ khư khư bí quyết kỹ thuật một mình, coi thường khả năng lập trình của Manual QA"]
  )
];

console.log("SDET questions defined:", sdetQuestions.length);

module.exports = {
  sdetQuestions
};
