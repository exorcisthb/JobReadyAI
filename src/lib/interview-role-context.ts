import { buildRoleQuestionsBrief } from "@/data/interview-questions";

/**
 * Short interview briefs grouped in the same order as INDUSTRIES_DATA in
 * InterviewSetupPage. Only the selected group's brief is added to Gemini's
 * system instruction for a session.
 */
const GROUP_CONTEXTS: Record<string, readonly string[]> = {
  it: [
    "Phát triển web/mobile: làm rõ vai trò cá nhân, thiết kế giao diện hoặc API, lựa chọn framework, xử lý trạng thái/lỗi, kiểm thử, hiệu năng và cách đưa tính năng lên môi trường chạy. Chỉ hỏi phần phù hợp với vị trí đã chọn.",
    "Hạ tầng, DevOps và Cloud: tập trung triển khai, CI/CD, container/orchestration, cloud, giám sát, độ tin cậy, bảo mật và xử lý sự cố; chọn các nội dung đúng với vị trí cụ thể.",
    "Kiểm thử và chất lượng: tập trung chiến lược kiểm thử, thiết kế test case, tự động hóa, quản lý lỗi, độ bao phủ và cách cân bằng chất lượng với tốc độ phát hành.",
    "Dữ liệu và AI: tập trung quy trình dữ liệu/mô hình, chất lượng và đánh giá dữ liệu, lựa chọn công cụ, độ tin cậy, khả năng mở rộng và tác động sản phẩm; đi sâu theo đúng vị trí đã chọn.",
    "An toàn thông tin: tập trung mô hình đe dọa, phát hiện và giảm thiểu rủi ro, kiểm soát bảo mật, ứng phó sự cố và cách chứng minh mức độ an toàn trong phạm vi vai trò.",
    "Sản phẩm và quản trị công nghệ: tập trung xác định vấn đề, yêu cầu, ưu tiên, phối hợp liên chức năng, tiến độ và kết quả đo lường; điều chỉnh câu hỏi theo vai trò cụ thể.",
    "Thiết kế sản phẩm và UX: tập trung nghiên cứu người dùng, luồng sử dụng, nguyên tắc thiết kế, khả năng tiếp cận, thử nghiệm và cách đánh giá hiệu quả trải nghiệm.",
  ],
  marketing: [
    "Digital marketing: tập trung chân dung khách hàng, kênh, chiến dịch, ngân sách, chỉ số hiệu quả và cách tối ưu dựa trên dữ liệu.",
    "Content và thương hiệu: tập trung insight, thông điệp, kế hoạch nội dung, giọng thương hiệu, phân phối và cách đo mức độ nhận biết/chuyển đổi.",
    "Sales và kinh doanh: tập trung tìm kiếm khách hàng, khám phá nhu cầu, xử lý từ chối, đàm phán, quản lý pipeline và kết quả doanh số.",
    "E-commerce và growth: tập trung hành trình chuyển đổi, thử nghiệm tăng trưởng, vận hành kênh, giữ chân khách hàng và các chỉ số doanh thu.",
  ],
  ecommerce: [
    "Vận hành sàn và cửa hàng: tập trung danh mục, nội dung sản phẩm, khuyến mại, vận hành gian hàng, chỉ số chuyển đổi và xử lý vấn đề đơn hàng.",
    "Kho vận và logistics: tập trung dự báo nhu cầu, tồn kho, điều phối, giao nhận, chi phí, SLA và xử lý gián đoạn chuỗi cung ứng.",
    "Customer và growth: tập trung trải nghiệm khách hàng, phân khúc, CRM, giữ chân, giá trị vòng đời và thử nghiệm tăng trưởng.",
  ],
  finance: [
    "Ngân hàng và tín dụng: tập trung thẩm định hồ sơ, khả năng trả nợ, quản trị rủi ro, tuân thủ và giao tiếp với khách hàng.",
    "Kế toán và kiểm toán: tập trung quy trình ghi nhận, đối soát, báo cáo, kiểm soát nội bộ, chuẩn mực và bằng chứng kiểm toán.",
    "Đầu tư và tài chính: tập trung phân tích doanh nghiệp/thị trường, mô hình tài chính, định giá, giả định, rủi ro và khuyến nghị.",
    "FinTech và bảo hiểm: tập trung sản phẩm/dòng thanh toán hoặc quy trình bảo hiểm, trải nghiệm khách hàng, rủi ro, dữ liệu và tuân thủ.",
  ],
  hr: [
    "Tuyển dụng: tập trung intake với quản lý tuyển dụng, tìm nguồn, sàng lọc, phỏng vấn có cấu trúc, trải nghiệm ứng viên và chỉ số tuyển dụng.",
    "Đào tạo và phát triển: tập trung phân tích nhu cầu, thiết kế chương trình, triển khai, đánh giá hiệu quả học tập và phát triển năng lực.",
    "C&B và hành chính nhân sự: tập trung chính sách, lương thưởng/phúc lợi, dữ liệu nhân sự, tuân thủ, bảo mật và hỗ trợ vận hành.",
  ],
  design: [
    "UI/UX và thiết kế sản phẩm: tập trung nghiên cứu, luồng tác vụ, prototype, usability, khả năng tiếp cận, design system và phối hợp với engineering.",
    "Visual và đồ họa: tập trung brief, concept, nhận diện, phân cấp thị giác, công cụ, bàn giao và tính nhất quán thương hiệu.",
    "Video và 3D: tập trung brief, quy trình sản xuất, công cụ, dựng/chuyển động, tối ưu chất lượng và phối hợp khi bàn giao sản phẩm.",
  ],
  global: [
    "Xuất nhập khẩu: tập trung chứng từ, Incoterms, hải quan, vận tải, quản lý nhà cung cấp, tuân thủ và xử lý chậm trễ/rủi ro.",
    "Quan hệ quốc tế và ngoại thương: tập trung nghiên cứu thị trường, giao tiếp liên văn hóa, đàm phán, đối tác, thương mại và độ chính xác ngôn ngữ.",
  ],
  other: [
    "Quản lý và điều hành: tập trung mục tiêu, lập kế hoạch, phân bổ nguồn lực, quản trị rủi ro, phối hợp các bên và kết quả đo lường.",
    "Pháp lý và tuân thủ: tập trung nhận diện rủi ro, diễn giải quy định/hợp đồng, kiểm soát tuân thủ, tư vấn thực tế và bảo mật thông tin.",
    "Vận hành và hành chính: tập trung quy trình, chất lượng dịch vụ, xử lý tình huống, ưu tiên công việc, phối hợp và cải tiến hiệu suất.",
  ],
};

