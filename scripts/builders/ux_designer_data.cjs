const { q, SRC } = require('./fe_data.cjs');

const DES_SRC = {
  nng: "https://www.nngroup.com/articles/",
  material: "https://m3.material.io/",
  apple_hig: "https://developer.apple.com/design/human-interface-guidelines/",
  w3c_wcag: "https://www.w3.org/WAI/standards-guidelines/wcag/",
  ixdf: "https://www.interaction-design.org/literature",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 2. UX DESIGNER
const uxDesignerQuestions = [
  // Foundation (6)
  q("UX_DES-FOUND-01", "UX Designer", "foundation", "intermediate", "junior",
    "Phân tích 10 Nguyên tắc Heuristic của Jakob Nielsen trong đánh giá trải nghiệm người dùng. Chọn 3 nguyên tắc em thấy các ứng dụng công nghệ tại Việt Nam vi phạm nhiều nhất và đưa ra phản biện?",
    ["Trình bày các nguyên tắc cốt lõi: Khả năng nhận biết trạng thái hệ thống (Visibility of system status), Khớp nối với thế giới thực (Match between system and real world), Kiểm soát và tự do của người dùng (User control and freedom), Nhất quán (Consistency), Phòng ngừa lỗi (Error prevention), Nhận diện thay vì nhớ lại (Recognition rather than recall)", "Chỉ rõ vi phạm thực tế: không hiển thị trạng thái đang xử lý, dùng thuật ngữ kỹ thuật khó hiểu (mã lỗi 403, NPE), bẫy người dùng không có nút Undo", "Nhấn mạnh vai trò của Heuristic Evaluation như phương pháp kiểm định nhanh, chi phí thấp"],
    ["Heuristic Evaluation khác biệt với Usability Testing ở những khía cạnh cốt lõi nào?", "Khi một quy tắc Heuristic xung đột với mục tiêu kinh doanh ngắn hạn, em cân bằng ra sao?"],
    ["Jakob Nielsen", "10 Usability Heuristics", "Heuristic Evaluation", "Error Prevention", "Recognition"],
    [DES_SRC.nng, DES_SRC.ixdf],
    ["Học thuộc lòng 10 nguyên tắc nhưng không liên hệ được vào các lỗi trải nghiệm thực tế"]
  ),
  q("UX_DES-FOUND-02", "UX Designer", "foundation", "intermediate", "junior",
    "Kiến trúc thông tin (Information Architecture - IA): Cách tổ chức dữ liệu theo nguyên tắc LATCH (Location, Alphabet, Time, Category, Hierarchy) của Richard Saul Wurman? Làm thế nào để phân cấp thông tin phản ánh đúng Mô hình tư duy (Mental Model) của người dùng thay vì cấu trúc cơ sở dữ liệu của đội kỹ thuật?",
    ["Nắm chắc 5 phương thức tổ chức thông tin LATCH và phạm vi áp dụng tối ưu cho từng phương thức", "Phân biệt Mental Model (cách người dùng hình dung sản phẩm hoạt động) và Implementation Model (cách hệ thống thực sự được lập trình bên dưới)", "Thu hẹp khoảng cách bằng cách dùng ngôn ngữ và phân nhóm theo thói quen của người dùng thay vì cấu trúc bảng DB"],
    ["Phương pháp Card Sorting (Open vs Closed) hỗ trợ xây dựng kiến trúc thông tin như thế nào?", "Thế nào là 'Nghịch lý của sự lựa chọn' (Paradox of Choice) trong cấu trúc điều hướng?"],
    ["Information Architecture", "Mental Model", "LATCH Principle", "Card Sorting", "Navigation"],
    [DES_SRC.nng, DES_SRC.ixdf],
    ["Bê nguyên cấu trúc phòng ban công ty hoặc cấu trúc cơ sở dữ liệu làm menu điều hướng cho người dùng"]
  ),
  q("UX_DES-FOUND-03", "UX Designer", "foundation", "basic", "junior",
    "Các định luật tâm lý học nhận thức trong thiết kế UX: Định luật Hick's Law, Fitts's Law và Miller's Law (7 ± 2) chi phối hành vi người dùng như thế nào khi tương tác với sản phẩm số?",
    ["Hick's Law: Thời gian đưa ra quyết định tăng theo số lượng và độ phức tạp của các lựa chọn; cần hạn chế số lượng lựa chọn cùng lúc", "Fitts's Law: Thời gian di chuyển đến mục tiêu phụ thuộc vào khoảng cách và kích thước của mục tiêu; nút bấm quan trọng cần to và dễ chạm tới (ở góc/cạnh màn hình)", "Miller's Law: Trí nhớ ngắn hạn của con người chỉ giữ được 7 ± 2 đơn vị thông tin; áp dụng kỹ thuật Chunking để phân đoạn dữ liệu"],
    ["Định luật Fitts được áp dụng như thế nào trên màn hình cảm ứng di động (Thumb Zone)?", "Định luật Jakob's Law (người dùng dành phần lớn thời gian ở các website khác) ảnh hưởng đến tính nhất quán ra sao?"],
    ["Hick's Law", "Fitts's Law", "Miller's Law", "Thumb Zone", "Cognitive Psychology"],
    [DES_SRC.ixdf, DES_SRC.nng],
    ["Cho rằng đặt càng nhiều tính năng trên một trang thì người dùng càng tiện thao tác"]
  ),
  q("UX_DES-FOUND-04", "UX Designer", "foundation", "intermediate", "middle",
    "Phân biệt giữa User Journey Map (Hành trình người dùng) và Service Blueprint (Bản thiết kế dịch vụ). Khi nào cần sử dụng Service Blueprint để giải quyết các điểm gãy trong trải nghiệm khách hàng?",
    ["User Journey Map tập trung vào góc nhìn của người dùng (Customer perspective): giai đoạn, hành động, suy nghĩ, cảm xúc (touchpoints, pain points, emotional curve)", "Service Blueprint mở rộng ra cả bức tranh vận hành nội bộ (Frontstage, Backstage, Support Processes, Physical Evidence)", "Sử dụng Service Blueprint khi trải nghiệm số gắn liền với quy trình vận hành offline (giao hàng, tài xế, kho bãi, chăm sóc khách hàng)"],
    ["Line of Visibility (Ranh giới hiển thị) trong Service Blueprint có ý nghĩa gì?", "Làm thế nào để gắn các chỉ số đo lường hiệu suất (SLA, drop-off) vào từng bước của Service Blueprint?"],
    ["User Journey Map", "Service Blueprint", "Frontstage vs Backstage", "Touchpoints", "Omnichannel UX"],
    [DES_SRC.nng],
    ["Đồng nhất Journey Map và Service Blueprint làm một, bỏ qua toàn bộ quy trình vận hành hậu trường"]
  ),
  q("UX_DES-FOUND-05", "UX Designer", "foundation", "advanced", "middle",
    "Khái niệm Dark Patterns (Mô hình thiết kế thao túng / Lừa dối) trong UX: Phân tích các dạng phổ biến như Roach Motel, Confirmshaming, Hidden Costs và Misdirection. Trách nhiệm đạo đức của UX Designer và tác hại lâu dài của Dark Patterns đến uy tín thương hiệu là gì?",
    ["Roach Motel: Dễ vào nhưng khó ra (dễ đăng ký nhưng bắt gọi hotline để hủy dịch vụ)", "Confirmshaming: Ép người dùng cảm thấy có lỗi nếu từ chối (vd: nút từ chối ghi 'Không, tôi không muốn tiết kiệm tiền')", "Hidden Costs: Phát sinh chi phí ẩn ở bước thanh toán cuối; Misdirection: Đánh lạc hướng chú ý", "Tác hại: Mất niềm tin khách hàng, tăng tỷ lệ rời bỏ (Churn Rate), rủi ro pháp lý theo luật bảo vệ người tiêu dùng quốc tế"],
    ["Làm thế nào để bảo vệ người dùng và từ chối khéo léo khi cấp trên yêu cầu cài cắm Dark Pattern để tăng KPI ngắn hạn?", "Khái niệm 'Honest UX' (Trải nghiệm trung thực) đem lại lợi ích kinh doanh bền vững ra sao?"],
    ["Dark Patterns", "Roach Motel", "Ethical UX", "Confirmshaming", "Consumer Trust"],
    [DES_SRC.nng, DES_SRC.ixdf],
    ["Bào chữa cho Dark Patterns như một mẹo tối ưu chuyển đổi bình thường mà không nhận thức về mặt đạo đức"]
  ),
  q("UX_DES-FOUND-06", "UX Designer", "foundation", "basic", "junior",
    "Khả năng tiếp cận nhận thức (Cognitive Accessibility) trong thiết kế UX: Làm thế nào để giảm Tải trọng nhận thức (Cognitive Load: Intrinsic, Extraneous, Germane) cho người dùng bị suy giảm nhận thức tạm thời (mệt mỏi, phân tâm khi lái xe) hoặc vĩnh viễn?",
    ["Tải trọng nhận thức ngoại lai (Extraneous Cognitive Load) là thứ do thiết kế vụng về gây ra (rối mắt, thuật ngữ khó); cần loại bỏ triệt để", "Sử dụng ngôn ngữ đơn giản, rõ ràng (Plain Language), câu cú ngắn gọn", "Cung cấp các điểm neo hỗ trợ (Scaffolding: Breadcrumbs, Progress bars, Save draft) để người dùng quay lại tác vụ dễ dàng sau khi bị gián đoạn"],
    ["Làm thế nào để thiết kế một luồng tác vụ an toàn cho người dùng khi họ đang vừa đi bộ vừa bấm điện thoại?", "Nguyên lý 'Graceful Degradation' trong trải nghiệm người dùng hoạt động ra sao?"],
    ["Cognitive Load", "Accessibility", "Plain Language", "Extraneous Load", "Usability"],
    [DES_SRC.w3c_wcag, DES_SRC.nng],
    ["Nghĩ rằng Accessibility chỉ là việc hỗ trợ người mù dùng máy đọc màn hình mà quên mất khía cạnh nhận thức"]
  ),

  // Practical Skills (8)
  q("UX_DES-SKILL-01", "UX Designer", "practical_skills", "intermediate", "junior",
    "Quy trình xây dựng Wireframe từ Low-fidelity (phác thảo giấy/Balsamiq) đến Mid-fidelity (Figma): Em xác định những yếu tố nào được phép và không được phép xuất hiện trong Wireframe để tập trung hoàn toàn vào cấu trúc luồng và nội dung mà không bị phân tâm bởi thẩm mỹ?",
    ["Trong Low/Mid-fi wireframe: KHÔNG dùng màu sắc trang trí (chỉ dùng thang độ xám grayscale), không dùng font chữ nghệ thuật, không dùng ảnh chụp chi tiết", "TẬP TRUNG VÀO: Cấu trúc phân cấp thông tin, vị trí tương đối của các khối chức năng, luồng hành động chính và phụ", "Sử dụng nội dung chữ có nghĩa thực tế thay vì Lorem Ipsum để kiểm chứng tính khả thi của bố cục"],
    ["Làm thế nào để giải thích cho khách hàng hiểu Wireframe là bản vẽ kiến trúc chứ không phải giao diện cuối cùng?", "Khi nào nên nhảy thẳng vào High-fidelity và khi nào bắt buộc phải làm Wireframe trước?"],
    ["Wireframing", "Low-fi vs Mid-fi", "Information Structure", "Rapid Prototyping"],
    [DES_SRC.nng, DES_SRC.ixdf],
    ["Mất hàng giờ tô màu và chỉnh sửa bóng đổ chi tiết ngay trong giai đoạn phác thảo wireframe ban đầu"]
  ),
  q("UX_DES-SKILL-02", "UX Designer", "practical_skills", "intermediate", "middle",
    "Kỹ thuật thiết kế User Flows và Task Flows phức tạp: Em biểu diễn các điểm rẽ nhánh điều kiện (Decision Points), các luồng ngoại lệ (Unhappy Paths), và trạng thái vòng lặp (Loops) như thế nào để lập trình viên và kiểm thử viên có thể bao quát toàn bộ kịch bản nghiệp vụ?",
    ["Sử dụng quy chuẩn ký hiệu trực quan rõ ràng: Hình chữ nhật (Màn hình/Hành động), Hình thoi (Điểm quyết định/Điều kiện Yes-No), Mũi tên (Hướng di chuyển)", "Phân biệt rõ ràng giữa Happy Path (luồng thành công lý tưởng) và Unhappy Paths (nhập sai OTP, hết hàng, mất mạng, từ chối quyền)", "Đánh số thứ tự các bước và ghi chú mã điều kiện logic rõ ràng để phục vụ viết Test Case"],
    ["Công cụ nào (Miro, FigJam, Whimsical) em hay sử dụng để lập sơ đồ luồng người dùng cùng team?", "Cách xử lý User Flow có hơn 20 bước phức tạp mà không làm người xem bị choáng ngợp?"],
    ["User Flows", "Task Flows", "Unhappy Paths", "Decision Trees", "Flowchart Standard"],
    [DES_SRC.nng, DES_SRC.internal],
    ["Chỉ vẽ duy nhất luồng Happy Path và bỏ qua hoàn toàn các kịch bản lỗi hay ngoại lệ"]
  ),
  q("UX_DES-SKILL-03", "UX Designer", "practical_skills", "advanced", "middle",
    "Quy trình thực hiện Đánh giá Heuristic độc lập (Heuristic Evaluation) cho một tính năng hiện hữu: Em xây dựng ma trận đánh giá (Severity Rating: 0 - Cosmetical, 1 - Minor, 2 - Major, 3 - Usability Catastrophe) và báo cáo khuyến nghị khắc phục như thế nào?",
    ["Chạy thử nghiệm toàn bộ luồng tác vụ với tư cách chuyên gia, soi chiếu từng màn hình với 10 nguyên tắc Heuristic", "Chấm điểm mức độ nghiêm trọng (Severity) dựa trên: Tần suất gặp phải, Mức độ tác động đến việc hoàn thành tác vụ, Tính dai dẳng của lỗi", "Trình bày báo cáo kèm ảnh chụp bằng chứng lỗi, giải thích nguyên tắc bị vi phạm và đề xuất giải pháp phác thảo cụ thể ngay lập tức"],
    ["Cần tối thiểu bao nhiêu chuyên gia UX cùng thực hiện Heuristic Evaluation độc lập để phát hiện trên 80% vấn đề?", "Làm thế nào để ưu tiên các hạng mục cần sửa chữa trong backlog sản phẩm dựa trên điểm Severity?"],
    ["Heuristic Evaluation", "Severity Rating", "Usability Audit", "Defect Matrix"],
    [DES_SRC.nng],
    ["Liệt kê các điểm không thích mang tính cảm tính chủ quan mà không căn cứ vào nguyên tắc Heuristic chuẩn"]
  ),
  q("UX_DES-SKILL-04", "UX Designer", "practical_skills", "advanced", "middle",
    "Lập kế hoạch và điều phối Kiểm thử khả năng sử dụng (Usability Testing) với 5 người dùng: Em thiết kế Kịch bản kiểm thử (Test Protocol), câu hỏi sàng lọc (Screener), các nhiệm vụ mở (Open-ended Tasks) và áp dụng phương pháp 'Nghĩ thành tiếng' (Think Aloud Protocol) ra sao?",
    ["Viết Screener để tuyển đúng người dùng mục tiêu; kịch bản bao gồm 3-5 nhiệm vụ cụ thể dựa trên mục tiêu thực tế (không chỉ định bấm vào đâu)", "Hướng dẫn người dùng phương pháp Think Aloud: nói to suy nghĩ, cảm xúc và sự do dự trong lúc thao tác", "Người điều phối giữ thái độ trung lập tuyệt đối, không khen ngợi, không hướng dẫn hay giải thích tính năng khi người dùng bị kẹt"],
    ["Tại sao theo Nielsen chỉ cần 5 người dùng là đã phát hiện được khoảng 85% các vấn đề về khả năng sử dụng?", "Cách tính toán thang đo độ khó của nhiệm vụ (Single Ease Question - SEQ) sau mỗi task?"] ,
    ["Usability Testing", "Think Aloud Protocol", "Task Design", "Screener Questionnaire", "SEQ"],
    [DES_SRC.nng],
    ["Dạy người dùng cách dùng app hoặc can thiệp trả lời hộ khi người dùng đang gặp khó khăn trong bài test"]
  ),
  q("UX_DES-SKILL-05", "UX Designer", "practical_skills", "advanced", "senior_lead",
    "Tối ưu hóa Phễu chuyển đổi (Conversion Funnel Optimization): Khi phát hiện tỷ lệ thoát trang (Drop-off Rate) tại bước thanh toán lên đến 55%, em sử dụng các công cụ phân tích định lượng (Mixpanel/Google Analytics, Funnel Analysis) kết hợp định tính (Hotjar/Clarity Heatmaps, Session Recordings) như thế nào để tìm ra rào cản ma sát (Friction)?",
    ["Phân tích Funnel để xác định chính xác điểm rơi: người dùng dừng lại ở trường nhập liệu nào hay nút bấm nào", "Xem Session Recordings và Heatmaps để quan sát hành vi thực tế: người dùng có bị 'Rage Clicks' (bấm liên tục trong bực bội) hay do dự di chuột lâu?", "Phát hiện ma sát: biểu mẫu đòi hỏi quá nhiều thông tin nhạy cảm, lỗi validation không rõ ràng hoặc không có phương thức thanh toán quen thuộc"],
    ["Làm thế nào để phân biệt giữa ma sát có hại (Harmful Friction) và ma sát có lợi (Positive Friction - bảo vệ an toàn chuyển khoản)?", "Cách thiết kế thử nghiệm A/B Testing để kiểm chứng phương án tối ưu phễu?"],
    ["Conversion Funnel", "Drop-off Analysis", "Heatmaps", "Session Recording", "Rage Clicks"],
    [DES_SRC.nng, DES_SRC.internal],
    ["Đoán mò nguyên nhân và thay đổi giao diện theo linh cảm mà không nhìn vào dữ liệu phễu và bản ghi hành vi"]
  ),
  q("UX_DES-SKILL-06", "UX Designer", "practical_skills", "intermediate", "middle",
    "Thiết kế Kiến trúc thông tin cho một trang thương mại điện tử lớn: Em sử dụng phương pháp Phân loại thẻ (Card Sorting: Open, Closed, Hybrid) và Kiểm thử cấu trúc cây (Tree Testing) như thế nào để xây dựng hệ thống menu đa tầng (Mega Menu) chuẩn xác?",
    ["Tổ chức Open Card Sorting để người dùng tự do gom nhóm sản phẩm và đặt tên danh mục, tìm ra cách hiểu tự nhiên của họ", "Chạy Closed Card Sorting để xác thực cấu trúc danh mục đã đề xuất", "Thực hiện Tree Testing (kiểm tra không có giao diện) để đo lường tỷ lệ tìm thấy món hàng (Findability) và thời gian hoàn thành tác vụ trên cây menu"],
    ["Khi nào nên dùng Mega Menu và khi nào nên dùng Navigation dạng Dropdown truyền thống?", "Cách xử lý các sản phẩm có thể thuộc về nhiều danh mục khác nhau (Polyhierarchy)?"] ,
    ["Card Sorting", "Tree Testing", "Mega Menu", "Findability", "Information Architecture"],
    [DES_SRC.nng],
    ["Xây dựng menu theo cấu trúc kho hàng nội bộ của doanh nghiệp khiến khách hàng tìm kiếm lòng vòng không thấy"]
  ),
  q("UX_DES-SKILL-07", "UX Designer", "practical_skills", "intermediate", "middle",
    "Thiết kế Tìm kiếm và Bộ lọc nâng cao (Search & Faceted Navigation): Em tổ chức các tiêu chí lọc (Filters: đa lựa chọn, khoảng giá, trạng thái), tính năng gợi ý thông minh (Typeahead / Autocomplete) và trang hiển thị kết quả tìm kiếm ra sao để tối đa hóa khả năng khám phá sản phẩm?",
    ["Đặt thanh tìm kiếm nổi bật ở vị trí chuẩn mực kèm văn bản gợi ý rõ ràng (Placeholder gợi ý từ khóa phổ biến)", "Hệ thống lọc theo khía cạnh (Faceted Filtering) hiển thị số lượng kết quả khớp tạm tính bên cạnh mỗi tùy chọn (vd: 'Áo thun (42)')", "Cho phép chọn nhiều bộ lọc cùng lúc và áp dụng tức thời hoặc qua nút 'Xem kết quả' có hiển thị số lượng sản phẩm được cập nhật realtime"],
    ["Cách hiển thị các chip bộ lọc đã chọn (Active Filter Chips) và tính năng 'Xóa tất cả bộ lọc' nhanh chóng?", "Khi kết quả tìm kiếm trả về bằng 0 (Zero Results), em gợi ý từ khóa tương tự hoặc sửa lỗi chính tả (Did you mean?) ra sao?"],
    ["Faceted Navigation", "Search UX", "Autocomplete", "Filter Chips", "Zero State Search"],
    [DES_SRC.nng],
    ["Ẩn nút lọc ở chỗ khó tìm và mỗi lần chọn 1 checkbox lại tải lại toàn bộ trang làm gián đoạn trải nghiệm"]
  ),
  q("UX_DES-SKILL-08", "UX Designer", "practical_skills", "intermediate", "junior",
    "Kỹ thuật Viết nội dung trải nghiệm (UX Copywriting & Microcopy): Em áp dụng những nguyên tắc nào (Ngắn gọn, Rõ ràng, Hành động, Đồng cảm) để viết các thông báo lỗi (Error Messages), nhãn nút bấm (Action Labels) và các bước xác nhận hành động nguy hiểm (Destructive Confirmations)?",
    ["Thông báo lỗi phải trả lời 3 câu hỏi: Chuyện gì đã xảy ra? Vì sao xảy ra? Người dùng cần làm gì ngay bây giờ để khắc phục?", "Nhãn nút bấm phải là động từ chỉ hành động cụ thể ('Lưu thay đổi', 'Gửi hồ sơ') thay vì từ chung chung như 'OK', 'Có'", "Hành động nguy hiểm (như Xóa tài khoản) cần hộp thoại xác nhận rõ ràng hậu quả không thể khôi phục và nút xóa dùng màu cảnh báo riêng biệt"],
    ["Tại sao việc dùng từ ngữ tích cực và tránh đổ lỗi cho người dùng (tránh từ 'Bạn đã làm sai...') lại giữ chân được khách hàng?", "Cách viết nội dung Tooltip ngắn gọn mà vẫn giải thích trọn vẹn nghiệp vụ phức tạp?"],
    ["UX Writing", "Microcopy", "Error Messages", "Action Labels", "Destructive Actions"],
    [DES_SRC.nng],
    ["Viết thông báo lỗi mơ hồ kiểu 'Đã có lỗi xảy ra. Vui lòng thử lại sau' mà không hướng dẫn người dùng cách xử lý"]
  ),

  // Scenario (6)
  q("UX_DES-SCEN-01", "UX Designer", "scenario", "advanced", "middle",
    "Tình huống: Dữ liệu phân tích cho thấy tỷ lệ người dùng bỏ dở ở bước điền thông tin địa chỉ giao hàng và phương thức thanh toán lên đến 60%. Nếu được giao chủ trì giải quyết bài toán này, các bước nghiên cứu nguyên nhân gốc rễ và tái thiết kế luồng Checkout của em sẽ diễn ra như thế nào?",
    ["Bước 1: Phân tích định lượng (Funnel, Form Analytics để xem trường nào khiến người dùng mất nhiều thời gian nhất hoặc báo lỗi nhiều nhất)", "Bước 2: Phân tích định tính (Xem lại session recordings, phỏng vấn 5 người vừa từ bỏ giỏ hàng)", "Bước 3: Tái thiết kế: Tinh gọn biểu mẫu (bỏ các trường không cần thiết), tự động điền địa chỉ qua định vị hoặc API hành chính, hỗ trợ Mua hàng không cần đăng ký tài khoản (Guest Checkout)", "Bước 4: Thiết lập A/B testing đo lường chỉ số hoàn tất thanh toán"],
    ["Tại sao Guest Checkout lại là một trong những cải tiến nâng cao tỷ lệ chuyển đổi mạnh mẽ nhất?", "Làm thế nào để hiển thị chi phí vận chuyển sớm ngay từ trang giỏ hàng để tránh việc người dùng sốc giá ở bước cuối?"],
    ["Checkout Optimization", "Drop-off Reduction", "Guest Checkout", "Form Analytics", "A/B Testing"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Đoán mò là do nút bấm xấu rồi đổi màu nút mà không tìm hiểu nguyên nhân rào cản ở biểu mẫu"]
  ),
  q("UX_DES-SCEN-02", "UX Designer", "scenario", "intermediate", "middle",
    "Tình huống: Người dùng mới phản ánh rằng ứng dụng B2B của công ty quá khó hiểu, họ không biết tính năng cốt lõi nằm ở đâu và thường xuyên bị lạc trong menu điều hướng. Em tiếp cận bài toán tái cấu trúc Kiến trúc thông tin (IA) này ra sao?",
    ["Thực hiện Content Inventory và Content Audit để rà soát toàn bộ các màn hình và tính năng hiện có", "Khảo sát và phỏng vấn người dùng để hiểu rõ Top Tasks (những tác vụ mà 80% người dùng thực hiện hàng ngày)", "Tổ chức Card Sorting với người dùng thật để sắp xếp lại các menu theo danh mục hành động tự nhiên; tái cấu trúc điều hướng ưu tiên các tác vụ phổ biến nhất"],
    ["Làm thế nào để thiết kế một luồng Onboarding tương tác (Interactive Walkthrough) dẫn dắt người dùng thực hiện thành công tác vụ đầu tiên (Aha Moment)?", "Cách áp dụng Tree Testing để kiểm chứng tính hiệu quả của cấu trúc menu mới trước khi bắt tay vào vẽ UI?"],
    ["Information Architecture", "Content Audit", "Top Tasks", "Navigation Redesign", "Aha Moment"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Chỉ sắp xếp lại menu theo cảm tính cá nhân mà không tham khảo hành vi và phản hồi của người dùng"]
  ),
  q("UX_DES-SCEN-03", "UX Designer", "scenario", "intermediate", "middle",
    "Tình huống: Đội ngũ Pháp chế và Kinh doanh yêu cầu người dùng phải cung cấp hơn 15 trường thông tin xác thực doanh nghiệp phức tạp ngay khi đăng ký tài khoản. Người dùng cảm thấy rất ngại và tỷ lệ hoàn tất đăng ký chỉ đạt 20%. Em áp dụng các nguyên tắc UX nào để giải quyết mâu thuẫn này?",
    ["Áp dụng nguyên tắc Phân đoạn thông tin (Chunking) chia biểu mẫu thành quy trình nhiều bước (Multi-step Wizard) từ dễ đến khó", "Giải thích rõ lý do tại sao cần từng thông tin nhạy cảm (Contextual Help / Tooltip minh bạch mục đích pháp lý)", "Cung cấp tính năng Lưu bản nháp tự động (Auto-save Draft) và cho phép người dùng vào khám phá một phần sản phẩm trước khi bắt buộc hoàn tất xác minh nâng cao"],
    ["Thế nào là 'Bậc thang cam kết' (Foot-in-the-door technique) trong thiết kế biểu mẫu onboarding?", "Cách hiển thị thanh tiến trình (Progress Bar) kèm tỷ lệ % hoàn thành để tạo động lực tâm lý cho người dùng?"] ,
    ["Multi-step Form", "Chunking", "Progressive Profiling", "Compliance UX", "Auto-save"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Tranh cãi bế tắc với bộ phận pháp chế đòi bỏ hết các trường mà không tìm ra giải pháp trải nghiệm dung hòa"]
  ),
  q("UX_DES-SCEN-04", "UX Designer", "scenario", "intermediate", "junior",
    "Tình huống: Ứng dụng quản lý sổ khám bệnh điện tử có nhóm người dùng mục tiêu lớn là người cao tuổi (từ 60 tuổi trở lên), thường bị hạn chế về thị lực, thao tác tay run nhẹ và dễ lo âu khi sử dụng công nghệ số. Em điều chỉnh toàn diện trải nghiệm UX như thế nào?",
    ["Tăng kích thước vùng chạm (Touch Target) tối thiểu lên 48x48px đến 56x56px để chống bấm trượt", "Đơn giản hóa ngôn ngữ: dùng từ ngữ đời thường, quen thuộc của y tế gia đình, loại bỏ thuật ngữ công nghệ", "Hỗ trợ xác thực đơn giản (nhận diện khuôn mặt hoặc gửi mã OTP một chạm), tăng độ tương phản và cung cấp tùy chọn cỡ chữ to trong cài đặt"],
    ["Làm thế nào để thiết kế tính năng xác nhận kép an toàn cho người lớn tuổi khi họ đặt lịch khám hoặc hủy lịch?", "Cách hỗ trợ tài khoản người thân (Caregiver Account) cùng quản lý sổ khám bệnh?"] ,
    ["Elderly UX", "Inclusive Design", "Touch Targets", "Accessibility", "Healthcare UX"],
    [DES_SRC.internal, DES_SRC.w3c_wcag],
    ["Thiết kế các nút bấm nhỏ 24px, dùng icon cách điệu khó hiểu và nhiều thao tác vuốt trượt phức tạp"]
  ),
  q("UX_DES-SCEN-05", "UX Designer", "scenario", "advanced", "middle",
    "Tình huống: Ban lãnh đạo muốn giữ chân người dùng trả phí bằng cách giấu nút 'Hủy gói dịch vụ' (Cancel Subscription) sâu trong 5 tầng cài đặt và bắt gọi điện thoại trực tiếp. Là một UX Designer có đạo đức nghề nghiệp, em phân tích rủi ro và thiết kế luồng hủy dịch vụ minh bạch (Ethical Offboarding) ra sao?",
    ["Chỉ ra tác hại nghiêm trọng: người dùng sẽ khiếu nại lừa đảo, đánh giá 1 sao trên store, đòi ngân hàng hoàn tiền (Chargeback) gây thiệt hại lớn về tài chính và danh tiếng", "Thiết kế luồng hủy minh bạch: đặt nút hủy ở vị trí hợp lý trong quản lý tài khoản, khảo sát lý do hủy bằng 1 câu hỏi trắc nghiệm ngắn gọn", "Đưa ra các phương án thay thế có lợi: tạm dừng gói dịch vụ (Pause subscription), hạ cấp gói cước rẻ hơn hoặc ưu đãi giảm giá ngắn hạn"],
    ["Khái niệm 'Offboarding UX' chất lượng giúp khách hàng quay trở lại trong tương lai như thế nào?", "Làm thế nào để cân bằng giữa việc giữ chân khách hàng (Retention) và sự tôn trọng quyền tự do của người dùng?"],
    ["Ethical Offboarding", "Subscription Cancellation", "Dark Pattern Prevention", "Customer Retention"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Ủng hộ việc giấu nút hủy để làm đẹp con số báo cáo duy trì thuê bao ảo trong ngắn hạn"]
  ),
  q("UX_DES-SCEN-06", "UX Designer", "scenario", "intermediate", "middle",
    "Tình huống: Trong lúc người dùng đang thực hiện một giao dịch chuyển tiền trực tuyến thì mạng 4G bị chập chờn, hệ thống không nhận được phản hồi xác nhận từ máy chủ. Em thiết kế trải nghiệm phục hồi lỗi (Error Recovery) và bảo toàn trạng thái ra sao để người dùng không bị hoang mang lo sợ mất tiền?",
    ["Tránh tuyệt đối thông báo lỗi chung chung 'Giao dịch thất bại' gây hoang mang; hiển thị màn hình trạng thái 'Giao dịch đang được xử lý an toàn'", "Tự động kiểm tra trạng thái giao dịch ngầm và cung cấp nút 'Kiểm tra trạng thái' rõ ràng", "Bảo toàn nguyên vẹn thông tin người nhận và số tiền, không bắt người dùng phải nhập lại từ đầu nếu giao dịch thực sự chưa được gửi đi"],
    ["Làm thế nào để ngăn chặn người dùng bấm liên tục nhiều lần vào nút thanh toán khi mạng bị chậm?", "Cách thiết kế thông báo đẩy (Push Notification) hoặc SMS gửi ngay khi hệ thống xử lý xong kết quả giao dịch?"] ,
    ["Error Recovery", "Network Resilience", "State Preservation", "Financial UX", "Transaction Anxiety"],
    [DES_SRC.internal],
    ["Hiển thị màn hình báo lỗi đỏ lòm và trừ tiền tài khoản mà không có lời giải thích hay hướng dẫn xử lý tiếp theo"]
  ),

  // CV Validation (5)
  q("UX_DES-CV-01", "UX Designer", "cv_validation", "advanced", "middle",
    "Trong dự án em ghi trên CV về việc Tái thiết kế trải nghiệm cốt lõi mang lại sự gia tăng rõ rệt về tỷ lệ hoàn thành tác vụ (Task Completion Rate) hoặc điểm hài lòng (CSAT): Hãy trình bày phương pháp đo lường trước và sau cải tiến, cùng các quyết định UX đóng vai trò quyết định?",
    ["Trình bày phương pháp đo lường Baseline (trước cải tiến) bằng Usability Testing và Analytics: đo Time-on-task, Success Rate, SUS score", "Nêu rõ các thay đổi UX cụ thể đã loại bỏ những điểm nghẽn then chốt nào trong hành trình người dùng", "Dẫn chứng kết quả định lượng: tăng Task Completion Rate từ 62% lên 88%, giảm 35% thời gian thực hiện tác vụ và điểm CSAT tăng từ 3.2 lên 4.6 sao"],
    ["Thách thức lớn nhất khi thu thập dữ liệu đo lường ở giai đoạn đầu dự án là gì?", "Làm thế nào để chứng minh sự cải thiện này đến từ thiết kế UX chứ không phải do chiến dịch marketing hay giảm giá?"] ,
    ["CV Validation", "Task Completion Rate", "CSAT", "Quantitative Metrics", "UX Impact"],
    [DES_SRC.internal],
    ["Chỉ nói chung chung là trải nghiệm tốt hơn nhưng không đưa ra được phương pháp đo lường hay số liệu đối chứng"]
  ),
  q("UX_DES-CV-02", "UX Designer", "cv_validation", "intermediate", "middle",
    "CV của em có nhắc đến việc làm việc trong mô hình 'Product Trio' (gồm Product Manager, Tech Lead và UX Designer). Hãy chia sẻ một ví dụ thực tế trong dự án mà sự tham gia sớm của em từ giai đoạn Khám phá (Discovery) đã giúp đội ngũ tránh được một quyết định sai lầm?",
    ["Kể lại bối cảnh cụ thể: PM và Tech Lead dự định phát triển một tính năng phức tạp dựa trên giả định chủ quan", "Em chủ động thực hiện nghiên cứu khám phá nhanh hoặc thử nghiệm mẫu thử (Prototype testing) và phát hiện người dùng thực tế không hề có nhu cầu đó", "Đề xuất hướng tiếp cận tinh gọn hơn giải quyết đúng 'việc cần làm' (Jobs-to-be-Done), giúp team tiết kiệm hàng trăm giờ code lãng phí"],
    ["Khi Tech Lead nói phương án UX của em không khả thi về mặt kỹ thuật, em phối hợp tìm kiếm giải pháp dung hòa ra sao?", "Em đóng góp gì vào việc viết User Stories và Acceptance Criteria trong Sprint Planning?"] ,
    ["Product Trio", "Product Discovery", "Jobs-to-be-Done", "Cross-functional Collaboration"],
    [DES_SRC.internal],
    ["Chỉ nhận yêu cầu tính năng từ PM rồi về vẽ màn hình một cách thụ động mà không tham gia vào Discovery"]
  ),
  q("UX_DES-CV-03", "UX Designer", "cv_validation", "intermediate", "junior",
    "Trong một dự án thiết kế luồng Onboarding cho người dùng mới mà em từng đảm nhiệm: Em đã áp dụng chiến lược nào để rút ngắn 'Thời gian đạt giá trị' (Time-to-Value) giúp người dùng trải nghiệm được giá trị cốt lõi của sản phẩm nhanh nhất?",
    ["Loại bỏ các màn hình giới thiệu tính năng tĩnh vô bổ (Intro sliders dài dòng mà người dùng thường lướt qua nhanh)", "Thiết kế trải nghiệm Onboarding thực hành (Action-oriented onboarding): hướng dẫn người dùng hoàn thành một tác vụ nhỏ có ý nghĩa ngay lập tức", "Cá nhân hóa trải nghiệm bằng 1-2 câu hỏi thăm dò sở thích ban đầu để điều chỉnh nội dung hiển thị phù hợp ngay tại trang chủ"],
    ["Làm thế nào để đo lường tỷ lệ kích hoạt người dùng (Activation Rate) sau khi hoàn tất Onboarding?", "Cách xử lý cho phép người dùng bỏ qua (Skip) bước hướng dẫn nếu họ muốn tự khám phá?"] ,
    ["Onboarding UX", "Time-to-Value", "Activation Rate", "Progressive Disclosure"],
    [DES_SRC.internal],
    ["Thiết kế 10 màn hình hướng dẫn dài dòng bắt người dùng phải đọc hết trước khi được dùng app"]
  ),
  q("UX_DES-CV-04", "UX Designer", "cv_validation", "advanced", "middle",
    "CV của em có đề cập đến kinh nghiệm chủ trì các buổi Usability Testing. Hãy mô tả chi tiết một lần mà kết quả thử nghiệm người dùng đảo ngược hoàn toàn giả định ban đầu của em và team thiết kế? Em đã điều chỉnh sản phẩm ra sao sau đó?",
    ["Thành thật chia sẻ trải nghiệm: nhóm tự tin một giải pháp thiết kế là rất thông minh và trực quan", "Khi thử nghiệm trên 5 người dùng thật, cả 5 người đều hiểu sai biểu tượng hoặc không tìm thấy nút hành động chính", "Em đã không bao biện; nhanh chóng ghi nhận insights, tổ chức buổi phân tích cùng PM và dev để vẽ lại giải pháp đơn giản hơn"],
    ["Em làm thế nào để truyền đạt kết quả kiểm thử tiêu cực này cho các bên liên quan mà không làm họ nản lòng?", "Sau khi sửa đổi, kết quả re-test với người dùng mới đạt được như thế nào?"] ,
    ["Usability Testing Failure", "Humility", "Design Iteration", "User Feedback"],
    [DES_SRC.internal],
    ["Khăng khăng cho rằng người dùng thử nghiệm 'dốt' hoặc không hiểu công nghệ nên mới không biết dùng"]
  ),
  q("UX_DES-CV-05", "UX Designer", "cv_validation", "advanced", "senior_lead",
    "Khi thiết kế cho một hệ thống phần mềm nghiệp vụ B2B hoặc SaaS chuyên sâu với các luồng công việc phức tạp nhiều tầng: Làm thế nào em giải quyết bài toán cân bằng giữa Tính dễ sử dụng cho người mới (Learnability) và Tốc độ xử lý tác vụ cho chuyên gia sử dụng hàng ngày (Efficiency)?",
    ["Cung cấp hai tầng trải nghiệm: Luồng mặc định rõ ràng, có gợi ý cho người dùng mới; hệ thống phím tắt (Keyboard Shortcuts) và thao tác hàng loạt (Bulk Actions) cho người dùng chuyên nghiệp", "Hỗ trợ tính năng tùy biến không gian làm việc (Customizable Views, saved filters) để nhân sự chuyên nghiệp thao tác với tốc độ cao", "Thiết kế các mẫu nhập liệu nhanh (Quick Add modal) mà không cần chuyển trang"],
    ["Làm thế nào để đo lường sự thành thạo của người dùng theo thời gian sử dụng sản phẩm?", "Cách thiết kế tài nguyên tài liệu hướng dẫn (In-app Documentation / Tooltips) hỗ trợ người mới mà không gây vướng mắt cho chuyên gia?"] ,
    ["B2B SaaS UX", "Learnability vs Efficiency", "Power Users", "Keyboard Shortcuts", "Customization"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Cố gắng đơn giản hóa quá mức khiến các thao tác chuyên sâu của người dùng chuyên nghiệp bị chậm chạp và phiền toái"]
  ),

  // Behavioral (5)
  q("UX_DES-BEHAV-01", "UX Designer", "behavioral", "intermediate", "middle",
    "Khi có sự xung đột giữa Mục tiêu kinh doanh ngắn hạn của PM (muốn thu thập thêm số điện thoại và email ở ngay màn hình đầu tiên) và Trải nghiệm người dùng (gây ma sát lớn, làm giảm tỷ lệ đăng ký), em xử lý tình huống giao tiếp và ra quyết định như thế nào?",
    ["Tôn trọng mục tiêu kinh doanh của PM: hiểu rõ vì sao marketing cần dữ liệu liên hệ để nuôi dưỡng khách hàng tiềm năng", "Đưa ra bằng chứng phân tích tâm lý: đòi hỏi thông tin quá sớm khi chưa xây dựng được niềm tin sẽ làm tăng tỷ lệ bỏ rơi lên gấp đôi", "Đề xuất phương án thỏa hiệp thông minh (Progressive Profiling): cho phép người dùng trải nghiệm trước, chỉ yêu cầu để lại email khi họ muốn lưu lại kết quả hoặc nhận ưu đãi"],
    ["Nếu PM vẫn muốn thử phương án ép người dùng nhập thông tin, em có đồng ý chạy A/B Testing để dữ liệu quyết định không?", "Cách bảo vệ danh tiếng của sản phẩm lâu dài trước các chiêu trò tăng trưởng nóng (Growth Hacking) phản tác dụng?"] ,
    ["Business vs UX", "Progressive Profiling", "Data-driven Decision", "Friction Management"],
    [DES_SRC.internal],
    ["Chống đối gay gắt theo kiểu 'Tôi là UX, tôi bảo vệ người dùng, các anh chỉ biết kiếm tiền' gây chia rẽ team"]
  ),
  q("UX_DES-BEHAV-02", "UX Designer", "behavioral", "intermediate", "junior",
    "Khi UI Designer trong nhóm tự ý thay đổi cấu trúc luồng hoặc vị trí các nút chức năng trong bản vẽ chi tiết mà không thảo luận trước với em (làm sai lệch ý đồ trải nghiệm và kịch bản giảm ma sát), em trao đổi với đồng nghiệp như thế nào?",
    ["Chủ động hẹn một buổi trò chuyện trực tiếp 1-1 với thái độ cởi mở, lắng nghe góc nhìn thẩm mỹ hoặc kỹ thuật của UI Designer", "Giải thích cơ sở nghiên cứu và lý do tại sao các thành phần được bố trí ở vị trí đó trong Wireframe ban đầu (dựa trên hành trình và thói quen quét mắt của người dùng)", "Cùng nhau tìm kiếm giải pháp chung: vừa đảm bảo giao diện đẹp mắt, thẩm mỹ cao vừa giữ trọn vẹn cấu trúc luồng tối ưu"],
    ["Làm thế nào để xây dựng quy trình phối hợp nhịp nhàng giữa UX Designer và UI Designer trong cùng một dự án?", "Khi hai bên không tìm được tiếng nói chung, ai sẽ là người đưa ra quyết định cuối cùng?"] ,
    ["UX vs UI Collaboration", "Interpersonal Communication", "Empathy", "Role Boundaries"],
    [DES_SRC.internal],
    ["Chỉ trích đồng nghiệp trước mặt toàn team hoặc âm thầm mang sự bực tức trong người"]
  ),
  q("UX_DES-BEHAV-03", "UX Designer", "behavioral", "advanced", "senior_lead",
    "Trong các buổi họp định kỳ của công ty, đội ngũ kỹ sư và kinh doanh thường xem nhẹ các vấn đề về 'Nợ trải nghiệm' (UX Debt) và chỉ ưu tiên các tính năng mới kiếm ra tiền. Em làm thế nào để truyền thông và đưa các hạng mục UX Debt vào kế hoạch phát triển (Sprint Roadmap)?",
    ["Quy đổi UX Debt sang ngôn ngữ kinh doanh: giải thích việc giao diện khó dùng dẫn đến tăng chi phí vận hành cho tổng đài chăm sóc khách hàng và giảm tỷ lệ giữ chân khách hàng (Retention)", "Ghi nhận và đo lường UX Debt một cách minh bạch trong Jira backlog bằng các điểm số ảnh hưởng cụ thể", "Thương lượng với PM dành ra một tỷ lệ cố định (vd: 15-20% dung lượng mỗi Sprint) để giải quyết các khoản nợ kỹ thuật và nợ trải nghiệm"],
    ["Làm thế nào để tạo một 'Bug Bash' hoặc 'UX Fix Week' để toàn công ty cùng chung tay dọn dẹp các lỗi vặt trải nghiệm?", "Cách vinh danh những đóng góp cải thiện trải nghiệm nhỏ nhưng mang lại giá trị lớn cho người dùng?"] ,
    ["UX Debt", "Roadmap Prioritization", "Business Value of UX", "Advocacy"],
    [DES_SRC.internal],
    ["Than vãn rằng công ty không coi trọng UX nhưng không bao giờ chứng minh được tác động tài chính của UX Debt"]
  ),
  q("UX_DES-BEHAV-04", "UX Designer", "behavioral", "intermediate", "middle",
    "Em tham gia bảo vệ một giải pháp thiết kế trải nghiệm mới trước Ban giám đốc và các Trưởng bộ phận, nhưng một Giám đốc cấp cao đưa ra ý kiến phản bác gay gắt dựa trên thói quen cá nhân của chính họ ('Tôi dùng tôi thấy không thích'). Em xử lý tình huống thuyết trình này thế nào?",
    ["Tôn trọng ý kiến của lãnh đạo: cảm ơn đóng góp và ghi nhận góc nhìn của sếp với tư cách một trường hợp sử dụng cá biệt", "Nhẹ nhàng nhắc lại: 'Chúng ta đang thiết kế sản phẩm cho tệp khách hàng mục tiêu là [Persona cụ thể]', và trình bày các dữ liệu thực tế từ các bài kiểm tra người dùng và số liệu phân tích", "Đề xuất thử nghiệm khách quan: 'Để đảm bảo chắc chắn, em đề xuất đưa cả hai phương án vào A/B testing nhỏ để xem khách hàng thực tế phản ứng thế nào'"],
    ["Làm thế nào để không biến buổi phản biện thiết kế thành cuộc tranh luận ai có quyền lực cao hơn trong công ty?", "Kỹ năng kể chuyện (Storytelling) giúp bảo vệ giải pháp UX thuyết phục ra sao?"] ,
    ["HiPPO Effect", "Executive Stakeholder", "Data Defense", "Storytelling in UX"],
    [DES_SRC.internal],
    ["Cãi nhau với sếp hoặc ngay lập tức vứt bỏ toàn bộ kết quả nghiên cứu khoa học để làm theo ý thích cá nhân của sếp"]
  ),
  q("UX_DES-BEHAV-05", "UX Designer", "behavioral", "basic", "junior",
    "Khi em phải tiếp nhận một dự án dở dang từ một UX Designer khác vừa nghỉ việc, với hệ thống tài liệu sơ sài, wireframes lộn xộn và nhiều quyết định thiết kế không có ghi chú lý do. Em bắt đầu tiếp quản và sắp xếp lại công việc ra sao?",
    ["Giữ thái độ chuyên nghiệp, không phán xét hay trách móc người tiền nhiệm", "Chủ động lên lịch phỏng vấn nhanh với PM, Tech Lead và các bên liên quan để nắm bắt bối cảnh kinh doanh, mục tiêu và những gì đã được thống nhất", "Rà soát lại toàn bộ file thiết kế, dọn dẹp và bổ sung tài liệu giải thích (Design Rationale) cho các quyết định then chốt trước khi bắt tay vào làm việc mới"],
    ["Làm thế nào để nhanh chóng nắm bắt được tâm tư và nỗi đau của người dùng trong một lĩnh vực nghiệp vụ mà em chưa từng có kinh nghiệm?", "Cách lập kế hoạch bàn giao (Handoff Documentation) chuẩn mực cho chính bản thân em sau này?"] ,
    ["Project Onboarding", "Design Rationale", "Handover Management", "Adaptability"],
    [DES_SRC.internal],
    ["Xóa bỏ toàn bộ công sức của người trước để vẽ lại từ đầu theo ý mình mà không hiểu lý do vì sao họ làm vậy"]
  )
];

console.log("UX Designer questions defined:", uxDesignerQuestions.length);

module.exports = {
  uxDesignerQuestions
};
