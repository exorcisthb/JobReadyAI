const fs = require('fs');
const path = require('path');

const { secEngineerQuestions } = require('./cybersecurity_data.cjs');
const { pentestQuestions } = require('./sec_offensive_data.cjs');
const { socAnalystQuestions } = require('./sec_defensive_data.cjs');
const { devSecOpsQuestions, grcAnalystQuestions } = require('./sec_grc_arch_data.cjs');

const cybersecurityBanks = [
  {
    role: "Security Engineer",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    aliases: [
      "security engineer",
      "ky su an toan thong tin",
      "cybersecurity engineer",
      "infosec engineer",
      "an ninh mang",
      "sec engineer"
    ],
    questions: secEngineerQuestions
  },
  {
    role: "Penetration Tester (PenTest)",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    aliases: [
      "penetration tester",
      "pentester",
      "pentest",
      "chuyen vien danh gia an ninh mang",
      "ethical hacker",
      "kiem thu bao mat",
      "chuyen vien pentest"
    ],
    questions: pentestQuestions
  },
  {
    role: "SOC Analyst (L1/L2/L3)",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    aliases: [
      "soc analyst",
      "soc analyst l1",
      "soc analyst l2",
      "soc analyst l3",
      "soc analyst (l1/l2/l3)",
      "security operations center analyst",
      "chuyen vien soc",
      "giam sat an ninh mang"
    ],
    questions: socAnalystQuestions
  },
  {
    role: "DevSecOps Engineer",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    aliases: [
      "devsecops engineer",
      "devsecops",
      "ky su devsecops",
      "devops security",
      "ci cd security",
      "security automation engineer"
    ],
    questions: devSecOpsQuestions
  },

  {
    role: "GRC Analyst",
    group: "cybersecurity",
    groupLabel: "An toàn thông tin (Cybersecurity)",
    aliases: [
      "grc analyst",
      "governance risk compliance",
      "chuyen vien grc",
      "compliance analyst",
      "it compliance",
      "chinh sach an toan thong tin",
      "security governance analyst"
    ],
    questions: grcAnalystQuestions
  },

];

const OUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'cybersecurity.ts');

const content = `import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: An toàn thông tin (Cybersecurity) (5 vị trí - 150 câu hỏi)
export const cybersecurityQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(cybersecurityBanks, null, 2)};
`;

fs.writeFileSync(OUT_PATH, content, 'utf8');
console.log(`Đã xuất thành công cybersecurity.ts (${cybersecurityBanks.length} vị trí, ${cybersecurityBanks.reduce((s, b) => s + b.questions.length, 0)} câu hỏi)`);
