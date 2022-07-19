const projectDAO = require('../DAO/projectDAO');
const userPolicyRegistrationDAO = require("../DAO/userPolicyRegistrationDAO");
const { BUCKET_NAME, KEY_FILE_NAME } = require("../../env");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: KEY_FILE_NAME });
const bucket = storage.bucket(BUCKET_NAME);


//Thiếu implement access token JWT
const handleProjectList = async (req, res) => {
  console.log('projectList nhận được user id: ', req.params.userId);

  //Kiểm tra đã đăng nhập chưa (chưa imple)


  //kiểm tra input hợp lệ
  if ((req.params.userId == null) || isNaN(req.params.userId)) {
    console.log("handleProjectList: invalid input");

    return res.status(200).send({
      success: false,
      message: "invalid input",
    });
  }




  projectDAO
    .getAll(req.params)
    .then(data => {
      let projectList_data = data;
      res.status(200).send({
        success: true,
        projectList: projectList_data,
      });

    })
    .catch((error) => {

      console.log('handleProjectList: ' + error)

      return res.status(200).send({
        success: false,
        message: 'handleProjectList: ' + error,
      });
    });

}

//Thiếu implement access token JWT
const handleCreateNewProject = async (req, res) => {
  console.log('handleCreateNewProject body tôi nhận được: ', req.body);

  let currentUser = req.body


  if (currentUser.userInfo.id == null || isNaN(currentUser.userInfo.id)) {
    console.log('handleCreateNewProject: invalid input');

    return res.status(200).send({
      success: false,
      message: "invalid input",
    });
  }


  projectDAO
    .insertOne(currentUser.userInfo)
    .then(data => {
      console.log("create new success");

      let newProject = data;
      return res.status(200).send({
        success: true,
        newProject: newProject,
      });
    })
    .catch((error) => {

      console.log('handleCreateNewProject: ' + error)

      return res.status(200).send({
        success: false,
        message: 'handleCreateNewProject: ' + error,
      });
    });



}

//Thiếu implement access token JWT
const handleSaveProjectWork = async (req, res) => {

  let currentUser = req.body.currentUser
  let newSubData = req.body.newSubData
  console.log('Saved project work: ', currentUser.currentProject.id);
  console.log('Current Subtitles: ', newSubData);
  

  if (currentUser.currentProject.id == null || isNaN(currentUser.currentProject.id)) {
    console.log('handleSaveProjectWork: invalid input');

    return res.status(200).send({
      success: false,
      message: "invalid input",
    });
  }


  projectDAO
    .update(currentUser.currentProject, newSubData)
    .then(data => {
      console.log("update success: ", data);

      return res.status(200).send({
        success: true,
        message: "update success for id: " + data
      });
    })
    .catch((error) => {

      console.log('handleSaveProjectWork: ' + error)

      return res.status(200).send({
        success: false,
        message: 'handleSaveProjectWork: ' + error,
      });
    });

}

const handleChangeProjectName = async (req, res) => {

  let projectId = parseInt(req.params.projectId)
  let newName = req.body.newName
  console.log('handleChangeProjectName: ', projectId, newName);

  projectDAO
  .changeProjectName(projectId, newName)
  .then(data => {
    console.log("handleChangeProjectName success: ", data);

    return res.status(200).send({
      success: true,
      message: "handleChangeProjectName success",
      projectName: newName
    });
  })
  .catch((error) => {

    console.log('handleChangeProjectName: ' + error)

    return res.status(200).send({
      success: false,
      message: 'handleChangeProjectName: ' + error,
    });
  });
  
}



