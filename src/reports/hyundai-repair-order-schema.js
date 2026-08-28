export const HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS = [
  // --- Core identity ---
  'No.',
  'R/O No',
  'DLR NO',
  'Main Dealer',
  'Main Dlr Name',
  'Zone',
  'Region',
  // --- Dates (root) ---
  'R/O Date',
  'R/O Date & Time',
  // --- Vehicle ---
  'Reg. No',
  'VIN',
  'Vehicle Type',
  'Model',
  'Sale Date',
  'Mileage',
  // --- Service ---
  'Work Type',
  'R/O Status',
  'New R/O Status',
  'Svc Adv.',
  'Tech. Name',
  'UC Category',
  'Night Service',
  'Mobile Service',
  'Express Care',
  'SMS Status',
  'Type of Free Service',
  'Pre Road Test',
  'Post Road Test',
  'HIIB Y/N',
  'Quick Service Status',
  'RO Source',
  'Special Message',
  'High Risk Customer',
  'Visit Type',
  'Visit Count',
  // --- Financials ---
  'Labour Amt',
  'Part Amt',
  'Other Amt',
  'Total Amt',
  'Estimate No',
  'Estimate Amt',
  // --- Timing ---
  'Gate Pass Time',
  'Promise Date/Time',
  'Revised Promise Date/Time',
  'Closing Date/Time',
  // --- Cancellation ---
  'Cancel Date',
  'Cancel Reason',
  'Cancel Emp.ID',
  // --- Insurance / Body ---
  'Insurance Company Name',
  'Surveyor Name',
  'No of Repair Panels',
  'No of Replaced Panels',
  'Total No of Panels',
  // --- Misc ---
  'User Name',
  'Delay Reason',
  'RO Remarks',
  'Pick Drop',
  'Avg Rating',
  'Feed Back Status',
  'Task Description',
  'Re Open Count',
  'RO Sub Status'
];

export const HYUNDAI_REPAIR_ORDER_CANONICAL_COLUMNS = [
  // --- Core identity ---
  'no',
  'r_o_no',
  'dlr_no',
  'main_dealer',
  'main_dlr_name',
  'zone',
  'region',
  // --- Dates ---
  'r_o_date',
  'r_o_date_time',
  // --- Vehicle ---
  'reg_no',
  'vin',
  'vehicle_type',
  'model',
  'sale_date',
  'mileage',
  // --- Service ---
  'work_type',
  'r_o_status',
  'new_r_o_status',
  'svc_adv',
  'tech_name',
  'uc_category',
  'night_service',
  'mobile_service',
  'express_care',
  'sms_status',
  'type_of_free_service',
  'pre_road_test',
  'post_road_test',
  'hiib_y_n',
  'quick_service_status',
  'ro_source',
  'special_message',
  'high_risk_customer',
  'visit_type',
  'visit_count',
  // --- Financials ---
  'labour_amt',
  'part_amt',
  'other_amt',
  'total_amt',
  'estimate_no',
  'estimate_amt',
  // --- Timing ---
  'gate_pass_time',
  'promise_date_time',
  'revised_promise_date_time',
  'closing_date_time',
  // --- Cancellation ---
  'cancel_date',
  'cancel_reason',
  'cancel_emp_id',
  // --- Insurance / Body ---
  'insurance_company_name',
  'surveyor_name',
  'no_of_repair_panels',
  'no_of_replaced_panels',
  'total_no_of_panels',
  // --- Misc ---
  'user_name',
  'delay_reason',
  'ro_remarks',
  'pick_drop',
  'avg_rating',
  'feed_back_status',
  'task_description',
  're_open_count',
  'ro_sub_status'
];

