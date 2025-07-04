import PdfPrinter from "pdfmake";
import path from "path";

/**
 * PdfPrinter instance configured with Roboto font family for PDF generation.
 */
const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../../fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "../../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../../fonts/Roboto-MediumItalic.ttf"),
  },
};

/**
 * Exported PdfPrinter instance for generating PDFs with the configured fonts.
 */
const printer = new PdfPrinter(fonts);
export default printer;
