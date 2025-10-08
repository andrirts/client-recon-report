const moment = require("moment");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const generatePDF = async (data, clientName, pdfName) => {
  const dataClient = data.filter((row) => row.NamaReseller === clientName);

  // if (dataClient.length === 0) {
  //   console.log(`No data found for client: ${clientName}`);
  //   return;
  // }

  let clientContent = fs.readFileSync(
    path.join(__dirname, "../../template/template.html"),
    "utf-8"
  );

  //Change month to roman numeral
  const month = moment().format("MM");
  const monthRomanNumeral = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ][parseInt(month) - 1];

  clientContent = clientContent.replaceAll("{{ bulan }}", monthRomanNumeral);
  clientContent = clientContent.replaceAll(
    "{{ tanggal }}",
    moment().format("DD")
  );

  clientContent = clientContent.replaceAll(
    "{{ currentDate }}",
    moment().format("DD MMMM YYYY")
  );
  clientContent = clientContent.replaceAll("{{ clientName }}", clientName);
  clientContent = clientContent.replaceAll(
    "{{ yesterday }}",
    moment().subtract(1, "days").format("DD MMMM YYYY")
  );
  clientContent = clientContent.replaceAll(
    "{{ yesterdayFormatSlash }}",
    moment().subtract(1, "days").format("DD/MM/YYYY")
  );
  clientContent = clientContent.replaceAll(
    "{{ totalTrxTDF500 }}",
    dataClient.find((row) => row.KodeProduk === "TDF500")?.totalTransaction || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ priceTrxTDF500 }}",
    dataClient
      .find((row) => row.KodeProduk === "TDF500")
      ?.HARGAJUAL.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalPriceTDF500 }}",
    dataClient
      .find((row) => row.KodeProduk === "TDF500")
      ?.totalRevenue.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalTrxTDF1 }}",
    dataClient.find((row) => row.KodeProduk === "TDF1")?.totalTransaction || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ priceTrxTDF1 }}",
    dataClient
      .find((row) => row.KodeProduk === "TDF1")
      ?.HARGAJUAL.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalPriceTDF1 }}",
    dataClient
      .find((row) => row.KodeProduk === "TDF1")
      ?.totalRevenue.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalTrxTDF2 }}",
    dataClient.find((row) => row.KodeProduk === "TDF2")?.totalTransaction || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ priceTrxTDF2 }}",
    dataClient
      .find((row) => row.KodeProduk === "TDF2")
      ?.HARGAJUAL.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalPriceTDF2 }}",
    dataClient
      .find((row) => row.KodeProduk === "TDF2")
      ?.totalRevenue.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalTrxTD10GB30D }}",
    dataClient.find((row) => row.KodeProduk === "TD10GB30D")
      ?.totalTransaction || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ priceTrxTD10GB30D }}",
    dataClient
      .find((row) => row.KodeProduk === "TD10GB30D")
      ?.HARGAJUAL.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalPriceTD10GB30D }}",
    dataClient
      .find((row) => row.KodeProduk === "TD10GB30D")
      ?.totalRevenue.toLocaleString()
      .replaceAll(".", ",") || 0
  );
  clientContent = clientContent.replaceAll(
    "{{ totalTransaction }}",
    dataClient.reduce((acc, row) => acc + row.totalTransaction, 0)
  );
  clientContent = clientContent.replaceAll(
    "{{ totalAmount }}",
    dataClient
      .reduce((acc, row) => acc + row.totalRevenue, 0)
      .toLocaleString()
      .replaceAll(".", ",")
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(clientContent, { waitUntil: "networkidle0" });

  await page.pdf({
    path: `./uploads/pdf/${pdfName}.pdf`,
    format: "A4",
    printBackground: true,
  });

  const filePath = path.join(__dirname, `../../uploads/pdf/${pdfName}.pdf`);

  await browser.close();
  return filePath;
  console.log("PDF with Tailwind generated!");
  console.log("Finished at " + moment().format("YYYY-MM-DD HH:mm:ss"));
};

module.exports = { generatePDF };
