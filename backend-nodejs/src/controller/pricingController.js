const userPolicyRegistrationDAO = require("../DAO/userPolicyRegistrationDAO");
const userDAO = require("../DAO/userDAO");
const { createTempUserPolicyRegisRecord } = require("../DAO/userPolicyRegistrationDAO");
const { createTempProject } = require("./projectController");
const ffmpeg = require("fluent-ffmpeg");
const PolicyDAO = require("../DAO/policyDAO");
const { payInMomo } = require('../middleware/momoWallet')


const getPricingInfo = async (req, res) => {
  let userId = req.params.userId;

  console.log("getPricingInfo userId: ", userId);

  if (userId != "nouser") {
    userPolicyRegistrationDAO
      .getRecordByUserId(userId)
      .then((data) => {
        return res.status(200).send({
          success: true,
          pricingInfo: data,
        });
      })
      .catch((err) => {
        console.log("getPricingInfo: " + err);

        return res.status(200).send({
          success: false,
          message: err,
        });
      });
  } else {
    //nologin
    PolicyDAO.getPolicyById(1)
      .then((data) => {
        return res.status(200).send({
          success: true,
          nouser_pricingInfo: data,
        });
      })
      .catch((err) => {
        console.log("getPricingInfo: " + err);

        return res.status(200).send({
          success: false,
          message: err,
        });
      });
  }
};

const handleBillingUploadFileBefore = async (req, res, next) => {
  // Xử lý 2 trường hợp, có đăng nhập (userId có) và không đăng nhập

  if (req.body.userId) {
    // check thông tin đăng nhập (tạm bỏ qua JWT)
    console.log("handleBillingUploadFileBefore nhan duoc userId: ", req.body.userId);

    let userId = req.body.userId;
    let projectId = req.body.projectId;

    //check the file
    if (!req.file) {
      console.log("Please upload a file!");
      return res.status(200).send({ success: false, message: "Please upload a file!" });
    }

    let filesize = Math.ceil(req.file.size / (1024 * 1024));

    // server check policy
    // 	hợp lệ, gọi next() cho up + ghi lại file size để up xong còn billing
    // 	k hợp lệ báo msg faild
    console.log("file size up cua ban la: ", filesize, " MB");

    //giờ làm sao check đc file size với cái policy
    //-> lấy ra policy từ DB
    userPolicyRegistrationDAO
      .getRecordByUserId(userId)
      .then((policyData) => {
        // console.log('MB toi da cua m la: ', policyData);

        //1. check plan còn hạn
        const policyId = policyData.policyId;
        if (policyId != 1) {
          //not free plan
          const purchaseDate = new Date(policyData.purchaseDate);
          const expireDate = new Date(policyData.expireDate);

          if (purchaseDate > expireDate) {
            return res.status(200).send({ success: false, message: "Your plan expired!", popUpUpgrade: true });
          }
        }

        //2. check maxUploadFileSize
        const maxUploadFileSize = policyData.Policy.rule_maxUploadFileSizeMB;
        if (filesize > maxUploadFileSize) {
          return res.status(200).send({ success: false, message: "Your file exceed max upload file size", popUpUpgrade: true });
        }

        //3. check maxStorage
        const currentStorage = policyData.used_StorageMB;
        const maxStorage = policyData.Policy.rule_maxStorageMB;

        if (currentStorage + filesize > maxStorage) {
          return res.status(200).send({ success: false, message: "Your file exceed max storage", popUpUpgrade: true });
        }
        //   console.log('still: ', currentStorage + filesize ,' <= ' ,  maxStorage);

        //4. OK, add metadata for 'process' and 'after'
        req.before_metadata = policyData;
        req.before_filesize = filesize;
        return next();
      })
      .catch((err) => {
        console.log("BillingBeforeUpload Error: " + err);

        return res.status(200).send({ success: false, message: "BillingBeforeUpload Error: " + err });
      });
  } else {
    //no login

    //check the file
    if (!req.file) {
      console.log("Please upload a file!");
      return res.status(200).send({ success: false, message: "Please upload a file!" });
    }

    let filesize = Math.ceil(req.file.size / (1024 * 1024));

    console.log("file size up len cua ban la: ", filesize, " MB");

    //Insert vào db 1 dòng trong bảng project trước để lấy projectId, và tạo fileName_prjId để tí cho public_url luôn
    //Và tạo 1 dòng trong UserPolicyRegis để tính bill cho trường hợp sau này đăng nhập luôn
    createTempProject().then((projectResult) => {
      createTempUserPolicyRegisRecord()
        .then((policyRegisResult) => {
          //FREE PLAN
          let policyRegisId = policyRegisResult.id;
          let projectResultId = projectResult.id;

          //Start checking like login, but use recordId instead of userId
          userPolicyRegistrationDAO.getRecordByRecordId(policyRegisId).then((policyData) => {
            // console.log('MB toi da cua m la: ', policyData);

            //1. check plan còn hạn
            const policyId = policyData.policyId;
            if (policyId != 1) {
              //not free plan
              const purchaseDate = new Date(policyData.purchaseDate);
              const expireDate = new Date(policyData.expireDate);

              if (purchaseDate > expireDate) {
                return res.status(200).send({ success: false, message: "Your plan expired!", popUpUpgrade: true });
              }
            }

            //2. check maxUploadFileSize
            const maxUploadFileSize = policyData.Policy.rule_maxUploadFileSizeMB;
            if (filesize > maxUploadFileSize) {
              return res.status(200).send({ success: false, message: "Your file exceed max upload file size", popUpUpgrade: true });
            }

            //3. check maxStorage
            const currentStorage = policyData.used_StorageMB;
            const maxStorage = policyData.Policy.rule_maxStorageMB;

            if (currentStorage + filesize > maxStorage) {
              return res.status(200).send({ success: false, message: "Your file exceed max storage", popUpUpgrade: true });
            }
            //   console.log('still: ', currentStorage + filesize ,' <= ' ,  maxStorage);

            //4. OK, add metadata for 'process' and 'after'
            req.before_metadata = policyData;
            req.before_filesize = filesize;

            //5. Create Temp UserPolicyRegis -> videoName format = nouser_policyRegisId_projectId_video-original-name
            let filename_constructed = "nouser_" + policyRegisId + "_" + projectResultId + "_" + req.file.originalname;
            req.filename_for_tempProject = filename_constructed;
            req.tempProjectId = projectResultId;

            return next();
          });
        })
        .catch((err) => {
          console.log("BillingBeforeUpload Error: " + err);
          return res.status(200).send({ success: false, message: "BillingBeforeUpload Error: " + err });
        });
    });
  }
};