// Aliases for each canonical header — covers both old (23-col) and new (48-col) portal formats
const HYUNDAI_REPAIR_ORDER_ALIASES = {
  'No.': ['No.', 'No', 'S NO', 'S No', 'S.No', 'no', 's_no'],
  'R/O No': ['R/O No', 'RO No', 'r_o_no', 'ro_no'],
  'DLR NO': [
    'DLR NO', 'Dealer', 'Dealer Code', 'Sale Dealer Code',
    'dealer_code', 'source_dealer_code', 'sale_dealer_code', 'dealer', 'dlr_no'
  ],
  'Main Dealer': ['Main Dealer', 'main_dealer'],
  'Main Dlr Name': ['Main Dlr Name', 'main_dlr_name', 'dealer_name'],
  'Zone': ['Zone', 'zone'],
  'Region': ['Region', 'region'],
  // --- Dates ---
  'R/O Date': ['R/O Date', 'RO Date', 'r_o_date', 'ro_date'],
  'R/O Date & Time': [
    'R/O Date & Time', 'R/O Date &amp; Time', 'RO Date & Time', 'RO Date Time',
    'R/O DateTime', 'r_o_date_time', 'ro_date_time'
  ],
  // --- Vehicle ---
  'Reg. No': ['Reg. No', 'Reg No', 'reg_no'],
  VIN: ['VIN', 'VIN No.', 'VIN No', 'vin'],
  'Vehicle Type': ['Vehicle Type', 'vehicle_type'],
  Model: ['Model', 'model'],
  'Sale Date': ['Sale Date', 'sale_date'],
  Mileage: ['Mileage', 'mileage'],
  // --- Service ---
  'Work Type': ['Work Type', 'work_type'],
  'R/O Status': ['R/O Status', 'Status', 'r_o_status', 'status'],
  'New R/O Status': ['New R/O status', 'New R/O Status', 'new_r_o_status'],
  'Svc Adv.': ['Svc Adv.', 'Service Adv.', 'Service Adv', 'Service Advisor', 'svc_adv', 'service_adv', 'service_adv_'],
  'Tech. Name': ['Tech. Name', 'Man Tech.', 'Main Technician', 'Technician Name', 'tech_name', 'man_tech', 'main_technician'],
  'UC Category': ['UC Category', 'uc_category'],
  'Night Service': ['Night Service', 'night_service'],
  'Mobile Service': ['Mobile Service', 'mobile_service'],
  'Express Care': ['Express Care', 'express_care'],
  'SMS Status': ['SMS Status', 'sms_status'],
  'Type of Free Service': ['Type of Free service', 'Type of Free Service', 'type_of_free_service'],
  'Pre Road Test': ['Pre Road Test', 'pre_road_test'],
  'Post Road Test': ['Post Road Test', 'post_road_test'],
  'HIIB Y/N': ['HIIB Y/N', 'hiib_y_n'],
  'Quick Service Status': ['Quick Service Status', 'quick_service_status'],
  'RO Source': ['RO Source', 'Source Of RO', 'ro_source', 'source_of_ro', 'source_type'],
  'Special Message': ['Special Message', 'Special Msg.', 'Special Msg', 'special_message', 'special_msg'],
  'High Risk Customer': ['High Risk Customer', 'high_risk_customer'],
  'Visit Type': ['Visit Type', 'visit Type', 'visit_type'],
  'Visit Count': ['Visit Count', 'visit_count'],
  // --- Financials ---
  'Labour Amt': ['Labour Amt', 'labour_amt'],
  'Part Amt': ['Part Amt', 'part_amt'],
  'Other Amt': ['Other Amt', 'other_amt'],
  'Total Amt': ['Total', 'total', 'Total Amt', 'total_amt'],
  'Estimate No': ['Estimate No', 'estimate_no'],
  'Estimate Amt': ['Estimate Amt', 'estimate_amt'],
  // --- Timing ---
  'Gate Pass Time': ['Gate Pass Time', 'gate_pass_time'],
  'Promise Date/Time': ['Promise Date/Time', 'Promise Date Time', 'promise_date_time'],
  'Revised Promise Date/Time': ['Revised Promise Date/Time', 'Revised Promise Date Time', 'revised_promise_date_time'],
  'Closing Date/Time': ['Closing Date/Time', 'Closing Date Time', 'closing_date_time'],
  // --- Cancellation ---
  'Cancel Date': ['Cancel Date', 'cancel_date'],
  'Cancel Reason': ['Cancel Reason', 'cancel_reason'],
  'Cancel Emp.ID': ['Cancel Emp.ID', 'Cancel Emp ID', 'cancel_emp_id'],
  // --- Insurance / Body ---
  'Insurance Company Name': ['Insurance Company Name', 'insurance_company_name'],
  'Surveyor Name': ['Surveyor Name', 'surveyor_name'],
  'No of Repair Panels': ['No of Repair Panels', 'no_of_repair_panels'],
  'No of Replaced Panels': ['No of Replaced Panels', 'no_of_replaced_panels'],
  'Total No of Panels': ['Total No of Panels', 'total_no_of_panels'],
  // --- Misc ---
  'User Name': ['User Name', 'user_name'],
  'Delay Reason': ['Delay Reason', 'delay_reason'],
  'RO Remarks': ['RO Remaks', 'RO Remarks', 'ro_remarks', 'ro_remaks'],
  'Pick Drop': ['Pick Drop', 'pick_drop'],
  'Avg Rating': ['Avg Rating', 'avg_rating'],
  'Feed Back Status': ['Feed Back Status', 'feed_back_status'],
  'Task Description': ['Task Description', 'task_description'],
  'Re Open Count': ['Re Open Count', 're_open_count'],
  'RO Sub Status': ['RO Sub Status', 'ro_sub_status']
};

const HEADER_TO_COLUMN = Object.fromEntries(
  HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS.map((header, index) => [header, HYUNDAI_REPAIR_ORDER_CANONICAL_COLUMNS[index]])
);

function normalizeText(value) {
  if (value == null) return '';
  return String(value).trim();
}

function lookupFirstValue(row, aliases) {
  for (const alias of aliases) {
    if (!Object.prototype.hasOwnProperty.call(row ?? {}, alias)) {
      continue;
    }

    const value = normalizeText(row[alias]);
    if (value) {
      return value;
    }
  }

  return '';
}

function normalizeDealerCode(value, fallbackDealerCode) {
  const dealerCode = normalizeText(value || fallbackDealerCode);
  return dealerCode ? dealerCode.toUpperCase() : '';
}

export function normalizeHyundaiRepairOrderRow(row, { dealerCode = '' } = {}) {
  const normalized = {};

  for (const header of HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS) {
    const aliases = HYUNDAI_REPAIR_ORDER_ALIASES[header] ?? [header];
    const value = lookupFirstValue(row, aliases);

    if (header === 'DLR NO') {
      normalized[header] = normalizeDealerCode(value, dealerCode);
      continue;
    }

    normalized[header] = value;
  }

  return normalized;
}

export function hyundaiRepairOrderRowToDatabaseRow(row, options = {}) {
  const canonicalRow = normalizeHyundaiRepairOrderRow(row, options);
  return Object.fromEntries(
    HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS.map(header => [
      HEADER_TO_COLUMN[header],
      canonicalRow[header]
    ])
  );
}

export function normalizeHyundaiRepairOrderDataset(merged, { dealerCode = '' } = {}) {
  const rows = (merged?.rows ?? []).map(row => normalizeHyundaiRepairOrderRow(row, { dealerCode }));

  return {
    headers: [...HYUNDAI_REPAIR_ORDER_CANONICAL_HEADERS],
    rows
  };
}
