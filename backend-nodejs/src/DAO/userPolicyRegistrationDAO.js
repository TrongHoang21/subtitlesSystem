const controller = {};
const models = require('../../models');
const UserPolicyRegistration = models.UserPolicyRegistration;
const userDAO = require('../DAO/userDAO');
const Sequelize = require('sequelize');
const { Op } = require("sequelize");

//need something ghi đè ở đây-> ktra nếu có đăng kí tồn tại thì update, nếu k thì insert one
controller.insertOnlyOne = (userId, policyId) => {
    return new Promise((resolve, reject) => {

        //if(exists)
            //update
        //else
            //insert
        //tham số truyền vào là email, nên phải làm với bảng user để lấy được user id

        controller
        .getRecordByUserId(userId)
        .then(record => {
            if(record){                    //check if it update on non-exist -> NO
                console.log('Tìm thấy user, update into userId: ', record.userId);

                let today = new Date();
                let remainingDays = new Date(new Date().setDate(today.getDate() + 30));

                let options = {
                    userId: userId,
                    policyId: policyId,
                    purchaseDate: Sequelize.literal('NOW()'),
                    expireDate: remainingDays.toUTCString(),

                    used_AutoSubMinutes: 0, //reset only this props

                };
        
                let target = {where: {userId: userId}}

                UserPolicyRegistration
                .update(options, target)  
                .then((data) => resolve(data))      //resolve(data)
                .catch(error => reject(new Error(error)));


            }
            else{
                // Không tìm thấy user
                console.log('Không tìm thấy user, insert mới');

                let today = new Date();
                let remainingDays = new Date(new Date().setDate(today.getDate() + 30));
                
                let options = {
                    userId: userId,
                    policyId: policyId,
                    purchaseDate: Sequelize.literal('NOW()'),
                    expireDate: remainingDays.toUTCString(),
                    used_StorageMB: 0,
                    used_AutoSubMinutes: 0,
                    total_videoExportLengthMinutes: 0,
                    total_uploadFileSizeMB: 0,
                };
                

                UserPolicyRegistration
                .create(options)  
                .then(data => resolve(data))
                .catch(error => reject(new Error(error)));
            }
        })
        
        



    });
}

controller.getRecordByUserId = (userId) => {
    return UserPolicyRegistration.findOne({
        where: {userId: userId},
        include: [{model: models.Policy}],    
    });
};

controller.getRecordByRecordId = (recordId) => {
    return UserPolicyRegistration.findOne({
        where: {id: recordId},
        include: [{model: models.Policy}],    
    });
};

controller.update_used_StorageMB = (new_usedNumber, new_totalUploadFileSize, recordId) => {
    return new Promise((resolve, reject) => {
    let options = {
        used_StorageMB: new_usedNumber,
        total_uploadFileSizeMB: new_totalUploadFileSize,
    };

    let target = {where: {id: recordId}}

    UserPolicyRegistration
    .update(options, target)  
    .then((data) => resolve(data))      //resolve(data)
    .catch(error => reject(new Error(error)));
})
}

controller.createTempUserPolicyRegisRecord = () => {
    return new Promise((resolve, reject) => {
    let today = new Date();
    let remainingDays = new Date(new Date().setDate(today.getDate() + 30));
    
    let options = {
        userId: null,   //NO LOGIN
        policyId: 1,    //FREE PLAN ONLY
        purchaseDate: Sequelize.literal('NOW()'),
        expireDate: remainingDays.toUTCString(),
        used_StorageMB: 0,
        used_AutoSubMinutes: 0,
        total_videoExportLengthMinutes: 0,
        total_uploadFileSizeMB: 0,
    };
    

    UserPolicyRegistration
    .create(options)  
    .then(data => resolve(data))
    .catch(error => reject(new Error(error)));
    })
}

controller.setUserIdForRecord = (recordId, userId) => {
    return new Promise((resolve, reject) => {
        let options = {
            userId: userId
        };

        let target = {where: {id: recordId}}

        UserPolicyRegistration
        .update(options, target)  
        .then((data) => resolve(data))  
        .catch(error => reject(error))  
    })
}

