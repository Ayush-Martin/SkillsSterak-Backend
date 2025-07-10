import { TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "../config/pdfMake";

/**
 * Generates a PDF report for admin revenue analytics.
 * - Summarizes total, commission, and subscription revenue for a given date range.
 * - Includes a detailed transaction table for transparency and auditing.
 * - Used for admin financial reporting and export features.
 */
export const generateAdminRevenuePdf = (
  totalRevenue: number,
  commissionRevenue: number,
  subscriptionRevenue: number,
  transactions: Array<{ payer: string; type: string; amount: string }>,
  fromDate?: Date,
  toDate?: Date
): PDFKit.PDFDocument => {
  const dateRange =
    fromDate && toDate
      ? `Date Range: ${fromDate.toLocaleDateString()} – ${toDate.toLocaleDateString()}`
      : "";

  const content: TDocumentDefinitions["content"] = [];

  // Add report title
  content.push({
    text: "Admin Revenue Report",
    style: "header",
    alignment: "center",
    margin: [0, 0, 0, 4],
  });

  // Add date range if provided
  if (dateRange) {
    content.push({
      text: dateRange,
      style: "subheader",
      alignment: "center",
      margin: [0, 0, 0, 20],
    });
  }

  // Add summary cards for revenue breakdown
  const summaryCards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
    },
    {
      title: "Commission Revenue",
      value: `₹${commissionRevenue.toLocaleString()}`,
    },
    {
      title: "Subscription Revenue",
      value: `₹${subscriptionRevenue.toLocaleString()}`,
    },
  ];

  const cardTables = summaryCards.map((card) => ({
    table: {
      body: [
        [
          {
            stack: [
              { text: card.title, style: "cardTitle" },
              { text: card.value, style: "cardValue" },
            ],
            fillColor: "#f8f8f8",
          },
        ],
      ],
      widths: ["*"],
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => "#dddddd",
      vLineColor: () => "#dddddd",
    },
  }));

  content.push({
    columns: cardTables,
    columnGap: 10,
    margin: [0, 0, 0, 20],
  });

  // Add transactions table
  const tableBody = [
    [
      { text: "S.No", style: "tableHeader" },
      { text: "Payer", style: "tableHeader" },
      { text: "Type", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
    ],
    ...transactions.map((tx, i) => [`${i + 1}`, tx.payer, tx.type, tx.amount]),
  ];

  content.push({
    table: {
      headerRows: 1,
      widths: ["auto", "*", "*", "auto"],
      body: tableBody,
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  });

  // Define document structure and styles
  const docDefinition = {
    content,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: "#000000",
      },
      subheader: {
        fontSize: 10,
        color: "#555555",
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        fillColor: "#f1f1f1",
        color: "#000000",
      },
      cardTitle: {
        fontSize: 10,
        bold: true,
        color: "#666666",
        margin: [0, 2, 0, 0],
      },
      cardValue: {
        fontSize: 16,
        bold: true,
        margin: [0, 4, 0, 0],
        color: "#000000",
      },
    },
    pageMargins: [40, 60, 40, 60],
    footer(currentPage: number, pageCount: number) {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: "center",
        fontSize: 9,
        color: "#888888",
        margin: [0, 10, 0, 0],
      };
    },
  };

  return pdfMake.createPdfKitDocument(docDefinition as any);
};

/**
 * Generates a PDF report for trainer revenue analytics.
 * - Summarizes total revenue for a given date range.
 * - Includes a detailed transaction table with payer and course information.
 * - Used for trainer financial reporting and export features.
 */
export const generateTrainerRevenuePdf = (
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
): PDFKit.PDFDocument => {
  const dateRange =
    fromDate && toDate
      ? `Date Range: ${fromDate.toLocaleDateString()} – ${toDate.toLocaleDateString()}`
      : "";

  const content: TDocumentDefinitions["content"] = [];

  // Add report title
  content.push({
    text: "Trainer Revenue Report",
    style: "header",
    alignment: "center",
    margin: [0, 0, 0, 4],
  });

  // Add date range if provided
  if (dateRange) {
    content.push({
      text: dateRange,
      style: "subheader",
      alignment: "center",
      margin: [0, 0, 0, 20],
    });
  }

  // Add summary card for total revenue
  const summaryCards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
    },
    {
      title: "Total Commission",
      value: `₹${totalCommission.toLocaleString()}`,
    },
    {
      title: "ON_Process Amount",
      value: `₹${onProcessAmount.toLocaleString()}`,
    },
  ];

  const cardTables = summaryCards.map((card) => ({
    table: {
      body: [
        [
          {
            stack: [
              { text: card.title, style: "cardTitle" },
              { text: card.value, style: "cardValue" },
            ],
            fillColor: "#f8f8f8",
          },
        ],
      ],
      widths: ["*"],
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => "#dddddd",
      vLineColor: () => "#dddddd",
    },
  }));

  content.push({
    columns: cardTables,
    columnGap: 10,
    margin: [0, 0, 0, 20],
  });

  // Add transactions table
  const tableBody = [
    [
      { text: "S.No", style: "tableHeader" },
      { text: "Payer", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
      { text: "Course", style: "tableHeader" },
      { text: "Status", style: "tableHeader" },
      { text: "Admin Commission", style: "tableHeader" },
    ],
    ...transactions.map((tx, i) => [
      `${i + 1}`,
      tx.payer,
      tx.amount,
      tx.course,
      tx.status,
      tx.adminCommission,
    ]),
  ];

  content.push({
    table: {
      headerRows: 1,
      widths: ["auto", "*", "*", "*", "auto", "auto"],
      body: tableBody,
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  });

  // Define document structure and styles
  const docDefinition = {
    content,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: "#000000",
      },
      subheader: {
        fontSize: 10,
        color: "#555555",
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        fillColor: "#f1f1f1",
        color: "#000000",
      },
      cardTitle: {
        fontSize: 10,
        bold: true,
        color: "#666666",
        margin: [0, 2, 0, 0],
      },
      cardValue: {
        fontSize: 16,
        bold: true,
        margin: [0, 4, 0, 0],
        color: "#000000",
      },
    },
    pageMargins: [40, 60, 40, 40],
    footer(currentPage: number, pageCount: number) {
      return {
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: "center",
        fontSize: 9,
        color: "#888888",
        margin: [0, 10, 0, 0],
      };
    },
  };

  return pdfMake.createPdfKitDocument(docDefinition as any);
};