const handleBillingUploadFileAfter = async (req, res, next) => {
  console.log("after middleware called w filesize: ", req.before_filesize);

  const filesize = req.before_filesize;
  const currentStorage = req.before_metadata.used_StorageMB;
  const total_uploadFileSizeMB = req.before_metadata.total_uploadFileSizeMB;
  const recordId = req.before_metadata.id;

  //cộng vào regis record.
  userPolicyRegistrationDAO
    .update_used_StorageMB(currentStorage + filesize, total_uploadFileSizeMB + filesize, recordId)
    .then((data) => {
      console.log("cập nhật thành công update_used_StorageMB:", req.successResult);
      return res.status(200).send(req.successResult);
    })
    .catch((err) => {
      console.log("failed to bill in After middleware " + err);

      return res.status(200).send({ success: false, message: "failed to bill in After middleware " + err });
    });
};

const handleBillingAutoGenBefore = async (req, res, next) => {
  const currentUser = req.body;
  const videoUrl = currentUser.currentProject.videoUrl;
  const userId = currentUser.userInfo.id;

  ffmpeg.ffprobe(videoUrl, function (err, metadata) {
    if (err) {
      console.log("FFMPEG PROBE: " + err);
      return res.status(200).send({ success: false, message: "FFMPEG PROBE: " + err, popUpUpgrade: true });
    }

    const videoDuration = parseFloat((Math.ceil(metadata.format.duration) / 60).toFixed(2)); //convert s -> mininutes
    console.log("Autogen Before nhan duoc video duration: ", videoDuration);

    if (userId) {
      console.log("Autogen Before nhan duoc user id: ", userId);

      userPolicyRegistrationDAO
        .getRecordByUserId(userId)
        .then((policyData) => {
          // console.log('MB toi da cua m la: ', policyData);

          //1. check plan còn hạn
          const policyId = policyData.policyId;
          if (policyId != 1) {
            //not free plan
            const purchaseDate = new Date(policyData.purchaseDate);
            const expireDate = new Date(policyData.expireDate);

            if (purchaseDate > expireDate) {
              return res.status(200).send({ success: false, message: "Your plan expired!", popUpUpgrade: true });
            }
          }

          //2. check maxAutoSubMinutes
          const currentUsedNumber = policyData.used_AutoSubMinutes;
          const maxNumber = policyData.Policy.rule_maxAutoSubMinutes;

          // console.log('check ở before thông số videoDuration và currentUsedNumber và tổng : ', videoDuration, currentUsedNumber, videoDuration + currentUsedNumber);

          
          if (currentUsedNumber + videoDuration > maxNumber) {
            return res.status(200).send({ success: false, message: "Your plan exceed max auto subtitles minutes", popUpUpgrade: true });
          }

          //3. OK, add metadata for 'process' and 'after'
          req.before_videoDuration = videoDuration;
          req.before_currentUsedNumber = currentUsedNumber;
          req.before_recordId = policyData.id;
          return next();
        })
        .catch((err) => {
          console.log("AutoGenBillingBefore Error: " + err);

          return res.status(200).send({ success: false, message: "AutoGenBillingBefore Error: " + err });
        });
    } else {
      const recordId = currentUser.currentProject.videoStorageName.split("_")[1]; //format: nouser_15_33_sample5_10s.mp4
      console.log("Autogen Before nhan duoc record id: ", recordId);

      userPolicyRegistrationDAO
        .getRecordByRecordId(recordId)
        .then((policyData) => {
          // console.log('MB toi da cua m la: ', policyData);

          //1. check plan còn hạn
          const policyId = policyData.policyId;
          if (policyId != 1) {
            //not free plan
            const purchaseDate = new Date(policyData.purchaseDate);
            const expireDate = new Date(policyData.expireDate);

            if (purchaseDate > expireDate) {
              return res.status(200).send({ success: false, message: "Your plan expired!", popUpUpgrade: true });
            }
          }

          //2. check maxAutoSubMinutes
          const currentUsedNumber = policyData.used_AutoSubMinutes;
          const maxNumber = policyData.Policy.rule_maxAutoSubMinutes;

          if (currentUsedNumber + videoDuration > maxNumber) {
            return res.status(200).send({ success: false, message: "Your plan exceed max auto subtitles minutes", popUpUpgrade: true });
          }

          //3. OK, add metadata for 'process' and 'after'
          req.before_videoDuration = videoDuration;
          req.before_currentUsedNumber = currentUsedNumber;
          req.before_recordId = recordId;
          return next();
        })
        .catch((err) => {
          console.log("AutoGenBillingBefore Error: " + err);

          return res.status(200).send({ success: false, message: "AutoGenBillingBefore Error: " + err });
        });
    }
  });
};

