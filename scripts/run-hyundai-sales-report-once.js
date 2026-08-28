import { loginToHmilDms } from '../src/auth/hmil-login.js';
import { createGdmsAccountProfile } from '../src/accounts/gdms-account-profile.js';
import { downloadHyundaiSalesReport } from '../src/reports/hyundai-sales-report.js';
import { logger } from '../src/utils/logger.js';
import { config } from '../src/config.js';

const isHeadlessArg = process.argv.includes('--headless') || process.env.HEADLESS === 'true';
process.env.HEADLESS = isHeadlessArg ? 'true' : (config.headless ? 'true' : 'false');

async function main() {
  const account = createGdmsAccountProfile('hmil-secondary');
  account.headless = process.env.HEADLESS === 'true';

  logger.info('Starting Hyundai Sales Report run...', {
    userId: account.userId,
    dealerCodes: account.dealerCodes,
    headless: account.headless
  });

  const session = await loginToHmilDms(account);
  try {
    const result = await downloadHyundaiSalesReport(session.page, {
      dealerCode: account.dealerCodes[0] || 'active',
      account
    });
    logger.info('Hyundai Sales Report completed successfully', result);
  } finally {
    if (session.browser) {
      await session.browser.close().catch(() => {});
    }
  }
}

main().catch(error => {
  logger.error('Hyundai Sales Report run failed', {
    error: error.message,
    stack: error.stack
  });
  process.exitCode = 1;
});
