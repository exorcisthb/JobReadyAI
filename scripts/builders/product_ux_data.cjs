const { q, SRC } = require('./fe_data.cjs');

const DES_SRC = {
  nng: "https://www.nngroup.com/articles/",
  material: "https://m3.material.io/",
  apple_hig: "https://developer.apple.com/design/human-interface-guidelines/",
  w3c_wcag: "https://www.w3.org/WAI/standards-guidelines/wcag/",
  ixdf: "https://www.interaction-design.org/literature",
  figma: "https://help.figma.com/hc/en-us",
  internal: "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
};

// 1. UI DESIGNER
const uiDesignerQuestions = [
  // Foundation (6)
  q("UI_DES-FOUND-01", "UI Designer", "foundation", "basic", "junior",
    "Nguyên lý Phân cấp thị giác (Visual Hierarchy) được thiết lập thông qua những yếu tố nào (kích thước, độ tương phản, trọng lượng font, khoảng cách trắng whitespace)? Cách dẫn dắt mắt người dùng theo mô hình F-pattern và Z-pattern?",
    ["Vận dụng thuần thục 5 yếu tố: Kích thước (Scale), Trọng lượng (Weight), Màu sắc/Tương phản, Vị trí (Positioning), Khoảng cách trắng (Whitespace)", "Hiểu mô hình đọc quét F-pattern (phổ biến trên trang nhiều văn bản) và Z-pattern (trang landing page, ít chữ)", "Tạo tiêu điểm (Focal Point) rõ ràng cho hành động chính (Primary CTA) trên mỗi màn hình"],
    ["Khi màn hình chứa quá nhiều thông tin quan trọng cùng cấp độ, làm thế nào để tránh tình trạng 'mọi thứ đều nổi bật nên không có gì nổi bật'?", "Khoảng cách trắng vi mô (Micro-whitespace) và vĩ mô (Macro-whitespace) tác động đến khả năng quét thông tin ra sao?"],
    ["Visual Hierarchy", "F-pattern", "Z-pattern", "Whitespace", "UI Principles"],
    [DES_SRC.nng, DES_SRC.ixdf],
    ["Tăng kích thước và độ đậm của mọi phần tử để cố gắng thu hút sự chú ý"]
  ),
  q("UI_DES-FOUND-02", "UI Designer", "foundation", "intermediate", "junior",
    "Hệ thống Typography trong thiết kế giao diện kỹ thuật số: Quy tắc xây dựng một Type Scale hài hòa (tỷ lệ 1.25 Major Third hoặc 1.333 Perfect Fourth)? Cách thiết lập line-height, letter-spacing và độ dài dòng tối ưu (measure: 45-75 ký tự) cho khả năng đọc?",
    ["Sử dụng tỷ lệ số học chuẩn mực (Modular Scale) để xác định kích thước từ Caption, Body, H3, H2 đến H1", "Quy tắc line-height tỷ lệ nghịch với font-size: font càng to thì line-height càng chặt (1.1 - 1.25), font body thì line-height thoáng (1.4 - 1.6)", "Giới hạn độ dài dòng từ 45-75 ký tự để mắt người đọc không bị mỏi khi chuyển dòng"],
    ["Khi nào nên dùng font Serif và khi nào nên ưu tiên Sans-serif trong UI ứng dụng?", "Cách xử lý font rendering khác biệt giữa các hệ điều hành (macOS CoreText vs Windows DirectWrite)?"],
    ["Typography", "Type Scale", "Line Height", "Readability", "UI Foundation"],
    [DES_SRC.material, DES_SRC.ixdf],
    ["Đặt line-height cố định một kích thước pixel cho tất cả các cấp độ tiêu đề và văn bản"]
  ),
  q("UI_DES-FOUND-03", "UI Designer", "foundation", "basic", "junior",
    "Lý thuyết màu sắc và tiêu chuẩn tương phản WCAG 2.2: Yêu cầu độ tương phản tối thiểu cho Normal Text (4.5:1) và Large Text/UI Components (3:1) là gì? Quy tắc phối màu 60-30-10 và cách xây dựng bảng màu Semantic Color (Success, Warning, Error, Info)?",
    ["Nắm chắc ngưỡng tương phản WCAG cấp độ AA: 4.5:1 cho text dưới 18pt, 3:1 cho text trên 18pt hoặc in đậm trên 14pt và các viền icon tương tác", "Quy tắc 60-30-10: 60% màu nền chủ đạo, 30% màu bổ trợ/cấu trúc, 10% màu nhấn (Accent/CTA)", "Phân biệt rõ ràng giữa Brand Colors (nhận diện thương hiệu) và Semantic Colors (chỉ báo trạng thái hệ thống)"],
    ["Làm thế nào để đảm bảo người dùng bị mù màu (Color blindness: Deuteranopia, Protanopia) vẫn nhận biết được trạng thái lỗi mà không chỉ dựa vào màu đỏ?", "Tại sao không bao giờ nên dùng màu đen thuần (#000000) trên nền trắng thuần (#FFFFFF) trong UI hiện đại?"],
    ["Color Theory", "WCAG Contrast", "Semantic Colors", "Accessibility", "Color Blindness"],
    [DES_SRC.w3c_wcag, DES_SRC.material],
    ["Chỉ dùng màu sắc để truyền đạt trạng thái mà không kèm theo icon hoặc văn bản giải thích"]
  ),
  q("UI_DES-FOUND-04", "UI Designer", "foundation", "intermediate", "middle",
    "Hệ thống lưới (Grid Systems) và nguyên tắc khoảng cách 8pt Grid: Tại sao hệ thống chia hết cho 8 (và biến thể 4pt cho chi tiết nhỏ) lại trở thành tiêu chuẩn vàng trong thiết kế UI? Cách cấu hình 12-column grid cho responsive web với columns, gutters và margins?",
    ["Mọi màn hình kỹ thuật số hiện đại đều chia hết cho 8 hoặc có mật độ điểm ảnh tương thích (1x, 2x, 3x)", "Tạo tính nhất quán tuyệt đối trong khoảng cách (4, 8, 16, 24, 32, 48, 64px), giúp developer code nhanh chóng không cần đoán số lẻ", "Cấu trúc 12 cột cho phép chia linh hoạt thành 2, 3, 4, 6 cột đều nhau; quy định gutter co giãn hoặc cố định khi qua breakpoint"],
    ["Khi nào nên dùng Fluid Grid (lưới co giãn theo tỷ lệ %) và khi nào dùng Fixed Grid (lưới cố định chiều rộng container)?", "Sự khác biệt trong việc thiết kế lưới cho ứng dụng di động (4 cột) so với máy tính bảng (8 cột)?"],
    ["Grid System", "8pt Grid", "Responsive Layout", "Breakpoints", "Layout Tokens"],
    [DES_SRC.material, DES_SRC.ixdf],
    ["Đặt khoảng cách tùy hứng (13px, 17px, 23px) không theo bất kỳ hệ số quy chuẩn nào"]
  ),
  q("UI_DES-FOUND-05", "UI Designer", "foundation", "basic", "junior",
    "Trạng thái tương tác của thành phần (Component Interactive States): Một thành phần có thể tương tác (như Button, Input, Card) cần có những trạng thái tối thiểu nào (Default, Hover, Focused, Pressed/Active, Disabled, Loading, Error)? Yêu cầu hiển thị trực quan cho Focus Ring theo chuẩn accessibility?",
    ["Thiết kế đầy đủ 7 trạng thái cơ bản để người dùng luôn nhận biết được hệ thống đang phản hồi thao tác", "Trạng thái Focused bắt buộc phải có đường viền (Focus Ring) rõ ràng với độ tương phản cao phục vụ người điều hướng bằng bàn phím (Keyboard navigation)", "Trạng thái Disabled cần giảm độ trong suốt hoặc đổi màu nhưng vẫn đảm bảo đọc được nội dung cơ bản"],
    ["Sự khác biệt giữa trạng thái Active (đang nhấn giữ) và Selected (đã được chọn) trong tab hoặc checkbox?", "Tại sao việc loại bỏ hoàn toàn outline: none mà không có focus style thay thế là vi phạm nghiêm trọng luật Accessibility?"],
    ["Interactive States", "Focus Ring", "Accessibility", "Button States", "Micro-interactions"],
    [DES_SRC.w3c_wcag, DES_SRC.material],
    ["Bỏ qua trạng thái Hover hoặc Focus, chỉ thiết kế một trạng thái tĩnh duy nhất"]
  ),
  q("UI_DES-FOUND-06", "UI Designer", "foundation", "advanced", "middle",
    "Kiến trúc Design Tokens trong thiết kế UI: Phân biệt 3 tầng tokens: Global/Primitive Tokens (Blue-500, Spacing-16), Semantic Tokens (Color-Primary, Surface-Card), và Component-specific Tokens (Button-Background-Hover). Lợi ích của mô hình này khi hỗ trợ Multi-theme và Dark Mode?",
    ["Tầng Primitive chứa giá trị gốc thô (raw values: hex color, pixel size)", "Tầng Semantic gán ngữ nghĩa sử dụng (background-surface, text-body, border-muted) và ánh xạ tới primitive", "Tầng Component ghi đè cho từng component cụ thể; khi đổi sang Dark Mode chỉ cần hoán đổi ánh xạ ở tầng Semantic mà không phải sửa từng component"],
    ["Làm thế nào để đồng bộ hóa Design Tokens từ Figma Variables sang kho code frontend (CSS Variables / JSON qua Style Dictionary)?", "Quy ước đặt tên (Naming convention: BEM hoặc System-Category-Concept-Property) nào giúp hạn chế trùng lặp token?"],
    ["Design Tokens", "Figma Variables", "Semantic Layer", "Multi-theming", "Dark Mode"],
    [DES_SRC.figma, DES_SRC.material],
    ["Gán cứng mã màu hex trực tiếp vào từng component mà không qua hệ thống token trung gian"]
  ),

  // Practical Skills (8)
  q("UI_DES-SKILL-01", "UI Designer", "practical_skills", "intermediate", "junior",
    "Khi sử dụng Figma Auto Layout nâng cao, em kết hợp Min/Max width, Hug contents, Fill container và Absolute positioning như thế nào để tạo ra một Responsive Card co giãn mượt mà trên mọi kích thước màn hình?",
    ["Card cha đặt Fill container hoặc chiều rộng cố định kèm Min/Max width để giới hạn kích thước responsive", "Phần văn bản bên trong đặt Fill container và Hug contents theo chiều dọc để tự động xuống dòng", "Sử dụng Absolute positioning cho các badge 'Hot/New' hoặc icon yêu thích ở góc card mà không phá vỡ luồng auto layout"],
    ["Khi nào nên dùng tính năng Wrap trong Auto Layout thay vì phải chia nhiều hàng thủ công?", "Cách xử lý Negative Spacing (khoảng cách âm) cho nhóm avatar xếp chồng lên nhau trong Figma?"],
    ["Figma", "Auto Layout", "Responsive Card", "Constraints", "Absolute Positioning"],
    [DES_SRC.figma],
    ["Vẽ các khung tĩnh và dùng phím kéo giãn thủ công thay vì thiết lập quy tắc Auto Layout chuẩn xác"]
  ),
  q("UI_DES-SKILL-02", "UI Designer", "practical_skills", "intermediate", "middle",
    "Quy trình tạo một Bộ thành phần Button hoàn chỉnh trong Figma với Variants và Component Properties: Em cấu hình Boolean properties, Instance Swap properties và Text properties ra sao để giảm thiểu số lượng biến thể mà vẫn bao quát đủ trạng thái?",
    ["Sử dụng Component Properties: Text property cho nhãn nút, Boolean property cho icon trái/phải, Instance Swap property để đổi icon nhanh", "Variants chỉ dùng để điều khiển các trục chính: Variant (Primary, Secondary, Ghost), Size (Small, Medium, Large), State (Default, Hover, Active, Disabled)", "Giảm số lượng component con từ hàng trăm xuống chỉ còn vài chục biến thể tinh gọn"],
    ["Làm thế nào để tổ chức component theo cấu trúc nested để thuận tiện cho việc tìm kiếm trong Assets panel?", "Cách sử dụng thuộc tính Expose nested instances để designer chỉnh sửa nhanh mà không cần bấm sâu vào các layer con?"],
    ["Figma Components", "Variants", "Component Properties", "Instance Swap", "UI Kit"],
    [DES_SRC.figma],
    ["Nhân bản hàng trăm component rời rạc không dùng variants hay component properties"]
  ),
  q("UI_DES-SKILL-03", "UI Designer", "practical_skills", "advanced", "middle",
    "Em thiết kế giao diện Dark Mode toàn diện cho một ứng dụng đang có Light Mode như thế nào? Cách sử dụng độ cao bề mặt (Elevation levels với Surface Tint) thay cho đổ bóng đen (Drop Shadow), và cách giảm độ bão hòa (Desaturation) của màu thương hiệu để chống lóa mắt?",
    ["Trong nền tối, bóng đen vô tác dụng; thay vào đó, các bề mặt ở độ cao lớn hơn (higher elevation) sẽ có màu xám sáng hơn một chút (Surface Tint)", "Giảm độ bão hòa (Saturation) của các màu nhấn để không gây chói và nhức mắt trên nền tối", "Đảm bảo độ tương phản chữ không quá gắt: dùng màu xám nhạt (#E0E0E0 hoặc #EDEDED) thay vì trắng thuần (#FFFFFF)"],
    ["Làm sao để cấu hình Figma Variables Mode (Light Mode / Dark Mode) để chuyển đổi toàn bộ màn hình chỉ trong một cú click chuột?", "Cách xử lý hình ảnh minh họa (illustrations) và logo khi chuyển sang nền tối mà không làm biến dạng nhận diện thương hiệu?"],
    ["Dark Mode", "Elevation", "Surface Tint", "Figma Modes", "Visual Ergonomics"],
    [DES_SRC.material, DES_SRC.apple_hig],
    ["Đảo ngược màu sắc một cách cơ học (Invert Color) khiến giao diện u tối, rực rỡ và lóa mắt"]
  ),
  q("UI_DES-SKILL-04", "UI Designer", "practical_skills", "advanced", "middle",
    "Kỹ thuật thiết kế Bảng dữ liệu phức tạp (Complex Data Table) dành cho phần mềm doanh nghiệp (B2B SaaS): Em xử lý tính năng cố định cột (Sticky/Freeze Column), căn chỉnh số liệu (Numeric Alignment), phân cấp tiêu đề và trạng thái Empty/Loading của bảng như thế nào?",
    ["Dữ liệu dạng số bắt buộc căn phải (Right-aligned) và sử dụng phông chữ có độ rộng số đồng đều (Tabular Numbers / Monospace figures) để dễ so sánh hàng dọc", "Văn bản căn trái (Left-aligned), icon trạng thái căn giữa (Center-aligned)", "Cố định cột Checkbox và Cột tên thực thể bên trái, cố định cột Action bên phải khi bảng cuộn ngang trên màn hình hẹp"],
    ["Cách thiết kế chế độ xem dạng thẻ (Card View) thay thế cho bảng khi hiển thị trên màn hình di động nhỏ?", "Làm thế nào để hiển thị thanh lọc dữ liệu (Filter Bar) và sắp xếp đa cột (Multi-column Sorting) mà không làm chật chội không gian bảng?"],
    ["Data Table", "B2B SaaS", "Tabular Numbers", "Sticky Column", "Information Density"],
    [DES_SRC.nng, DES_SRC.material],
    ["Căn giữa toàn bộ số liệu khiến người dùng không thể so sánh hàng đơn vị, hàng chục, hàng trăm"]
  ),
  q("UI_DES-SKILL-05", "UI Designer", "practical_skills", "intermediate", "junior",
    "Thiết kế biểu mẫu nhập liệu (Form Design): Em bố trí cấu trúc nhãn (Top-aligned Labels vs Floating Labels), khoảng cách giữa các trường, cơ chế hiển thị lỗi tức thời (Inline Error Validation) và văn bản hướng dẫn (Helper Text) ra sao để tối ưu tỷ lệ hoàn thành form?",
    ["Top-aligned labels là lựa chọn tối ưu nhất cho tốc độ quét mắt và giảm nhận thức tải trọng tâm trí", "Đặt Inline Error ngay bên dưới trường nhập liệu có icon cảnh báo và thông điệp hướng dẫn cách sửa lỗi cụ thể", "Phân nhóm các trường liên quan (Logical Grouping) và tạo khoảng cách rõ ràng giữa các nhóm để tránh cảm giác choáng ngợp"],
    ["Tại sao Floating Label (nhãn trôi vào trong ô) lại có nhược điểm về khả năng tiếp cận và nhận thức đối với người dùng lớn tuổi?", "Cách thiết kế hiển thị mật khẩu (Show/Hide Password toggle) và thanh đo độ mạnh mật khẩu (Password Strength Meter)?"],
    ["Form Design", "Inline Validation", "Helper Text", "Top-aligned Labels", "Usability"],
    [DES_SRC.nng, DES_SRC.material],
    ["Chỉ dùng placeholder làm nhãn khiến khi người dùng gõ chữ thì biến mất hoàn toàn tên trường dữ liệu"]
  ),
  q("UI_DES-SKILL-06", "UI Designer", "practical_skills", "intermediate", "middle",
    "Xây dựng Interactive Prototype mô phỏng hành vi sản phẩm thực tế trong Figma: Em sử dụng Smart Animate, Component Variants kết hợp chuyển động Easing (Ease-in, Ease-out, Spring) như thế nào để tạo tương tác chuyển trang và kéo thả (Drag interaction) sống động?",
    ["Đặt tên layer trùng khớp tuyệt đối giữa hai khung màn hình để Smart Animate nhận diện và nội suy chuyển động mượt mà", "Sử dụng Ease-out (giảm tốc khi vào đích) cho các phần tử xuất hiện và Ease-in cho các phần tử biến mất", "Thời lượng animation vi mô tiêu chuẩn từ 200ms đến 350ms, tránh animation quá dài gây ức chế khi người dùng thao tác liên tục"],
    ["Khi nào nên dùng hiệu ứng Spring Physics thay vì Easing đường cong Cubic-bezier truyền thống?", "Cách kết nối biến số (Figma Variables & Conditions) trong prototype để mô phỏng giỏ hàng cộng trừ số lượng thực tế?"],
    ["Figma Prototype", "Smart Animate", "Easing Curves", "Spring Physics", "Micro-interactions"],
    [DES_SRC.figma, DES_SRC.material],
    ["Lạm dụng animation dài hơn 600ms cho mọi thao tác nhỏ làm người dùng phải chờ đợi"]
  ),
  q("UI_DES-SKILL-07", "UI Designer", "practical_skills", "intermediate", "middle",
    "Quy trình Bàn giao thiết kế cho Lập trình viên (Design Handoff): Em chuẩn bị Design Specs, Redlines, ghi chú hành vi responsive, quy ước đặt tên layer và xuất file vector SVG tối ưu như thế nào để Frontend Developers hiện thực hóa giao diện chuẩn từng pixel?",
    ["Dọn dẹp cây layer sạch sẽ, xóa bỏ layer ẩn không dùng và đặt tên theo chuẩn component (vd: Header/UserAvatar)", "Cung cấp ghi chú chi tiết về trạng thái biên (Edge cases: tên người dùng quá dài, ảnh bị lỗi không tải được)", "Xuất SVG đã được outline stroke, tối ưu code rác và gắn nhãn token rõ ràng cho màu sắc và khoảng cách"],
    ["Em sử dụng công cụ nào (Figma Dev Mode, Zeplin, Storybook) để thu hẹp khoảng cách giao tiếp giữa Design và Code?", "Cách giải thích cho developer về sự khác biệt giữa line-height trong thiết kế và khoảng đệm thực tế trong CSS Box Model?"],
    ["Design Handoff", "Dev Mode", "SVG Optimization", "Pixel-perfect", "Design Specs"],
    [DES_SRC.figma, DES_SRC.internal],
    ["Gửi link Figma lộn xộn với hàng trăm layer tên 'Frame 1234', 'Vector 56' mà không có bất kỳ ghi chú kỹ thuật nào"]
  ),
  q("UI_DES-SKILL-08", "UI Designer", "practical_skills", "basic", "junior",
    "Thiết kế Màn hình rỗng (Empty States) và Màn hình lỗi (Error States / 404): Em kết hợp hình ảnh minh họa (Illustration), tiêu đề, văn bản giải thích và nút hành động kêu gọi (CTA) như thế nào để biến một trải nghiệm gián đoạn thành cơ hội dẫn dắt người dùng?",
    ["Cấu trúc 4 thành phần vàng: Hình ảnh trực quan thân thiện -> Tiêu đề thông báo rõ tình trạng -> Văn bản ngắn giải thích nguyên nhân -> Nút CTA hành động tiếp theo", "Tránh đổ lỗi cho người dùng; dùng văn phong tích cực, mang tính hỗ trợ (vd: 'Chưa có đơn hàng nào. Hãy khám phá sản phẩm ngay')", "Phù hợp phong cách minh họa đồng nhất với cá tính thương hiệu của sản phẩm"],
    ["Sự khác biệt giữa Empty State lần đầu tiên mở app (First-time user) và Empty State khi kết quả tìm kiếm bằng không (No search results)?", "Làm thế nào để gợi ý các từ khóa liên quan khi người dùng tìm kiếm không ra kết quả?"],
    ["Empty State", "Error State", "UX Copywriting", "Illustrations", "Conversion CTA"],
    [DES_SRC.material, DES_SRC.nng],
    ["Để một màn hình trắng trơn kèm dòng chữ cộc lốc 'Không có dữ liệu' không có nút điều hướng tiếp"]
  ),

  // Scenario (6)
  q("UI_DES-SCEN-01", "UI Designer", "scenario", "intermediate", "middle",
    "Tình huống: Thiết kế màn hình Dashboard phân tích tài chính chứa 8 loại chỉ số KPI quan trọng, 2 biểu đồ đường và 1 bảng danh mục giao dịch, nhưng người dùng mục tiêu sử dụng ứng dụng chủ yếu trên điện thoại di động màn hình nhỏ (375px). Em cấu trúc bố cục thị giác ra sao để không bị quá tải thông tin?",
    ["Áp dụng Progressive Disclosure: hiển thị 3 chỉ số then chốt nhất ở màn hình chính, cho phép cuộn ngang (Carousel) hoặc bấm 'Xem thêm' để mở rộng", "Tối ưu hóa biểu đồ di động: chuyển biểu đồ phức tạp thành biểu đồ thu gọn (Sparkline) kèm số liệu chênh lệch phần trăm (+5.2%)", "Chuyển bảng dữ liệu thành các thẻ tóm tắt (Card list) với thông tin phân cấp rõ ràng thay vì bảng cuộn ngang nhiều cột"],
    ["Làm thế nào để người dùng có thể tự do tùy biến sắp xếp lại vị trí các khối widget tài chính theo nhu cầu cá nhân?", "Khi số tiền hiển thị quá lớn (hàng tỷ đồng), em xử lý viết tắt đơn vị tiền tệ thế nào để không tràn layout?"],
    ["Dashboard UI", "Mobile Layout", "Progressive Disclosure", "Sparklines", "Information Density"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Nhồi nhét nguyên xi giao diện desktop vào mobile và bắt người dùng phải zoom in zoom out để đọc"]
  ),
  q("UI_DES-SCEN-02", "UI Designer", "scenario", "intermediate", "middle",
    "Tình huống: Sau khi phiên bản web mới được release lên môi trường thử nghiệm, em phát hiện giao diện thực tế do Frontend lập trình bị lệch đáng kể so với bản vẽ Figma (khoảng cách padding không đều, màu sắc sai sắc thái, responsive ở màn hình 1440px bị vỡ layout). Em tiến hành Design QA và phối hợp với đội Dev thế nào?",
    ["Tiến hành Design QA bài bản: chụp màn hình đối chiếu (Overlay so sánh) và ghi chú cụ thể từng sai lệch bằng mã token chính xác", "Tạo file theo dõi Design Audit với độ ưu tiên rõ ràng: Blocker (vỡ layout, mất chữ), Major (sai khoảng cách >8px, sai font), Minor (sai viền 1px)", "Ngồi trực tiếp cùng developer (Pairing review) để giải thích cấu trúc Auto Layout và kiểm tra CSS box-sizing"],
    ["Làm thế nào để thiết lập quy trình Design Review bắt buộc trước khi đóng một ticket phát triển giao diện?", "Nguyên nhân phổ biến nhất khiến developer hiểu sai ý đồ khoảng cách của designer trong Figma là gì?"] ,
    ["Design QA", "Dev Collaboration", "Overlay Comparison", "Pixel-perfect", "Audit Process"],
    [DES_SRC.internal],
    ["Chỉ trích dev trên kênh chat chung một cách cảm tính mà không đưa ra tài liệu so sánh và hướng khắc phục cụ thể"]
  ),
  q("UI_DES-SCEN-03", "UI Designer", "scenario", "advanced", "middle",
    "Tình huống: Màu sắc nhận diện cốt lõi của công ty (Brand Color) là màu vàng chanh sáng (#F4ED47). Khi áp dụng làm màu nền nút bấm với chữ trắng thì độ tương phản chỉ đạt 1.2:1, vi phạm nghiêm trọng tiêu chuẩn tiếp cận WCAG. Ban lãnh đạo yêu cầu phải giữ màu thương hiệu. Em đề xuất giải pháp xử lý thị giác thế nào?",
    ["Giải thích rõ ràng cho ban lãnh đạo bằng số liệu: độ tương phản 1.2:1 khiến 90% người dùng khó đọc và vi phạm pháp lý về Accessibility", "Đề xuất giải pháp chữ đen (#121212) trên nền vàng chanh: đạt độ tương phản vượt trội > 12:1, vừa giữ trọn vẹn màu thương hiệu vừa dễ đọc", "Hoặc tạo phiên bản màu 'Accessible Amber' đậm hơn dành riêng cho các thành phần UI chức năng, giữ màu vàng chanh cho logo và các mảng đồ họa trang trí"],
    ["Làm thế nào để xây dựng ma trận kiểm tra tương phản (Contrast Matrix) cho toàn bộ các cặp màu trong Design System?", "Tại sao việc tuân thủ Accessibility không chỉ giúp người khiếm thị mà còn tăng trải nghiệm cho người dùng dưới trời nắng gắt?"],
    ["Color Contrast", "Brand vs Accessibility", "WCAG Fix", "Stakeholder Negotiation"],
    [DES_SRC.internal, DES_SRC.w3c_wcag],
    ["Im lặng chấp nhận dùng chữ trắng trên nền vàng chanh bất chấp người dùng không thể đọc được"]
  ),
  q("UI_DES-SCEN-04", "UI Designer", "scenario", "intermediate", "middle",
    "Tình huống: Thanh điều hướng dưới đáy (Bottom Navigation Bar) của ứng dụng di động hiện đã có 5 mục chính. Product Manager yêu cầu thêm 2 tính năng mới nữa vào thanh này. Nếu đưa cả 7 mục vào thì icon và chữ sẽ bị đè bẹp, gây bấm nhầm. Em tái cấu trúc điều hướng như thế nào?",
    ["Khẳng định nguyên tắc thiết kế di động: Bottom Navigation chỉ nên chứa tối đa 3 đến 5 mục trọng yếu nhất theo chuẩn Apple HIG và Material Design", "Phân tích tần suất sử dụng của 2 tính năng mới: nếu là tính năng phụ, gom vào mục 'Thêm' (More) hoặc đưa vào Side Drawer / Profile menu", "Nếu một trong hai là hành động khởi tạo quan trọng, thiết kế một nút Floating Action Button (FAB) nổi bật ở giữa thanh điều hướng"],
    ["Làm thế nào để dùng dữ liệu phân tích sự kiện (Event Analytics) để chứng minh tính năng nào nên được giữ ở Bottom Bar?", "Cách thiết kế hiển thị thanh điều hướng tự động ẩn khi người dùng cuộn nội dung xuống và hiện lại khi cuộn lên?"],
    ["Bottom Navigation", "Mobile Architecture", "HIG / Material", "Navigation Overflow"],
    [DES_SRC.internal, DES_SRC.apple_hig],
    ["Cố nhồi cả 7 tab vào thanh đáy khiến icon bị teo nhỏ và chữ bị cắt cụt"]
  ),
  q("UI_DES-SCEN-05", "UI Designer", "scenario", "basic", "junior",
    "Tình huống: Một số người dùng phản ánh rằng giao diện website đọc rất mỏi mắt trên các màn hình máy tính để bàn cũ có độ phân giải thấp (1366x768 non-Retina), văn bản bị mờ và răng cưa. Em điều tra và điều chỉnh các thông số Typography và Iconography như thế nào để khắc phục?",
    ["Tăng kích thước font body tối thiểu từ 14px lên 16px để các nét chữ có đủ số lượng pixel vật lý hiển thị rõ ràng", "Chọn các font chữ có x-height lớn và độ dày nét đều (như Inter, Roboto) giúp hiển thị sắc nét trên màn hình low-DPI", "Đảm bảo toàn bộ icon được vẽ căn khớp với pixel grid (Pixel snapping) để tránh hiện tượng viền icon bị mờ do nằm ở nửa pixel (sub-pixel rendering)"],
    ["Pixel-fitting trong Figma hoạt động như thế nào khi vẽ vector icon?", "Thuộc tính CSS font-smoothing (-webkit-font-smoothing) có tác động ra sao trên trình duyệt?"],
    ["Low-DPI Display", "Pixel Snapping", "Typography Legibility", "Sub-pixel Rendering"],
    [DES_SRC.internal, DES_SRC.nng],
    ["Cho rằng lỗi do màn hình của người dùng kém chất lượng nên không cần tối ưu thiết kế"]
  ),
  q("UI_DES-SCEN-06", "UI Designer", "scenario", "advanced", "senior_lead",
    "Tình huống: Công ty triển khai mô hình kinh doanh nhượng quyền đa thương hiệu (Multi-brand White Label). Cùng một hệ thống ứng dụng nhưng phải hỗ trợ giao diện thay đổi linh hoạt theo nhận diện của từng đối tác khách hàng (thay đổi màu sắc, độ bo góc viền corner radius, font chữ và kiểu đổ bóng). Em kiến trúc hệ thống Design Variables trong Figma thế nào?",
    ["Tạo các Collections Variables độc lập: Brand Token Collection chứa các Mode tương ứng với từng Brand A, Brand B, Brand C", "Semantic Token ánh xạ động sang Brand Token (vd: Button-Radius ánh xạ sang Token-Radius của từng brand: 4px góc nhọn hoặc 24px bo tròn)", "Designer chỉ cần chuyển đổi Mode trên cấp Frame cha là toàn bộ giao diện tự động đồng bộ theo nhận diện của thương hiệu đối tác mà không cần vẽ lại"],
    ["Làm thế nào để xử lý các đối tác có phong cách thị giác đối lập hoàn toàn (phẳng Flat vs nhiều chiều sâu Skeuomorphic/Glassmorphism)?", "Quy trình kiểm thử hồi quy thị giác (Visual Regression Test) đối với tất cả các themes trước khi xuất bản?"],
    ["White Label Design", "Multi-brand", "Figma Variables Modes", "Design Architecture"],
    [DES_SRC.internal, DES_SRC.figma],
    ["Tạo ra 5 file thiết kế riêng biệt cho 5 nhãn hàng và phải copy-paste thủ công mỗi khi có màn hình mới"]
  ),

  // CV Validation (5)
  q("UI_DES-CV-01", "UI Designer", "cv_validation", "intermediate", "middle",
    "Trong dự án xây dựng UI Kit hoặc Component Library trên Figma mà em đề cập trong CV: Em đã quy hoạch bao nhiêu components, cách áp dụng Auto Layout kết hợp Variables như thế nào, và hệ thống này đã giúp rút ngắn bao nhiêu phần trăm thời gian lên bản vẽ của nhóm?",
    ["Trình bày quy mô cụ thể: số lượng component gốc, số lượng variants và cơ chế quản lý versioning trong Figma Library", "Nêu rõ cấu trúc token màu sắc, typography và khoảng cách được chuẩn hóa", "Dẫn chứng số liệu: rút ngắn 40% thời gian thiết kế màn hình mới, giảm 50% số lượng bug giao diện trong khâu phát triển"],
    ["Khó khăn lớn nhất khi thuyết phục các designers khác trong nhóm tuân thủ đúng thư viện dùng chung là gì?", "Em đã từng phải thực hiện đợt breaking-change tái cấu trúc thư viện lớn chưa và cách di chuyển an toàn?"] ,
    ["CV Validation", "UI Kit Architecture", "Design Efficiency", "Figma Library"],
    [DES_SRC.internal],
    ["Nói chung chung là có tạo component mà không nắm được cấu trúc tổ chức hay hiệu quả định lượng"]
  ),
  q("UI_DES-CV-02", "UI Designer", "cv_validation", "advanced", "middle",
    "CV của em có nhắc đến việc Tái thiết kế (Redesign) một sản phẩm phức tạp. Hãy trình bày những khuyết điểm thị giác lớn nhất của giao diện cũ, các quyết định thẩm mỹ then chốt của em đã thay đổi diện mạo sản phẩm ra sao, và phản hồi đo lường được từ người dùng?",
    ["Chỉ rõ vấn đề giao diện cũ: phân cấp thị giác lộn xộn, mật độ thông tin quá dày, màu sắc xung đột, không nhất quán giữa các trang", "Quyết định tái thiết kế: tối giản hóa bảng màu, áp dụng lưới 8pt đồng bộ, thiết kế lại hệ thống thẻ và biểu đồ trực quan", "Kết quả định lượng: tăng 25% tỷ lệ hoàn thành tác vụ, giảm tỷ lệ thoát trang và điểm hài lòng CSAT về giao diện tăng rõ rệt"],
    ["Trong quá trình redesign, em làm thế nào để người dùng lâu năm không bị sốc khi thói quen sử dụng thay đổi đột ngột?", "Em có thực hiện A/B testing về mặt thị giác cho các phương án thiết kế mới không?"],
    ["Redesign", "Visual Revamp", "Before and After", "Quantitative Impact"],
    [DES_SRC.internal],
    ["Chỉ thay đổi màu sắc cho hợp mắt cá nhân mà không giải quyết được các điểm nghẽn thị giác và khả năng sử dụng"]
  ),
  q("UI_DES-CV-03", "UI Designer", "cv_validation", "intermediate", "middle",
    "Em ghi trên CV kinh nghiệm thiết kế ứng dụng di động cho cả hai nền tảng iOS và Android. Hãy phân tích các điểm khác biệt then chốt về mặt UI giữa Human Interface Guidelines (Apple) và Material Design 3 (Google) mà em đã trực tiếp áp dụng trong dự án?",
    ["iOS: Điều hướng dạng Segmented Control và Navigation Bar với tiêu đề lớn (Large Title); nút quay lại góc trên trái hoặc vuốt cạnh; font SF Pro", "Android: Điều hướng dạng Tabs hoặc Navigation Drawer; nút Back phần cứng/cử chỉ; font Roboto; ngôn ngữ Material You với màu sắc linh hoạt", "Giữ vững nhận diện thương hiệu của sản phẩm trong khi vẫn tôn trọng thói quen tương tác tự nhiên của người dùng từng hệ điều hành"],
    ["Khi nào nên sử dụng giải pháp Cross-platform UI đồng nhất và khi nào bắt buộc phải phân tách chuẩn Native UI cho từng OS?", "Cách thiết kế thanh trạng thái (Status Bar) và thanh điều hướng ảo (Home Indicator bar) chuẩn cho iPhone tai thỏ và Dynamic Island?"],
    ["iOS HIG", "Material Design", "Cross-platform UI", "Platform Conventions"],
    [DES_SRC.apple_hig, DES_SRC.material],
    ["Bê nguyên giao diện Android sang iOS (như nút 3 chấm menu góc trên hoặc icon Material) khiến người dùng Apple cảm thấy xa lạ"]
  ),
  q("UI_DES-CV-04", "UI Designer", "cv_validation", "intermediate", "junior",
    "Trong một dự án thiết kế trang giỏ hàng và thanh toán (Checkout UI) mà em từng đảm nhiệm: Những chi tiết thị giác nào em đã tinh chỉnh (kích thước nút bấm, vị trí thông báo bảo mật, microcopy) giúp giảm thiểu sự do dự của người dùng tại bước chốt đơn?",
    ["Tối ưu nút CTA thanh toán: kích thước nổi bật (chiều cao 48-56px), màu tương phản cao nhất màn hình, luôn ghim cố định ở đáy (Sticky Bottom) trên mobile", "Hiển thị các huy hiệu bảo mật uy tín (SSL, Visa/Mastercard, chính sách đổi trả) ngay cạnh nút bấm để tăng độ tin cậy", "Làm rõ ràng chi tiết tổng tiền, miễn phí vận chuyển, không phát sinh chi phí ẩn gây bất ngờ tiêu cực"],
    ["Cách xử lý thị giác khi thẻ tín dụng của người dùng bị từ chối thanh toán để họ không từ bỏ giỏ hàng?", "Làm thế nào để thiết kế bước nhập mã giảm giá (Promo Code) mà không kích thích người dùng thoát app đi tìm mã voucher trên mạng?"],
    ["Checkout UI", "Trust Badges", "Conversion Optimization", "Microcopy"],
    [DES_SRC.internal],
    ["Thiết kế nút thanh toán chìm nghỉm hoặc giấu các thông tin phí ship ở góc khuất"]
  ),
  q("UI_DES-CV-05", "UI Designer", "cv_validation", "advanced", "senior_lead",
    "Em đề cập trên CV kinh nghiệm phối hợp chặt chẽ với đội ngũ kỹ sư Frontend. Em đã thiết lập quy trình làm việc chung (Design-to-Code Workflow) như thế nào để đảm bảo sản phẩm thực tế khi phát hành đạt chuẩn chất lượng cao nhất?",
    ["Thống nhất bộ từ điển thuật ngữ chung giữa Design và Code (Tokens naming convention)", "Tổ chức các buổi bàn giao tính năng (Handoff Kickoff) trước Sprint và Design QA Review trước khi merge code vào production", "Tham gia xây dựng Storybook của công ty để đảm bảo các component code phản ánh trung thực bản vẽ Figma"],
    ["Khi phát sinh bất đồng về việc một hiệu ứng animation có khả thi về mặt hiệu năng trên code hay không, em xử lý thế nào?", "Em đánh giá mức độ trưởng thành của quy trình Design-to-Code tại công ty cũ đạt mức nào?"],
    ["Design-to-Code", "Storybook", "Collaboration", "Design Tokens"],
    [DES_SRC.internal],
    ["Chỉ bàn giao link Figma rồi coi như hết trách nhiệm, không quan tâm code thực tế chạy ra sao"]
  ),

  // Behavioral (5)
  q("UI_DES-BEHAV-01", "UI Designer", "behavioral", "intermediate", "junior",
    "Khi Product Manager yêu cầu nhồi nhét thêm 3 banner khuyến mãi sặc sỡ và nhiều nút kêu gọi hành động lên trang chủ khiến giao diện bị rối loạn phân cấp thị giác, em thuyết phục và đưa ra giải pháp thay thế ra sao?",
    ["Lắng nghe mục tiêu kinh doanh phía sau yêu cầu: PM muốn tăng doanh số chiến dịch và tỷ lệ bấm xem khuyến mãi", "Chứng minh bằng nguyên lý thị giác: quá nhiều banner cạnh tranh sẽ gây ra hiện tượng 'Banner Blindness' (mù banner), người dùng sẽ tự động bỏ qua toàn bộ", "Đề xuất phương án thay thế: gom nhóm banner thành một khu vực trượt mượt mà (Carousel) hoặc thiết kế một banner chính có tính cá nhân hóa cao cho từng đối tượng người dùng"],
    ["Nếu PM vẫn khăng khăng giữ ý kiến vì áp lực từ Giám đốc kinh doanh, em sẽ làm gì tiếp theo?", "Làm thế nào để đề xuất chạy thử nghiệm A/B Testing để dữ liệu thực tế chứng minh phương án nào hiệu quả hơn?"],
    ["Banner Blindness", "Stakeholder Persuasion", "Visual Balance", "A/B Testing"],
    [DES_SRC.internal],
    ["Thụ động nghe theo răm rắp làm hỏng giao diện, hoặc phản ứng gay gắt với thái độ nghệ sĩ bảo thủ"]
  ),
  q("UI_DES-BEHAV-02", "UI Designer", "behavioral", "intermediate", "middle",
    "Lập trình viên phản hồi rằng một hiệu ứng chuyển động tương tác vi mô (Micro-interaction) mà em thiết kế 'quá phức tạp, tốn thời gian và không cần thiết cho dự án'. Em xử lý sự bất đồng kỹ thuật này như thế nào?",
    ["Không vội tranh cãi; tìm hiểu lý do kỹ thuật cụ thể: khó code ở thư viện nào, ảnh hưởng FPS hay do thời gian sprint quá gấp", "Giải thích giá trị trải nghiệm của animation đó: giúp người dùng hiểu trạng thái dữ liệu đã được lưu thành công, giảm cảm giác chờ đợi", "Đề xuất phương án đơn giản hóa (Phase 1 dùng transition cơ bản bằng CSS, Phase 2 nâng cấp animation phức tạp hơn) hoặc chủ động xuất file Lottie / Rive tối ưu code sẵn cho dev"],
    ["Em đã từng tự học các kiến thức cơ bản về HTML/CSS để giao tiếp dễ dàng hơn với developer chưa?", "Làm thế nào để xây dựng mối quan hệ tôn trọng lẫn nhau giữa Designer và Developer?"],
    ["Developer Negotiation", "Micro-interaction", "Lottie Animation", "Technical Empathy"],
    [DES_SRC.internal],
    ["Bắt ép dev phải làm đúng 100% mà không quan tâm đến hạn mức thời gian hay độ phức tạp kỹ thuật"]
  ),
  q("UI_DES-BEHAV-03", "UI Designer", "behavioral", "basic", "junior",
    "Khi nhận được phản hồi cảm tính từ một bên liên quan (Stakeholder) như: 'Tôi thấy màu này nhìn quê quá' hoặc 'Giao diện này nhìn chưa sang chảnh'. Em làm thế nào để bóc tách nhận xét đó thành các tiêu chí thiết kế cụ thể?",
    ["Giữ bình tĩnh và sự chuyên nghiệp, không để cảm xúc tự ái chi phối khi tác phẩm bị nhận xét cảm tính", "Đặt câu hỏi gợi mở để làm rõ bản chất: 'Khi anh/chị nói 'sang chảnh', anh/chị đang kỳ vọng cảm giác tối giản, tinh tế hay cao cấp giống sản phẩm nào trên thị trường?'", "Dẫn dắt cuộc thảo luận quay về đối tượng người dùng mục tiêu và bảng moodboard định hướng thương hiệu đã thống nhất"],
    ["Làm thế nào để trình bày bản thiết kế (Design Presentation) ngay từ đầu để hạn chế tối đa các phản hồi cảm tính?", "Khi có sự bất đồng về gu thẩm mỹ giữa hai sếp lớn trong công ty, em điều phối ra sao?"],
    ["Vague Feedback", "Stakeholder Communication", "Design Presentation", "Objective Criteria"],
    [DES_SRC.internal],
    ["Cãi nhau tay đôi về gu thẩm mỹ cá nhân hoặc âm thầm sửa theo ý sếp một cách chán nản"]
  ),
  q("UI_DES-BEHAV-04", "UI Designer", "behavioral", "intermediate", "middle",
    "Trong bối cảnh tiến độ Sprint rất gấp nhưng đội ngũ Content/Marketing chưa kịp cung cấp nội dung chữ thực tế (buộc phải dùng văn bản giả Lorem Ipsum). Làm thế nào để em thiết kế giao diện có khả năng thích ứng tốt khi nội dung thật được đưa vào?",
    ["Chủ động tự viết các nội dung mẫu sát với thực tế nhất có thể (Realistic Content Copy) thay vì dùng Lorem Ipsum vô nghĩa", "Thiết kế dự phòng các kịch bản cực hạn (Extreme cases): tiêu đề dài gấp 3 lần bình thường, tên sản phẩm có ký tự đặc biệt, giá tiền nhiều chữ số", "Quy định rõ trong specs: số dòng tối đa trước khi cắt ngắn bằng dấu ba chấm (line-clamp), và chiều cao co giãn của các card nội dung"],
    ["Tại sao việc dùng Lorem Ipsum trong thiết kế thường dẫn đến việc giao diện bị vỡ nát khi lên code thực tế?", "Em phối hợp với UX Writer hoặc Content Strategist như thế nào trong quy trình thiết kế?"],
    ["Lorem Ipsum Risk", "Content-first Design", "Edge Cases", "Sprint Pressure"],
    [DES_SRC.internal],
    ["Vẽ các ô chữ có độ dài hoàn hảo nhân tạo bằng Lorem Ipsum và phó mặc cho số phận khi nội dung thật vào"]
  ),
  q("UI_DES-BEHAV-05", "UI Designer", "behavioral", "intermediate", "senior_lead",
    "Khi em và một UI Designer khác trong nhóm có hai định hướng phong cách thị giác hoàn toàn khác nhau cho cùng một sản phẩm mới, em xử lý tình huống cạnh tranh quan điểm này như thế nào để chọn ra giải pháp tốt nhất cho dự án?",
    ["Tách bạch cái tôi cá nhân ra khỏi giải pháp thiết kế; đặt sản phẩm và người dùng lên hàng đầu", "Xây dựng bảng tiêu chí đánh giá khách quan dựa trên: Mức độ phù hợp với Brand Identity, Tính khả thi khi lập trình, Khả năng mở rộng thành hệ thống (Scalability) và Tính thân thiện với người dùng", "Tổ chức một buổi Design Critique nội bộ hoặc làm bài kiểm tra người dùng nhanh (Quick Usability Testing / Preference Test) với 5-10 người dùng thật"],
    ["Làm thế nào để xây dựng văn hóa góp ý thiết kế (Design Critique Culture) mang tính xây dựng, cởi mở trong đội ngũ?", "Khi phương án của em không được lựa chọn, em tiếp nhận và hỗ trợ đồng nghiệp triển khai phương án thắng cuộc ra sao?"],
    ["Design Critique", "Healthy Disagreement", "Preference Testing", "Team Collaboration"],
    [DES_SRC.internal],
    ["Bảo thủ bảo vệ phương án của mình đến cùng hoặc tạo ra bè phái gây mất đoàn kết trong nhóm thiết kế"]
  )
];

console.log("UI Designer questions defined:", uiDesignerQuestions.length);

module.exports = {
  uiDesignerQuestions
};
