import { withPostgresClient } from '../src/supabase/postgres.js';

await withPostgresClient(async client => {
  const columns = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'hyundai_repair_order_list'
  `);
  console.log('Columns in hyundai_repair_order_list:', columns.rows.map(r => r.column_name));
});
