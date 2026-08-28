import { createGdmsAccountProfile } from '../src/accounts/gdms-account-profile.js';
import { createGdmsAccountScheduler } from '../src/cron/gdms-account-scheduler.js';
import { clearCheckpoint } from '../src/utils/checkpoint.js';
import { config } from '../src/config.js';

// Force date override env variables for July 2026
config.reportDateOverrideStartDate = '2026-07-01';
config.reportDateOverrideEndDate = '2026-07-31';

// Force reports filter env variables
config.hmilReportsToRun = 'hyundai-operation-wise-analysis-report';
config.amPlatinumReportsToRun = 'hyundai-operation-wise-analysis-report';

async function main() {
  const accountId = process.argv[2];
  if (!accountId) {
    console.error('Usage: node scripts/run-op-wise-single.js <hmil-secondary|am-platinum|am-platinum-historical>');
    process.exit(1);
  }

  console.log(`Starting Hyundai Operation Wise Analysis Report July Run for: ${accountId}`);

  let account;
  if (accountId === 'hmil-secondary') {
    account = createGdmsAccountProfile('hmil-secondary');
  } else if (accountId === 'am-platinum') {
    const amPlatBase = createGdmsAccountProfile('am-platinum');
    account = {
      ...amPlatBase,
      dealerCodes: ['N6250']
    };
  } else if (accountId === 'am-platinum-historical') {
    const amPlatBase = createGdmsAccountProfile('am-platinum');
    account = {
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
  } else {
    console.error(`Unknown account ID: ${accountId}`);
    process.exit(1);
  }

  account.reportsToRun = 'hyundai-operation-wise-analysis-report';
  account.currentMonthOnly = false;
  account.headless = true;
  
  // Use the default config-defined OTP provider (which is webhook)
  account.otpProvider = config.otpProvider;

  // Clear checkpoints to ensure it runs cleanly
  const checkpointName = `${account.id}-${account.defaultMode}`;
  await clearCheckpoint(checkpointName).catch(() => {});

  console.log(`User ID: ${account.userId}`);
  console.log(`Dealers: ${account.dealerCodes.join(', ')}`);
  console.log(`Report: hyundai-operation-wise-analysis-report`);
  console.log(`OTP Provider: MANUAL`);

  const scheduler = createGdmsAccountScheduler(account);
  await scheduler.run(account.defaultMode);
  
  console.log(`July Operation Wise Analysis Report run for ${accountId} completed successfully!`);
}

main().catch(error => {
  console.error('Fatal run error:', error);
  process.exitCode = 1;
});
