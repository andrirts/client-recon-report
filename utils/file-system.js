// import fs from "fs";
const fs = require("fs");

const unlinkFile = (filePath) => {
  if (Array.isArray(filePath)) {
    return Promise.all(
      filePath.map(
        (fp) =>
          new Promise((resolve, reject) => {
            fs.unlink(fp, (err) => {
              if (err) {
                reject(err);
              } else {
                console.log(`Deleted file: ${fp}`);
                resolve();
              }
            });
          })
      )
    );
  } else {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

module.exports = { unlinkFile };
