import { config } from '../config.js';
import { openKiaClaimManagementReport } from '../navigation/kia-menu.js';
import { fillDate, clickSearch } from './report-actions.js';
import { saveReportSheetToRelationalTable } from '../supabase/relational-store.js';
import { logger } from '../utils/logger.js';

function formatDateForPortal(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getMonthlyChunks(startDateStr) {
  const start = new Date(startDateStr);
  const today = new Date();
  const chunks = [];

  let curr = new Date(start.getFullYear(), start.getMonth(), 1);
  while (curr <= today) {
    const monthEnd = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
    const chunkStart = curr < start ? start : curr;
    const chunkEnd = monthEnd > today ? today : monthEnd;

    chunks.push({
      startPortal: formatDateForPortal(chunkStart),
      endPortal: formatDateForPortal(chunkEnd)
    });

    curr = new Date(curr.getFullYear(), curr.getMonth() + 1, 1);
  }

  return chunks;
}

export async function downloadKiaClaimManagementReport(page, { dealerCode = 'active', mode = 'configured' } = {}) {
  logger.info('Starting Kia Claim Management direct Kendo extraction...', { dealerCode, mode });

  await openKiaClaimManagementReport(page);

  const frame = page.frames().find(f => f.url().includes('selectClaimsListMain')) || page;

  const backfillStart = config.kiaClaimManagementBackfillStartDate || '2025-08-01';
  const chunks = getMonthlyChunks(backfillStart);
  logger.info('Claims Mgt chunks prepared', { chunkCount: chunks.length, backfillStart });

  const headers = [
    'SR. No',
    'Invoice No',
    'Invoice Confirm Date',
    'Delivery Date',
    'Dealer',
    'Promotion',
    'clmmClmmNo',
    'Claim Status',
    'Claim Save Date',
    'Claim Submit Date',
    'Model',
    'Variant',
    'VIN',
    'Registration Name',
    'Last Date to claim',
    'Rest No claim',
    'Insurance verfication status',
    'Bill To Name',
    'Ship To Name'
  ];

  let totalExtractedRows = 0;
  const allRows = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    logger.info(`Processing Claims Mgt chunk ${i + 1}/${chunks.length}`, {
      start: chunk.startPortal,
      end: chunk.endPortal
    });

    await fillDate(frame, '#sInvoiceConfirmStDt', chunk.startPortal);
    await fillDate(frame, '#sInvoiceConfirmEdDt', chunk.endPortal);
    await clickSearch(frame);

    // Wait for Kendo grid AJAX to complete
    await frame.waitForFunction(() => {
      const grid = window.$ ? $('#grid').data('kendoExtGrid') || $('#grid').data('kendoGrid') : null;
      return grid && grid.element && !grid.element.find('.k-loading-mask').is(':visible');
    }, { timeout: 30000 }).catch(() => {});

    await page.waitForTimeout(1500);

    const chunkData = await frame.evaluate(() => {
      const grid = window.$ ? ($('#grid').data('kendoExtGrid') || $('#grid').data('kendoGrid')) : null;
      if (!grid || !grid.dataSource) return [];
      const data = grid.dataSource.data();
      return data.map(item => (item.toJSON ? item.toJSON() : item));
    });

    logger.info(`Extracted ${chunkData.length} records for chunk ${i + 1}/${chunks.length}`);

    for (const item of chunkData) {
      allRows.push({
        'SR. No': String(item.rnum || ''),
        'Invoice No': String(item.invcNo || ''),
        'Invoice Confirm Date': String(item.invcCnfmDate || ''),
        'Delivery Date': String(item.dlvryDate || ''),
        'Dealer': String(item.dlrNo || dealerCode || ''),
        'Promotion': String(item.promoDesc || ''),
        'clmmClmmNo': String(item.clmmClmmNo || ''),
        'Claim Status': String(item.clmmCurrStat || ''),
        'Claim Save Date': String(item.clmmClmmDate ? formatDateForPortal(new Date(item.clmmClmmDate)) : ''),
        'Claim Submit Date': String(item.clmmSubmDate ? formatDateForPortal(new Date(item.clmmSubmDate)) : ''),
        'Model': String(item.modelDesc || ''),
        'Variant': String(item.vrntDsctn || ''),
        'VIN': String(item.vin || ''),
        'Registration Name': String(item.clmmRegName || ''),
        'Last Date to claim': String(item.lastDateToclaim || ''),
        'Rest No claim': String(item.restClaim || ''),
        'Insurance verfication status': String(item.insuVrfctn || ''),
        'Bill To Name': String(item.billToName || ''),
        'Ship To Name': String(item.shipToName || '')
      });
    }

    totalExtractedRows += chunkData.length;
  }

  logger.info('All Claims Mgt chunks extracted. Saving to Postgres table kia_calim_management...', {
    totalRows: allRows.length
  });

  if (allRows.length > 0) {
    await saveReportSheetToRelationalTable({
      sheetName: config.kiaClaimManagementSheetName || 'kia_calim_management',
      headers,
      rows: allRows
    });
  }

  return {
    reportId: 'kia-claim-management',
    dealerCode,
    totalRows: allRows.length,
    extractedCount: totalExtractedRows
  };
}
