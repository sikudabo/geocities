const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const dotenv = require('dotenv').config();

const dbUri = process.env.DB;
console.log(dbUri);
let gfs;

var conn = mongoose.createConnection(dbUri);

async function getGfs() {
  let myReturn = await conn.once('open', () => {
                    // Init Stream
                    gfs = Grid(conn.db, mongoose.mongo);
                    gfs.collection('uploads');
                    return 'done';
                  });
  return myReturn;
}

const storage = new GridFsStorage({
    url: dbUri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
          const filename = Date.now() + "-" + file.fieldname + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
    }
});

getGfs().then(result => {
  module.exports = gfs;
});