const ROLE_SPECIALIZATIONS: Array<{ matches: RegExp; brief: string }> = [
  {
    matches: /react native|mobile developer|ios|android|flutter/i,
    brief: "Chuyên môn mobile: vòng đời ứng dụng, kiến trúc màn hình, đồng bộ dữ liệu, hiệu năng trên thiết bị, xử lý offline, phát hành store và kiểm thử trên nhiều thiết bị.",
  },
  {
    matches: /front.?end|frontend|react developer|vue\.js|angular/i,
    brief: "Chuyên môn Frontend: HTML/CSS/JavaScript hoặc TypeScript, framework giao diện, quản lý state, accessibility, hiệu năng trình duyệt, kiểm thử UI và tích hợp API.",
  },
  {
    matches: /back.?end|backend|server.?side|node\.js developer/i,
    brief: "Chuyên môn Backend: thiết kế API, logic nghiệp vụ, cơ sở dữ liệu, xác thực/phân quyền, xử lý lỗi, bảo mật, khả năng mở rộng và kiểm thử dịch vụ.",
  },
  {
    matches: /data engineer|analytics engineer/i,
    brief: "Chuyên môn Data Engineering: ingestion, ETL/ELT, data warehouse/lake, orchestration, kiểm tra chất lượng, lineage, tối ưu pipeline và xử lý dữ liệu lỗi.",
  },
  {
    matches: /business analyst|\bba\b/i,
    brief: "Chuyên môn Business Analysis: khai thác stakeholder, làm rõ vấn đề/yêu cầu, user story và acceptance criteria, mô hình hóa quy trình, ưu tiên phạm vi và xác nhận giải pháp.",
  },
  {
    matches: /data analyst|business intelligence|\bbi\b/i,
    brief: "Chuyên môn phân tích dữ liệu/BI: SQL, làm sạch và kiểm chứng dữ liệu, chọn KPI, phân tích xu hướng, trực quan hóa và chuyển kết quả thành khuyến nghị.",
  },
  {
    matches: /machine learning|data scientist|\bai\b|\bnlp\b|computer vision|mlops/i,
    brief: "Chuyên môn AI/ML: xác định bài toán, dữ liệu và baseline, chọn/đánh giá mô hình, tránh leakage/bias, triển khai, giám sát và giải thích đánh đổi.",
  },
];

export function buildSelectedRoleContext(
  industryId: string,
  groupIndex: number,
  position: string,
): string {
  const role = position.trim();
  const roleBrief = buildRoleQuestionsBrief(role);
  const specializedBrief = ROLE_SPECIALIZATIONS.find(({ matches }) => matches.test(role))?.brief;
  const groupBrief = GROUP_CONTEXTS[industryId]?.[groupIndex];

  if (!role && !groupBrief && !specializedBrief) return "";

  return [
    "NGỮ CẢNH CHỈ CHO VỊ TRÍ ĐÃ CHỌN:",
    role ? `Vị trí: ${role}.` : "Vị trí: chưa xác định; dựa vào ngành/nhóm bên dưới.",
    roleBrief ? `\n${roleBrief}\n` : (specializedBrief || groupBrief || "Không có hồ sơ ngành cụ thể; dựa vào CV và yêu cầu vị trí, không giả định kỹ năng không có trong hồ sơ."),
    specializedBrief && groupBrief ? `Bối cảnh nhóm nghề: ${groupBrief}` : "",
    "Dùng đúng ngữ cảnh này để chọn câu hỏi; đối chiếu với CV và kinh nghiệm ứng viên. Không nạp hoặc hỏi lan sang ngành/nhóm nghề khác.",
  ].filter(Boolean).join("\n");
}
