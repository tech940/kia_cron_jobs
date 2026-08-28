import { withPostgresClient } from '../src/supabase/postgres.js';

await withPostgresClient(async (client) => {
  // Fix the date columns that need to be TEXT
  const dateColumns = ['b_t_date_time', 'web_booking_date'];

  for (const col of dateColumns) {
    console.log(`Altering column ${col} to TEXT...`);
    await client.query(`
      ALTER TABLE am_platinum_service_appointment
      ALTER COLUMN "${col}" TYPE TEXT USING "${col}"::text
    `);
    console.log(`Column ${col} altered to TEXT.`);
  }

  // Recreate the view with the same definition
  console.log('\nRecreating view...');
  await client.query(`
    CREATE VIEW am_platinum_service_appointment_resolved_v1 AS
    SELECT id,
      row_hash,
      source_dealer_code,
      no,
      booking_done_on,
      service_advisor,
      b_t_no,
      b_t_date_time,
      customer,
      booking_contact_no,
      mobile,
      reg_no,
      vin,
      work_type,
      status,
      quick_service,
      qs_conf_done_by_sa,
      pick_up,
      web_booking_ref_no,
      web_booking_date,
      web_booking_time_requested,
      web_booking_confirm,
      reminder,
      hyper_local,
      uploaded_at,
      dealer_code,
        CASE
            WHEN NULLIF(NULLIF(upper(TRIM(BOTH FROM COALESCE(source_dealer_code, ''))), ''), 'ACTIVE') IS NOT NULL
              THEN NULLIF(NULLIF(upper(TRIM(BOTH FROM COALESCE(source_dealer_code, ''))), ''), 'ACTIVE')
            WHEN (EXISTS (
               SELECT 1
               FROM am_platinum_service_appointment explicit_row
              WHERE upper(TRIM(BOTH FROM COALESCE(explicit_row.source_dealer_code, ''))) = 'N6250'
                AND explicit_row.b_t_date_time = source.b_t_date_time
                AND COALESCE(NULLIF(TRIM(BOTH FROM explicit_row.b_t_no), ''), NULLIF(TRIM(BOTH FROM explicit_row.vin), ''), NULLIF(TRIM(BOTH FROM explicit_row.reg_no), ''))
                  = COALESCE(NULLIF(TRIM(BOTH FROM source.b_t_no), ''), NULLIF(TRIM(BOTH FROM source.vin), ''), NULLIF(TRIM(BOTH FROM source.reg_no), ''))
            )) THEN 'N6250'
            ELSE 'UNMAPPED'
        END AS resolved_dealer_code
   FROM am_platinum_service_appointment source
  `);
  console.log('View recreated successfully.');
});
