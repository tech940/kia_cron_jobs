#!/usr/bin/env node
import { spawn } from 'child_process';
import { logger } from '../src/utils/logger.js';

function runJob(label, command, args = []) {
  return new Promise((resolve) => {
    console.log(`\n============================================================`);
    console.log(`▶️ STARTING: ${label}`);
    console.log(`   Command: ${command} ${args.join(' ')}`);
    console.log(`============================================================`);

    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, HEADLESS: 'true', NODE_ENV: 'production' }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ COMPLETED: ${label} (Exit code: 0)`);
      } else {
        console.log(`\n⚠️ FINISHED WITH WARNINGS: ${label} (Exit code: ${code})`);
      }
      resolve(code);
    });

    proc.on('error', (err) => {
      console.error(`\n❌ FAILED TO LAUNCH: ${label}`, err.message);
      resolve(1);
    });
  });
}

async function main() {
  console.log('\n============================================================');
  console.log('🌙 RUNNING ALL EVENING CRONS RIGHT NOW (ALL BRANCHES)');
  console.log('============================================================\n');

  // 1. Kia Regular Daily Reports
  await runJob('1/9. Kia Daily Cron Reports', 'node', ['./src/cron/scheduler.js', '--once']);

  // 2. HMIL Hyundai DMS Reports (RO Billing, Repair Orders, etc.)
  await runJob('2/9. Hyundai HMIL DMS Reports', 'node', ['./src/cron/hmil-scheduler.js', '--once']);

  // 3. AM Platinum GDMS Reports (RO Billing, Repair Orders, etc.)
  await runJob('3/9. AM Platinum GDMS Reports', 'node', ['./src/cron/am-platinum-scheduler.js', '--once']);

  // 4. HIIB Insurance Hyundai
  await runJob('4/9. HIIB Insurance Hyundai', 'node', ['./scripts/run-hyundai-insurance-report-once.js', '--account=hiib', '--days=30', '--headless']);

  // 5. HIIB Insurance Platinum
  await runJob('5/9. HIIB Insurance Platinum', 'node', ['./scripts/run-hyundai-insurance-report-once.js', '--account=platinum', '--days=30', '--headless']);

  // 6. Hyundai & Platinum Booking Reports
  await runJob('6/9. Hyundai & Platinum Booking Reports', 'node', ['./scripts/run-hyundai-booking-report.js', '--headless']);

  // 7. Hyundai & Platinum Enquiry Reports
  await runJob('7/9. Hyundai & Platinum Enquiry Reports', 'node', ['./scripts/run-hyundai-enquiry-historical-2006-to-today.js', '--days=30', '--headless']);
  await runJob('7b/9. Platinum Enquiry Report', 'node', ['./scripts/run-platinum-enquiry-report.js', '--days=30', '--headless']);

  // 8. Hyundai & Platinum Purchase Reports
  await runJob('8/9. Hyundai & Platinum Purchase Reports', 'node', ['./scripts/run-hyundai-purchase-report.js', '--days=30', '--headless']);
  await runJob('8b/9. Platinum Purchase Report', 'node', ['./scripts/run-platinum-purchase-report.js', '--days=30', '--headless']);

  // 9. Hyundai Receipt Report
  await runJob('9/9. Hyundai Receipt Report', 'node', ['./scripts/run-hyundai-receipt-report.js', '--days=30', '--headless']);

  console.log('\n============================================================');
  console.log('🎉 ALL EVENING CRONS HAVE COMPLETED EXECUTION');
  console.log('============================================================\n');
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});