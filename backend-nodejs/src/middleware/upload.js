//initializes Multer Storage engine and defines middleware function 
//to process file before uploading it to Google Cloud Storage.

const util = require("util");
const Multer = require("multer");
const maxSize = 1024 * 1024 * 1024;
let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single("file");
let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;

/*
In the code above, we’ve done these steps:
– First, we import multer module.
– Next, we configure multer to use Memory Storage engine.

util.promisify() makes the exported middleware object can be used with async-await.

limits to restrict file size, now it's 1GB max
*/