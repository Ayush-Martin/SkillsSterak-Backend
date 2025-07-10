import ExcelJS from "exceljs";

/**
 * Generates an Excel report for admin revenue analytics.
 * - Summarizes total, subscription, and commission revenue for a given date range.
 * - Includes a detailed transaction table for transparency and auditing.
 * - Used for admin financial reporting and export features.
 */
export const generateAdminRevenueExcel = async (
  totalRevenue: number,
  commissionRevenue: number,
  subscriptionRevenue: number,
  transactions: Array<{ payer: string; type: string; amount: string }>,
  fromDate?: Date,
  toDate?: Date
): Promise<ExcelJS.Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Admin Revenue");

  // Format date range label for the report
  const dateRangeLabel =
    fromDate && toDate
      ? `From: ${fromDate.toDateString()} To: ${toDate.toDateString()}`
      : "All Time";

  // Add summary section to the sheet
  sheet.addRow(["Admin Revenue Report"]);
  sheet.addRow([dateRangeLabel]);
  sheet.addRow([]);
  sheet.addRow(["Total Revenue", totalRevenue]);
  sheet.addRow(["Subscription Revenue", subscriptionRevenue]);
  sheet.addRow(["Commission Revenue", commissionRevenue]);
  sheet.addRow([]);

  // Add header row for transaction details
  const headerRow = sheet.addRow(["Payer", "Type", "Amount"]);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCE5FF" },
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Add each transaction as a row
  transactions.forEach((tx) => {
    sheet.addRow([tx.payer, tx.type, tx.amount]);
  });

  // Adjust column widths for readability
  sheet.columns.forEach((col) => {
    col.width = 25;
  });

  // Return the Excel file as a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

/**
 * Generates an Excel report for trainer revenue analytics.
 * - Summarizes total revenue for a given date range.
 * - Includes a detailed transaction table with payer and course information.
 * - Used for trainer financial reporting and export features.
 */
export const generateTrainerRevenueExcel = async (
  totalRevenue: number,
  totalCommission: number,
  onProcessAmount: number,
  transactions: Array<{
    payer: string;
    course: string;
    amount: string;
    status: string;
    adminCommission: number;
  }>,
  fromDate?: Date,
  toDate?: Date
): Promise<ExcelJS.Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Trainer Revenue");

  // Format date range label for the report
  const dateRangeLabel =
    fromDate && toDate
      ? `From: ${fromDate.toDateString()} To: ${toDate.toDateString()}`
      : "All Time";

  // Add summary section to the sheet
  sheet.addRow(["Admin Revenue Report"]);
  sheet.addRow([dateRangeLabel]);
  sheet.addRow([]);
  sheet.addRow(["Total Revenue", totalRevenue]);
  sheet.addRow(["Total Commission", totalCommission]);
  sheet.addRow(["On_Process Amount", onProcessAmount]);
  sheet.addRow([]);

  // Add header row for transaction details
  const headerRow = sheet.addRow([
    "Payer",
    "Amount",
    "Course",
    "Status",
    "Admin Commission",
  ]);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCE5FF" },
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Add each transaction as a row
  transactions.forEach((tx) => {
    sheet.addRow([
      tx.payer,
      tx.amount,
      tx.course,
      tx.status,
      tx.adminCommission,
    ]);
  });

  // Adjust column widths for readability
  sheet.columns.forEach((col) => {
    col.width = 25;
  });

  // Return the Excel file as a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
