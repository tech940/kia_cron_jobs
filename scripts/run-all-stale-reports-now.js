import { execSync } from 'node:child_process';
import { logger } from '../src/utils/logger.js';

const jobs = [
  { name: '1/6. Hyundai & Platinum Booking Reports', cmd: 'node ./scripts/run-hyundai-booking-report.js --headless' },
  { name: '2/6. Hyundai Enquiry Report', cmd: 'node ./scripts/run-hyundai-enquiry-historical-2006-to-today.js --days=30 --headless' },
  { name: '3/6. Platinum Enquiry Report', cmd: 'node ./scripts/run-platinum-enquiry-report.js --days=30 --headless' },
  { name: '4/6. Platinum Purchase Report', cmd: 'node ./scripts/run-platinum-purchase-report.js --days=30 --headless' },
  { name: '5/6. Hyundai Purchase Report', cmd: 'node ./scripts/run-hyundai-purchase-report.js --days=30 --headless' },
  { name: '6/6. Hyundai Receipt Report', cmd: 'node ./scripts/run-hyundai-receipt-report.js --days=30 --headless' }
];

async function main() {
  console.log('=== RUNNING ALL STALE REPORTS RIGHT NOW ===\n');

  for (const job of jobs) {
    console.log(`\n>>> Starting ${job.name}...`);
    try {
      execSync(job.cmd, { stdio: 'inherit', cwd: 'c:/Users/HP/Downloads/Kia_Cron_Job' });
      console.log(`✅ ${job.name} Finished Successfully!`);
    } catch (err) {
      console.error(`❌ ${job.name} Encountered an issue:`, err.message);
    }
  }

  console.log('\n=== ALL STALE REPORTS HAVE FINISHED EXECUTING! ===');
}

main().catch(console.error);