const handleBillingAutoGenAfter = async (req, res, next) => {
  console.log("after middleware called w videoDuration and recordId: ", req.before_videoDuration, req.before_recordId);

  const videoDuration = req.before_videoDuration;
  const currentUsedNumber = req.before_currentUsedNumber;
  const recordId = req.before_recordId;

  // console.log('check thông số videoDuration và currentUsedNumber và tổng : ', videoDuration, currentUsedNumber, videoDuration + currentUsedNumber);
  

  //cộng vào regis record.
  userPolicyRegistrationDAO
    .update_used_AutoSubMinutes(currentUsedNumber + videoDuration, recordId)
    .then((data) => {
      console.log("cập nhật thành công update_used_AutoSubMinutes:", req.successResult);
      return res.status(200).send(req.successResult);
    })
    .catch((err) => {
      console.log("AutoGenBillingAfter Error: " + err);

      return res.status(200).send({ success: false, message: "AutoGenBillingAfter Error: " + err });
    });
};

//Chạy được, nhưng tạm thời chưa dùng tới
const handleBillingExportBefore = async (req, res, next) => {
  const currentUser = req.body;
  const videoUrl = currentUser.currentProject.videoUrl;
  const userId = currentUser.userInfo.id;

  ffmpeg.ffprobe(videoUrl, function (err, metadata) {
    if (err) {
      console.log("FFMPEG PROBE: " + err);
      return res.status(200).send({ success: false, message: "FFMPEG PROBE: " + err, popUpUpgrade: true });
    }

    const videoDuration = parseFloat((Math.ceil(metadata.format.duration) / 60).toFixed(2)); //convert s -> mininutes
    console.log("Export Before nhan duoc video duration: ", videoDuration);

    if (userId) {
      console.log("Export Before nhan duoc user id: ", userId);

      userPolicyRegistrationDAO
        .getRecordByUserId(userId)
        .then((policyData) => {
          // console.log('MB toi da cua m la: ', policyData);

          //1. check plan còn hạn
          const policyId = policyData.policyId;
          if (policyId != 1) {
            //not free plan
            const purchaseDate = new Date(policyData.purchaseDate);
            const expireDate = new Date(policyData.expireDate);

            if (purchaseDate > expireDate) {
              return res.status(200).send({ success: false, message: "Your plan expired!", popUpUpgrade: true });
            }
          }

          //2. check rule_maxVideoExportLengthMinutes
          const maxNumber = policyData.Policy.rule_maxVideoExportLengthMinutes;

          if (videoDuration > maxNumber) {
            return res.status(200).send({ success: false, message: "Your video exceed max export length of your plan", popUpUpgrade: true });
          }

          //3. OK, add metadata for 'process' and 'after'
          req.before_videoDuration = videoDuration;
          req.before_recordId = policyData.id;
          return next();
        })
        .catch((err) => {
          console.log("ExportBillingBefore Error: " + err);

          return res.status(200).send({ success: false, message: "ExportBillingBefore Error: " + err });
        });
    } else {
      const recordId = currentUser.currentProject.videoStorageName.split("_")[1]; //format: nouser_15_33_sample5_10s.mp4
      console.log("Export Before nhan duoc record id: ", recordId);

      userPolicyRegistrationDAO
        .getRecordByRecordId(recordId)
        .then((policyData) => {

          //1. check plan còn hạn
          const policyId = policyData.policyId;
          if (policyId != 1) {
            //not free plan
            const purchaseDate = new Date(policyData.purchaseDate);
            const expireDate = new Date(policyData.expireDate);

            if (purchaseDate > expireDate) {
              return res.status(200).send({ success: false, message: "Your plan expired!", popUpUpgrade: true });
            }
          }

          //2. check rule_maxVideoExportLengthMinutes
          const maxNumber = policyData.Policy.rule_maxVideoExportLengthMinutes;

          if (videoDuration > maxNumber) {
            return res.status(200).send({ success: false, message: "Your video exceed max export length of your plan", popUpUpgrade: true });
          }

          //3. OK, add metadata for 'process' and 'after'
          req.before_videoDuration = videoDuration;
          req.before_recordId = recordId;
          return next();
        })
        .catch((err) => {
          console.log("ExportBillingBefore Error: " + err);

          return res.status(200).send({ success: false, message: "ExportBillingBefore Error: " + err });
        });
    }
  });
};



