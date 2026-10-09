const fs = require('fs');
const path = require('path');

const { dataEngineerQuestions, analyticsEngineerQuestions } = require('./data_eng_analytics_data.cjs');
const { dataAnalystQuestions, biQuestions } = require('./data_analyst_bi_data.cjs');
const { dataScientistQuestions, mlEngineerQuestions } = require('./data_science_ml_data.cjs');
const { aiLlmQuestions, nlpQuestions, computerVisionQuestions } = require('./ai_llm_nlp_cv_data.cjs');

const dataAIBanks = [
  {
    role: "Data Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "data engineer",
      "ky su du lieu",
      "data pipeline engineer",
      "big data engineer",
      "ky su big data",
      "de"
    ],
    questions: dataEngineerQuestions
  },
  {
    role: "Data Analyst",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "data analyst",
      "chuyen vien phan tich du lieu",
      "phan tich du lieu",
      "product data analyst",
      "da",
      "analytics analyst"
    ],
    questions: dataAnalystQuestions
  },
  {
    role: "Data Scientist",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "data scientist",
      "nha khoa hoc du lieu",
      "khoa hoc du lieu",
      "applied data scientist",
      "ds"
    ],
    questions: dataScientistQuestions
  },
  {
    role: "Machine Learning Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "machine learning engineer",
      "ky su machine learning",
      "ml engineer",
      "mle",
      "machine learning"
    ],
    questions: mlEngineerQuestions
  },
  {
    role: "AI / LLM Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "ai / llm engineer",
      "ai engineer",
      "llm engineer",
      "ky su ai",
      "ky su llm",
      "generative ai engineer",
      "genai engineer",
      "ai / llm"
    ],
    questions: aiLlmQuestions
  },
  {
    role: "NLP Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "nlp engineer",
      "natural language processing engineer",
      "ky su xu ly ngon ngu tu nhien",
      "computational linguist",
      "nlp"
    ],
    questions: nlpQuestions
  },
  {
    role: "Computer Vision Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "computer vision engineer",
      "cv engineer",
      "ky su thi giac may tinh",
      "vision engineer",
      "image processing engineer"
    ],
    questions: computerVisionQuestions
  },
  {
    role: "Business Intelligence (BI)",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "business intelligence (bi)",
      "business intelligence",
      "bi developer",
      "bi analyst",
      "chuyen vien bi",
      "power bi developer",
      "tableau developer"
    ],
    questions: biQuestions
  },
  {
    role: "Analytics Engineer",
    group: "dataAI",
    groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
    aliases: [
      "analytics engineer",
      "ky su phan tich",
      "dbt engineer",
      "data modeling engineer",
      "analytics engineering"
    ],
    questions: analyticsEngineerQuestions
  },

];

const OUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'interview-questions', 'data-ai.ts');

const content = `import { RoleQuestionBank } from './types';

// Danh mục câu hỏi chuyên môn cho nhóm nghề: Dữ liệu & Trí tuệ nhân tạo (AI) (9 vị trí - 270 câu hỏi)
export const dataAIQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(dataAIBanks, null, 2)};
`;

fs.writeFileSync(OUT_PATH, content, 'utf8');
console.log(`Đã xuất thành công data-ai.ts (${dataAIBanks.length} vị trí, ${dataAIBanks.reduce((s, b) => s + b.questions.length, 0)} câu hỏi)`);
