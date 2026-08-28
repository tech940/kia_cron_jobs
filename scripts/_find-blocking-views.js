import { withPostgresClient } from '../src/supabase/postgres.js';

await withPostgresClient(async (client) => {
  const res = await client.query(`
    SELECT DISTINCT dependent_view.relname AS view_name
    FROM pg_depend
    JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
    JOIN pg_class AS dependent_view ON pg_rewrite.ev_class = dependent_view.oid
    JOIN pg_class AS source_table ON pg_depend.refobjid = source_table.oid
    WHERE source_table.relname = 'am_platinum_service_appointment'
      AND dependent_view.relkind = 'v'
  `);
  console.log('Views blocking am_platinum_service_appointment:', JSON.stringify(res.rows, null, 2));
});
