const { q, SRC } = require('./fe_data.cjs');

const RES_SRC = {
  nng: "https://www.nngroup.com/articles/",
  ixdf: "https://www.interaction-design.org/literature",
  dovetail: "https://dovetail.com/research-methodology/",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 3. UX RESEARCHER
const uxResearcherQuestions = [
  // Foundation (6)
  q("UX_RES-FOUND-01", "UX Researcher", "foundation", "basic", "junior",
    "Phân biệt giữa Nghiên cứu khám phá (Generative/Exploratory Research) và Nghiên cứu đánh giá (Evaluative Research). Những giai đoạn nào trong vòng đời phát triển sản phẩm tương ứng với từng loại hình nghiên cứu này?",
    ["Generative Research diễn ra ở giai đoạn đầu (Problem Space): thấu hiểu nhu cầu sâu kín, nỗi đau và bối cảnh sống của người dùng để tìm cơ hội mới", "Evaluative Research diễn ra khi đã có giải pháp/prototype (Solution Space): đánh giá xem thiết kế có dễ dùng, trực quan và đạt mục tiêu hay không", "Phương pháp đại diện: Generative dùng phỏng vấn sâu, quan sát bối cảnh; Evaluative dùng Usability Testing, A/B Testing, Heuristic Evaluation"],
    ["Tại sao nhiều công ty chỉ làm Evaluative Research mà bỏ qua Generative Research dẫn đến việc 'làm ra một sản phẩm rất dễ dùng nhưng không ai cần'?", "Làm thế nào để chọn phương pháp nghiên cứu phù hợp khi ngân sách và thời gian bị giới hạn?"] ,
    ["Generative Research", "Evaluative Research", "Double Diamond", "Research Framework", "Problem Space"],
    [RES_SRC.nng, RES_SRC.ixdf],
    ["Nhầm lẫn giữa việc nghiên cứu tìm cơ hội bài toán và việc đi kiểm thử giao diện màn hình"]
  ),
  q("UX_RES-FOUND-02", "UX Researcher", "foundation", "intermediate", "junior",
    "Mô hình phối hợp Nghiên cứu Định tính (Qualitative) và Định lượng (Quantitative) trong UX: Dữ liệu định tính trả lời câu hỏi 'Tại sao / Như thế nào' (Why/How), trong khi định lượng trả lời câu hỏi 'Cái gì / Bao nhiêu' (What/How much) ra sao? Trình bày phương pháp Tam giác giác ngộ (Triangulation)?",
    ["Định lượng chỉ ra vị trí và quy mô vấn đề (vd: 40% người dùng bỏ dở ở bước 2 trên Google Analytics)", "Định tính đi sâu vào tìm nguyên nhân gốc rễ thông qua quan sát và phỏng vấn trực tiếp (vd: người dùng bỏ dở vì không hiểu thuật ngữ pháp lý)", "Triangulation (Tam giác đan xen): kết hợp ít nhất 3 nguồn dữ liệu độc lập (Analytics, Phỏng vấn, Nhật ký hành vi) để loại trừ sai số và kiểm chứng chéo kết luận"],
    ["Cỡ mẫu (Sample Size) cần thiết cho nghiên cứu định lượng khác biệt thế nào so với định tính (5-8 người)?", "Khi dữ liệu định tính mâu thuẫn trực tiếp với số liệu định lượng, em tiếp cận phân tích thế nào?"] ,
    ["Qualitative vs Quantitative", "Triangulation", "Sample Size", "Mixed Methods", "Root Cause Analysis"],
    [RES_SRC.nng, RES_SRC.dovetail],
    ["Chỉ tin vào số liệu định lượng và bỏ qua hoàn toàn việc lắng nghe cảm xúc, suy nghĩ thực tế của người dùng"]
  ),
  q("UX_RES-FOUND-03", "UX Researcher", "foundation", "advanced", "middle",
    "Các thiên kiến tâm lý học (Cognitive Biases) phổ biến làm sai lệch kết quả nghiên cứu: Thiên kiến xác nhận (Confirmation Bias), Thiên kiến mong muốn xã hội (Social Desirability Bias), và Hiệu ứng Hawthorne. UX Researcher kiểm soát các thiên kiến này như thế nào trong quá trình phỏng vấn?",
    ["Confirmation Bias: Người phỏng vấn chỉ chú ý lắng nghe những gì khớp với giả định có sẵn của mình; kiểm soát bằng cách ghi chép trung thực và nhờ người thứ hai mã hóa dữ liệu độc lập", "Social Desirability Bias: Người tham gia cố tình trả lời để tỏ ra thông minh, lịch sự hoặc làm hài lòng người hỏi; kiểm soát bằng cách cam kết ẩn danh và khẳng định 'không có câu trả lời nào là sai'", "Hawthorne Effect: Người tham gia thay đổi hành vi khi biết mình đang bị quan sát; kiểm soát bằng cách tạo không khí tự nhiên và dành thời gian khởi động làm tan biến căng thẳng"],
    ["Kỹ thuật 'Hồi tưởng sự việc gần nhất' (Recent Incident Technique) giúp loại bỏ thiên kiến nhớ lại (Recall Bias) ra sao?", "Tại sao không bao giờ nên hỏi người dùng về hành vi giả định trong tương lai ('Bạn có dùng tính năng này không?')?"] ,
    ["Cognitive Biases", "Confirmation Bias", "Hawthorne Effect", "Social Desirability", "Research Rigor"],
    [RES_SRC.nng, RES_SRC.ixdf],
    ["Dẫn dắt người tham gia thừa nhận ý kiến cá nhân của nhà nghiên cứu trong suốt buổi phỏng vấn"]
  ),
  q("UX_RES-FOUND-04", "UX Researcher", "foundation", "intermediate", "middle",
    "Thang đo khả năng sử dụng hệ thống (System Usability Scale - SUS): Cấu trúc 10 câu hỏi đan xen tích cực/tiêu cực của bảng hỏi SUS, cách tính điểm chuẩn hóa từ 0 đến 100, và ý nghĩa của mốc 68 điểm tiêu chuẩn (Industry Average Benchmark)?",
    ["Bảng hỏi gồm 10 câu trắc nghiệm theo thang đo Likert 5 điểm, đan xen xen kẽ câu chẵn tiêu cực và câu lẻ tích cực để chống thói quen chọn bừa", "Công thức tính điểm: câu lẻ trừ 1, câu chẵn lấy 5 trừ điểm; cộng tổng tất cả nhân với 2.5 để ra thang điểm 0-100", "Mốc 68 điểm là mức trung bình của ngành; trên 80 điểm là xuất sắc (Hạng A), dưới 50 điểm là mức báo động nguy hiểm về khả năng sử dụng"],
    ["Tại sao điểm SUS không phải là tỷ lệ phần trăm (%) mà là điểm phân vị chuẩn hóa?", "Phân biệt giữa SUS với Net Promoter Score (NPS) và Customer Effort Score (CES)?"] ,
    ["System Usability Scale", "SUS Benchmark", "Likert Scale", "Standardized Usability", "NPS vs SUS"],
    [RES_SRC.nng],
    ["Hiểu sai điểm SUS 68 là 68% và cho rằng 68% là điểm số kém cỏi"]
  ),
  q("UX_RES-FOUND-05", "UX Researcher", "foundation", "basic", "junior",
    "Phân biệt giữa Chân dung người dùng giả định (Proto-Persona) và Chân dung người dùng dựa trên nghiên cứu thực chứng (Research-backed Persona). Cấu trúc của một Persona chuẩn gồm những thông tin nào để đội ngũ kỹ thuật và sản phẩm có thể thấu cảm?",
    ["Proto-Persona xây dựng dựa trên giả định và kinh nghiệm nội bộ của team sản phẩm khi chưa có ngân sách nghiên cứu", "Research-backed Persona được tổng hợp từ dữ liệu nghiên cứu thực tế với người dùng thật, có bằng chứng trích dẫn rõ ràng", "Cấu trúc chuẩn: Bối cảnh nhân khẩu học phù hợp, Động lực cốt lõi (Motivations), Mục tiêu tác vụ (Goals), Nỗi đau/Rào cản (Pain points/Frustrations), và Trích dẫn lời nói tiêu biểu (Representative Quotes)"],
    ["Tại sao việc thêm thắt các chi tiết nhân khẩu học vô nghĩa (sở thích xem phim, nuôi mèo) vào persona lại gây xao nhãng?", "Khái niệm 'Job Story' hoặc 'Jobs-to-be-Done (JTBD)' bổ trợ cho Persona như thế nào?"] ,
    ["User Persona", "Proto-Persona", "Empathy Map", "JTBD", "Research Synthesis"],
    [RES_SRC.nng, RES_SRC.ixdf],
    ["Vẽ persona hoàn toàn từ trí tưởng tượng và gắn ảnh người mẫu trên mạng mà không dựa trên bất kỳ dữ liệu nghiên cứu nào"]
  ),
  q("UX_RES-FOUND-06", "UX Researcher", "foundation", "advanced", "senior_lead",
    "Phương pháp Quản trị kho tri thức nghiên cứu (Research Repository & Atomic Research): Khái niệm phân rã dữ liệu thành 4 tầng: Thí nghiệm (Experiments) -> Dữ liệu thực tế (Facts/Observations) -> Đúc kết hiểu biết (Insights) -> Kết luận/Hành động (Conclusions/Recommendations). Lợi ích của mô hình này trong việc tái sử dụng tri thức tổ chức?",
    ["Atomic Research phân nhỏ các báo cáo cồng kềnh thành các đơn vị thông tin nguyên tử độc lập (Facts, Insights, Recommendations)", "Giúp các nghiên cứu không bị lãng quên trong các file PDF/slide sau khi dự án kết thúc", "Cho phép các Product Managers tìm kiếm nhanh các insights liên quan đến một chủ đề cụ thể (như 'thanh toán', 'tìm kiếm') qua nhiều dự án nghiên cứu khác nhau trong lịch sử"],
    ["Công cụ nào (Dovetail, Notion, EnjoyHQ) em áp dụng để tổ chức Research Repository?", "Làm thế nào để gắn thẻ (Tagging Taxonomy) đồng nhất giữa nhiều nhà nghiên cứu trong cùng công ty?"] ,
    ["Atomic Research", "Research Repository", "Dovetail", "Knowledge Management", "Insight Longevity"],
    [RES_SRC.dovetail],
    ["Viết các báo cáo nghiên cứu dạng slide dài 80 trang và cất vào Google Drive không bao giờ mở lại"]
  ),

  // Practical Skills (8)
  q("UX_RES-SKILL-01", "UX Researcher", "practical_skills", "intermediate", "junior",
    "Kỹ thuật Phỏng vấn bán cấu trúc (Semi-structured Interviewing): Em soạn thảo Hướng dẫn phỏng vấn (Interview Guide) như thế nào để cân bằng giữa việc bám sát mục tiêu bài toán và sự linh hoạt đào sâu các chủ đề bất ngờ do người tham gia mở ra?",
    ["Xây dựng Interview Guide theo cấu trúc phễu: Khởi động phá băng (Warm-up) -> Câu hỏi tổng quan bối cảnh -> Câu hỏi trọng tâm chuyên sâu -> Tổng kết mở", "Chuẩn bị sẵn các câu hỏi đào sâu bổ trợ (Probing questions: 'Em có thể kể một lần gần nhất...', 'Điều gì khiến em cảm thấy như vậy?')", "Linh hoạt điều chỉnh thứ tự câu hỏi theo mạch cảm xúc tự nhiên của người tham gia mà không ngắt lời họ"],
    ["Cách ghi chép nhanh trong buổi phỏng vấn mà vẫn duy trì được giao tiếp ánh mắt (Eye-contact) và sự kết nối?", "Kỹ thuật '5 Whys' được áp dụng thế nào để bóc tách từ hiện tượng bên ngoài đến động lực sâu xa?"] ,
    ["Semi-structured Interview", "Interview Guide", "Probing Techniques", "Funnel Questioning", "Active Listening"],
    [RES_SRC.nng, RES_SRC.dovetail],
    ["Cầm kịch bản đọc như tra khảo phạm nhân và không bao giờ đào sâu vào các chia sẻ thú vị của người dùng"]
  ),
  q("UX_RES-SKILL-02", "UX Researcher", "practical_skills", "intermediate", "junior",
    "Kỹ thuật Đặt câu hỏi trung lập và Loại bỏ câu hỏi dẫn dắt (Leading Questions): Chuyển đổi các câu hỏi định hướng như 'Bạn có thấy tính năng này rất tiện lợi không?' hoặc 'Bạn có thích giao diện mới không?' thành các câu hỏi khám phá trung lập chuẩn xác?",
    ["Tuyệt đối không đưa tính từ đánh giá ('tiện lợi', 'dễ dùng', 'thích') vào câu hỏi", "Chuyển thành câu hỏi mở về trải nghiệm thực tế: 'Lần gần nhất bạn sử dụng tính năng này diễn ra như thế nào?' hoặc 'Điều gì hoạt động tốt và điều gì gây khó khăn cho bạn khi trải nghiệm giao diện này?'", "Đặt câu hỏi khuyến khích sự trung thực: 'Nếu có một điều bạn muốn thay đổi hoặc loại bỏ ở màn hình này, đó sẽ là điều gì?'"],
    ["Tại sao việc im lặng lắng nghe 3-5 giây (The Power of Silence) lại kích thích người tham gia chia sẻ những suy nghĩ sâu kín nhất?", "Làm thế nào để phát hiện người tham gia đang trả lời xã giao để làm vui lòng nhà nghiên cứu?"] ,
    ["Leading Questions", "Neutral Questioning", "Open-ended Questions", "Interview Moderation"],
    [RES_SRC.nng],
    ["Hỏi dồn các câu hỏi có sẵn đáp án mong muốn nhằm chứng minh giải pháp của công ty là đúng"]
  ),
  q("UX_RES-SKILL-03", "UX Researcher", "practical_skills", "advanced", "middle",
    "Quy trình Phân tích chuyên đề (Thematic Analysis) và Lập bản đồ đồng thuận (Affinity Mapping): Từ 15 giờ băng ghi âm phỏng vấn, em thực hiện quá trình gán nhãn mã hóa (Coding), gom cụm dữ liệu (Clustering), và trích xuất các chủ đề hiểu biết then chốt (Themes/Insights) như thế nào?",
    ["Bước 1: Nghe lại và bóc tách từng phát ngôn quan trọng thành các thẻ ghi chú nguyên tử (Atomic observations / Quotes)", "Bước 2: Gán mã (Inductive Coding: gán nhãn chủ đề dựa trên nội dung thực tế)", "Bước 3: Gom cụm Affinity Diagramming trên Miro/FigJam để tìm ra các mẫu hành vi lặp lại (Patterns) giữa nhiều người dùng khác nhau", "Bước 4: Đúc kết thành các Insights có giá trị hành động (Actionable Insights) kèm theo trích dẫn chứng cứ rõ ràng"],
    ["Làm thế nào để tránh việc gom nhóm dựa trên phỏng đoán chủ quan của bản thân thay vì bằng chứng thực tế?", "Sự khác biệt giữa một 'Dữ kiện quan sát' (Fact) và một 'Hiểu biết sâu sắc' (Insight)?"] ,
    ["Thematic Analysis", "Affinity Mapping", "Inductive Coding", "Insight Generation", "Miro / FigJam"],
    [RES_SRC.nng, RES_SRC.dovetail],
    ["Chỉ trích xuất một vài câu trích dẫn lẻ loi hợp ý mình mà không thực hiện phân tích đối chiếu hệ thống"]
  ),
  q("UX_RES-SKILL-04", "UX Researcher", "practical_skills", "intermediate", "middle",
    "Quy trình Tuyển chọn đối tượng tham gia nghiên cứu (Participant Recruiting): Em thiết kế Bảng câu hỏi sàng lọc (Screener Survey) như thế nào để chọn đúng đối tượng mục tiêu, loại bỏ những người tham gia chuyên nghiệp (Professional testers) và người trả lời bừa để nhận quà?",
    ["Xác định rõ ràng Tiêu chí bắt buộc (Inclusion criteria) và Tiêu chí loại trừ (Exclusion criteria)", "Sử dụng câu hỏi bẫy (Red Herring questions / Foil questions) để phát hiện người trả lời gian lận (vd: hỏi về một thương hiệu hoàn toàn bịa đặt)", "Loại bỏ những người làm việc trong ngành thiết kế, nghiên cứu thị trường, lập trình hoặc nhân viên của các đối thủ cạnh tranh trực tiếp"],
    ["Làm thế nào để tuyển được người dùng khó tính hoặc người dùng thuộc nhóm thiểu số khó tiếp cận (Hard-to-reach users)?", "Quy trình xin phép thu thập dữ liệu (Informed Consent) và bảo vệ dữ liệu cá nhân theo quy định pháp luật (Nghị định 13 / GDPR)?"] ,
    ["Participant Recruiting", "Screener Survey", "Inclusion Criteria", "Informed Consent", "Ethics"],
    [RES_SRC.nng],
    ["Nhờ người quen trong công ty hoặc bạn bè thân thiết làm đối tượng nghiên cứu thay vì khách hàng thật"]
  ),
  q("UX_RES-SKILL-05", "UX Researcher", "practical_skills", "advanced", "middle",
    "Thiết kế và triển khai Nghiên cứu Nhật ký hành vi (Diary Study): Khi nghiên cứu hành vi tài chính cá nhân hoặc thói quen ăn uống kéo dài trong 2 tuần, em thiết kế cấu trúc ghi nhật ký, kích hoạt nhắc nhở (Prompts) và phỏng vấn kết thúc (Exit Interview) ra sao?",
    ["Xác định tần suất ghi: Event-based (ghi mỗi khi phát sinh giao dịch chi tiêu) hoặc Time-based (ghi tổng kết mỗi tối)", "Tối ưu công cụ ghi nhật ký trên thiết bị di động (Google Forms, ứng dụng tin nhắn) đơn giản, nhanh chóng dưới 3 phút để chống tỷ lệ bỏ dở", "Thực hiện phỏng vấn Exit Interview sau 14 ngày để đào sâu vào các ghi chép bất thường và kiểm chứng lại sự thay đổi hành vi"],
    ["Làm thế nào để duy trì tỷ lệ tham gia tích cực (Retention rate) của đối tượng trong suốt 14 ngày nghiên cứu?", "Phương pháp phân tích lượng dữ liệu nhật ký đa phương tiện (chữ, ảnh chụp màn hình, hóa đơn) đồ sộ?"] ,
    ["Diary Study", "Longitudinal Research", "Behavioral Habits", "In-situ Research", "Exit Interview"],
    [RES_SRC.nng],
    ["Yêu cầu người dùng viết bài luận dài mỗi ngày khiến 80% người tham gia bỏ dở nghiên cứu sau ngày thứ 3"]
  ),
  q("UX_RES-SKILL-06", "UX Researcher", "practical_skills", "advanced", "senior_lead",
    "Phương pháp Thử nghiệm phân loại thẻ (Card Sorting) và Kiểm thử cấu trúc cây (Tree Testing) định lượng: Em phân tích ma trận tương đồng (Similarity Matrix), sơ đồ phân nhánh (Dendrogram), và tỷ lệ tìm thấy trực tiếp (Directness) trong Treejack như thế nào để chứng minh cấu trúc menu mới vượt trội hơn cấu trúc cũ?",
    ["Đọc hiểu Dendrogram: xác định ngưỡng đồng thuận (Agreed threshold) của các cụm nhóm nội dung trong Card Sorting", "Trong Tree Testing: theo dõi chỉ số Success Rate (tỷ lệ chọn đúng điểm đến) và Directness (tỷ lệ đi thẳng tới đích mà không bị quay lui/backtrack)", "So sánh trực tiếp điểm số Benchmark trước và sau cải tiến để chứng minh bằng số liệu cấu trúc IA mới giúp người dùng tìm kiếm nhanh hơn"],
    ["Khi kết quả Tree Testing cho thấy tỷ lệ rẽ nhầm nhánh ở một danh mục lên tới 40%, các bước điều tra chữ nghĩa nhãn (Labeling) diễn ra sao?", "Cỡ mẫu tối thiểu cho một bài kiểm thử Tree Testing định lượng đáng tin cậy là bao nhiêu?"] ,
    ["Card Sorting", "Tree Testing", "Dendrogram", "Directness", "Information Architecture Metrics"],
    [RES_SRC.nng],
    ["Thay đổi toàn bộ menu chỉ dựa trên ý kiến của một vài người mà không kiểm chứng bằng Tree Testing"]
  ),
  q("UX_RES-SKILL-07", "UX Researcher", "practical_skills", "intermediate", "middle",
    "Thiết kế Khảo sát định lượng trên diện rộng (Survey Design): Em viết câu hỏi, lựa chọn thang đo (Likert, Semantic Differential) và kiểm soát thiên kiến đặt thứ tự câu hỏi (Order Bias) ra sao để thu về dữ liệu chất lượng cao từ 500+ phản hồi?",
    ["Giới hạn thời lượng khảo sát dưới 5-7 phút để giảm tỷ lệ bỏ dở giữa chừng (Survey Fatigue)", "Tránh các câu hỏi kép (Double-barreled questions: 'Bạn thấy sản phẩm này nhanh và đẹp như thế nào?')", "Xáo trộn ngẫu nhiên thứ tự các câu trả lời (Randomize answer options) để loại trừ thiên kiến ưu tiên lựa chọn đầu tiên"],
    ["Làm thế nào để tính toán cỡ mẫu cần thiết dựa trên độ tin cậy 95% và sai số cho phép 5%?", "Phương pháp lọc sạch dữ liệu rác (Data Cleaning: loại bỏ Straight-liners chọn 1 đáp án từ đầu đến cuối, người hoàn thành quá nhanh)?"] ,
    ["Survey Design", "Likert Scale", "Survey Fatigue", "Double-barreled Questions", "Data Cleaning"],
    [RES_SRC.nng],
    ["Thiết kế khảo sát 40 câu hỏi vừa dài vừa hỏi dồn hai ý trong một câu khiến dữ liệu thu về bị rác"]
  ),
  q("UX_RES-SKILL-08", "UX Researcher", "practical_skills", "advanced", "middle",
    "Truyền thông kết quả nghiên cứu và Thúc đẩy hành động (Research Storytelling & Activation): Em trình bày báo cáo nghiên cứu như thế nào (kết hợp video highlight clips, trích dẫn âm thanh, workshop đồng sáng tạo) để biến insights thành quyết định cụ thể của Product Roadmap thay vì tài liệu chết?",
    ["Thay vì đọc slide chữ dài dòng, trình bày theo dạng Kể chuyện trải nghiệm: nêu rõ Nỗi đau -> Tác động kinh doanh -> Bằng chứng video/audio người dùng thật -> Đề xuất hành động", "Trích xuất các đoạn video ngắn (Video Highlight Clips 30-45 giây) quay lại khoảnh khắc người dùng vấp ngã để tạo cú sốc thấu cảm trực diện cho các sếp", "Tổ chức Ideation Workshop mời cả PM, Tech Lead và Designers cùng tham gia chuyển hóa từng insight thành các giải pháp khả thi"],
    ["Làm thế nào để theo dõi tỷ lệ các khuyến nghị nghiên cứu được hiện thực hóa trong sản phẩm (Research Adoption Rate)?", "Cách xử lý khi một Insight quan trọng bị PM từ chối đưa vào roadmap vì hạn chế về nguồn lực?"] ,
    ["Research Storytelling", "Video Clips", "Ideation Workshop", "Research Activation", "Impact Tracking"],
    [RES_SRC.dovetail, RES_SRC.internal],
    ["Chỉ gửi file báo cáo qua email rồi không bao giờ theo dõi xem team có thực hiện theo khuyến nghị hay không"]
  ),

  // Scenario (6)
  q("UX_RES-SCEN-01", "UX Researcher", "scenario", "advanced", "middle",
    "Tình huống: Công ty chuẩn bị đầu tư phát triển một tính năng hoàn toàn mới (Ứng dụng đầu tư vi mô tự động). Chưa có bất kỳ sản phẩm nào trên hệ sinh thái hiện tại để đo lường. Em lập kế hoạch Nghiên cứu khám phá (Discovery Research Plan) trong 3 tuần để tìm hiểu hành vi tiết kiệm, rào cản tâm lý và nhu cầu thực sự của tập khách hàng trẻ ra sao?",
    ["Tuần 1: Nghiên cứu thứ cấp (Desk Research / Competitive Analysis) và xây dựng kế hoạch, bộ câu hỏi phỏng vấn sâu, screener tuyển dụng 15 bạn trẻ thuộc nhiều phân khúc", "Tuần 2: Tiến hành 15 buổi phỏng vấn sâu 60 phút kết hợp bài tập nhật ký tài chính mini; khám phá rào cản sợ rủi ro và thói quen giữ tiền", "Tuần 3: Phân tích Thematic Analysis, xây dựng Persona và Journey Map; tổ chức buổi báo cáo và Ideation Workshop cùng đội ngũ phát triển sản phẩm"],
    ["Làm thế nào để tuyển được những người trẻ có thói quen tài chính thực tế thay vì những người chỉ 'nói hay nhưng không làm'?", "Phương pháp trắc nghiệm thẻ bài (Card Sort of Value Priorities) hỗ trợ tìm hiểu giá trị sống của người tham gia ra sao?"] ,
    ["Discovery Research Plan", "Greenfield Product", "Desk Research", "Financial Habits", "Ideation Workshop"],
    [RES_SRC.internal, RES_SRC.nng],
    ["Hỏi thẳng người dùng 'Bạn có muốn dùng app đầu tư này không' và kết luận nhu cầu dựa trên câu trả lời 'Có'"]
  ),
  q("UX_RES-SCEN-02", "UX Researcher", "scenario", "intermediate", "middle",
    "Tình huống: Một bài kiểm tra khả năng sử dụng (Usability Testing) với 6 người dùng cho thấy: 5/6 người dùng không thể tìm thấy tính năng 'Quét mã QR để thanh toán' vì icon bị hòa lẫn vào hình nền trang chủ. Nhưng Giám đốc Marketing khẳng định hình nền này là cốt lõi của chiến dịch quảng cáo và không được phép sửa. Em giải quyết xung đột này như thế nào?",
    ["Cắt các đoạn video clip ghi lại cảnh 5 khách hàng loay hoay, bực bội tìm nút quét QR trong 2 phút và bấm nhầm sang các tính năng khác", "Trình bày tại buổi họp ngắn: không công kích thiết kế marketing, chỉ chiếu video thực tế để các bên tự cảm nhận nỗi đau của khách hàng", "Đưa ra giải pháp dung hòa: giữ nguyên hình nền chiến dịch marketing nhưng bổ sung một lớp phủ mờ (Scrim/Backdrop) hoặc tách nút QR thành Floating Action Button nổi bật độc lập trên nền"],
    ["Tại sao bằng chứng trực quan bằng video của người dùng thật luôn có sức nặng thuyết phục gấp 10 lần lời nói của nhà nghiên cứu?", "Làm thế nào để duy trì mối quan hệ hợp tác tốt đẹp với Marketing sau khi phản biện chiến dịch của họ?"] ,
    ["Stakeholder Conflict", "Video Evidence", "Empathy Building", "Marketing vs Usability"],
    [RES_SRC.internal],
    ["Tranh cãi tay đôi gay gắt với Giám đốc Marketing bằng lý thuyết sách vở mà không đưa ra bằng chứng video thực tế"]
  ),
  q("UX_RES-SCEN-03", "UX Researcher", "scenario", "advanced", "middle",
    "Tình huống: Đội ngũ Product Manager muốn tung ra một tính năng gây tranh cãi (hiển thị thông báo giục giã mua hàng dạng pop-up đếm ngược 'Chỉ còn 2 phút'). Họ tin rằng nó sẽ tăng doanh số ngắn hạn. Em thiết kế một nghiên cứu đo lường Tác động tâm lý tiêu cực và Niềm tin thương hiệu (Brand Trust) ra sao để chứng minh tính hai mặt của tính năng này?",
    ["Thiết kế nghiên cứu hỗn hợp: A/B Testing đo lường tỷ lệ mua hàng tức thời đồng thời theo dõi tỷ lệ Unsubscribe và tỷ lệ xóa app trong 30 ngày tiếp theo", "Thực hiện Usability Testing kết hợp đo lường mức độ căng thẳng tâm lý (Perceived Pressure) và cảm nhận về độ tin cậy của thương hiệu", "Chỉ ra số liệu: pop-up có thể tăng 3% doanh số hôm nay nhưng làm giảm 15% chỉ số giữ chân khách hàng (Retention) và tăng gấp đôi số lượng khiếu nại CS"],
    ["Khái niệm 'Cognitive Strain' (Căng thẳng nhận thức) ảnh hưởng đến quyết định trung thành dài hạn của khách hàng ra sao?", "Cách trình bày số liệu để ban giám đốc hiểu được giá trị của Giá trị vòng đời khách hàng (Customer Lifetime Value) thay vì doanh thu tức thời?"] ,
    ["Urgency Patterns", "Brand Trust", "Cognitive Strain", "Retention Impact", "Ethical Research"],
    [RES_SRC.internal, RES_SRC.nng],
    ["Chỉ trích PM là vô đạo đức mà không đưa ra được bất kỳ số liệu đo lường tác hại kinh doanh cụ thể nào"]
  ),
  q("UX_RES-SCEN-04", "UX Researcher", "scenario", "intermediate", "middle",
    "Tình huống: Khi tiến hành phỏng vấn sâu với khách hàng B2B là các giám đốc tài chính bận rộn, họ chỉ có tối đa 20 phút và trả lời rất ngắn gọn, khô khan, mang tính ngoại giao xã giao. Em áp dụng kỹ thuật phỏng vấn chuyên nghiệp nào để phá vỡ lớp vỏ phòng thủ và khai thác được những khó khăn nội bộ thực sự của họ?",
    ["Bỏ qua các câu chào hỏi sáo rỗng; đi thẳng vào bài toán cụ thể mà họ đang quan tâm nhất trong ngày làm việc", "Hỏi về các câu chuyện sự cố cụ thể gần nhất thay vì hỏi chung chung: 'Lần gần nhất quy trình phê duyệt chi phí bị trễ hạn gây rắc rối cho anh/chị là khi nào?'", "Chia sẻ trước một insight ẩn danh từ một giám đốc tài chính khác trong cùng ngành để kích thích phản biện và sự đồng cảm"],
    ["Kỹ thuật 'Tỏ ra ngây thơ có mục đích' (Columbo Technique) giúp khai thác thông tin từ các chuyên gia cấp cao ra sao?", "Cách xử lý khéo léo khi đối tượng liên tục nhìn đồng hồ hoặc trả lời điện thoại giữa buổi phỏng vấn?"] ,
    ["B2B Executive Interview", "Time-constrained Research", "Probing Executives", "Critical Incident"],
    [RES_SRC.internal],
    ["Tiếp tục đọc danh sách câu hỏi học thuật dài dòng khiến khách hàng mất kiên nhẫn và cắt ngắn buổi phỏng vấn"]
  ),
  q("UX_RES-SCEN-05", "UX Researcher", "scenario", "advanced", "middle",
    "Tình huống: Kết quả khảo sát diện rộng gửi qua email về sự hài lòng của ứng dụng đạt điểm rất cao (NPS = +65). Tuy nhiên, số liệu trên App Store lại có rất nhiều đánh giá 1 sao phàn nàn về lỗi thanh toán. Em giải thích hiện tượng nghịch lý này như thế nào và các bước điều tra bổ sung để tìm ra bức tranh sự thật?",
    ["Nhận diện Thiên kiến chọn mẫu (Sampling Bias / Non-response Bias): những người hài lòng và rảnh rỗi mới mở email trả lời khảo sát, trong khi người bị lỗi bực mình sẽ không thèm làm khảo sát mà lên thẳng App Store xả giận", "Rà soát lại quy trình phát khảo sát: khảo sát được gửi vào thời điểm nào (nếu gửi sau khi giao dịch thành công thì đã bỏ sót toàn bộ người giao dịch thất bại)", "Triển khai khảo sát kích hoạt theo ngữ cảnh (In-app Triggered Survey) ngay tại thời điểm xảy ra lỗi giao dịch để thu thập đúng tiếng nói của nhóm bị ảnh hưởng"],
    ["Làm thế nào để cân bằng tỷ lệ mẫu khảo sát để phản ánh đúng cơ cấu toàn thể người dùng?", "Cách phối hợp với đội ngũ Chăm sóc khách hàng (Customer Support) để phân loại ticket lỗi thanh toán?"] ,
    ["Sampling Bias", "Non-response Bias", "NPS Paradox", "Survey Triggering", "Voice of Customer"],
    [RES_SRC.internal, RES_SRC.nng],
    ["Tự mãn với con số NPS cao và cho rằng những đánh giá 1 sao trên App Store chỉ là do đối thủ cạnh tranh chơi xấu"]
  ),
  q("UX_RES-SCEN-06", "UX Researcher", "scenario", "basic", "junior",
    "Tình huống: Một người tham gia trong buổi phỏng vấn người dùng tỏ ra quá hoạt ngôn và nói không ngừng về những chủ đề ngoài lề (kể chuyện gia đình, bình luận chính trị) làm cháy giáo án thời gian. Em điều phối khéo léo như thế nào để đưa họ quay trở lại chủ đề nghiên cứu mà không làm họ cảm thấy bị xúc phạm?",
    ["Lắng nghe gật đầu công nhận ngắn gọn một câu: 'Câu chuyện của anh/chị rất thú vị...'", "Khéo léo chuyển hướng câu chuyện bằng câu cầu nối: '...và điều này gợi cho em liên tưởng đến một ý quan trọng mà chúng ta vừa thảo luận về cách anh/chị dùng ứng dụng lúc nãy...'", "Nhắc lại thời lượng: 'Vì chúng ta chỉ còn 15 phút mà em rất muốn được lắng nghe góc nhìn quý giá của anh/chị về phần này, em xin phép chuyển sang câu hỏi tiếp theo nhé'"],
    ["Khi nào thì việc nói chuyện ngoài lề lại vô tình mang lại một insight bất ngờ về phong cách sống của người dùng?", "Cách xử lý khi người tham gia hoàn toàn im lặng và chỉ trả lời cộc lốc một từ 'Có' hoặc 'Không'?"] ,
    ["Interview Facilitation", "Redirecting Talkative Users", "Time Management", "Rapport Building"],
    [RES_SRC.internal],
    ["Cắt lời thô bạo hoặc cam chịu ngồi nghe chuyện phiếm suốt 1 tiếng mà không thu được thông tin nào cho dự án"]
  ),

  // CV Validation (5)
  q("UX_RES-CV-01", "UX Researcher", "cv_validation", "advanced", "middle",
    "Trong dự án nghiên cứu người dùng độc lập mà em ghi trên CV: Hãy trình bày phương pháp luận nghiên cứu (Research Methodology), quy mô cỡ mẫu (Sample Size), insight bất ngờ nhất được phát hiện và tác động trực tiếp của nó đến việc thay đổi Roadmap sản phẩm?",
    ["Trình bày rõ ràng bài toán kinh doanh ban đầu và các câu hỏi nghiên cứu cốt lõi (Research Questions)", "Mô tả phương pháp lựa chọn (vd: phỏng vấn 12 người dùng sâu kết hợp khảo sát định lượng 300 mẫu)", "Chia sẻ insight then chốt làm thay đổi tư duy của Product Team và dẫn chứng tính năng mới được đưa vào roadmap dựa trên khuyến nghị đó"],
    ["Khó khăn lớn nhất trong khâu tuyển dụng người tham gia của dự án đó là gì?", "Nếu được làm lại dự án đó hôm nay, em sẽ thay đổi điều gì trong phương pháp tiếp cận?"] ,
    ["CV Validation", "Research Methodology", "Insight Impact", "Product Roadmap", "Sample Size"],
    [RES_SRC.internal],
    ["Nói chung chung về việc phỏng vấn nhưng không nhớ rõ phương pháp, câu hỏi nghiên cứu hay tác động thực tế"]
  ),
  q("UX_RES-CV-02", "UX Researcher", "cv_validation", "intermediate", "middle",
    "CV của em có đề cập đến việc xây dựng Hệ thống kho lưu trữ nghiên cứu (Research Repository). Em đã cấu trúc cơ sở dữ liệu này như thế nào, và làm sao để đảm bảo các Product Managers và Designers chủ động tìm kiếm và sử dụng lại các insights đó hàng tuần?",
    ["Mô tả cấu trúc taxonomy: phân loại theo Journey stage, Persona, Feature, Pain points trên công cụ Dovetail/Notion", "Tổ chức các buổi chia sẻ 'Insight of the Month' và gắn link insight trực tiếp vào các ticket Jira của Product", "Đo lường tỷ lệ tiếp nhận (Adoption): số lượng thành viên truy cập kho tri thức và số lượng quyết định sản phẩm trích dẫn nguồn từ kho"],
    ["Cách xử lý việc cập nhật hoặc gỡ bỏ các insights cũ đã lỗi thời theo thời gian?", "Làm thế nào để đào tạo đội ngũ không chuyên về nghiên cứu biết cách tìm kiếm thông tin hiệu quả?"] ,
    ["Research Repository", "Taxonomy", "Knowledge Sharing", "Insight Adoption"],
    [RES_SRC.dovetail, RES_SRC.internal],
    ["Xây dựng một trang tài liệu rồi bỏ hoang không ai sử dụng"]
  ),
  q("UX_RES-CV-03", "UX Researcher", "cv_validation", "intermediate", "junior",
    "Trong một dự án nghiên cứu có sự tham gia của các bên liên quan (Stakeholder-engaged Research) mà em từng chủ trì: Em đã lôi kéo các Product Managers và Developers cùng tham gia quan sát các buổi phỏng vấn (Observer) như thế nào để họ trực tiếp cảm nhận nỗi đau của người dùng?",
    ["Tạo tài liệu hướng dẫn dành riêng cho Observer: dặn dò tắt mic, không ngắt lời, hướng dẫn cách ghi chép quan sát khách quan", "Tổ chức buổi họp Debrief 15 phút ngay sau mỗi phiên phỏng vấn để toàn bộ team cùng chia sẻ cảm nghĩ nhanh", "Quan sát thấy sự thay đổi nhận thức rõ rệt của kỹ sư lập trình sau khi tận mắt chứng kiến người dùng gặp khó khăn với dòng code của họ"],
    ["Khi một stakeholder cố tình vi phạm nguyên tắc và bật mic can thiệp vào buổi phỏng vấn, em xử lý tình huống đó thế nào?", "Lợi ích của việc đưa dev đi thực địa so với việc chỉ gửi báo cáo tóm tắt cho họ?"] ,
    ["Stakeholder Observers", "Debrief Sessions", "Team Empathy", "Fieldwork"],
    [RES_SRC.internal],
    ["Tự làm nghiên cứu một mình trong phòng kín và chỉ ném báo cáo cho team vào ngày cuối cùng"]
  ),
  q("UX_RES-CV-04", "UX Researcher", "cv_validation", "advanced", "middle",
    "CV của em có nhắc đến việc thực hiện Nghiên cứu Đánh giá Tiêu chuẩn (Benchmark Study) đo lường trải nghiệm theo chu kỳ (hàng quý/nửa năm). Em đã chọn những chỉ số đo lường nào (SUS, SEQ, Task Time) và báo cáo xu hướng tiến bộ cho ban lãnh đạo ra sao?",
    ["Xác định bộ kịch bản tác vụ chuẩn (Standardized Task Set) không thay đổi qua các kỳ để đảm bảo tính so sánh khách quan", "Theo dõi sự dịch chuyển của các chỉ số qua thời gian: điểm SUS tăng từ 65 lên 78, thời gian hoàn thành tác vụ rút ngắn 40%", "Trực quan hóa biểu đồ xu hướng (Trendline) kết hợp với các mốc phát hành tính năng lớn để chỉ rõ nguyên nhân của sự thay đổi chỉ số"],
    ["Làm thế nào để kiểm soát các biến số ngoại cảnh (môi trường mạng, cập nhật hệ điều hành) không làm sai lệch kết quả benchmark?", "Khi một chỉ số benchmark bất ngờ tụt giảm sau một bản cập nhật lớn, em phản ứng ra sao?"] ,
    ["Benchmark Study", "Standardized Tasks", "Trend Analysis", "Executive Dashboard"],
    [RES_SRC.internal, RES_SRC.nng],
    ["Thay đổi kịch bản kiểm tra qua mỗi kỳ khiến kết quả các quý không thể so sánh đối chiếu được với nhau"]
  ),
  q("UX_RES-CV-05", "UX Researcher", "cv_validation", "advanced", "senior_lead",
    "Khi thực hiện nghiên cứu người dùng tại thị trường quốc tế hoặc các vùng miền có đặc thù văn hóa khác biệt (Cross-cultural Research): Em đã điều chỉnh cách tiếp cận ngôn ngữ, phong tục và cách đặt câu hỏi như thế nào để không phạm vào các điều cấm kỵ văn hóa?",
    ["Nghiên cứu kỹ lưỡng các chiều kích văn hóa (Hofstede Cultural Dimensions: Power Distance, Collectivism vs Individualism)", "Phối hợp với thông dịch viên hoặc nhà nghiên cứu bản địa để dịch thuật ngược (Back-translation) nhằm bảo toàn sắc thái ngữ nghĩa", "Điều chỉnh thái độ giao tiếp phù hợp với văn hóa địa phương (ở nền văn hóa có khoảng cách quyền lực cao, người tham gia thường ngần ngại chỉ trích sản phẩm trực tiếp)"],
    ["Làm thế nào để phát hiện các tín hiệu phi ngôn ngữ (ngôn ngữ cơ thể, cử chỉ) đặc thù của từng vùng miền?", "Phương pháp kiểm chứng tính tương thích văn hóa của các hình ảnh minh họa và biểu tượng trong sản phẩm?"] ,
    ["Cross-cultural Research", "Cultural Dimensions", "Localization UX", "Global Research"],
    [RES_SRC.internal],
    ["Áp dụng rập khuôn văn hóa phương Tây vào người dùng châu Á và cho rằng mọi người dùng trên thế giới đều suy nghĩ như nhau"]
  ),

  // Behavioral (5)
  q("UX_RES-BEHAV-01", "UX Researcher", "behavioral", "intermediate", "middle",
    "Khi kết quả nghiên cứu khoa học của em chỉ ra rằng một tính năng mà Tổng Giám đốc (CEO) vô cùng tâm huyết thực chất không được người dùng đón nhận và gây ra sự khó chịu, em chuẩn bị tâm lý và trình bày kết quả 'đắng lòng' này như thế nào?",
    ["Chuẩn bị dữ liệu vững chắc, không để cảm xúc cá nhân chi phối; tập trung vào mục tiêu giúp công ty tránh lãng phí hàng tỷ đồng đầu tư sai hướng", "Mở đầu bằng việc ghi nhận tầm nhìn chiến lược của CEO; sau đó trình bày thực tế phản ứng của người dùng thông qua video và dữ liệu trung thực", "Không chỉ dừng lại ở việc báo tin xấu; đề xuất các hướng xoay trục (Pivot options) khả thi dựa trên những nhu cầu thật mà nghiên cứu vừa phát hiện"],
    ["Làm thế nào để bảo vệ tính toàn vẹn của kết quả nghiên cứu mà không làm tổn thương lòng tự trọng của lãnh đạo?", "Em đã từng gặp trường hợp bị yêu cầu chỉnh sửa báo cáo để làm đẹp lòng sếp chưa và em phản ứng ra sao?"] ,
    ["Delivering Bad News", "Executive Communication", "Research Integrity", "Pivot Opportunities"],
    [RES_SRC.internal],
    ["Sợ sếp giận nên bóp méo kết quả nghiên cứu hoặc trình bày với thái độ thách thức đắc thắng"]
  ),
  q("UX_RES-BEHAV-02", "UX Researcher", "behavioral", "intermediate", "junior",
    "Khi Product Manager nói rằng: 'Chúng ta không có thời gian 2 tuần để làm nghiên cứu, Sprint sắp bắt đầu rồi, hãy để team tự quyết định theo trực giác', em phản ứng và đề xuất phương án Nghiên cứu Tinh gọn (Lean Research) ra sao?",
    ["Không cản trở tiến độ của team; giải thích rằng 'Nghiên cứu nhanh trong 2 ngày vẫn tốt hơn gấp nhiều lần việc mò mẫm trong bóng tối'", "Đề xuất quy trình Lean UX Research cấp tốc trong 48 giờ: chạy 3 buổi phỏng vấn nhanh hoặc test thử prototype với 4 người dùng nội bộ khác phòng ban", "Cung cấp các phát hiện nhanh (Top 3 findings) ngay trong ngày để PM kịp đưa ra quyết định Sprint mà không bị trễ hạn"],
    ["Làm thế nào để chứng minh rằng chi phí của 2 ngày nghiên cứu rẻ hơn rất nhiều so với 2 tháng code một tính năng vô dụng?", "Khi nào thì được phép bỏ qua nghiên cứu để ưu tiên tốc độ phát hành tính năng?"] ,
    ["Lean UX Research", "Fast-paced Sprint", "Time Trade-off", "Guerilla Testing"],
    [RES_SRC.internal],
    ["Than vãn đòi hoãn Sprint bằng được hoặc buông xuôi hoàn toàn không làm gì cả"]
  ),
  q("UX_RES-BEHAV-03", "UX Researcher", "behavioral", "intermediate", "middle",
    "Trong một buổi phỏng vấn người dùng, người tham gia bất ngờ xúc động mạnh, rơi nước mắt hoặc trở nên giận dữ khi chia sẻ về một trải nghiệm tiêu cực (ví dụ: bị lừa đảo tài chính hoặc sự cố y tế). Em ứng phó với tình huống đạo đức nghiên cứu nhạy cảm này như thế nào?",
    ["Tạm dừng ngay lập tức việc ghi âm/ghi hình và thể hiện sự đồng cảm chân thành của một con người trước khi là một nhà nghiên cứu", "Nhẹ nhàng hỏi xem họ có muốn nghỉ giải lao uống nước hoặc dừng buổi phỏng vấn hoàn toàn hay không", "Khẳng định quyền tự quyết của họ: nếu họ muốn dừng, vẫn gửi đầy đủ quà cảm ơn và cam kết xóa bỏ hoàn toàn phần dữ liệu nhạy cảm nếu họ yêu cầu"],
    ["Nguyên tắc đạo đức 'Không gây tổn hại' (Do No Harm) trong nghiên cứu người dùng đòi hỏi điều gì?", "Cách bảo vệ tâm lý của chính nhà nghiên cứu (Researcher Burnout / Secondary Trauma) khi thường xuyên lắng nghe các câu chuyện thương tâm?"] ,
    ["Research Ethics", "Trauma-informed Research", "Empathy", "Participant Wellbeing"],
    [RES_SRC.internal],
    ["Vô cảm tiếp tục dí micro hỏi dồn để khai thác thông tin kịch tính phục vụ báo cáo"]
  ),
  q("UX_RES-BEHAV-04", "UX Researcher", "behavioral", "intermediate", "junior",
    "Khi em nhận thấy một UX Designer trong nhóm thường xuyên diễn giải sai lệch các phát hiện nghiên cứu của em để phục vụ cho sở thích thẩm mỹ cá nhân của họ, em xử lý tình huống bất đồng chuyên môn này ra sao?",
    ["Chủ động hẹn Designer một buổi cà phê trò chuyện chân thành, không mang tính công kích", "Cùng nhau mở lại các đoạn băng ghi âm và ghi chú gốc để đối chiếu xem sự sai lệch bắt nguồn từ đâu (do câu chữ trong báo cáo chưa rõ ràng hay do hiểu nhầm)", "Cùng Designer đồng sáng tạo (Co-design): ngồi bên cạnh hỗ trợ họ chuyển hóa đúng tinh thần của insight thành giải pháp thiết kế khả thi"],
    ["Làm thế nào để viết khuyến nghị nghiên cứu (Design Recommendations) dưới dạng vấn đề cần giải quyết thay vì chỉ định cách vẽ cụ thể?", "Cách xây dựng tinh thần đồng đội keo sơn giữa Nhà nghiên cứu và Nhà thiết kế?"] ,
    ["Misinterpretation of Insights", "Designer Collaboration", "Co-design", "Clear Recommendations"],
    [RES_SRC.internal],
    ["Lên tiếng tố cáo Designer với sếp rằng họ cố tình bóp méo dữ liệu nghiên cứu"]
  ),
  q("UX_RES-BEHAV-05", "UX Researcher", "behavioral", "advanced", "senior_lead",
    "Làm thế nào em nâng cao 'Độ trưởng thành về Trải nghiệm' (UX Research Maturity) trong một tổ chức mà mọi người ban đầu xem nghiên cứu chỉ là một hoạt động kiểm tra thủ tục phù phiếm, tốn kém?",
    ["Bắt đầu bằng những chiến thắng nhỏ (Quick Wins): giải quyết một bài toán cụ thể nhức nhối và chứng minh hiệu quả kinh doanh rõ ràng", "Dân chủ hóa nghiên cứu có kiểm soát (Democratizing Research): đào tạo các kỹ năng phỏng vấn cơ bản cho PM và Designers dưới sự giám sát của mình", "Xây dựng các kênh chia sẻ thú vị (Kênh Slack 'Tiếng nói khách hàng', Lunch & Learn) đưa hơi thở đời sống của người dùng vào từng góc làm việc của công ty"],
    ["Những rủi ro khi 'dân chủ hóa nghiên cứu' cho những người không có chuyên môn là gì và cách kiểm soát chất lượng?", "Làm thế nào để đo lường ROI (Lợi tức đầu tư) của hoạt động UX Research trong toàn doanh nghiệp?"] ,
    ["Research Maturity", "Quick Wins", "Democratizing Research", "ROI of Research", "Culture Transformation"],
    [RES_SRC.internal],
    ["Ngại tiếp cận phương pháp nghiên cứu mới, giữ khư khư các kỹ thuật cũ không còn phù hợp với bối cảnh sản phẩm số"]
  )
];

console.log("UX Researcher questions defined:", uxResearcherQuestions.length);

module.exports = {
  uxResearcherQuestions
};
