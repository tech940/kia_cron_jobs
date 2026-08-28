import 'dotenv/config';
import { withPostgresClient } from '../src/supabase/postgres.js';

await withPostgresClient(async (client) => {
  // Check open_ro_yearly backing table
  const r1 = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public' and table_name = 'open_ro_yearly'
    order by ordinal_position
  `);
  console.log('=== open_ro_yearly columns ===');
  console.log(r1.rows.map(r => `  ${r.column_name} (${r.data_type})`).join('\n'));

  const r2 = await client.query(`select count(*) from public.open_ro_yearly`);
  console.log(`\nTotal rows: ${r2.rows[0].count}`);

  const r3 = await client.query(`select * from public.open_ro_yearly order by id desc limit 1`);
  if (r3.rows.length) {
    console.log('\n=== Latest row ===');
    const nullCols = Object.entries(r3.rows[0]).filter(([,v]) => v === null).map(([k]) => k);
    console.log('Non-null values:');
    Object.entries(r3.rows[0]).filter(([,v]) => v !== null).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
    console.log('Null columns:', nullCols.join(', '));
  }
});