controller.mergePolicyRegisRecordToUser = (currentProject, userId) => {
    return new Promise((resolve, reject) => {

    //kiểm tra xem, userId đó đã có record trong bảng chưa
    //nếu chưa -> gán userId cho record đó
    //nếu rồi -> tiến hành cộng cái cũ với cái mới
    //xóa cái record vô chủ (ĐỂ SERVER TỰ ĐỘNG XÓA SAU)

    let recordId = currentProject.videoStorageName.split('_')[1];   //format: nouser_15_33_sample5_10s.mp4
    console.log('hàm merge nhận record id: ', recordId);

    controller.getRecordByUserId(userId)
    .then(record => {
        console.log('hàm get record trả về record: ', record);
        if(record){
            //get new record to merge
            controller.getRecordByRecordId(recordId)
            .then(recordNew => {
                
                console.log('hàm get record trả về recordNew: ', recordNew.id);

                let sum_used_StorageMB = record.used_StorageMB + recordNew.used_StorageMB
                let sum_used_AutoSubMinutes = record.used_AutoSubMinutes + recordNew.used_AutoSubMinutes
                let rule_maxStorageMB = record.Policy.rule_maxStorageMB
                let rule_maxAutoSubMinutes = record.Policy.rule_maxAutoSubMinutes

                //within pricing plan limit -> merge
                if(sum_used_StorageMB <= rule_maxStorageMB && sum_used_AutoSubMinutes <= rule_maxAutoSubMinutes){
                    let options = {
                        used_StorageMB: record.used_StorageMB + recordNew.used_StorageMB,
                        used_AutoSubMinutes: record.used_AutoSubMinutes + recordNew.used_AutoSubMinutes,
                        total_videoExportLengthMinutes: record.total_videoExportLengthMinutes + recordNew.total_videoExportLengthMinutes,
                        total_uploadFileSizeMB: record.total_uploadFileSizeMB + recordNew.total_uploadFileSizeMB,
                    };
    
                    let target = {where: {userId: userId}}
    
                    UserPolicyRegistration
                    .update(options, target)  
                    .then((data) => resolve('Merge project to account success!'))  
                }
                else{ //dont merge
                    resolve('Merge project to account failed: Your account hasreached pricing limit')
                }

    
            })

        }
        else{
            //this won't happen, because, user đăng kí là được tạo plan free cho rồi. nhưng để đây phòng hờ sau này cũng đc
            controller.setUserIdForRecord(recordId, userId)
            .then(data => resolve(data))
            
        }
        
    })
    .catch(error => reject(error))

    })
}

controller.update_used_AutoSubMinutes = (new_usedNumber, recordId) => {
    return new Promise((resolve, reject) => {
    let options = {
        used_AutoSubMinutes: new_usedNumber,
    };

    let target = {where: {id: recordId}}

    UserPolicyRegistration
    .update(options, target)  
    .then((data) => resolve(data))      //resolve(data)
    .catch(error => reject(new Error(error)));
})
}

//since admin controller
controller.deleteUserPolicyRegisRecord = (userId) => {
    return new Promise((resolve, reject) => {
        let target = {where: {userId: userId}}

        UserPolicyRegistration
        .destroy(target)  
        .then((data) => resolve(data))  
        .catch(error => reject(error))  
    })
}

controller.deleteUserPolicyRegisRecordById = (recordId) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: recordId}}

        UserPolicyRegistration
        .destroy(target)  
        .then((data) => resolve(data))  
        .catch(error => reject(error))  
    })
}

controller.getUPRegisList = () => {
    return UserPolicyRegistration.findAll({
        include: [models.Policy],
        where:{userId :{ [Op.not]: null}}
    });
}

controller.updateRecordOnDeleteProject = (userId, srcVideoFileSize, exportVideoFileSize) => {
    return new Promise((resolve, reject) => {
        controller.getRecordByUserId(userId)
        .then(data => {

            let new_usedNumber = data.used_StorageMB - srcVideoFileSize

            let options = {
                used_StorageMB: new_usedNumber,
            };
        
            let target = {where: {userId: userId}}

            UserPolicyRegistration
            .update(options, target)  
            .then((data) => resolve(data))      //resolve(data)
            .catch(error => reject(new Error(error)));

        })


    })
}


module.exports = controller;

// Save this for calculation if needed
// const d = new Date(record.updatedAt);
// let year = d.getUTCFullYear();
// console.log('Year :', year);