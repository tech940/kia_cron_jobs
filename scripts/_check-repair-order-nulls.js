import 'dotenv/config';
import { withPostgresClient } from '../src/supabase/postgres.js';


await withPostgresClient(async (client) => {
  // Check hyundai_repair_order_list schema
  const r1 = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'hyundai_repair_order_list'
    order by ordinal_position
  `);
  console.log('=== hyundai_repair_order_list columns ===');
  console.log(r1.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n'));

  // Check am_platinum_repair_order_list schema
  const r2 = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'am_platinum_repair_order_list'
    order by ordinal_position
  `);
  console.log('\n=== am_platinum_repair_order_list columns ===');
  console.log(r2.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n'));

  // Sample rows to see what data exists (check for nulls)
  const r3 = await client.query(`
    select * from public.hyundai_repair_order_list limit 3
  `);
  console.log('\n=== Sample hyundai_repair_order_list row keys ===');
  if (r3.rows.length) console.log(Object.keys(r3.rows[0]).join(', '));

  // Count nulls in key columns  
  const r4 = await client.query(`
    select
      count(*) as total,
      count(r_o_date) as has_r_o_date,
      count(r_o_no) as has_r_o_no,
      count(reg_no) as has_reg_no,
      count(vin) as has_vin
    from public.hyundai_repair_order_list
  `);
  console.log('\n=== hyundai_repair_order_list null stats ===');
  console.log(JSON.stringify(r4.rows[0], null, 2));

  const r5 = await client.query(`
    select
      count(*) as total,
      count(r_o_date) as has_r_o_date,
      count(r_o_no) as has_r_o_no,
      count(reg_no) as has_reg_no,
      count(vin) as has_vin
    from public.am_platinum_repair_order_list
  `);
  console.log('\n=== am_platinum_repair_order_list null stats ===');
  console.log(JSON.stringify(r5.rows[0], null, 2));

  // Show a sample row from hyundai that has r_o_date to see full structure
  const r6 = await client.query(`
    select * from public.hyundai_repair_order_list
    where r_o_date is not null
    limit 1
  `);
  if (r6.rows.length) {
    console.log('\n=== Sample row with r_o_date ===');
    console.log(JSON.stringify(r6.rows[0], null, 2));
  }
});
