const ENGLISH_ROLE_LABELS: Record<string, string> = {
  "Chuyên viên tín dụng": "Credit Officer",
  "Chuyên viên thẩm định": "Credit Appraisal Analyst",
  "Kiểm toán nội bộ": "Internal Auditor",
  "Kiểm toán viên (Big4)": "Big Four Auditor",
  "Chuyên viên đầu tư": "Investment Specialist",
  "Chuyên viên xuất nhập khẩu": "Import/Export Specialist",
};

export function displayInterviewRole(role: string, language: string) {
  return language === "en" ? ENGLISH_ROLE_LABELS[role] || role : role;
}
