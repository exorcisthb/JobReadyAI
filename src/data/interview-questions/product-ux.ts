import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: Thiết kế Sản phẩm & UX (4 vị trí - 120 câu hỏi)
export const productUXQuestionBanks: RoleQuestionBank[] = [
  {
    "role": "UI Designer",
    "group": "productUX",
    "groupLabel": "Thiết kế Sản phẩm & UX",
    "aliases": [
      "ui designer",
      "visual designer",
      "thiet ke giao dien",
      "chuyen vien thiet ke ui",
      "ui artist"
    ],
    "questions": [
      {
        "id": "UI_DES-FOUND-01",
        "role": "UI Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong UI Designer, phân biệt Visual Hierarchy, F-pattern, Z-pattern, Whitespace; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Visual Hierarchy.",
          "Phân biệt được các khái niệm liên quan F-pattern, Z-pattern, Whitespace ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí UI Designer."
        ],
        "followUps": [
          "Nếu mới học Visual Hierarchy, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Visual Hierarchy",
          "F-pattern",
          "Z-pattern",
          "Whitespace",
          "UI Principles"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "UI_DES-FOUND-02",
        "role": "UI Designer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Hệ thống Typography trong thiết kế giao diện kỹ thuật số: Quy tắc xây dựng một Type Scale hài hòa (tỷ lệ 1.25 Major Third hoặc 1.333 Perfect Fourth)? Cách thiết lập line-height, letter-spacing và độ dài dòng tối ưu (measure: 45-75 ký tự) cho khả năng đọc?",
        "evaluationCriteria": [
          "Sử dụng tỷ lệ số học chuẩn mực (Modular Scale) để xác định kích thước từ Caption, Body, H3, H2 đến H1",
          "Quy tắc line-height tỷ lệ nghịch với font-size: font càng to thì line-height càng chặt (1.1 - 1.25), font body thì line-height thoáng (1.4 - 1.6)",
          "Giới hạn độ dài dòng từ 45-75 ký tự để mắt người đọc không bị mỏi khi chuyển dòng"
        ],
        "followUps": [
          "Khi nào nên dùng font Serif và khi nào nên ưu tiên Sans-serif trong UI ứng dụng?",
          "Cách xử lý font rendering khác biệt giữa các hệ điều hành (macOS CoreText vs Windows DirectWrite)?"
        ],
        "tags": [
          "Typography",
          "Type Scale",
          "Line Height",
          "Readability",
          "UI Foundation"
        ],
        "sourceRefs": [
          "https://m3.material.io/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Đặt line-height cố định một kích thước pixel cho tất cả các cấp độ tiêu đề và văn bản"
        ]
      },
      {
        "id": "UI_DES-FOUND-03",
        "role": "UI Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Lý thuyết màu sắc và tiêu chuẩn tương phản WCAG 2.2: Yêu cầu độ tương phản tối thiểu cho Normal Text (4.5:1) và Large Text/UI Components (3:1) là gì? Quy tắc phối màu 60-30-10 và cách xây dựng bảng màu Semantic Color (Success, Warning, Error, Info)?",
        "evaluationCriteria": [
          "Nắm chắc ngưỡng tương phản WCAG cấp độ AA: 4.5:1 cho text dưới 18pt, 3:1 cho text trên 18pt hoặc in đậm trên 14pt và các viền icon tương tác",
          "Quy tắc 60-30-10: 60% màu nền chủ đạo, 30% màu bổ trợ/cấu trúc, 10% màu nhấn (Accent/CTA)",
          "Phân biệt rõ ràng giữa Brand Colors (nhận diện thương hiệu) và Semantic Colors (chỉ báo trạng thái hệ thống)"
        ],
        "followUps": [
          "Làm thế nào để đảm bảo người dùng bị mù màu (Color blindness: Deuteranopia, Protanopia) vẫn nhận biết được trạng thái lỗi mà không chỉ dựa vào màu đỏ?",
          "Tại sao không bao giờ nên dùng màu đen thuần (#000000) trên nền trắng thuần (#FFFFFF) trong UI hiện đại?"
        ],
        "tags": [
          "Color Theory",
          "WCAG Contrast",
          "Semantic Colors",
          "Accessibility",
          "Color Blindness"
        ],
        "sourceRefs": [
          "https://www.w3.org/WAI/standards-guidelines/wcag/",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Chỉ dùng màu sắc để truyền đạt trạng thái mà không kèm theo icon hoặc văn bản giải thích"
        ]
      },
      {
        "id": "UI_DES-FOUND-04",
        "role": "UI Designer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Hệ thống lưới (Grid Systems) và nguyên tắc khoảng cách 8pt Grid: Tại sao hệ thống chia hết cho 8 (và biến thể 4pt cho chi tiết nhỏ) lại trở thành tiêu chuẩn vàng trong thiết kế UI? Cách cấu hình 12-column grid cho responsive web với columns, gutters và margins?",
        "evaluationCriteria": [
          "Mọi màn hình kỹ thuật số hiện đại đều chia hết cho 8 hoặc có mật độ điểm ảnh tương thích (1x, 2x, 3x)",
          "Tạo tính nhất quán tuyệt đối trong khoảng cách (4, 8, 16, 24, 32, 48, 64px), giúp developer code nhanh chóng không cần đoán số lẻ",
          "Cấu trúc 12 cột cho phép chia linh hoạt thành 2, 3, 4, 6 cột đều nhau; quy định gutter co giãn hoặc cố định khi qua breakpoint"
        ],
        "followUps": [
          "Khi nào nên dùng Fluid Grid (lưới co giãn theo tỷ lệ %) và khi nào dùng Fixed Grid (lưới cố định chiều rộng container)?",
          "Sự khác biệt trong việc thiết kế lưới cho ứng dụng di động (4 cột) so với máy tính bảng (8 cột)?"
        ],
        "tags": [
          "Grid System",
          "8pt Grid",
          "Responsive Layout",
          "Breakpoints",
          "Layout Tokens"
        ],
        "sourceRefs": [
          "https://m3.material.io/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Đặt khoảng cách tùy hứng (13px, 17px, 23px) không theo bất kỳ hệ số quy chuẩn nào"
        ]
      },
      {
        "id": "UI_DES-FOUND-05",
        "role": "UI Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Trạng thái tương tác của thành phần (Component Interactive States): Một thành phần có thể tương tác (như Button, Input, Card) cần có những trạng thái tối thiểu nào (Default, Hover, Focused, Pressed/Active, Disabled, Loading, Error)? Yêu cầu hiển thị trực quan cho Focus Ring theo chuẩn accessibility?",
        "evaluationCriteria": [
          "Thiết kế đầy đủ 7 trạng thái cơ bản để người dùng luôn nhận biết được hệ thống đang phản hồi thao tác",
          "Trạng thái Focused bắt buộc phải có đường viền (Focus Ring) rõ ràng với độ tương phản cao phục vụ người điều hướng bằng bàn phím (Keyboard navigation)",
          "Trạng thái Disabled cần giảm độ trong suốt hoặc đổi màu nhưng vẫn đảm bảo đọc được nội dung cơ bản"
        ],
        "followUps": [
          "Sự khác biệt giữa trạng thái Active (đang nhấn giữ) và Selected (đã được chọn) trong tab hoặc checkbox?",
          "Tại sao việc loại bỏ hoàn toàn outline: none mà không có focus style thay thế là vi phạm nghiêm trọng luật Accessibility?"
        ],
        "tags": [
          "Interactive States",
          "Focus Ring",
          "Accessibility",
          "Button States",
          "Micro-interactions"
        ],
        "sourceRefs": [
          "https://www.w3.org/WAI/standards-guidelines/wcag/",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Bỏ qua trạng thái Hover hoặc Focus, chỉ thiết kế một trạng thái tĩnh duy nhất"
        ]
      },
      {
        "id": "UI_DES-FOUND-06",
        "role": "UI Designer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Kiến trúc Design Tokens trong thiết kế UI: Phân biệt 3 tầng tokens: Global/Primitive Tokens (Blue-500, Spacing-16), Semantic Tokens (Color-Primary, Surface-Card), và Component-specific Tokens (Button-Background-Hover). Lợi ích của mô hình này khi hỗ trợ Multi-theme và Dark Mode?",
        "evaluationCriteria": [
          "Tầng Primitive chứa giá trị gốc thô (raw values: hex color, pixel size)",
          "Tầng Semantic gán ngữ nghĩa sử dụng (background-surface, text-body, border-muted) và ánh xạ tới primitive",
          "Tầng Component ghi đè cho từng component cụ thể; khi đổi sang Dark Mode chỉ cần hoán đổi ánh xạ ở tầng Semantic mà không phải sửa từng component"
        ],
        "followUps": [
          "Làm thế nào để đồng bộ hóa Design Tokens từ Figma Variables sang kho code frontend (CSS Variables / JSON qua Style Dictionary)?",
          "Quy ước đặt tên (Naming convention: BEM hoặc System-Category-Concept-Property) nào giúp hạn chế trùng lặp token?"
        ],
        "tags": [
          "Design Tokens",
          "Figma Variables",
          "Semantic Layer",
          "Multi-theming",
          "Dark Mode"
        ],
        "sourceRefs": [
          "https://help.figma.com/hc/en-us",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Gán cứng mã màu hex trực tiếp vào từng component mà không qua hệ thống token trung gian"
        ]
      },
      {
        "id": "UI_DES-SKILL-01",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Figma (Auto Layout, Responsive Card, Constraints, Absolute Positioning) cho UI Designer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Figma trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Figma",
          "Auto Layout",
          "Responsive Card",
          "Constraints",
          "Absolute Positioning"
        ],
        "sourceRefs": [
          "https://help.figma.com/hc/en-us"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "UI_DES-SKILL-02",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập UI Designer: dựa trên Figma Components, phối hợp Variants, Component Properties, Instance Swap, UI Kit; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Figma Components trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Figma Components",
          "Variants",
          "Component Properties",
          "Instance Swap",
          "UI Kit"
        ],
        "sourceRefs": [
          "https://help.figma.com/hc/en-us"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "UI_DES-SKILL-03",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Em thiết kế giao diện Dark Mode toàn diện cho một ứng dụng đang có Light Mode như thế nào? Cách sử dụng độ cao bề mặt (Elevation levels với Surface Tint) thay cho đổ bóng đen (Drop Shadow), và cách giảm độ bão hòa (Desaturation) của màu thương hiệu để chống lóa mắt?",
        "evaluationCriteria": [
          "Trong nền tối, bóng đen vô tác dụng; thay vào đó, các bề mặt ở độ cao lớn hơn (higher elevation) sẽ có màu xám sáng hơn một chút (Surface Tint)",
          "Giảm độ bão hòa (Saturation) của các màu nhấn để không gây chói và nhức mắt trên nền tối",
          "Đảm bảo độ tương phản chữ không quá gắt: dùng màu xám nhạt (#E0E0E0 hoặc #EDEDED) thay vì trắng thuần (#FFFFFF)"
        ],
        "followUps": [
          "Làm sao để cấu hình Figma Variables Mode (Light Mode / Dark Mode) để chuyển đổi toàn bộ màn hình chỉ trong một cú click chuột?",
          "Cách xử lý hình ảnh minh họa (illustrations) và logo khi chuyển sang nền tối mà không làm biến dạng nhận diện thương hiệu?"
        ],
        "tags": [
          "Dark Mode",
          "Elevation",
          "Surface Tint",
          "Figma Modes",
          "Visual Ergonomics"
        ],
        "sourceRefs": [
          "https://m3.material.io/",
          "https://developer.apple.com/design/human-interface-guidelines/"
        ],
        "redFlags": [
          "Đảo ngược màu sắc một cách cơ học (Invert Color) khiến giao diện u tối, rực rỡ và lóa mắt"
        ]
      },
      {
        "id": "UI_DES-SKILL-04",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Kỹ thuật thiết kế Bảng dữ liệu phức tạp (Complex Data Table) dành cho phần mềm doanh nghiệp (B2B SaaS): Em xử lý tính năng cố định cột (Sticky/Freeze Column), căn chỉnh số liệu (Numeric Alignment), phân cấp tiêu đề và trạng thái Empty/Loading của bảng như thế nào?",
        "evaluationCriteria": [
          "Dữ liệu dạng số bắt buộc căn phải (Right-aligned) và sử dụng phông chữ có độ rộng số đồng đều (Tabular Numbers / Monospace figures) để dễ so sánh hàng dọc",
          "Văn bản căn trái (Left-aligned), icon trạng thái căn giữa (Center-aligned)",
          "Cố định cột Checkbox và Cột tên thực thể bên trái, cố định cột Action bên phải khi bảng cuộn ngang trên màn hình hẹp"
        ],
        "followUps": [
          "Cách thiết kế chế độ xem dạng thẻ (Card View) thay thế cho bảng khi hiển thị trên màn hình di động nhỏ?",
          "Làm thế nào để hiển thị thanh lọc dữ liệu (Filter Bar) và sắp xếp đa cột (Multi-column Sorting) mà không làm chật chội không gian bảng?"
        ],
        "tags": [
          "Data Table",
          "B2B SaaS",
          "Tabular Numbers",
          "Sticky Column",
          "Information Density"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Căn giữa toàn bộ số liệu khiến người dùng không thể so sánh hàng đơn vị, hàng chục, hàng trăm"
        ]
      },
      {
        "id": "UI_DES-SKILL-05",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Thiết kế biểu mẫu nhập liệu (Form Design): Em bố trí cấu trúc nhãn (Top-aligned Labels vs Floating Labels), khoảng cách giữa các trường, cơ chế hiển thị lỗi tức thời (Inline Error Validation) và văn bản hướng dẫn (Helper Text) ra sao để tối ưu tỷ lệ hoàn thành form?",
        "evaluationCriteria": [
          "Top-aligned labels là lựa chọn tối ưu nhất cho tốc độ quét mắt và giảm nhận thức tải trọng tâm trí",
          "Đặt Inline Error ngay bên dưới trường nhập liệu có icon cảnh báo và thông điệp hướng dẫn cách sửa lỗi cụ thể",
          "Phân nhóm các trường liên quan (Logical Grouping) và tạo khoảng cách rõ ràng giữa các nhóm để tránh cảm giác choáng ngợp"
        ],
        "followUps": [
          "Tại sao Floating Label (nhãn trôi vào trong ô) lại có nhược điểm về khả năng tiếp cận và nhận thức đối với người dùng lớn tuổi?",
          "Cách thiết kế hiển thị mật khẩu (Show/Hide Password toggle) và thanh đo độ mạnh mật khẩu (Password Strength Meter)?"
        ],
        "tags": [
          "Form Design",
          "Inline Validation",
          "Helper Text",
          "Top-aligned Labels",
          "Usability"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Chỉ dùng placeholder làm nhãn khiến khi người dùng gõ chữ thì biến mất hoàn toàn tên trường dữ liệu"
        ]
      },
      {
        "id": "UI_DES-SKILL-06",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Xây dựng Interactive Prototype mô phỏng hành vi sản phẩm thực tế trong Figma: Em sử dụng Smart Animate, Component Variants kết hợp chuyển động Easing (Ease-in, Ease-out, Spring) như thế nào để tạo tương tác chuyển trang và kéo thả (Drag interaction) sống động?",
        "evaluationCriteria": [
          "Đặt tên layer trùng khớp tuyệt đối giữa hai khung màn hình để Smart Animate nhận diện và nội suy chuyển động mượt mà",
          "Sử dụng Ease-out (giảm tốc khi vào đích) cho các phần tử xuất hiện và Ease-in cho các phần tử biến mất",
          "Thời lượng animation vi mô tiêu chuẩn từ 200ms đến 350ms, tránh animation quá dài gây ức chế khi người dùng thao tác liên tục"
        ],
        "followUps": [
          "Khi nào nên dùng hiệu ứng Spring Physics thay vì Easing đường cong Cubic-bezier truyền thống?",
          "Cách kết nối biến số (Figma Variables & Conditions) trong prototype để mô phỏng giỏ hàng cộng trừ số lượng thực tế?"
        ],
        "tags": [
          "Figma Prototype",
          "Smart Animate",
          "Easing Curves",
          "Spring Physics",
          "Micro-interactions"
        ],
        "sourceRefs": [
          "https://help.figma.com/hc/en-us",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Lạm dụng animation dài hơn 600ms cho mọi thao tác nhỏ làm người dùng phải chờ đợi"
        ]
      },
      {
        "id": "UI_DES-SKILL-07",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quy trình Bàn giao thiết kế cho Lập trình viên (Design Handoff): Em chuẩn bị Design Specs, Redlines, ghi chú hành vi responsive, quy ước đặt tên layer và xuất file vector SVG tối ưu như thế nào để Frontend Developers hiện thực hóa giao diện chuẩn từng pixel?",
        "evaluationCriteria": [
          "Dọn dẹp cây layer sạch sẽ, xóa bỏ layer ẩn không dùng và đặt tên theo chuẩn component (vd: Header/UserAvatar)",
          "Cung cấp ghi chú chi tiết về trạng thái biên (Edge cases: tên người dùng quá dài, ảnh bị lỗi không tải được)",
          "Xuất SVG đã được outline stroke, tối ưu code rác và gắn nhãn token rõ ràng cho màu sắc và khoảng cách"
        ],
        "followUps": [
          "Em sử dụng công cụ nào (Figma Dev Mode, Zeplin, Storybook) để thu hẹp khoảng cách giao tiếp giữa Design và Code?",
          "Cách giải thích cho developer về sự khác biệt giữa line-height trong thiết kế và khoảng đệm thực tế trong CSS Box Model?"
        ],
        "tags": [
          "Design Handoff",
          "Dev Mode",
          "SVG Optimization",
          "Pixel-perfect",
          "Design Specs"
        ],
        "sourceRefs": [
          "https://help.figma.com/hc/en-us",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Gửi link Figma lộn xộn với hàng trăm layer tên 'Frame 1234', 'Vector 56' mà không có bất kỳ ghi chú kỹ thuật nào"
        ]
      },
      {
        "id": "UI_DES-SKILL-08",
        "role": "UI Designer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Thiết kế Màn hình rỗng (Empty States) và Màn hình lỗi (Error States / 404): Em kết hợp hình ảnh minh họa (Illustration), tiêu đề, văn bản giải thích và nút hành động kêu gọi (CTA) như thế nào để biến một trải nghiệm gián đoạn thành cơ hội dẫn dắt người dùng?",
        "evaluationCriteria": [
          "Cấu trúc 4 thành phần vàng: Hình ảnh trực quan thân thiện -> Tiêu đề thông báo rõ tình trạng -> Văn bản ngắn giải thích nguyên nhân -> Nút CTA hành động tiếp theo",
          "Tránh đổ lỗi cho người dùng; dùng văn phong tích cực, mang tính hỗ trợ (vd: 'Chưa có đơn hàng nào. Hãy khám phá sản phẩm ngay')",
          "Phù hợp phong cách minh họa đồng nhất với cá tính thương hiệu của sản phẩm"
        ],
        "followUps": [
          "Sự khác biệt giữa Empty State lần đầu tiên mở app (First-time user) và Empty State khi kết quả tìm kiếm bằng không (No search results)?",
          "Làm thế nào để gợi ý các từ khóa liên quan khi người dùng tìm kiếm không ra kết quả?"
        ],
        "tags": [
          "Empty State",
          "Error State",
          "UX Copywriting",
          "Illustrations",
          "Conversion CTA"
        ],
        "sourceRefs": [
          "https://m3.material.io/",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Để một màn hình trắng trơn kèm dòng chữ cộc lốc 'Không có dữ liệu' không có nút điều hướng tiếp"
        ]
      },
      {
        "id": "UI_DES-SCEN-01",
        "role": "UI Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại UI Designer, khi Dashboard UI cùng Mobile Layout, Progressive Disclosure, Sparklines, Information Density xuất hiện và người tham gia thử nghiệm không hoàn thành được tác vụ chính, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong UI Designer.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Dashboard UI",
          "Mobile Layout",
          "Progressive Disclosure",
          "Sparklines",
          "Information Density"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "UI_DES-SCEN-02",
        "role": "UI Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Sau khi phiên bản web mới được release lên môi trường thử nghiệm, em phát hiện giao diện thực tế do Frontend lập trình bị lệch đáng kể so với bản vẽ Figma (khoảng cách padding không đều, màu sắc sai sắc thái, responsive ở màn hình 1440px bị vỡ layout). Em tiến hành Design QA và phối hợp với đội Dev thế nào?",
        "evaluationCriteria": [
          "Tiến hành Design QA bài bản: chụp màn hình đối chiếu (Overlay so sánh) và ghi chú cụ thể từng sai lệch bằng mã token chính xác",
          "Tạo file theo dõi Design Audit với độ ưu tiên rõ ràng: Blocker (vỡ layout, mất chữ), Major (sai khoảng cách >8px, sai font), Minor (sai viền 1px)",
          "Ngồi trực tiếp cùng developer (Pairing review) để giải thích cấu trúc Auto Layout và kiểm tra CSS box-sizing"
        ],
        "followUps": [
          "Làm thế nào để thiết lập quy trình Design Review bắt buộc trước khi đóng một ticket phát triển giao diện?",
          "Nguyên nhân phổ biến nhất khiến developer hiểu sai ý đồ khoảng cách của designer trong Figma là gì?"
        ],
        "tags": [
          "Design QA",
          "Dev Collaboration",
          "Overlay Comparison",
          "Pixel-perfect",
          "Audit Process"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ trích dev trên kênh chat chung một cách cảm tính mà không đưa ra tài liệu so sánh và hướng khắc phục cụ thể"
        ]
      },
      {
        "id": "UI_DES-SCEN-03",
        "role": "UI Designer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Màu sắc nhận diện cốt lõi của công ty (Brand Color) là màu vàng chanh sáng (#F4ED47). Khi áp dụng làm màu nền nút bấm với chữ trắng thì độ tương phản chỉ đạt 1.2:1, vi phạm nghiêm trọng tiêu chuẩn tiếp cận WCAG. Ban lãnh đạo yêu cầu phải giữ màu thương hiệu. Em đề xuất giải pháp xử lý thị giác thế nào?",
        "evaluationCriteria": [
          "Giải thích rõ ràng cho ban lãnh đạo bằng số liệu: độ tương phản 1.2:1 khiến 90% người dùng khó đọc và vi phạm pháp lý về Accessibility",
          "Đề xuất giải pháp chữ đen (#121212) trên nền vàng chanh: đạt độ tương phản vượt trội > 12:1, vừa giữ trọn vẹn màu thương hiệu vừa dễ đọc",
          "Hoặc tạo phiên bản màu 'Accessible Amber' đậm hơn dành riêng cho các thành phần UI chức năng, giữ màu vàng chanh cho logo và các mảng đồ họa trang trí"
        ],
        "followUps": [
          "Làm thế nào để xây dựng ma trận kiểm tra tương phản (Contrast Matrix) cho toàn bộ các cặp màu trong Design System?",
          "Tại sao việc tuân thủ Accessibility không chỉ giúp người khiếm thị mà còn tăng trải nghiệm cho người dùng dưới trời nắng gắt?"
        ],
        "tags": [
          "Color Contrast",
          "Brand vs Accessibility",
          "WCAG Fix",
          "Stakeholder Negotiation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.w3.org/WAI/standards-guidelines/wcag/"
        ],
        "redFlags": [
          "Im lặng chấp nhận dùng chữ trắng trên nền vàng chanh bất chấp người dùng không thể đọc được"
        ]
      },
      {
        "id": "UI_DES-SCEN-04",
        "role": "UI Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Thanh điều hướng dưới đáy (Bottom Navigation Bar) của ứng dụng di động hiện đã có 5 mục chính. Product Manager yêu cầu thêm 2 tính năng mới nữa vào thanh này. Nếu đưa cả 7 mục vào thì icon và chữ sẽ bị đè bẹp, gây bấm nhầm. Em tái cấu trúc điều hướng như thế nào?",
        "evaluationCriteria": [
          "Khẳng định nguyên tắc thiết kế di động: Bottom Navigation chỉ nên chứa tối đa 3 đến 5 mục trọng yếu nhất theo chuẩn Apple HIG và Material Design",
          "Phân tích tần suất sử dụng của 2 tính năng mới: nếu là tính năng phụ, gom vào mục 'Thêm' (More) hoặc đưa vào Side Drawer / Profile menu",
          "Nếu một trong hai là hành động khởi tạo quan trọng, thiết kế một nút Floating Action Button (FAB) nổi bật ở giữa thanh điều hướng"
        ],
        "followUps": [
          "Làm thế nào để dùng dữ liệu phân tích sự kiện (Event Analytics) để chứng minh tính năng nào nên được giữ ở Bottom Bar?",
          "Cách thiết kế hiển thị thanh điều hướng tự động ẩn khi người dùng cuộn nội dung xuống và hiện lại khi cuộn lên?"
        ],
        "tags": [
          "Bottom Navigation",
          "Mobile Architecture",
          "HIG / Material",
          "Navigation Overflow"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://developer.apple.com/design/human-interface-guidelines/"
        ],
        "redFlags": [
          "Cố nhồi cả 7 tab vào thanh đáy khiến icon bị teo nhỏ và chữ bị cắt cụt"
        ]
      },
      {
        "id": "UI_DES-SCEN-05",
        "role": "UI Designer",
        "category": "scenario",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Tình huống: Một số người dùng phản ánh rằng giao diện website đọc rất mỏi mắt trên các màn hình máy tính để bàn cũ có độ phân giải thấp (1366x768 non-Retina), văn bản bị mờ và răng cưa. Em điều tra và điều chỉnh các thông số Typography và Iconography như thế nào để khắc phục?",
        "evaluationCriteria": [
          "Tăng kích thước font body tối thiểu từ 14px lên 16px để các nét chữ có đủ số lượng pixel vật lý hiển thị rõ ràng",
          "Chọn các font chữ có x-height lớn và độ dày nét đều (như Inter, Roboto) giúp hiển thị sắc nét trên màn hình low-DPI",
          "Đảm bảo toàn bộ icon được vẽ căn khớp với pixel grid (Pixel snapping) để tránh hiện tượng viền icon bị mờ do nằm ở nửa pixel (sub-pixel rendering)"
        ],
        "followUps": [
          "Pixel-fitting trong Figma hoạt động như thế nào khi vẽ vector icon?",
          "Thuộc tính CSS font-smoothing (-webkit-font-smoothing) có tác động ra sao trên trình duyệt?"
        ],
        "tags": [
          "Low-DPI Display",
          "Pixel Snapping",
          "Typography Legibility",
          "Sub-pixel Rendering"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Cho rằng lỗi do màn hình của người dùng kém chất lượng nên không cần tối ưu thiết kế"
        ]
      },
      {
        "id": "UI_DES-SCEN-06",
        "role": "UI Designer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Công ty triển khai mô hình kinh doanh nhượng quyền đa thương hiệu (Multi-brand White Label). Cùng một hệ thống ứng dụng nhưng phải hỗ trợ giao diện thay đổi linh hoạt theo nhận diện của từng đối tác khách hàng (thay đổi màu sắc, độ bo góc viền corner radius, font chữ và kiểu đổ bóng). Em kiến trúc hệ thống Design Variables trong Figma thế nào?",
        "evaluationCriteria": [
          "Tạo các Collections Variables độc lập: Brand Token Collection chứa các Mode tương ứng với từng Brand A, Brand B, Brand C",
          "Semantic Token ánh xạ động sang Brand Token (vd: Button-Radius ánh xạ sang Token-Radius của từng brand: 4px góc nhọn hoặc 24px bo tròn)",
          "Designer chỉ cần chuyển đổi Mode trên cấp Frame cha là toàn bộ giao diện tự động đồng bộ theo nhận diện của thương hiệu đối tác mà không cần vẽ lại"
        ],
        "followUps": [
          "Làm thế nào để xử lý các đối tác có phong cách thị giác đối lập hoàn toàn (phẳng Flat vs nhiều chiều sâu Skeuomorphic/Glassmorphism)?",
          "Quy trình kiểm thử hồi quy thị giác (Visual Regression Test) đối với tất cả các themes trước khi xuất bản?"
        ],
        "tags": [
          "White Label Design",
          "Multi-brand",
          "Figma Variables Modes",
          "Design Architecture"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://help.figma.com/hc/en-us"
        ],
        "redFlags": [
          "Tạo ra 5 file thiết kế riêng biệt cho 5 nhãn hàng và phải copy-paste thủ công mỗi khi có màn hình mới"
        ]
      },
      {
        "id": "UI_DES-CV-01",
        "role": "UI Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong dự án xây dựng UI Kit hoặc Component Library trên Figma mà em đề cập trong CV: Em đã quy hoạch bao nhiêu components, cách áp dụng Auto Layout kết hợp Variables như thế nào, và hệ thống này đã giúp rút ngắn bao nhiêu phần trăm thời gian lên bản vẽ của nhóm?",
        "evaluationCriteria": [
          "Trình bày quy mô cụ thể: số lượng component gốc, số lượng variants và cơ chế quản lý versioning trong Figma Library",
          "Nêu rõ cấu trúc token màu sắc, typography và khoảng cách được chuẩn hóa",
          "Dẫn chứng số liệu: rút ngắn 40% thời gian thiết kế màn hình mới, giảm 50% số lượng bug giao diện trong khâu phát triển"
        ],
        "followUps": [
          "Khó khăn lớn nhất khi thuyết phục các designers khác trong nhóm tuân thủ đúng thư viện dùng chung là gì?",
          "Em đã từng phải thực hiện đợt breaking-change tái cấu trúc thư viện lớn chưa và cách di chuyển an toàn?"
        ],
        "tags": [
          "CV Validation",
          "UI Kit Architecture",
          "Design Efficiency",
          "Figma Library"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nói chung chung là có tạo component mà không nắm được cấu trúc tổ chức hay hiệu quả định lượng"
        ]
      },
      {
        "id": "UI_DES-CV-02",
        "role": "UI Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "CV của em có nhắc đến việc Tái thiết kế (Redesign) một sản phẩm phức tạp. Hãy trình bày những khuyết điểm thị giác lớn nhất của giao diện cũ, các quyết định thẩm mỹ then chốt của em đã thay đổi diện mạo sản phẩm ra sao, và phản hồi đo lường được từ người dùng?",
        "evaluationCriteria": [
          "Chỉ rõ vấn đề giao diện cũ: phân cấp thị giác lộn xộn, mật độ thông tin quá dày, màu sắc xung đột, không nhất quán giữa các trang",
          "Quyết định tái thiết kế: tối giản hóa bảng màu, áp dụng lưới 8pt đồng bộ, thiết kế lại hệ thống thẻ và biểu đồ trực quan",
          "Kết quả định lượng: tăng 25% tỷ lệ hoàn thành tác vụ, giảm tỷ lệ thoát trang và điểm hài lòng CSAT về giao diện tăng rõ rệt"
        ],
        "followUps": [
          "Trong quá trình redesign, em làm thế nào để người dùng lâu năm không bị sốc khi thói quen sử dụng thay đổi đột ngột?",
          "Em có thực hiện A/B testing về mặt thị giác cho các phương án thiết kế mới không?"
        ],
        "tags": [
          "Redesign",
          "Visual Revamp",
          "Before and After",
          "Quantitative Impact"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ thay đổi màu sắc cho hợp mắt cá nhân mà không giải quyết được các điểm nghẽn thị giác và khả năng sử dụng"
        ]
      },
      {
        "id": "UI_DES-CV-03",
        "role": "UI Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi trên CV kinh nghiệm thiết kế ứng dụng di động cho cả hai nền tảng iOS và Android. Hãy phân tích các điểm khác biệt then chốt về mặt UI giữa Human Interface Guidelines (Apple) và Material Design 3 (Google) mà em đã trực tiếp áp dụng trong dự án?",
        "evaluationCriteria": [
          "iOS: Điều hướng dạng Segmented Control và Navigation Bar với tiêu đề lớn (Large Title); nút quay lại góc trên trái hoặc vuốt cạnh; font SF Pro",
          "Android: Điều hướng dạng Tabs hoặc Navigation Drawer; nút Back phần cứng/cử chỉ; font Roboto; ngôn ngữ Material You với màu sắc linh hoạt",
          "Giữ vững nhận diện thương hiệu của sản phẩm trong khi vẫn tôn trọng thói quen tương tác tự nhiên của người dùng từng hệ điều hành"
        ],
        "followUps": [
          "Khi nào nên sử dụng giải pháp Cross-platform UI đồng nhất và khi nào bắt buộc phải phân tách chuẩn Native UI cho từng OS?",
          "Cách thiết kế thanh trạng thái (Status Bar) và thanh điều hướng ảo (Home Indicator bar) chuẩn cho iPhone tai thỏ và Dynamic Island?"
        ],
        "tags": [
          "iOS HIG",
          "Material Design",
          "Cross-platform UI",
          "Platform Conventions"
        ],
        "sourceRefs": [
          "https://developer.apple.com/design/human-interface-guidelines/",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Bê nguyên giao diện Android sang iOS (như nút 3 chấm menu góc trên hoặc icon Material) khiến người dùng Apple cảm thấy xa lạ"
        ]
      },
      {
        "id": "UI_DES-CV-04",
        "role": "UI Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong một dự án thiết kế trang giỏ hàng và thanh toán (Checkout UI) mà em từng đảm nhiệm: Những chi tiết thị giác nào em đã tinh chỉnh (kích thước nút bấm, vị trí thông báo bảo mật, microcopy) giúp giảm thiểu sự do dự của người dùng tại bước chốt đơn?",
        "evaluationCriteria": [
          "Tối ưu nút CTA thanh toán: kích thước nổi bật (chiều cao 48-56px), màu tương phản cao nhất màn hình, luôn ghim cố định ở đáy (Sticky Bottom) trên mobile",
          "Hiển thị các huy hiệu bảo mật uy tín (SSL, Visa/Mastercard, chính sách đổi trả) ngay cạnh nút bấm để tăng độ tin cậy",
          "Làm rõ ràng chi tiết tổng tiền, miễn phí vận chuyển, không phát sinh chi phí ẩn gây bất ngờ tiêu cực"
        ],
        "followUps": [
          "Cách xử lý thị giác khi thẻ tín dụng của người dùng bị từ chối thanh toán để họ không từ bỏ giỏ hàng?",
          "Làm thế nào để thiết kế bước nhập mã giảm giá (Promo Code) mà không kích thích người dùng thoát app đi tìm mã voucher trên mạng?"
        ],
        "tags": [
          "Checkout UI",
          "Trust Badges",
          "Conversion Optimization",
          "Microcopy"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thiết kế nút thanh toán chìm nghỉm hoặc giấu các thông tin phí ship ở góc khuất"
        ]
      },
      {
        "id": "UI_DES-CV-05",
        "role": "UI Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Em đề cập trên CV kinh nghiệm phối hợp chặt chẽ với đội ngũ kỹ sư Frontend. Em đã thiết lập quy trình làm việc chung (Design-to-Code Workflow) như thế nào để đảm bảo sản phẩm thực tế khi phát hành đạt chuẩn chất lượng cao nhất?",
        "evaluationCriteria": [
          "Thống nhất bộ từ điển thuật ngữ chung giữa Design và Code (Tokens naming convention)",
          "Tổ chức các buổi bàn giao tính năng (Handoff Kickoff) trước Sprint và Design QA Review trước khi merge code vào production",
          "Tham gia xây dựng Storybook của công ty để đảm bảo các component code phản ánh trung thực bản vẽ Figma"
        ],
        "followUps": [
          "Khi phát sinh bất đồng về việc một hiệu ứng animation có khả thi về mặt hiệu năng trên code hay không, em xử lý thế nào?",
          "Em đánh giá mức độ trưởng thành của quy trình Design-to-Code tại công ty cũ đạt mức nào?"
        ],
        "tags": [
          "Design-to-Code",
          "Storybook",
          "Collaboration",
          "Design Tokens"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ bàn giao link Figma rồi coi như hết trách nhiệm, không quan tâm code thực tế chạy ra sao"
        ]
      },
      {
        "id": "UI_DES-BEHAV-01",
        "role": "UI Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi Product Manager yêu cầu nhồi nhét thêm 3 banner khuyến mãi sặc sỡ và nhiều nút kêu gọi hành động lên trang chủ khiến giao diện bị rối loạn phân cấp thị giác, em thuyết phục và đưa ra giải pháp thay thế ra sao?",
        "evaluationCriteria": [
          "Lắng nghe mục tiêu kinh doanh phía sau yêu cầu: PM muốn tăng doanh số chiến dịch và tỷ lệ bấm xem khuyến mãi",
          "Chứng minh bằng nguyên lý thị giác: quá nhiều banner cạnh tranh sẽ gây ra hiện tượng 'Banner Blindness' (mù banner), người dùng sẽ tự động bỏ qua toàn bộ",
          "Đề xuất phương án thay thế: gom nhóm banner thành một khu vực trượt mượt mà (Carousel) hoặc thiết kế một banner chính có tính cá nhân hóa cao cho từng đối tượng người dùng"
        ],
        "followUps": [
          "Nếu PM vẫn khăng khăng giữ ý kiến vì áp lực từ Giám đốc kinh doanh, em sẽ làm gì tiếp theo?",
          "Làm thế nào để đề xuất chạy thử nghiệm A/B Testing để dữ liệu thực tế chứng minh phương án nào hiệu quả hơn?"
        ],
        "tags": [
          "Banner Blindness",
          "Stakeholder Persuasion",
          "Visual Balance",
          "A/B Testing"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thụ động nghe theo răm rắp làm hỏng giao diện, hoặc phản ứng gay gắt với thái độ nghệ sĩ bảo thủ"
        ]
      },
      {
        "id": "UI_DES-BEHAV-02",
        "role": "UI Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Lập trình viên phản hồi rằng một hiệu ứng chuyển động tương tác vi mô (Micro-interaction) mà em thiết kế 'quá phức tạp, tốn thời gian và không cần thiết cho dự án'. Em xử lý sự bất đồng kỹ thuật này như thế nào?",
        "evaluationCriteria": [
          "Không vội tranh cãi; tìm hiểu lý do kỹ thuật cụ thể: khó code ở thư viện nào, ảnh hưởng FPS hay do thời gian sprint quá gấp",
          "Giải thích giá trị trải nghiệm của animation đó: giúp người dùng hiểu trạng thái dữ liệu đã được lưu thành công, giảm cảm giác chờ đợi",
          "Đề xuất phương án đơn giản hóa (Phase 1 dùng transition cơ bản bằng CSS, Phase 2 nâng cấp animation phức tạp hơn) hoặc chủ động xuất file Lottie / Rive tối ưu code sẵn cho dev"
        ],
        "followUps": [
          "Em đã từng tự học các kiến thức cơ bản về HTML/CSS để giao tiếp dễ dàng hơn với developer chưa?",
          "Làm thế nào để xây dựng mối quan hệ tôn trọng lẫn nhau giữa Designer và Developer?"
        ],
        "tags": [
          "Developer Negotiation",
          "Micro-interaction",
          "Lottie Animation",
          "Technical Empathy"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bắt ép dev phải làm đúng 100% mà không quan tâm đến hạn mức thời gian hay độ phức tạp kỹ thuật"
        ]
      },
      {
        "id": "UI_DES-BEHAV-03",
        "role": "UI Designer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Khi nhận được phản hồi cảm tính từ một bên liên quan (Stakeholder) như: 'Tôi thấy màu này nhìn quê quá' hoặc 'Giao diện này nhìn chưa sang chảnh'. Em làm thế nào để bóc tách nhận xét đó thành các tiêu chí thiết kế cụ thể?",
        "evaluationCriteria": [
          "Giữ bình tĩnh và sự chuyên nghiệp, không để cảm xúc tự ái chi phối khi tác phẩm bị nhận xét cảm tính",
          "Đặt câu hỏi gợi mở để làm rõ bản chất: 'Khi anh/chị nói 'sang chảnh', anh/chị đang kỳ vọng cảm giác tối giản, tinh tế hay cao cấp giống sản phẩm nào trên thị trường?'",
          "Dẫn dắt cuộc thảo luận quay về đối tượng người dùng mục tiêu và bảng moodboard định hướng thương hiệu đã thống nhất"
        ],
        "followUps": [
          "Làm thế nào để trình bày bản thiết kế (Design Presentation) ngay từ đầu để hạn chế tối đa các phản hồi cảm tính?",
          "Khi có sự bất đồng về gu thẩm mỹ giữa hai sếp lớn trong công ty, em điều phối ra sao?"
        ],
        "tags": [
          "Vague Feedback",
          "Stakeholder Communication",
          "Design Presentation",
          "Objective Criteria"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cãi nhau tay đôi về gu thẩm mỹ cá nhân hoặc âm thầm sửa theo ý sếp một cách chán nản"
        ]
      },
      {
        "id": "UI_DES-BEHAV-04",
        "role": "UI Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong bối cảnh tiến độ Sprint rất gấp nhưng đội ngũ Content/Marketing chưa kịp cung cấp nội dung chữ thực tế (buộc phải dùng văn bản giả Lorem Ipsum). Làm thế nào để em thiết kế giao diện có khả năng thích ứng tốt khi nội dung thật được đưa vào?",
        "evaluationCriteria": [
          "Chủ động tự viết các nội dung mẫu sát với thực tế nhất có thể (Realistic Content Copy) thay vì dùng Lorem Ipsum vô nghĩa",
          "Thiết kế dự phòng các kịch bản cực hạn (Extreme cases): tiêu đề dài gấp 3 lần bình thường, tên sản phẩm có ký tự đặc biệt, giá tiền nhiều chữ số",
          "Quy định rõ trong specs: số dòng tối đa trước khi cắt ngắn bằng dấu ba chấm (line-clamp), và chiều cao co giãn của các card nội dung"
        ],
        "followUps": [
          "Tại sao việc dùng Lorem Ipsum trong thiết kế thường dẫn đến việc giao diện bị vỡ nát khi lên code thực tế?",
          "Em phối hợp với UX Writer hoặc Content Strategist như thế nào trong quy trình thiết kế?"
        ],
        "tags": [
          "Lorem Ipsum Risk",
          "Content-first Design",
          "Edge Cases",
          "Sprint Pressure"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Vẽ các ô chữ có độ dài hoàn hảo nhân tạo bằng Lorem Ipsum và phó mặc cho số phận khi nội dung thật vào"
        ]
      },
      {
        "id": "UI_DES-BEHAV-05",
        "role": "UI Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "senior_lead",
        "question": "Khi em và một UI Designer khác trong nhóm có hai định hướng phong cách thị giác hoàn toàn khác nhau cho cùng một sản phẩm mới, em xử lý tình huống cạnh tranh quan điểm này như thế nào để chọn ra giải pháp tốt nhất cho dự án?",
        "evaluationCriteria": [
          "Tách bạch cái tôi cá nhân ra khỏi giải pháp thiết kế; đặt sản phẩm và người dùng lên hàng đầu",
          "Xây dựng bảng tiêu chí đánh giá khách quan dựa trên: Mức độ phù hợp với Brand Identity, Tính khả thi khi lập trình, Khả năng mở rộng thành hệ thống (Scalability) và Tính thân thiện với người dùng",
          "Tổ chức một buổi Design Critique nội bộ hoặc làm bài kiểm tra người dùng nhanh (Quick Usability Testing / Preference Test) với 5-10 người dùng thật"
        ],
        "followUps": [
          "Làm thế nào để xây dựng văn hóa góp ý thiết kế (Design Critique Culture) mang tính xây dựng, cởi mở trong đội ngũ?",
          "Khi phương án của em không được lựa chọn, em tiếp nhận và hỗ trợ đồng nghiệp triển khai phương án thắng cuộc ra sao?"
        ],
        "tags": [
          "Design Critique",
          "Healthy Disagreement",
          "Preference Testing",
          "Team Collaboration"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Bảo thủ bảo vệ phương án của mình đến cùng hoặc tạo ra bè phái gây mất đoàn kết trong nhóm thiết kế"
        ]
      }
    ]
  },
  {
    "role": "UX Designer",
    "group": "productUX",
    "groupLabel": "Thiết kế Sản phẩm & UX",
    "aliases": [
      "ux designer",
      "user experience designer",
      "thiet ke trai nghiem nguoi dung",
      "interaction designer"
    ],
    "questions": [
      {
        "id": "UX_DES-FOUND-01",
        "role": "UX Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong UX Designer, phân biệt Jakob Nielsen, 10 Usability Heuristics, Heuristic Evaluation, Error Prevention; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Jakob Nielsen.",
          "Phân biệt được các khái niệm liên quan 10 Usability Heuristics, Heuristic Evaluation, Error Prevention ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí UX Designer."
        ],
        "followUps": [
          "Nếu mới học Jakob Nielsen, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Jakob Nielsen",
          "10 Usability Heuristics",
          "Heuristic Evaluation",
          "Error Prevention",
          "Recognition"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "UX_DES-FOUND-02",
        "role": "UX Designer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Kiến trúc thông tin (Information Architecture - IA): Cách tổ chức dữ liệu theo nguyên tắc LATCH (Location, Alphabet, Time, Category, Hierarchy) của Richard Saul Wurman? Làm thế nào để phân cấp thông tin phản ánh đúng Mô hình tư duy (Mental Model) của người dùng thay vì cấu trúc cơ sở dữ liệu của đội kỹ thuật?",
        "evaluationCriteria": [
          "Nắm chắc 5 phương thức tổ chức thông tin LATCH và phạm vi áp dụng tối ưu cho từng phương thức",
          "Phân biệt Mental Model (cách người dùng hình dung sản phẩm hoạt động) và Implementation Model (cách hệ thống thực sự được lập trình bên dưới)",
          "Thu hẹp khoảng cách bằng cách dùng ngôn ngữ và phân nhóm theo thói quen của người dùng thay vì cấu trúc bảng DB"
        ],
        "followUps": [
          "Phương pháp Card Sorting (Open vs Closed) hỗ trợ xây dựng kiến trúc thông tin như thế nào?",
          "Thế nào là 'Nghịch lý của sự lựa chọn' (Paradox of Choice) trong cấu trúc điều hướng?"
        ],
        "tags": [
          "Information Architecture",
          "Mental Model",
          "LATCH Principle",
          "Card Sorting",
          "Navigation"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Bê nguyên cấu trúc phòng ban công ty hoặc cấu trúc cơ sở dữ liệu làm menu điều hướng cho người dùng"
        ]
      },
      {
        "id": "UX_DES-FOUND-03",
        "role": "UX Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Các định luật tâm lý học nhận thức trong thiết kế UX: Định luật Hick's Law, Fitts's Law và Miller's Law (7 ± 2) chi phối hành vi người dùng như thế nào khi tương tác với sản phẩm số?",
        "evaluationCriteria": [
          "Hick's Law: Thời gian đưa ra quyết định tăng theo số lượng và độ phức tạp của các lựa chọn; cần hạn chế số lượng lựa chọn cùng lúc",
          "Fitts's Law: Thời gian di chuyển đến mục tiêu phụ thuộc vào khoảng cách và kích thước của mục tiêu; nút bấm quan trọng cần to và dễ chạm tới (ở góc/cạnh màn hình)",
          "Miller's Law: Trí nhớ ngắn hạn của con người chỉ giữ được 7 ± 2 đơn vị thông tin; áp dụng kỹ thuật Chunking để phân đoạn dữ liệu"
        ],
        "followUps": [
          "Định luật Fitts được áp dụng như thế nào trên màn hình cảm ứng di động (Thumb Zone)?",
          "Định luật Jakob's Law (người dùng dành phần lớn thời gian ở các website khác) ảnh hưởng đến tính nhất quán ra sao?"
        ],
        "tags": [
          "Hick's Law",
          "Fitts's Law",
          "Miller's Law",
          "Thumb Zone",
          "Cognitive Psychology"
        ],
        "sourceRefs": [
          "https://www.interaction-design.org/literature",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Cho rằng đặt càng nhiều tính năng trên một trang thì người dùng càng tiện thao tác"
        ]
      },
      {
        "id": "UX_DES-FOUND-04",
        "role": "UX Designer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Phân biệt giữa User Journey Map (Hành trình người dùng) và Service Blueprint (Bản thiết kế dịch vụ). Khi nào cần sử dụng Service Blueprint để giải quyết các điểm gãy trong trải nghiệm khách hàng?",
        "evaluationCriteria": [
          "User Journey Map tập trung vào góc nhìn của người dùng (Customer perspective): giai đoạn, hành động, suy nghĩ, cảm xúc (touchpoints, pain points, emotional curve)",
          "Service Blueprint mở rộng ra cả bức tranh vận hành nội bộ (Frontstage, Backstage, Support Processes, Physical Evidence)",
          "Sử dụng Service Blueprint khi trải nghiệm số gắn liền với quy trình vận hành offline (giao hàng, tài xế, kho bãi, chăm sóc khách hàng)"
        ],
        "followUps": [
          "Line of Visibility (Ranh giới hiển thị) trong Service Blueprint có ý nghĩa gì?",
          "Làm thế nào để gắn các chỉ số đo lường hiệu suất (SLA, drop-off) vào từng bước của Service Blueprint?"
        ],
        "tags": [
          "User Journey Map",
          "Service Blueprint",
          "Frontstage vs Backstage",
          "Touchpoints",
          "Omnichannel UX"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Đồng nhất Journey Map và Service Blueprint làm một, bỏ qua toàn bộ quy trình vận hành hậu trường"
        ]
      },
      {
        "id": "UX_DES-FOUND-05",
        "role": "UX Designer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Khái niệm Dark Patterns (Mô hình thiết kế thao túng / Lừa dối) trong UX: Phân tích các dạng phổ biến như Roach Motel, Confirmshaming, Hidden Costs và Misdirection. Trách nhiệm đạo đức của UX Designer và tác hại lâu dài của Dark Patterns đến uy tín thương hiệu là gì?",
        "evaluationCriteria": [
          "Roach Motel: Dễ vào nhưng khó ra (dễ đăng ký nhưng bắt gọi hotline để hủy dịch vụ)",
          "Confirmshaming: Ép người dùng cảm thấy có lỗi nếu từ chối (vd: nút từ chối ghi 'Không, tôi không muốn tiết kiệm tiền')",
          "Hidden Costs: Phát sinh chi phí ẩn ở bước thanh toán cuối; Misdirection: Đánh lạc hướng chú ý",
          "Tác hại: Mất niềm tin khách hàng, tăng tỷ lệ rời bỏ (Churn Rate), rủi ro pháp lý theo luật bảo vệ người tiêu dùng quốc tế"
        ],
        "followUps": [
          "Làm thế nào để bảo vệ người dùng và từ chối khéo léo khi cấp trên yêu cầu cài cắm Dark Pattern để tăng KPI ngắn hạn?",
          "Khái niệm 'Honest UX' (Trải nghiệm trung thực) đem lại lợi ích kinh doanh bền vững ra sao?"
        ],
        "tags": [
          "Dark Patterns",
          "Roach Motel",
          "Ethical UX",
          "Confirmshaming",
          "Consumer Trust"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Bào chữa cho Dark Patterns như một mẹo tối ưu chuyển đổi bình thường mà không nhận thức về mặt đạo đức"
        ]
      },
      {
        "id": "UX_DES-FOUND-06",
        "role": "UX Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Khả năng tiếp cận nhận thức (Cognitive Accessibility) trong thiết kế UX: Làm thế nào để giảm Tải trọng nhận thức (Cognitive Load: Intrinsic, Extraneous, Germane) cho người dùng bị suy giảm nhận thức tạm thời (mệt mỏi, phân tâm khi lái xe) hoặc vĩnh viễn?",
        "evaluationCriteria": [
          "Tải trọng nhận thức ngoại lai (Extraneous Cognitive Load) là thứ do thiết kế vụng về gây ra (rối mắt, thuật ngữ khó); cần loại bỏ triệt để",
          "Sử dụng ngôn ngữ đơn giản, rõ ràng (Plain Language), câu cú ngắn gọn",
          "Cung cấp các điểm neo hỗ trợ (Scaffolding: Breadcrumbs, Progress bars, Save draft) để người dùng quay lại tác vụ dễ dàng sau khi bị gián đoạn"
        ],
        "followUps": [
          "Làm thế nào để thiết kế một luồng tác vụ an toàn cho người dùng khi họ đang vừa đi bộ vừa bấm điện thoại?",
          "Nguyên lý 'Graceful Degradation' trong trải nghiệm người dùng hoạt động ra sao?"
        ],
        "tags": [
          "Cognitive Load",
          "Accessibility",
          "Plain Language",
          "Extraneous Load",
          "Usability"
        ],
        "sourceRefs": [
          "https://www.w3.org/WAI/standards-guidelines/wcag/",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Nghĩ rằng Accessibility chỉ là việc hỗ trợ người mù dùng máy đọc màn hình mà quên mất khía cạnh nhận thức"
        ]
      },
      {
        "id": "UX_DES-SKILL-01",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Wireframing (Low-fi vs Mid-fi, Information Structure, Rapid Prototyping) cho UX Designer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Wireframing trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Wireframing",
          "Low-fi vs Mid-fi",
          "Information Structure",
          "Rapid Prototyping"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "UX_DES-SKILL-02",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập UX Designer: dựa trên User Flows, phối hợp Task Flows, Unhappy Paths, Decision Trees, Flowchart Standard; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng User Flows trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "User Flows",
          "Task Flows",
          "Unhappy Paths",
          "Decision Trees",
          "Flowchart Standard"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "UX_DES-SKILL-03",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Quy trình thực hiện Đánh giá Heuristic độc lập (Heuristic Evaluation) cho một tính năng hiện hữu: Em xây dựng ma trận đánh giá (Severity Rating: 0 - Cosmetical, 1 - Minor, 2 - Major, 3 - Usability Catastrophe) và báo cáo khuyến nghị khắc phục như thế nào?",
        "evaluationCriteria": [
          "Chạy thử nghiệm toàn bộ luồng tác vụ với tư cách chuyên gia, soi chiếu từng màn hình với 10 nguyên tắc Heuristic",
          "Chấm điểm mức độ nghiêm trọng (Severity) dựa trên: Tần suất gặp phải, Mức độ tác động đến việc hoàn thành tác vụ, Tính dai dẳng của lỗi",
          "Trình bày báo cáo kèm ảnh chụp bằng chứng lỗi, giải thích nguyên tắc bị vi phạm và đề xuất giải pháp phác thảo cụ thể ngay lập tức"
        ],
        "followUps": [
          "Cần tối thiểu bao nhiêu chuyên gia UX cùng thực hiện Heuristic Evaluation độc lập để phát hiện trên 80% vấn đề?",
          "Làm thế nào để ưu tiên các hạng mục cần sửa chữa trong backlog sản phẩm dựa trên điểm Severity?"
        ],
        "tags": [
          "Heuristic Evaluation",
          "Severity Rating",
          "Usability Audit",
          "Defect Matrix"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Liệt kê các điểm không thích mang tính cảm tính chủ quan mà không căn cứ vào nguyên tắc Heuristic chuẩn"
        ]
      },
      {
        "id": "UX_DES-SKILL-04",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Lập kế hoạch và điều phối Kiểm thử khả năng sử dụng (Usability Testing) với 5 người dùng: Em thiết kế Kịch bản kiểm thử (Test Protocol), câu hỏi sàng lọc (Screener), các nhiệm vụ mở (Open-ended Tasks) và áp dụng phương pháp 'Nghĩ thành tiếng' (Think Aloud Protocol) ra sao?",
        "evaluationCriteria": [
          "Viết Screener để tuyển đúng người dùng mục tiêu; kịch bản bao gồm 3-5 nhiệm vụ cụ thể dựa trên mục tiêu thực tế (không chỉ định bấm vào đâu)",
          "Hướng dẫn người dùng phương pháp Think Aloud: nói to suy nghĩ, cảm xúc và sự do dự trong lúc thao tác",
          "Người điều phối giữ thái độ trung lập tuyệt đối, không khen ngợi, không hướng dẫn hay giải thích tính năng khi người dùng bị kẹt"
        ],
        "followUps": [
          "Tại sao theo Nielsen chỉ cần 5 người dùng là đã phát hiện được khoảng 85% các vấn đề về khả năng sử dụng?",
          "Cách tính toán thang đo độ khó của nhiệm vụ (Single Ease Question - SEQ) sau mỗi task?"
        ],
        "tags": [
          "Usability Testing",
          "Think Aloud Protocol",
          "Task Design",
          "Screener Questionnaire",
          "SEQ"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Dạy người dùng cách dùng app hoặc can thiệp trả lời hộ khi người dùng đang gặp khó khăn trong bài test"
        ]
      },
      {
        "id": "UX_DES-SKILL-05",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tối ưu hóa Phễu chuyển đổi (Conversion Funnel Optimization): Khi phát hiện tỷ lệ thoát trang (Drop-off Rate) tại bước thanh toán lên đến 55%, em sử dụng các công cụ phân tích định lượng (Mixpanel/Google Analytics, Funnel Analysis) kết hợp định tính (Hotjar/Clarity Heatmaps, Session Recordings) như thế nào để tìm ra rào cản ma sát (Friction)?",
        "evaluationCriteria": [
          "Phân tích Funnel để xác định chính xác điểm rơi: người dùng dừng lại ở trường nhập liệu nào hay nút bấm nào",
          "Xem Session Recordings và Heatmaps để quan sát hành vi thực tế: người dùng có bị 'Rage Clicks' (bấm liên tục trong bực bội) hay do dự di chuột lâu?",
          "Phát hiện ma sát: biểu mẫu đòi hỏi quá nhiều thông tin nhạy cảm, lỗi validation không rõ ràng hoặc không có phương thức thanh toán quen thuộc"
        ],
        "followUps": [
          "Làm thế nào để phân biệt giữa ma sát có hại (Harmful Friction) và ma sát có lợi (Positive Friction - bảo vệ an toàn chuyển khoản)?",
          "Cách thiết kế thử nghiệm A/B Testing để kiểm chứng phương án tối ưu phễu?"
        ],
        "tags": [
          "Conversion Funnel",
          "Drop-off Analysis",
          "Heatmaps",
          "Session Recording",
          "Rage Clicks"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Đoán mò nguyên nhân và thay đổi giao diện theo linh cảm mà không nhìn vào dữ liệu phễu và bản ghi hành vi"
        ]
      },
      {
        "id": "UX_DES-SKILL-06",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Thiết kế Kiến trúc thông tin cho một trang thương mại điện tử lớn: Em sử dụng phương pháp Phân loại thẻ (Card Sorting: Open, Closed, Hybrid) và Kiểm thử cấu trúc cây (Tree Testing) như thế nào để xây dựng hệ thống menu đa tầng (Mega Menu) chuẩn xác?",
        "evaluationCriteria": [
          "Tổ chức Open Card Sorting để người dùng tự do gom nhóm sản phẩm và đặt tên danh mục, tìm ra cách hiểu tự nhiên của họ",
          "Chạy Closed Card Sorting để xác thực cấu trúc danh mục đã đề xuất",
          "Thực hiện Tree Testing (kiểm tra không có giao diện) để đo lường tỷ lệ tìm thấy món hàng (Findability) và thời gian hoàn thành tác vụ trên cây menu"
        ],
        "followUps": [
          "Khi nào nên dùng Mega Menu và khi nào nên dùng Navigation dạng Dropdown truyền thống?",
          "Cách xử lý các sản phẩm có thể thuộc về nhiều danh mục khác nhau (Polyhierarchy)?"
        ],
        "tags": [
          "Card Sorting",
          "Tree Testing",
          "Mega Menu",
          "Findability",
          "Information Architecture"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Xây dựng menu theo cấu trúc kho hàng nội bộ của doanh nghiệp khiến khách hàng tìm kiếm lòng vòng không thấy"
        ]
      },
      {
        "id": "UX_DES-SKILL-07",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Thiết kế Tìm kiếm và Bộ lọc nâng cao (Search & Faceted Navigation): Em tổ chức các tiêu chí lọc (Filters: đa lựa chọn, khoảng giá, trạng thái), tính năng gợi ý thông minh (Typeahead / Autocomplete) và trang hiển thị kết quả tìm kiếm ra sao để tối đa hóa khả năng khám phá sản phẩm?",
        "evaluationCriteria": [
          "Đặt thanh tìm kiếm nổi bật ở vị trí chuẩn mực kèm văn bản gợi ý rõ ràng (Placeholder gợi ý từ khóa phổ biến)",
          "Hệ thống lọc theo khía cạnh (Faceted Filtering) hiển thị số lượng kết quả khớp tạm tính bên cạnh mỗi tùy chọn (vd: 'Áo thun (42)')",
          "Cho phép chọn nhiều bộ lọc cùng lúc và áp dụng tức thời hoặc qua nút 'Xem kết quả' có hiển thị số lượng sản phẩm được cập nhật realtime"
        ],
        "followUps": [
          "Cách hiển thị các chip bộ lọc đã chọn (Active Filter Chips) và tính năng 'Xóa tất cả bộ lọc' nhanh chóng?",
          "Khi kết quả tìm kiếm trả về bằng 0 (Zero Results), em gợi ý từ khóa tương tự hoặc sửa lỗi chính tả (Did you mean?) ra sao?"
        ],
        "tags": [
          "Faceted Navigation",
          "Search UX",
          "Autocomplete",
          "Filter Chips",
          "Zero State Search"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Ẩn nút lọc ở chỗ khó tìm và mỗi lần chọn 1 checkbox lại tải lại toàn bộ trang làm gián đoạn trải nghiệm"
        ]
      },
      {
        "id": "UX_DES-SKILL-08",
        "role": "UX Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Kỹ thuật Viết nội dung trải nghiệm (UX Copywriting & Microcopy): Em áp dụng những nguyên tắc nào (Ngắn gọn, Rõ ràng, Hành động, Đồng cảm) để viết các thông báo lỗi (Error Messages), nhãn nút bấm (Action Labels) và các bước xác nhận hành động nguy hiểm (Destructive Confirmations)?",
        "evaluationCriteria": [
          "Thông báo lỗi phải trả lời 3 câu hỏi: Chuyện gì đã xảy ra? Vì sao xảy ra? Người dùng cần làm gì ngay bây giờ để khắc phục?",
          "Nhãn nút bấm phải là động từ chỉ hành động cụ thể ('Lưu thay đổi', 'Gửi hồ sơ') thay vì từ chung chung như 'OK', 'Có'",
          "Hành động nguy hiểm (như Xóa tài khoản) cần hộp thoại xác nhận rõ ràng hậu quả không thể khôi phục và nút xóa dùng màu cảnh báo riêng biệt"
        ],
        "followUps": [
          "Tại sao việc dùng từ ngữ tích cực và tránh đổ lỗi cho người dùng (tránh từ 'Bạn đã làm sai...') lại giữ chân được khách hàng?",
          "Cách viết nội dung Tooltip ngắn gọn mà vẫn giải thích trọn vẹn nghiệp vụ phức tạp?"
        ],
        "tags": [
          "UX Writing",
          "Microcopy",
          "Error Messages",
          "Action Labels",
          "Destructive Actions"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Viết thông báo lỗi mơ hồ kiểu 'Đã có lỗi xảy ra. Vui lòng thử lại sau' mà không hướng dẫn người dùng cách xử lý"
        ]
      },
      {
        "id": "UX_DES-SCEN-01",
        "role": "UX Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại UX Designer, khi Checkout Optimization cùng Drop-off Reduction, Guest Checkout, Form Analytics, A/B Testing xuất hiện và người tham gia thử nghiệm không hoàn thành được tác vụ chính, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong UX Designer.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Checkout Optimization",
          "Drop-off Reduction",
          "Guest Checkout",
          "Form Analytics",
          "A/B Testing"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "UX_DES-SCEN-02",
        "role": "UX Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Người dùng mới phản ánh rằng ứng dụng B2B của công ty quá khó hiểu, họ không biết tính năng cốt lõi nằm ở đâu và thường xuyên bị lạc trong menu điều hướng. Em tiếp cận bài toán tái cấu trúc Kiến trúc thông tin (IA) này ra sao?",
        "evaluationCriteria": [
          "Thực hiện Content Inventory và Content Audit để rà soát toàn bộ các màn hình và tính năng hiện có",
          "Khảo sát và phỏng vấn người dùng để hiểu rõ Top Tasks (những tác vụ mà 80% người dùng thực hiện hàng ngày)",
          "Tổ chức Card Sorting với người dùng thật để sắp xếp lại các menu theo danh mục hành động tự nhiên; tái cấu trúc điều hướng ưu tiên các tác vụ phổ biến nhất"
        ],
        "followUps": [
          "Làm thế nào để thiết kế một luồng Onboarding tương tác (Interactive Walkthrough) dẫn dắt người dùng thực hiện thành công tác vụ đầu tiên (Aha Moment)?",
          "Cách áp dụng Tree Testing để kiểm chứng tính hiệu quả của cấu trúc menu mới trước khi bắt tay vào vẽ UI?"
        ],
        "tags": [
          "Information Architecture",
          "Content Audit",
          "Top Tasks",
          "Navigation Redesign",
          "Aha Moment"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Chỉ sắp xếp lại menu theo cảm tính cá nhân mà không tham khảo hành vi và phản hồi của người dùng"
        ]
      },
      {
        "id": "UX_DES-SCEN-03",
        "role": "UX Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Đội ngũ Pháp chế và Kinh doanh yêu cầu người dùng phải cung cấp hơn 15 trường thông tin xác thực doanh nghiệp phức tạp ngay khi đăng ký tài khoản. Người dùng cảm thấy rất ngại và tỷ lệ hoàn tất đăng ký chỉ đạt 20%. Em áp dụng các nguyên tắc UX nào để giải quyết mâu thuẫn này?",
        "evaluationCriteria": [
          "Áp dụng nguyên tắc Phân đoạn thông tin (Chunking) chia biểu mẫu thành quy trình nhiều bước (Multi-step Wizard) từ dễ đến khó",
          "Giải thích rõ lý do tại sao cần từng thông tin nhạy cảm (Contextual Help / Tooltip minh bạch mục đích pháp lý)",
          "Cung cấp tính năng Lưu bản nháp tự động (Auto-save Draft) và cho phép người dùng vào khám phá một phần sản phẩm trước khi bắt buộc hoàn tất xác minh nâng cao"
        ],
        "followUps": [
          "Thế nào là 'Bậc thang cam kết' (Foot-in-the-door technique) trong thiết kế biểu mẫu onboarding?",
          "Cách hiển thị thanh tiến trình (Progress Bar) kèm tỷ lệ % hoàn thành để tạo động lực tâm lý cho người dùng?"
        ],
        "tags": [
          "Multi-step Form",
          "Chunking",
          "Progressive Profiling",
          "Compliance UX",
          "Auto-save"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Tranh cãi bế tắc với bộ phận pháp chế đòi bỏ hết các trường mà không tìm ra giải pháp trải nghiệm dung hòa"
        ]
      },
      {
        "id": "UX_DES-SCEN-04",
        "role": "UX Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Tình huống: Ứng dụng quản lý sổ khám bệnh điện tử có nhóm người dùng mục tiêu lớn là người cao tuổi (từ 60 tuổi trở lên), thường bị hạn chế về thị lực, thao tác tay run nhẹ và dễ lo âu khi sử dụng công nghệ số. Em điều chỉnh toàn diện trải nghiệm UX như thế nào?",
        "evaluationCriteria": [
          "Tăng kích thước vùng chạm (Touch Target) tối thiểu lên 48x48px đến 56x56px để chống bấm trượt",
          "Đơn giản hóa ngôn ngữ: dùng từ ngữ đời thường, quen thuộc của y tế gia đình, loại bỏ thuật ngữ công nghệ",
          "Hỗ trợ xác thực đơn giản (nhận diện khuôn mặt hoặc gửi mã OTP một chạm), tăng độ tương phản và cung cấp tùy chọn cỡ chữ to trong cài đặt"
        ],
        "followUps": [
          "Làm thế nào để thiết kế tính năng xác nhận kép an toàn cho người lớn tuổi khi họ đặt lịch khám hoặc hủy lịch?",
          "Cách hỗ trợ tài khoản người thân (Caregiver Account) cùng quản lý sổ khám bệnh?"
        ],
        "tags": [
          "Elderly UX",
          "Inclusive Design",
          "Touch Targets",
          "Accessibility",
          "Healthcare UX"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.w3.org/WAI/standards-guidelines/wcag/"
        ],
        "redFlags": [
          "Thiết kế các nút bấm nhỏ 24px, dùng icon cách điệu khó hiểu và nhiều thao tác vuốt trượt phức tạp"
        ]
      },
      {
        "id": "UX_DES-SCEN-05",
        "role": "UX Designer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Ban lãnh đạo muốn giữ chân người dùng trả phí bằng cách giấu nút 'Hủy gói dịch vụ' (Cancel Subscription) sâu trong 5 tầng cài đặt và bắt gọi điện thoại trực tiếp. Là một UX Designer có đạo đức nghề nghiệp, em phân tích rủi ro và thiết kế luồng hủy dịch vụ minh bạch (Ethical Offboarding) ra sao?",
        "evaluationCriteria": [
          "Chỉ ra tác hại nghiêm trọng: người dùng sẽ khiếu nại lừa đảo, đánh giá 1 sao trên store, đòi ngân hàng hoàn tiền (Chargeback) gây thiệt hại lớn về tài chính và danh tiếng",
          "Thiết kế luồng hủy minh bạch: đặt nút hủy ở vị trí hợp lý trong quản lý tài khoản, khảo sát lý do hủy bằng 1 câu hỏi trắc nghiệm ngắn gọn",
          "Đưa ra các phương án thay thế có lợi: tạm dừng gói dịch vụ (Pause subscription), hạ cấp gói cước rẻ hơn hoặc ưu đãi giảm giá ngắn hạn"
        ],
        "followUps": [
          "Khái niệm 'Offboarding UX' chất lượng giúp khách hàng quay trở lại trong tương lai như thế nào?",
          "Làm thế nào để cân bằng giữa việc giữ chân khách hàng (Retention) và sự tôn trọng quyền tự do của người dùng?"
        ],
        "tags": [
          "Ethical Offboarding",
          "Subscription Cancellation",
          "Dark Pattern Prevention",
          "Customer Retention"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Ủng hộ việc giấu nút hủy để làm đẹp con số báo cáo duy trì thuê bao ảo trong ngắn hạn"
        ]
      },
      {
        "id": "UX_DES-SCEN-06",
        "role": "UX Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Trong lúc người dùng đang thực hiện một giao dịch chuyển tiền trực tuyến thì mạng 4G bị chập chờn, hệ thống không nhận được phản hồi xác nhận từ máy chủ. Em thiết kế trải nghiệm phục hồi lỗi (Error Recovery) và bảo toàn trạng thái ra sao để người dùng không bị hoang mang lo sợ mất tiền?",
        "evaluationCriteria": [
          "Tránh tuyệt đối thông báo lỗi chung chung 'Giao dịch thất bại' gây hoang mang; hiển thị màn hình trạng thái 'Giao dịch đang được xử lý an toàn'",
          "Tự động kiểm tra trạng thái giao dịch ngầm và cung cấp nút 'Kiểm tra trạng thái' rõ ràng",
          "Bảo toàn nguyên vẹn thông tin người nhận và số tiền, không bắt người dùng phải nhập lại từ đầu nếu giao dịch thực sự chưa được gửi đi"
        ],
        "followUps": [
          "Làm thế nào để ngăn chặn người dùng bấm liên tục nhiều lần vào nút thanh toán khi mạng bị chậm?",
          "Cách thiết kế thông báo đẩy (Push Notification) hoặc SMS gửi ngay khi hệ thống xử lý xong kết quả giao dịch?"
        ],
        "tags": [
          "Error Recovery",
          "Network Resilience",
          "State Preservation",
          "Financial UX",
          "Transaction Anxiety"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Hiển thị màn hình báo lỗi đỏ lòm và trừ tiền tài khoản mà không có lời giải thích hay hướng dẫn xử lý tiếp theo"
        ]
      },
      {
        "id": "UX_DES-CV-01",
        "role": "UX Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong dự án em ghi trên CV về việc Tái thiết kế trải nghiệm cốt lõi mang lại sự gia tăng rõ rệt về tỷ lệ hoàn thành tác vụ (Task Completion Rate) hoặc điểm hài lòng (CSAT): Hãy trình bày phương pháp đo lường trước và sau cải tiến, cùng các quyết định UX đóng vai trò quyết định?",
        "evaluationCriteria": [
          "Trình bày phương pháp đo lường Baseline (trước cải tiến) bằng Usability Testing và Analytics: đo Time-on-task, Success Rate, SUS score",
          "Nêu rõ các thay đổi UX cụ thể đã loại bỏ những điểm nghẽn then chốt nào trong hành trình người dùng",
          "Dẫn chứng kết quả định lượng: tăng Task Completion Rate từ 62% lên 88%, giảm 35% thời gian thực hiện tác vụ và điểm CSAT tăng từ 3.2 lên 4.6 sao"
        ],
        "followUps": [
          "Thách thức lớn nhất khi thu thập dữ liệu đo lường ở giai đoạn đầu dự án là gì?",
          "Làm thế nào để chứng minh sự cải thiện này đến từ thiết kế UX chứ không phải do chiến dịch marketing hay giảm giá?"
        ],
        "tags": [
          "CV Validation",
          "Task Completion Rate",
          "CSAT",
          "Quantitative Metrics",
          "UX Impact"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ nói chung chung là trải nghiệm tốt hơn nhưng không đưa ra được phương pháp đo lường hay số liệu đối chứng"
        ]
      },
      {
        "id": "UX_DES-CV-02",
        "role": "UX Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV của em có nhắc đến việc làm việc trong mô hình 'Product Trio' (gồm Product Manager, Tech Lead và UX Designer). Hãy chia sẻ một ví dụ thực tế trong dự án mà sự tham gia sớm của em từ giai đoạn Khám phá (Discovery) đã giúp đội ngũ tránh được một quyết định sai lầm?",
        "evaluationCriteria": [
          "Kể lại bối cảnh cụ thể: PM và Tech Lead dự định phát triển một tính năng phức tạp dựa trên giả định chủ quan",
          "Em chủ động thực hiện nghiên cứu khám phá nhanh hoặc thử nghiệm mẫu thử (Prototype testing) và phát hiện người dùng thực tế không hề có nhu cầu đó",
          "Đề xuất hướng tiếp cận tinh gọn hơn giải quyết đúng 'việc cần làm' (Jobs-to-be-Done), giúp team tiết kiệm hàng trăm giờ code lãng phí"
        ],
        "followUps": [
          "Khi Tech Lead nói phương án UX của em không khả thi về mặt kỹ thuật, em phối hợp tìm kiếm giải pháp dung hòa ra sao?",
          "Em đóng góp gì vào việc viết User Stories và Acceptance Criteria trong Sprint Planning?"
        ],
        "tags": [
          "Product Trio",
          "Product Discovery",
          "Jobs-to-be-Done",
          "Cross-functional Collaboration"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ nhận yêu cầu tính năng từ PM rồi về vẽ màn hình một cách thụ động mà không tham gia vào Discovery"
        ]
      },
      {
        "id": "UX_DES-CV-03",
        "role": "UX Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong một dự án thiết kế luồng Onboarding cho người dùng mới mà em từng đảm nhiệm: Em đã áp dụng chiến lược nào để rút ngắn 'Thời gian đạt giá trị' (Time-to-Value) giúp người dùng trải nghiệm được giá trị cốt lõi của sản phẩm nhanh nhất?",
        "evaluationCriteria": [
          "Loại bỏ các màn hình giới thiệu tính năng tĩnh vô bổ (Intro sliders dài dòng mà người dùng thường lướt qua nhanh)",
          "Thiết kế trải nghiệm Onboarding thực hành (Action-oriented onboarding): hướng dẫn người dùng hoàn thành một tác vụ nhỏ có ý nghĩa ngay lập tức",
          "Cá nhân hóa trải nghiệm bằng 1-2 câu hỏi thăm dò sở thích ban đầu để điều chỉnh nội dung hiển thị phù hợp ngay tại trang chủ"
        ],
        "followUps": [
          "Làm thế nào để đo lường tỷ lệ kích hoạt người dùng (Activation Rate) sau khi hoàn tất Onboarding?",
          "Cách xử lý cho phép người dùng bỏ qua (Skip) bước hướng dẫn nếu họ muốn tự khám phá?"
        ],
        "tags": [
          "Onboarding UX",
          "Time-to-Value",
          "Activation Rate",
          "Progressive Disclosure"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thiết kế 10 màn hình hướng dẫn dài dòng bắt người dùng phải đọc hết trước khi được dùng app"
        ]
      },
      {
        "id": "UX_DES-CV-04",
        "role": "UX Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "CV của em có đề cập đến kinh nghiệm chủ trì các buổi Usability Testing. Hãy mô tả chi tiết một lần mà kết quả thử nghiệm người dùng đảo ngược hoàn toàn giả định ban đầu của em và team thiết kế? Em đã điều chỉnh sản phẩm ra sao sau đó?",
        "evaluationCriteria": [
          "Thành thật chia sẻ trải nghiệm: nhóm tự tin một giải pháp thiết kế là rất thông minh và trực quan",
          "Khi thử nghiệm trên 5 người dùng thật, cả 5 người đều hiểu sai biểu tượng hoặc không tìm thấy nút hành động chính",
          "Em đã không bao biện; nhanh chóng ghi nhận insights, tổ chức buổi phân tích cùng PM và dev để vẽ lại giải pháp đơn giản hơn"
        ],
        "followUps": [
          "Em làm thế nào để truyền đạt kết quả kiểm thử tiêu cực này cho các bên liên quan mà không làm họ nản lòng?",
          "Sau khi sửa đổi, kết quả re-test với người dùng mới đạt được như thế nào?"
        ],
        "tags": [
          "Usability Testing Failure",
          "Humility",
          "Design Iteration",
          "User Feedback"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khăng khăng cho rằng người dùng thử nghiệm 'dốt' hoặc không hiểu công nghệ nên mới không biết dùng"
        ]
      },
      {
        "id": "UX_DES-CV-05",
        "role": "UX Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Khi thiết kế cho một hệ thống phần mềm nghiệp vụ B2B hoặc SaaS chuyên sâu với các luồng công việc phức tạp nhiều tầng: Làm thế nào em giải quyết bài toán cân bằng giữa Tính dễ sử dụng cho người mới (Learnability) và Tốc độ xử lý tác vụ cho chuyên gia sử dụng hàng ngày (Efficiency)?",
        "evaluationCriteria": [
          "Cung cấp hai tầng trải nghiệm: Luồng mặc định rõ ràng, có gợi ý cho người dùng mới; hệ thống phím tắt (Keyboard Shortcuts) và thao tác hàng loạt (Bulk Actions) cho người dùng chuyên nghiệp",
          "Hỗ trợ tính năng tùy biến không gian làm việc (Customizable Views, saved filters) để nhân sự chuyên nghiệp thao tác với tốc độ cao",
          "Thiết kế các mẫu nhập liệu nhanh (Quick Add modal) mà không cần chuyển trang"
        ],
        "followUps": [
          "Làm thế nào để đo lường sự thành thạo của người dùng theo thời gian sử dụng sản phẩm?",
          "Cách thiết kế tài nguyên tài liệu hướng dẫn (In-app Documentation / Tooltips) hỗ trợ người mới mà không gây vướng mắt cho chuyên gia?"
        ],
        "tags": [
          "B2B SaaS UX",
          "Learnability vs Efficiency",
          "Power Users",
          "Keyboard Shortcuts",
          "Customization"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Cố gắng đơn giản hóa quá mức khiến các thao tác chuyên sâu của người dùng chuyên nghiệp bị chậm chạp và phiền toái"
        ]
      },
      {
        "id": "UX_DES-BEHAV-01",
        "role": "UX Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi có sự xung đột giữa Mục tiêu kinh doanh ngắn hạn của PM (muốn thu thập thêm số điện thoại và email ở ngay màn hình đầu tiên) và Trải nghiệm người dùng (gây ma sát lớn, làm giảm tỷ lệ đăng ký), em xử lý tình huống giao tiếp và ra quyết định như thế nào?",
        "evaluationCriteria": [
          "Tôn trọng mục tiêu kinh doanh của PM: hiểu rõ vì sao marketing cần dữ liệu liên hệ để nuôi dưỡng khách hàng tiềm năng",
          "Đưa ra bằng chứng phân tích tâm lý: đòi hỏi thông tin quá sớm khi chưa xây dựng được niềm tin sẽ làm tăng tỷ lệ bỏ rơi lên gấp đôi",
          "Đề xuất phương án thỏa hiệp thông minh (Progressive Profiling): cho phép người dùng trải nghiệm trước, chỉ yêu cầu để lại email khi họ muốn lưu lại kết quả hoặc nhận ưu đãi"
        ],
        "followUps": [
          "Nếu PM vẫn muốn thử phương án ép người dùng nhập thông tin, em có đồng ý chạy A/B Testing để dữ liệu quyết định không?",
          "Cách bảo vệ danh tiếng của sản phẩm lâu dài trước các chiêu trò tăng trưởng nóng (Growth Hacking) phản tác dụng?"
        ],
        "tags": [
          "Business vs UX",
          "Progressive Profiling",
          "Data-driven Decision",
          "Friction Management"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chống đối gay gắt theo kiểu 'Tôi là UX, tôi bảo vệ người dùng, các anh chỉ biết kiếm tiền' gây chia rẽ team"
        ]
      },
      {
        "id": "UX_DES-BEHAV-02",
        "role": "UX Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi UI Designer trong nhóm tự ý thay đổi cấu trúc luồng hoặc vị trí các nút chức năng trong bản vẽ chi tiết mà không thảo luận trước với em (làm sai lệch ý đồ trải nghiệm và kịch bản giảm ma sát), em trao đổi với đồng nghiệp như thế nào?",
        "evaluationCriteria": [
          "Chủ động hẹn một buổi trò chuyện trực tiếp 1-1 với thái độ cởi mở, lắng nghe góc nhìn thẩm mỹ hoặc kỹ thuật của UI Designer",
          "Giải thích cơ sở nghiên cứu và lý do tại sao các thành phần được bố trí ở vị trí đó trong Wireframe ban đầu (dựa trên hành trình và thói quen quét mắt của người dùng)",
          "Cùng nhau tìm kiếm giải pháp chung: vừa đảm bảo giao diện đẹp mắt, thẩm mỹ cao vừa giữ trọn vẹn cấu trúc luồng tối ưu"
        ],
        "followUps": [
          "Làm thế nào để xây dựng quy trình phối hợp nhịp nhàng giữa UX Designer và UI Designer trong cùng một dự án?",
          "Khi hai bên không tìm được tiếng nói chung, ai sẽ là người đưa ra quyết định cuối cùng?"
        ],
        "tags": [
          "UX vs UI Collaboration",
          "Interpersonal Communication",
          "Empathy",
          "Role Boundaries"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ trích đồng nghiệp trước mặt toàn team hoặc âm thầm mang sự bực tức trong người"
        ]
      },
      {
        "id": "UX_DES-BEHAV-03",
        "role": "UX Designer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong các buổi họp định kỳ của công ty, đội ngũ kỹ sư và kinh doanh thường xem nhẹ các vấn đề về 'Nợ trải nghiệm' (UX Debt) và chỉ ưu tiên các tính năng mới kiếm ra tiền. Em làm thế nào để truyền thông và đưa các hạng mục UX Debt vào kế hoạch phát triển (Sprint Roadmap)?",
        "evaluationCriteria": [
          "Quy đổi UX Debt sang ngôn ngữ kinh doanh: giải thích việc giao diện khó dùng dẫn đến tăng chi phí vận hành cho tổng đài chăm sóc khách hàng và giảm tỷ lệ giữ chân khách hàng (Retention)",
          "Ghi nhận và đo lường UX Debt một cách minh bạch trong Jira backlog bằng các điểm số ảnh hưởng cụ thể",
          "Thương lượng với PM dành ra một tỷ lệ cố định (vd: 15-20% dung lượng mỗi Sprint) để giải quyết các khoản nợ kỹ thuật và nợ trải nghiệm"
        ],
        "followUps": [
          "Làm thế nào để tạo một 'Bug Bash' hoặc 'UX Fix Week' để toàn công ty cùng chung tay dọn dẹp các lỗi vặt trải nghiệm?",
          "Cách vinh danh những đóng góp cải thiện trải nghiệm nhỏ nhưng mang lại giá trị lớn cho người dùng?"
        ],
        "tags": [
          "UX Debt",
          "Roadmap Prioritization",
          "Business Value of UX",
          "Advocacy"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Than vãn rằng công ty không coi trọng UX nhưng không bao giờ chứng minh được tác động tài chính của UX Debt"
        ]
      },
      {
        "id": "UX_DES-BEHAV-04",
        "role": "UX Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em tham gia bảo vệ một giải pháp thiết kế trải nghiệm mới trước Ban giám đốc và các Trưởng bộ phận, nhưng một Giám đốc cấp cao đưa ra ý kiến phản bác gay gắt dựa trên thói quen cá nhân của chính họ ('Tôi dùng tôi thấy không thích'). Em xử lý tình huống thuyết trình này thế nào?",
        "evaluationCriteria": [
          "Tôn trọng ý kiến của lãnh đạo: cảm ơn đóng góp và ghi nhận góc nhìn của sếp với tư cách một trường hợp sử dụng cá biệt",
          "Nhẹ nhàng nhắc lại: 'Chúng ta đang thiết kế sản phẩm cho tệp khách hàng mục tiêu là [Persona cụ thể]', và trình bày các dữ liệu thực tế từ các bài kiểm tra người dùng và số liệu phân tích",
          "Đề xuất thử nghiệm khách quan: 'Để đảm bảo chắc chắn, em đề xuất đưa cả hai phương án vào A/B testing nhỏ để xem khách hàng thực tế phản ứng thế nào'"
        ],
        "followUps": [
          "Làm thế nào để không biến buổi phản biện thiết kế thành cuộc tranh luận ai có quyền lực cao hơn trong công ty?",
          "Kỹ năng kể chuyện (Storytelling) giúp bảo vệ giải pháp UX thuyết phục ra sao?"
        ],
        "tags": [
          "HiPPO Effect",
          "Executive Stakeholder",
          "Data Defense",
          "Storytelling in UX"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cãi nhau với sếp hoặc ngay lập tức vứt bỏ toàn bộ kết quả nghiên cứu khoa học để làm theo ý thích cá nhân của sếp"
        ]
      },
      {
        "id": "UX_DES-BEHAV-05",
        "role": "UX Designer",
        "category": "behavioral",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Khi em phải tiếp nhận một dự án dở dang từ một UX Designer khác vừa nghỉ việc, với hệ thống tài liệu sơ sài, wireframes lộn xộn và nhiều quyết định thiết kế không có ghi chú lý do. Em bắt đầu tiếp quản và sắp xếp lại công việc ra sao?",
        "evaluationCriteria": [
          "Giữ thái độ chuyên nghiệp, không phán xét hay trách móc người tiền nhiệm",
          "Chủ động lên lịch phỏng vấn nhanh với PM, Tech Lead và các bên liên quan để nắm bắt bối cảnh kinh doanh, mục tiêu và những gì đã được thống nhất",
          "Rà soát lại toàn bộ file thiết kế, dọn dẹp và bổ sung tài liệu giải thích (Design Rationale) cho các quyết định then chốt trước khi bắt tay vào làm việc mới"
        ],
        "followUps": [
          "Làm thế nào để nhanh chóng nắm bắt được tâm tư và nỗi đau của người dùng trong một lĩnh vực nghiệp vụ mà em chưa từng có kinh nghiệm?",
          "Cách lập kế hoạch bàn giao (Handoff Documentation) chuẩn mực cho chính bản thân em sau này?"
        ],
        "tags": [
          "Project Onboarding",
          "Design Rationale",
          "Handover Management",
          "Adaptability"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Xóa bỏ toàn bộ công sức của người trước để vẽ lại từ đầu theo ý mình mà không hiểu lý do vì sao họ làm vậy"
        ]
      }
    ]
  },
  {
    "role": "UX Researcher",
    "group": "productUX",
    "groupLabel": "Thiết kế Sản phẩm & UX",
    "aliases": [
      "ux researcher",
      "user researcher",
      "nghien cuu nguoi dung",
      "chuyen vien nghien cuu ux"
    ],
    "questions": [
      {
        "id": "UX_RES-FOUND-01",
        "role": "UX Researcher",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong UX Researcher, phân biệt Generative Research, Evaluative Research, Double Diamond, Research Framework; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Generative Research.",
          "Phân biệt được các khái niệm liên quan Evaluative Research, Double Diamond, Research Framework ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí UX Researcher."
        ],
        "followUps": [
          "Nếu mới học Generative Research, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Generative Research",
          "Evaluative Research",
          "Double Diamond",
          "Research Framework",
          "Problem Space"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "UX_RES-FOUND-02",
        "role": "UX Researcher",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Mô hình phối hợp Nghiên cứu Định tính (Qualitative) và Định lượng (Quantitative) trong UX: Dữ liệu định tính trả lời câu hỏi 'Tại sao / Như thế nào' (Why/How), trong khi định lượng trả lời câu hỏi 'Cái gì / Bao nhiêu' (What/How much) ra sao? Trình bày phương pháp Tam giác giác ngộ (Triangulation)?",
        "evaluationCriteria": [
          "Định lượng chỉ ra vị trí và quy mô vấn đề (vd: 40% người dùng bỏ dở ở bước 2 trên Google Analytics)",
          "Định tính đi sâu vào tìm nguyên nhân gốc rễ thông qua quan sát và phỏng vấn trực tiếp (vd: người dùng bỏ dở vì không hiểu thuật ngữ pháp lý)",
          "Triangulation (Tam giác đan xen): kết hợp ít nhất 3 nguồn dữ liệu độc lập (Analytics, Phỏng vấn, Nhật ký hành vi) để loại trừ sai số và kiểm chứng chéo kết luận"
        ],
        "followUps": [
          "Cỡ mẫu (Sample Size) cần thiết cho nghiên cứu định lượng khác biệt thế nào so với định tính (5-8 người)?",
          "Khi dữ liệu định tính mâu thuẫn trực tiếp với số liệu định lượng, em tiếp cận phân tích thế nào?"
        ],
        "tags": [
          "Qualitative vs Quantitative",
          "Triangulation",
          "Sample Size",
          "Mixed Methods",
          "Root Cause Analysis"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://dovetail.com/research-methodology/"
        ],
        "redFlags": [
          "Chỉ tin vào số liệu định lượng và bỏ qua hoàn toàn việc lắng nghe cảm xúc, suy nghĩ thực tế của người dùng"
        ]
      },
      {
        "id": "UX_RES-FOUND-03",
        "role": "UX Researcher",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Các thiên kiến tâm lý học (Cognitive Biases) phổ biến làm sai lệch kết quả nghiên cứu: Thiên kiến xác nhận (Confirmation Bias), Thiên kiến mong muốn xã hội (Social Desirability Bias), và Hiệu ứng Hawthorne. UX Researcher kiểm soát các thiên kiến này như thế nào trong quá trình phỏng vấn?",
        "evaluationCriteria": [
          "Confirmation Bias: Người phỏng vấn chỉ chú ý lắng nghe những gì khớp với giả định có sẵn của mình; kiểm soát bằng cách ghi chép trung thực và nhờ người thứ hai mã hóa dữ liệu độc lập",
          "Social Desirability Bias: Người tham gia cố tình trả lời để tỏ ra thông minh, lịch sự hoặc làm hài lòng người hỏi; kiểm soát bằng cách cam kết ẩn danh và khẳng định 'không có câu trả lời nào là sai'",
          "Hawthorne Effect: Người tham gia thay đổi hành vi khi biết mình đang bị quan sát; kiểm soát bằng cách tạo không khí tự nhiên và dành thời gian khởi động làm tan biến căng thẳng"
        ],
        "followUps": [
          "Kỹ thuật 'Hồi tưởng sự việc gần nhất' (Recent Incident Technique) giúp loại bỏ thiên kiến nhớ lại (Recall Bias) ra sao?",
          "Tại sao không bao giờ nên hỏi người dùng về hành vi giả định trong tương lai ('Bạn có dùng tính năng này không?')?"
        ],
        "tags": [
          "Cognitive Biases",
          "Confirmation Bias",
          "Hawthorne Effect",
          "Social Desirability",
          "Research Rigor"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Dẫn dắt người tham gia thừa nhận ý kiến cá nhân của nhà nghiên cứu trong suốt buổi phỏng vấn"
        ]
      },
      {
        "id": "UX_RES-FOUND-04",
        "role": "UX Researcher",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Thang đo khả năng sử dụng hệ thống (System Usability Scale - SUS): Cấu trúc 10 câu hỏi đan xen tích cực/tiêu cực của bảng hỏi SUS, cách tính điểm chuẩn hóa từ 0 đến 100, và ý nghĩa của mốc 68 điểm tiêu chuẩn (Industry Average Benchmark)?",
        "evaluationCriteria": [
          "Bảng hỏi gồm 10 câu trắc nghiệm theo thang đo Likert 5 điểm, đan xen xen kẽ câu chẵn tiêu cực và câu lẻ tích cực để chống thói quen chọn bừa",
          "Công thức tính điểm: câu lẻ trừ 1, câu chẵn lấy 5 trừ điểm; cộng tổng tất cả nhân với 2.5 để ra thang điểm 0-100",
          "Mốc 68 điểm là mức trung bình của ngành; trên 80 điểm là xuất sắc (Hạng A), dưới 50 điểm là mức báo động nguy hiểm về khả năng sử dụng"
        ],
        "followUps": [
          "Tại sao điểm SUS không phải là tỷ lệ phần trăm (%) mà là điểm phân vị chuẩn hóa?",
          "Phân biệt giữa SUS với Net Promoter Score (NPS) và Customer Effort Score (CES)?"
        ],
        "tags": [
          "System Usability Scale",
          "SUS Benchmark",
          "Likert Scale",
          "Standardized Usability",
          "NPS vs SUS"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Hiểu sai điểm SUS 68 là 68% và cho rằng 68% là điểm số kém cỏi"
        ]
      },
      {
        "id": "UX_RES-FOUND-05",
        "role": "UX Researcher",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Phân biệt giữa Chân dung người dùng giả định (Proto-Persona) và Chân dung người dùng dựa trên nghiên cứu thực chứng (Research-backed Persona). Cấu trúc của một Persona chuẩn gồm những thông tin nào để đội ngũ kỹ thuật và sản phẩm có thể thấu cảm?",
        "evaluationCriteria": [
          "Proto-Persona xây dựng dựa trên giả định và kinh nghiệm nội bộ của team sản phẩm khi chưa có ngân sách nghiên cứu",
          "Research-backed Persona được tổng hợp từ dữ liệu nghiên cứu thực tế với người dùng thật, có bằng chứng trích dẫn rõ ràng",
          "Cấu trúc chuẩn: Bối cảnh nhân khẩu học phù hợp, Động lực cốt lõi (Motivations), Mục tiêu tác vụ (Goals), Nỗi đau/Rào cản (Pain points/Frustrations), và Trích dẫn lời nói tiêu biểu (Representative Quotes)"
        ],
        "followUps": [
          "Tại sao việc thêm thắt các chi tiết nhân khẩu học vô nghĩa (sở thích xem phim, nuôi mèo) vào persona lại gây xao nhãng?",
          "Khái niệm 'Job Story' hoặc 'Jobs-to-be-Done (JTBD)' bổ trợ cho Persona như thế nào?"
        ],
        "tags": [
          "User Persona",
          "Proto-Persona",
          "Empathy Map",
          "JTBD",
          "Research Synthesis"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Vẽ persona hoàn toàn từ trí tưởng tượng và gắn ảnh người mẫu trên mạng mà không dựa trên bất kỳ dữ liệu nghiên cứu nào"
        ]
      },
      {
        "id": "UX_RES-FOUND-06",
        "role": "UX Researcher",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Phương pháp Quản trị kho tri thức nghiên cứu (Research Repository & Atomic Research): Khái niệm phân rã dữ liệu thành 4 tầng: Thí nghiệm (Experiments) -> Dữ liệu thực tế (Facts/Observations) -> Đúc kết hiểu biết (Insights) -> Kết luận/Hành động (Conclusions/Recommendations). Lợi ích của mô hình này trong việc tái sử dụng tri thức tổ chức?",
        "evaluationCriteria": [
          "Atomic Research phân nhỏ các báo cáo cồng kềnh thành các đơn vị thông tin nguyên tử độc lập (Facts, Insights, Recommendations)",
          "Giúp các nghiên cứu không bị lãng quên trong các file PDF/slide sau khi dự án kết thúc",
          "Cho phép các Product Managers tìm kiếm nhanh các insights liên quan đến một chủ đề cụ thể (như 'thanh toán', 'tìm kiếm') qua nhiều dự án nghiên cứu khác nhau trong lịch sử"
        ],
        "followUps": [
          "Công cụ nào (Dovetail, Notion, EnjoyHQ) em áp dụng để tổ chức Research Repository?",
          "Làm thế nào để gắn thẻ (Tagging Taxonomy) đồng nhất giữa nhiều nhà nghiên cứu trong cùng công ty?"
        ],
        "tags": [
          "Atomic Research",
          "Research Repository",
          "Dovetail",
          "Knowledge Management",
          "Insight Longevity"
        ],
        "sourceRefs": [
          "https://dovetail.com/research-methodology/"
        ],
        "redFlags": [
          "Viết các báo cáo nghiên cứu dạng slide dài 80 trang và cất vào Google Drive không bao giờ mở lại"
        ]
      },
      {
        "id": "UX_RES-SKILL-01",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Semi-structured Interview (Interview Guide, Probing Techniques, Funnel Questioning, Active Listening) cho UX Researcher: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Semi-structured Interview trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Semi-structured Interview",
          "Interview Guide",
          "Probing Techniques",
          "Funnel Questioning",
          "Active Listening"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://dovetail.com/research-methodology/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "UX_RES-SKILL-02",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập UX Researcher: dựa trên Leading Questions, phối hợp Neutral Questioning, Open-ended Questions, Interview Moderation; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Leading Questions trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Leading Questions",
          "Neutral Questioning",
          "Open-ended Questions",
          "Interview Moderation"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "UX_RES-SKILL-03",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Quy trình Phân tích chuyên đề (Thematic Analysis) và Lập bản đồ đồng thuận (Affinity Mapping): Từ 15 giờ băng ghi âm phỏng vấn, em thực hiện quá trình gán nhãn mã hóa (Coding), gom cụm dữ liệu (Clustering), và trích xuất các chủ đề hiểu biết then chốt (Themes/Insights) như thế nào?",
        "evaluationCriteria": [
          "Bước 1: Nghe lại và bóc tách từng phát ngôn quan trọng thành các thẻ ghi chú nguyên tử (Atomic observations / Quotes)",
          "Bước 2: Gán mã (Inductive Coding: gán nhãn chủ đề dựa trên nội dung thực tế)",
          "Bước 3: Gom cụm Affinity Diagramming trên Miro/FigJam để tìm ra các mẫu hành vi lặp lại (Patterns) giữa nhiều người dùng khác nhau",
          "Bước 4: Đúc kết thành các Insights có giá trị hành động (Actionable Insights) kèm theo trích dẫn chứng cứ rõ ràng"
        ],
        "followUps": [
          "Làm thế nào để tránh việc gom nhóm dựa trên phỏng đoán chủ quan của bản thân thay vì bằng chứng thực tế?",
          "Sự khác biệt giữa một 'Dữ kiện quan sát' (Fact) và một 'Hiểu biết sâu sắc' (Insight)?"
        ],
        "tags": [
          "Thematic Analysis",
          "Affinity Mapping",
          "Inductive Coding",
          "Insight Generation",
          "Miro / FigJam"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://dovetail.com/research-methodology/"
        ],
        "redFlags": [
          "Chỉ trích xuất một vài câu trích dẫn lẻ loi hợp ý mình mà không thực hiện phân tích đối chiếu hệ thống"
        ]
      },
      {
        "id": "UX_RES-SKILL-04",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Quy trình Tuyển chọn đối tượng tham gia nghiên cứu (Participant Recruiting): Em thiết kế Bảng câu hỏi sàng lọc (Screener Survey) như thế nào để chọn đúng đối tượng mục tiêu, loại bỏ những người tham gia chuyên nghiệp (Professional testers) và người trả lời bừa để nhận quà?",
        "evaluationCriteria": [
          "Xác định rõ ràng Tiêu chí bắt buộc (Inclusion criteria) và Tiêu chí loại trừ (Exclusion criteria)",
          "Sử dụng câu hỏi bẫy (Red Herring questions / Foil questions) để phát hiện người trả lời gian lận (vd: hỏi về một thương hiệu hoàn toàn bịa đặt)",
          "Loại bỏ những người làm việc trong ngành thiết kế, nghiên cứu thị trường, lập trình hoặc nhân viên của các đối thủ cạnh tranh trực tiếp"
        ],
        "followUps": [
          "Làm thế nào để tuyển được người dùng khó tính hoặc người dùng thuộc nhóm thiểu số khó tiếp cận (Hard-to-reach users)?",
          "Quy trình xin phép thu thập dữ liệu (Informed Consent) và bảo vệ dữ liệu cá nhân theo quy định pháp luật (Nghị định 13 / GDPR)?"
        ],
        "tags": [
          "Participant Recruiting",
          "Screener Survey",
          "Inclusion Criteria",
          "Informed Consent",
          "Ethics"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Nhờ người quen trong công ty hoặc bạn bè thân thiết làm đối tượng nghiên cứu thay vì khách hàng thật"
        ]
      },
      {
        "id": "UX_RES-SKILL-05",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Thiết kế và triển khai Nghiên cứu Nhật ký hành vi (Diary Study): Khi nghiên cứu hành vi tài chính cá nhân hoặc thói quen ăn uống kéo dài trong 2 tuần, em thiết kế cấu trúc ghi nhật ký, kích hoạt nhắc nhở (Prompts) và phỏng vấn kết thúc (Exit Interview) ra sao?",
        "evaluationCriteria": [
          "Xác định tần suất ghi: Event-based (ghi mỗi khi phát sinh giao dịch chi tiêu) hoặc Time-based (ghi tổng kết mỗi tối)",
          "Tối ưu công cụ ghi nhật ký trên thiết bị di động (Google Forms, ứng dụng tin nhắn) đơn giản, nhanh chóng dưới 3 phút để chống tỷ lệ bỏ dở",
          "Thực hiện phỏng vấn Exit Interview sau 14 ngày để đào sâu vào các ghi chép bất thường và kiểm chứng lại sự thay đổi hành vi"
        ],
        "followUps": [
          "Làm thế nào để duy trì tỷ lệ tham gia tích cực (Retention rate) của đối tượng trong suốt 14 ngày nghiên cứu?",
          "Phương pháp phân tích lượng dữ liệu nhật ký đa phương tiện (chữ, ảnh chụp màn hình, hóa đơn) đồ sộ?"
        ],
        "tags": [
          "Diary Study",
          "Longitudinal Research",
          "Behavioral Habits",
          "In-situ Research",
          "Exit Interview"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Yêu cầu người dùng viết bài luận dài mỗi ngày khiến 80% người tham gia bỏ dở nghiên cứu sau ngày thứ 3"
        ]
      },
      {
        "id": "UX_RES-SKILL-06",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Phương pháp Thử nghiệm phân loại thẻ (Card Sorting) và Kiểm thử cấu trúc cây (Tree Testing) định lượng: Em phân tích ma trận tương đồng (Similarity Matrix), sơ đồ phân nhánh (Dendrogram), và tỷ lệ tìm thấy trực tiếp (Directness) trong Treejack như thế nào để chứng minh cấu trúc menu mới vượt trội hơn cấu trúc cũ?",
        "evaluationCriteria": [
          "Đọc hiểu Dendrogram: xác định ngưỡng đồng thuận (Agreed threshold) của các cụm nhóm nội dung trong Card Sorting",
          "Trong Tree Testing: theo dõi chỉ số Success Rate (tỷ lệ chọn đúng điểm đến) và Directness (tỷ lệ đi thẳng tới đích mà không bị quay lui/backtrack)",
          "So sánh trực tiếp điểm số Benchmark trước và sau cải tiến để chứng minh bằng số liệu cấu trúc IA mới giúp người dùng tìm kiếm nhanh hơn"
        ],
        "followUps": [
          "Khi kết quả Tree Testing cho thấy tỷ lệ rẽ nhầm nhánh ở một danh mục lên tới 40%, các bước điều tra chữ nghĩa nhãn (Labeling) diễn ra sao?",
          "Cỡ mẫu tối thiểu cho một bài kiểm thử Tree Testing định lượng đáng tin cậy là bao nhiêu?"
        ],
        "tags": [
          "Card Sorting",
          "Tree Testing",
          "Dendrogram",
          "Directness",
          "Information Architecture Metrics"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Thay đổi toàn bộ menu chỉ dựa trên ý kiến của một vài người mà không kiểm chứng bằng Tree Testing"
        ]
      },
      {
        "id": "UX_RES-SKILL-07",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Thiết kế Khảo sát định lượng trên diện rộng (Survey Design): Em viết câu hỏi, lựa chọn thang đo (Likert, Semantic Differential) và kiểm soát thiên kiến đặt thứ tự câu hỏi (Order Bias) ra sao để thu về dữ liệu chất lượng cao từ 500+ phản hồi?",
        "evaluationCriteria": [
          "Giới hạn thời lượng khảo sát dưới 5-7 phút để giảm tỷ lệ bỏ dở giữa chừng (Survey Fatigue)",
          "Tránh các câu hỏi kép (Double-barreled questions: 'Bạn thấy sản phẩm này nhanh và đẹp như thế nào?')",
          "Xáo trộn ngẫu nhiên thứ tự các câu trả lời (Randomize answer options) để loại trừ thiên kiến ưu tiên lựa chọn đầu tiên"
        ],
        "followUps": [
          "Làm thế nào để tính toán cỡ mẫu cần thiết dựa trên độ tin cậy 95% và sai số cho phép 5%?",
          "Phương pháp lọc sạch dữ liệu rác (Data Cleaning: loại bỏ Straight-liners chọn 1 đáp án từ đầu đến cuối, người hoàn thành quá nhanh)?"
        ],
        "tags": [
          "Survey Design",
          "Likert Scale",
          "Survey Fatigue",
          "Double-barreled Questions",
          "Data Cleaning"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Thiết kế khảo sát 40 câu hỏi vừa dài vừa hỏi dồn hai ý trong một câu khiến dữ liệu thu về bị rác"
        ]
      },
      {
        "id": "UX_RES-SKILL-08",
        "role": "UX Researcher",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Truyền thông kết quả nghiên cứu và Thúc đẩy hành động (Research Storytelling & Activation): Em trình bày báo cáo nghiên cứu như thế nào (kết hợp video highlight clips, trích dẫn âm thanh, workshop đồng sáng tạo) để biến insights thành quyết định cụ thể của Product Roadmap thay vì tài liệu chết?",
        "evaluationCriteria": [
          "Thay vì đọc slide chữ dài dòng, trình bày theo dạng Kể chuyện trải nghiệm: nêu rõ Nỗi đau -> Tác động kinh doanh -> Bằng chứng video/audio người dùng thật -> Đề xuất hành động",
          "Trích xuất các đoạn video ngắn (Video Highlight Clips 30-45 giây) quay lại khoảnh khắc người dùng vấp ngã để tạo cú sốc thấu cảm trực diện cho các sếp",
          "Tổ chức Ideation Workshop mời cả PM, Tech Lead và Designers cùng tham gia chuyển hóa từng insight thành các giải pháp khả thi"
        ],
        "followUps": [
          "Làm thế nào để theo dõi tỷ lệ các khuyến nghị nghiên cứu được hiện thực hóa trong sản phẩm (Research Adoption Rate)?",
          "Cách xử lý khi một Insight quan trọng bị PM từ chối đưa vào roadmap vì hạn chế về nguồn lực?"
        ],
        "tags": [
          "Research Storytelling",
          "Video Clips",
          "Ideation Workshop",
          "Research Activation",
          "Impact Tracking"
        ],
        "sourceRefs": [
          "https://dovetail.com/research-methodology/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ gửi file báo cáo qua email rồi không bao giờ theo dõi xem team có thực hiện theo khuyến nghị hay không"
        ]
      },
      {
        "id": "UX_RES-SCEN-01",
        "role": "UX Researcher",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại UX Researcher, khi Discovery Research Plan cùng Greenfield Product, Desk Research, Financial Habits, Ideation Workshop xuất hiện và người tham gia thử nghiệm không hoàn thành được tác vụ chính, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong UX Researcher.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Discovery Research Plan",
          "Greenfield Product",
          "Desk Research",
          "Financial Habits",
          "Ideation Workshop"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "UX_RES-SCEN-02",
        "role": "UX Researcher",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Một bài kiểm tra khả năng sử dụng (Usability Testing) với 6 người dùng cho thấy: 5/6 người dùng không thể tìm thấy tính năng 'Quét mã QR để thanh toán' vì icon bị hòa lẫn vào hình nền trang chủ. Nhưng Giám đốc Marketing khẳng định hình nền này là cốt lõi của chiến dịch quảng cáo và không được phép sửa. Em giải quyết xung đột này như thế nào?",
        "evaluationCriteria": [
          "Cắt các đoạn video clip ghi lại cảnh 5 khách hàng loay hoay, bực bội tìm nút quét QR trong 2 phút và bấm nhầm sang các tính năng khác",
          "Trình bày tại buổi họp ngắn: không công kích thiết kế marketing, chỉ chiếu video thực tế để các bên tự cảm nhận nỗi đau của khách hàng",
          "Đưa ra giải pháp dung hòa: giữ nguyên hình nền chiến dịch marketing nhưng bổ sung một lớp phủ mờ (Scrim/Backdrop) hoặc tách nút QR thành Floating Action Button nổi bật độc lập trên nền"
        ],
        "followUps": [
          "Tại sao bằng chứng trực quan bằng video của người dùng thật luôn có sức nặng thuyết phục gấp 10 lần lời nói của nhà nghiên cứu?",
          "Làm thế nào để duy trì mối quan hệ hợp tác tốt đẹp với Marketing sau khi phản biện chiến dịch của họ?"
        ],
        "tags": [
          "Stakeholder Conflict",
          "Video Evidence",
          "Empathy Building",
          "Marketing vs Usability"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tranh cãi tay đôi gay gắt với Giám đốc Marketing bằng lý thuyết sách vở mà không đưa ra bằng chứng video thực tế"
        ]
      },
      {
        "id": "UX_RES-SCEN-03",
        "role": "UX Researcher",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Đội ngũ Product Manager muốn tung ra một tính năng gây tranh cãi (hiển thị thông báo giục giã mua hàng dạng pop-up đếm ngược 'Chỉ còn 2 phút'). Họ tin rằng nó sẽ tăng doanh số ngắn hạn. Em thiết kế một nghiên cứu đo lường Tác động tâm lý tiêu cực và Niềm tin thương hiệu (Brand Trust) ra sao để chứng minh tính hai mặt của tính năng này?",
        "evaluationCriteria": [
          "Thiết kế nghiên cứu hỗn hợp: A/B Testing đo lường tỷ lệ mua hàng tức thời đồng thời theo dõi tỷ lệ Unsubscribe và tỷ lệ xóa app trong 30 ngày tiếp theo",
          "Thực hiện Usability Testing kết hợp đo lường mức độ căng thẳng tâm lý (Perceived Pressure) và cảm nhận về độ tin cậy của thương hiệu",
          "Chỉ ra số liệu: pop-up có thể tăng 3% doanh số hôm nay nhưng làm giảm 15% chỉ số giữ chân khách hàng (Retention) và tăng gấp đôi số lượng khiếu nại CS"
        ],
        "followUps": [
          "Khái niệm 'Cognitive Strain' (Căng thẳng nhận thức) ảnh hưởng đến quyết định trung thành dài hạn của khách hàng ra sao?",
          "Cách trình bày số liệu để ban giám đốc hiểu được giá trị của Giá trị vòng đời khách hàng (Customer Lifetime Value) thay vì doanh thu tức thời?"
        ],
        "tags": [
          "Urgency Patterns",
          "Brand Trust",
          "Cognitive Strain",
          "Retention Impact",
          "Ethical Research"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Chỉ trích PM là vô đạo đức mà không đưa ra được bất kỳ số liệu đo lường tác hại kinh doanh cụ thể nào"
        ]
      },
      {
        "id": "UX_RES-SCEN-04",
        "role": "UX Researcher",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Khi tiến hành phỏng vấn sâu với khách hàng B2B là các giám đốc tài chính bận rộn, họ chỉ có tối đa 20 phút và trả lời rất ngắn gọn, khô khan, mang tính ngoại giao xã giao. Em áp dụng kỹ thuật phỏng vấn chuyên nghiệp nào để phá vỡ lớp vỏ phòng thủ và khai thác được những khó khăn nội bộ thực sự của họ?",
        "evaluationCriteria": [
          "Bỏ qua các câu chào hỏi sáo rỗng; đi thẳng vào bài toán cụ thể mà họ đang quan tâm nhất trong ngày làm việc",
          "Hỏi về các câu chuyện sự cố cụ thể gần nhất thay vì hỏi chung chung: 'Lần gần nhất quy trình phê duyệt chi phí bị trễ hạn gây rắc rối cho anh/chị là khi nào?'",
          "Chia sẻ trước một insight ẩn danh từ một giám đốc tài chính khác trong cùng ngành để kích thích phản biện và sự đồng cảm"
        ],
        "followUps": [
          "Kỹ thuật 'Tỏ ra ngây thơ có mục đích' (Columbo Technique) giúp khai thác thông tin từ các chuyên gia cấp cao ra sao?",
          "Cách xử lý khéo léo khi đối tượng liên tục nhìn đồng hồ hoặc trả lời điện thoại giữa buổi phỏng vấn?"
        ],
        "tags": [
          "B2B Executive Interview",
          "Time-constrained Research",
          "Probing Executives",
          "Critical Incident"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tiếp tục đọc danh sách câu hỏi học thuật dài dòng khiến khách hàng mất kiên nhẫn và cắt ngắn buổi phỏng vấn"
        ]
      },
      {
        "id": "UX_RES-SCEN-05",
        "role": "UX Researcher",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Kết quả khảo sát diện rộng gửi qua email về sự hài lòng của ứng dụng đạt điểm rất cao (NPS = +65). Tuy nhiên, số liệu trên App Store lại có rất nhiều đánh giá 1 sao phàn nàn về lỗi thanh toán. Em giải thích hiện tượng nghịch lý này như thế nào và các bước điều tra bổ sung để tìm ra bức tranh sự thật?",
        "evaluationCriteria": [
          "Nhận diện Thiên kiến chọn mẫu (Sampling Bias / Non-response Bias): những người hài lòng và rảnh rỗi mới mở email trả lời khảo sát, trong khi người bị lỗi bực mình sẽ không thèm làm khảo sát mà lên thẳng App Store xả giận",
          "Rà soát lại quy trình phát khảo sát: khảo sát được gửi vào thời điểm nào (nếu gửi sau khi giao dịch thành công thì đã bỏ sót toàn bộ người giao dịch thất bại)",
          "Triển khai khảo sát kích hoạt theo ngữ cảnh (In-app Triggered Survey) ngay tại thời điểm xảy ra lỗi giao dịch để thu thập đúng tiếng nói của nhóm bị ảnh hưởng"
        ],
        "followUps": [
          "Làm thế nào để cân bằng tỷ lệ mẫu khảo sát để phản ánh đúng cơ cấu toàn thể người dùng?",
          "Cách phối hợp với đội ngũ Chăm sóc khách hàng (Customer Support) để phân loại ticket lỗi thanh toán?"
        ],
        "tags": [
          "Sampling Bias",
          "Non-response Bias",
          "NPS Paradox",
          "Survey Triggering",
          "Voice of Customer"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Tự mãn với con số NPS cao và cho rằng những đánh giá 1 sao trên App Store chỉ là do đối thủ cạnh tranh chơi xấu"
        ]
      },
      {
        "id": "UX_RES-SCEN-06",
        "role": "UX Researcher",
        "category": "scenario",
        "difficulty": "basic",
        "seniority": "junior",
        "question": "Tình huống: Một người tham gia trong buổi phỏng vấn người dùng tỏ ra quá hoạt ngôn và nói không ngừng về những chủ đề ngoài lề (kể chuyện gia đình, bình luận chính trị) làm cháy giáo án thời gian. Em điều phối khéo léo như thế nào để đưa họ quay trở lại chủ đề nghiên cứu mà không làm họ cảm thấy bị xúc phạm?",
        "evaluationCriteria": [
          "Lắng nghe gật đầu công nhận ngắn gọn một câu: 'Câu chuyện của anh/chị rất thú vị...'",
          "Khéo léo chuyển hướng câu chuyện bằng câu cầu nối: '...và điều này gợi cho em liên tưởng đến một ý quan trọng mà chúng ta vừa thảo luận về cách anh/chị dùng ứng dụng lúc nãy...'",
          "Nhắc lại thời lượng: 'Vì chúng ta chỉ còn 15 phút mà em rất muốn được lắng nghe góc nhìn quý giá của anh/chị về phần này, em xin phép chuyển sang câu hỏi tiếp theo nhé'"
        ],
        "followUps": [
          "Khi nào thì việc nói chuyện ngoài lề lại vô tình mang lại một insight bất ngờ về phong cách sống của người dùng?",
          "Cách xử lý khi người tham gia hoàn toàn im lặng và chỉ trả lời cộc lốc một từ 'Có' hoặc 'Không'?"
        ],
        "tags": [
          "Interview Facilitation",
          "Redirecting Talkative Users",
          "Time Management",
          "Rapport Building"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Cắt lời thô bạo hoặc cam chịu ngồi nghe chuyện phiếm suốt 1 tiếng mà không thu được thông tin nào cho dự án"
        ]
      },
      {
        "id": "UX_RES-CV-01",
        "role": "UX Researcher",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong dự án nghiên cứu người dùng độc lập mà em ghi trên CV: Hãy trình bày phương pháp luận nghiên cứu (Research Methodology), quy mô cỡ mẫu (Sample Size), insight bất ngờ nhất được phát hiện và tác động trực tiếp của nó đến việc thay đổi Roadmap sản phẩm?",
        "evaluationCriteria": [
          "Trình bày rõ ràng bài toán kinh doanh ban đầu và các câu hỏi nghiên cứu cốt lõi (Research Questions)",
          "Mô tả phương pháp lựa chọn (vd: phỏng vấn 12 người dùng sâu kết hợp khảo sát định lượng 300 mẫu)",
          "Chia sẻ insight then chốt làm thay đổi tư duy của Product Team và dẫn chứng tính năng mới được đưa vào roadmap dựa trên khuyến nghị đó"
        ],
        "followUps": [
          "Khó khăn lớn nhất trong khâu tuyển dụng người tham gia của dự án đó là gì?",
          "Nếu được làm lại dự án đó hôm nay, em sẽ thay đổi điều gì trong phương pháp tiếp cận?"
        ],
        "tags": [
          "CV Validation",
          "Research Methodology",
          "Insight Impact",
          "Product Roadmap",
          "Sample Size"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nói chung chung về việc phỏng vấn nhưng không nhớ rõ phương pháp, câu hỏi nghiên cứu hay tác động thực tế"
        ]
      },
      {
        "id": "UX_RES-CV-02",
        "role": "UX Researcher",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "CV của em có đề cập đến việc xây dựng Hệ thống kho lưu trữ nghiên cứu (Research Repository). Em đã cấu trúc cơ sở dữ liệu này như thế nào, và làm sao để đảm bảo các Product Managers và Designers chủ động tìm kiếm và sử dụng lại các insights đó hàng tuần?",
        "evaluationCriteria": [
          "Mô tả cấu trúc taxonomy: phân loại theo Journey stage, Persona, Feature, Pain points trên công cụ Dovetail/Notion",
          "Tổ chức các buổi chia sẻ 'Insight of the Month' và gắn link insight trực tiếp vào các ticket Jira của Product",
          "Đo lường tỷ lệ tiếp nhận (Adoption): số lượng thành viên truy cập kho tri thức và số lượng quyết định sản phẩm trích dẫn nguồn từ kho"
        ],
        "followUps": [
          "Cách xử lý việc cập nhật hoặc gỡ bỏ các insights cũ đã lỗi thời theo thời gian?",
          "Làm thế nào để đào tạo đội ngũ không chuyên về nghiên cứu biết cách tìm kiếm thông tin hiệu quả?"
        ],
        "tags": [
          "Research Repository",
          "Taxonomy",
          "Knowledge Sharing",
          "Insight Adoption"
        ],
        "sourceRefs": [
          "https://dovetail.com/research-methodology/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Xây dựng một trang tài liệu rồi bỏ hoang không ai sử dụng"
        ]
      },
      {
        "id": "UX_RES-CV-03",
        "role": "UX Researcher",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong một dự án nghiên cứu có sự tham gia của các bên liên quan (Stakeholder-engaged Research) mà em từng chủ trì: Em đã lôi kéo các Product Managers và Developers cùng tham gia quan sát các buổi phỏng vấn (Observer) như thế nào để họ trực tiếp cảm nhận nỗi đau của người dùng?",
        "evaluationCriteria": [
          "Tạo tài liệu hướng dẫn dành riêng cho Observer: dặn dò tắt mic, không ngắt lời, hướng dẫn cách ghi chép quan sát khách quan",
          "Tổ chức buổi họp Debrief 15 phút ngay sau mỗi phiên phỏng vấn để toàn bộ team cùng chia sẻ cảm nghĩ nhanh",
          "Quan sát thấy sự thay đổi nhận thức rõ rệt của kỹ sư lập trình sau khi tận mắt chứng kiến người dùng gặp khó khăn với dòng code của họ"
        ],
        "followUps": [
          "Khi một stakeholder cố tình vi phạm nguyên tắc và bật mic can thiệp vào buổi phỏng vấn, em xử lý tình huống đó thế nào?",
          "Lợi ích của việc đưa dev đi thực địa so với việc chỉ gửi báo cáo tóm tắt cho họ?"
        ],
        "tags": [
          "Stakeholder Observers",
          "Debrief Sessions",
          "Team Empathy",
          "Fieldwork"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tự làm nghiên cứu một mình trong phòng kín và chỉ ném báo cáo cho team vào ngày cuối cùng"
        ]
      },
      {
        "id": "UX_RES-CV-04",
        "role": "UX Researcher",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "CV của em có nhắc đến việc thực hiện Nghiên cứu Đánh giá Tiêu chuẩn (Benchmark Study) đo lường trải nghiệm theo chu kỳ (hàng quý/nửa năm). Em đã chọn những chỉ số đo lường nào (SUS, SEQ, Task Time) và báo cáo xu hướng tiến bộ cho ban lãnh đạo ra sao?",
        "evaluationCriteria": [
          "Xác định bộ kịch bản tác vụ chuẩn (Standardized Task Set) không thay đổi qua các kỳ để đảm bảo tính so sánh khách quan",
          "Theo dõi sự dịch chuyển của các chỉ số qua thời gian: điểm SUS tăng từ 65 lên 78, thời gian hoàn thành tác vụ rút ngắn 40%",
          "Trực quan hóa biểu đồ xu hướng (Trendline) kết hợp với các mốc phát hành tính năng lớn để chỉ rõ nguyên nhân của sự thay đổi chỉ số"
        ],
        "followUps": [
          "Làm thế nào để kiểm soát các biến số ngoại cảnh (môi trường mạng, cập nhật hệ điều hành) không làm sai lệch kết quả benchmark?",
          "Khi một chỉ số benchmark bất ngờ tụt giảm sau một bản cập nhật lớn, em phản ứng ra sao?"
        ],
        "tags": [
          "Benchmark Study",
          "Standardized Tasks",
          "Trend Analysis",
          "Executive Dashboard"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Thay đổi kịch bản kiểm tra qua mỗi kỳ khiến kết quả các quý không thể so sánh đối chiếu được với nhau"
        ]
      },
      {
        "id": "UX_RES-CV-05",
        "role": "UX Researcher",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Khi thực hiện nghiên cứu người dùng tại thị trường quốc tế hoặc các vùng miền có đặc thù văn hóa khác biệt (Cross-cultural Research): Em đã điều chỉnh cách tiếp cận ngôn ngữ, phong tục và cách đặt câu hỏi như thế nào để không phạm vào các điều cấm kỵ văn hóa?",
        "evaluationCriteria": [
          "Nghiên cứu kỹ lưỡng các chiều kích văn hóa (Hofstede Cultural Dimensions: Power Distance, Collectivism vs Individualism)",
          "Phối hợp với thông dịch viên hoặc nhà nghiên cứu bản địa để dịch thuật ngược (Back-translation) nhằm bảo toàn sắc thái ngữ nghĩa",
          "Điều chỉnh thái độ giao tiếp phù hợp với văn hóa địa phương (ở nền văn hóa có khoảng cách quyền lực cao, người tham gia thường ngần ngại chỉ trích sản phẩm trực tiếp)"
        ],
        "followUps": [
          "Làm thế nào để phát hiện các tín hiệu phi ngôn ngữ (ngôn ngữ cơ thể, cử chỉ) đặc thù của từng vùng miền?",
          "Phương pháp kiểm chứng tính tương thích văn hóa của các hình ảnh minh họa và biểu tượng trong sản phẩm?"
        ],
        "tags": [
          "Cross-cultural Research",
          "Cultural Dimensions",
          "Localization UX",
          "Global Research"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Áp dụng rập khuôn văn hóa phương Tây vào người dùng châu Á và cho rằng mọi người dùng trên thế giới đều suy nghĩ như nhau"
        ]
      },
      {
        "id": "UX_RES-BEHAV-01",
        "role": "UX Researcher",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi kết quả nghiên cứu khoa học của em chỉ ra rằng một tính năng mà Tổng Giám đốc (CEO) vô cùng tâm huyết thực chất không được người dùng đón nhận và gây ra sự khó chịu, em chuẩn bị tâm lý và trình bày kết quả 'đắng lòng' này như thế nào?",
        "evaluationCriteria": [
          "Chuẩn bị dữ liệu vững chắc, không để cảm xúc cá nhân chi phối; tập trung vào mục tiêu giúp công ty tránh lãng phí hàng tỷ đồng đầu tư sai hướng",
          "Mở đầu bằng việc ghi nhận tầm nhìn chiến lược của CEO; sau đó trình bày thực tế phản ứng của người dùng thông qua video và dữ liệu trung thực",
          "Không chỉ dừng lại ở việc báo tin xấu; đề xuất các hướng xoay trục (Pivot options) khả thi dựa trên những nhu cầu thật mà nghiên cứu vừa phát hiện"
        ],
        "followUps": [
          "Làm thế nào để bảo vệ tính toàn vẹn của kết quả nghiên cứu mà không làm tổn thương lòng tự trọng của lãnh đạo?",
          "Em đã từng gặp trường hợp bị yêu cầu chỉnh sửa báo cáo để làm đẹp lòng sếp chưa và em phản ứng ra sao?"
        ],
        "tags": [
          "Delivering Bad News",
          "Executive Communication",
          "Research Integrity",
          "Pivot Opportunities"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Sợ sếp giận nên bóp méo kết quả nghiên cứu hoặc trình bày với thái độ thách thức đắc thắng"
        ]
      },
      {
        "id": "UX_RES-BEHAV-02",
        "role": "UX Researcher",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi Product Manager nói rằng: 'Chúng ta không có thời gian 2 tuần để làm nghiên cứu, Sprint sắp bắt đầu rồi, hãy để team tự quyết định theo trực giác', em phản ứng và đề xuất phương án Nghiên cứu Tinh gọn (Lean Research) ra sao?",
        "evaluationCriteria": [
          "Không cản trở tiến độ của team; giải thích rằng 'Nghiên cứu nhanh trong 2 ngày vẫn tốt hơn gấp nhiều lần việc mò mẫm trong bóng tối'",
          "Đề xuất quy trình Lean UX Research cấp tốc trong 48 giờ: chạy 3 buổi phỏng vấn nhanh hoặc test thử prototype với 4 người dùng nội bộ khác phòng ban",
          "Cung cấp các phát hiện nhanh (Top 3 findings) ngay trong ngày để PM kịp đưa ra quyết định Sprint mà không bị trễ hạn"
        ],
        "followUps": [
          "Làm thế nào để chứng minh rằng chi phí của 2 ngày nghiên cứu rẻ hơn rất nhiều so với 2 tháng code một tính năng vô dụng?",
          "Khi nào thì được phép bỏ qua nghiên cứu để ưu tiên tốc độ phát hành tính năng?"
        ],
        "tags": [
          "Lean UX Research",
          "Fast-paced Sprint",
          "Time Trade-off",
          "Guerilla Testing"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Than vãn đòi hoãn Sprint bằng được hoặc buông xuôi hoàn toàn không làm gì cả"
        ]
      },
      {
        "id": "UX_RES-BEHAV-03",
        "role": "UX Researcher",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Trong một buổi phỏng vấn người dùng, người tham gia bất ngờ xúc động mạnh, rơi nước mắt hoặc trở nên giận dữ khi chia sẻ về một trải nghiệm tiêu cực (ví dụ: bị lừa đảo tài chính hoặc sự cố y tế). Em ứng phó với tình huống đạo đức nghiên cứu nhạy cảm này như thế nào?",
        "evaluationCriteria": [
          "Tạm dừng ngay lập tức việc ghi âm/ghi hình và thể hiện sự đồng cảm chân thành của một con người trước khi là một nhà nghiên cứu",
          "Nhẹ nhàng hỏi xem họ có muốn nghỉ giải lao uống nước hoặc dừng buổi phỏng vấn hoàn toàn hay không",
          "Khẳng định quyền tự quyết của họ: nếu họ muốn dừng, vẫn gửi đầy đủ quà cảm ơn và cam kết xóa bỏ hoàn toàn phần dữ liệu nhạy cảm nếu họ yêu cầu"
        ],
        "followUps": [
          "Nguyên tắc đạo đức 'Không gây tổn hại' (Do No Harm) trong nghiên cứu người dùng đòi hỏi điều gì?",
          "Cách bảo vệ tâm lý của chính nhà nghiên cứu (Researcher Burnout / Secondary Trauma) khi thường xuyên lắng nghe các câu chuyện thương tâm?"
        ],
        "tags": [
          "Research Ethics",
          "Trauma-informed Research",
          "Empathy",
          "Participant Wellbeing"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Vô cảm tiếp tục dí micro hỏi dồn để khai thác thông tin kịch tính phục vụ báo cáo"
        ]
      },
      {
        "id": "UX_RES-BEHAV-04",
        "role": "UX Researcher",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi em nhận thấy một UX Designer trong nhóm thường xuyên diễn giải sai lệch các phát hiện nghiên cứu của em để phục vụ cho sở thích thẩm mỹ cá nhân của họ, em xử lý tình huống bất đồng chuyên môn này ra sao?",
        "evaluationCriteria": [
          "Chủ động hẹn Designer một buổi cà phê trò chuyện chân thành, không mang tính công kích",
          "Cùng nhau mở lại các đoạn băng ghi âm và ghi chú gốc để đối chiếu xem sự sai lệch bắt nguồn từ đâu (do câu chữ trong báo cáo chưa rõ ràng hay do hiểu nhầm)",
          "Cùng Designer đồng sáng tạo (Co-design): ngồi bên cạnh hỗ trợ họ chuyển hóa đúng tinh thần của insight thành giải pháp thiết kế khả thi"
        ],
        "followUps": [
          "Làm thế nào để viết khuyến nghị nghiên cứu (Design Recommendations) dưới dạng vấn đề cần giải quyết thay vì chỉ định cách vẽ cụ thể?",
          "Cách xây dựng tinh thần đồng đội keo sơn giữa Nhà nghiên cứu và Nhà thiết kế?"
        ],
        "tags": [
          "Misinterpretation of Insights",
          "Designer Collaboration",
          "Co-design",
          "Clear Recommendations"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Lên tiếng tố cáo Designer với sếp rằng họ cố tình bóp méo dữ liệu nghiên cứu"
        ]
      },
      {
        "id": "UX_RES-BEHAV-05",
        "role": "UX Researcher",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Làm thế nào em nâng cao 'Độ trưởng thành về Trải nghiệm' (UX Research Maturity) trong một tổ chức mà mọi người ban đầu xem nghiên cứu chỉ là một hoạt động kiểm tra thủ tục phù phiếm, tốn kém?",
        "evaluationCriteria": [
          "Bắt đầu bằng những chiến thắng nhỏ (Quick Wins): giải quyết một bài toán cụ thể nhức nhối và chứng minh hiệu quả kinh doanh rõ ràng",
          "Dân chủ hóa nghiên cứu có kiểm soát (Democratizing Research): đào tạo các kỹ năng phỏng vấn cơ bản cho PM và Designers dưới sự giám sát của mình",
          "Xây dựng các kênh chia sẻ thú vị (Kênh Slack 'Tiếng nói khách hàng', Lunch & Learn) đưa hơi thở đời sống của người dùng vào từng góc làm việc của công ty"
        ],
        "followUps": [
          "Những rủi ro khi 'dân chủ hóa nghiên cứu' cho những người không có chuyên môn là gì và cách kiểm soát chất lượng?",
          "Làm thế nào để đo lường ROI (Lợi tức đầu tư) của hoạt động UX Research trong toàn doanh nghiệp?"
        ],
        "tags": [
          "Research Maturity",
          "Quick Wins",
          "Democratizing Research",
          "ROI of Research",
          "Culture Transformation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Ngại tiếp cận phương pháp nghiên cứu mới, giữ khư khư các kỹ thuật cũ không còn phù hợp với bối cảnh sản phẩm số"
        ]
      }
    ]
  },
  {
    "role": "Product Designer",
    "group": "productUX",
    "groupLabel": "Thiết kế Sản phẩm & UX",
    "aliases": [
      "product designer",
      "thiet ke san pham",
      "digital product designer",
      "end to end product designer"
    ],
    "questions": [
      {
        "id": "PROD_DES-FOUND-01",
        "role": "Product Designer",
        "category": "foundation",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Trong Product Designer, phân biệt Opportunity Solution Tree, Continuous Discovery, Product Outcomes, Assumption Testing; mô tả khi nào em áp dụng chúng trong bài tập.",
        "evaluationCriteria": [
          "Giải thích đúng ý nghĩa cơ bản của Opportunity Solution Tree.",
          "Phân biệt được các khái niệm liên quan Continuous Discovery, Product Outcomes, Assumption Testing ở mức nhập môn.",
          "Đưa ra được ví dụ học tập phù hợp với vị trí Product Designer."
        ],
        "followUps": [
          "Nếu mới học Opportunity Solution Tree, em sẽ dùng ví dụ đơn giản nào để tự kiểm tra mình đã hiểu?"
        ],
        "tags": [
          "Opportunity Solution Tree",
          "Continuous Discovery",
          "Product Outcomes",
          "Assumption Testing",
          "Teresa Torres"
        ],
        "sourceRefs": [
          "https://www.producttalk.org/",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Nhầm lẫn khái niệm nền tảng hoặc không thể đưa ra ví dụ cơ bản."
        ]
      },
      {
        "id": "PROD_DES-FOUND-02",
        "role": "Product Designer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Các chỉ số kinh doanh cốt lõi (Business Metrics) mà một Product Designer bắt buộc phải am hiểu: Phân tích mối quan hệ giữa Chỉ số thu hút (CAC), Kích hoạt (Activation Rate), Giữ chân (Retention Rate), Rời bỏ (Churn Rate) và Giá trị vòng đời khách hàng (LTV). Thiết kế sản phẩm tác động trực tiếp lên chỉ số nào mạnh mẽ nhất?",
        "evaluationCriteria": [
          "Thiết kế Onboarding và Time-to-Value tác động trực tiếp nhất lên tỷ lệ Kích hoạt (Activation Rate)",
          "Trải nghiệm mượt mà, giá trị liên tục và giải quyết đúng nhu cầu tác động sống còn lên Giữ chân (Retention) - xương sống của tăng trưởng bền vững",
          "Hiểu rõ chi phí để có một khách hàng mới (CAC) đắt gấp nhiều lần chi phí giữ chân khách hàng cũ, từ đó ưu tiên giải quyết các điểm gãy trải nghiệm để giảm Churn"
        ],
        "followUps": [
          "Đường cong giữ chân khách hàng (Retention Curve) đi ngang (Flattening) có ý nghĩa sống còn gì đối với Product-Market Fit?",
          "Chỉ số North Star Metric là gì và Product Designer đóng góp vào việc thúc đẩy chỉ số này ra sao?"
        ],
        "tags": [
          "Business Metrics",
          "Retention Rate",
          "Activation",
          "Churn Rate",
          "North Star Metric"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Nghĩ rằng chỉ số kinh doanh và tài chính là việc riêng của Product Manager, designer chỉ cần lo giao diện đẹp"
        ]
      },
      {
        "id": "PROD_DES-FOUND-03",
        "role": "Product Designer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khái niệm Sản phẩm khả dụng tối thiểu (Minimum Viable Product - MVP): Phân biệt giữa cách tiếp cận 'Cắt lát dọc' (Vertical Slice - hoạt động được từ đầu đến cuối một tính năng nhỏ) và 'Xây dựng từng tầng' (Layer-by-layer: làm xong hết DB rồi mới tới UI). Product Designer định hình phạm vi MVP như thế nào để vừa kiểm chứng được giả định vừa giữ được trải nghiệm chất lượng?",
        "evaluationCriteria": [
          "MVP không phải là một sản phẩm xấu xí, chắp vá, nhiều lỗi; MVP là phiên bản nhỏ nhất nhưng mang lại giá trị trọn vẹn và giải quyết được một vấn đề cốt lõi",
          "Cắt lát dọc (Vertical Slice): tạo ra một trải nghiệm hoàn chỉnh dù quy mô hẹp, giúp kiểm chứng được cả tính khả thi kỹ thuật lẫn sự hào hứng của người dùng",
          "Loại bỏ các tính năng phụ trợ hào nhoáng để dồn lực vào việc hoàn thiện trải nghiệm cốt lõi"
        ],
        "followUps": [
          "Khái niệm 'Minimum Lovable Product' (MLP) nâng cấp tư duy thiết kế MVP như thế nào?",
          "Làm thế nào để đo lường thành công của một bản phát hành MVP?"
        ],
        "tags": [
          "MVP",
          "Vertical Slice",
          "Minimum Lovable Product",
          "Hypothesis Testing",
          "Scoping"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "https://www.interaction-design.org/literature"
        ],
        "redFlags": [
          "Cắt gọt thiết kế đến mức tồi tệ, không sử dụng được rồi dán nhãn 'MVP' để biện minh cho sự cẩu thả"
        ]
      },
      {
        "id": "PROD_DES-FOUND-04",
        "role": "Product Designer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Cân bằng giữa Mô hình kiếm tiền (Monetization) và Trải nghiệm người dùng (User Experience): Các chiến lược chuyển đổi từ người dùng miễn phí sang trả phí (Freemium, Free Trial, Reverse Trial) và cách thiết kế Điểm giới hạn (Paywalls / Feature Gates) tự nhiên, không gây ức chế?",
        "evaluationCriteria": [
          "Thiết kế Paywall theo ngữ cảnh (Contextual Paywall): chỉ xuất hiện đúng lúc người dùng vừa nhận ra giá trị vượt trội của tính năng nâng cao",
          "Minh bạch tuyệt đối về giá, thời hạn dùng thử và quy trình hủy cước để xây dựng niềm tin dài hạn",
          "Tránh việc khóa chặt các tính năng cơ bản khiến người dùng chưa kịp hiểu giá trị sản phẩm đã nản lòng rời đi"
        ],
        "followUps": [
          "Chiến lược 'Reverse Trial' (cho trải nghiệm bản Pro 14 ngày trước khi tự động về bản Free) đem lại chuyển đổi ra sao?",
          "Cách thiết kế bảng so sánh gói cước (Pricing Table) giúp định hướng người dùng vào gói tối ưu?"
        ],
        "tags": [
          "Monetization UX",
          "Paywall Design",
          "Freemium",
          "Pricing Table",
          "Feature Gating"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Chặn paywall vô tội vạ ngay khi người dùng vừa mở app khiến tỷ lệ xóa app tăng vọt"
        ]
      },
      {
        "id": "PROD_DES-FOUND-05",
        "role": "Product Designer",
        "category": "foundation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Bộ ba sản phẩm (Product Trio: Product Manager, Tech Lead, Product Designer): Ranh giới trách nhiệm và sự cộng hưởng kỹ năng giữa ba vai trò này. Tại sao các quyết định thiết kế cần được đưa ra dựa trên sự giao thoa của 3 yếu tố: Tính đáng mong muốn (Desirability - User), Tính khả thi (Feasibility - Tech), và Tính khả thi kinh doanh (Viability - Business)?",
        "evaluationCriteria": [
          "Product Designer dẫn dắt yếu tố Desirability (Người dùng có muốn dùng không?), Tech Lead dẫn dắt Feasibility (Có khả thi công nghệ không?), PM dẫn dắt Viability (Có kiếm ra tiền và phù hợp chiến lược không?)",
          "Cả 3 cùng tham gia từ ngày đầu tiên của Discovery, chia sẻ chung sự thấu cảm và trách nhiệm về thành bại của sản phẩm",
          "Tránh mô hình thác nước mini (Waterfall handoff: PM viết PRD -> Designer vẽ -> Dev code)"
        ],
        "followUps": [
          "Khi tính khả thi kỹ thuật bị giới hạn làm phương án thiết kế lý tưởng không thể thực hiện, Product Designer xử lý thế nào?",
          "Cách giải thích trade-offs thiết kế cho Tech Lead bằng ngôn ngữ kiến trúc hệ thống?"
        ],
        "tags": [
          "Product Trio",
          "Desirability",
          "Feasibility",
          "Viability",
          "Dual-track Agile"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "https://www.producttalk.org/"
        ],
        "redFlags": [
          "Xem mình là người chỉ có trách nhiệm bảo vệ người dùng và coi Tech Lead cùng PM là những người cản trở"
        ]
      },
      {
        "id": "PROD_DES-FOUND-06",
        "role": "Product Designer",
        "category": "foundation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Đánh giá sau phát hành (Post-launch Product Evaluation) và Vòng lặp cải tiến liên tục: Sau khi tính năng mới lên Production, Product Designer thiết lập kế hoạch theo dõi hành vi qua Cohort Analysis, phễu chuyển đổi và phỏng vấn người dùng thực tế như thế nào để quyết định: Tiếp tục tối ưu (Iterate), Nhân rộng (Scale), hay Dừng lại/Gỡ bỏ (Kill)?",
        "evaluationCriteria": [
          "Không dừng lại sau khi bàn giao thiết kế; theo dõi sát sao dữ liệu sử dụng trong 30-60 ngày đầu",
          "Phân tích Cohort Analysis để xem các nhóm người dùng mới có duy trì thói quen sử dụng tính năng đó lâu dài hay chỉ tò mò bấm thử vài ngày đầu",
          "Dũng cảm đề xuất gỡ bỏ (Kill feature) những tính năng rườm rà không mang lại giá trị để giữ cho sản phẩm tinh gọn"
        ],
        "followUps": [
          "Làm thế nào để phân biệt giữa việc tính năng thất bại do ý tưởng tồi hay do thiết kế thực thi chưa tới?",
          "Quy trình thiết kế luồng dọn dẹp (Sunsetting/Deprecation UX) khi khai tử một tính năng cũ?"
        ],
        "tags": [
          "Post-launch Evaluation",
          "Cohort Analysis",
          "Feature Sunsetting",
          "Product Iteration",
          "Data Analytics"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Phát hành xong là coi như xong việc, nhảy ngay sang vẽ tính năng mới mà không bao giờ quay lại xem tính năng cũ sống chết ra sao"
        ]
      },
      {
        "id": "PROD_DES-SKILL-01",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "basic",
        "seniority": "fresher_intern",
        "question": "Mô phỏng Problem Framing (Design Doc, Success Metrics, Edge Cases, PRD Collaboration) cho Product Designer: em chuẩn bị gì, thao tác nào và đo kết quả ra sao?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Problem Framing trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Problem Framing",
          "Design Doc",
          "Success Metrics",
          "Edge Cases",
          "PRD Collaboration"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "PROD_DES-SKILL-02",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Bài tập Product Designer: dựa trên Assumption Testing, phối hợp Fake Door Test, Wizard of Oz, Rapid Experimentation, Demand Validation; đầu ra sẽ được kiểm tra bằng tiêu chí nào?",
        "evaluationCriteria": [
          "Nêu mục đích sử dụng Assumption Testing trong một bài tập hoặc dự án nhỏ.",
          "Trình bày được các bước thực hiện theo thứ tự và phù hợp với Intern/Fresher.",
          "Đề xuất được cách kiểm tra kết quả và biết khi nào cần tra cứu hoặc hỏi người hướng dẫn."
        ],
        "followUps": [
          "Nếu kết quả chưa đúng, em sẽ kiểm tra bước nào đầu tiên và dựa vào dấu hiệu gì?"
        ],
        "tags": [
          "Assumption Testing",
          "Fake Door Test",
          "Wizard of Oz",
          "Rapid Experimentation",
          "Demand Validation"
        ],
        "sourceRefs": [
          "https://www.producttalk.org/",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Không xác định được mục tiêu thực hành hoặc nêu cách kiểm tra kết quả không phù hợp."
        ]
      },
      {
        "id": "PROD_DES-SKILL-03",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Thiết kế Bảng so sánh giá và Luồng thanh toán nâng cấp (Pricing & Upgrade Flow): Em áp dụng các nguyên lý tâm lý học định giá (Decoy Effect / Hiệu ứng chim mồi, Anchoring / Mỏ neo giá, Social Proof) vào việc thiết kế giao diện bảng giá như thế nào để tối đa hóa Doanh thu trung bình trên mỗi người dùng (ARPU)?",
        "evaluationCriteria": [
          "Sử dụng Anchoring: Đặt gói cao cấp bên cạnh để làm gói tiêu chuẩn trở nên hấp dẫn và kinh tế hơn",
          "Decoy Effect: Tạo một lựa chọn mồi để hướng người dùng chọn gói mà doanh nghiệp muốn đẩy mạnh nhất",
          "Gắn nhãn 'Phổ biến nhất' (Most Popular) và các đánh giá uy tín (Social Proof) để giảm sự do dự tâm lý khi thanh toán"
        ],
        "followUps": [
          "Cách hiển thị chuyển đổi giữa thanh toán theo tháng (Monthly) và theo năm (Annual với ưu đãi 'Tiết kiệm 20%') mượt mà?",
          "Làm thế nào để thiết kế quy trình nâng cấp gói (Upgrade Path) một chạm ngay trong bối cảnh người dùng chạm trần dung lượng?"
        ],
        "tags": [
          "Pricing Page UX",
          "Decoy Effect",
          "Anchoring",
          "ARPU Optimization",
          "Upgrade Flow"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Thiết kế bảng giá rối rắm với hàng chục gạch đầu dòng kỹ thuật khó hiểu khiến người dùng không biết nên mua gói nào"
        ]
      },
      {
        "id": "PROD_DES-SKILL-04",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Thiết kế Cơ chế Thúc đẩy hành vi (Behavioral Design & Habit Loops): Vận dụng Mô hình Hook (Trigger -> Action -> Variable Reward -> Investment) của Nir Eyal và Mô hình hành vi Fogg (B = MAP: Motivation, Ability, Prompt) để thiết kế các tính năng giữ chân người dùng (Retention loops) bền vững?",
        "evaluationCriteria": [
          "Tạo Action đơn giản nhất có thể (tối đa hóa Ability) ngay khi có Prompt xuất hiện",
          "Áp dụng Phần thưởng biến đổi (Variable Reward: nội dung mới, sự công nhận từ cộng đồng, thành tích) để kích thích sự tò mò",
          "Khuyến khích người dùng đầu tư công sức (Investment: tải ảnh lên, tùy biến hồ sơ, tích lũy lịch sử) khiến họ gắn bó và khó từ bỏ sản phẩm hơn"
        ],
        "followUps": [
          "Làm thế nào để ứng dụng Gamification (Bảng xếp hạng, Huy hiệu, Streak) mà không biến sản phẩm thành trò chơi trẻ con lố bịch?",
          "Ranh giới đạo đức giữa việc tạo thói quen lành mạnh (Healthy Habits) và tạo nghiện tiêu cực (Addiction)?"
        ],
        "tags": [
          "Behavioral Design",
          "Hook Model",
          "Fogg Behavior Model",
          "Retention Loops",
          "Habit Formation"
        ],
        "sourceRefs": [
          "https://www.interaction-design.org/literature",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Nhồi nhét vòng quay may mắn và thông báo spam liên tục khiến người dùng bực mình gỡ ứng dụng"
        ]
      },
      {
        "id": "PROD_DES-SKILL-05",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Phối hợp A/B Testing giữa Product Designer và Data Analyst: Em tham gia vào việc phân tích giả thuyết (Hypothesis Formulation), thiết kế các biến thể giao diện (Variant A vs Variant B), tính toán thời gian chạy thử nghiệm và phân tích kết quả ý nghĩa thống kê (Statistical Significance: p-value < 0.05) như thế nào?",
        "evaluationCriteria": [
          "Xây dựng giả thuyết khoa học: 'Bởi vì [vấn đề quan sát được], chúng tôi tin rằng [thay đổi thiết kế X] sẽ dẫn đến [kết quả Y] đo lường bằng [chỉ số Z]'",
          "Thiết kế biến thể B có sự khác biệt rõ rệt và cô lập biến số duy nhất để biết chính xác yếu tố nào tạo ra sự thay đổi",
          "Kiên nhẫn chạy thử nghiệm cho đến khi đạt đủ cỡ mẫu và độ tin cậy thống kê; không kết luận vội vàng sau 2 ngày đầu"
        ],
        "followUps": [
          "Khi Variant B thắng về tỷ lệ click (CTR) nhưng lại làm giảm tỷ lệ giữ chân (Retention) sau 30 ngày, em phân tích thế nào?",
          "Làm thế nào để tránh cạm bẫy 'Tối ưu cục bộ' (Local Maximum) khi chỉ mải mê A/B testing những chi tiết vụn vặt?"
        ],
        "tags": [
          "A/B Testing",
          "Hypothesis Formulation",
          "Statistical Significance",
          "Local Maximum",
          "Variant Design"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Thay đổi 5 yếu tố cùng lúc trong Variant B khiến khi có kết quả không thể biết yếu tố nào thực sự có tác dụng"
        ]
      },
      {
        "id": "PROD_DES-SKILL-06",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Kỹ thuật Thiết kế Hệ sinh thái Sản phẩm đa nền tảng (Omnichannel / Cross-device Experience): Em đồng bộ hóa trải nghiệm người dùng như thế nào khi họ chuyển đổi qua lại giữa Web Desktop, Mobile App, Tablet và Thông báo qua Email/SMS trong cùng một ngày?",
        "evaluationCriteria": [
          "Đảm bảo tính liên tục của luồng công việc (State Continuity): việc đang làm dở trên máy tính (soạn thảo giỏ hàng, viết bài) phải hiển thị nguyên vẹn ngay khi mở điện thoại",
          "Tối ưu hóa thế mạnh của từng nền tảng: Desktop tối ưu cho tác vụ quản trị, nhập liệu sâu; Mobile tối ưu cho thao tác nhanh, camera, định vị và duyệt tin tức",
          "Thiết lập hệ thống thông báo đa kênh thông minh: không gửi thông báo đẩy lặp lại trên điện thoại nếu người dùng đã đọc tin nhắn đó trên web"
        ],
        "followUps": [
          "Làm thế nào để thiết kế trải nghiệm Handoff liền mạch giữa các thiết bị?",
          "Cách duy trì tính nhất quán về mặt tinh thần thương hiệu trong khi vẫn tôn trọng đặc thù phần cứng từng thiết bị?"
        ],
        "tags": [
          "Cross-device UX",
          "Omnichannel",
          "State Continuity",
          "Responsive Ecosystem",
          "Handoff"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://m3.material.io/"
        ],
        "redFlags": [
          "Ép người dùng mobile phải thao tác các tác vụ bảng biểu phức tạp giống hệt desktop mà không tối ưu cho màn hình nhỏ"
        ]
      },
      {
        "id": "PROD_DES-SKILL-07",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Thiết kế Hệ thống Dashboard và Báo cáo phân tích dành cho Khách hàng doanh nghiệp (B2B SaaS Analytics): Em phân cấp các loại báo cáo (Chiến lược - Strategic, Vận hành - Operational, và Phân tích chuyên sâu - Analytical) ra sao để đáp ứng các cấp bậc người dùng từ nhân viên vận hành đến Giám đốc C-level?",
        "evaluationCriteria": [
          "C-level cần Dashboard Chiến lược: các chỉ số tổng quan vĩ mô (High-level KPIs), xu hướng tăng trưởng, cảnh báo đỏ và xuất báo cáo PDF nhanh",
          "Quản lý cấp trung cần Dashboard Vận hành: tiến độ thời gian thực, cảnh báo tắc nghẽn và phân bổ nguồn lực",
          "Chuyên viên cần Báo cáo Phân tích: lọc đa chiều, truy vết dữ liệu gốc (Drill-down capability) và xuất dữ liệu thô (Raw CSV)"
        ],
        "followUps": [
          "Cách thiết kế biểu đồ trực quan giúp người dùng nhận ra điểm bất thường (Anomaly Detection) ngay lập tức?",
          "Làm thế nào để tối ưu tốc độ tải trang của Dashboard khi phải truy vấn hàng triệu bản ghi cơ sở dữ liệu?"
        ],
        "tags": [
          "B2B SaaS Analytics",
          "Executive Dashboard",
          "Drill-down",
          "Operational Reports",
          "Data Visualization"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Thiết kế một dashboard chung chung hiển thị đầy số liệu kỹ thuật khiến giám đốc không đọc được insight kinh doanh"
        ]
      },
      {
        "id": "PROD_DES-SKILL-08",
        "role": "Product Designer",
        "category": "practical_skills",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Xây dựng Thước đo Trải nghiệm sản phẩm toàn diện theo khung HEART của Google (Happiness, Engagement, Adoption, Retention, Task success): Em thiết lập các Mục tiêu (Goals), Tín hiệu (Signals) và Chỉ số đo lường (Metrics) cụ thể cho từng khía cạnh của một sản phẩm công nghệ ra sao?",
        "evaluationCriteria": [
          "Happiness: Đo lường sự hài lòng qua CSAT, In-app survey",
          "Engagement: Tần suất tương tác, số phiên hoạt động mỗi tuần, thời lượng sử dụng có ích",
          "Adoption: Số lượng người dùng mới dùng thử tính năng mới lần đầu trong tháng",
          "Retention: Tỷ lệ người dùng tiếp tục quay lại dùng tính năng đó sau 30, 60, 90 ngày",
          "Task success: Thời gian hoàn thành tác vụ và tỷ lệ lỗi khi thực hiện thao tác"
        ],
        "followUps": [
          "Làm thế nào để khung đo lường HEART gắn kết trực tiếp với các mục tiêu OKR của toàn công ty?",
          "Tại sao không nên lạm dụng chỉ số Engagement khi sản phẩm thuộc loại công cụ năng suất (người dùng càng làm xong nhanh càng tốt)?"
        ],
        "tags": [
          "Google HEART Framework",
          "Goals-Signals-Metrics",
          "Product Metrics",
          "OKRs",
          "Product Health"
        ],
        "sourceRefs": [
          "https://www.nngroup.com/articles/",
          "https://library.gv.com/how-to-choose-the-right-ux-metrics-for-your-product-5f46059d39e3"
        ],
        "redFlags": [
          "Chỉ đo lường mỗi chỉ số doanh thu mà hoàn toàn mù tịt về sức khỏe trải nghiệm của sản phẩm"
        ]
      },
      {
        "id": "PROD_DES-SCEN-01",
        "role": "Product Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "fresher_intern",
        "question": "Tại Product Designer, khi Monetization vs UX cùng Native Advertising, Long-term Value, Ad Density, Stakeholder Negotiation xuất hiện và người tham gia thử nghiệm không hoàn thành được tác vụ chính, em kiểm tra log hay dữ liệu nào trước?",
        "evaluationCriteria": [
          "Làm rõ hiện tượng và thu thập thông tin trước khi kết luận.",
          "Đề xuất bước xử lý ban đầu an toàn, phù hợp với Intern/Fresher trong Product Designer.",
          "Biết xác nhận kết quả và báo người hướng dẫn khi vấn đề vượt quá phạm vi hiểu biết."
        ],
        "followUps": [
          "Em sẽ tóm tắt phát hiện và phần chưa chắc chắn với người hướng dẫn như thế nào?"
        ],
        "tags": [
          "Monetization vs UX",
          "Native Advertising",
          "Long-term Value",
          "Ad Density",
          "Stakeholder Negotiation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Đưa ra hành động rủi ro, vượt quyền hoặc bỏ qua bước xác minh và báo cáo."
        ]
      },
      {
        "id": "PROD_DES-SCEN-02",
        "role": "Product Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Sau khi ra mắt tính năng mới được đầu tư rất nhiều công sức, số liệu phân tích sau 2 tuần cho thấy: Tỷ lệ người dùng click vào nút tính năng rất cao (80% Adoption), nhưng tỷ lệ quay lại sử dụng lần thứ hai (Retention ngày thứ 7) chỉ vỏn vẹn 5%. Em tiếp cận phân tích và xử lý hiện tượng 'Tò mò rồi bỏ rơi' này như thế nào?",
        "evaluationCriteria": [
          "Xác định nguyên nhân: Tỷ lệ click ban đầu cao là do hiệu ứng tò mò (Curiosity effect) hoặc vị trí nút quá nổi bật, nhưng giá trị bên trong không đáp ứng được kỳ vọng",
          "Nhanh chóng tiến hành phỏng vấn sâu 8 người dùng đã bấm thử nhưng không quay lại để tìm ra điểm gây thất vọng",
          "Phát hiện xem sản phẩm có bị hứa hẹn quá lời (Misleading copy), luồng thao tác quá phức tạp ở bước sau hay giá trị mang lại không đủ lớn; từ đó lên kế hoạch tinh chỉnh trải nghiệm cốt lõi hoặc định vị lại tính năng"
        ],
        "followUps": [
          "Làm thế nào để cải thiện trải nghiệm 'First-run' giúp người dùng ngay lập tức gặt hái được thành quả trong 60 giây đầu tiên?",
          "Khi nào nên dũng cảm thừa nhận ý tưởng tính năng đã thất bại hoàn toàn?"
        ],
        "tags": [
          "Retention Drop",
          "Curiosity vs Value",
          "First-run Experience",
          "Post-launch Audit"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Cho rằng 80% click ban đầu là thành công lớn và phớt lờ con số 5% retention tồi tệ"
        ]
      },
      {
        "id": "PROD_DES-SCEN-03",
        "role": "Product Designer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Tình huống: Công ty quyết định chuyển đổi mô hình kinh doanh từ Mua một lần trọn đời (One-time Purchase) sang Thuê bao định kỳ hàng tháng (Monthly Subscription). Khách hàng trung thành phản ứng dữ dội và đe dọa tẩy chay sản phẩm. Em thiết kế chiến lược trải nghiệm chuyển đổi (Migration UX) như thế nào để xoa dịu khách hàng cũ và thu hút khách hàng mới?",
        "evaluationCriteria": [
          "Tôn trọng quyền lợi của khách hàng cũ: áp dụng chính sách 'Grandfathering' cho phép họ tiếp tục sử dụng các tính năng đã mua trọn đời vĩnh viễn không thu thêm tiền",
          "Định vị rõ giá trị gia tăng của gói thuê bao mới: liên tục cập nhật tính năng mới, lưu trữ đám mây không giới hạn và dịch vụ hỗ trợ VIP",
          "Đưa ra ưu đãi tri ân đặc quyền cho khách hàng cũ nâng cấp lên gói thuê bao với mức giá chiết khấu 50% trọn đời"
        ],
        "followUps": [
          "Làm thế nào để truyền thông minh bạch lý do chuyển đổi mô hình (chi phí máy chủ, duy trì đội ngũ nâng cấp bảo mật) trong nội dung sản phẩm?",
          "Cách thiết kế trải nghiệm dùng thử bản thuê bao mới mà không làm gián đoạn bản quyền cũ?"
        ],
        "tags": [
          "Business Model Shift",
          "Subscription Migration",
          "Grandfathering Policy",
          "Customer Trust",
          "Crisis UX"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Cắt đột ngột quyền lợi của người dùng đã trả tiền mua trọn đời và ép họ phải đóng tiền thuê bao tháng"
        ]
      },
      {
        "id": "PROD_DES-SCEN-04",
        "role": "Product Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Tình huống: Nhóm kỹ thuật (Engineering) thông báo rằng hệ sinh thái backend đang bị quá tải nghiêm trọng, và họ bắt buộc phải giới hạn số lượng request API của người dùng (Rate Limiting). Người dùng khi chạm ngưỡng sẽ không thể thao tác tiếp trong 15 phút. Em thiết kế trải nghiệm xử lý giới hạn này ra sao để giảm thiểu sự ức chế?",
        "evaluationCriteria": [
          "Tuyệt đối không hiển thị mã lỗi kỹ thuật 429 thô thiển; hiển thị thông báo rõ ràng bằng ngôn ngữ con người kèm đồng hồ đếm ngược thời gian hồi phục",
          "Hiển thị thanh đo mức độ sử dụng tài nguyên (Usage Quota Meter) từ sớm để người dùng chủ động điều chỉnh nhịp độ làm việc trước khi chạm trần",
          "Cung cấp nút nâng cấp gói tài nguyên tức thời hoặc hỗ trợ lưu tạm công việc vào bộ nhớ offline của máy khách để không bị mất dữ liệu"
        ],
        "followUps": [
          "Làm thế nào để ưu tiên các thao tác quan trọng sống còn (như lưu tài liệu, thanh toán) không bao giờ bị chặn bởi rate limit?",
          "Cách biến rào cản kỹ thuật thành cơ hội giới thiệu gói dịch vụ chuyên nghiệp (Pro Plan)?"
        ],
        "tags": [
          "Rate Limiting UX",
          "Graceful Degradation",
          "Usage Quota",
          "Error Recovery"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Để hệ thống văng lỗi không rõ lý do làm người dùng mất toàn bộ văn bản đang nhập dở"
        ]
      },
      {
        "id": "PROD_DES-SCEN-05",
        "role": "Product Designer",
        "category": "scenario",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Tình huống: Nhóm Product Trio của em đang chuẩn bị phát triển một tính năng lớn theo lộ trình quý, nhưng Tech Lead ước tính thời gian lập trình mất tới 4 tháng, trong khi PM chỉ có ngân sách thời gian 6 tuần. Em dẫn dắt buổi thảo luận cắt tỉa phạm vi (Scoping Workshop) như thế nào để đưa ra một giải pháp thiết kế khả thi trong 6 tuần mà vẫn giữ được 80% giá trị cốt lõi?",
        "evaluationCriteria": [
          "Áp dụng nguyên lý Pareto (80/20): phân tích xem 20% thành phần nào của thiết kế mang lại 80% giá trị cho người dùng",
          "Chia nhỏ giải pháp thành 3 giai đoạn: Phase 1 (Must-have cho 6 tuần), Phase 2 (Should-have cho bản cập nhật tiếp theo), Phase 3 (Nice-to-have nâng cao)",
          "Đơn giản hóa các tương tác phức tạp (thay animation tùy biến bằng tương tác chuẩn của hệ điều hành, thay thuật toán tự động bằng quy trình có sự can thiệp thủ công có kiểm soát)"
        ],
        "followUps": [
          "Làm thế nào để thuyết phục PM đồng ý cắt bỏ các tính năng phụ mà không làm họ cảm thấy sản phẩm bị què cụt?",
          "Cách ghi nhận các ý tưởng bị cắt giảm vào Design Backlog để không bị lãng quên trong tương lai?"
        ],
        "tags": [
          "Scoping Workshop",
          "Scope Pruning",
          "Pareto Principle",
          "Phased Rollout",
          "Product Trio Negotiation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Khăng khăng đòi làm đủ 100% thiết kế ban đầu và từ chối cắt giảm bất kỳ màn hình nào"
        ]
      },
      {
        "id": "PROD_DES-SCEN-06",
        "role": "Product Designer",
        "category": "scenario",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Tình huống: Người dùng phàn nàn rằng sau khi ứng dụng cập nhật giao diện mới, họ không tìm thấy các tính năng quen thuộc hàng ngày và muốn quay lại phiên bản cũ. Em thiết kế chiến lược quản trị thay đổi trải nghiệm (Change Management UX) như thế nào để giúp người dùng thích nghi êm thấm?",
        "evaluationCriteria": [
          "Cung cấp tùy chọn cho phép người dùng dùng thử phiên bản mới và chuyển đổi linh hoạt về phiên bản cũ (Toggle Switch) trong giai đoạn chuyển giao 30 ngày",
          "Thiết kế các gợi ý ngữ cảnh nhẹ nhàng (Contextual Tooltips / Hotspots) chỉ ra vị trí mới của các tính năng quen thuộc khi người dùng tìm kiếm",
          "Lắng nghe phản hồi thực tế từ nút 'Góp ý về giao diện mới' để nhanh chóng sửa chữa các điểm gây bỡ ngỡ"
        ],
        "followUps": [
          "Tại sao việc thay đổi giao diện đột ngột 100% không báo trước luôn gây ra phản ứng dữ dội dù giao diện mới có tốt hơn?",
          "Quy trình khảo sát sự sẵn sàng chuyển đổi trước khi chính thức tắt hoàn toàn phiên bản cũ?"
        ],
        "tags": [
          "Change Management UX",
          "Feature Transition",
          "Opt-in Experience",
          "User Adaptation"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.nngroup.com/articles/"
        ],
        "redFlags": [
          "Ép buộc người dùng chuyển sang giao diện mới hoàn toàn và phớt lờ mọi lời kêu cứu của họ"
        ]
      },
      {
        "id": "PROD_DES-CV-01",
        "role": "Product Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "Trong dự án em ghi trên CV về việc dẫn dắt thiết kế sản phẩm từ số 0 (Zero-to-One Product Design): Em đã tham gia vào việc xác thực bài toán kinh doanh như thế nào, xây dựng MVP ra sao và các chỉ số tăng trưởng đạt được sau 6 tháng phát hành là gì?",
        "evaluationCriteria": [
          "Trình bày từ khâu Problem Discovery: nghiên cứu đối thủ, phỏng vấn khách hàng tiềm năng để tìm khoảng trống thị trường",
          "Cùng PM định nghĩa phạm vi MVP, thiết kế wireframes, prototypes và trực tiếp giám sát quá trình phát triển của dev",
          "Dẫn chứng các chỉ số định lượng: đạt 10,000 người dùng hoạt động hàng tháng (MAU), tỷ lệ giữ chân sau 30 ngày đạt 35% và doanh thu định kỳ MRR tăng trưởng ổn định"
        ],
        "followUps": [
          "Thách thức lớn nhất khi làm sản phẩm từ số 0 so với việc tối ưu hóa sản phẩm đã có hàng triệu người dùng là gì?",
          "Em đã đưa ra quyết định sai lầm nào trong giai đoạn đầu và bài học rút ra là gì?"
        ],
        "tags": [
          "CV Validation",
          "Zero-to-One Design",
          "MVP Scoping",
          "Quantitative Growth",
          "MAU & Retention"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Chỉ nói về việc vẽ đẹp nhưng không nắm được các chỉ số tăng trưởng hay mô hình kinh doanh của sản phẩm"
        ]
      },
      {
        "id": "PROD_DES-CV-02",
        "role": "Product Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "middle",
        "question": "CV của em có đề cập đến việc tối ưu hóa tỷ lệ giữ chân người dùng (Retention Rate). Hãy chia sẻ cụ thể một đợt cải tiến thiết kế mà em chủ trì đã đảo ngược xu hướng rời bỏ của khách hàng, cùng phương pháp phân tích Cohort mà em đã theo dõi?",
        "evaluationCriteria": [
          "Chỉ ra phát hiện từ dữ liệu: người dùng rời bỏ nhiều nhất vào ngày thứ 3 do không hiểu cách kết nối dữ liệu ban đầu",
          "Giải pháp thiết kế: tái cấu trúc luồng onboarding, bổ sung tính năng mẫu có sẵn (Pre-populated templates) và thông báo nhắc nhở thông minh theo ngữ cảnh",
          "Kết quả: nâng đường cong giữ chân tuần thứ 4 từ 15% lên 28%, giảm tỷ lệ Churn hàng tháng xuống 4%"
        ],
        "followUps": [
          "Làm thế nào để phối hợp với Data Analyst thiết lập bảng theo dõi Cohort Retention Dashboard?",
          "Em phân biệt thế nào giữa việc người dùng quay lại vì giá trị thực sự và việc quay lại do bị spam thông báo?"
        ],
        "tags": [
          "Retention Optimization",
          "Cohort Analysis",
          "Churn Reduction",
          "Pre-populated Templates"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khai báo khống số liệu retention tăng trưởng gấp ba lần mà không giải thích được cơ chế trải nghiệm tạo ra sự thay đổi đó"
        ]
      },
      {
        "id": "PROD_DES-CV-03",
        "role": "Product Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Em ghi trên CV kinh nghiệm thiết kế cho một sản phẩm B2B SaaS có chu kỳ bán hàng phức tạp. Em đã giải quyết bài toán dung hòa giữa nhu cầu của 'Người mua hàng' (Buyer - Giám đốc ra quyết định thanh toán) và 'Người dùng cuối' (End-user - Nhân viên trực tiếp sử dụng hàng ngày) như thế nào?",
        "evaluationCriteria": [
          "Phân tích rõ hai chân dung khác biệt: Buyer quan tâm đến bảo mật, quản lý chi phí, phân quyền (RBAC) và báo cáo ROI tổng thể; End-user quan tâm đến tốc độ, sự tiện lợi và không bị thêm việc",
          "Thiết kế giao diện đáp ứng cả hai: xây dựng bảng điều khiển quản trị mạnh mẽ cho Buyer, đồng thời tối ưu hóa luồng tác vụ hàng ngày cực kỳ mượt mà cho End-user",
          "Tận dụng chiến lược Tăng trưởng dẫn dắt bởi sản phẩm (Product-Led Growth - PLG): để End-user yêu thích sản phẩm và tự thúc đẩy Buyer thanh toán gói doanh nghiệp"
        ],
        "followUps": [
          "PLG khác biệt như thế nào so với Sales-Led Growth truyền thống trong thiết kế trải nghiệm B2B?",
          "Làm thế nào để thiết kế quy trình mời đồng nghiệp vào nhóm (Invite Teammates Flow) lan tỏa tự nhiên?"
        ],
        "tags": [
          "B2B SaaS",
          "Buyer vs End-user",
          "Product-Led Growth",
          "RBAC",
          "Enterprise UX"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Chỉ phục vụ người mua hàng khiến giao diện biến thành phần mềm cồng kềnh, khó dùng khiến nhân viên tẩy chay"
        ]
      },
      {
        "id": "PROD_DES-CV-04",
        "role": "Product Designer",
        "category": "cv_validation",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Trong một dự án áp dụng A/B Testing mà em từng thực hiện trên CV: Hãy trình bày một thử nghiệm thiết kế thất bại (Variant mới có kết quả kém hơn phiên bản cũ). Em đã phân tích nguyên nhân gốc rễ và học được điều gì từ sự thất bại đó?",
        "evaluationCriteria": [
          "Mô tả giả định ban đầu và thiết kế biến thể mới đầy tự tin của nhóm",
          "Số liệu thực tế chỉ ra biến thể mới làm giảm 8% tỷ lệ chuyển đổi; em đã không né tránh mà cùng team phân tích sâu vào hành vi",
          "Phát hiện ra thiết kế mới dù đẹp hơn nhưng đã vô tình giấu đi một thông tin bảo hành quan trọng mà người dùng rất quan tâm trước khi bấm mua; bài học sâu sắc về sự thấu hiểu tâm lý khách hàng"
        ],
        "followUps": [
          "Em làm thế nào để xây dựng tư duy 'Thử nghiệm thất bại vẫn là một bài học thành công' trong team?",
          "Quy trình rollback phiên bản an toàn khi phát hiện số liệu giảm sút nghiêm trọng?"
        ],
        "tags": [
          "Failed Experiment",
          "A/B Testing Insights",
          "Psychological Drivers",
          "Resilience"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Khẳng định tất cả các thử nghiệm của mình đều thành công 100% và không bao giờ thất bại"
        ]
      },
      {
        "id": "PROD_DES-CV-05",
        "role": "Product Designer",
        "category": "cv_validation",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "CV của em có nhắc đến việc xây dựng và duy trì sự liên kết chặt chẽ trong Product Trio. Khi có sự bất đồng lớn giữa 3 người (PM muốn làm tính năng A vì áp lực doanh số, Tech Lead muốn hoãn để đập đi xây lại nợ kỹ thuật, còn em muốn cải tiến luồng onboarding đang có nhiều ma sát), em đã điều phối để đưa ra quyết định chung như thế nào?",
        "evaluationCriteria": [
          "Tổ chức buổi làm việc mở dựa trên khung đánh giá ma trận tác động và nỗ lực (Impact vs Effort Matrix)",
          "Kết hợp các mục tiêu thành một giải pháp tích hợp: cải tiến luồng onboarding có lồng ghép việc dọn dẹp một phần nợ kỹ thuật trọng yếu của Tech Lead, và bổ sung điểm chạm kích hoạt doanh thu cho PM",
          "Thống nhất mục tiêu chung cao nhất của Sprint: đặt sức khỏe dài hạn của sản phẩm lên trên cái tôi của từng cá nhân"
        ],
        "followUps": [
          "Làm thế nào để duy trì niềm tin và sự tôn trọng lẫn nhau trong Product Trio qua các giai đoạn căng thẳng?",
          "Khi bất đồng không thể tự giải quyết trong nội bộ Trio, quy trình leo thang (Escalation) lên cấp CPO/CTO diễn ra ra sao?"
        ],
        "tags": [
          "Product Trio Alignment",
          "Conflict Resolution",
          "Impact vs Effort",
          "Holistic Solution"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Rút lui để mặc PM và Tech Lead cãi nhau hoặc chỉ biết khăng khăng bảo vệ ý kiến cá nhân"
        ]
      },
      {
        "id": "PROD_DES-BEHAV-01",
        "role": "Product Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi ban lãnh đạo công ty yêu cầu phát triển một tính năng sao chép y hệt (Feature-copying) của đối thủ cạnh tranh hàng đầu vì thấy họ đang làm rất tốt, em tiếp cận phân tích và phản biện có tính xây dựng như thế nào?",
        "evaluationCriteria": [
          "Không vội vàng sao chép mù quáng; đặt câu hỏi: 'Tại sao đối thủ làm tính năng này? Họ nhắm vào tệp khách hàng nào và có giải quyết đúng vấn đề của khách hàng chúng ta không?'",
          "Phân tích điểm mạnh và điểm yếu của tính năng đối thủ: tìm ra những điểm ma sát mà đối thủ đang gặp phải để tạo ra lợi thế cạnh tranh vượt trội",
          "Thuyết phục ban lãnh đạo tập trung vào thế mạnh cốt lõi và bài toán riêng biệt của sản phẩm mình thay vì chạy theo sau lưng đối thủ"
        ],
        "followUps": [
          "Tại sao việc sao chép tính năng đối thủ thường dẫn đến cái bẫy 'sao chép cả những sai lầm của họ'?",
          "Làm thế nào để tìm ra 'Giá trị khác biệt độc nhất' (Unique Value Proposition) cho sản phẩm?"
        ],
        "tags": [
          "Competitor Copying",
          "Strategic Differentiation",
          "Value Proposition",
          "Critical Thinking"
        ],
        "sourceRefs": [
          "https://www.svpg.com/articles/",
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Sao chép nguyên xi giao diện đối thủ từng pixel mà không cần suy nghĩ xem có hợp với người dùng mình không"
        ]
      },
      {
        "id": "PROD_DES-BEHAV-02",
        "role": "Product Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi một tính năng em rất tâm huyết và dày công thiết kế bị người dùng chỉ trích gay gắt trên mạng xã hội hoặc diễn đàn công nghệ ngay sau khi phát hành, em quản lý cảm xúc bản thân và tiến hành rà soát sự cố thế nào?",
        "evaluationCriteria": [
          "Tách bạch giá trị bản thân ra khỏi sản phẩm thiết kế; bình tĩnh tiếp nhận phản hồi tiêu cực như một nguồn dữ liệu quý giá",
          "Lọc bỏ những lời thóa mạ cảm tính, tập trung vào nguyên nhân kỹ thuật và trải nghiệm cốt lõi khiến họ bực mình",
          "Chủ động phối hợp cùng team phát hành bản vá nóng (Quick Hotfix) khắc phục các điểm gây ức chế nhất trong vòng 48 giờ và công khai cảm ơn sự đóng góp của cộng đồng"
        ],
        "followUps": [
          "Làm thế nào để biến những người dùng chỉ trích gay gắt nhất thành những đồng minh trung thành của sản phẩm?",
          "Cách giữ vững tinh thần cho nhóm thiết kế sau một đợt phát hành bị phản ứng tiêu cực?"
        ],
        "tags": [
          "Handling Public Criticism",
          "Emotional Resilience",
          "User Feedback Triage",
          "Hotfix Management"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Lên mạng đôi co cãi nhau với người dùng hoặc suy sụp tinh thần, mất niềm tin vào năng lực bản thân"
        ]
      },
      {
        "id": "PROD_DES-BEHAV-03",
        "role": "Product Designer",
        "category": "behavioral",
        "difficulty": "advanced",
        "seniority": "senior_lead",
        "question": "Trong bối cảnh áp lực ra mắt sản phẩm rất lớn, nhóm của em liên tục phải 'cắt góc' (Cut corners) về mặt chất lượng trải nghiệm để kịp tiến độ bàn giao (tạo ra Nợ thiết kế và nợ trải nghiệm khổng lồ). Em lên tiếng và thiết lập lại tiêu chuẩn chất lượng (Quality Standards) ra sao?",
        "evaluationCriteria": [
          "Tổ chức buổi họp hồi tưởng (Retrospective) thẳng thắn: chỉ ra hệ quả của việc cắt góc đang dẫn đến tỷ lệ lỗi tăng cao và người dùng phàn nàn",
          "Định nghĩa lại 'Định nghĩa hoàn thành' (Definition of Done - DoD): bổ sung tiêu chuẩn kiểm duyệt trải nghiệm và accessibility bắt buộc trước khi đóng ticket",
          "Chứng minh cho ban lãnh đạo thấy rằng nợ trải nghiệm đang làm chậm nhịp độ phát triển của các sprint sau, và cần dành thời gian giải quyết có hệ thống"
        ],
        "followUps": [
          "Làm thế nào để cân bằng giữa sự hoàn hảo cầu toàn (Perfectionism) và tính thực tế về tiến độ kinh doanh?",
          "Cách xây dựng văn hóa tự hào về chất lượng sản phẩm (Craftsmanship) trong đội ngũ?"
        ],
        "tags": [
          "Quality Standards",
          "Definition of Done",
          "Design Debt",
          "Craftsmanship",
          "Sprint Retrospective"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI",
          "https://www.svpg.com/articles/"
        ],
        "redFlags": [
          "Thỏa hiệp dễ dãi hạ thấp mọi tiêu chuẩn chất lượng để làm vui lòng tiến độ ảo trong ngắn hạn"
        ]
      },
      {
        "id": "PROD_DES-BEHAV-04",
        "role": "Product Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "middle",
        "question": "Khi em làm việc với một Tech Lead có xu hướng tiêu cực, luôn nói 'Không làm được' trước bất kỳ ý tưởng thiết kế đổi mới nào của em vì lý do hạ tầng phức tạp, em xây dựng lòng tin và phá vỡ rào cản phòng thủ kỹ thuật đó như thế nào?",
        "evaluationCriteria": [
          "Không coi câu nói 'Không làm được' là sự từ chối cá nhân; hiểu rằng Tech Lead đang chịu áp lực lớn về tính ổn định hệ thống và nợ kỹ thuật",
          "Chuyển đổi cách đặt câu hỏi: từ 'Em muốn làm cái này' sang 'Mục tiêu trải nghiệm của chúng ta là giải quyết vấn đề X cho người dùng, theo góc nhìn của anh thì hạ tầng hiện tại có thể hỗ trợ cách tiếp cận nào khả thi nhất?'",
          "Mời Tech Lead cùng tham gia vào quá trình phác thảo ý tưởng từ sớm để họ có cảm giác đồng sở hữu (Co-ownership) giải pháp"
        ],
        "followUps": [
          "Làm thế nào để học cách hiểu các khái niệm kiến trúc backend cơ bản để giao tiếp cùng tần số với Tech Lead?",
          "Một lần em đã cùng lập trình viên tìm ra giải pháp kỹ thuật thông minh vượt qua giới hạn hệ thống là gì?"
        ],
        "tags": [
          "Tech Lead Empathy",
          "Overcoming Technical Resistance",
          "Co-ownership",
          "Collaborative Problem Solving"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tố cáo Tech Lead với cấp trên là người bảo thủ, lười biếng và cản trở sự đổi mới của công ty"
        ]
      },
      {
        "id": "PROD_DES-BEHAV-05",
        "role": "Product Designer",
        "category": "behavioral",
        "difficulty": "intermediate",
        "seniority": "junior",
        "question": "Khi được giao phụ trách một sản phẩm trong lĩnh vực nghiệp vụ hoàn toàn xa lạ và phức tạp (ví dụ: Hệ thống chuỗi cung ứng logistics hoặc Nền tảng giao dịch phái sinh), em lập kế hoạch tự học hỏi nghiệp vụ (Domain Knowledge) trong 30 ngày đầu tiên như thế nào?",
        "evaluationCriteria": [
          "Chủ động đọc tài liệu nghiệp vụ, từ điển thuật ngữ chuyên ngành và phân tích sản phẩm của các đối thủ sừng sỏ trên thế giới",
          "Xin đi theo học hỏi (Shadowing) các chuyên gia nghiệp vụ nội bộ (Subject Matter Experts - SMEs) và nhân viên vận hành hàng ngày",
          "Vẽ sơ đồ quy trình nghiệp vụ tổng quan và nhờ các chuyên gia sửa chữa để kiểm chứng mức độ hiểu biết của bản thân trước khi bắt tay vào thiết kế"
        ],
        "followUps": [
          "Làm thế nào để biến việc là 'người ngoài ngành' thành một lợi thế (Tư duy người mới bắt đầu - Beginner's Mindset) để phát hiện ra những điểm bất hợp lý mà người trong ngành đã quen mắt?",
          "Cách ghi chú và chia sẻ lại kiến thức nghiệp vụ cho các thành viên mới khác trong team?"
        ],
        "tags": [
          "Domain Knowledge Onboarding",
          "Subject Matter Experts",
          "Beginner's Mindset",
          "Shadowing"
        ],
        "sourceRefs": [
          "Tình huống nghiệp vụ và phỏng vấn thực tế - JobReady AI"
        ],
        "redFlags": [
          "Tự mãn với kỹ năng hiện tại, ngại học công nghệ và công cụ thiết kế mới đang trở thành chuẩn ngành"
        ]
      }
    ]
  }
];
