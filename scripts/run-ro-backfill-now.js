import { createGdmsAccountProfile } from '../src/accounts/gdms-account-profile.js';
import { createGdmsAccountScheduler } from '../src/cron/gdms-account-scheduler.js';
import { clearCheckpoint } from '../src/utils/checkpoint.js';
import { toIsoDate } from '../src/utils/date-range.js';
import { config } from '../src/config.js';

// Force reports filter env variables
process.env.HMIL_REPORTS_TO_RUN = 'hyundai-repair-order-list';
process.env.AM_PLATINUM_REPORTS_TO_RUN = 'hyundai-repair-order-list';

// Helper to run a specific month for a given profile/account object
async function runMonthForAccount(account, startDateStr, endDateStr) {
  console.log(`\n======================================================`);
  console.log(`>>> Starting ${account.logPrefix} for range: ${startDateStr} to ${endDateStr}`);
  console.log(`======================================================`);

  // Direct property overrides to bypass config module caching
  account.reportsToRun = 'hyundai-repair-order-list';
  account.currentMonthOnly = false;
  account.repairOrderStartDate = startDateStr;
  account.repairOrderEndDate = endDateStr;
  account.headless = true;

  // Clear any checkpoint to ensure it runs from scratch
  const checkpointName = `${account.id}-${account.defaultMode}`;
  await clearCheckpoint(checkpointName).catch(() => {});
  
  console.log(`User ID: ${account.userId}`);
  console.log(`Dealers: ${account.dealerCodes.join(', ')}`);
  console.log(`Reports to Run: ${account.reportsToRun}`);
  console.log(`Date range: ${account.repairOrderStartDate} to ${account.repairOrderEndDate}`);
  
  const scheduler = createGdmsAccountScheduler(account);
  await scheduler.run(account.defaultMode);
}

async function main() {
  const today = toIsoDate(new Date());
  
  // Monthly chunks to avoid NDMS portal 31-day search range warnings
  const chunks = [
    { start: '2026-06-01', end: '2026-06-30' },
    { start: '2026-07-01', end: '2026-07-31' },
    { start: '2026-08-01', end: today }
  ];

  console.log('Starting Repair Order List split backfill sequence...');

  // 1. Run for HMIL Secondary (MIS5216)
  for (const chunk of chunks) {
    const hmilSecAccount = createGdmsAccountProfile('hmil-secondary');
    await runMonthForAccount(hmilSecAccount, chunk.start, chunk.end);
  }

  // 2. Run for AM Platinum Current (MIS1988) — N6250
  for (const chunk of chunks) {
    const amPlatBase = createGdmsAccountProfile('am-platinum');
    const amPlatCurrent = {
      ...amPlatBase,
      dealerCodes: ['N6250']
    };
    await runMonthForAccount(amPlatCurrent, chunk.start, chunk.end);
  }

  // 3. Run for AM Platinum Historical (MIS12345) — N5211, N6828
  for (const chunk of chunks) {
    const amPlatBase = createGdmsAccountProfile('am-platinum');
    const amPlatHist = {
      ...amPlatBase,
      id: 'am-platinum-historical',
      displayName: config.amPlatinumHistoricalUserId || 'MIS12345',
      logPrefix: `AM Platinum ${config.amPlatinumHistoricalUserId || 'MIS12345'}`,
      userId: config.amPlatinumHistoricalUserId || 'MIS12345',
      password: config.amPlatinumHistoricalPassword || amPlatBase.password,
      userIdEnvName: 'AM_PLATINUM_HISTORICAL_USER_ID',
      passwordEnvName: 'AM_PLATINUM_HISTORICAL_PASSWORD',
      sessionStatePath: config.amPlatinumHistoricalSessionStatePath,
      dealerCodes: ['N5211', 'N6828']
    };
    await runMonthForAccount(amPlatHist, chunk.start, chunk.end);
  }

  console.log('\nAll backfill sequences successfully complete!');
}

main().catch(error => {
  console.error('Fatal backfill error:', error);
  process.exitCode = 1;
});