const purchasePlan = async (req, res) => {
  console.log("purchase plan nhận được: ", req.body);
  const email = req.body.email;
  const cardNumber = req.body.cardNumber;
  const policyId = req.body.policyId;

  //kiểm tra email hợp lệ, tồn tại user co email do
  userDAO.getUserByEmail(email).then((user) => {
    if (user) {
      console.log("Tồn tại user với id: ", user.id);


      //kiểm tra nếu tài khoản là admin / superadmin thì không được đăng kí
      if (user.role != 'user') {
        return res.status(200).send({
          message: "Chỉ được thanh toán cho tài khoản user",
          success: false
        })
      }

      //kiểm tra nếu storage đã có lớn hơn storage chuẩn bị mua thì KHÔNG CHO DOWNGRADE
      // policyId

      // lấy ra user id
      const userId = user.id

      userPolicyRegistrationDAO.getRecordByUserId(userId)
        .then(record => {
          console.log('old max storage: ', record.Policy.rule_maxStorageMB);

          const currentMaxStorage = record.Policy.rule_maxStorageMB

          // lấy được giá tiền (phải làm ở server, k truyền từ client vì có thể bị chỉnh sửa)
          PolicyDAO
            .getPolicyById(policyId)
            .then(data => {

              const newMaxStorage = data.rule_maxStorageMB

              console.log('new max storage: ', newMaxStorage);

              if (newMaxStorage < currentMaxStorage) {  //dấu bằng vẫn được, vì nó reset auto-gen minutes
                return res.status(200).send({
                  message: "Không được mua có dung lượng lưu trữ thấp hơn gói hiện tại",
                  success: false
                })
              }


              //DONE CHECK, CALL MOMO API
              console.log('purchase plan có giá (VND): ', data.dataValues.priceVND);

              const payNumber = data.dataValues.priceVND
              payInMomo(userId, policyId, payNumber, res)


            })
            .catch((err) => {
              console.log("purchasePlan Error: " + err);

              return res.status(200).send({ success: false, message: "purchasePlan Error: " + err });
            });






        })



    } else {
      console.log("NODEJS: User not found");

      return res.status(200).send({
        success: false,
        message: "NODEJS: User not found",
      });
    }
  });


}

