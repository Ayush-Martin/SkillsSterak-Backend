import ExcelJS from "exceljs";

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

  // Format date range label
  const dateRangeLabel =
    fromDate && toDate
      ? `From: ${fromDate.toDateString()} To: ${toDate.toDateString()}`
      : "All Time";

  // Summary section
  sheet.addRow(["Admin Revenue Report"]);
  sheet.addRow([dateRangeLabel]);
  sheet.addRow([]);
  sheet.addRow(["Total Revenue", totalRevenue]);
  sheet.addRow(["Subscription Revenue", subscriptionRevenue]);
  sheet.addRow(["Commission Revenue", commissionRevenue]);
  sheet.addRow([]);

  // Header
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

  // Data rows
  transactions.forEach((tx) => {
    sheet.addRow([tx.payer, tx.type, tx.amount]);
  });

  // Adjust column widths
  sheet.columns.forEach((col) => {
    col.width = 25;
  });

  // Return buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

export const generateTrainerRevenueExcel = async (
  totalRevenue: number,
  transactions: Array<{ payer: string; course: string; amount: string }>,
  fromDate?: Date,
  toDate?: Date
): Promise<ExcelJS.Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Trainer Revenue");

  // Format date range label
  const dateRangeLabel =
    fromDate && toDate
      ? `From: ${fromDate.toDateString()} To: ${toDate.toDateString()}`
      : "All Time";

  // Summary section
  sheet.addRow(["Admin Revenue Report"]);
  sheet.addRow([dateRangeLabel]);
  sheet.addRow([]);
  sheet.addRow(["Total Revenue", totalRevenue]);
  sheet.addRow([]);

  // Header
  const headerRow = sheet.addRow(["Payer", "Amount", "Course"]);
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

  // Data rows
  transactions.forEach((tx) => {
    sheet.addRow([tx.payer, tx.amount, tx.course]);
  });

  // Adjust column widths
  sheet.columns.forEach((col) => {
    col.width = 25;
  });

  // Return buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
