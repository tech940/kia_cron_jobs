import { spawn } from 'child_process';
import { logger } from '../src/utils/logger.js';
import { toIsoDate } from '../src/utils/date-range.js';

function getOneYearAgoStartDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return toIsoDate(d);
}

function runScript(scriptPath, args = []) {
  return new Promise((resolve) => {
    logger.info(`>>> Starting 1-Year Backfill Execution: node ${scriptPath} ${args.join(' ')}`);
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

async function runPlatinum1YearBackfill() {
  const startDate = getOneYearAgoStartDate();
  console.log('\n============================================================');
  console.log(`🚀 RUNNING AM PLATINUM 1-YEAR BACKFILL (${startDate} -> Today)`);
  console.log('============================================================\n');

  // 1. AM Platinum Enquiry Report (1 Year)
  await runScript('./scripts/run-platinum-enquiry-report.js', [`--start=${startDate}`, '--headless']);

  // 2. AM Platinum Purchase Report (1 Year)
  await runScript('./scripts/run-platinum-purchase-report.js', [`--start=${startDate}`, '--headless']);

  console.log('\n============================================================');
  console.log('✅ AM PLATINUM 1-YEAR BACKFILL RUN FINISHED');
  console.log('============================================================\n');
}

runPlatinum1YearBackfill().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error in 1-year backfill runner:', err);
  process.exit(1);
});
