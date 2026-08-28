import { withPostgresClient } from '../src/supabase/postgres.js';

async function findTables() {
  await withPostgresClient(async (c) => {
    const res = await c.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE 'am_platinum_%' OR table_name LIKE '%enquiry%' OR table_name LIKE '%purchase%'
      ORDER BY table_name
    `);
    console.log('=== MATCHING POSTGRES TABLES ===\n');
    console.table(res.rows);

    for (const row of res.rows) {
      try {
        const cnt = await c.query(`SELECT count(*) as total, max(uploaded_at) as last_uploaded FROM ${row.table_name}`);
        console.log(`Table: ${row.table_name}`, cnt.rows[0]);
      } catch(e) {}
    }
  });
}

findTables().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
