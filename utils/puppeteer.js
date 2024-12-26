"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFgenerator = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
exports.PDFgenerator = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    // // Generate a readable timestamp
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, "0");
    // const day = String(now.getDate()).padStart(2, "0");
    // const hours = String(now.getHours()).padStart(2, "0");
    // const minutes = String(now.getMinutes()).padStart(2, "0");
    // const seconds = String(now.getSeconds()).padStart(2, "0");
    // const invoiceName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}_invoice.pdf`;
    // // Ensure the directory exists
    // const billsDir = path.join(__dirname, "..", "public", "bills");
    // if (!fs.existsSync(billsDir)) {
    //     fs.mkdirSync(billsDir, { recursive: true });
    // }
    // const pdfPath = path.join(billsDir, invoiceName);
    // // Launch Puppeteer
    // const browser = await puppeteer.launch({
    //     headless: true,
    //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // });
    // try {
    //     const page = await browser.newPage();
    //     await page.setContent(invoiceHTML); // Set the HTML content
    //     await page.pdf({ path: pdfPath, format: "A4" }); // Save PDF to the specified path
    //     await browser.close();
    //     console.log(`PDF generated successfully at ${pdfPath}`);
    res.status(200).json({
        success: true,
        message: `PDF generated successfully`,
    });
    // } catch (err) {
    //     await browser.close();
    //     next(new ErrorHandler("Error generating PDF", 500));
    // }
});
