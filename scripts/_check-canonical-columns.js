import 'dotenv/config';
import { HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS, HYUNDAI_REPAIR_ORDER_CANONICAL_COLUMNS } from '../src/reports/hyundai-repair-order-schema.js';

// Simulate what normalizeSqlName does (from relational-store.js)
function normalizeSqlName(value, fallback = 'column') {
  const normalized = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  return normalized || fallback;
}

const canonicalColumnNames = HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS.map(h => normalizeSqlName(h, 'column'));
console.log('=== Column names derived from canonical headers ===');
console.log(canonicalColumnNames.join('\n'));

console.log('\n=== Defined CANONICAL_COLUMNS ===');
console.log(HYUNDAI_REPAIR_ORDER_CANONICAL_COLUMNS.join('\n'));

// Compare the two
const fromHeaders = new Set(canonicalColumnNames);
const fromColumns = new Set(HYUNDAI_REPAIR_ORDER_CANONICAL_COLUMNS);

const missingFromHeaders = [...fromColumns].filter(c => !fromHeaders.has(c));
const missingFromColumns = [...fromHeaders].filter(c => !fromColumns.has(c));

console.log('\n=== In COLUMNS but not derived from HEADERS ===');
console.log(missingFromHeaders.join('\n') || 'none');

console.log('\n=== Derived from HEADERS but not in COLUMNS ===');
console.log(missingFromColumns.join('\n') || 'none');
