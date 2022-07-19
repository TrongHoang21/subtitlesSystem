//this controller handle files request from flask server
//because dont understand why put cloud storage in python doesnt work. so. do that here, temporarily


const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: KEY_FILE_NAME });
const bucket = storage.bucket(BUCKET_NAME);
const {updateTempProject, checkIfProjectValidAndExists } = require("./projectController");

const uploadWAVfile = async (req, res) => {
  try {
    await processFile(req, res);
    if (!req.file) {
      console.log('Please upload a file!');
      
      return res.status(200).send({ success: false, message: "Please upload a file!" });
    }

    //Kiểm tra project id có hợp lệ + tồn tại không
    let resultId = req.params.projectId
    checkIfProjectValidAndExists(resultId)
    .then(flag => {
      if(flag == false){
        console.log('checkIfProjectValidAndExists: invalid input');
        
        return res.status(200).send({ 
          success: false,
          message: "invalid input" });
      }

      let filename_w_projectId = resultId + '_' + req.file.originalname;


    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(filename_w_projectId);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on("error", (err) => {
      console.log('uploadWAVfile: ' + err.message);
      
      return res.status(200).send({ 
        success: false, message: err.message });
    });
    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      try {
        // Make the file public
        await bucket.file(filename_w_projectId).makePublic();
      } catch {
        console.log(`Uploaded the file successfully: ${filename_w_projectId}, but public access is denied!`);
        
        return res.status(200).send({
          success: false,
          message:
            `Uploaded the file: ${filename_w_projectId}, but public access is denied!`,
          success: false
        });
      }

      updateTempProject(resultId, "", "", publicUrl, filename_w_projectId)  //same func, different params
      .then(data => {
        console.log("Uploaded the AUDIO file successfully and save DB with id: " + resultId);
        
        return res.status(200).send({
          message: "Uploaded the AUDIO file successfully and save DB with id: " + resultId,
          success: true,
          url: publicUrl,
          audioStorageName: filename_w_projectId,
          projectId: resultId
        });
      })
   
    });
    blobStream.end(req.file.buffer);
  })
    


  } catch (err) {
    console.log( `Could not upload the file, error: ${err}`);
    
    return res.status(200).send({
      success: false,
       message: `Could not upload the file, error: ${err}`,
    });
  }
};


const downloadWAVfile = async (req, res) => {
    try {
      const [metaData] = await bucket.file(req.params.name).getMetadata();
      res.redirect(metaData.mediaLink);
      
    } catch (err) {
      console.log("Could not download the file " + err);
      
    return res.status(200).send({
      success:false,
        message: "Could not download the file " + err,
      });
    }
  };

  module.exports = {
    uploadWAVfile,
    downloadWAVfile,
  };


