/**
 * Script biên soạn & sinh dữ liệu ngân hàng câu hỏi chuẩn cho 5 nhóm nghề phù hợp Intern/Fresher
 * Mỗi vị trí đảm bảo:
 * - >= 30 câu hỏi chuyên sâu riêng biệt
 * - 5 nhóm: foundation (>=6), practical_skills (>=8), scenario (>=6), cv_validation (>=5), behavioral (>=5)
 * - Đầy đủ id, role, category, difficulty, seniority, question, evaluationCriteria (3-5), followUps (1-2), tags, sourceRefs, redFlags
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src', 'data', 'interview-questions');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Danh sách vị trí được giữ lại
const ROLES_BY_GROUP = {
  webMobile: [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Mobile Developer (iOS/Android/Flutter)",
    "React Native Developer",
    "Vue.js / Angular Developer",
    "TypeScript / Node.js Developer"
  ],
  dataAI: [
    "Data Engineer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI / LLM Engineer",
    "NLP Engineer",
    "Computer Vision Engineer",
    "Business Intelligence (BI)",
    "Analytics Engineer",
  ],
  testingQA: [
    "QA Engineer",
    "Automation Tester (Selenium/Playwright)",
    "QC Specialist",
    "SDET (Software Dev Engineer in Test)"
  ],
  cybersecurity: [
    "Security Engineer",
    "Penetration Tester (PenTest)",
    "SOC Analyst (L1/L2/L3)",
    "DevSecOps Engineer",
    "GRC Analyst",
  ],
  productUX: [
    "UI Designer",
    "UX Designer",
    "UX Researcher",
    "Product Designer",
  ]
};

console.log("Roles mapped:", Object.keys(ROLES_BY_GROUP).map(k => `${k}: ${ROLES_BY_GROUP[k].length}`).join(', '));
