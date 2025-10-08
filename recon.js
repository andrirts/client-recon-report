const path = require("path");
const moment = require("moment");
const client = require("./src/infrastructure/db");
const { generatePDF } = require("./src/helper/generate-pdf");
const { unlinkFile } = require("./utils/file-system");
const { generateExcel } = require("./src/helper/excel-helper");
const { getDatas } = require("./src/helper/generate-excel");
const { sendMail, mailOptions } = require("./src/infrastructure/mail");
const cron = require("node-cron");
moment.locale("id");

const getSummaryData = async () => {
  try {
    const db = await client();
    const summary = `
        SELECT KodeProduk, NamaReseller,HARGAJUAL, SUM(HARGAJUAL) as totalRevenue, count(idtransaksi) as totalTransaction
        FROM transaksi
        WHERE TANGGAL = ?
        GROUP BY KodeProduk, NamaReseller
    `;
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    const [rowSummaryPerDay] = await db.query(summary, [yesterday]);

    await db.end();
    return rowSummaryPerDay;
  } catch (err) {
    console.error("Error fetching transaction data:", err);
    throw err;
  }
};

// (async () => {
//   console.log("Script run at " + moment().format("YYYY-MM-DD HH:mm:ss"));
//   const data = await getSummaryData();
//   const SAT = "PT SATRIA ABADI TERPADU";
//   const alto = "PT ALTO NETWORK";
//   const via = "PT VIA YOTTA BYTE";
//   const dmn = "PT DIGITAL MEGAH NUSANTARA";
//   const getName = (name) => {
//     return `Berita Acara Rekonsiliasi ${name} ${moment().format(
//       "DD MMMM YYYY"
//     )}`;
//   };
//   const [satPDF, altoPDF, viaPDF, dmnPDF] = await Promise.all([
//     generatePDF(data, SAT, getName(SAT)),
//     generatePDF(data, alto, getName(alto)),
//     generatePDF(data, via, getName(via)),
//     generatePDF(data, dmn, getName(dmn)),
//   ]).catch((err) => {
//     console.error("Error generating PDFs:", err);
//   });
//   const [satTransactions, altoTransactions, viaTransactions, dmnTransactions] =
//     await Promise.all([
//       getDatas(SAT),
//       getDatas(alto),
//       getDatas(via),
//       getDatas(dmn),
//     ]);

//   const [satExcel, altoExcel, viaExcel, dmnExcel] = await Promise.all([
//     generateExcel(satTransactions, SAT),
//     generateExcel(altoTransactions, alto),
//     generateExcel(viaTransactions, via),
//     generateExcel(dmnTransactions, dmn),
//   ]).catch((err) => {
//     console.error("Error generating Excels:", err);
//   });

//   await Promise.all([
//     sendMail(
//       mailOptions(
//         "Rekonsiliasi " + SAT,
//         "Berikut adalah laporan rekonsiliasi untuk " + SAT,
//         [
//           {
//             filename: path.basename(satPDF),
//             path: satPDF,
//           },
//           {
//             filename: path.basename(satExcel),
//             path: satExcel,
//           },
//         ]
//       )
//     ),
//     sendMail(
//       mailOptions(
//         "Rekonsiliasi " + alto,
//         "Berikut adalah laporan rekonsiliasi untuk " + alto,
//         [
//           {
//             filename: path.basename(altoPDF),
//             path: altoPDF,
//           },
//           {
//             filename: path.basename(altoExcel),
//             path: altoExcel,
//           },
//         ]
//       )
//     ),
//     sendMail(
//       mailOptions(
//         "Rekonsiliasi " + via,
//         "Berikut adalah laporan rekonsiliasi untuk " + via,
//         [
//           {
//             filename: path.basename(viaPDF),
//             path: viaPDF,
//           },
//           {
//             filename: path.basename(viaExcel),
//             path: viaExcel,
//           },
//         ]
//       )
//     ),
//     sendMail(
//       mailOptions(
//         "Rekonsiliasi " + dmn,
//         "Berikut adalah laporan rekonsiliasi untuk " + dmn,
//         [
//           {
//             filename: path.basename(dmnPDF),
//             path: dmnPDF,
//           },
//           {
//             filename: path.basename(dmnExcel),
//             path: dmnExcel,
//           },
//         ]
//       )
//     ),
//   ]);

