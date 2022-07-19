//defines routes for endpoints that is called from HTTP Client, 
//use controller to handle requests.

const express = require("express");
const router = express.Router();
const fileController = require("../controller/fileController");
const handleAutoGen = require("../controller/autoGenController");
const flaskController = require('../controller/flaskFileController')
const exportController = require('../controller/exportController')
const handleUser = require('../controller/userController')
const handleProject = require('../controller/projectController')
const pricingController = require('../controller/pricingController')
const adminController = require('../controller/adminController')
const processFile = require("../middleware/upload");

let routes = (app) => {
  router.post("/upload/:projectId", processFile, pricingController.handleBillingUploadFileBefore, fileController.upload, pricingController.handleBillingUploadFileAfter);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);
  router.post("/autoGen", pricingController.handleBillingAutoGenBefore, handleAutoGen.handleAutoGen, pricingController.handleBillingAutoGenAfter);
  router.post("/export", exportController.handleExport);

  router.post("/flask/uploadWAVfile/:projectId", flaskController.uploadWAVfile)
  router.get("/flask/downloadWAVfile", flaskController.downloadWAVfile)



  //user work
  router.post("/login", handleUser.handleLogin);
  router.post("/register", handleUser.handleRegister);
  router.post("/logout", handleUser.handleLogout);
  router.get("/login/:userId", handleUser.handleGetUserInfo)


  router.get("/getProjectListOnUserId/:userId", handleProject.handleProjectList)
  router.post("/createNewProject", handleProject.handleCreateNewProject)
  router.delete("/deleteProject/:projectId", handleProject.handleDeleteProject);
  router.post("/saveProjectWork", handleProject.handleSaveProjectWork)
  router.post("/changeProjectName/:projectId", handleProject.handleChangeProjectName)
  //nologin
  router.post("/uploadTemp", processFile, pricingController.handleBillingUploadFileBefore, fileController.uploadTemp, pricingController.handleBillingUploadFileAfter);
  router.post("/uploadTempWav/:projectId", fileController.uploadTempWav);

  //priceplan
  router.post("/purchasePlan", pricingController.purchasePlan);
  router.get('/getPricingPlanInfo/:userId', pricingController.getPricingInfo)
  router.post('/notifyAfterPurchase', pricingController.handlePricingResult)
  router.get('/getPolicyList', pricingController.handleGetPolicyList)

  //admin page
  router.get("/admin/getUserList", adminController.handleGetUserList);
  router.get("/admin/getUserById/:userId", adminController.handleGetUserById);
  router.post("/admin/createUser", adminController.handleCreateUser);
  router.post("/admin/updateUser", adminController.handleUpdateUser);
  router.delete("/admin/deleteUser/:userId", adminController.handleDeleteUser);
  router.put("/admin/lockUser/:userId", adminController.handleLockUser);
  router.put("/admin/unlockUser/:userId", adminController.handleUnlockUser);

  router.get('/admin/getPolicyList', adminController.handleGetPolicyList)

  router.get('/admin/getUPRegisList', adminController.handleGetUPRegisList)

  router.get('/admin/getProjectList', adminController.handleGetProjectList)
  router.get('/admin/getProjectById/:projectId', adminController.handleGetProjectById)
  router.post('/admin/updateProject', adminController.handleUpdateProject)
  router.post('/admin/createProject', adminController.handleCreateProject)
  router.post('/admin/createProjectAfterSignedUrl/:newProjectId', adminController.handleCreateProjectAfterSignedUrl)
  router.delete("/admin/deleteProject/:projectId", adminController.handleDeleteProject);

  //SUPER ADMIN AREA
  router.get('/admin/getAdminList/:adminId', adminController.handleGetAdminList)
  router.get('/admin/getAdminById/:adminId_adminIdQuery', adminController.handleGetAdminById)
  router.post('/admin/updateAdmin/:adminId', adminController.handleUpdateAdmin)
  router.post("/admin/createAdmin/:adminId", adminController.handleCreateAdmin);
  router.delete("/admin/deleteAdmin/:adminId_adminIdQuery", adminController.handleDeleteAdmin);
  router.put("/admin/lockAdmin/:adminId_adminIdQuery", adminController.handleLockAdmin);
  router.put("/admin/unlockAdmin/:adminId_adminIdQuery", adminController.handleUnlockAdmin);

  router.get('/admin/getPolicyById/:adminId_policyIdQuery', adminController.handleGetPolicyById)
  router.post('/admin/updatePolicy/:adminId', adminController.handleUpdatePolicy)
  router.post("/admin/createPolicy/:adminId", adminController.handleCreatePolicy);
  router.delete("/admin/deletePolicy/:adminId_policyIdQuery", adminController.handleDeletePolicy);



  app.use(router);
};
module.exports = routes;