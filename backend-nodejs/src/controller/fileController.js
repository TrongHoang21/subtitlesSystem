//exports Rest APIs: POST a file, GET all files’ information,
//download a File with url.

const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const { createTempProject, updateTempProject, checkIfProjectValidAndExists } = require("./projectController");
const { BUCKET_NAME, KEY_FILE_NAME } = require("../../env");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: KEY_FILE_NAME });
const bucket = storage.bucket(BUCKET_NAME);

const upload = async (req, res, next) => {
  try {
    //Kiểm tra project id có hợp lệ + tồn tại không
    let resultId = parseInt(req.body.projectId);
    checkIfProjectValidAndExists(resultId).then((flag) => {
      if (flag == false) {
        console.log("checkIfProjectValidAndExists: invalid input");

        return res.status(200).send({
          success: false,
          message: "invalid input",
        });
      }


      //xử lý tên file có khoảng trắng
      let filename_w_projectId = resultId + "_" + req.file.originalname;
      filename_w_projectId = filename_w_projectId.replaceAll(" ", "-")
      console.log('sau xử lý khoảng trắng', filename_w_projectId);
      

      //START UPLOAD
      const corsConfiguration = [
        {
          origin: ["http://localhost:3000", "*", "Anonymous"],
          responseHeader: ["Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type", "x-goog-resumable", "X-Requested-With", "Authorization"],
          method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          maxAgeSeconds: 3600000,
        },
      ]; // 1000 hours

      bucket.setCorsConfiguration(corsConfiguration).then((metadata) => {
        console.log("metadata: ", metadata[0].cors);
      });

      //   // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(filename_w_projectId);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
      blobStream.on("error", (err) => {
        return res.status(200).send({ success: false, message: err.message });
      });
      blobStream.on("finish", async (data) => {
        // Create URL for directly file access via HTTP.
        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename_w_projectId}`);
        try {
          // Make the file public
          await bucket.file(filename_w_projectId).makePublic();
        } catch {
          return res.status(200).send({
            message: `Uploaded the file: ${filename_w_projectId}, but public access is denied!`,
            success: false,
            videoStorageName: filename_w_projectId,
          });
        }

        //có add vào database
        updateTempProject(resultId, publicUrl, filename_w_projectId, "", "").then((data) => {
          console.log("Uploaded the VIDEO file successfully and save DB with id: " + resultId);

          req.successResult = {
            message: "Uploaded the VIDEO file successfully and save DB with id: " + resultId,
            success: true,
            url: publicUrl,
            videoStorageName: filename_w_projectId,
            projectId: resultId,
          };

          return next();
        });
      });
      blobStream.end(req.file.buffer);
    });
  } catch (err) {
    console.log(`Could not upload the file. Error: ${err}`);

    return res.status(200).send({
      success: false,
      message: `Could not upload the file. Error: ${err}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });
    return res.status(200).send(fileInfos);
  } catch (err) {
    console.log("Unable to read list of files!" + err);
    return res.status(200).send({
      success: false,
      message: "Unable to read list of files!" + err,
    });
  }
};

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    console.log("Could not download the file: " + err);

    return res.status(200).send({
      success: false,
      message: "Could not download the file: " + err,
    });
  }
};

const uploadTemp = async (req, res, next) => {
  //Hàm này dành cho upload chưa đăng nhập, đảm bảo userId bằng null để server còn xóa

  try {

    //Xử lý tên file có khoảng trắng
    let filename_for_tempProject = req.filename_for_tempProject;
    filename_for_tempProject = filename_for_tempProject.replaceAll(" ", "-")

    let tempProjectId = parseInt(req.tempProjectId);

    //START UPLOAD
    //   // Create a new blob in the bucket and upload the file data.
    const corsConfiguration = [
      {
        origin: ["http://localhost:3000", "*", "Anonymous"],
        responseHeader: ["Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type", "x-goog-resumable", "X-Requested-With", "Authorization"],
        method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        maxAgeSeconds: 3600000,
      },
    ]; // 1000 hours

    bucket.setCorsConfiguration(corsConfiguration).then((metadata) => {
      console.log("metadata: ", metadata[0].cors);
    });

    const blob = bucket.file(filename_for_tempProject);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on("error", (err) => {
      return res.status(200).send({ success: false, message: err.message });
    });
    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename_for_tempProject}`);
      try {
        // Make the file public
        await bucket.file(filename_for_tempProject).makePublic();
      } catch {
        return res.status(200).send({
          success: false, 
          message: `Uploaded the VIDEO file: ${filename_for_tempProject}, but public access is denied!`,
          videoStorageName: filename_for_tempProject,
        });
      }

      updateTempProject(tempProjectId, publicUrl, filename_for_tempProject, "", "").then((data) => {
        console.log("Uploaded the VIDEO file successfully and save DB with id: " + tempProjectId);

        req.successResult = {
          message: "Uploaded the VIDEO file successfully and save DB with id: " + tempProjectId,
          success: true,
          url: publicUrl,
          videoStorageName: filename_for_tempProject,
          projectId: tempProjectId,
        };

        return next();
      });
    });
    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(`Could not upload the file. Error: ${err}`);

    return res.status(200).send({
      success: false,
      message: `Could not upload the file. Error: ${err}`,
    });
  }
};

const uploadTempWav = async (req, res) => {

};

module.exports = {
  upload,
  getListFiles,
  download,
  uploadTemp,
  uploadTempWav,
};
