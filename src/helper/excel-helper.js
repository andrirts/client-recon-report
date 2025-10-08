const ExcelJs = require("exceljs");
const moment = require("moment");
const path = require("path");

const generateExcel = async (data, fileName) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  worksheet.columns = [
    { header: "IDTRX", key: "idtransaksi" },
    { header: "ReffClient", key: "IdTransaksiClient", width: 20 },
    { header: "Waktu Trx", key: "WaktuTrx", width: 15 },
    { header: "Nama Reseller", key: "NamaReseller", width: 15 },
    { header: "Tujuan", key: "Tujuan", width: 12 },
    { header: "KP", key: "KodeProduk" },
    { header: "Harga", key: "HARGAJUAL" },
    { header: "Status", key: "STATUSTRANSAKSI" },
    { header: "SN", key: "SN", width: 20 },
    { header: "Final Status", key: "FINALSTATUSTRANSAKSI", width: 13 },
    { header: "Date", key: "TANGGAL" },
  ];

  worksheet.addRows(data);

  // Style the header row
  worksheet.getRow(1).font = { name: "Tahoma", size: 8, bold: true };
  worksheet.getRow(1).alignment = { horizontal: "center" };
  worksheet.getRow(1).eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Yellow background for specific headers
  worksheet.getCell("J1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" }, // Yellow
  };
  worksheet.getCell("K1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" }, // Yellow
  };
  worksheet.getColumn("G").numFmt = '"Rp"#,##0';

  // Apply Tahoma size 8 to all cells (including data)
  worksheet.eachRow((row) => {
    if (row.number === 1) return; // Skip header row
    row.eachCell((cell) => {
      cell.font = { name: "Tahoma", size: 8 };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // const filePath = `./uploads/excel/Transaksi ${fileName} ${moment().format(
  //   "DDMMYYYY"
  // )}.csv`;

  const filePath = path.join(
    __dirname,
    `../../uploads/excel/Transaksi ${fileName} ${moment().format(
      "DDMMYYYY"
    )}.xlsx`
  );

  await workbook.xlsx.writeFile(filePath);
  console.log(`Excel file generated: ${filePath}`);
  return filePath;
};

module.exports = { generateExcel };
