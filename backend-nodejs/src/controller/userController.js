const userDAO = require('../DAO/userDAO');
const { changeUserIdInProject } = require('./projectController');
const userPolicyRegistrationDAO = require('../DAO/userPolicyRegistrationDAO')
const { mergePolicyRegisRecordToUser } = require('../DAO/userPolicyRegistrationDAO')

//IMPLEMENT W DATABASE

const handleRegister = async (req, res) => {
  //1. Xử lý req
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  console.log('nhan duoc: ', req.body);


  //2. Check if password confirmed
  if (password != confirmPassword) {
    return res.status(200).send({
      success: false,
      message: "Confirm password does not match!",
      type: 'alert-danger'
    });
  }


  //3. check if username exists
  userDAO
    .getUserByEmail(email)
    .then(user => {
      if (user != null) {
        return res.status(200).send({
          success: false,
          message: `Email ${user.email} exists. Choose another one plz!`,
          type: 'alert-danger'
        });
      }


      //4. create new user
      user = {
        username,
        email,
        password,
        role: "user",
        avaPath: "https://cdn.pixabay.com/photo/2015/10/31/12/32/klee-1015603_1280.jpg",
      }
      return userDAO
        .createUser(user)
        .then(user => {
          //4.1 create a FREE PLAN in registration table (còn dự án đang làm thì để login kiểm tra)
          userPolicyRegistrationDAO
            .insertOnlyOne(user.id, 1)
            .then((data) => {

              //4.2 Trả về kết quả
              return res.status(200).send({
                success: true,
                message: "Register success",
              });


            })


        });
    })
    .catch(error => {
      console.log("Register error: " + error);
      return res.status(200).send({
        success: false,
        message: "Register error: " + error,
      });
    });


}

//Thiếu implement access token JWT
const handleLogin = async (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  let currentProject = req.body.currentProject ? JSON.parse(req.body.currentProject) : { id: '' }
  console.log("login nhận được: ", req.body);



  //check if username exists
  userDAO
    .getUserByEmail(email)
    .then(user => {
      if (user) {
        if (userDAO.comparePassword(password, user.password)) {
          if (user.role != 'locked_user' && user.role != 'locked_admin') {
            //Add new project if req.body has, infact, it's change the userId of the project
            if (currentProject.id) {

              //Merge policy to user if exist userPolicyRegis record, if not, set userId to that record.
              mergePolicyRegisRecordToUser(currentProject, user.id)
                .then(mergeMessage => {
                  console.log('hàm merge trả về kết quả: ', mergeMessage);

                  changeUserIdInProject(currentProject.id, user.id)
                    .then(resultFlag => {

                      return res.status(200).send({
                        success: true,
                        message: "Login success!",
                        userInfo: user,
                        mergeMessage: mergeMessage
                      });
                    })

                })
                .catch((error) => {

                  console.log('handleLogin: ' + error)

                  return res.status(200).send({
                    success: false,
                    message: 'handleLogin: ' + error,
                  });
                });
            }
            else {
              return res.status(200).send({
                success: true,
                message: "Login success!",
                userInfo: user
              });
            }
          }
          else{
            return res.status(200).send({
              success: false,
              message: 'Account Locked. Contact us for more information',
              type: 'alert-danger'
            });
          }

        }
        else {
          return res.status(200).send({
            success: false,
            message: 'Incorrect Password',
            type: 'alert-danger'
          });
        }
      }
      else {
        return res.status(200).send({
          success: false,
          message: 'Email does not exist!',
          type: 'alert-danger'
        });
      }
    })
    .catch((error) => {

      console.log('handleLogin: ' + error)

      return res.status(200).send({
        success: false,
        message: 'handleLogin: ' + error,
      });
    });
};

const handleLogout = async (req, res) => {
  console.log("logout nhận được: ", req.body.userInfo);

  //xử lý JWT, xóa refresh token (chưa implement)


  //trả về kết quả
  return res.status(200).send({
    success: true,
    message: 'NODEJS: log out success',
  });

}

const handleGetUserInfo = async (req, res) => {
  console.log("login get nhận được: ", req.params.userId);
  let userId = req.params.userId

  if (isNaN(userId)) {
    return res.status(200).send({
      success: false,
      message: 'Invalid user id',
    });
  }

  //xử lý JWT, xóa refresh token (chưa implement)
  userDAO
    .getUserByIdNoPassword(userId)
    .then(data => {

      if (data) {
        if (data.role != 'locked_user' && data.role != 'locked_admin') {
          //trả về kết quả
          return res.status(200).send({
            success: true,
            message: 'found user',
            userInfo: data
          });
        
        }
        else{
          return res.status(200).send({
            success: false,
            message: 'Account Locked. Contact us for more information',
          });
        }

      }
      else {
        //trả về kết quả
        return res.status(200).send({
          success: false,
          message: 'No user found',
        });
      }

    })

  return;


}


module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  handleGetUserInfo
};