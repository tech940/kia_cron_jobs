import 'dotenv/config';
import { mergeExcelFiles } from '../src/reports/paged-export.js';
import { hyundaiRepairOrderRowToDatabaseRow } from '../src/reports/hyundai-repair-order-schema.js';

const filePath = 'C:\\Users\\HP\\Downloads\\Kia_Cron_Job\\downloads\\report-chunks\\hmil-secondary\\hyundai-repair-order-list\\n6848\\2026-06-01_to_2026-06-30_23-26-18\\hmil_secondary_repair_order_n6848_2026_06_01_to_2026_06_30.xlsx';

const merged = await mergeExcelFiles([filePath]);
console.log(`Portal headers (${merged.headers.length}):\n  ${merged.headers.join('\n  ')}`);

if (merged.rows.length) {
  const dbRow = hyundaiRepairOrderRowToDatabaseRow(merged.rows[0], { dealerCode: 'N6848' });
  
  console.log('\n=== DB row for first portal row ===');
  Object.entries(dbRow).forEach(([k, v]) => {
    console.log(`  ${k}: "${v}"`);
  });

  // Highlight the key columns
  const keyColumns = ['r_o_no', 'dlr_no', 'r_o_date', 'r_o_date_time', 'svc_adv', 'tech_name',
    'labour_amt', 'part_amt', 'other_amt', 'total_amt', 'promise_date_time',
    'gate_pass_time', 'mileage', 'zone', 'region', 'status', 'r_o_status'];

  console.log('\n=== KEY COLUMNS POPULATED ✅ / EMPTY ❌ ===');
  for (const col of keyColumns) {
    const val = dbRow[col];
    const icon = val && val.trim() !== '' ? '✅' : '❌';
    console.log(`  ${icon} ${col}: "${val ?? ''}"`);
  }
}
