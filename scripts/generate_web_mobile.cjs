const fs = require('fs');
const path = require('path');

const { feQuestions } = require('./builders/fe_data.cjs');
const { beQuestions } = require('./builders/be_data.cjs');
const { fsQuestions } = require('./builders/fs_data.cjs');
const { mobQuestions } = require('./builders/mob_data.cjs');
const { rnQuestions } = require('./builders/rn_data.cjs');
const { vueNgQuestions } = require('./builders/vue_ng_data.cjs');
const { tsNodeQuestions } = require('./builders/ts_node_data.cjs');

const webMobileQuestionBanks = [
  {
    role: "Frontend Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["frontend developer", "frontend engineer", "front-end developer", "lap trinh vien frontend", "fe dev"],
    questions: feQuestions
  },
  {
    role: "Backend Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["backend developer", "backend engineer", "back-end developer", "lap trinh vien backend", "be dev", "server developer"],
    questions: beQuestions
  },
  {
    role: "Fullstack Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["fullstack developer", "full stack developer", "full-stack developer", "lap trinh vien fullstack"],
    questions: fsQuestions
  },
  {
    role: "Mobile Developer (iOS/Android/Flutter)",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["mobile developer", "flutter developer", "ios developer", "android developer", "mobile app developer"],
    questions: mobQuestions
  },
  {
    role: "React Native Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["react native developer", "react native engineer", "rn developer"],
    questions: rnQuestions
  },
  {
    role: "Vue.js / Angular Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["vue developer", "angular developer", "vue.js developer", "angular engineer"],
    questions: vueNgQuestions
  },
  {
    role: "TypeScript / Node.js Developer",
    group: "webMobile",
    groupLabel: "Lập trình Web & Mobile",
    aliases: ["typescript developer", "node.js developer", "nodejs developer", "backend typescript engineer"],
    questions: tsNodeQuestions
  }
];

const outDir = path.join(__dirname, '..', 'src', 'data', 'interview-questions');
const targetFile = path.join(outDir, 'web-mobile.ts');

const tsContent = `import { RoleQuestionBank } from './types';\n\n` +
  `// Danh mục câu hỏi chuyên môn cho nhóm nghề: Lập trình Web & Mobile (7 vị trí - 210 câu hỏi)\n` +
  `export const webMobileQuestionBanks: RoleQuestionBank[] = ${JSON.stringify(webMobileQuestionBanks, null, 2)};\n`;

fs.writeFileSync(targetFile, tsContent, 'utf8');
console.log(`Saved web-mobile.ts successfully with ${webMobileQuestionBanks.length} roles, total questions: ${webMobileQuestionBanks.reduce((sum, r) => sum + r.questions.length, 0)}`);
