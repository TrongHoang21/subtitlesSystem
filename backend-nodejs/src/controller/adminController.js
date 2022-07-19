const UserDAO = require("../DAO/userDAO");
const userPolicyRegistrationDAO = require("../DAO/userPolicyRegistrationDAO");
const projectDAO = require("../DAO/projectDAO");
const PolicyDAO = require("../DAO/policyDAO");
const { Storage } = require("@google-cloud/storage");
const { updateTempProject } = require("./projectController");
const { BUCKET_NAME, KEY_FILE_NAME } = require("../../env");
const storage = new Storage({ keyFilename: KEY_FILE_NAME});
const bucket = storage.bucket(BUCKET_NAME);
const { format } = require("util");


//--- USER PART (DONT SEE ADMIN LIST)----

const handleGetUserList = async (req, res) => {
  console.log("handleGetUserList called");

  UserDAO.getUserList()
    .then((data) => {
      console.log('getUserList succeed');
      

      return res.status(200).send({
        success: true,
        message: "getUserList succeed",
        userList: data,
      });
    })
    .catch((err) => {
      console.log("getUserList error: " + err);
      
      return res.status(200).send({
        success: false,
        message: "getUserList error: " + err,
      });
    });
};

const handleGetUserById = async (req, res) => {
  let userId = req.params.userId;
  console.log("handleGetUserById: ", userId);

  UserDAO.getUserById(userId)
    .then((data) => {
      return res.status(200).send({
        success: true,
        message: "getUserById succeed",
        user: data,
      });
    })
    .catch((err) => {
      console.log("getUserList error: " + err);
      
      return res.status(200).send({
        success: false,
        message: "getUserList error: " + err,
      });
    });
};

const handleUpdateUser = async (req, res) => {
  console.log("handleUpdateUser: ", req.body);

  let updateData = req.body;

  UserDAO.updateUser(updateData)
    .then((data) => {
      console.log("updateUser succeed: ", data);

      return res.status(200).send({
        success: true,
        message: "updateUser succeed",
      });
    })
    .catch((err) => {
      console.log("updateUser error: " + err);
      return res.status(200).send({
        success: false,
        message: "updateUser error: " + err,
      });
    });
};

const handleCreateUser = async (req, res) => {
  //1. Xử lý req
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let policyId = req.body.pricingPlanId;

  console.log("admin create user nhan duoc: ", req.body);

  //2. Check if password confirmed
  if (password != confirmPassword) {
    return res.status(200).send({
      success: false,
      message: "Confirm password does not match!",
      type: "alert-danger",
    });
  }

  //3. check if username exists
  UserDAO.getUserByEmail(email)
    .then((user) => {
      if (user != null) {
        return res.status(200).send({
          success: false,
          message: `Email ${user.email} exists. Choose another one plz!`,
          type: "alert-danger",
        });
      }

      //4. create new user
      user = {
        username,
        email,
        password,
        role: "user",
        avaPath: "https://cdn.pixabay.com/photo/2015/10/31/12/32/klee-1015603_1280.jpg",
      };
      return UserDAO.createUser(user).then((user) => {
        //4.1 create a FREE PLAN in registration table (còn dự án đang làm thì để login kiểm tra)
        userPolicyRegistrationDAO.insertOnlyOne(user.id, policyId).then((data) => {
          //4.2 Trả về kết quả
          return res.status(200).send({
            success: true,
            message: "Create success",
          });
        });
      });
    })
    .catch((error) => {
      console.log("Create error: " + error);
      return res.status(200).send({
        success: false,
        message: "Create error: " + error,
      });
    });
};

const handleDeleteUser = async (req, res) => {
  //Delete user + delete UPRegistration + set Project userId = null

  console.log("handleDeleteUser: ", req.params.userId);
  let userId = req.params.userId;

  userPolicyRegistrationDAO
    .deleteUserPolicyRegisRecord(userId)
    .then((data) => {
      projectDAO.setUserIdForProjectToNull(userId).then((data) => {
        UserDAO.deleteUser(userId).then((data) => {
          return res.status(200).send({
            success: true,
            message: "Delete success and set userId = null in Project and UPRegis",
          });
        });
      });
    })
    .catch((err) => {
      console.log("Delete failed: " + err);
      
      return res.status(200).send({
        success: false,
        message: "Delete failed: " + err,
      });
    });
};

