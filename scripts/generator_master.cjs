/**
 * Master entry point for rebuilding the five current interview question banks.
 * Each group builder is the source of truth for its role data.
 */
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const builders = [
  'build_web_mobile.cjs',
  'build_data_ai.cjs',
  'build_testing_qa.cjs',
  'build_cybersecurity.cjs',
  'build_product_ux.cjs'
];

for (const builder of builders) {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'builders', builder)], {
    stdio: 'inherit'
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('All current interview question banks generated successfully.');
