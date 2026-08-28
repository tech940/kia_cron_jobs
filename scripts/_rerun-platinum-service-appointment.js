import { createGdmsAccountProfile } from '../src/accounts/gdms-account-profile.js';
import { createGdmsAccountScheduler } from '../src/cron/gdms-account-scheduler.js';

// Run only service-appointment for all platinum dealers
process.env.AM_PLATINUM_REPORTS_OVERRIDE = 'hyundai-service-appointment';

const account = createGdmsAccountProfile('am-platinum');
const scheduler = createGdmsAccountScheduler(account);

await scheduler.run(account.defaultMode);