//   await unlinkFile([
//     satPDF,
//     altoPDF,
//     viaPDF,
//     dmnPDF,
//     satExcel,
//     altoExcel,
//     viaExcel,
//     dmnExcel,
//   ]);
//   console.log(
//     "Script completed successfully." + moment().format("YYYY-MM-DD HH:mm:ss")
//   );
// })();

cron.schedule("0 9 * * *", async () => {
  console.log("Script run at " + moment().format("YYYY-MM-DD HH:mm:ss"));
  const data = await getSummaryData();
  const SAT = "PT SATRIA ABADI TERPADU";
  const alto = "PT ALTO NETWORK";
  const via = "PT VIA YOTTA BYTE";
  const dmn = "PT DIGITAL MEGAH NUSANTARA";
  const getName = (name) => {
    return `Berita Acara Rekonsiliasi ${name} ${moment().format(
      "DD MMMM YYYY"
    )}`;
  };
  const [satPDF, altoPDF, viaPDF, dmnPDF] = await Promise.all([
    generatePDF(data, SAT, getName(SAT)),
    generatePDF(data, alto, getName(alto)),
    generatePDF(data, via, getName(via)),
    generatePDF(data, dmn, getName(dmn)),
  ]).catch((err) => {
    console.error("Error generating PDFs:", err);
  });
  const [satTransactions, altoTransactions, viaTransactions, dmnTransactions] =
    await Promise.all([
      getDatas(SAT),
      getDatas(alto),
      getDatas(via),
      getDatas(dmn),
    ]);

  const [satExcel, altoExcel, viaExcel, dmnExcel] = await Promise.all([
    generateExcel(satTransactions, SAT),
    generateExcel(altoTransactions, alto),
    generateExcel(viaTransactions, via),
    generateExcel(dmnTransactions, dmn),
  ]).catch((err) => {
    console.error("Error generating Excels:", err);
  });

  await Promise.all([
    sendMail(
      mailOptions(
        "Rekonsiliasi " + SAT,
        "Berikut adalah laporan rekonsiliasi untuk " + SAT,
        [
          {
            filename: path.basename(satPDF),
            path: satPDF,
          },
          {
            filename: path.basename(satExcel),
            path: satExcel,
          },
        ]
      )
    ),
    sendMail(
      mailOptions(
        "Rekonsiliasi " + alto,
        "Berikut adalah laporan rekonsiliasi untuk " + alto,
        [
          {
            filename: path.basename(altoPDF),
            path: altoPDF,
          },
          {
            filename: path.basename(altoExcel),
            path: altoExcel,
          },
        ]
      )
    ),
    sendMail(
      mailOptions(
        "Rekonsiliasi " + via,
        "Berikut adalah laporan rekonsiliasi untuk " + via,
        [
          {
            filename: path.basename(viaPDF),
            path: viaPDF,
          },
          {
            filename: path.basename(viaExcel),
            path: viaExcel,
          },
        ]
      )
    ),
    sendMail(
      mailOptions(
        "Rekonsiliasi " + dmn,
        "Berikut adalah laporan rekonsiliasi untuk " + dmn,
        [
          {
            filename: path.basename(dmnPDF),
            path: dmnPDF,
          },
          {
            filename: path.basename(dmnExcel),
            path: dmnExcel,
          },
        ]
      )
    ),
  ]);

  await unlinkFile([
    satPDF,
    altoPDF,
    viaPDF,
    dmnPDF,
    satExcel,
    altoExcel,
    viaExcel,
    dmnExcel,
  ]);
  console.log(
    "Script completed successfully." + moment().format("YYYY-MM-DD HH:mm:ss")
  );
});
