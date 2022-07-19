//data match with user seeders

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let today = new Date();
    let remainingDays = new Date(new Date().setDate(today.getDate() + 30));

    let data=[ {
      userId: 1,
      policyId: 1,
      purchaseDate: Sequelize.literal('NOW()'),
      expireDate: remainingDays.toUTCString(),
      used_StorageMB: 0,
      used_AutoSubMinutes: 0,
      total_videoExportLengthMinutes: 0,
      total_uploadFileSizeMB: 0,
    },{
      userId: 2,
      policyId: 1,
      purchaseDate: Sequelize.literal('NOW()'),
      expireDate: remainingDays.toUTCString(),
      used_StorageMB: 0,
      used_AutoSubMinutes: 0,
      total_videoExportLengthMinutes: 0,
      total_uploadFileSizeMB: 0,
    },{
      userId: 3,
      policyId: 1,
      purchaseDate: Sequelize.literal('NOW()'),
      expireDate: remainingDays.toUTCString(),
      used_StorageMB: 0,
      used_AutoSubMinutes: 0,
      total_videoExportLengthMinutes: 0,
      total_uploadFileSizeMB: 0,
    }]

     data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
     });
    return queryInterface.bulkInsert('UserPolicyRegistrations', data, {});
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('UserPolicyRegistrations', null, {});
  }
};
