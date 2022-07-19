const controller = {};
const models = require('../../models');
const User = models.User;
const bcrypjs = require('bcryptjs');

//get username, cause this project username is email
controller.getUserByEmail = (email) => {
    return User.findOne({
        where: {email: email}
    });
};

controller.createUser = (user) => {
    var salt = bcrypjs.genSaltSync(10);
    user.password = bcrypjs.hashSync(user.password, salt);
    return User.create(user);
}

controller.comparePassword = (password, hash) => {
    return bcrypjs.compareSync(password, hash);
};

controller.isLoggedIn = (req, res, next) => {
    // if(req.session.user){
    //     next();
    // }
    // else {
    //     res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    // }
}

//since admin controller
controller.getUserList = () => {
    return User.findAll({
        attributes:['id','username','avaPath','email','role'],
        where:{role:['user', 'locked_user']}
    });
}

controller.getUserById = (userId) => {
    return User.findOne({
        where: {id: userId}
    });
};

controller.getUserByIdNoPassword = (userId) => {
    return User.findOne({
        where: {id: userId},
        attributes: ['avaPath', 'email', 'id', 'role', 'username', 'createdAt', 'updatedAt']
    });
};

controller.updateUser = (updateData) => {
    return new Promise((resolve, reject) => {
    var salt = bcrypjs.genSaltSync(10);
    hashPassword = bcrypjs.hashSync(updateData.password, salt);

    let target = {where: {id: parseInt(updateData.userId)}}
    let options = {}

        options = {
            userId: updateData.userId,
            email: updateData.email,
            username: updateData.username,
            password: hashPassword,
            avaPath: updateData.avaPath
          }
    
    User
        .update(options, target)  
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
})
}

controller.deleteUser = (userId) => {

    return User.destroy({
        where: {id: userId}
    });
};

controller.lockUser = (userId) => {
    return new Promise((resolve, reject) => {


    let target = {where: {id: parseInt(userId)}}
    let options = {}

        options = {
            role: 'locked_user'
          }
    
    User
        .update(options, target)  
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
})
}

controller.unlockUser = (userId) => {
    return new Promise((resolve, reject) => {


    let target = {where: {id: parseInt(userId)}}
    let options = {}

        options = {
            role: 'user'
          }
    
    User
        .update(options, target)  
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
})
}

controller.lockAdmin = (userId) => {
    return new Promise((resolve, reject) => {


    let target = {where: {id: parseInt(userId)}}
    let options = {}

        options = {
            role: 'locked_admin'
          }
    
    User
        .update(options, target)  
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
})
}

controller.unlockAdmin = (userId) => {
    return new Promise((resolve, reject) => {


    let target = {where: {id: parseInt(userId)}}
    let options = {}

        options = {
            role: 'admin'
          }
    
    User
        .update(options, target)  
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
})
}





controller.getAdminList = () => {
    return User.findAll({
        attributes:['id','username','avaPath','email','role'],
        where:{role:['admin', 'locked_admin']}
    });
}

controller.getAdminById = (adminId) => {
    return User.findOne({
        where: {id: adminId}
    });
};

module.exports = controller;
