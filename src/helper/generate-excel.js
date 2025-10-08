const fs = require("fs");
const path = require("path");
const moment = require("moment");
const client = require("../infrastructure/db");
moment.locale("id");
// const { generateExcel } = require("./src/helper/excel-helper");

const getDatas = async (clientName) => {
  try {
    const db = await client();

    const query = `
        SELECT idtransaksi, IdTransaksiClient, TANGGAL, JAM, NamaReseller, Tujuan, KodeProduk, HARGAJUAL, STATUSTRANSAKSI, SN 
        FROM transaksi
        WHERE TANGGAL = ?
        AND NamaReseller = ?
        ORDER BY idtransaksi ASC
    `;
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    const [rows] = await db.query(query, [yesterday, clientName]);
    const datas = [];

    rows.forEach((row, index) => {
      const status = row.STATUSTRANSAKSI === 1 ? "SUKSES" : "GAGAL";
      const waktuTrx = `${moment(row.TANGGAL).format("YYYY-MM-DD")}:${row.JAM}`;

      datas.push({
        idtransaksi: row.idtransaksi,
        IdTransaksiClient: row.IdTransaksiClient,
        WaktuTrx: waktuTrx,
        NamaReseller: row.NamaReseller,
        Tujuan: row.Tujuan,
        KodeProduk: row.KodeProduk,
        HARGAJUAL: row.HARGAJUAL,
        STATUSTRANSAKSI: status,
        SN: row.SN,
        FINALSTATUSTRANSAKSI: status,
        TANGGAL: moment(row.TANGGAL).format("YYYY-MM-DD"),
      });
    });

    await db.end();
    return datas;
  } catch (err) {
    console.error("Error fetching via data:", err);
    throw err;
  }
};

module.exports = { getDatas };
