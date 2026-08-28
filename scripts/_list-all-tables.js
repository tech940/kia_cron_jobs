import 'dotenv/config';
import { withPostgresClient } from '../src/supabase/postgres.js';

const tables = [
  'hyundai_sales_report',
  'hyundai_enquiry_report',
  'hyundai_purchase_report',
  'hyundai_receipt_report'
];

await withPostgresClient(async (client) => {
  for (const tableName of tables) {
    const r1 = await client.query(`
      select column_name, data_type
      from information_schema.columns
      where table_schema = 'public' and table_name = $1
      order by ordinal_position
    `, [tableName]);
    console.log(`\n=== ${tableName} (${r1.rows.length} columns) ===`);
    console.log(r1.rows.map(r => `  ${r.column_name} (${r.data_type})`).join('\n'));

    try {
      const r2 = await client.query(`select count(*) as total from public."${tableName}"`);
      console.log(`  Total rows: ${r2.rows[0].total}`);
      
      const r3 = await client.query(`select * from public."${tableName}" limit 1`);
      if (r3.rows.length) {
        console.log(`  Sample keys: ${Object.keys(r3.rows[0]).join(', ')}`);
      }
    } catch (e) {
      console.log(`  Failed to query rows: ${e.message}`);
    }
  }
});
