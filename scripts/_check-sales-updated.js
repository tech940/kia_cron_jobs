import 'dotenv/config';
import { withPostgresClient } from '../src/supabase/postgres.js';

await withPostgresClient(async (client) => {
  const r = await client.query(`
    select date_trunc('minute', uploaded_at) as minute, count(*) as count
    from public.hyundai_sales_report
    where uploaded_at >= now() - interval '24 hours'
    group by minute
    order by minute desc
  `);
  console.log('Rows uploaded in the last 24 hours grouped by minute:');
  console.log(JSON.stringify(r.rows, null, 2));
});
