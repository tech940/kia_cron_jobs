import 'dotenv/config';
import { mergeExcelFiles } from '../src/reports/paged-export.js';

// Read the first row to see all column headers from the portal export
const filePath = 'C:\\Users\\HP\\Downloads\\Kia_Cron_Job\\downloads\\report-chunks\\hmil-secondary\\hyundai-repair-order-list\\n6848\\2026-06-01_to_2026-06-30_23-26-18\\hmil_secondary_repair_order_n6848_2026_06_01_to_2026_06_30.xlsx';


const merged = await mergeExcelFiles([filePath]);
console.log('=== Portal Excel column headers ===');
console.log(JSON.stringify(merged.headers, null, 2));
if (merged.rows.length) {
  console.log('\n=== Sample row ===');
  console.log(JSON.stringify(merged.rows[0], null, 2));
}
