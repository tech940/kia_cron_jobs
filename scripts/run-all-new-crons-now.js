import { spawn } from 'child_process';
import { logger } from '../src/utils/logger.js';

function runScript(scriptPath, args = []) {
  return new Promise((resolve) => {
    logger.info(`>>> Starting execution: node ${scriptPath} ${args.join(' ')}`);
    const proc = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, HEADLESS: 'true' }
    });

    proc.on('close', (code) => {
      logger.info(`<<< Finished ${scriptPath} with exit code ${code}`);
      resolve(code);
    });

    proc.on('error', (err) => {
      logger.error(`!!! Error spawning ${scriptPath}: ${err.message}`);
      resolve(1);
    });
  });
}

async function runAllNewCronsNow() {
  console.log('\n============================================================');
  console.log('🚀 RUNNING ALL NEW CRONS RIGHT NOW (HEADLESS, MONTH-WISE)');
  console.log('============================================================\n');

  // 1. HIIB Insurance Hyundai
  await runScript('./scripts/run-hyundai-insurance-report-once.js', ['--account=hiib', '--days=30', '--headless']);

  // 2. HIIB Insurance Platinum
  await runScript('./scripts/run-hyundai-insurance-report-once.js', ['--account=platinum', '--days=30', '--headless']);

  // 3. Hyundai & Platinum Booking Report
  await runScript('./scripts/run-hyundai-booking-report.js', ['--headless']);

  // 4. AM Platinum Sales Report
  await runScript('./scripts/run-platinum-sales-report.js', ['--days=30', '--headless']);

  // 5. Hyundai Sales Report (All Dealers)
  await runScript('./scripts/run-hyundai-sales-historical-all-dealers.js', ['--days=30', '--headless']);

  console.log('\n============================================================');
  console.log('✅ ALL NEW CRONS IMMEDIATE RUN COMPLETED');
  console.log('============================================================\n');
}

runAllNewCronsNow().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error in runner:', err);
  process.exit(1);
});