const handleDeleteProject = async (req, res) => {
  //lấy được tên file rồi xóa trên storage
  //https://googleapis.dev/nodejs/storage/latest/File.html#delete

  //B1: lấy ra project Id -> lấy ra UserId và các tên file
  //B2: xóa video trên storage + videoExport nếu có
  //B3: tiến hành trừ vào UPRegis DB
  //B4: xóa project trong DB

  //B1: lấy ra project Id -> lấy ra UserId và các tên file
  let projectId = req.params.projectId;
  console.log("handleDeleteProject pjId: ", projectId);

  projectDAO
    .getProjectById(projectId)
    .then((project) => {
      if (!project) {
        return res.status(200).send({
          success: false,
          message: "ProjectId not found",
        });
      }

      console.log("project found ", project.dataValues);

      let videoStorageName = project.videoStorageName;
      let exportVideoName = project.exportVideoName;
      let userId = project.userId;

      //cái pj không tính storage cho cái video export, nhưng xóa thì vẫn xóa

      let filesize = 0;
      if (videoStorageName) {
        console.log("prj có video lưu trong DB: ", videoStorageName);

        bucket
          .file(videoStorageName)
          .exists()
          .then((exists) => {

            console.log('Kết quả tìm file input: ', exists);

            if (exists[0] == true) {

              bucket
                .file(videoStorageName)
                .getMetadata()
                .then((metadata) => {
                  console.log("file size MB: ", Math.ceil(metadata[0].size / 1000000));
                  let SrcVideoFileSize = Math.ceil(metadata[0].size / 1000000);
                  let ExportVideoFileSize = 0; //for later dev

                  //B2: delete video trên GCS + videoExport nếu có
                  bucket.file(videoStorageName).delete((data) => {
                    console.log("GCS delete video input res: ", data);

                    //do it async
                    if (exportVideoName) {
                      console.log("prj có exportVideo trong DB: ", exportVideoName);
                      
                      bucket
                        .file(exportVideoName)
                        .exists()
                        .then((exists2) => {

                          console.log('Kết quả tìm file export: ', exists2);

                          if (exists2[0] == true) {
                            bucket.file(exportVideoName).delete((data) => {
                              console.log("GCS delete video export res: ", data);

                              //B3: tiến hành trừ vào UPRegis DB
                              userPolicyRegistrationDAO.updateRecordOnDeleteProject(userId, SrcVideoFileSize, ExportVideoFileSize).then((data) => {
                                //B4: xóa prj
                                projectDAO.deleteProject(projectId).then((data) => {
                                  res.status(200).send({
                                    success: true,
                                    message: "Deleted project w prjId: " + projectId,
                                  });
                                });
                              });



                            });
                          } else {

                            console.log("prj không có video export trên storage");

                            //B3: tiến hành trừ vào UPRegis DB
                            userPolicyRegistrationDAO.updateRecordOnDeleteProject(userId, SrcVideoFileSize, ExportVideoFileSize).then((data) => {
                              //B4: xóa prj
                              projectDAO.deleteProject(projectId).then((data) => {
                                res.status(200).send({
                                  success: true,
                                  message: "Deleted project w prjId: " + projectId,
                                });
                              });
                            });
                          }

                        })
                    }
                    else {

                      console.log('Project không có video export trong DB');
                      
                      //B3: tiến hành trừ vào UPRegis DB
                      userPolicyRegistrationDAO.updateRecordOnDeleteProject(userId, SrcVideoFileSize, ExportVideoFileSize).then((data) => {
                        //B4: xóa prj
                        projectDAO.deleteProject(projectId).then((data) => {
                          res.status(200).send({
                            success: true,
                            message: "Deleted project w prjId: " + projectId,
                          });
                        });
                      });
                    }


                  });
                });
            } else {

              console.log("prj không có video trên storage");
              //chỉ cần xóa project thôi
              projectDAO.deleteProject(projectId).then((data) => {
                res.status(200).send({
                  success: true,
                  message: "Deleted project w prjId: " + projectId,
                });
              });

            }



          })
      }

      else {
        console.log("prj không có video trong DB");
        
        //chỉ cần xóa project thôi
        projectDAO.deleteProject(projectId).then((data) => {
          res.status(200).send({
            success: true,
            message: "Deleted project w prjId: " + projectId,
          });
        });
      }


    })
    .catch((err) => {
      return res.status(200).send({
        success: false,
        message: "Delete failed on project w prjId: " + projectId,
      });
    });
};

//This is for temp uploading
const createTempProject = async () => {
  return new Promise((resolve, reject) => {
    console.log('createTempPrj');

    let anonymousUser = {
      id: null
    }

    projectDAO
      .insertOne(anonymousUser)
      .then(data => resolve(data))
      .catch(error => reject(new Error(error)));


  });
}

const updateTempProject = async (projectId, videoUrl, videoStorageName, audioUrl, audioStorageName) => {
  console.log('updateTempProject nhận được videoUrl, audioUrl: ', videoUrl, audioUrl);
  return new Promise((resolve, reject) => {


    if (projectId == null || isNaN(projectId)) {
      console.log('project id error');
      reject('project id error')
      return null
    }

    if (!videoUrl && !audioUrl) {
      console.log('url error');
      reject('url error')
      return null
    }


    if (videoUrl) {
      projectDAO
        .updateVideoUrl(projectId, videoUrl, videoStorageName)
        .then(data => {
          console.log("update Temp success: ", data);
          return data
        })
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));


    }
    else {
      projectDAO
        .updateAudioUrl(projectId, audioUrl, audioStorageName)
        .then(data => {
          console.log("update Temp success: ", data);
          return data
        })
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
    }


  });
}

const changeUserIdInProject = async (projectId, userId) => {
  console.log('change userId in project id:', projectId, "to", userId);
  return new Promise((resolve, reject) => {


    if (projectId == null || isNaN(projectId)) {
      console.log('project id error');
      reject('project id error')
      return null
    }

    if (userId == null || isNaN(userId)) {
      console.log('user id error');
      reject('user id error')
      return null
    }



    projectDAO
      .updateProjectUserId(projectId, userId)
      .then(data => {
        console.log("change userId success: ", data);
        return data
      })
      .then(data => resolve(data))
      .catch(error => reject(new Error(error)));

  })
}

