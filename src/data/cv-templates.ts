// CV Template Types and Data
// Extracted to avoid circular dependencies

export interface CVTemplateColor {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  layout: string;
  tags: string[];
  colors: CVTemplateColor[];
  component?: React.ComponentType<any>;
}

// Template metadata only (components loaded separately)
export const cvTemplateMetadata: Omit<CVTemplate, 'component'>[] = [
  {
    id: "modern-1",
    name: "Hiện Đại 1",
    description: "Layout chia cột hiện đại, cân bằng, rõ ràng và trang nhã",
    style: "simple",
    layout: "modern-split",
    tags: ["ATS", "Đơn giản"],
    colors: [
      { primaryColor: "#991b1b", secondaryColor: "#c2410c", accentColor: "#f97316", textColor: "#FFFFFF" },
      { primaryColor: "#1e3a8a", secondaryColor: "#2563eb", accentColor: "#60a5fa", textColor: "#FFFFFF" },
      { primaryColor: "#115e59", secondaryColor: "#0f766e", accentColor: "#14b8a6", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "impressive-4",
    name: "Ấn tượng 4",
    description: "Sidebar nhạt trang nhã, đánh giá kỹ năng bằng điểm chấm tròn nổi bật",
    style: "impressive",
    layout: "sidebar-light",
    tags: ["ATS", "Đơn giản", "Hiện đại"],
    colors: [
      { primaryColor: "#065f46", secondaryColor: "#047857", accentColor: "#10b981", textColor: "#FFFFFF" },
      { primaryColor: "#581c87", secondaryColor: "#6b21a8", accentColor: "#a855f7", textColor: "#FFFFFF" },
      { primaryColor: "#374151", secondaryColor: "#4b5563", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "student-3",
    name: "Sinh viên 3",
    description: "Cấu trúc cột dọc năng động kèm sơ đồ timeline thời gian tròn ấn tượng",
    style: "designer",
    layout: "timeline-blue",
    tags: ["ATS", "Chuyên nghiệp", "Hiện đại"],
    colors: [
      { primaryColor: "#1d4ed8", secondaryColor: "#1e40af", accentColor: "#3b82f6", textColor: "#FFFFFF" },
      { primaryColor: "#b45309", secondaryColor: "#d97706", accentColor: "#f59e0b", textColor: "#FFFFFF" },
      { primaryColor: "#7c2d12", secondaryColor: "#9a3412", accentColor: "#ea580c", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "outstanding-10",
    name: "Outstanding 10",
    description: "Thiết kế sidebar tối ấn tượng, tương phản và cực kỳ nổi bật",
    style: "professional",
    layout: "sidebar-dark",
    tags: ["ATS", "Chuyên nghiệp"],
    colors: [
      { primaryColor: "#0f766e", secondaryColor: "#115e59", accentColor: "#14b8a6", textColor: "#FFFFFF" },
      { primaryColor: "#1e293b", secondaryColor: "#334155", accentColor: "#64748b", textColor: "#FFFFFF" },
      { primaryColor: "#311084", secondaryColor: "#3730a3", accentColor: "#6366f1", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "gradient-1",
    name: "Gradient 1",
    description: "Header gradient sắc nét, hiện đại, thanh lịch và cuốn hút",
    style: "impressive",
    layout: "gradient-header",
    tags: ["ATS", "Ấn tượng"],
    colors: [
      { primaryColor: "#4f46e5", secondaryColor: "#db2777", accentColor: "#f43f5e", textColor: "#FFFFFF" },
      { primaryColor: "#0f766e", secondaryColor: "#0284c7", accentColor: "#06b6d4", textColor: "#FFFFFF" },
      { primaryColor: "#111827", secondaryColor: "#374151", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "passion-1",
    name: "Đam mê",
    description: "Cột đơn tinh gọn, thanh tiêu đề viền đôi gạch chân thanh mảnh",
    style: "harvard",
    layout: "passion-clean",
    tags: ["ATS", "Ấn tượng"],
    colors: [
      { primaryColor: "#1f2937", secondaryColor: "#4b5563", accentColor: "#f59e0b", textColor: "#FFFFFF" },
      { primaryColor: "#881337", secondaryColor: "#9f1239", accentColor: "#fb7185", textColor: "#FFFFFF" },
      { primaryColor: "#064e3b", secondaryColor: "#047857", accentColor: "#34d399", textColor: "#FFFFFF" }
    ]
  },
];

// Helper to get template metadata by ID
export function getTemplateMetadata(templateId: string) {
  return cvTemplateMetadata.find(t => t.id === templateId);
}
