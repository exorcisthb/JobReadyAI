const fs = require('fs');
const path = require('path');

const { qaQuestions } = require('./qa_data.cjs');
const { autoTestQuestions } = require('./auto_test_data.cjs');
const { qcQuestions } = require('./qc_data.cjs');
const { sdetQuestions } = require('./sdet_data.cjs');

const testingQABanks = [
  {
    role: "QA Engineer",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    aliases: [
      "qa engineer",
      "quality assurance engineer",
      "software tester",
      "kiem thu vien",
      "qa",
      "manual qa",
      "ky su dam bao chat luong"
    ],
    questions: qaQuestions
  },
  {
    role: "Automation Tester (Selenium/Playwright)",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    aliases: [
      "automation tester",
      "automation test engineer",
      "selenium tester",
      "playwright tester",
      "kiem thu tu dong",
      "automation qa"
    ],
    questions: autoTestQuestions
  },
  {
    role: "QC Specialist",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    aliases: [
      "qc specialist",
      "quality control specialist",
      "chuyen vien qc",
      "qc",
      "software qc"
    ],
    questions: qcQuestions
  },
  {
    role: "SDET (Software Dev Engineer in Test)",
    group: "testingQA",
    groupLabel: "Kiểm thử & Chất lượng",
    aliases: [
      "sdet",
      "software development engineer in test",
      "software dev engineer in test",
      "test automation architect",
      "ky su phat trien kiem thu"
    ],
    questions: sdetQuestions
  }
];

const OUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'testing-qa.ts');

const content = `import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: Kiểm thử & Chất lượng (4 vị trí - 120 câu hỏi)
export const testingQAQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(testingQABanks, null, 2)};
`;

fs.writeFileSync(OUT_PATH, content, 'utf8');
console.log(`Đã xuất thành công testing-qa.ts (${testingQABanks.length} vị trí, ${testingQABanks.reduce((s, b) => s + b.questions.length, 0)} câu hỏi)`);
