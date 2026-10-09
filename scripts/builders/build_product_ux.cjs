const fs = require('fs');
const path = require('path');

const { uiDesignerQuestions } = require('./product_ux_data.cjs');
const { uxDesignerQuestions } = require('./ux_designer_data.cjs');
const { uxResearcherQuestions } = require('./ux_researcher_data.cjs');
const { productDesignerQuestions } = require('./product_designer_data.cjs');



const productUXBanks = [
  {
    role: "UI Designer",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    aliases: [
      "ui designer",
      "visual designer",
      "thiet ke giao dien",
      "chuyen vien thiet ke ui",
      "ui artist"
    ],
    questions: uiDesignerQuestions
  },
  {
    role: "UX Designer",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    aliases: [
      "ux designer",
      "user experience designer",
      "thiet ke trai nghiem nguoi dung",
      "interaction designer"
    ],
    questions: uxDesignerQuestions
  },
  {
    role: "UX Researcher",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    aliases: [
      "ux researcher",
      "user researcher",
      "nghien cuu nguoi dung",
      "chuyen vien nghien cuu ux"
    ],
    questions: uxResearcherQuestions
  },
  {
    role: "Product Designer",
    group: "productUX",
    groupLabel: "Thiết kế Sản phẩm & UX",
    aliases: [
      "product designer",
      "thiet ke san pham",
      "digital product designer",
      "end to end product designer"
    ],
    questions: productDesignerQuestions
  },


];

const OUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'product-ux.ts');

const content = `import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: Thiết kế Sản phẩm & UX (4 vị trí - 120 câu hỏi)
export const productUXQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(productUXBanks, null, 2)};
`;

fs.writeFileSync(OUT_PATH, content, 'utf8');
console.log(`Đã xuất thành công product-ux.ts (${productUXBanks.length} vị trí, ${productUXBanks.reduce((s, b) => s + b.questions.length, 0)} câu hỏi)`);
