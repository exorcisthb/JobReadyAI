const path = require('path');
const fs = require('fs');

const builderFiles = [
  'fe_data.cjs',
  'be_data.cjs',
  'fs_data.cjs',
  'mob_data.cjs',
  'rn_data.cjs',
  'ts_node_data.cjs',
  'vue_ng_data.cjs',
  'data_eng_analytics_data.cjs',
  'data_analyst_bi_data.cjs',
  'data_science_ml_data.cjs',
  'ai_llm_nlp_cv_data.cjs',
  'qa_data.cjs',
  'qc_data.cjs',
  'auto_test_data.cjs',
  'sdet_data.cjs',
  'cybersecurity_data.cjs',
  'sec_defensive_data.cjs',
  'sec_offensive_data.cjs',
  'sec_grc_arch_data.cjs',
  'product_ux_data.cjs',
  'ux_designer_data.cjs',
  'ux_researcher_data.cjs',
  'product_designer_data.cjs',
];

let issues = [];

builderFiles.forEach(file => {
  const filePath = path.join(__dirname, 'builders', file);
  try {
    const mod = require(filePath);
    Object.keys(mod).forEach(exportKey => {
      const val = mod[exportKey];
      if (Array.isArray(val)) {
        val.forEach((q, idx) => {
          if (!q || !q.id) return;
          if (!q.evaluationCriteria || q.evaluationCriteria.length < 3) {
            issues.push({ file, id: q.id, issue: `evaluationCriteria length = ${q.evaluationCriteria ? q.evaluationCriteria.length : 0}` });
          }
          if (!q.redFlags || q.redFlags.length === 0) {
            issues.push({ file, id: q.id, issue: 'missing redFlags' });
          }
          if (!q.followUps || q.followUps.length === 0) {
            issues.push({ file, id: q.id, issue: 'missing followUps' });
          }
          if (!q.tags || q.tags.length === 0) {
            issues.push({ file, id: q.id, issue: 'missing tags' });
          }
          if (!q.sourceRefs || q.sourceRefs.length === 0) {
            issues.push({ file, id: q.id, issue: 'missing sourceRefs' });
          }
        });
      }
    });
  } catch (err) {
    console.error(`Error loading ${file}:`, err.message);
  }
});

console.log(`Found ${issues.length} issues:`);
issues.forEach(i => console.log(`[${i.file}] ${i.id}: ${i.issue}`));
