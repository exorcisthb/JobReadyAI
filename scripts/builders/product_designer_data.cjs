const { q, SRC } = require('./fe_data.cjs');

const PROD_SRC = {
  nng: "https://www.nngroup.com/articles/",
  svpg: "https://www.svpg.com/articles/",
  ixdf: "https://www.interaction-design.org/literature",
  teresa_torres: "https://www.producttalk.org/",
  material: "https://m3.material.io/",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 4. PRODUCT DESIGNER
const productDesignerQuestions = [
  // Foundation (6)
  q("PROD_DES-FOUND-01", "Product Designer", "foundation", "advanced", "junior",
    "Mô hình Cây giải pháp cơ hội (Opportunity Solution Tree - OST) của Teresa Torres trong thói quen khám phá liên tục (Continuous Discovery Habits): Product Designer sử dụng OST như thế nào để kết nối Mục tiêu kinh doanh (Desired Outcome), Cơ hội/Nhu cầu của người dùng (Opportunities) và các Giải pháp thiết kế tiềm năng (Solutions)?",
    ["Bắt đầu từ Outcome kinh doanh đo lường được (như tăng Retention 10%), không nhảy ngay vào vẽ giải pháp", "Khám phá không gian cơ hội (Opportunity Space) từ nỗi đau và mong muốn thật của người dùng", "Mỗi cơ hội có nhiều giải pháp thiết kế cạnh tranh; tiến hành kiểm tra giả định nhanh (Assumption Testing) thay vì xây dựng toàn bộ giải pháp lớn"],
    ["Tại sao việc tập trung vào Outcome (kết quả đạt được) lại quan trọng hơn Output (số lượng màn hình vẽ ra)?", "Làm thế nào để phối hợp cùng PM và Tech Lead cập nhật OST hàng tuần?"] ,
    ["Opportunity Solution Tree", "Continuous Discovery", "Product Outcomes", "Assumption Testing", "Teresa Torres"],
    [PROD_SRC.teresa_torres, PROD_SRC.svpg],
    ["Xem công việc của mình chỉ là nhận giải pháp có sẵn từ PM rồi vẽ giao diện mà không quan tâm đến bài toán cơ hội"]
  ),
  q("PROD_DES-FOUND-02", "Product Designer", "foundation", "advanced", "middle",
    "Các chỉ số kinh doanh cốt lõi (Business Metrics) mà một Product Designer bắt buộc phải am hiểu: Phân tích mối quan hệ giữa Chỉ số thu hút (CAC), Kích hoạt (Activation Rate), Giữ chân (Retention Rate), Rời bỏ (Churn Rate) và Giá trị vòng đời khách hàng (LTV). Thiết kế sản phẩm tác động trực tiếp lên chỉ số nào mạnh mẽ nhất?",
    ["Thiết kế Onboarding và Time-to-Value tác động trực tiếp nhất lên tỷ lệ Kích hoạt (Activation Rate)", "Trải nghiệm mượt mà, giá trị liên tục và giải quyết đúng nhu cầu tác động sống còn lên Giữ chân (Retention) - xương sống của tăng trưởng bền vững", "Hiểu rõ chi phí để có một khách hàng mới (CAC) đắt gấp nhiều lần chi phí giữ chân khách hàng cũ, từ đó ưu tiên giải quyết các điểm gãy trải nghiệm để giảm Churn"],
    ["Đường cong giữ chân khách hàng (Retention Curve) đi ngang (Flattening) có ý nghĩa sống còn gì đối với Product-Market Fit?", "Chỉ số North Star Metric là gì và Product Designer đóng góp vào việc thúc đẩy chỉ số này ra sao?"] ,
    ["Business Metrics", "Retention Rate", "Activation", "Churn Rate", "North Star Metric"],
    [PROD_SRC.svpg, PROD_SRC.nng],
    ["Nghĩ rằng chỉ số kinh doanh và tài chính là việc riêng của Product Manager, designer chỉ cần lo giao diện đẹp"]
  ),
  q("PROD_DES-FOUND-03", "Product Designer", "foundation", "intermediate", "middle",
    "Khái niệm Sản phẩm khả dụng tối thiểu (Minimum Viable Product - MVP): Phân biệt giữa cách tiếp cận 'Cắt lát dọc' (Vertical Slice - hoạt động được từ đầu đến cuối một tính năng nhỏ) và 'Xây dựng từng tầng' (Layer-by-layer: làm xong hết DB rồi mới tới UI). Product Designer định hình phạm vi MVP như thế nào để vừa kiểm chứng được giả định vừa giữ được trải nghiệm chất lượng?",
    ["MVP không phải là một sản phẩm xấu xí, chắp vá, nhiều lỗi; MVP là phiên bản nhỏ nhất nhưng mang lại giá trị trọn vẹn và giải quyết được một vấn đề cốt lõi", "Cắt lát dọc (Vertical Slice): tạo ra một trải nghiệm hoàn chỉnh dù quy mô hẹp, giúp kiểm chứng được cả tính khả thi kỹ thuật lẫn sự hào hứng của người dùng", "Loại bỏ các tính năng phụ trợ hào nhoáng để dồn lực vào việc hoàn thiện trải nghiệm cốt lõi"],
    ["Khái niệm 'Minimum Lovable Product' (MLP) nâng cấp tư duy thiết kế MVP như thế nào?", "Làm thế nào để đo lường thành công của một bản phát hành MVP?"] ,
    ["MVP", "Vertical Slice", "Minimum Lovable Product", "Hypothesis Testing", "Scoping"],
    [PROD_SRC.svpg, PROD_SRC.ixdf],
    ["Cắt gọt thiết kế đến mức tồi tệ, không sử dụng được rồi dán nhãn 'MVP' để biện minh cho sự cẩu thả"]
  ),
  q("PROD_DES-FOUND-04", "Product Designer", "foundation", "advanced", "middle",
    "Cân bằng giữa Mô hình kiếm tiền (Monetization) và Trải nghiệm người dùng (User Experience): Các chiến lược chuyển đổi từ người dùng miễn phí sang trả phí (Freemium, Free Trial, Reverse Trial) và cách thiết kế Điểm giới hạn (Paywalls / Feature Gates) tự nhiên, không gây ức chế?",
    ["Thiết kế Paywall theo ngữ cảnh (Contextual Paywall): chỉ xuất hiện đúng lúc người dùng vừa nhận ra giá trị vượt trội của tính năng nâng cao", "Minh bạch tuyệt đối về giá, thời hạn dùng thử và quy trình hủy cước để xây dựng niềm tin dài hạn", "Tránh việc khóa chặt các tính năng cơ bản khiến người dùng chưa kịp hiểu giá trị sản phẩm đã nản lòng rời đi"],
    ["Chiến lược 'Reverse Trial' (cho trải nghiệm bản Pro 14 ngày trước khi tự động về bản Free) đem lại chuyển đổi ra sao?", "Cách thiết kế bảng so sánh gói cước (Pricing Table) giúp định hướng người dùng vào gói tối ưu?"] ,
    ["Monetization UX", "Paywall Design", "Freemium", "Pricing Table", "Feature Gating"],
    [PROD_SRC.svpg, PROD_SRC.nng],
    ["Chặn paywall vô tội vạ ngay khi người dùng vừa mở app khiến tỷ lệ xóa app tăng vọt"]
  ),
  q("PROD_DES-FOUND-05", "Product Designer", "foundation", "intermediate", "junior",
    "Bộ ba sản phẩm (Product Trio: Product Manager, Tech Lead, Product Designer): Ranh giới trách nhiệm và sự cộng hưởng kỹ năng giữa ba vai trò này. Tại sao các quyết định thiết kế cần được đưa ra dựa trên sự giao thoa của 3 yếu tố: Tính đáng mong muốn (Desirability - User), Tính khả thi (Feasibility - Tech), và Tính khả thi kinh doanh (Viability - Business)?",
    ["Product Designer dẫn dắt yếu tố Desirability (Người dùng có muốn dùng không?), Tech Lead dẫn dắt Feasibility (Có khả thi công nghệ không?), PM dẫn dắt Viability (Có kiếm ra tiền và phù hợp chiến lược không?)", "Cả 3 cùng tham gia từ ngày đầu tiên của Discovery, chia sẻ chung sự thấu cảm và trách nhiệm về thành bại của sản phẩm", "Tránh mô hình thác nước mini (Waterfall handoff: PM viết PRD -> Designer vẽ -> Dev code)"],
    ["Khi tính khả thi kỹ thuật bị giới hạn làm phương án thiết kế lý tưởng không thể thực hiện, Product Designer xử lý thế nào?", "Cách giải thích trade-offs thiết kế cho Tech Lead bằng ngôn ngữ kiến trúc hệ thống?"] ,
    ["Product Trio", "Desirability", "Feasibility", "Viability", "Dual-track Agile"],
    [PROD_SRC.svpg, PROD_SRC.teresa_torres],
    ["Xem mình là người chỉ có trách nhiệm bảo vệ người dùng và coi Tech Lead cùng PM là những người cản trở"]
  ),
  q("PROD_DES-FOUND-06", "Product Designer", "foundation", "advanced", "senior_lead",
    "Đánh giá sau phát hành (Post-launch Product Evaluation) và Vòng lặp cải tiến liên tục: Sau khi tính năng mới lên Production, Product Designer thiết lập kế hoạch theo dõi hành vi qua Cohort Analysis, phễu chuyển đổi và phỏng vấn người dùng thực tế như thế nào để quyết định: Tiếp tục tối ưu (Iterate), Nhân rộng (Scale), hay Dừng lại/Gỡ bỏ (Kill)?",
    ["Không dừng lại sau khi bàn giao thiết kế; theo dõi sát sao dữ liệu sử dụng trong 30-60 ngày đầu", "Phân tích Cohort Analysis để xem các nhóm người dùng mới có duy trì thói quen sử dụng tính năng đó lâu dài hay chỉ tò mò bấm thử vài ngày đầu", "Dũng cảm đề xuất gỡ bỏ (Kill feature) những tính năng rườm rà không mang lại giá trị để giữ cho sản phẩm tinh gọn"],
    ["Làm thế nào để phân biệt giữa việc tính năng thất bại do ý tưởng tồi hay do thiết kế thực thi chưa tới?", "Quy trình thiết kế luồng dọn dẹp (Sunsetting/Deprecation UX) khi khai tử một tính năng cũ?"] ,
    ["Post-launch Evaluation", "Cohort Analysis", "Feature Sunsetting", "Product Iteration", "Data Analytics"],
    [PROD_SRC.svpg, PROD_SRC.nng],
    ["Phát hành xong là coi như xong việc, nhảy ngay sang vẽ tính năng mới mà không bao giờ quay lại xem tính năng cũ sống chết ra sao"]
  ),

  // Practical Skills (8)
  q("PROD_DES-SKILL-01", "Product Designer", "practical_skills", "advanced", "middle",
    "Quy trình Lập khung bài toán (Problem Framing) và Viết tài liệu đặc tả thiết kế sản phẩm (Product Design Doc / PRD Design Section): Em làm rõ vấn đề, giả định cần kiểm chứng, tiêu chí thành công (Success Metrics) và các kịch bản biên (Edge cases) ra sao trước khi vẽ bất kỳ màn hình nào?",
    ["Bắt đầu bằng Problem Statement rõ ràng: Ai gặp vấn đề gì, ở đâu, tần suất thế nào và hậu quả kinh doanh là gì", "Liệt kê rõ các giả định cốt lõi (Core Assumptions: Value, Usability, Feasibility, Viability) cần kiểm chứng", "Định nghĩa Success Metrics cụ thể trước khi phát hành và liệt kê đầy đủ các kịch bản biên (ngoại tuyến, dữ liệu rỗng, tài khoản bị khóa)"],
    ["Làm thế nào để tổ chức một buổi Design Kickoff hiệu quả với các bên liên quan dựa trên Problem Framing?", "Cách cân đối độ chi tiết của Design Doc để vừa rõ ràng vừa không làm chậm tiến độ Sprint?"] ,
    ["Problem Framing", "Design Doc", "Success Metrics", "Edge Cases", "PRD Collaboration"],
    [PROD_SRC.svpg, PROD_SRC.internal],
    ["Nhảy ngay vào mở Figma vẽ màn hình khi chưa hiểu rõ bài toán cần giải quyết là gì"]
  ),
  q("PROD_DES-SKILL-02", "Product Designer", "practical_skills", "advanced", "middle",
    "Kỹ thuật Kiểm tra giả định nhanh (Assumption Testing) trước khi lập trình: Em thiết kế các thử nghiệm chi phí thấp (Fake Door Test, Smoke Test Landing Page, Clickable Prototype Testing, Wizard of Oz) như thế nào để đo lường nhu cầu thực tế của thị trường trong vòng 48 giờ?",
    ["Fake Door Test: Đặt một nút bấm hoặc banner giới thiệu tính năng mới; khi người dùng bấm vào thì hiển thị thông báo 'Tính năng đang phát triển, hãy để lại email để trải nghiệm sớm' để đo lường Intent", "Wizard of Oz: Giả lập tính năng tự động bằng quy trình xử lý thủ công hậu trường của con người để kiểm chứng giá trị trước khi đầu tư viết code thuật toán phức tạp", "Đo lường tỷ lệ nhấp chuột (Click-through Rate) và tỷ lệ sẵn sàng trả tiền thực tế"],
    ["Làm thế nào để thực hiện Fake Door Test mà không làm người dùng cảm thấy bị lừa dối hay ức chế?", "Khi kết quả kiểm tra giả định cho thấy không ai có nhu cầu, em trình bày với PM để dừng dự án ra sao?"] ,
    ["Assumption Testing", "Fake Door Test", "Wizard of Oz", "Rapid Experimentation", "Demand Validation"],
    [PROD_SRC.teresa_torres, PROD_SRC.svpg],
    ["Bắt buộc dev phải code hoàn thiện tính năng trong 3 tháng chỉ để phát hiện ra không ai dùng"]
  ),
  q("PROD_DES-SKILL-03", "Product Designer", "practical_skills", "advanced", "middle",
    "Thiết kế Bảng so sánh giá và Luồng thanh toán nâng cấp (Pricing & Upgrade Flow): Em áp dụng các nguyên lý tâm lý học định giá (Decoy Effect / Hiệu ứng chim mồi, Anchoring / Mỏ neo giá, Social Proof) vào việc thiết kế giao diện bảng giá như thế nào để tối đa hóa Doanh thu trung bình trên mỗi người dùng (ARPU)?",
    ["Sử dụng Anchoring: Đặt gói cao cấp bên cạnh để làm gói tiêu chuẩn trở nên hấp dẫn và kinh tế hơn", "Decoy Effect: Tạo một lựa chọn mồi để hướng người dùng chọn gói mà doanh nghiệp muốn đẩy mạnh nhất", "Gắn nhãn 'Phổ biến nhất' (Most Popular) và các đánh giá uy tín (Social Proof) để giảm sự do dự tâm lý khi thanh toán"],
    ["Cách hiển thị chuyển đổi giữa thanh toán theo tháng (Monthly) và theo năm (Annual với ưu đãi 'Tiết kiệm 20%') mượt mà?", "Làm thế nào để thiết kế quy trình nâng cấp gói (Upgrade Path) một chạm ngay trong bối cảnh người dùng chạm trần dung lượng?"] ,
    ["Pricing Page UX", "Decoy Effect", "Anchoring", "ARPU Optimization", "Upgrade Flow"],
    [PROD_SRC.nng, PROD_SRC.svpg],
    ["Thiết kế bảng giá rối rắm với hàng chục gạch đầu dòng kỹ thuật khó hiểu khiến người dùng không biết nên mua gói nào"]
  ),
  q("PROD_DES-SKILL-04", "Product Designer", "practical_skills", "advanced", "senior_lead",
    "Thiết kế Cơ chế Thúc đẩy hành vi (Behavioral Design & Habit Loops): Vận dụng Mô hình Hook (Trigger -> Action -> Variable Reward -> Investment) của Nir Eyal và Mô hình hành vi Fogg (B = MAP: Motivation, Ability, Prompt) để thiết kế các tính năng giữ chân người dùng (Retention loops) bền vững?",
    ["Tạo Action đơn giản nhất có thể (tối đa hóa Ability) ngay khi có Prompt xuất hiện", "Áp dụng Phần thưởng biến đổi (Variable Reward: nội dung mới, sự công nhận từ cộng đồng, thành tích) để kích thích sự tò mò", "Khuyến khích người dùng đầu tư công sức (Investment: tải ảnh lên, tùy biến hồ sơ, tích lũy lịch sử) khiến họ gắn bó và khó từ bỏ sản phẩm hơn"],
    ["Làm thế nào để ứng dụng Gamification (Bảng xếp hạng, Huy hiệu, Streak) mà không biến sản phẩm thành trò chơi trẻ con lố bịch?", "Ranh giới đạo đức giữa việc tạo thói quen lành mạnh (Healthy Habits) và tạo nghiện tiêu cực (Addiction)?"] ,
    ["Behavioral Design", "Hook Model", "Fogg Behavior Model", "Retention Loops", "Habit Formation"],
    [PROD_SRC.ixdf, PROD_SRC.internal],
    ["Nhồi nhét vòng quay may mắn và thông báo spam liên tục khiến người dùng bực mình gỡ ứng dụng"]
  ),
  q("PROD_DES-SKILL-05", "Product Designer", "practical_skills", "intermediate", "middle",
    "Phối hợp A/B Testing giữa Product Designer và Data Analyst: Em tham gia vào việc phân tích giả thuyết (Hypothesis Formulation), thiết kế các biến thể giao diện (Variant A vs Variant B), tính toán thời gian chạy thử nghiệm và phân tích kết quả ý nghĩa thống kê (Statistical Significance: p-value < 0.05) như thế nào?",
    ["Xây dựng giả thuyết khoa học: 'Bởi vì [vấn đề quan sát được], chúng tôi tin rằng [thay đổi thiết kế X] sẽ dẫn đến [kết quả Y] đo lường bằng [chỉ số Z]'", "Thiết kế biến thể B có sự khác biệt rõ rệt và cô lập biến số duy nhất để biết chính xác yếu tố nào tạo ra sự thay đổi", "Kiên nhẫn chạy thử nghiệm cho đến khi đạt đủ cỡ mẫu và độ tin cậy thống kê; không kết luận vội vàng sau 2 ngày đầu"],
    ["Khi Variant B thắng về tỷ lệ click (CTR) nhưng lại làm giảm tỷ lệ giữ chân (Retention) sau 30 ngày, em phân tích thế nào?", "Làm thế nào để tránh cạm bẫy 'Tối ưu cục bộ' (Local Maximum) khi chỉ mải mê A/B testing những chi tiết vụn vặt?"] ,
    ["A/B Testing", "Hypothesis Formulation", "Statistical Significance", "Local Maximum", "Variant Design"],
    [PROD_SRC.nng, PROD_SRC.svpg],
    ["Thay đổi 5 yếu tố cùng lúc trong Variant B khiến khi có kết quả không thể biết yếu tố nào thực sự có tác dụng"]
  ),
  q("PROD_DES-SKILL-06", "Product Designer", "practical_skills", "intermediate", "middle",
    "Kỹ thuật Thiết kế Hệ sinh thái Sản phẩm đa nền tảng (Omnichannel / Cross-device Experience): Em đồng bộ hóa trải nghiệm người dùng như thế nào khi họ chuyển đổi qua lại giữa Web Desktop, Mobile App, Tablet và Thông báo qua Email/SMS trong cùng một ngày?",
    ["Đảm bảo tính liên tục của luồng công việc (State Continuity): việc đang làm dở trên máy tính (soạn thảo giỏ hàng, viết bài) phải hiển thị nguyên vẹn ngay khi mở điện thoại", "Tối ưu hóa thế mạnh của từng nền tảng: Desktop tối ưu cho tác vụ quản trị, nhập liệu sâu; Mobile tối ưu cho thao tác nhanh, camera, định vị và duyệt tin tức", "Thiết lập hệ thống thông báo đa kênh thông minh: không gửi thông báo đẩy lặp lại trên điện thoại nếu người dùng đã đọc tin nhắn đó trên web"],
    ["Làm thế nào để thiết kế trải nghiệm Handoff liền mạch giữa các thiết bị?", "Cách duy trì tính nhất quán về mặt tinh thần thương hiệu trong khi vẫn tôn trọng đặc thù phần cứng từng thiết bị?"] ,
    ["Cross-device UX", "Omnichannel", "State Continuity", "Responsive Ecosystem", "Handoff"],
    [PROD_SRC.nng, PROD_SRC.material],
    ["Ép người dùng mobile phải thao tác các tác vụ bảng biểu phức tạp giống hệt desktop mà không tối ưu cho màn hình nhỏ"]
  ),
  q("PROD_DES-SKILL-07", "Product Designer", "practical_skills", "advanced", "middle",
    "Thiết kế Hệ thống Dashboard và Báo cáo phân tích dành cho Khách hàng doanh nghiệp (B2B SaaS Analytics): Em phân cấp các loại báo cáo (Chiến lược - Strategic, Vận hành - Operational, và Phân tích chuyên sâu - Analytical) ra sao để đáp ứng các cấp bậc người dùng từ nhân viên vận hành đến Giám đốc C-level?",
    ["C-level cần Dashboard Chiến lược: các chỉ số tổng quan vĩ mô (High-level KPIs), xu hướng tăng trưởng, cảnh báo đỏ và xuất báo cáo PDF nhanh", "Quản lý cấp trung cần Dashboard Vận hành: tiến độ thời gian thực, cảnh báo tắc nghẽn và phân bổ nguồn lực", "Chuyên viên cần Báo cáo Phân tích: lọc đa chiều, truy vết dữ liệu gốc (Drill-down capability) và xuất dữ liệu thô (Raw CSV)"],
    ["Cách thiết kế biểu đồ trực quan giúp người dùng nhận ra điểm bất thường (Anomaly Detection) ngay lập tức?", "Làm thế nào để tối ưu tốc độ tải trang của Dashboard khi phải truy vấn hàng triệu bản ghi cơ sở dữ liệu?"] ,
    ["B2B SaaS Analytics", "Executive Dashboard", "Drill-down", "Operational Reports", "Data Visualization"],
    [PROD_SRC.nng, PROD_SRC.internal],
    ["Thiết kế một dashboard chung chung hiển thị đầy số liệu kỹ thuật khiến giám đốc không đọc được insight kinh doanh"]
  ),
  q("PROD_DES-SKILL-08", "Product Designer", "practical_skills", "advanced", "senior_lead",
    "Xây dựng Thước đo Trải nghiệm sản phẩm toàn diện theo khung HEART của Google (Happiness, Engagement, Adoption, Retention, Task success): Em thiết lập các Mục tiêu (Goals), Tín hiệu (Signals) và Chỉ số đo lường (Metrics) cụ thể cho từng khía cạnh của một sản phẩm công nghệ ra sao?",
    ["Happiness: Đo lường sự hài lòng qua CSAT, In-app survey", "Engagement: Tần suất tương tác, số phiên hoạt động mỗi tuần, thời lượng sử dụng có ích", "Adoption: Số lượng người dùng mới dùng thử tính năng mới lần đầu trong tháng", "Retention: Tỷ lệ người dùng tiếp tục quay lại dùng tính năng đó sau 30, 60, 90 ngày", "Task success: Thời gian hoàn thành tác vụ và tỷ lệ lỗi khi thực hiện thao tác"],
    ["Làm thế nào để khung đo lường HEART gắn kết trực tiếp với các mục tiêu OKR của toàn công ty?", "Tại sao không nên lạm dụng chỉ số Engagement khi sản phẩm thuộc loại công cụ năng suất (người dùng càng làm xong nhanh càng tốt)?"] ,
    ["Google HEART Framework", "Goals-Signals-Metrics", "Product Metrics", "OKRs", "Product Health"],
    [PROD_SRC.nng, "https://library.gv.com/how-to-choose-the-right-ux-metrics-for-your-product-5f46059d39e3"],
    ["Chỉ đo lường mỗi chỉ số doanh thu mà hoàn toàn mù tịt về sức khỏe trải nghiệm của sản phẩm"]
  ),

  // Scenario (6)
  q("PROD_DES-SCEN-01", "Product Designer", "scenario", "advanced", "middle",
    "Tình huống: Đội ngũ Kinh doanh (Sales) đề xuất hiển thị nhiều banner quảng cáo của các nhãn hàng tài trợ ngay tại màn hình trang chủ để tối đa hóa doanh thu quý này. Tuy nhiên, hành động này sẽ phá vỡ trải nghiệm tinh gọn, gây phản cảm và làm giảm tỷ lệ tương tác với tính năng cốt lõi. Là Product Designer, em giải quyết mâu thuẫn giữa Doanh thu ngắn hạn và Trải nghiệm dài hạn này ra sao?",
    ["Không từ chối thô bạo; ngồi lại với Sales để hiểu mục tiêu số tiền cần đạt và các cam kết với đối tác tài trợ", "Chỉ ra rủi ro dài hạn bằng số liệu: giảm 12% tỷ lệ quay lại của người dùng sẽ làm giảm định giá của toàn bộ nền tảng trong dài hạn", "Đề xuất giải pháp quảng cáo bản địa (Native Sponsored Content): lồng ghép nội dung tài trợ một cách tự nhiên vào luồng khám phá, phù hợp với sở thích của người dùng thay vì banner pop-up chèn ép; đảm bảo minh bạch có nhãn 'Được tài trợ'"],
    ["Làm thế nào để quy định trần giới hạn mật độ quảng cáo (Ad Density Cap: tối đa 1 quảng cáo trên mỗi 5 thẻ nội dung)?", "Cách thiết lập bài toán A/B testing để chứng minh rằng quảng cáo dạng Native đem lại tỷ lệ click và doanh thu cao hơn banner truyền thống?"] ,
    ["Monetization vs UX", "Native Advertising", "Long-term Value", "Ad Density", "Stakeholder Negotiation"],
    [PROD_SRC.internal, PROD_SRC.svpg],
    ["Chấp nhận nhắm mắt xuôi tay để Sales biến trang chủ thành một đống rác quảng cáo"]
  ),
  q("PROD_DES-SCEN-02", "Product Designer", "scenario", "intermediate", "middle",
    "Tình huống: Sau khi ra mắt tính năng mới được đầu tư rất nhiều công sức, số liệu phân tích sau 2 tuần cho thấy: Tỷ lệ người dùng click vào nút tính năng rất cao (80% Adoption), nhưng tỷ lệ quay lại sử dụng lần thứ hai (Retention ngày thứ 7) chỉ vỏn vẹn 5%. Em tiếp cận phân tích và xử lý hiện tượng 'Tò mò rồi bỏ rơi' này như thế nào?",
    ["Xác định nguyên nhân: Tỷ lệ click ban đầu cao là do hiệu ứng tò mò (Curiosity effect) hoặc vị trí nút quá nổi bật, nhưng giá trị bên trong không đáp ứng được kỳ vọng", "Nhanh chóng tiến hành phỏng vấn sâu 8 người dùng đã bấm thử nhưng không quay lại để tìm ra điểm gây thất vọng", "Phát hiện xem sản phẩm có bị hứa hẹn quá lời (Misleading copy), luồng thao tác quá phức tạp ở bước sau hay giá trị mang lại không đủ lớn; từ đó lên kế hoạch tinh chỉnh trải nghiệm cốt lõi hoặc định vị lại tính năng"],
    ["Làm thế nào để cải thiện trải nghiệm 'First-run' giúp người dùng ngay lập tức gặt hái được thành quả trong 60 giây đầu tiên?", "Khi nào nên dũng cảm thừa nhận ý tưởng tính năng đã thất bại hoàn toàn?"] ,
    ["Retention Drop", "Curiosity vs Value", "First-run Experience", "Post-launch Audit"],
    [PROD_SRC.internal, PROD_SRC.svpg],
    ["Cho rằng 80% click ban đầu là thành công lớn và phớt lờ con số 5% retention tồi tệ"]
  ),
  q("PROD_DES-SCEN-03", "Product Designer", "scenario", "advanced", "senior_lead",
    "Tình huống: Công ty quyết định chuyển đổi mô hình kinh doanh từ Mua một lần trọn đời (One-time Purchase) sang Thuê bao định kỳ hàng tháng (Monthly Subscription). Khách hàng trung thành phản ứng dữ dội và đe dọa tẩy chay sản phẩm. Em thiết kế chiến lược trải nghiệm chuyển đổi (Migration UX) như thế nào để xoa dịu khách hàng cũ và thu hút khách hàng mới?",
    ["Tôn trọng quyền lợi của khách hàng cũ: áp dụng chính sách 'Grandfathering' cho phép họ tiếp tục sử dụng các tính năng đã mua trọn đời vĩnh viễn không thu thêm tiền", "Định vị rõ giá trị gia tăng của gói thuê bao mới: liên tục cập nhật tính năng mới, lưu trữ đám mây không giới hạn và dịch vụ hỗ trợ VIP", "Đưa ra ưu đãi tri ân đặc quyền cho khách hàng cũ nâng cấp lên gói thuê bao với mức giá chiết khấu 50% trọn đời"],
    ["Làm thế nào để truyền thông minh bạch lý do chuyển đổi mô hình (chi phí máy chủ, duy trì đội ngũ nâng cấp bảo mật) trong nội dung sản phẩm?", "Cách thiết kế trải nghiệm dùng thử bản thuê bao mới mà không làm gián đoạn bản quyền cũ?"] ,
    ["Business Model Shift", "Subscription Migration", "Grandfathering Policy", "Customer Trust", "Crisis UX"],
    [PROD_SRC.internal, PROD_SRC.svpg],
    ["Cắt đột ngột quyền lợi của người dùng đã trả tiền mua trọn đời và ép họ phải đóng tiền thuê bao tháng"]
  ),
  q("PROD_DES-SCEN-04", "Product Designer", "scenario", "intermediate", "middle",
    "Tình huống: Nhóm kỹ thuật (Engineering) thông báo rằng hệ sinh thái backend đang bị quá tải nghiêm trọng, và họ bắt buộc phải giới hạn số lượng request API của người dùng (Rate Limiting). Người dùng khi chạm ngưỡng sẽ không thể thao tác tiếp trong 15 phút. Em thiết kế trải nghiệm xử lý giới hạn này ra sao để giảm thiểu sự ức chế?",
    ["Tuyệt đối không hiển thị mã lỗi kỹ thuật 429 thô thiển; hiển thị thông báo rõ ràng bằng ngôn ngữ con người kèm đồng hồ đếm ngược thời gian hồi phục", "Hiển thị thanh đo mức độ sử dụng tài nguyên (Usage Quota Meter) từ sớm để người dùng chủ động điều chỉnh nhịp độ làm việc trước khi chạm trần", "Cung cấp nút nâng cấp gói tài nguyên tức thời hoặc hỗ trợ lưu tạm công việc vào bộ nhớ offline của máy khách để không bị mất dữ liệu"],
    ["Làm thế nào để ưu tiên các thao tác quan trọng sống còn (như lưu tài liệu, thanh toán) không bao giờ bị chặn bởi rate limit?", "Cách biến rào cản kỹ thuật thành cơ hội giới thiệu gói dịch vụ chuyên nghiệp (Pro Plan)?"] ,
    ["Rate Limiting UX", "Graceful Degradation", "Usage Quota", "Error Recovery"],
    [PROD_SRC.internal],
    ["Để hệ thống văng lỗi không rõ lý do làm người dùng mất toàn bộ văn bản đang nhập dở"]
  ),
  q("PROD_DES-SCEN-05", "Product Designer", "scenario", "advanced", "middle",
    "Tình huống: Nhóm Product Trio của em đang chuẩn bị phát triển một tính năng lớn theo lộ trình quý, nhưng Tech Lead ước tính thời gian lập trình mất tới 4 tháng, trong khi PM chỉ có ngân sách thời gian 6 tuần. Em dẫn dắt buổi thảo luận cắt tỉa phạm vi (Scoping Workshop) như thế nào để đưa ra một giải pháp thiết kế khả thi trong 6 tuần mà vẫn giữ được 80% giá trị cốt lõi?",
    ["Áp dụng nguyên lý Pareto (80/20): phân tích xem 20% thành phần nào của thiết kế mang lại 80% giá trị cho người dùng", "Chia nhỏ giải pháp thành 3 giai đoạn: Phase 1 (Must-have cho 6 tuần), Phase 2 (Should-have cho bản cập nhật tiếp theo), Phase 3 (Nice-to-have nâng cao)", "Đơn giản hóa các tương tác phức tạp (thay animation tùy biến bằng tương tác chuẩn của hệ điều hành, thay thuật toán tự động bằng quy trình có sự can thiệp thủ công có kiểm soát)"],
    ["Làm thế nào để thuyết phục PM đồng ý cắt bỏ các tính năng phụ mà không làm họ cảm thấy sản phẩm bị què cụt?", "Cách ghi nhận các ý tưởng bị cắt giảm vào Design Backlog để không bị lãng quên trong tương lai?"] ,
    ["Scoping Workshop", "Scope Pruning", "Pareto Principle", "Phased Rollout", "Product Trio Negotiation"],
    [PROD_SRC.internal, PROD_SRC.svpg],
    ["Khăng khăng đòi làm đủ 100% thiết kế ban đầu và từ chối cắt giảm bất kỳ màn hình nào"]
  ),
  q("PROD_DES-SCEN-06", "Product Designer", "scenario", "intermediate", "junior",
    "Tình huống: Người dùng phàn nàn rằng sau khi ứng dụng cập nhật giao diện mới, họ không tìm thấy các tính năng quen thuộc hàng ngày và muốn quay lại phiên bản cũ. Em thiết kế chiến lược quản trị thay đổi trải nghiệm (Change Management UX) như thế nào để giúp người dùng thích nghi êm thấm?",
    ["Cung cấp tùy chọn cho phép người dùng dùng thử phiên bản mới và chuyển đổi linh hoạt về phiên bản cũ (Toggle Switch) trong giai đoạn chuyển giao 30 ngày", "Thiết kế các gợi ý ngữ cảnh nhẹ nhàng (Contextual Tooltips / Hotspots) chỉ ra vị trí mới của các tính năng quen thuộc khi người dùng tìm kiếm", "Lắng nghe phản hồi thực tế từ nút 'Góp ý về giao diện mới' để nhanh chóng sửa chữa các điểm gây bỡ ngỡ"],
    ["Tại sao việc thay đổi giao diện đột ngột 100% không báo trước luôn gây ra phản ứng dữ dội dù giao diện mới có tốt hơn?", "Quy trình khảo sát sự sẵn sàng chuyển đổi trước khi chính thức tắt hoàn toàn phiên bản cũ?"] ,
    ["Change Management UX", "Feature Transition", "Opt-in Experience", "User Adaptation"],
    [PROD_SRC.internal, PROD_SRC.nng],
    ["Ép buộc người dùng chuyển sang giao diện mới hoàn toàn và phớt lờ mọi lời kêu cứu của họ"]
  ),

  // CV Validation (5)
  q("PROD_DES-CV-01", "Product Designer", "cv_validation", "advanced", "middle",
    "Trong dự án em ghi trên CV về việc dẫn dắt thiết kế sản phẩm từ số 0 (Zero-to-One Product Design): Em đã tham gia vào việc xác thực bài toán kinh doanh như thế nào, xây dựng MVP ra sao và các chỉ số tăng trưởng đạt được sau 6 tháng phát hành là gì?",
    ["Trình bày từ khâu Problem Discovery: nghiên cứu đối thủ, phỏng vấn khách hàng tiềm năng để tìm khoảng trống thị trường", "Cùng PM định nghĩa phạm vi MVP, thiết kế wireframes, prototypes và trực tiếp giám sát quá trình phát triển của dev", "Dẫn chứng các chỉ số định lượng: đạt 10,000 người dùng hoạt động hàng tháng (MAU), tỷ lệ giữ chân sau 30 ngày đạt 35% và doanh thu định kỳ MRR tăng trưởng ổn định"],
    ["Thách thức lớn nhất khi làm sản phẩm từ số 0 so với việc tối ưu hóa sản phẩm đã có hàng triệu người dùng là gì?", "Em đã đưa ra quyết định sai lầm nào trong giai đoạn đầu và bài học rút ra là gì?"] ,
    ["CV Validation", "Zero-to-One Design", "MVP Scoping", "Quantitative Growth", "MAU & Retention"],
    [PROD_SRC.internal, PROD_SRC.svpg],
    ["Chỉ nói về việc vẽ đẹp nhưng không nắm được các chỉ số tăng trưởng hay mô hình kinh doanh của sản phẩm"]
  ),
  q("PROD_DES-CV-02", "Product Designer", "cv_validation", "advanced", "middle",
    "CV của em có đề cập đến việc tối ưu hóa tỷ lệ giữ chân người dùng (Retention Rate). Hãy chia sẻ cụ thể một đợt cải tiến thiết kế mà em chủ trì đã đảo ngược xu hướng rời bỏ của khách hàng, cùng phương pháp phân tích Cohort mà em đã theo dõi?",
    ["Chỉ ra phát hiện từ dữ liệu: người dùng rời bỏ nhiều nhất vào ngày thứ 3 do không hiểu cách kết nối dữ liệu ban đầu", "Giải pháp thiết kế: tái cấu trúc luồng onboarding, bổ sung tính năng mẫu có sẵn (Pre-populated templates) và thông báo nhắc nhở thông minh theo ngữ cảnh", "Kết quả: nâng đường cong giữ chân tuần thứ 4 từ 15% lên 28%, giảm tỷ lệ Churn hàng tháng xuống 4%"],
    ["Làm thế nào để phối hợp với Data Analyst thiết lập bảng theo dõi Cohort Retention Dashboard?", "Em phân biệt thế nào giữa việc người dùng quay lại vì giá trị thực sự và việc quay lại do bị spam thông báo?"] ,
    ["Retention Optimization", "Cohort Analysis", "Churn Reduction", "Pre-populated Templates"],
    [PROD_SRC.internal],
    ["Khai báo khống số liệu retention tăng trưởng gấp ba lần mà không giải thích được cơ chế trải nghiệm tạo ra sự thay đổi đó"]
  ),
  q("PROD_DES-CV-03", "Product Designer", "cv_validation", "intermediate", "middle",
    "Em ghi trên CV kinh nghiệm thiết kế cho một sản phẩm B2B SaaS có chu kỳ bán hàng phức tạp. Em đã giải quyết bài toán dung hòa giữa nhu cầu của 'Người mua hàng' (Buyer - Giám đốc ra quyết định thanh toán) và 'Người dùng cuối' (End-user - Nhân viên trực tiếp sử dụng hàng ngày) như thế nào?",
    ["Phân tích rõ hai chân dung khác biệt: Buyer quan tâm đến bảo mật, quản lý chi phí, phân quyền (RBAC) và báo cáo ROI tổng thể; End-user quan tâm đến tốc độ, sự tiện lợi và không bị thêm việc", "Thiết kế giao diện đáp ứng cả hai: xây dựng bảng điều khiển quản trị mạnh mẽ cho Buyer, đồng thời tối ưu hóa luồng tác vụ hàng ngày cực kỳ mượt mà cho End-user", "Tận dụng chiến lược Tăng trưởng dẫn dắt bởi sản phẩm (Product-Led Growth - PLG): để End-user yêu thích sản phẩm và tự thúc đẩy Buyer thanh toán gói doanh nghiệp"],
    ["PLG khác biệt như thế nào so với Sales-Led Growth truyền thống trong thiết kế trải nghiệm B2B?", "Làm thế nào để thiết kế quy trình mời đồng nghiệp vào nhóm (Invite Teammates Flow) lan tỏa tự nhiên?"] ,
    ["B2B SaaS", "Buyer vs End-user", "Product-Led Growth", "RBAC", "Enterprise UX"],
    [PROD_SRC.svpg, PROD_SRC.internal],
    ["Chỉ phục vụ người mua hàng khiến giao diện biến thành phần mềm cồng kềnh, khó dùng khiến nhân viên tẩy chay"]
  ),
  q("PROD_DES-CV-04", "Product Designer", "cv_validation", "intermediate", "junior",
    "Trong một dự án áp dụng A/B Testing mà em từng thực hiện trên CV: Hãy trình bày một thử nghiệm thiết kế thất bại (Variant mới có kết quả kém hơn phiên bản cũ). Em đã phân tích nguyên nhân gốc rễ và học được điều gì từ sự thất bại đó?",
    ["Mô tả giả định ban đầu và thiết kế biến thể mới đầy tự tin của nhóm", "Số liệu thực tế chỉ ra biến thể mới làm giảm 8% tỷ lệ chuyển đổi; em đã không né tránh mà cùng team phân tích sâu vào hành vi", "Phát hiện ra thiết kế mới dù đẹp hơn nhưng đã vô tình giấu đi một thông tin bảo hành quan trọng mà người dùng rất quan tâm trước khi bấm mua; bài học sâu sắc về sự thấu hiểu tâm lý khách hàng"],
    ["Em làm thế nào để xây dựng tư duy 'Thử nghiệm thất bại vẫn là một bài học thành công' trong team?", "Quy trình rollback phiên bản an toàn khi phát hiện số liệu giảm sút nghiêm trọng?"] ,
    ["Failed Experiment", "A/B Testing Insights", "Psychological Drivers", "Resilience"],
    [PROD_SRC.internal],
    ["Khẳng định tất cả các thử nghiệm của mình đều thành công 100% và không bao giờ thất bại"]
  ),
  q("PROD_DES-CV-05", "Product Designer", "cv_validation", "advanced", "senior_lead",
    "CV của em có nhắc đến việc xây dựng và duy trì sự liên kết chặt chẽ trong Product Trio. Khi có sự bất đồng lớn giữa 3 người (PM muốn làm tính năng A vì áp lực doanh số, Tech Lead muốn hoãn để đập đi xây lại nợ kỹ thuật, còn em muốn cải tiến luồng onboarding đang có nhiều ma sát), em đã điều phối để đưa ra quyết định chung như thế nào?",
    ["Tổ chức buổi làm việc mở dựa trên khung đánh giá ma trận tác động và nỗ lực (Impact vs Effort Matrix)", "Kết hợp các mục tiêu thành một giải pháp tích hợp: cải tiến luồng onboarding có lồng ghép việc dọn dẹp một phần nợ kỹ thuật trọng yếu của Tech Lead, và bổ sung điểm chạm kích hoạt doanh thu cho PM", "Thống nhất mục tiêu chung cao nhất của Sprint: đặt sức khỏe dài hạn của sản phẩm lên trên cái tôi của từng cá nhân"],
    ["Làm thế nào để duy trì niềm tin và sự tôn trọng lẫn nhau trong Product Trio qua các giai đoạn căng thẳng?", "Khi bất đồng không thể tự giải quyết trong nội bộ Trio, quy trình leo thang (Escalation) lên cấp CPO/CTO diễn ra ra sao?"] ,
    ["Product Trio Alignment", "Conflict Resolution", "Impact vs Effort", "Holistic Solution"],
    [PROD_SRC.svpg, PROD_SRC.internal],
    ["Rút lui để mặc PM và Tech Lead cãi nhau hoặc chỉ biết khăng khăng bảo vệ ý kiến cá nhân"]
  ),

  // Behavioral (5)
  q("PROD_DES-BEHAV-01", "Product Designer", "behavioral", "intermediate", "middle",
    "Khi ban lãnh đạo công ty yêu cầu phát triển một tính năng sao chép y hệt (Feature-copying) của đối thủ cạnh tranh hàng đầu vì thấy họ đang làm rất tốt, em tiếp cận phân tích và phản biện có tính xây dựng như thế nào?",
    ["Không vội vàng sao chép mù quáng; đặt câu hỏi: 'Tại sao đối thủ làm tính năng này? Họ nhắm vào tệp khách hàng nào và có giải quyết đúng vấn đề của khách hàng chúng ta không?'", "Phân tích điểm mạnh và điểm yếu của tính năng đối thủ: tìm ra những điểm ma sát mà đối thủ đang gặp phải để tạo ra lợi thế cạnh tranh vượt trội", "Thuyết phục ban lãnh đạo tập trung vào thế mạnh cốt lõi và bài toán riêng biệt của sản phẩm mình thay vì chạy theo sau lưng đối thủ"],
    ["Tại sao việc sao chép tính năng đối thủ thường dẫn đến cái bẫy 'sao chép cả những sai lầm của họ'?", "Làm thế nào để tìm ra 'Giá trị khác biệt độc nhất' (Unique Value Proposition) cho sản phẩm?"] ,
    ["Competitor Copying", "Strategic Differentiation", "Value Proposition", "Critical Thinking"],
    [PROD_SRC.svpg, PROD_SRC.internal],
    ["Sao chép nguyên xi giao diện đối thủ từng pixel mà không cần suy nghĩ xem có hợp với người dùng mình không"]
  ),
  q("PROD_DES-BEHAV-02", "Product Designer", "behavioral", "intermediate", "junior",
    "Khi một tính năng em rất tâm huyết và dày công thiết kế bị người dùng chỉ trích gay gắt trên mạng xã hội hoặc diễn đàn công nghệ ngay sau khi phát hành, em quản lý cảm xúc bản thân và tiến hành rà soát sự cố thế nào?",
    ["Tách bạch giá trị bản thân ra khỏi sản phẩm thiết kế; bình tĩnh tiếp nhận phản hồi tiêu cực như một nguồn dữ liệu quý giá", "Lọc bỏ những lời thóa mạ cảm tính, tập trung vào nguyên nhân kỹ thuật và trải nghiệm cốt lõi khiến họ bực mình", "Chủ động phối hợp cùng team phát hành bản vá nóng (Quick Hotfix) khắc phục các điểm gây ức chế nhất trong vòng 48 giờ và công khai cảm ơn sự đóng góp của cộng đồng"],
    ["Làm thế nào để biến những người dùng chỉ trích gay gắt nhất thành những đồng minh trung thành của sản phẩm?", "Cách giữ vững tinh thần cho nhóm thiết kế sau một đợt phát hành bị phản ứng tiêu cực?"] ,
    ["Handling Public Criticism", "Emotional Resilience", "User Feedback Triage", "Hotfix Management"],
    [PROD_SRC.internal],
    ["Lên mạng đôi co cãi nhau với người dùng hoặc suy sụp tinh thần, mất niềm tin vào năng lực bản thân"]
  ),
  q("PROD_DES-BEHAV-03", "Product Designer", "behavioral", "advanced", "senior_lead",
    "Trong bối cảnh áp lực ra mắt sản phẩm rất lớn, nhóm của em liên tục phải 'cắt góc' (Cut corners) về mặt chất lượng trải nghiệm để kịp tiến độ bàn giao (tạo ra Nợ thiết kế và nợ trải nghiệm khổng lồ). Em lên tiếng và thiết lập lại tiêu chuẩn chất lượng (Quality Standards) ra sao?",
    ["Tổ chức buổi họp hồi tưởng (Retrospective) thẳng thắn: chỉ ra hệ quả của việc cắt góc đang dẫn đến tỷ lệ lỗi tăng cao và người dùng phàn nàn", "Định nghĩa lại 'Định nghĩa hoàn thành' (Definition of Done - DoD): bổ sung tiêu chuẩn kiểm duyệt trải nghiệm và accessibility bắt buộc trước khi đóng ticket", "Chứng minh cho ban lãnh đạo thấy rằng nợ trải nghiệm đang làm chậm nhịp độ phát triển của các sprint sau, và cần dành thời gian giải quyết có hệ thống"],
    ["Làm thế nào để cân bằng giữa sự hoàn hảo cầu toàn (Perfectionism) và tính thực tế về tiến độ kinh doanh?", "Cách xây dựng văn hóa tự hào về chất lượng sản phẩm (Craftsmanship) trong đội ngũ?"] ,
    ["Quality Standards", "Definition of Done", "Design Debt", "Craftsmanship", "Sprint Retrospective"],
    [PROD_SRC.internal, PROD_SRC.svpg],
    ["Thỏa hiệp dễ dãi hạ thấp mọi tiêu chuẩn chất lượng để làm vui lòng tiến độ ảo trong ngắn hạn"]
  ),
  q("PROD_DES-BEHAV-04", "Product Designer", "behavioral", "intermediate", "middle",
    "Khi em làm việc với một Tech Lead có xu hướng tiêu cực, luôn nói 'Không làm được' trước bất kỳ ý tưởng thiết kế đổi mới nào của em vì lý do hạ tầng phức tạp, em xây dựng lòng tin và phá vỡ rào cản phòng thủ kỹ thuật đó như thế nào?",
    ["Không coi câu nói 'Không làm được' là sự từ chối cá nhân; hiểu rằng Tech Lead đang chịu áp lực lớn về tính ổn định hệ thống và nợ kỹ thuật", "Chuyển đổi cách đặt câu hỏi: từ 'Em muốn làm cái này' sang 'Mục tiêu trải nghiệm của chúng ta là giải quyết vấn đề X cho người dùng, theo góc nhìn của anh thì hạ tầng hiện tại có thể hỗ trợ cách tiếp cận nào khả thi nhất?'", "Mời Tech Lead cùng tham gia vào quá trình phác thảo ý tưởng từ sớm để họ có cảm giác đồng sở hữu (Co-ownership) giải pháp"],
    ["Làm thế nào để học cách hiểu các khái niệm kiến trúc backend cơ bản để giao tiếp cùng tần số với Tech Lead?", "Một lần em đã cùng lập trình viên tìm ra giải pháp kỹ thuật thông minh vượt qua giới hạn hệ thống là gì?"] ,
    ["Tech Lead Empathy", "Overcoming Technical Resistance", "Co-ownership", "Collaborative Problem Solving"],
    [PROD_SRC.internal],
    ["Tố cáo Tech Lead với cấp trên là người bảo thủ, lười biếng và cản trở sự đổi mới của công ty"]
  ),
  q("PROD_DES-BEHAV-05", "Product Designer", "behavioral", "intermediate", "junior",
    "Khi được giao phụ trách một sản phẩm trong lĩnh vực nghiệp vụ hoàn toàn xa lạ và phức tạp (ví dụ: Hệ thống chuỗi cung ứng logistics hoặc Nền tảng giao dịch phái sinh), em lập kế hoạch tự học hỏi nghiệp vụ (Domain Knowledge) trong 30 ngày đầu tiên như thế nào?",
    ["Chủ động đọc tài liệu nghiệp vụ, từ điển thuật ngữ chuyên ngành và phân tích sản phẩm của các đối thủ sừng sỏ trên thế giới", "Xin đi theo học hỏi (Shadowing) các chuyên gia nghiệp vụ nội bộ (Subject Matter Experts - SMEs) và nhân viên vận hành hàng ngày", "Vẽ sơ đồ quy trình nghiệp vụ tổng quan và nhờ các chuyên gia sửa chữa để kiểm chứng mức độ hiểu biết của bản thân trước khi bắt tay vào thiết kế"],
    ["Làm thế nào để biến việc là 'người ngoài ngành' thành một lợi thế (Tư duy người mới bắt đầu - Beginner's Mindset) để phát hiện ra những điểm bất hợp lý mà người trong ngành đã quen mắt?", "Cách ghi chú và chia sẻ lại kiến thức nghiệp vụ cho các thành viên mới khác trong team?"] ,
    ["Domain Knowledge Onboarding", "Subject Matter Experts", "Beginner's Mindset", "Shadowing"],
    [PROD_SRC.internal],
    ["Tự mãn với kỹ năng hiện tại, ngại học công nghệ và công cụ thiết kế mới đang trở thành chuẩn ngành"]
  )
];

console.log("Product Designer questions defined:", productDesignerQuestions.length);

module.exports = {
  productDesignerQuestions
};
