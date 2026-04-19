const puppeteer = require("puppeteer");
async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch({
        headless : true,
        args : ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
        format : "A4",
        printBackground : true,
        margin : {top : "1cm",right : "1cm",bottom : "1cm",left : "1cm"}
    })
    await browser.close();
    return pdfBuffer;
}

generatePdfFromHtml("<h1>Hello World</h1>").then(res => {
    console.log("Type:", typeof res);
    console.log("Is Buffer:", Buffer.isBuffer(res));
    console.log("Instance:", res.constructor.name);
    console.log("Length:", res.length);
}).catch(console.error);
