const controller = {};
const models = require('../../models');
const Policy = models.Policy;
const userDAO = require('../DAO/userDAO');
const Sequelize = require('sequelize');

controller.getPolicyList = () => {
    return Policy.findAll();
};

controller.getPolicyById = (policyId) => {

    return Policy.findOne({
        where: {id: policyId}
    });
};

controller.createPolicy = (policyInfo) => {
    return Policy.create(policyInfo);
};

controller.deletePolicy = (policyId) => {

    return Policy.destroy({
        where: {id: policyId}
    });
};

controller.updatePolicy = (updateData) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: updateData.policyId}}
        Policy
            .update(updateData, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    })

}

module.exports = controller;