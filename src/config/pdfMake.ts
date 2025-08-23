import PdfPrinter from "pdfmake";
import path from "path";

/**
 * Font configuration for PdfPrinter.
 *
 * Uses Roboto font family with separate files for:
 * - normal
 * - bold
 * - italics
 * - bolditalics
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
 * PdfPrinter instance for generating PDFs with the configured Roboto fonts.
 *
 * Can be used to create PDF documents in the application.
 */
const printer = new PdfPrinter(fonts);

export default printer;
