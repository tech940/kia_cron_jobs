/**
 * Migration: Add missing repair order columns and fix r_o_date_time type
 *
 * Adds all new portal-exported columns that were previously discarded,
 * and fixes the r_o_date_time column type from DATE to TEXT since it holds
 * full datetime strings like "06/06/2026 13:08:09".
 */
import 'dotenv/config';
import { quoteIdentifier, withPostgresClient } from '../src/supabase/postgres.js';
import { logger } from '../src/utils/logger.js';

const TABLES = ['hyundai_repair_order_list', 'am_platinum_repair_order_list'];

// All new columns to add (name, SQL type)
const NEW_COLUMNS = [
  // New identity/location columns
  ['main_dealer',           'TEXT'],
  ['main_dlr_name',         'TEXT'],
  ['zone',                  'TEXT'],
  ['region',                'TEXT'],
  // r_o_date_time is TEXT (full datetime string e.g. "06/06/2026 13:08:09")
  ['r_o_date_time',         'TEXT'],
  // Vehicle
  ['mileage',               'NUMERIC'],
  // Service status
  ['new_r_o_status',        'TEXT'],
  ['express_care',          'TEXT'],
  ['sms_status',            'TEXT'],
  ['type_of_free_service',  'TEXT'],
  ['pre_road_test',         'TEXT'],
  ['post_road_test',        'TEXT'],
  // Financials
  ['labour_amt',            'NUMERIC'],
  ['part_amt',              'NUMERIC'],
  ['other_amt',             'NUMERIC'],
  ['total_amt',             'NUMERIC'],
  ['estimate_no',           'TEXT'],
  ['estimate_amt',          'NUMERIC'],
  // Timing (stored as text to preserve full datetime strings)
  ['gate_pass_time',        'TEXT'],
  ['promise_date_time',     'TEXT'],
  ['revised_promise_date_time', 'TEXT'],
  ['closing_date_time',     'TEXT'],
  // Cancellation
  ['cancel_date',           'TEXT'],
  ['cancel_reason',         'TEXT'],
  ['cancel_emp_id',         'TEXT'],
  // Insurance / Body
  ['insurance_company_name','TEXT'],
  ['surveyor_name',         'TEXT'],
  ['no_of_repair_panels',   'TEXT'],
  ['no_of_replaced_panels', 'TEXT'],
  ['total_no_of_panels',    'TEXT'],
  // Misc
  ['user_name',             'TEXT'],
  ['delay_reason',          'TEXT'],
  ['ro_remarks',            'TEXT'],
  ['pick_drop',             'TEXT'],
  ['avg_rating',            'TEXT'],
  ['feed_back_status',      'TEXT'],
  ['task_description',      'TEXT'],
  ['re_open_count',         'NUMERIC'],
  ['ro_sub_status',         'TEXT'],
];

// Columns that need type changes (column -> new type)
// r_o_date_time was previously DATE but must be TEXT
const TYPE_CHANGES = [
  ['r_o_date_time',         'TEXT'],
  ['gate_pass_time',        'TEXT'],
  ['promise_date_time',     'TEXT'],
  ['revised_promise_date_time', 'TEXT'],
  ['closing_date_time',     'TEXT'],
  ['cancel_date',           'TEXT'],
];

async function migrateTable(client, tableName) {
  const table = `public.${quoteIdentifier(tableName)}`;

  // 1. Get existing columns
  const { rows: existingRows } = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public' and table_name = $1
  `, [tableName]);
  const existingCols = new Map(existingRows.map(r => [r.column_name, r.data_type]));

  logger.info(`Migrating ${tableName}`, { existingColumnCount: existingCols.size });

  // 2. Add missing columns
  let added = 0;
  for (const [colName, colType] of NEW_COLUMNS) {
    if (!existingCols.has(colName)) {
      await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${quoteIdentifier(colName)} ${colType}`);
      logger.info(`  + Added column: ${colName} (${colType})`);
      added++;
    } else {
      logger.info(`  . Skipping existing column: ${colName}`);
    }
  }

  // 3. Fix column types (e.g. r_o_date_time: DATE -> TEXT)
  let typeChanged = 0;
  for (const [colName, newType] of TYPE_CHANGES) {
    const currentType = existingCols.get(colName);
    if (!currentType) continue; // doesn't exist, was just added
    
    const pgNewType = newType.toLowerCase().replace('text', 'text').replace('numeric', 'numeric');
    const pgCurrentType = currentType.toLowerCase();
    
    // Skip if already correct type
    if (pgCurrentType === 'text' && newType === 'TEXT') continue;
    if ((pgCurrentType === 'numeric' || pgCurrentType === 'double precision') && newType === 'NUMERIC') continue;

    logger.info(`  ~ Changing ${colName} from ${currentType} to ${newType}`);
    await client.query(`
      ALTER TABLE ${table}
      ALTER COLUMN ${quoteIdentifier(colName)} TYPE ${newType}
      USING ${quoteIdentifier(colName)}::TEXT
    `);
    typeChanged++;
  }

  // 4. Rename 'total' column to 'total_amt' if it exists and total_amt doesn't
  if (existingCols.has('total') && !existingCols.has('total_amt')) {
    await client.query(`ALTER TABLE ${table} RENAME COLUMN "total" TO "total_amt"`);
    logger.info(`  ~ Renamed column: total -> total_amt`);
  }

  logger.info(`Migration complete for ${tableName}`, { added, typeChanged });
  return { tableName, added, typeChanged };
}

const results = await withPostgresClient(async (client) => {
  const summaries = [];
  for (const tableName of TABLES) {
    summaries.push(await migrateTable(client, tableName));
  }
  return summaries;
});

console.log('\n=== Migration Results ===');
console.log(JSON.stringify(results, null, 2));
console.log('\nDone! New columns added. Next repair order run will populate them.');