const handleLockUser = async (req, res) => {
  console.log("handleLockUser: ", req.params.userId);

  let userId = req.params.userId;

  UserDAO.lockUser(userId)
    .then((data) => {
      console.log("lockUser succeed: ", data);

      return res.status(200).send({
        success: true,
        message: "lockUser succeed",
      });
    })
    .catch((err) => {
      console.log("lockUser error: " + err);
      return res.status(200).send({
        success: false,
        message: "lockUser error: " + err,
      });
    });
}

const handleUnlockUser = async (req, res) => {
  console.log("handleUnlockUser: ", req.params.userId);

  let userId = req.params.userId;

  UserDAO.unlockUser(userId)
    .then((data) => {
      console.log("unlockUser succeed: ", data);

      return res.status(200).send({
        success: true,
        message: "unlockUser succeed",
      });
    })
    .catch((err) => {
      console.log("unlockUser error: " + err);
      return res.status(200).send({
        success: false,
        message: "unlockUser error: " + err,
      });
    });
}

//--- PROJECT PART ---
const handleGetProjectList = async (req, res) => {
  console.log("get project list called");

  projectDAO
    .getProjectList()
    .then((data) => {
      return res.status(200).send({
        success: true,
        projectList: data,
        message: "Project list success: ",
      });
    })
    .catch((err) => {
      console.log("Project list failed: " + err);
      
      return res.status(200).send({
        success: false,
        message: "Project list failed: " + err,
      });
    });
};

const handleGetProjectById = async (req, res) => {
  let projectId = req.params.projectId;
  console.log("handleGetProjectById: ", projectId);

  projectDAO
    .getProjectById(projectId)
    .then((data) => {
      return res.status(200).send({
        success: true,
        message: "handleGetProjectById succeed",
        project: data,
      });
    })
    .catch((err) => {
      console.log("handleGetProjectById error: " + err);
      
      return res.status(200).send({
        success: false,
        message: "handleGetProjectById error: " + err,
      });
    });
};

const handleUpdateProject = async (req, res) => {
  console.log("handleUpdateProject: ", req.body);

  let updateData = req.body;

  if (req.body.id) {
    projectDAO
      .updateProject(updateData)
      .then((data) => {
        console.log("updateProject succeed: ", data);

        return res.status(200).send({
          success: true,
          message: "updateProject succeed",
        });
      })
      .catch((err) => {
        console.log("updateProject error: " + err);

        return res.status(200).send({
          success: false,
          message: "updateProject error: " + err,
        });
      });
  } else {
    console.log("khong tim thay project id");
    return res.status(200).send({
      success: false,
      message: "updateProject error: khong tim thay project id",
    });
  }
};

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

const handleCreateProject = async (req, res) => {
  //lấy các thông tin insert trong DB
  //hàm này trả về signurl để client upload

  console.log("handleCreateProject: ", req.body);
  let userSubmit = req.body;
  let original_filename = userSubmit.filename;
  let filesizeMB = userSubmit.filesizeMB;
  let userId = userSubmit.userId;
  let projectName = userSubmit.projectName
  let subData = userSubmit.subData
  let query = { id: userId, projectName: projectName, subData: subData };

  //1. create project first to get the projectId
  projectDAO
    .insertOne(query)
    .then((data) => {
      console.log("create new prj success: ", data.dataValues);
      let newProject = data;
      let newProjectId = newProject.id;
      let filename_w_projectId = newProjectId + "_" + original_filename;

      //2. Create SignUrl
      // https://github.com/googleapis/nodejs-storage/blob/main/samples/generateV4UploadSignedUrl.js
      const options = {
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      };
      const corsConfiguration = [
        {
          origin: ["http://localhost:3000", "*", "Anonymous"],
          responseHeader: ["Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type", "x-goog-resumable", "X-Requested-With", "Authorization"],
          method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          maxAgeSeconds: 3600000,
        },
      ]; // 1000 hour

      bucket.setCorsConfiguration(corsConfiguration).then((metadata) => {
        console.log("metadata: ", metadata[0].cors);

        // Get a v4 signed URL for uploading file
        bucket
          .file(filename_w_projectId)
          .getSignedUrl(options)
          .then((url) => {
            console.log("Generated PUT signed URL:");
            console.log(url);
            // console.log('You can use this URL with any user agent, for example:');
            // console.log(
            //   "curl -X PUT -H 'Content-Type: application/octet-stream' " +
            //     `--upload-file my-file '${url}'`
            // );

            //3. Trả URL về cho user (khi upload thành công thì báo server để ghi nhận vào UPRegis)
            return res.status(200).send({
              success: true,
              message: "Create SignUrl Success",
              signurl: url,
              newProjectId: newProjectId
            });
          });
      });
    })
    .catch((err) => {
      console.log("Create SignUrl Failed: " + err);
      
      return res.status(200).send({
        success: false,
        message: "Create SignUrl Failed: " + err,
      });
    });
};

