const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const fetch = require("node-fetch");
const processFile = require("../middleware/upload");
var https = require("https");
const url = require("url");
const { FLASK_SERVER_URI, KEY_FILE_NAME, BUCKET_NAME } = require("../../env");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const { updateVideoExportUrl } = require("../DAO/projectDAO");
const { checkIfProjectValidAndExists } = require("./projectController");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: KEY_FILE_NAME });
const bucket = storage.bucket(BUCKET_NAME);

const handleExport = async (req, res) => {
  //check data valid

  const currentUser = req.body;

  const videoUrl = currentUser.currentProject.videoUrl;
  const subData = currentUser.currentProject.subData;
  const projectId = currentUser.currentProject.id.toString();

  console.log("Export controller: ", req.body);
  console.log("link video sent to flask: ", currentUser.currentProject.videoUrl);

  checkIfProjectValidAndExists(projectId)
    .then((flag) => {
      if (flag == false) {
        console.log("checkIfProjectValidAndExists: invalid input");

        return res.status(200).send({
          success: false,
          message: "invalid input",
        });
      }


      //forward to flask server
      postData(`${FLASK_SERVER_URI}/export`, { videoUrl: videoUrl, subData: subData, projectId: projectId })
        .then((response) => {
          console.log("FLASK: ", response.message);

          if (response.success) {
            let exportVideoUrl = response.data;
            let exportVideoName = projectId + "_exportResult.mp4";
            let status = "Rendered";

            //update to project

            updateVideoExportUrl(projectId, exportVideoUrl, exportVideoName, status).then((flag) => {
              return res.status(200).send({
                message: "Uploaded the Export file successfully and save DB with id: " + projectId,
                success: true,
                exportVideoUrl: exportVideoUrl,
                exportVideoName: exportVideoName,
                status: status,
              });
            });
          } else {
            return res.status(200).send({
              success: false,
              message: "server NODEJS: export lỗi rồi: " + response.message,
            });
          }
        })
        .catch((e) => {
          console.log("server NODEJS: export lỗi rồi: " + e);

          return res.status(200).send({
            success: false,
            message: "server NODEJS: export lỗi rồi: " + e,
          });
        });





    });
};

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

module.exports = {
  handleExport,
};
