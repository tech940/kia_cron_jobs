/**
 * Migration: Fix open_ro_yearly (Kia) datetime column types
 * Must drop the kia_open_ro_yearly view first, alter columns, then recreate.
 */
import 'dotenv/config';
import { quoteIdentifier, withPostgresClient } from '../src/supabase/postgres.js';
import { logger } from '../src/utils/logger.js';

const TABLE = 'open_ro_yearly';
const VIEW = 'kia_open_ro_yearly';

// Columns that need type changes: date -> TEXT (they hold full datetime strings)
const TYPE_CHANGES = [
  ['r_o_date_time',             'TEXT'],
  ['promise_date_time',         'TEXT'],
  ['revised_promise_date_time', 'TEXT'],
  ['closing_date_time',         'TEXT'],
  ['cancel_date',               'TEXT'],
];

// New columns to add
const NEW_COLUMNS = [
  ['main_dealer',           'TEXT'],
  ['main_dlr_name',         'TEXT'],
  ['zone',                  'TEXT'],
  ['region',                'TEXT'],
  ['express_care',          'TEXT'],
  ['sms_status',            'TEXT'],
  ['type_of_free_service',  'TEXT'],
  ['pre_road_test',         'TEXT'],
  ['post_road_test',        'TEXT'],
  ['no_of_repair_panels',   'TEXT'],
  ['no_of_replaced_panels', 'TEXT'],
  ['total_no_of_panels',    'TEXT'],
  ['ro_remarks',            'TEXT'],
];

await withPostgresClient(async (client) => {
  const table = `public.${quoteIdentifier(TABLE)}`;

  // Get existing columns before making changes
  const { rows: existingRows } = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public' and table_name = $1
    order by ordinal_position
  `, [TABLE]);
  const existingCols = new Map(existingRows.map(r => [r.column_name, r.data_type]));

  logger.info(`Migrating ${TABLE}`, { existingColumnCount: existingCols.size });

  // Step 1: Add missing columns (before dropping view, since ADD COLUMN doesn't need it)
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

  // Step 2: Drop the dependent view so we can alter column types
  // Save its definition first
  const { rows: viewDefRows } = await client.query(`
    select pg_get_viewdef('public.${VIEW}', true) as def
  `);
  const viewDef = viewDefRows[0]?.def;
  logger.info(`Dropping view ${VIEW} to allow column type changes`);
  await client.query(`DROP VIEW IF EXISTS public.${quoteIdentifier(VIEW)}`);

  // Step 3: Alter column types
  let typeChanged = 0;
  for (const [colName, newType] of TYPE_CHANGES) {
    const currentType = existingCols.get(colName);
    if (!currentType) continue;

    const pgCurrentType = currentType.toLowerCase();
    if (pgCurrentType === 'text' && newType === 'TEXT') {
      logger.info(`  . Column ${colName} already text, skipping`);
      continue;
    }

    logger.info(`  ~ Changing ${colName}: ${currentType} -> ${newType}`);
    await client.query(`
      ALTER TABLE ${table}
      ALTER COLUMN ${quoteIdentifier(colName)} TYPE ${newType}
      USING ${quoteIdentifier(colName)}::TEXT
    `);
    typeChanged++;
  }

  // Step 4: Get all current column names to rebuild the view correctly
  const { rows: currentCols } = await client.query(`
    select column_name
    from information_schema.columns
    where table_schema = 'public' and table_name = $1
    order by ordinal_position
  `, [TABLE]);
  const allColumns = currentCols.map(r => r.column_name);

  // Step 5: Recreate the view (SELECT all columns from the backing table)
  const colList = allColumns.map(c => quoteIdentifier(c)).join(',\n    ');
  await client.query(`
    CREATE VIEW public.${quoteIdentifier(VIEW)} AS
    SELECT ${colList}
    FROM public.${quoteIdentifier(TABLE)}
  `);
  logger.info(`Recreated view ${VIEW} with ${allColumns.length} columns`);

  logger.info(`Migration complete`, { added, typeChanged });
  console.log('\n=== Migration Results ===');
  console.log(JSON.stringify({ table: TABLE, view: VIEW, added, typeChanged }, null, 2));
  console.log('\nDone! r_o_date_time and related columns are now TEXT.');
  console.log('Existing date-only values were preserved as date strings.');
  console.log('New rows will store full datetime strings like "28/07/2026 11:35:00".');
});
