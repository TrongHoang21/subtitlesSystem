//this src thks to https://www.bezkoder.com/google-cloud-storage-nodejs-upload-file/#Create_middleware_for_processing_file
//initializes routes, runs Express app.
const cors = require("cors");
const express = require("express");
var cron = require('node-cron');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS handle BEGIN
// let corsOptions = {
//     origin: true,
// };
app.use(cors());

// Add headers before the routes are defined (middleware)
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
//CORS handle END

const initRoutes = require("./src/routes");
const { deleteNoUserResources } = require("./src/controller/projectController");
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

app.get('/', (req, res) => {
  res.send('dường như nắng đã làm má em thêm hồng')
})

//DATABASE ROUTE
app.get('/sync', (req, res) => { //DELEGATION i dont understant (res, req), maybe it's a callback
  const models = require('./models');
  models.sequelize.sync()
  .then(()=>{ //if succeed
  res.send('database :) sync completed!');
  });
});


//CRON JOB, tự động xóa project và tài nguyên không user nào sở hữu sau 24h
//npm install node-cron@3.0.0

cron.schedule(
  '00 30 23 * * 0-6', // Chạy Jobs vào 23h30 mỗi ngày
  deleteNoUserResources,
  {
    scheduled: true,
    timeZone: 'Asia/Ho_Chi_Minh' // Lưu ý set lại time zone cho đúng 
  }
);















const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});