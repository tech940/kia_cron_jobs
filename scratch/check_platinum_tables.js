import { withPostgresClient } from '../src/supabase/postgres.js';

async function checkPlatinumTables() {
  await withPostgresClient(async (c) => {
    console.log('=================== AM PLATINUM NEW TABLES AUDIT ===================\n');

    try {
      const res1 = await c.query('SELECT count(*) as total_rows, max(uploaded_at) as last_uploaded FROM am_platinum_enquiry_report');
      console.log('Table: am_platinum_enquiry_report');
      console.table(res1.rows);
    } catch (err) {
      console.log('am_platinum_enquiry_report error:', err.message);
    }

    try {
      const res2 = await c.query('SELECT count(*) as total_rows, max(uploaded_at) as last_uploaded FROM am_platinum_purchase_report');
      console.log('Table: am_platinum_purchase_report');
      console.table(res2.rows);
    } catch (err) {
      console.log('am_platinum_purchase_report error:', err.message);
    }
  });
}

checkPlatinumTables().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