const handlePricingResult = async (req, res, next) => {

  // NOTES: This API using IPN mechanism of MOMO wallet, but IPN currently have error, so notify from client instead

  console.log('handlePricingResult: ', req.body.extraData);

  const inputData = req.body.extraData.split('_');
  const userId = inputData[1];
  const policyId = inputData[3];

  //bảng user đâu cần policyId làm gì đâu đúng k? -> bảng đăng kí có là đc
  userPolicyRegistrationDAO
    .insertOnlyOne(userId, policyId)
    .then((data) => {

      console.log("UPR tra ve data: ", data);

      return res.status(200).send({
        success: true,
        message: "Hệ thống lưu giao dịch thành công!",
        regisInfo: data,
      });
    })
    .catch((error) => {
      console.log("Hệ thống lưu giao dịch thất bại: " + error);

      return res.status(200).send({
        success: false,
        message: "Hệ thống lưu giao dịch thất bại: " + error,
      });
    });


};

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


const purchasePlan_depricated = async (req, res) => {
  console.log("purchase plan nhận được: ", req.body);
  const email = req.body.email;
  const cardNumber = req.body.cardNumber;
  const policyId = req.body.policyId;

  //kiểm tra email hợp lệ, tồn tại user co email do
  userDAO.getUserByEmail(email).then((user) => {
    if (user) {
      console.log("Tồn tại user với id: ", user.id);

      //kiểm tra nếu tài khoản là admin / superadmin thì không được đăng kí
      if (user.role != 'user') {
        return res.status(200).send({
          message: "Chỉ được thanh toán cho tài khoản user",
          success: false
        })
      }

      //kiểm tra thẻ hợp lệ (fake)
      // console.log("Thẻ hợp lệ");

      //mua -> cập nhật policyId cho người đó trong DB

      //bảng user đâu cần policyId làm gì đâu đúng k? -> bảng đăng kí có là đc
      userPolicyRegistrationDAO
        .insertOnlyOne(user.id, policyId)
        .then((data) => {
          console.log("UPR tra ve data: ", data);
          return res.status(200).send({
            success: true,
            message: "NODEJS: Thanh toán thành công!",
            regisInfo: data,
          });
        })
        .catch((error) => {
          console.log("NODEJS: Purchase Eror: " + error);

          return res.status(200).send({
            success: false,
            message: "NODEJS: Purchase Eror: " + error,
          });
        });

      //trừ tiền vào thẻ (fake)
    } else {
      console.log("NODEJS: User not found");

      return res.status(200).send({
        success: false,
        message: "NODEJS: User not found",
      });
    }
  });
};



module.exports = {
  purchasePlan,
  getPricingInfo,
  handleBillingUploadFileBefore,
  handleBillingUploadFileAfter,
  handleBillingAutoGenBefore,
  handleBillingAutoGenAfter,
  handlePricingResult,
  handleGetPolicyList,
  handleBillingExportBefore
};