const checkIfProjectValidAndExists = async (projectId) => {
  console.log('check if project id:', projectId, "valid and exists?");
  return new Promise((resolve, reject) => {


    if (projectId == null || isNaN(projectId) || projectId == '') {
      console.log('project id error: ', projectId)
      return false
    }


    projectDAO
      .getProjectById(projectId)
      .then(data => {
        if (data.length != 0) {
          // console.log("exists id:", data);
          return true;
        }
        else {
          return false;
        }

      })
      .then(data => resolve(data))
      .catch(error => reject(new Error(error)));

  })
}

const deleteNoUserResources = async () => {
  //lấy ra danh sách pj và up có user id null
  //xóa

  //lấy được tên file rồi xóa trên storage
  //https://googleapis.dev/nodejs/storage/latest/File.html#delete

  //B1: lấy ra project Id == null -> lấy ra recordId từ các tên file
  //B2: xóa video trên storage + videoExport nếu có
  //B3: xóa trong UPRegis
  //B4: xóa project trong DB

  //B1: lấy ra project Id -> lấy ra UserId và các tên file
  console.log("deleteNoUserResources: ");

  projectDAO
    .getNullUserIdProjects()
    .then(data => {
      console.log('deleteNoUserResources');

      if (data.length && data.length > 0) {
        //for
        //  Project {dataValues: { id: 49, createdAt: 2022-06-20T08:44:01.122Z, userId: null },
        //kiểm tra quá hạn
        //xóa trên storage
        //xóa UPRges DB
        //xóa Project DB

        for (let i = 0; i < data.length; i++) {
          let projectId = data[i].dataValues.id
          let createdAt = data[i].dataValues.createdAt
          let videoStorageName = data[i].dataValues.videoStorageName


          //24h equal 86,400,000 miliseconds
          if (new Date() - new Date(createdAt) > 86400000) {
            console.log('prj xóa được: ', projectId, ' ', videoStorageName, ' created at: ', createdAt);
            console.log('số giờ đã tồn tại: ', (new Date() - new Date(createdAt)) / 1000 / 3600);

            //format: nouser_recordId_projectId_sample5_10s.mp4
            let recordId = videoStorageName.split('_')[1];   //format: nouser_15_33_sample5_10s.mp4

            if (recordId) //not undefined
            {
              //xóa tài nguyên
              projectDAO
                .getProjectById(projectId)
                .then((project) => {
                  if (!project) {
                    console.log("project not found: ", projectId)
                  }

                  console.log("project found ", project.dataValues);

                  let videoStorageName = project.videoStorageName;
                  let exportVideoName = project.exportVideoName;

                  //cái pj không tính storage cho cái video export, nhưng xóa thì vẫn xóa

                  let filesize = 0;
                  if (videoStorageName) {
                    console.log("prj có video lưu trong DB: ", videoStorageName);

                    bucket
                      .file(videoStorageName)
                      .exists()
                      .then((exists) => {
                        if (exists == true) {
                          bucket
                            .file(videoStorageName)
                            .getMetadata()
                            .then((metadata) => {
                              console.log("file size MB: ", Math.ceil(metadata[0].size / 1000000));
                              let SrcVideoFileSize = Math.ceil(metadata[0].size / 1000000);
                              let ExportVideoFileSize = 0; //for later dev

                              //B2: delete video trên GCS + videoExport nếu có
                              bucket.file(videoStorageName).delete((data) => {
                                console.log("GCS delete res: ", data);

                                //do it async
                                if (exportVideoName) {
                                  console.log("prj có exportVideo trên storage: ", exportVideoName);

                                  bucket
                                    .file(videoStorageName)
                                    .exists()
                                    .then((data) => {
                                      if (data == true)
                                        bucket.file(exportVideoName).delete((data) => {
                                          console.log("GCS delete res: ", data);
                                        });
                                    })
                                }
                              });
                            });
                        }



                      })
                  }

                  //có thể có video trong DB nhưng k có trên storage cũng vào đây

                  console.log("prj không có video trên storage");

                  //chỉ cần xóa project thôi
                  projectDAO.deleteProject(projectId).then((data) => {
                    return res.status(200).send({
                      success: true,
                      message: "Deleted project w prjId: " + projectId,
                    });
                  });

                })
                .catch((err) => {
                  console.log('Delete GCS resource failed on project w prjId: ' + projectId, ' err: ', err);
                });

              //xóa UPRegis record
              userPolicyRegistrationDAO
                .deleteUserPolicyRegisRecordById(recordId)
                .catch((err) => {
                  console.log('Delete UPR record failed on project w prjId: ' + projectId, ' err: ', err);
                });

              //xóa project
              projectDAO
                .deleteProject(projectId)
                .catch((err) => {
                  console.log('Delete Project failed on project w prjId: ' + projectId, ' err: ', err);
                });




            }



          }




        }


      }

    })
}




module.exports = {
  handleProjectList,
  handleCreateNewProject,
  handleSaveProjectWork,
  createTempProject,
  updateTempProject,
  changeUserIdInProject,
  createTempProject,
  checkIfProjectValidAndExists,
  deleteNoUserResources,
  handleDeleteProject,
  handleChangeProjectName
};