//this function to update userpolicyregistration record (Uploaded file size after using sign url)
const handleCreateProjectAfterSignedUrl = async (req, res) => {
  console.log("handleCreateProjectAfterSignedUrl: ", req.body);

  let userSubmit = req.body;
  let userId = userSubmit.userId;
  let recordId = userSubmit.recordId;
  let new_used_StorageMB = userSubmit.new_used_StorageMB;
  let new_total_uploadFileSizeMB = userSubmit.new_total_uploadFileSizeMB;
  let original_filename = userSubmit.filename;
  let newProjectId = req.params.newProjectId;
  let filename_w_projectId = newProjectId + "_" + original_filename;

  console.log('new pj id: ', newProjectId);
  

  //cộng vào regis record.
  userPolicyRegistrationDAO
    .update_used_StorageMB(new_used_StorageMB, new_total_uploadFileSizeMB, recordId)
    .then((data) => {
      console.log("cập nhật thành công update_used_StorageMB cho user:", userId);

      // Create URL for directly file access via HTTP.
      const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${filename_w_projectId}`);
      bucket.file(filename_w_projectId).makePublic();

      updateTempProject(newProjectId, publicUrl, filename_w_projectId, "", "").then((data) => {
        console.log("Uploaded the VIDEO file successfully and save DB with id: " + newProjectId);

        return res.status(200).send({
          message: "Uploaded the VIDEO file successfully and save DB with id: " + newProjectId,
          success: true,
          url: publicUrl,
          videoStorageName: filename_w_projectId,
          projectId: newProjectId,
        });
      });
    })
    .catch((err) => {
      console.log("handleCreateProjectAfterSignedUrl: " + err);
      
      return res.status(200).send({ success: false, message: "handleCreateProjectAfterSignedUrl: " + err });
    });
};

//-- USER POLICY REGISTRATION PART ---

//UPRegis: User policy registration
const handleGetUPRegisList = async (req, res) => {
  userPolicyRegistrationDAO
    .getUPRegisList()
    .then((data) => {
      return res.status(200).send({
        success: true,
        policyList: data,
        message: "UserPolicyRegis list success: ",
      });
    })
    .catch((err) => {
      console.log("UserPolicyRegis list failed: " + err);
      

      return res.status(200).send({
        success: false,
        message: "UserPolicyRegis list failed: " + err,
      });
    });
};

//NO create-update-delete

//POLICY
const handleGetPolicyList = async (req, res) => {
  PolicyDAO.getPolicyList()
    .then((data) => {
      return res.status(200).send({
        success: true,
        policyList: data,
        message: "Policy list success: ",
      });
    })
    .catch((err) => {
      console.log("Policy failed: " + err);
      
      return res.status(200).send({
        success: false,
        message: "Policy failed: " + err,
      });
    });
};

//only super admin can update

//--- SUPER ADMIN PART ---
// HAVE TO CHECK IF SUPER ADMIN BEFORE PROCESSING

const handleGetAdminList = async (req, res) => {
  //có cách nào kiểm tra đây là super admin. (adminId = userId = 4)
  //if role == superadmin là cách đơn giản nhất, bỏ qua JWT xác thực

  console.log("handleGetAdminList : ", req.params.adminId);
  let adminId = req.params.adminId;

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        UserDAO.getAdminList().then((data) => {
          console.log("handleGetAdminList success");

          return res.status(200).send({
            success: true,
            message: "handleGetAdminList success",
            adminList: data,
          });
        });
      } else {
        console.log("not superadmin: request forbiden");

        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleGetAdminList failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleGetAdminList failed" + err,
      });
    });
};

const handleGetAdminById = async (req, res) => {
  console.log("handleGetAdminById : ", req.params.adminId_adminIdQuery);
  let adminIds = req.params.adminId_adminIdQuery;
  let adminId = adminIds.split("_")[0];
  let adminId_query = adminIds.split("_")[1];

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        UserDAO.getAdminById(adminId_query).then((data) => {
          console.log("handleGetAdminById success: ", data.dataValues);

          return res.status(200).send({
            success: true,
            message: "handleGetAdminById success",
            adminInfo: data,
          });
        });
      } else {
        console.log("not superadmin: request forbiden");

        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleGetAdminById failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleGetAdminById failed" + err,
      });
    });
};

const handleUpdateAdmin = async (req, res) => {
  console.log("handleUpdateAdmin : ", req.params.adminId);
  let adminId = req.params.adminId;

  console.log("handleUpdateAdmin body: ", req.body);
  let updateData = req.body;

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        UserDAO.updateUser(updateData).then((data) => {
          console.log("handleUpdateAdmin succeed: ", data);

          return res.status(200).send({
            success: true,
            message: "handleUpdateAdmin succeed",
          });
        });
      } else {
        console.log("not superadmin: request forbiden");

        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleUpdateAdmin failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleUpdateAdmin failed" + err,
      });
    });
};

const handleCreateAdmin = async (req, res) => {
  console.log("handleGetAdminById : ", req.params.adminId);
  let adminId = req.params.adminId;

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role != "superadmin") {
        console.log("not superadmin: request forbiden");
        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }

      console.log("userId is superadmin: ", admin.dataValues);

      //1. Xử lý req
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      console.log("superadmin create admin nhan duoc: ", req.body);

      //2. Check if password confirmed
      if (password != confirmPassword) {
        return res.status(200).send({
          success: false,
          message: "Confirm password does not match!",
          type: "alert-danger",
        });
      }

      //3. check if username exists
      UserDAO.getUserByEmail(email).then((user) => {
        if (user != null) {
          return res.status(200).send({
            success: false,
            message: `Email ${user.email} exists. Choose another one plz!`,
            type: "alert-danger",
          });
        }

        //4. create new user
        user = {
          username,
          email,
          password,
          role: "admin",
          avaPath: "https://avatarfiles.alphacoders.com/198/thumb-198886.jpg",
        };
        return UserDAO.createUser(user).then((user) => {
          return res.status(200).send({
            success: true,
            message: "Create success",
            adminInfo: user,
          });
        });
      });
    })
    .catch((err) => {
      console.log("handleCreateAdmin failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleCreateAdmin failed" + err,
      });
    })

    .catch((error) => {
      console.log("Create error: " + error);
      return res.status(200).send({
        success: false,
        message: "Create error: " + error,
      });
    });
};

const handleDeleteAdmin = async (req, res) => {
  //Delete admin
  console.log("handleDeleteAdmin : ", req.params.adminId_adminIdQuery);
  let adminIds = req.params.adminId_adminIdQuery;
  let adminId = adminIds.split("_")[0];
  let adminId_query = adminIds.split("_")[1];

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        UserDAO.deleteUser(adminId_query).then((data) => {
          console.log("handleDeleteAdmin succeed: ", data);

          return res.status(200).send({
            success: true,
            message: "Delete success",
          });
        });
      } else {
        console.log("not superadmin: request forbiden");
        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleDeleteAdmin failed: " + err);

      return res.status(200).send({
        success: false,
        message: "Delete failed: " + err,
      });
    });
};

const handleLockAdmin = async (req, res) => {
  console.log("handleLockAdmin : ", req.params.adminId_adminIdQuery);
  let adminIds = req.params.adminId_adminIdQuery;
  let adminId = adminIds.split("_")[0];
  let adminId_query = adminIds.split("_")[1];

  UserDAO.getAdminById(adminId)
  .then((admin) => {
    if (admin.role == "superadmin") {
      console.log("userId is superadmin: ", admin.dataValues);

      UserDAO.lockAdmin(adminId_query)
      .then((data) => {
        console.log("handleLockAdmin succeed: ", data);
  
        return res.status(200).send({
          success: true,
          message: "handleLockAdmin succeed",
        });
      })


    } else {
      console.log("not superadmin: request forbiden");

      return res.status(200).send({
        success: false,
        message: "not superadmin: request forbiden",
      });
    }
  })
  .catch((err) => {
    console.log("handleLockAdmin error: " + err);
    return res.status(200).send({
      success: false,
      message: "handleLockAdmin error: " + err,
    });
  });



}

const handleUnlockAdmin = async (req, res) => {
  console.log("handleLockAdmin : ", req.params.adminId_adminIdQuery);
  let adminIds = req.params.adminId_adminIdQuery;
  let adminId = adminIds.split("_")[0];
  let adminId_query = adminIds.split("_")[1];

  UserDAO.getAdminById(adminId)
  .then((admin) => {
    if (admin.role == "superadmin") {
      console.log("userId is superadmin: ", admin.dataValues);

      UserDAO.unlockAdmin(adminId_query)
      .then((data) => {
        console.log("handleUnlockAdmin succeed: ", data);
  
        return res.status(200).send({
          success: true,
          message: "handleUnlockAdmin succeed",
        });
      })


    } else {
      console.log("not superadmin: request forbiden");

      return res.status(200).send({
        success: false,
        message: "not superadmin: request forbiden",
      });
    }
  })
  .catch((err) => {
    console.log("handleUnlockAdmin error: " + err);
    return res.status(200).send({
      success: false,
      message: "handleUnlockAdmin error: " + err,
    });
  });
}

const handleGetPolicyById = async (req, res) => {
  console.log("handleGetPolicyById : ", req.params.adminId_policyIdQuery);
  let adminIds = req.params.adminId_policyIdQuery;
  let adminId = adminIds.split("_")[0];
  let policyId_query = adminIds.split("_")[1];

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        PolicyDAO.getPolicyById(policyId_query).then((data) => {
          console.log("handleGetPolicyById success: ", data.dataValues);

          return res.status(200).send({
            success: true,
            message: "handleGetPolicyById success",
            policyInfo: data.dataValues,
          });
        });
      } else {
        console.log("not superadmin: request forbiden");

        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleGetPolicyById failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleGetPolicyById failed" + err,
      });
    });
};

const handleUpdatePolicy = async (req, res) => {
  console.log("handleUpdatePolicy : ", req.params.adminId);
  let adminId = req.params.adminId;

  console.log("handleUpdatePolicy body: ", req.body);
  let updateData = req.body;

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        PolicyDAO.updatePolicy(updateData).then((data) => {
          console.log("handleUpdatePolicy succeed: ", data);

          return res.status(200).send({
            success: true,
            message: "handleUpdatePolicy succeed",
          });
        });
      } else {
        console.log("not superadmin: request forbiden");

        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleUpdatePolicy failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleUpdatePolicy failed" + err,
      });
    });
};

const handleCreatePolicy = async (req, res) => {
  console.log("handleCreatePolicy : ", req.params.adminId);
  let adminId = req.params.adminId;

  console.log("handleCreatePolicy body: ", req.body);
  let policyInfo = req.body;

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        PolicyDAO.createPolicy(policyInfo).then((data) => {
          console.log("handleCreatePolicy succeed: ", data.dataValues);

          return res.status(200).send({
            success: true,
            message: "handleCreatePolicy succeed",
          });
        });
      } else {
        console.log("not superadmin: request forbiden");

        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleCreatePolicy failed: " + err);

      return res.status(200).send({
        success: false,
        message: "handleCreatePolicy failed" + err,
      });
    });
};

const handleDeletePolicy = async (req, res) => {
  //Delete admin
  console.log("handleDeletePolicy : ", req.params.adminId_policyIdQuery);
  let adminIds = req.params.adminId_policyIdQuery;
  let adminId = adminIds.split("_")[0];
  let policyIdQuery = adminIds.split("_")[1];

  UserDAO.getAdminById(adminId)
    .then((admin) => {
      if (admin.role == "superadmin") {
        console.log("userId is superadmin: ", admin.dataValues);

        PolicyDAO.deletePolicy(policyIdQuery).then((data) => {
          console.log("handleDeletePolicy succeed: ", data);

          return res.status(200).send({
            success: true,
            message: "Delete success",
          });
        });
      } else {
        console.log("not superadmin: request forbiden");
        return res.status(200).send({
          success: false,
          message: "not superadmin: request forbiden",
        });
      }
    })
    .catch((err) => {
      console.log("handleDeletePolicy failed: " + err);

      return res.status(200).send({
        success: false,
        message: "Delete failed: " + err,
      });
    });
};

module.exports = {
  handleGetUserList,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleLockUser,
  handleUnlockUser,

  handleGetPolicyList,

  handleGetUPRegisList,

  handleGetProjectList,
  handleGetProjectById,
  handleUpdateProject,
  handleCreateProject,
  handleCreateProjectAfterSignedUrl,
  handleDeleteProject,

  handleGetAdminList,
  handleGetAdminById,
  handleUpdateAdmin,
  handleDeleteAdmin,
  handleCreateAdmin,
  handleLockAdmin,
  handleUnlockAdmin,

  handleGetPolicyById,
  handleUpdatePolicy,
  handleCreatePolicy,
  handleDeletePolicy,
};
